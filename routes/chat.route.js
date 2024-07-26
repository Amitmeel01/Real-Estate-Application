const router = require('express').Router();
const verifyToken = require('../middleware/verifyToken');
const prisma = require('../models/prisma');



// Fetch all users except the current user
router.get('/users', verifyToken, async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const users = await prisma.user.findMany({
      where: {
        id: {
          not: tokenUserId,
        },
      },
      select: {
        id: true,
        username: true,
        avatar: true,
      },
    });

    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get users!" });
  }
});

// Fetch existing chats
router.get('/', verifyToken, async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chats = await prisma.chat.findMany({
      where: {
        userIds: {
          hasSome: [tokenUserId],
        },
      },
    });

    for (const chat of chats) {
      const receiverId = chat.userIds.find((id) => id !== tokenUserId);

      const receiver = await prisma.user.findUnique({
        where: {
          id: receiverId,
        },
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      });
      chat.receiver = receiver;
    }

    res.status(200).json(chats);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chats!" });
  }
});



//single chat
router.get('/:id',verifyToken,async (req,res)=>{
    const tokenUserId = req.userId;

    try {
      const chat = await prisma.chat.findUnique({
        where: {
          id: req.params.id,
          userIds: {
            hasSome: [tokenUserId],
          },
        },
        include: {
          messages: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });
  
      await prisma.chat.update({
        where: {
          id: req.params.id,
        },
        data: {
          seenBy: {
            push: [tokenUserId],
          },
        },
      });
      res.status(200).json(chat);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to get chat!" });
    }
})

//add chat
router.post('/',verifyToken,async (req,res)=>{
    const tokenUserId = req.userId;
    try {
      const newChat = await prisma.chat.create({
        data: {
          userIds: [tokenUserId, req.body.receiverId],
        },
      });
      res.status(200).json(newChat);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to add chat!" });
    }
})

//read
router.put('/read/:id',verifyToken,async (req,res)=>{
    const tokenUserId = req.userId;

  
    try {
      const chat = await prisma.chat.update({
        where: {
          id: req.params.id,
          userIds: {
            hasSome: [tokenUserId],
          },
        },
        data: {
          seenBy: {
            set: [tokenUserId],
          },
        },
      });
      res.status(200).json(chat);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to read chat!" });
    }
})




module.exports=router;