# System Architecture: NatureJournal

## 1. System Overview
The **NatureJournal** platform follows a classic decoupled client-server architecture consisting of a React frontend and an Express/Node.js backend. The backend manages persistence using MongoDB and leverages the Groq API for Large Language Model (LLM) text analysis and emotional insight generation.

### High-Level Diagram

```text
       ┌──────────────┐
       │     User     │
       └──────┬───────┘
              │ 1. Interacts via UI
              ▼
┌─────────────────────────────┐
│       React Frontend        │
│  (Vite, Tailwind, Framer)   │
└─────────────┬───────────────┘
              │ 2. Axios HTTP Requests (REST JSON)
              │    + Credentials (HTTP-only cookies)
              ▼
┌─────────────────────────────┐           ┌───────────────────┐
│     Express API (Node.js)   ├──────────►│ LLM Service (Groq)│
│  Controllers, Routing, Auth │ 3. Prompt │ Llama-3 Analysis  │
└─────────────┬───────────────┘           └───────────────────┘
              │ 4. Mongoose ODM Queries
              ▼
┌─────────────────────────────┐
│      MongoDB Database       │
│  Users, Journals, Metrics   │
└─────────────────────────────┘
```

## 2. Component Layout & Data Flows

### Authentication Flow
1. User provides credentials to `/auth/login` or `/auth/register`.
2. Controller `auth.controller.js` validates the input and creates/finds the user (hashing pass via `bcryptjs`).
3. Backend generates a JSON Web Token (`jsonwebtoken`) containing the user's ID.
4. The JWT is stored in an **HTTP-only, strictly-scoped cookie**, ensuring protection against Cross-Site Scripting (XSS).
5. All subsequent protected requests (`/api/journal/*`) intercept the cookie via `authMiddleware.js`, decode the JWT, and attach the `user` to the request pipeline.
6. The `POST /api/auth/logout` endpoint invalidates the session by clearing the browser cookie.

### Journal Creation & LLM Analysis Flow
1. User types their nature experience and clicks "Analyze Emotion".
2. Frontend calls `POST /api/journal/analyze`.
3. Backend forwards the text to Groq API with a structured prompt requesting JSON output (Emotion, Keywords, Summary).
4. Groq returns a structured response.
5. Frontend displays the analysis to the user.
6. User clicks "Save", triggering `POST /api/journal`.
7. Backend inserts the `text`, `ambience`, `emotion`, `summary`, and `keywords` into MongoDB (linked to the authenticated user ID).

### Insights Generation (Aggregation)
1. Frontend requests `GET /api/journal/insights`.
2. Backend runs a MongoDB **Aggregation Pipeline** to calculate:
   - Total Entries (`$count`)
   - Top Emotion (Group by emotion, sort desc)
   - Most Used Ambience (Group by ambience, sort desc)
   - Top Keywords ($unwind keywords, group, sort)
3. The aggregated statistics are returned for the Dashboard components.

---

## 3. Production Scaling Strategy (100k+ Users)

To scale the platform smoothly past 100,000 active users, the current monolithic API should evolve using the following strategies:

### A. Compute & Traffic Distribution
- **Load Balancers:** Introduce NGINX or AWS Application Load Balancer (ALB) to distribute incoming HTTP traffic.
- **Horizontal Pod Autoscaling:** Deploy the Express API in a Kubernetes (K8s) cluster or AWS ECS. Replicate the Node.js containers dynamically based on CPU/RAM usage.

### B. Asynchronous LLM Processing
- **Background Workers:** Synchronous LLM API calls tie up Node.js thread loops and HTTP connections. For scale, switch to an Event-Driven model:
  1. Frontend submits journal to Express.
  2. Express pushes a job to a **Message Queue** (e.g., Redis + BullMQ, RabbitMQ, or AWS SQS) and returns `202 Accepted`.
  3. Separate "Worker" services pull from the queue, contact Groq, and update the Database.
  4. The Frontend polls for results or receives a WebSocket/Server-Sent Events (SSE) notification when the analysis is ready.

### C. Database Scaling
- **Replica Sets:** Deploy MongoDB in a Replica Set for High Availability and separate Read/Write workloads (e.g., direct GET requests to Read Replicas).
- **Indexing:** Ensure indexes are optimally created on `user` references and timestamps, and use materialized views if aggregations become overly complex.

---

## 4. Reducing LLM Operational Costs

Running LLM analysis at scale can be expensive. We can reduce costs by:
- **Smaller, Specialized Models:** For simple emotion extraction, avoid massive models (like Llama 70B). Use highly specialized, faster models (e.g., Llama-3 8B or Mixtral 8x7B) which cost significantly less per token while maintaining accuracy for this domain.
- **LLM Response Caching:** Hash the input text (or use fuzzy matching/embeddings search) and store the results in Redis. If a user inputs a very short or generic phrase ("I walked by the ocean"), return the cached emotion profile rather than hitting the LLM API.
- **Batch Processing:** Combine multiple user journals into a single prompt payload during off-peak hours (if real-time analysis is not strictly enforced).
- **Prompt Engineering:** Refine the prompt to minimize token usage (both input and expected output). Outputting strict, small JSON objects saves output tokens.

---

## 5. System Caching Strategy

- **Database Aggregation Cache:** The `/insights` endpoint runs heavy aggregation pipelines. Using **Redis**, we can cache the result of this pipeline for each user (e.g., `insights:{userId}`).
  - **Invalidation Strategy:** Clear or increment the cache key *only* when the user successfully creates or deletes a new journal entry.
- **Static Assets:** Serve the bundled Vite frontend files directly from a Content Delivery Network (CDN) like AWS CloudFront or Cloudflare.

---

## 6. Security & Hardening

- **JWT via Cookies:** Tokens are deliberately kept out of `localStorage` to avoid XSS token theft. `SameSite=Strict` and `Secure` attributes must be enforced in environments running HTTPS.
- **CORS Protection:** Configured to strictly accept traffic only from `http://localhost:5173` (or the production frontend URL), blocking unauthorized domain requests.
- **Rate Limiting:** Protect the LLM wrapper `POST /api/journal/analyze` endpoint aggressively (e.g., `express-rate-limit`) to prevent abuse and API bankruptcy.
- **Request Sanitization:** Prevent NoSQL injection by using validation libraries (Zod/Joi) and Mongoose's strict schema enforcement.
- **Environment Management:** Never commit `.env` files. Secrets (JWT, DB URL, APIs) must be injected via secure Vaults or CI/CD variable secrets in production.
