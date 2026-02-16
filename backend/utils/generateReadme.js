export const buildMarkdown = (data) => {
    const { title, description, features, techStack, installation, usage } = data;

    let markdown = `# ${title}\n\n`;
    if (description) markdown += `${description}\n\n`;

    markdown += `## Table of Contents\n\n`;
    markdown += `- [Features](#features)\n`;
    markdown += `- [Tech Stack](#tech-stack)\n`;
    markdown += `- [Installation](#installation)\n`;
    markdown += `- [Usage](#usage)\n\n`;

    if (features && features.length > 0) {
        markdown += `## Features\n\n`;
        features.forEach(feature => {
            markdown += `- ${feature}\n`;
        });
        markdown += `\n`;
    }

    if (techStack && techStack.length > 0) {
        markdown += `## Tech Stack\n\n`;
        techStack.forEach(tech => {
            markdown += `- ${tech}\n`;
        });
        markdown += `\n`;
    }

    if (installation) markdown += `## Installation\n\n\`\`\`bash\n${installation}\n\`\`\`\n\n`;
    if (usage) markdown += `## Usage\n\n\`\`\`bash\n${usage}\n\`\`\`\n\n`;

    return markdown;
};
