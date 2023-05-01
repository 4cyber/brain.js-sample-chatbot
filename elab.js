const { Ner } = require('@nlpjs/ner');

class Nerized {
    constructor() {
        
    }

    normalize(text) {
        return text
          .replace(/[\u0300-\u036f]/g, '')
          .replaceAll("è", "e'")
          .toLowerCase();
    }

    saluto() {
        //@nlpjs/nlg to change as random response
        return "Ciao";
    }
}

module.exports = Nerized
