export const extractTechStackFromRepo = (files) => {
    const techStack = new Set();
    const fileNames = files.map(f => f.name.toLowerCase());

    if (fileNames.includes('package.json')) {
        techStack.add('Node.js');
        // Ideally we parse package.json content to find react, express, etc.
    }
    if (fileNames.includes('requirements.txt') || fileNames.some(f => f.endsWith('.py'))) techStack.add('Python');
    if (fileNames.includes('pom.xml')) techStack.add('Java');
    if (fileNames.includes('go.mod')) techStack.add('Go');
    if (fileNames.includes('dockerfile')) techStack.add('Docker');
    if (fileNames.some(f => f.endsWith('.ts') || f.endsWith('.tsx'))) techStack.add('TypeScript');
    if (fileNames.some(f => f.endsWith('.jsx'))) techStack.add('React');
    if (fileNames.some(f => f.endsWith('.vue'))) techStack.add('Vue');

    return Array.from(techStack);
};
