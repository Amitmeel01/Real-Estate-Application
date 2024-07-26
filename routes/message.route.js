const router = require('express').Router();
const verifyToken = require('../middleware/verifyToken');
const prisma = require('../models/prisma');


router.post("/:chatId", verifyToken, async (req, res) => {
    const tokenUserId = req.userId;
    const chatId = req.params.chatId;
    const text = req.body.text;
  
    try {
      const chat = await prisma.chat.findUnique({
        where: {
          id: chatId,
          userIds: {
            hasSome: [tokenUserId],
          },
        },
      });
  
      if (!chat) return res.status(404).json({ message: "Chat not found!" });
  
      const message = await prisma.message.create({
        data: {
          text,
          chatId,
          userId: tokenUserId,
        },
      });
  
      await prisma.chat.update({
        where: {
          id: chatId,
        },
        data: {
          seenBy: [tokenUserId],
          latsMessage: text,
        },
      });
  
      res.status(200).json(message);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to add message!" });
    }
});



module.exports=router;