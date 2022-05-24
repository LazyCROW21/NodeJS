const yargs = require('yargs');

yargs.version('asd');

yargs.command({
    command: 'add',
    describe: 'Add a new note',
    builder: {
        title: {
            describe: 'Note title',
            demandOption: true,
            type: 'string'
        },
        body: {
            describe: 'Note body',
            demandOption: true,
            type: 'string'
        }
    },
    handler: (argv) => {
        console.log('Note added!', argv);
    }
})

yargs.command({
    command: 'remove',
    describe: 'remove a note',
    handler: () => {
        console.log('Note removed!');
    }
})

yargs.command({
    command: 'list',
    describe: 'list all notes',
    handler: () => {
        console.log('Note listed!');
    }
})

yargs.command({
    command: 'read',
    describe: 'read a new note',
    handler: () => {
        console.log('Note read!');
    }
})

yargs.parse();
