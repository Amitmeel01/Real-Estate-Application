const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const prisma = require('../models/prisma');

router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    try {
        // hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create a new user and save to the database
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            }
        });

        // console.log(newUser);
        res.status(200).json({ message: "User created successfully!" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to create user" });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // check if the user exists
        const user = await prisma.user.findUnique({
            where: { username } // Use username to find the user
        });

        if (!user) return res.status(401).json({ message: "Invalid Details!!" });

        // check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: "Invalid Password!" });

      

        // generate JWT token
        const age = 1000 * 60 * 60 * 24 * 7;
        const token = jwt.sign({
            id: user.id,
            isAdmin:true, 
        }, process.env.JWT_SECRET_KEY, { expiresIn: age });

        const {password:userPassword,...userInfo}=user;

        // set JWT token in cookie
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: age
        }).status(200).json(userInfo);

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to login" });
    }
});

router.post('/logout', async (req, res) => {
    // Logout logic here
res.clearCookie("token").status(200).json({message:"Logout Successfully"})

});

module.exports = router;
 