'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

interface ActionData {
    type: string;
    data: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

interface AIResponse {
    message: string;
    actions: ActionData[];
    suggestions: string[];
}

export async function generateAIResponse(
    apiKey: string,
    userMessage: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context: any,
    images: string[] = [] // Array of base64 strings
): Promise<AIResponse> {
    if (!apiKey) {
        throw new Error('API Key is required');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const systemPrompt = `You are Drift, a helpful AI assistant for goal achievement and productivity.
  
User Context:
- Name: ${context?.user?.name || 'User'}
- Current Goals: ${context?.currentGoals?.length || 0} active goals
- Conversation History: ${JSON.stringify(context?.conversationHistory || []).substring(0, 1000)}

Instructions:
1. Keep responses conversational and friendly
2. Be practical and actionable
3. Always explain what you're doing when taking actions
4. Respond naturally first, then add appropriate actions if needed.
5. If images are provided, analyze them to help the user.

Available Actions format: [ACTION]{"type": "navigate_to", "data": {"path": "/goals"}}[/ACTION]
`;

    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: systemPrompt }]
            },
            {
                role: "model",
                parts: [{ text: "Understood. I am Drift, ready to help." }]
            }
        ],
        generationConfig: {
            maxOutputTokens: 1000,
        },
    });

    try {
        let result;
        if (images.length > 0) {
            // If images are present, we construct a multipart message
            // Note: chat.sendMessage can take an array of parts
            const imageParts = images.map(img => ({
                inlineData: {
                    data: img.split(',')[1], // Remove type prefix if present
                    mimeType: img.substring(img.indexOf(':') + 1, img.indexOf(';'))
                }
            }));
            result = await chat.sendMessage([userMessage, ...imageParts]);
        } else {
            result = await chat.sendMessage(userMessage);
        }
        const response = result.response;
        const text = response.text();

        // Parse Actions
        const actions: ActionData[] = [];
        const actionMatches = text.match(/\[ACTION\]([\s\S]*?)\[\/ACTION\]/g);

        if (actionMatches) {
            for (const match of actionMatches) {
                try {
                    const jsonStr = match.replace(/\[ACTION\]|\[\/ACTION\]/g, '').trim();
                    const actionData = JSON.parse(jsonStr);
                    actions.push(actionData);
                } catch (e) {
                    console.error("Failed to parse action json", e);
                }
            }
        }

        const cleanMessage = text
            .replace(/===ACTION===[\s\S]*?===END_ACTION===/g, '')
            .replace(/\[ACTION\][\s\S]*?\[\/ACTION\]/g, '')
            .trim();

        return {
            message: cleanMessage,
            actions,
            suggestions: [], // Todo: implement suggestion extraction if needed
        };
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        console.error("Gemini Server Action Error:", error);
        throw new Error(error.message || 'Failed to generate response');
    }
}
