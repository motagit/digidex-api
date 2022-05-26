import mongoose from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = mongoose.Schema({
    user: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    active: { type: Boolean, default: false }
});

export default mongoose.model('User', userSchema);