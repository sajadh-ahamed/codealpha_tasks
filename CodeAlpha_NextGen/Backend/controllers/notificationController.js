import Notification from '../models/Notification.js';

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        const notifications = await Notification.find({ user: userId })
            .populate({
                path: 'triggeredBy',
                select: 'username profilePic'
            })
            .sort({ createdAt: -1 });

        await Notification.updateMany({ user: userId }, { read: true });

        res.status(200).json(notifications);
    } catch (error) {
        console.log("Error in getNotifications function", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        await Notification.deleteMany({ user: userId });

        res.status(200).json({ message: "Notifications deleted successfully" });
    } catch (error) {
        console.log("Error in deleteNotifications function", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
