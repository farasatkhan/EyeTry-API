const ChatModel = require('../../models/Chat')

/*
exports.createChat = async(req,res)=>{
    const chat = new ChatModel({
        members: [req.body.senderId, req.body.receiverId]
    })

    try{
        const result = await chat.save();
        res.status(200).json(result) 

    }catch(e){
        res.status(500).json(e)
    }
}
*/



// To handle scenario of chat already existant in the db
exports.createChat = async (req, res) => {
    try {
        const existingChat = await ChatModel.findOne({
            members: {
                $all: [
                    { $elemMatch: { $eq: req.body.receiverId } },
                    { $elemMatch: { $eq: req.body.senderId } }
                ]
            }
        });

        if (existingChat) {
            // If a chat already exists for the given sender and receiver IDs
            return res.status(400).json({ message: 'Chat already exists' });
        }

        const chat = new ChatModel({
            members: [req.body.senderId, req.body.receiverId]
        });

        const result = await chat.save();
        res.status(200).json(result);
    } catch (e) {
        res.status(500).json({ message: 'Error creating chat', error: e });
    }
};


exports.userChats = async(req,res)=>{

    try{
        const chats = await ChatModel.find({
            members:{$in: [req.params.userId]}
        })
        res.status(200).json(chats) 

    }catch(e){
        res.status(500).json(e)
    }
}

exports.findChat = async(req,res)=>{

    try{
        const chat = await ChatModel.findOne({
            members:{$all: [req.params.firstId , req.params.secondId]}
        })
        res.status(200).json(chat) 

    }catch(e){
        res.status(500).json(e)
    }
}