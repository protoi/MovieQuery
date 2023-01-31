const fs = require("fs");
const { NlpManager } = require("node-nlp");

class natural_language_processing_model {
  constructor() {
    this.manager = new NlpManager();
    this.model_loader();
  }
  model_loader() {
    const data = fs.readFileSync("mymodel.nlp", "utf8");
    this.manager.import(data);
  }

  async extract_entities(message) {
    const result = await this.manager.process("en", message);

    let our_entities = { genre: [], actor: [] };

    // console.dir(result);

    result.entities.forEach((element) => {
      let entity_type = element["entity"];
      if (our_entities[entity_type] != null) {
        if (entity_type === "daterange")
          our_entities[entity_type].push(element["resolution"]["timex"]);
        else our_entities[entity_type].push(element["option"]);
      }
    });
    // console.log(our_entities);
    return our_entities;
  }
}

module.exports = { natural_language_processing_model };
