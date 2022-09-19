import mongoose from 'mongoose';
import Digimon from '../models/digimon.model.js';


export const verifyAndUpdatePriorEvolutions = async(digimon) => {
    let digimonsToUpdate = [];

    for (let i = 0; i < digimon.nextForms.length; i++) {
        let digimonNextForm = await Digimon.findById(digimon.nextForms[i]._id);
        if (digimonNextForm != null) {
            let exist = await Digimon.find({
                _id: digimonNextForm._id, 
                priorForms: { $elemMatch: {_id: digimon._id } }
            });
            // Se não estiver na lista de priorForm, adiciona.
            if (exist.length == 0) {
                digimonNextForm.priorForms.push({ _id: digimon._id, name: digimon.name }); 
                digimonsToUpdate.push(digimonNextForm);
            }
        }
    }
    // Da um update, atualizando o priorForm
    for (let digimon of digimonsToUpdate) {
        await Digimon.findByIdAndUpdate(digimon._id, digimon, { new: true });
        console.log("PRIORFORM UPDATED");
    }

    // Fazer um find para achar referencias como priorForm do Digimon
    const digimonPriorFormReferences = await Digimon.find({
        priorForms: { $elemMatch: {_id: digimon._id } }
    });
    
    // Passa por cada priorForm com referencias do Digimon
    for (let j = 0; j < digimonPriorFormReferences.length; j++) {
        // Se esse digimon com referencia do Digimon NÃO ESTIVER no nextForm do Digimon, remove a referencia
        let teste = await digimonExistsInNextForm(digimon, digimonPriorFormReferences[j]) == true;
        if (teste == true) {
            console.log("Digimon " + digimonPriorFormReferences[j].name + " is a next form from " + digimon.name);
        } else {
            console.log("Digimon " + digimonPriorFormReferences[j].name + " is not a next form from " + digimon.name);
            let digimonReference = [];
            digimonReference.push(digimonPriorFormReferences[j]);
            deletePriorFormById(digimonReference, digimon._id);
        }
    }
}

const digimonExistsInNextForm = async(digimon, digimonNextForm) => {

    const digimonNextFormReferences = await Digimon.find({
        _id: digimon._id, 
        nextForms: { $elemMatch: {_id: digimonNextForm._id} }
    });

    if (digimonNextFormReferences.length > 0)
        return true;
    else
        return false;
}

export const deleteReferences = async(digimonId) => {
    // Da um find nos digimons que possuem esse id como nextForm
    const digimonNextFormReferences = await Digimon.find({
        nextForms: { $elemMatch: {_id: digimonId } }
    });

    // Da um find nos digimons que possuem esse id como priorForm
    const digimonPriorFormReferences = await Digimon.find({
        priorForms: { $elemMatch: {_id: digimonId } }
    });
    
    // Se tiver pelo menos uma referencia, deleta da array e da update.
    if(digimonNextFormReferences.length > 0) 
        deleteNextFormById(digimonNextFormReferences, digimonId);
    if(digimonPriorFormReferences.length > 0) 
        deletePriorFormById(digimonPriorFormReferences, digimonId);
    
    console.log("POSSIBLE REFERENCES DELETED");
}

export const deleteNextFormById = async(digimonReferences, digimonId) => {
    for (let i = 0; i < digimonReferences.length; i++) {
        let digimonReference = digimonReferences[i];
        let nextForms = digimonReference.nextForms;

        for (let j = 0; j < nextForms.length; j++) {
            if (nextForms[j].id === digimonId) {
                nextForms.splice(j)
            }
        }

        digimonReference.nextForms = nextForms;
        await Digimon.findByIdAndUpdate(digimonReference._id, digimonReference, { new: true });
    }
}

export const deletePriorFormById = async(digimonReferences, digimonId) => {
    for (let i = 0; i < digimonReferences.length; i++) {
        let digimonReference = digimonReferences[i];
        let priorForms = digimonReference.priorForms;

        for (let j = 0; j < priorForms.length; j++) {
            if (priorForms[j].id === digimonId) {
                priorForms.splice(j)
            }
        }

        digimonReference.priorForms = priorForms;
        await Digimon.findByIdAndUpdate(digimonReference._id, digimonReference, { new: true });
    }
}