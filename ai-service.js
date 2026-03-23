// ai-service.js

/**
 * OpenRouter API Key अब इस फ़ाइल में नहीं है।
 * यह Vercel Serverless Function (api/ai-summary.js) द्वारा सुरक्षित रूप से एक्सेस की जाएगी।
 */

/**
 * Vercel Serverless Function के माध्यम से दिए गए ईमेल बॉडी के लिए एक AI समरी प्राप्त करता है।
 * @param {string} emailBody सारांशित करने के लिए ईमेल का सादा टेक्स्ट बॉडी।
 * @returns {Promise<string>} एक वादा जो सारांश टेक्स्ट या एक त्रुटि संदेश पर हल होता है।
 */
export async function getAISummary(emailBody) {
    let summaryText = "";

    try {
        // सीधे OpenRouter को कॉल करने के बजाय, अपने Vercel Serverless Function को कॉल करें।
        const response = await fetch("/api/ai-summary", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ emailBody: emailBody }) // ईमेल बॉडी को सर्वरलेस फंक्शन को भेजें
        });
        
        const data = await response.json();
        
        // सर्वरलेस फंक्शन से प्रतिक्रिया को प्रोसेस करें
        if (response.ok && data.summary) { // सर्वरलेस फंक्शन 'summary' फ़ील्ड के साथ जवाब देगा
            summaryText = data.summary;
        } else {
            summaryText = `AI Summary Error: ${data.error || 'Failed to get summary from server.'}`;
            console.error("AI Service Error:", data);
        }
    } catch (error) {
        summaryText = "Network Error: Could not connect to your AI proxy service. Please check your internet connection.";
        console.error("Fetch to /api/ai-summary Error:", error);
    }
    return summaryText;
}
