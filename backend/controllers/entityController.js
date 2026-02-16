import MainEntity from '../models/MainEntity.js';
import Activity from '../models/Activity.js';
import { generateReadmeContent } from '../services/aiService.js';

// Create a new README
export const createReadme = async (req, res) => {
    try {
        const { title, description, techStack, features, isPublic } = req.body;

        // Generate content using AI
        const content = await generateReadmeContent({ title, description, techStack, features });

        const newEntity = new MainEntity({
            user: req.user._id,
            title,
            description,
            content,
            techStack,
            features,
            isPublic
        });

        const savedEntity = await newEntity.save();

        // Log activity
        await Activity.create({
            user: req.user._id,
            action: 'CREATED_README',
            details: `Created README for ${title}`,
            entityId: savedEntity._id
        });

        res.status(201).json(savedEntity);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get all READMEs for a user
export const getUserReadmes = async (req, res) => {
    try {
        const entities = await MainEntity.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(entities);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get a single README
export const getReadmeById = async (req, res) => {
    try {
        const entity = await MainEntity.findById(req.params.id);
        if (!entity) {
            return res.status(404).json({ message: 'README not found' });
        }

        // Check ownership or public access
        if (entity.user.toString() !== req.user._id.toString() && !entity.isPublic) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(entity);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update a README
export const updateReadme = async (req, res) => {
    try {
        const { title, description, content, isPublic, techStack, features, regenerate } = req.body;
        let entity = await MainEntity.findById(req.params.id);

        if (!entity) {
            return res.status(404).json({ message: 'README not found' });
        }

        if (entity.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        entity.title = title || entity.title;
        entity.description = description || entity.description;
        entity.isPublic = isPublic !== undefined ? isPublic : entity.isPublic;
        entity.techStack = techStack || entity.techStack;
        entity.features = features || entity.features;

        // If specific content is provided, use it (manual edit)
        if (content) {
            entity.content = content;
        }
        // Otherwise, if regenerate flag is true, regenerate using AI
        else if (regenerate) {
            const newContent = await generateReadmeContent({
                title: entity.title,
                description: entity.description,
                techStack: entity.techStack,
                features: entity.features
            });
            entity.content = newContent;
        }

        const updatedEntity = await entity.save();

        // Log activity
        await Activity.create({
            user: req.user._id,
            action: 'UPDATED_README',
            details: `Updated README for ${updatedEntity.title}`,
            entityId: updatedEntity._id
        });

        res.json(updatedEntity);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete a README
export const deleteReadme = async (req, res) => {
    try {
        const entity = await MainEntity.findById(req.params.id);

        if (!entity) {
            return res.status(404).json({ message: 'README not found' });
        }

        if (entity.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await entity.deleteOne();

        // Log activity
        await Activity.create({
            user: req.user._id,
            action: 'DELETED_README',
            details: `Deleted README ${entity.title}`,
            entityId: entity._id
        });

        res.json({ message: 'README removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
