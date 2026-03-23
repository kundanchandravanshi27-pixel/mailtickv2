// ai-service.js

/**
 * IMPORTANT SECURITY NOTE:
 * This API key is still exposed to anyone who inspects the client-side code
 * (e.g., in browser developer tools). For true security, you must use a
 * server-side proxy to make API calls to OpenRouter.
 */

// ✨ OPENROUTER API KEY (Encoded using Base64)
// Please replace "WUFITV9BUElfS0VZX0RBTExP" with your *actual* Base64 encoded OpenRouter API key.
// Example: If your key is "sk-12345", you would encode it to "c2stMTIzNDU=" and use atob("c2stMTIzNDU=").
const OPENROUTER_API_KEY = atob("WUFITV9BUElfS0VZX0RBTExP"); 

/**
 * Fetches an AI summary for the given email body using the OpenRouter API.
 * @param {string} emailBody The plain text body of the email to summarize.
 * @returns {Promise<string>} A promise that resolves to the summary text or an error message.
 */
export async function getAISummary(emailBody) {
    let summaryText = "";
    const currentModel = "openai/gpt-oss-120b:free"; // You can change this if needed

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": window.location.href, // Required for OpenRouter
                "X-Title": "Mailtick Inbox"           // Required for OpenRouter
            },
            body: JSON.stringify({
                model: currentModel,
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
            summaryText = data.choices[0].message.content;
        } else {
            summaryText = `AI Summary Error: ${data.error?.message || 'Failed to process summary. Please try again.'}`;
            console.error("OpenRouter API Error:", data);
        }
    } catch (error) {
        summaryText = "Network Error: Could not connect to AI service. Please check your internet connection.";
        console.error("OpenRouter Fetch Error:", error);
    }
    return summaryText;
}
