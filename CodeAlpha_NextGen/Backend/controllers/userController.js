import User from '../models/User.js';
import Notification from '../models/Notification.js';

export const getUserProfile = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username }).select("-password");

        if (!user) return res.status(404).json({ error: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getUserProfile: ", error.message);
        res.status(500).json({ error: error.message });
    }
};

export const followUnfollowUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if (id === req.user._id.toString()) {
            return res.status(400).json({ error: "You cannot follow/unfollow yourself" });
        }

        if (!userToModify || !currentUser) {
            return res.status(400).json({ error: "User not found" });
        }

        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {
            // Unfollow
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            res.status(200).json({ message: "User unfollowed successfully" });
        } else {
            // Follow
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

            // Send notification
            const newNotification = new Notification({
                type: "follow",
                user: id,
                triggeredBy: req.user._id
            });
            await newNotification.save();

            res.status(200).json({ message: "User followed successfully" });
        }
    } catch (error) {
        console.log("Error in followUnfollowUser: ", error.message);
        res.status(500).json({ error: error.message });
    }
};

export const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id;

        // Get users we do NOT already follow and are not ourselves
        const usersFollowedByMe = await User.findById(userId).select("following");
        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: userId }
                }
            },
            { $sample: { size: 10 } }
        ]);

        const followingIds = new Set(usersFollowedByMe.following.map(id => id.toString()));
        const filteredUsers = users.filter(user => !followingIds.has(user._id.toString()));
        const suggestedUsers = filteredUsers.slice(0, 4);

        // Don't send passwords
        suggestedUsers.forEach(user => delete user.password);

        res.status(200).json(suggestedUsers);
    } catch (error) {
        console.log("Error in getSuggestedUsers: ", error.message);
        res.status(500).json({ error: error.message });
    }
};

export const updateUser = async (req, res) => {
    const { username, email, bio } = req.body;
    let { profilePic, coverPic } = req.body;

    const userId = req.user._id;

    try {
        let user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (username && username !== user.username) {
            const existingUsername = await User.findOne({ username });
            if (existingUsername) {
                return res.status(400).json({ error: "Username is already taken" });
            }
        }

        if (email && email !== user.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ error: "Invalid email format" });
            }

            const existingEmail = await User.findOne({ email: email.toLowerCase() });
            if (existingEmail) {
                return res.status(400).json({ error: "Email is already taken" });
            }
        }

        // Handling image uploads gracefully handles in further versions
        user.username = username || user.username;
        user.email = email ? email.toLowerCase() : user.email;
        user.bio = bio || user.bio;
        user.profilePic = profilePic || user.profilePic;
        user.coverPic = coverPic || user.coverPic;

        user = await user.save();
        user.password = null; // hide password in response

        return res.status(200).json(user);
    } catch (error) {
        console.log("Error in updateUser: ", error.message);
        res.status(500).json({ error: error.message });
    }
};
