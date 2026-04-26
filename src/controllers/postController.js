const Post = require('../models/Post');

// GET all posts (with search, sort, and pagination)
exports.getAllPosts = async (req, res, next) => {
    try {
        const { author, search, sort, page = 1, limit = 10 } = req.query;
        
        let query = {};
        
        if (author) {
            query.author = new RegExp(author, 'i');
        }
        
        if (search) {
            query.$text = { $search: search };
        }
        
        // Sorting
        let sortOption = { createdAt: -1 }; 
        if (sort === 'oldest') sortOption = { createdAt: 1 };
        else if (sort === 'popular') sortOption = { likes: -1 };
        
        // Pagination
        const skip = (page - 1) * limit;
        
        const posts = await Post.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit));
        
        const total = await Post.countDocuments(query);
        
        res.json({
            count: posts.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: posts
        });
    } catch (error) {
        next(error);
    }
};

// GET a single post
exports.getPostById = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.json(post);
    } catch (error) {
        next(error);
    }
};

// CREATE a post
exports.createPost = async (req, res, next) => {
    try {
        const post = new Post(req.body);
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ errors: messages });
        }
        next(error);
    }
};

// UPDATE a post
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

// DELETE a post
exports.deletePost = async (req, res, next) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
