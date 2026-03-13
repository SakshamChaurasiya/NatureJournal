/**
 * @file llm.service.js
 * @description Handles interaction with the Groq LLM API
 * to perform emotion analysis on journal entries.
 */
const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

/**
 * @file llm.service.js
 * @description Handles interaction with the Groq LLM API
 * to perform emotion analysis on journal entries.
 */
async function analyzeEmotion(text) {
    const prompt = `


Analyze the emotional tone of the following journal entry.

Return ONLY valid JSON in this format:

{
"emotion": "...",
"keywords": ["..."],
"summary": "..."
}

Journal text:
${text}
`;


    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: prompt
            }
        ],
        model: "llama-3.1-8b-instant",
        temperature: 0.2
    });

    const responseText = completion.choices[0].message.content;

    try {
        const jsonStart = responseText.indexOf("{");
        const jsonEnd = responseText.lastIndexOf("}") + 1;

        const cleanJSON = responseText.slice(jsonStart, jsonEnd);
        return JSON.parse(cleanJSON);
    } catch (err) {
        throw new Error("Invalid JSON returned from LLM");
    }


}

module.exports = { analyzeEmotion };
