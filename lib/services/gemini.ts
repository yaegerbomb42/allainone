// import { GoogleGenerativeAI } from '@google/generative-ai'; // Unused

import logger from './logger';

export class GeminiService {
    private apiKey: string | null = null;
    private modelName: string = 'gemini-1.5-flash';
    private endpoint: string;

    constructor() {
        this.endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent`;
    }

    setApiKey(apiKey: string) {
        this.apiKey = apiKey;
    }

    async initialize(apiKey: string) {
        if (!apiKey) {
            throw new Error('API key is required');
        }
        this.apiKey = apiKey;

        // Test the API key to ensure it's valid
        try {
            await this.generateContent('Hello');
            return true;
        } catch (_error) { // eslint-disable-line @typescript-eslint/no-unused-vars
            this.apiKey = null;
            throw new Error('Invalid API key provided');
        }
    }

    initializeFromSettings(settings: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        const apiKey = settings?.geminiApiKey;
        if (!apiKey) {
            logger.warn('No Gemini API key found in settings');
            return false;
        }

        this.setApiKey(apiKey);
        return true;
    }

    async generateContent(prompt: string, customApiKey: string | null = null): Promise<string> {
        const apiKey = customApiKey || this.apiKey;
        if (!apiKey) {
            throw new Error('Gemini service not initialized. Please set your API key.');
        }

        const body = JSON.stringify({
            contents: [
                {
                    parts: [
                        { text: prompt }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 8192,
            }
        });

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

            const response = await fetch(`${this.endpoint}?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));

                if (response.status === 429) {
                    throw new Error('Rate limit exceeded. Please wait a moment and try again.');
                } else if (response.status === 401 || response.status === 403) {
                    throw new Error('Invalid API key. Please check your Gemini API key in Settings.');
                } else if (response.status >= 500) {
                    throw new Error('Gemini service is temporarily unavailable. Please try again later.');
                } else {
                    throw new Error(`Gemini API error: ${errorData.error?.message || 'Unknown error'}`);
                }
            }

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!text) {
                throw new Error('Received empty response from Gemini. Please try rephrasing your request.');
            }

            return text;
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            if (error.name === 'AbortError') {
                throw new Error('Request timed out. Please try a shorter or simpler request.');
            }
            if (error.message.includes('Failed to fetch')) {
                throw new Error('Network error. Please check your internet connection.');
            }
            throw error;
        }
    }

    async generateResponse(userMessage: string, context: any, _capabilities: any = {}) { // eslint-disable-line @typescript-eslint/no-explicit-any
        if (!this.apiKey) {
            throw new Error('Gemini service not initialized. Please set your API key.');
        }

        const systemPrompt = this.buildSystemPrompt(context, _capabilities);
        const fullPrompt = `${systemPrompt}\n\nUser: ${userMessage}\n\nDrift:`;

        try {
            const text = await this.generateContent(fullPrompt);

            // Parse actions from the response
            const actions = this.parseActions(text);

            // Clean the message by removing action blocks
            const cleanMessage = text
                .replace(/===ACTION===[\s\S]*?===END_ACTION===/g, '')
                .replace(/\[ACTION\][\s\S]*?\[\/ACTION\]/g, '')
                .trim();

            // Extract suggestions from the response
            const suggestions = this.extractSuggestions(cleanMessage);

            return {
                message: cleanMessage || text || "I'm here to help! How can I assist you with your goals today?",
                actions: actions,
                suggestions: suggestions,
            };
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            logger.error('Error generating response:', error);
            if (error.message.includes('API key')) {
                throw new Error('Please check your Gemini API key in Settings.');
            }
            throw new Error('I encountered an issue generating a response. Please try again.');
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    buildSystemPrompt(context: any, _capabilities: any) {
        const basePrompt = `You are Drift, a helpful AI assistant for goal achievement and productivity.

User Context:
- Name: ${context?.user?.name || 'User'}
- Current Goals: ${context?.currentGoals?.length || 0} active goals
- Conversation History: ${context?.conversationHistory?.length || 0} previous messages
- Recent Activity: ${context?.recentActivity ? JSON.stringify(context.recentActivity).substring(0, 200) : 'None'}
- User Patterns: ${context?.userPatterns ? Object.keys(context.userPatterns).join(', ') : 'None'}

Available Actions:`;

        let actionsPrompt = "";
        // Simplified actions prompt for now
        actionsPrompt += `
- NAVIGATE: To send user to specific page, use: [ACTION]{"type": "navigate_to", "data": {"path": "/goals-dashboard|/habits|/meals|/day|/analytics-dashboard"}}[/ACTION]`;

        const instructionsPrompt = `
Instructions:
1. Keep responses conversational and friendly
2. Be practical and actionable
3. Always explain what you're doing when taking actions
4. Respond naturally first, then add appropriate actions if needed.`;

        return basePrompt + actionsPrompt + instructionsPrompt;
    }

    parseActions(responseText: string) {
        const actions = [];

        // Look for [ACTION] blocks
        // Using [\s\S] instead of . to match newlines, avoiding s flag for ES2018 compatibility
        const actionMatches = responseText.match(/\[ACTION\]([\s\S]*?)\[\/ACTION\]/g);
        if (actionMatches) {
            for (const match of actionMatches) {
                try {
                    const jsonStr = match.replace(/\[ACTION\]|\[\/ACTION\]/g, '').trim();
                    const actionData = JSON.parse(jsonStr);

                    if (actionData.type === 'show_goal_ui' || actionData.type === 'show_habit_ui') {
                        actionData.isUI = true;
                    }

                    actions.push(actionData);
                } catch (parseError) {
                    logger.warn('Could not parse action:', parseError);
                }
            }
        }

        return actions;
    }

    extractSuggestions(message: string) {
        const suggestions: string[] = [];
        // Basic extraction logic
        if (message.includes('Would you like me to')) {
            // ... simplified
        }
        return suggestions;
    }
}

const geminiService = new GeminiService();
export { geminiService };
