import Post from '../models/Post.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

export const createPost = async (req, res) => {
    try {
        const { text, media } = req.body; // media is array of {url, type}
        if (!text && (!media || media.length === 0)) {
            return res.status(400).json({ error: "Post must have text or media" });
        }

        const newPost = new Post({
            user: req.user._id,
            text,
            media
        });

        await newPost.save();
        const populatedPost = await newPost.populate({ path: 'user', select: '-password' });
        res.status(201).json(populatedPost);
    } catch (error) {
        console.log("Error in createPost controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "You are not authorized to delete this post" });
        }

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.log("Error in deletePost controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const likeUnlikePost = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id: postId } = req.params;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const userLikedPost = post.likes.includes(userId);

        if (userLikedPost) {
            // Unlike post
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            res.status(200).json({ message: "Post unliked successfully" });
        } else {
            // Like post
            post.likes.push(userId);
            await post.save();

            const notification = new Notification({
                type: "like",
                user: post.user,
                triggeredBy: userId,
                post: post._id
            });
            await notification.save();

            res.status(200).json({ message: "Post liked successfully" });
        }
    } catch (error) {
        console.log("Error in likeUnlikePost controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate({ path: "user", select: "-password" });

        res.status(200).json(posts);
    } catch (error) {
        console.log("Error in getAllPosts controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const following = user.following;

        const feedPosts = await Post.find({ user: { $in: following } })
            .sort({ createdAt: -1 })
            .populate({ path: "user", select: "-password" });

        res.status(200).json(feedPosts);
    } catch (error) {
        console.log("Error in getFollowingPosts controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
