const Post = require('../models/Post');

// Get all posts with optional search/filter
exports.getAllPosts = async (req, res, next) => {
    try {
        const { author, search } = req.query;
        let query = {};

        if (author) query.author = new RegExp(author, 'i');
        if (search) query.$text = { $search: search };

        const posts = await Post.find(query).sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        next(error);
    }
};

// Create a new post
exports.createPost = async (req, res, next) => {
    try {
        const post = new Post(req.body);
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ errors: Object.values(error.errors).map(e => e.message) });
        }
        next(error);
    }
};

// Update a post
exports.updatePost = async (req, res, next) => {
    try {
        const post = await Post.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.json(post);
    } catch (error) {
        next(error);
    }
};

// Delete a post
exports.deletePost = async (req, res, next) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
