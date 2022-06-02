import mongoose from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;

const digimonSchema = mongoose.Schema({
    iconSource: String,
    name : String,
    level: Number,
    attribute: String,
    userCreator: String,
    // family
    // type
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
    design: String
});

const digimon = mongoose.model('Digimon', digimonSchema);

export default digimon;