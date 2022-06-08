import mongoose from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;

const digimonSchema = mongoose.Schema({
    iconSource: String,
    name : String,
    level: {
        _id: Number,
        name: String
    },
    attribute: {
        _id: Number,
        name: String
    },
    userCreator: String,
    priorForms: [{
        _id: ObjectId,
        name: String
    }],
    nextForms: [{
        _id: ObjectId,
        name: String
    }],
    information: String,
    attacks: [{
        name: String,
        description: String
    }],
    design: String,
    createdAt: {
        type: Date,
        default: new Date(),
    },
});

const digimon = mongoose.model('Digimon', digimonSchema);

export default digimon;