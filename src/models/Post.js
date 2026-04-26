const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [3, 'Title must be at least 3 characters']
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        minlength: [10, 'Content must be at least 10 characters']
    },
    // CHANGED: This now points to the User model
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: { type: Number, default: 0 },
    tags: [String]
}, {
    timestamps: true 
});

postSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Post', postSchema);
