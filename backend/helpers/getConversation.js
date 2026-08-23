const { ConversationModel } = require("../models/ConversationModel");

const getConversation = async (currentUserId, onlineUsers = new Set()) => {
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

        const senderId = conv.sender?._id;
        const receiverId = conv.receiver?._id;

        if (lastMsg && senderId && receiverId) {
            const isLastMsgFromCurrentUser = lastMsg.msgByUserId && lastMsg.msgByUserId.toString() === currentUserId.toString();
            
            if (isLastMsgFromCurrentUser) {
                // Current user is sender
                const isReceiverOnline = onlineUsers.has(receiverId.toString());
                if (isReceiverOnline) {
                    tickStatus = "double";
                    if (lastMsg.seen) {
                        tickStatus = "blue";
                    }
                }
            }
            // Count unseen only for receiver
            if (!isLastMsgFromCurrentUser && !lastMsg.seen) {
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
