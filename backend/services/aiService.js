import axios from 'axios';

export const generateReadmeContent = async (projectDetails) => {
    try {
        const { title, description, techStack, features } = projectDetails;

        // Construct the prompt
        // const prompt = `Generate a modern, high-quality, and professional README.md for a project with these details:
        // Project Title: ${title}
        // Description: ${description}
        // Tech Stack: ${techStack.join(', ')}
        // Key Features: ${features.join(', ')}

        // Critical accuracy rules:
        // - Use ONLY the provided tech stack and features as source of truth.
        // - Do NOT invent frameworks, databases, or architecture details that are not listed.
        // - If React, Node.js, MongoDB, SSR, or TypeScript are not present in the tech stack, do not claim them.
        // - Keep installation and usage commands aligned with the detected stack.

        // The README must follow this structural pattern:
        // 1. **Header**:
        //    - Project Title (H1)
        //    - A short, catchy description line
        //    - A row of 5-6 status badges (use stack-appropriate shields.io placeholders)
        // 2. **Intro Paragraph**: A concise overview of what the project solves.
        // 3. **Features Section**: A list of key features, each starting with a relevant emoji.
        // 4. **Installation Section**: Provide stack-appropriate commands only (npm/yarn/pnpm for Node, composer for PHP, pip for Python, etc.).
        // 5. **Quick Start**: A clear basic usage example matching the tech stack.
        // 6. **Usage Section**: Break down the main functionality with sub-headings and short snippets.
        // 7. **Contributing & License**: Standard sections at the end.

        // Aesthetics matter: use clean spacing, bold highlights for key terms, and professional formatting. Format in strict Markdown.`;

        const prompt = `You are an expert technical writer. Generate a modern, high-quality, and professional README.md for a software project based on the following details:

Project Title: {title}
Description: {description}
Tech Stack: {techStack} (comma-separated list of languages, frameworks, tools)
Key Features: {features} (comma-separated list of features)

Critical accuracy rules:
- Use ONLY the provided tech stack and features as source of truth. Do not invent any technologies, dependencies, or features not listed.
- Infer the project type (e.g., web application, library, CLI tool, API, mobile app) from the tech stack and description, and tailor the README sections accordingly.
- For installation and usage commands, determine the appropriate package manager or build tool based on the tech stack (e.g., npm/yarn/pnpm for Node.js, pip for Python, composer for PHP, cargo for Rust, go mod for Go, mvn/gradle for Java, gem for Ruby, etc.). If the stack includes multiple possibilities, choose the most common one or provide options.
- Do not assume any specific architecture (e.g., SSR, database) unless explicitly mentioned in the tech stack or description.

The README must follow this structural pattern, but adapt sections as needed for the project type:

1. **Header**:
   - Project Title as H1
   - A short, catchy description line (can be derived from the provided description)
   - A row of 5-6 status badges using stack-appropriate shields.io placeholders (e.g., build status, license, version, code coverage, etc.). Use generic placeholders like "[build-status]" or stack-specific ones if known.

2. **Introduction**: A concise overview (1-2 paragraphs) explaining what the project does, the problem it solves, and its main value proposition. Tailor this to the project type.

3. **Features**: A bulleted list of the key features, each starting with a relevant emoji. If appropriate, group features into categories.

4. **Installation**: Step-by-step instructions for installing the project or its dependencies. Use stack-appropriate commands. Include prerequisites if necessary (e.g., Node.js version, Python version). For libraries, focus on how to add it as a dependency. For applications, explain how to set up locally.

5. **Quick Start / Basic Usage**: Provide a minimal, self-contained example that demonstrates the core functionality. This could be a code snippet, a command-line invocation, or a simple usage scenario. Ensure it aligns with the tech stack.

6. **Usage / API Reference**: Break down the main functionality with sub-headings and short snippets. For libraries, document the main functions/classes. For applications, explain common use cases, configuration options, or commands. Include code examples where relevant.

7. **Contributing**: Standard guidelines for how others can contribute (e.g., fork, branch, pull request, code style). Keep it concise but welcoming.

8. **License**: State the license (if known, otherwise use a placeholder like "[MIT](LICENSE)"). Include a link to the license file if applicable.

Aesthetics matter: use clean spacing, bold highlights for key terms, and professional formatting. Format the output in strict Markdown. Ensure the README is well-organized, easy to scan, and visually appealing.`

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
