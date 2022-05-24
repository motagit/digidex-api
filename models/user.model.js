import mongoose from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
});

export default mongoose.model('User', userSchema);