const imdb = require('./imdb_lookup');
const name_splitter = require('./name_and_genre_splitter')

// const b = require('./queries.json');



async function runner() {
    try {
        const imdb_obj = await new imdb.send_imdb_query();

        const split_obj = await new name_splitter.name_splitter("find all action movies with Arnold Schwarzenegger and Sylvester Stallone");
        
        const split_names = await split_obj.extract_context();

        console.table(await imdb_obj.find_queries(split_names));
    }
    catch (err) {
        console.log(err);
    }
}

runner();
/* 
console.log("++++++++++++++++++++++++++++++++++++++++++")
console.table(imdb_obj.find_queries(b));
console.log("++++++++++++++++++++++++++++++++++++++++++")
 */