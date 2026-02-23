import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        trim: true,
        maxLength: 500
    },
    media: [{
        url: String,
        type: { type: String, enum: ['image', 'video'] }
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    pinned: {
        type: Boolean,
        default: false
    },
    hashtags: [{
        type: String
    }]
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);
export default Post;
