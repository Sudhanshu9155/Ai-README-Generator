import axios from 'axios';

export const generateReadmeContent = async (projectDetails) => {
    try {
        const { title, description, techStack, features } = projectDetails;

        // Construct the prompt
                const prompt = `Generate a professional README.md content for a project with the following details:
        Project Title: ${title}
        Description: ${description}
        Tech Stack: ${techStack.join(', ')}
        Key Features: ${features.join(', ')}

        The README should include:
        - Title and Description
        - Table of Contents
        - Installation Instructions
        - Usage Guide
        - Features List
        - Tech Stack
        - Contributing Guidelines
        - License

        Format the output in strict Markdown.`;

        // Check for API Key
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            // Mock response if no key provided
            return `# ${title}\n\n${description}\n\n## Features\n${features.map(f => `- ${f}`).join('\n')}\n\n## Tech Stack\n${techStack.map(t => `- ${t}`).join('\n')}\n\n*(Note: Configure GEMINI_API_KEY in .env for AI generation)*`;
        }

        // Call Google Gemini API
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;
        const response = await axios.post(url, {
            contents: [{
                role: 'user',
                parts: [{ text: prompt }]
            }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 4096
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': apiKey
            },
            params: {
                key: apiKey
            }
        });

        if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            throw new Error('Invalid response format from API');
        }

        return response.data.candidates[0].content.parts[0].text;

    } catch (error) {
        console.error('AI Generation Error:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        throw new Error(`Failed to generate README content: ${error.message}`);
    }
};

export const generateChatResponse = async (messages) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return "I can help you create a README. Please configure your GEMINI_API_KEY in the backend .env file to enable real AI responses. For now, I can tell you that a good README needs a Title, Description, Installation, and Usage section.";
        }

        // Validate messages array
        if (!Array.isArray(messages) || messages.length === 0) {
            throw new Error('Invalid messages format');
        }

        // Convert messages to Gemini format
        // Gemini API expects: { contents: [{ role: 'user' | 'model', parts: [{ text: '...' }] }, ...] }
        const geminiContents = messages.map(msg => {
            let role = 'user';
            let content = msg.content || msg.text || '';

            if (msg.role === 'ai' || msg.role === 'model' || msg.role === 'assistant') {
                role = 'model';
            }

            return {
                role: role,
                parts: [{ text: String(content).trim() }]
            };
        });

        // Ensure last message is from user
        if (geminiContents.length > 0 && geminiContents[geminiContents.length - 1].role !== 'user') {
            throw new Error('Last message must be from user');
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;

        const response = await axios.post(url,
            {
                contents: geminiContents,
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 2048
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': apiKey
                },
                params: {
                    key: apiKey
                }
            }
        );

        if (!response.data || !response.data.candidates || response.data.candidates.length === 0) {
            console.warn('No candidates in response:', response.data);
            return "I couldn't generate a response. Please try again.";
        }

        const candidate = response.data.candidates[0];
        if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
            console.warn('No content parts in candidate:', candidate);
            return "I couldn't generate a response. Please try again.";
        }

        return candidate.content.parts[0].text;

    } catch (error) {
        console.error('AI Chat Error Details:', {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data
        });
        throw new Error(`Failed to generate chat response: ${error.response?.data?.error?.message || error.message}`);
    }
};
