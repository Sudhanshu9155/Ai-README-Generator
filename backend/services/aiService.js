import axios from 'axios';

export const generateReadmeContent = async (projectDetails) => {
    try {
        const { title, description, techStack, features } = projectDetails;

        // Construct the prompt
        const prompt = `Generate a modern, high-quality, and professional README.md for a project with these details:
        Project Title: ${title}
        Description: ${description}
        Tech Stack: ${techStack.join(', ')}
        Key Features: ${features.join(', ')}

        The README must follow this exact structural pattern:
        1. **Header**: 
           - Project Title (H1)
           - A short, catchy description line
           - A row of 5-6 status badges (use shields.io placeholders for npm version, license, build status, bundle size, etc.)
        2. **Intro Paragraph**: A concise overview of what the project solves.
        3. **Features Section**: A list of key features, each starting with a relevant emoji (e.g., 🚀, 🛡️, 📦, ⚡).
        4. **Installation Section**: Provide installation commands for npm, yarn, and pnpm in separate code blocks.
        5. **Quick Start**: A clear "Hello World" or basic import/usage code example.
        6. **Usage/Hooks Section (if applicable)**: Break down the main functionality with sub-headings, showing short code snippets for each.
        7. **SSR & TypeScript**: Explicitly mention SSR compatibility and TypeScript support with a sample of exported types/interfaces.
        8. **Contributing & License**: Standard sections at the end.

        Aesthetics Matter: Use clean spacing, bold highlights for key terms, and professional formatting. Format in strict Markdown.`;

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

        const generatedText = response.data.candidates[0].content.parts[0].text;

        // Strip leading/trailing markdown code block markers if present
        return generatedText
            .replace(/^```(?:markdown|md)?\n/i, '')
            .replace(/\n```$/m, '')
            .trim();

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
