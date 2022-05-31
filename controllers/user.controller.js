import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const signIn = async (req, res) => {
    const { user, password } = req.body;

    try {
        const existingUser = await User.findOne({ user });
        let token;

        if (!existingUser) 
            return res.status(404).json({ message: "User doesn't exist." });
        
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if(!isPasswordCorrect) 
            return res.status(404).json({ message: "Invalid credentials." });

        if (existingUser.active == true) {
            token = jwt.sign({ user: existingUser.email, id: existingUser._id }, 'test', { expiresIn: "1h" });
        } else {
            return res.status(401).json({ message: "You can't access the system because you user isn't activated." })
        }
        
        res.status(200).json({ result: existingUser, token });

    } catch (error){
        res.status(500).json({ message: error });
    }
}

export const signUp = async (req, res) => {
    const { email, user, password, confirmPassword } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) 
            return res.status(404).json({ message: "User already exists." });
        
        if (password !== confirmPassword)
            return res.status(404).json({ message: "Passwords don't match." });

        const hashedPassword = await bcrypt.hash(password, 12);

        await User.create({ email, password: hashedPassword, user });

        res.status(200).send({ message: "Account created. Wait until your account is activated."});

    } catch (error) {
        res.status(500).json({ message: error });
    }


}