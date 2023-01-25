let queries = require('./queries.json')

const axios = require("axios");
require('dotenv').config();


function get_query_from_user() {
    console.log(queries);
    console.log(Object.values(queries));
    console.log(Object.keys(queries));
}

get_query_from_user();


function generate_get_payload(category, query) {
    var config = {
        method: 'get',
        url: `https://api.themoviedb.org/3/search/${category}?api_key=${process.env.THE_MOVIE_DB_KEY}&language=en-US&include_adult=false&query=${query}`,
        headers: {}
    };
    return config;
}

async function make_requests(search_terms) {
    let movie_names = {};
    let err_flag = false;

    function modify_string(str) {
        return str.trim().replace(/ /g, '+')
    }

    for (const term in search_terms) {
        console.log(`${term}: ${search_terms[term]}`);

        let category = term;
        let query = modify_string(search_terms[term]);

        try {
            console.log("test");
            const imdb_data = await axios(generate_get_payload(category, query));
            movie_names[category] = imdb_data.data.results;
        }
        catch (err) {
            console.error(err.message);
            movie_names[category] = "...";
        }
    }

    console.log(movie_names);
    // return movie_names;
}
make_requests(queries);
// console.table(make_requests(queries))


/* https://api.themoviedb.org/3/search/movie?api_key=8c043f8ad54e1796695922f5011748a9&language=en-US&page=1&include_adult=false&query=Jurassic+Park
https://api.themoviedb.org/3/search/person?api_key=<<api_key>>&language=en-US&page=1&include_adult=false
*/