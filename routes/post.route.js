const router = require('express').Router();
const verifyToken = require('../middleware/verifyToken');
const prisma = require('../models/prisma');
const jwt=require('jsonwebtoken')

// all posts
router.get('/', async (req, res) => {
    const query = req.query;
    console.log(query);

    try {
        const posts = await prisma.post.findMany({
            where: {
                type: query.type || undefined,
                property: query.property || undefined,
                bedroom: query.bedroom ? parseInt(query.bedroom) : undefined,
                price: {
                    gte: query.minPrice ? parseInt(query.minPrice) : 0,
                    lte: query.maxPrice ? parseInt(query.maxPrice) : 1000000
                }
            }
        });

        // Filter posts by city (case-insensitive)
        const filteredPosts = query.city 
            ? posts.filter(post => post.city.toLowerCase() === query.city.toLowerCase())
            : posts;

        res.status(200).json(filteredPosts);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get posts" });
    }
});



// single post
router.get('/:id', verifyToken,async (req, res) => {
    const { id } = req.params;

    try {
        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                postDetail: true,
                user: {
                    select: {
                        username: true,
                        avatar: true,
                    }
                },
            }
        });
        
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
               
        const token = req.cookies?.token;

        if (token) {
          return jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
            if (!err) {
              const saved = await prisma.savedPost.findUnique({
                where: {
                  userId_postId: {
                    postId: id,
                    userId: payload.id,
                  },
                },
              });
              return res.status(200).json({ ...post, isSaved: saved ? true : false });
            } else {
              console.error("JWT verification error:", err);
            }
          });
        }

        return res.status(200).json({ ...post, isSaved: false });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Failed to fetch posts" });
    }
});


// add post
router.post('/', verifyToken, async (req, res) => {
    const body = req.body;
    const tokenUserId = req.userId;
    try {
        const newPost = await prisma.post.create({
            data: {
                ...body.postData,
                userId: tokenUserId,
                postDetail: {
                    create: body.postDetail,
                }
            }
        });
        res.status(200).json(newPost);
    } catch (err) {
        console.log(err);
        res.status(401).json({ message: "Failed to create post" });
    }
});

// update post
// update post
router.put('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const tokenUserId = req.userId;
    
    const body = req.body;
    try {
        const post = await prisma.post.findUnique({
            where: { id }
        });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.userId !== tokenUserId) {
            return res.status(403).json({ message: "Not Authorized" });
        }

        // Update post
        await prisma.post.update({
            where: { id },
            data: {
                ...body.postData, // Assuming this contains fields like title, price, etc.
                userId: tokenUserId,
                postDetail: {
                    update: {
                        ...body.postDetail, // Assuming this contains fields like desc, utilities, etc.
                    }
                }
            }
        });

        res.status(200).json({ message: "Post updated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update post" });
    }
});


// delete post
router.delete('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const tokenUserId = req.userId;
    

    try {
        const post = await prisma.post.findUnique({
            where: { id }
        });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.userId !== tokenUserId) {
            return res.status(403).json({ message: "Not Authorized" });
        }

        // Delete the related PostDetail record if it exists
        const postDetail = await prisma.postDetail.findUnique({
            where: { postId: id }
        });
        if (postDetail) {
            await prisma.postDetail.delete({
                where: { postId: id }
            });
        }

        // Delete related SavedPost records if they exist
        const savedPosts = await prisma.savedPost.findMany({
            where: { postId: id }
        });
        if (savedPosts.length > 0) {
            await prisma.savedPost.deleteMany({
                where: { postId: id }
            });
        }

        // Now delete the Post record
        await prisma.post.delete({
            where: { id }
        });

        res.status(200).json({ message: "Post deleted" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to delete post" });
    }
});



module.exports = router;
