const BrainTrainer  = require('./brain-trainer');
const NerizedClass  = require("./elab")
const Nerized       = new NerizedClass()
const brain         = new BrainTrainer()

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

console.clear();

const prompt = async() => {
    readline.question('User> ', async input => {
        const res = brain.process(input.toLowerCase());
        console.log(res[0])
        if (typeof Nerized[res[0].intent] != "undefined") {
            const search = await Nerized[res[0].intent](input.toLowerCase());
            console.log(search)
        } else {
            console.log("Bot> No intent founds.")
        }
        
        prompt();
    });
}

prompt()