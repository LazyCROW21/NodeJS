const fs = require('fs');
const chalk = require('chalk');
const fileName = 'notes.json';


const loadNotes = () => {
    try {
        const dataBuffer = fs.readFileSync(fileName);
        const dataJSON = dataBuffer.toString()
        return JSON.parse(dataJSON);
    } catch (e) {
        return [];
    }
}

const saveNotes = (notes) => {
    fs.writeFileSync(fileName, JSON.stringify(notes));
}

const printNotes = () => {
    const notes = loadNotes();
    notes.forEach((note) => {
        console.log(chalk.white('----------------------'));
        console.log(chalk.yellow(note.title));
        console.log(chalk.white('----------------------'));
    });
}

const readNote = (title) => {
    const notes = loadNotes();
    const readNote = notes.find((note) => note.title === title);
    console.log(chalk.white('----------------------'));
    console.log(chalk.yellow(readNote.title));
    console.log(chalk.blue(readNote.body));
    console.log(chalk.white('----------------------'));
}

const addNotes = (title, body) => {
    const notes = loadNotes();
    const duplicateNote = notes.find((note) => note.title === title);
    // debugger
    // node inspect app.js 
    // node --inspect-brk app.js 
    // chrome://inspect
    if(!duplicateNote) {
        notes.push({
            title, body
        });
        saveNotes(notes);
        console.log(chalk.green.inverse('Note added!'));
    } else {
        console.log(chalk.red.inverse('Note title taken!'));
    }
}

const removeNote = (title) => {
    const notes = loadNotes();
    const remainingNotes = notes.filter((note) => note.title !== title);
    if(notes.length == remainingNotes.length) {
        saveNotes(remainingNotes);
        console.log(chalk.red.inverse('Note not found!'));
    } else {
        saveNotes(remainingNotes);
        console.log(chalk.green.inverse('Note removed:'));
        console.log(notes.find((note) => note.title === title));
    }
}

module.exports = {
    removeNote,
    addNotes,
    printNotes,
    readNote
}