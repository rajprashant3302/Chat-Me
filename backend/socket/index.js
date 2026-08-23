const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken')
const UserModel = require('../models/UserModel')
const { ConversationModel, MessageModel } = require('../models/ConversationModel')
const getConversation = require('../helpers/getConversation')


app = express()


// Socket connection 
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
})

//online user
const onlineUser = new Set()

//connected
io.on('connection', async (socket) => {
    try {
        const token = socket.handshake.auth.token || ""

        // current user details
        const user = await getUserDetailsFromToken(token)

        if (!user || !user._id) {
            console.warn("Rejecting socket connection: Invalid token or user not found.")
            socket.disconnect(true)
            return
        }

        const userIdString = user._id.toString()

        //create a room
        socket.join(userIdString)
        onlineUser.add(userIdString)

        io.emit('onlineUser', Array.from(onlineUser))

        socket.on('message-page', async (userId) => {
            try {
                if (!userId) return;
                const userDetails = await UserModel.findById(userId).select("-password");

                const payload = {
                    _id: userDetails?._id,
                    name: userDetails?.name,
                    email: userDetails?.email,
                    profile_pic: userDetails?.profile_pic,
                    online: onlineUser.has(userId)
                }

                socket.emit('message-user', payload)

                // get previous message
                const getConversationMessage = await ConversationModel.findOne({
                    "$or": [
                        { sender: userIdString, receiver: userId },
                        { sender: userId, receiver: userIdString }
                    ]
                }).populate('messages').sort({ updatedAt: -1 })
                
                socket.emit('message', getConversationMessage?.messages || [])
            } catch (err) {
                console.error("Error in message-page event handler:", err)
            }
        })

        // new message 
        socket.on('new-message', async (data) => {
            try {
                if (!data || !data.sender || !data.receiver) {
                    console.warn("Ignoring invalid new-message payload:", data)
                    return
                }

                // check conversation is available or not 
                let conversation = await ConversationModel.findOne({
                    "$or": [
                        { sender: data?.sender, receiver: data?.receiver },
                        { sender: data?.receiver, receiver: data?.sender }
                    ]
                })

                if (!conversation) {
                    const createConversation = new ConversationModel({
                        sender: data?.sender,
                        receiver: data?.receiver
                    })
                    conversation = await createConversation.save()
                }

                const message = new MessageModel({
                    text: data?.text,
                    image: data?.image,
                    video: data?.video,
                    msgByUserId: data?.msgByUserId,
                    clientMessageId: data?.clientMessageId || ""
                })

                const saveMessage = await message.save()
                await ConversationModel.updateOne({ _id: conversation._id }, {
                    "$push": { "messages": saveMessage?._id }
                })

                const getConversationMessage = await ConversationModel.findOne({
                    "$or": [
                        { sender: data?.sender, receiver: data?.receiver },
                        { sender: data?.receiver, receiver: data?.sender }
                    ]
                }).populate('messages').sort({ updatedAt: -1 })

                const messagesList = getConversationMessage?.messages || []

                io.to(data?.sender).emit('message', messagesList)
                io.to(data?.receiver).emit('message', messagesList)

                //send conversation
                const conversationSender = await getConversation(data?.sender, onlineUser)
                const conversationReceiver = await getConversation(data?.receiver, onlineUser)

                io.to(data?.sender).emit('conversation', conversationSender || [])
                io.to(data?.receiver).emit('conversation', conversationReceiver || [])
            } catch (err) {
                console.error("Error in new-message event handler:", err)
            }
        })

        // sidebar
        socket.on('sidebar', async (currentUserId) => {
            try {
                if (!currentUserId) return;
                const conversation = await getConversation(currentUserId, onlineUser)
                socket.emit('conversation', conversation)
            } catch (err) {
                console.error("Error in sidebar event handler:", err)
            }
        })

        //seen 
        socket.on('seen', async (msgByUserId) => {
            try {
                if (!msgByUserId) return;
                const conversation = await ConversationModel.findOne({
                    "$or": [
                        { sender: userIdString, receiver: msgByUserId },
                        { sender: msgByUserId, receiver: userIdString }
                    ]
                })
                
                if (!conversation) return;
                const conversationMessageId = conversation?.messages || []

                await MessageModel.updateMany(
                    { _id: { "$in": conversationMessageId }, msgByUserId: msgByUserId },
                    { "$set": { seen: true } }
                )

                //send conversation
                const conversationSender = await getConversation(userIdString, onlineUser)
                const conversationReceiver = await getConversation(msgByUserId, onlineUser)
                io.to(userIdString).emit('conversation', conversationSender || [])
                io.to(msgByUserId).emit('conversation', conversationReceiver || [])
            } catch (err) {
                console.error("Error in seen event handler:", err)
            }
        })

        // Disconnected
        socket.on('disconnect', () => {
            try {
                onlineUser.delete(userIdString)
                io.emit('onlineUser', Array.from(onlineUser))
            } catch (err) {
                console.error("Error in disconnect event handler:", err)
            }
        })
    } catch (error) {
        console.error("Error in socket connection setup:", error)
        socket.disconnect(true)
    }
})

module.exports = { app, server }