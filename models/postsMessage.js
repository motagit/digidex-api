import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    number: Number,
    iconSource: String,
    name : String
});

const postMessage = mongoose.model('PostMessage', postSchema);

export default postMessage;