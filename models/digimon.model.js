import mongoose from 'mongoose';

const digimonSchema = mongoose.Schema({
    number: Number,
    iconSource: String,
    name : String,
    level: String,
    attribute: String,
    // family
    // type
    // priorForms
    nextForms: [{
        _id: String
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