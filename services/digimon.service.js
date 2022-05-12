import mongoose from 'mongoose';
import Digimon from '../models/digimon.model.js';

export const verifyPriorEvolutions = async(digimon) => {
    let digimonsUpdate = [];
    for (let i = 0; i < digimon.nextForms.length; i++) {
        let digimonNextForm = await Digimon.findById(digimon.nextForms[i]._id);
        if (digimonNextForm != null) {
            for (let j = 0; j < digimonNextForm.priorForms.length; j++) {
                // Se já estiver na lista de priorForm, sai da função.
                if (digimonNextForm.priorForms[j]._id == digimon._id) {
                    return;
                }
            }
            // Adiciona o digimon na array de update
            digimonNextForm.priorForms.push({ _id: digimon._id, name: digimon.name });
            digimonsUpdate.push(digimonNextForm);
        }
    }
    // Da um update, atualizando o priorForm
    for (let i = 0; i < digimonsUpdate.length; i++) {
        await Digimon.findByIdAndUpdate(digimonsUpdate[i]._id, digimonsUpdate[i], { new: true });
    }
}

export const deleteReferences = async(digimonId) => {
    // Da um find nos digimons que possuem esse id como nextForm
    const digimonNextFormReferences = await Digimon.find( {nextForms: { $elemMatch: {_id: digimonId } }});
    // Da um find nos digimons que possuem esse id como priorForm
    const digimonPriorFormReferences = await Digimon.find( {priorForms: { $elemMatch: {_id: digimonId } }});
    
    // Se tiver pelo menos uma referencia, deleta da array e da update.
    if(digimonNextFormReferences.length > 0) 
        deleteNextFormById(digimonNextFormReferences, digimonId);
    if(digimonPriorFormReferences.length > 0) 
        deletePriorFormById(digimonPriorFormReferences, digimonId);
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