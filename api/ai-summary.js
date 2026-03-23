// api/ai-summary.js

// Node.js के लिए 'fetch' को इम्पोर्ट करें। Vercel के रनटाइम में यह अक्सर native रूप से उपलब्ध होता है।
import fetch from 'node-fetch'; 

/**
 * Vercel Serverless Function जो OpenRouter API को सुरक्षित रूप से कॉल करता है।
 *
 * यह फ़ंक्शन Vercel Environment Variable `OPENROUTER_API_KEY` का उपयोग करता है
 * जो सीधे ब्राउज़र में कभी भी उजागर नहीं होता है।
 */
export default async function handler(req, res) {
    // केवल POST अनुरोधों को स्वीकार करें
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed', message: 'Only POST requests are allowed for this endpoint.' });
    }

    const { emailBody } = req.body;

    // सुनिश्चित करें कि request body में emailBody मौजूद है
    if (!emailBody) {
        return res.status(400).json({ error: 'Bad Request', message: 'Missing emailBody in request payload.' });
    }

    // OpenRouter API Key को Vercel Environment Variable से एक्सेस करें
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

    // सुनिश्चित करें कि API Key सेट है
    if (!OPENROUTER_API_KEY) {
        console.error("OPENROUTER_API_KEY environment variable is not set.");
        return res.status(500).json({ error: 'Server Configuration Error', message: 'AI service API key is not configured correctly on the server.' });
    }

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`, // सुरक्षित रूप से सर्वर-साइड पर API Key का उपयोग करें
                "Content-Type": "application/json",
                // "HTTP-Referer" और "X-Title" को यहाँ सर्वर-साइड पर सेट किया जा सकता है।
                // आप चाहें तो client-side referer को भी पास कर सकते हैं, लेकिन सुरक्षा के लिए सीधे server-side से सेट करना बेहतर है।
                "HTTP-Referer": "https://your-mailtick-domain.vercel.app", // अपनी वेबसाइट का वास्तविक डोमेन यहाँ डालें
                "X-Title": "Mailtick Inbox Serverless"
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-120b:free", // AI मॉडल यहाँ तय किया गया है
                messages: [
                    {
                        role: "user",
                        content: `Summarize this email clearly in 3 short bullet points:\n\n${emailBody}`
                    }
                ]
            })
        });
        
        const data = await response.json();
        
        if (response.ok && data.choices && data.choices.length > 0) {
            // AI से मिली समरी को client-side पर वापस भेजें
            return res.status(200).json({ summary: data.choices[0].message.content });
        } else {
            console.error("OpenRouter API Error from Serverless Function:", data);
            return res.status(response.status).json({ error: data.error?.message || 'Failed to get summary from OpenRouter API.', details: data });
        }
    } catch (error) {
        console.error("Error making API call to OpenRouter from Serverless Function:", error);
        return res.status(500).json({ error: 'Internal Server Error', message: 'An unexpected error occurred while processing the AI summary request.' });
    }
}
