const { ConversationModel } = require("../models/ConversationModel");

const getConversation = async (currentUserId) => {
    if (!currentUserId) return [];

    const currentUserConversation = await ConversationModel.find({
        "$or": [
            { sender: currentUserId },
            { receiver: currentUserId }
        ]
    })
        .populate('messages')
        .populate('sender')
        .populate('receiver')
        .sort({ updatedAt: -1 });

    const conversation = currentUserConversation.map((conv) => {
        const lastMsg = conv.messages[conv.messages.length - 1];
        let countUnseenMsg = 0;
        let tickStatus = "single"; // default

        if (lastMsg) {
            // Determine tick status
            if (lastMsg.msgByUserId.toString() === currentUserId.toString()) {
                // Current user is sender
                if (conv.receiver.online) {
                    tickStatus = "double";
                    if (lastMsg.seen) {
                        tickStatus = "blue";
                    }
                }
            }
            // Count unseen only for receiver
            if (lastMsg.msgByUserId.toString() !== currentUserId.toString() && !lastMsg.seen) {
                countUnseenMsg += 1;
            }
        }

        return {
            _id: conv._id,
            sender: conv.sender,
            receiver: conv.receiver,
            unseenMsg: countUnseenMsg,
            lastMsg,
            tickStatus
        };
    });

    return conversation;
};

module.exports = getConversation;
