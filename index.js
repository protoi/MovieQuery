const imdb = require("./imdb_lookup");
const context_extractor = require("./name_and_genre_splitter");

async function wrapper() {
  const split_obj = new context_extractor.name_splitter();
  const imdb_obj = await new imdb.send_imdb_query();

  async function runner() {
    try {
      split_obj.set_message(
        "thriller, action movies with Arnold Schwarzenegger, Brad Pitt and George Clooney"
      );
      const split_names = await split_obj.extract_context();
      console.table(await imdb_obj.find_queries(split_names));
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
