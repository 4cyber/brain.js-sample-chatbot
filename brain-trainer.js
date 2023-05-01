const { CorpusLookup }  = require('@nlpjs/utils');
const { TokenizerIt }   = require('@nlpjs/lang-it');
const { NeuralNetwork } = require('brain.js');
const { StemmerIt }     = require('@nlpjs/lang-it');
const corpus            = require('./data/traindata.json');
const fs                = require("fs");

class BrainTrainer {
    constructor() {
        this.settings = {
            log: (str) => console.log(str),
            logPeriod: 10,
            errorThresh: 0.00005
        };
        this.tokenizer  = new TokenizerIt();
        this.stemmer    = new StemmerIt();
        this.lookups    = new CorpusLookup(corpus, this.stemmer);
        //initialize and import the model
        this.net        = new NeuralNetwork();

        if (fs.existsSync('model.json'))    this.import()
        else                                this.train()
    }
    
    train() {
        this.net.train(this.lookups.trainVectors, this.settings);
        this.export()
        return this.test()
    }

    test() {
        let total = 0;
        let good = 0;
        corpus.data.forEach(item => {
            item.tests.forEach(test => {
                const classifications = this.process(test);
                total += 1;
                if (classifications[0].intent === item.intent) {
                    good += 1;
                }
            });
        });
            
        const perc = good * 100 / total;
        return { good, total, perc } 
    }

    process(utterance) {
        const vector = this.lookups.inputToVector(utterance);
        const output = this.net.run(vector);
        return this.lookups.vectorToClassifications(output);
    }

    export() {
        fs.writeFileSync(
            "model.json",
            JSON.stringify(this.net.toJSON()),
            "utf-8"
        )
    }

    import() {
        this.net.fromJSON(
            JSON.parse(
                fs.readFileSync(
                    "model.json",
                    "utf-8"
                )
            )
        )
    }
}

module.exports = BrainTrainer;