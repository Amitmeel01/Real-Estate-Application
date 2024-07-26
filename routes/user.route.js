const router = require('express').Router();
const verifyToken = require('../middleware/verifyToken');
const prisma = require('../models/prisma');
const bcrypt = require('bcrypt');

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get users" });
  }
});

// Get single user by ID
// router.get('/:id', verifyToken, async (req, res) => {
//   const { id } = req.params;
//   try {
//     const user = await prisma.user.findUnique({
//       where: { id }
//     });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.status(200).json(user);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to get user" });
//   }
// });

// Update user
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const tokenUserId = req.userId; // from verifyToken middleware
  const { password, avatar, ...inputs } = req.body;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not authorized" });
  }

  try {
    let updatedPassword = null;

    if (password && typeof password === 'string') {
      updatedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...inputs,
        ...(updatedPassword && { password: updatedPassword }),
        ...(avatar && { avatar })
      }
    });

    const { password: userPassword, ...rest } = updatedUser;

    res.status(200).json(rest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update user" });
  }
});

// Delete user
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const tokenUserId = req.userId; // from verifyToken middleware

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not authorized" });
  }

  try {
    await prisma.user.delete({
      where: { id }
    });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete user" });
  }
});



// saved


router.post("/save", verifyToken, async (req, res) => {
  const postId = req.body.postId;
  const tokenUserId = req.userId;

  if (!postId) {
    return res.status(400).json({ message: "postId is required" });
  }

  try {
    const savedPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId: tokenUserId,
          postId: postId,
        },
      },
    });

    if (savedPost) {
      await prisma.savedPost.delete({
        where: {
          id: savedPost.id,
        },
      });
      return res.status(200).json({ message: "Post removed from saved list" });
    } else {
      await prisma.savedPost.create({
        data: {
          userId: tokenUserId,
          postId: postId,
        },
      });
      return res.status(200).json({ message: "Post saved" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to save or remove the post" });
  }
});


// profile posts

router.get('/profilePosts',verifyToken,async (req,res)=>{
  const tokenUserId = req.userId;
  try {
    const userPosts = await prisma.post.findMany({
      where: { userId: tokenUserId },
    });
    const saved = await prisma.savedPost.findMany({
      where: { userId: tokenUserId },
      include: {
        post: true,
      },
    });

    const savedPosts = saved.map((item) => item.post);
    res.status(200).json({ userPosts, savedPosts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get profile posts!" });
  }
})

//notification

router.get('/notification',verifyToken,async (req,res)=>{

  const tokenUserId = req.userId;
  try {
   const number=await prisma.chat.count({
    where:{
      userIds:{
        hasSome:[tokenUserId],
      },
      NOT:{
        seenBy:{
          hasSome:[tokenUserId]
        }
      }
    }
   }) 
    res.status(200).json(number);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get profile posts!" });
  }
})


module.exports = router;
