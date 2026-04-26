const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');
const { protect } = require('../middleware/auth'); // Import the bouncer

// Public routes (Everyone can see)
router.get('/', postsController.getAllPosts);
router.get('/:id', postsController.getPostById);

// Protected routes (Login required)
router.post('/', protect, postsController.createPost);
router.put('/:id', protect, postsController.updatePost);
router.delete('/:id', protect, postsController.deletePost);

module.exports = router;
