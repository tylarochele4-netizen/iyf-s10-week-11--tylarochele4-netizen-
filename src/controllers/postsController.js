const Post = require('../models/Post');

exports.getAllPosts = async (req, res, next) => {
    try {
        const { author, search, sort, page = 1, limit = 10 } = req.query;
        let query = {};
        if (author) query.author = author;
        if (search) query.$text = { $search: search };

        let sortOption = { createdAt: -1 };
        if (sort === 'oldest') sortOption = { createdAt: 1 };
        if (sort === 'popular') sortOption = { likes: -1 };

        const skip = (page - 1) * limit;

        // .populate('author', 'username') adds the username to the response
        const posts = await Post.find(query)
            .populate('author', 'username') 
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Post.countDocuments(query);
        res.json({ count: posts.length, total, page: parseInt(page), data: posts });
    } catch (error) { next(error); }
};

exports.getPostById = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'username');
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.json(post);
    } catch (error) { next(error); }
};

exports.createPost = async (req, res, next) => {
    try {
        // Automatically set the author from the logged-in user's ID
        const post = new Post({
            ...req.body,
            author: req.user._id 
        });
        await post.save();
        res.status(201).json(post);
    } catch (error) { next(error); }
};

exports.updatePost = async (req, res, next) => {
    try {
        let post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        // CHECK OWNERSHIP: Is the logged-in user the author?
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'You can only edit your own posts' });
        }

        post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.json(post);
    } catch (error) { next(error); }
};

exports.deletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        // CHECK OWNERSHIP
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'You can only delete your own posts' });
        }

        await post.deleteOne();
        res.status(204).send();
    } catch (error) { next(error); }
};
