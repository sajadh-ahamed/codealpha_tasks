import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, // User receiving the notification
        ref: 'User',
        required: true
    },
    triggeredBy: {
        type: mongoose.Schema.Types.ObjectId, // User who triggered the action
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['like', 'comment', 'follow', 'mention', 'message'],
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId, // Optional reference if applicable
        ref: 'Post'
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
