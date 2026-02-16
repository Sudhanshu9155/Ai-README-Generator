import { generateChatResponse } from '../services/aiService.js';

export const chatWithAI = async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ 
                success: false,
                message: 'Messages array with at least one message is required' 
            });
        }

        // Validate that each message has content
        for (const msg of messages) {
            if (!msg.content && !msg.text) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Each message must have content or text field' 
                });
            }
        }

        const response = await generateChatResponse(messages);

        res.json({
            success: true,
            role: 'model',
            content: response
        });
    } catch (error) {
        console.error('Chat API Error:', error.message);
        
        // Check if API key is missing
        if (!process.env.GEMINI_API_KEY) {
            return res.status(503).json({ 
                success: false,
                message: 'AI service not configured. Please add GEMINI_API_KEY to .env file.',
                error: 'MISSING_API_KEY'
            });
        }

        res.status(500).json({ 
            success: false,
            message: error.message || 'Failed to generate response',
            error: 'AI_GENERATION_FAILED'
        });
    }
};
