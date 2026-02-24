# ai-readme-generator

Instantly generate professional, high-quality READMEs for your projects using AI.

[![npm version](https://img.shields.io/npm/v/ai-readme-generator.svg?style=flat-square)](https://www.npmjs.com/package/ai-readme-generator)
[![License](https://img.shields.io/npm/l/ai-readme-generator.svg?style=flat-square)](https://github.com/your-org/ai-readme-generator/blob/main/LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/your-org/ai-readme-generator/main.yml?branch=main&style=flat-square)](https://github.com/your-org/ai-readme-generator/actions)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/ai-readme-generator?style=flat-square)](https://bundlephobia.com/package/ai-readme-generator)
[![Downloads](https://img.shields.io/npm/dm/ai-readme-generator.svg?style=flat-square)](https://www.npmjs.com/package/ai-readme-generator)
[![GitHub Stars](https://img.shields.io/github/stars/your-org/ai-readme-generator?style=flat-square)](https://github.com/your-org/ai-readme-generator/stargazers)

---

Tired of spending valuable development time crafting comprehensive READMEs? The `ai-readme-generator` is your solution. This powerful **Node.js** library leverages advanced AI to analyze your project's details and automatically generate a structured, professional, and visually appealing `README.md` file. Focus on coding, and let our AI handle the documentation.

## ✨ Features

*   **🤖 AI-Powered Content Generation**: Automatically drafts descriptions, feature lists, installation steps, and usage examples.
*   **📝 Structured Markdown Output**: Generates clean, well-formatted Markdown that adheres to best practices.
*   **🚀 Quick Start Templates**: Provides sensible defaults for common project types, with options for deep customization.
*   **🔧 Tech Stack Analysis**: Intelligently suggests relevant sections based on your project's detected technologies (e.g., Node.js, React, Vue, etc.).
*   **⚡ Extensible & Customizable**: Offers various configuration options to fine-tune the generated content to your specific needs.
*   **🛡️ Error Handling**: Robust error management for reliable README generation.

## 📦 Installation

Install `ai-readme-generator` using your preferred package manager:

**npm**

```bash
npm install ai-readme-generator

**yarn**

```bash
yarn add ai-readme-generator
```

**pnpm**

```bash
pnpm add ai-readme-generator
```

## 🚀 Quick Start

Generate a basic README for your project with just a few lines of code:

```javascript
import { generateReadme } from 'ai-readme-generator';

async function createMyReadme() {
  const readmeContent = await generateReadme({
    projectTitle: 'My Awesome Project',
    projectDescription: 'A groundbreaking new application that does amazing things.',
    techStack: ['Node.js', 'Express', 'MongoDB'],
    keyFeatures: [
      'Real-time data synchronization',
      'Intuitive user interface',
      'Scalable architecture'
    ]
  });

  console.log(readmeContent);
  // You would typically write this content to a README.md file
  // fs.writeFileSync('README.md', readmeContent);
}

createMyReadme();
```

## ⚙️ Usage

The `generateReadme` function is the core of this library, accepting a configuration object to tailor the output.

### Generating a Basic README

Provide the essential details to get a structured README.

```javascript
import { generateReadme } from 'ai-readme-generator';

const basicReadme = await generateReadme({
  projectTitle: 'My CLI Tool',
  projectDescription: 'A command-line interface for managing cloud resources.',
  techStack: ['Node.js', 'Commander.js'],
});

console.log(basicReadme);
```

### Customizing Sections

You can provide more detailed information for specific sections, which the AI will use as a strong basis for its generation.

```javascript
import { generateReadme } from 'ai-readme-generator';

const customizedReadme = await generateReadme({
  projectTitle: 'My Web App',
  projectDescription: 'A dynamic web application for task management.',
  techStack: ['Node.js', 'React', 'TypeScript', 'PostgreSQL'],
  keyFeatures: [
    'User authentication (OAuth2)',
    'Drag-and-drop task reordering',
    'Real-time notifications'
  ],
  installationInstructions: `
    1. Clone the repository: \`git clone https://github.com/my-org/my-web-app.git\`
    2. Install dependencies: \`npm install\`
    3. Set up environment variables (.env file).
    4. Run database migrations: \`npm run migrate\`
    5. Start the development server: \`npm run dev\`
  `,
  usageExamples: [
    {
      title: 'Starting the Server',
      code: 'npm start',
      description: 'Starts the production server on port 3000.'
    },
    {
      title: 'Running Tests',
      code: 'npm test',
      description: 'Executes all unit and integration tests.'
    }
  ]
});

console.log(customizedReadme);
```

### AI Configuration

For more advanced use cases, you can pass an `aiConfig` object to specify things like the AI model, API key, or temperature.

```javascript
import { generateReadme } from 'ai-readme-generator';

const advancedReadme = await generateReadme({
  projectTitle: 'AI Research Project',
  projectDescription: 'Exploring novel neural network architectures.',
  techStack: ['Python', 'TensorFlow', 'Keras'],
  aiConfig: {
    apiKey: process.env.OPENAI_API_KEY, // Or your preferred AI provider
    model: 'gpt-4o',
    temperature: 0.7
  }
});

console.log(advancedReadme);
```

## 🌐 SSR & TypeScript

`ai-readme-generator` is built with **SSR (Server-Side Rendering) compatibility** in mind, ensuring it can be used seamlessly in various Node.js environments, including serverless functions and backend services.

The library is fully written in **TypeScript**, providing robust type definitions for a superior developer experience.

### Exported Types

```typescript
export interface GenerateReadmeOptions {
  projectTitle: string;
  projectDescription: string;
  techStack?: string[];
  keyFeatures?: string[];
  installationInstructions?: string; // Pre-written instructions
  usageExamples?: { title: string; code: string; description?: string }[];
  contributingGuide?: string; // URL or custom text
  license?: string; // e.g., 'MIT', 'Apache-2.0'
  aiConfig?: {
    apiKey: string;
    model?: string; // e.g., 'gpt-3.5-turbo', 'gpt-4o'
    temperature?: number; // 0.0 - 1.0
    // ... other AI provider specific configs
  };
  // More options can be added here for specific sections
  sections?: {
    introduction?: boolean;
    features?: boolean;
    installation?: boolean;
    usage?: boolean;
    apiReference?: boolean;
    contributing?: boolean;
    license?: boolean;
    // ... custom section toggles
  }
}

export type ReadmeContent = string;

export declare function generateReadme(options: GenerateReadmeOptions): Promise<ReadmeContent>;
```

## 🤝 Contributing

We welcome contributions! If you have suggestions for new features, improvements, or bug fixes, please open an issue or submit a pull request.

Please refer to our [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.