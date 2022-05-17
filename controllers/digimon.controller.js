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
            res.status(404).json({message: "Não existem referências com esse ID."}); 
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getPosts = async (req, res) => {
    try {
        const postMessages = await Digimon.find();

        // Ordenar digimons pelo number
        postMessages.sort((a, b) => parseFloat(a.number) - parseFloat(b.number));

        res.status(200).json(postMessages);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createPost = async (req, res) => {
    const post = req.body;
    const newPost = new Digimon(post);

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

    digimonService.verifyAndUpdatePriorEvolutions(post);

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');
    
    const updatedPost = await Digimon.findByIdAndUpdate(_id, post, { new: true });

    res.json(updatedPost);
}

export const deletePost = async (req, res) => {
    const { id } = req.params;
    digimonService.deleteReferences(id);

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');

    await Digimon.findByIdAndRemove(id);

    console.log('DELETED');

    res.json({ message: 'Post deleted successfully' });
}
