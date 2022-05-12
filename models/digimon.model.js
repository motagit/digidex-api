import mongoose from 'mongoose';


const ObjectId = mongoose.Schema.Types.ObjectId;

const digimonSchema = mongoose.Schema({
    number: Number,
    iconSource: String,
    name : String,
    level: String,
    attribute: String,
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