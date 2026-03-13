/**
 * @file journal.controller.js
 * @description Handles all journal related operations including
 * creating entries, fetching entries, analyzing text with LLM,
 * and generating user insights.
 */
const Journal = require("../models/journal.model");
const { analyzeEmotion } = require("../services/llm.service");

/**
 * @controller createJournalEntry
 * @description Creates a new journal entry and performs emotion analysis using the LLM service.
 * Stores analysis results such as emotion, keywords, and summary in the database.
 */
async function createJournalEntry(req, res) {
    try {
        const { text, ambience } = req.body;

        const normalizedText = text.trim().toLowerCase();


        if (!text || !ambience) {
            return res.status(400).json({
                message: "Text and ambience are required"
            });
        }

        const userId = req.user.id;

        // create entry with pending analysis
        const journal = await Journal.create({
            userId,
            text: normalizedText,
            ambience,
            analysisStatus: "pending"
        });


        // check if same text already analyzed (cache)
        const cached = await Journal.findOne({
            text: normalizedText,
            analysisStatus: "completed"
        });

        /**
* LLM result caching:
* If the same journal text has already been analyzed,
* reuse the stored emotion analysis instead of calling the LLM again.
* This reduces API cost and improves performance.
*/
        if (cached) {

            journal.emotion = cached.emotion;
            journal.keywords = cached.keywords;
            journal.summary = cached.summary;
            journal.analysisStatus = "completed";

            await journal.save();

        } else {

            try {
                const analysis = await analyzeEmotion(text);

                journal.emotion = analysis.emotion;
                journal.keywords = analysis.keywords;
                journal.summary = analysis.summary;
                journal.analysisStatus = "completed";

                await journal.save();
            } catch (err) {
                console.error("LLM ERROR:", err);
                journal.analysisStatus = "failed";
                await journal.save();
            }
        }

        res.status(201).json({
            message: "Journal entry created",
            journal
        });


    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        })
    }
}

/**
 * @controller getUserJournals
 * @description Retrieves all journal entries created by the authenticated user.
 * Entries are returned in reverse chronological order.
 */
async function getUserJournals(req, res) {
    try {


        const userId = req.user.id;

        const journals = await Journal.find({ userId })
            .sort({ createdAt: -1 });

        res.status(200).json(journals);


    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        })
    }
}

/**
 * @controller analyzeJournal
 * @description Performs LLM emotion analysis on provided text
 * without storing the result in the database.
 */
async function analyzeJournal(req, res) {
    try {


        const { text } = req.body;

        if (!text) {
            return res.status(400).json({
                message: "Text is required"
            });
        }

        const analysis = await analyzeEmotion(text);

        res.status(200).json(analysis);


    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        })
    }
}

/**
 * @controller getInsights
 * @description Generates analytical insights for the authenticated user
 * based on their journal entries including:
 *  - total entries
 *  - most common emotion
 *  - most used ambience
 *  - recent keywords
 */
async function getInsights(req, res) {
    try {

        const userId = req.user.id;

        const journals = await Journal.find({ userId });

        const totalEntries = journals.length;

        if (totalEntries === 0) {
            return res.json({
                totalEntries: 0,
                topEmotion: null,
                mostUsedAmbience: null,
                recentKeywords: []
            });
        }

        const emotionCount = {};
        const ambienceCount = {};
        let keywordList = [];

        journals.forEach(entry => {

            if (entry.emotion) {
                emotionCount[entry.emotion] =
                    (emotionCount[entry.emotion] || 0) + 1;
            }

            if (entry.ambience) {
                ambienceCount[entry.ambience] =
                    (ambienceCount[entry.ambience] || 0) + 1;
            }

            if (entry.keywords) {
                keywordList.push(...entry.keywords);
            }

        });

        const topEmotion =
            Object.keys(emotionCount).length > 0
                ? Object.keys(emotionCount).reduce((a, b) =>
                    emotionCount[a] > emotionCount[b] ? a : b
                )
                : null;

        const mostUsedAmbience =
            Object.keys(ambienceCount).length > 0
                ? Object.keys(ambienceCount).reduce((a, b) =>
                    ambienceCount[a] > ambienceCount[b] ? a : b
                )
                : null;

        /**
         * Keyword analytics:
         * Calculates the most frequently used keywords across
         * all journal entries and returns the top 5 keywords.
         */
        const keywordFrequency = {};

        keywordList.forEach(keyword => {
            keywordFrequency[keyword] =
                (keywordFrequency[keyword] || 0) + 1;
        });

        const recentKeywords = Object.entries(keywordFrequency)
            .sort((a, b) => b[1] - a[1]) // sort by frequency
            .slice(0, 5)
            .map(entry => entry[0]);

        res.json({
            totalEntries,
            topEmotion,
            mostUsedAmbience,
            recentKeywords
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

module.exports = {
    createJournalEntry,
    getUserJournals,
    analyzeJournal,
    getInsights
};
