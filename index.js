const imdb = require("./imdb_lookup");
const context_extractor = require("./name_and_genre_splitter");

const nlp_model = require("./model_loader");
const model = new nlp_model.natural_language_processing_model();

model.load_model();

async function wrapper() {
  const split_obj = new context_extractor.name_splitter();
  const imdb_obj = await new imdb.send_imdb_query();

  async function runner() {
    try {
      const msg = "show me thriler movies with Brad Pittt, Georg Cloney";
      // split_obj.set_message(msg);
      const entities = await model.extract_entities(msg);

      console.log("+++++++++++++++++++");
      console.log(entities);
      console.log("+++++++++++++++++++");

      // const split_names = await split_obj.extract_context();
      console.table(await imdb_obj.find_queries(entities));
    } catch (err) {
      console.log(err);
    }
  }
  runner();
}

wrapper();
/* 
console.log("++++++++++++++++++++++++++++++++++++++++++")
console.table(imdb_obj.find_queries(b));
console.log("++++++++++++++++++++++++++++++++++++++++++")
 */
