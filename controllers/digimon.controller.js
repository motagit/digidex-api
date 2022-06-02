import mongoose from 'mongoose';
import Digimon from '../models/digimon.model.js';
import * as digimonService from '../services/digimon.service.js';

export const findById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Digimon.findById(id);
        if (post != null) 
            res.status(200).json(post);
        else 
            res.status(404).json({message: "No digimon references with that id."}); 
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getPosts = async (req, res) => {
    try {
        const postMessages = await Digimon.find();

        // Ordenar digimons pelo level
        postMessages.sort((a, b) => parseFloat(a.level) - parseFloat(b.level));

        res.status(200).json(postMessages);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createPost = async (req, res) => {
    const post = req.body;
    const newPost = new Digimon({ ...post, createdAt: new Date().toISOString });

    if (post.iconSource == "" || post.iconSource == null)
        return res.status(404).json({ message: "Digimon image/gif is required." });
    
    if (post.name == "" || post.name == null)
        return res.status(404).json({ message: "Name cannot be empty." });

    if (post.level == 0 || post.level == null) 
        return res.status(404).json({ message: "Level cannot be empty." });

    digimonService.verifyAndUpdatePriorEvolutions(newPost);

    try {
        await newPost.save();

        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updatePost = async (req, res) => {
    const { id: _id } = req.params;
    const post = req.body;

    
    if (post.name == "" || post.name == null)
        return res.status(404).json({ message: "Name cannot be empty." });

    if (post.level == 0 || post.level == null) 
        return res.status(404).json({ message: "Level cannot be empty." });

    digimonService.verifyAndUpdatePriorEvolutions(post);

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No digimon references with that id');
    
    const updatedPost = await Digimon.findByIdAndUpdate(_id, post, { new: true });

    res.json(updatedPost);
}

export const deletePost = async (req, res) => {
    const { id } = req.params;
    digimonService.deleteReferences(id);

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No digimon references with that id');

    await Digimon.findByIdAndRemove(id);

    console.log('DELETED');

    res.status(200).json({ message: 'Digimon successfully deleted.' });
}
