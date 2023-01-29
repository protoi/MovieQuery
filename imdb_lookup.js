// let queries = require('./queries.json')

const axios = require("axios");
require("dotenv").config();

class send_imdb_query {
  constructor() {
    this.actor_mapping = [];
    this.genre_mapping = [];

    // this.map_genre_with_ID();
  }

  async map_genre_with_ID() {
    try {
      // console.log(`mapping ${genre_name}`);
      let config = {
        method: "get",
        url: `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.THE_MOVIE_DB_KEY}`,
        headers: {},
      };
      const genre_ID_response = await axios(config);

      genre_ID_response.data["genres"].forEach((element) => {
        this.genre_mapping[element["name"]] = element["id"];
      });
      console.log(this.genre_mapping);
      return true;
    } catch (err) {
      console.log(`Failed to map genres`);
      return null;
    }
  }

  async map_actor_with_ID(actor_name) {
    if (this.actor_mapping[actor_name] != null)
      // already mapped
      return;

    try {
      console.log(`mapping ${actor_name}`);
      let config = {
        method: "get",
        url: `https://api.themoviedb.org/3/search/person?api_key=${process.env.THE_MOVIE_DB_KEY}&query=${actor_name}`,
        headers: {},
      };
      const actor_ID_response = await axios(config);
      if (actor_ID_response["total_results"] == 0) {
        // map with unidentified
        // actor_mapping[actor_name] = ACTOR_NOT_FOUND;
        return null;
      }
      this.actor_mapping[actor_name] = actor_ID_response.data.results[0]["id"];
      console.log(this.actor_mapping[actor_name]);
      return;
    } catch (err) {
      console.error(err.message);
      console.log(`Failed to identify ${actor_name}`);
      return;
    }
  }

  async find_queries(search_terms) {
    try {
      await this.map_genre_with_ID();
    } catch (err) {
      console.log("error mapping genres");
    }

    let movie_names = [];
    let err_flag = false;
    let actor_id_string = "";
    let genre_id_string = "";

    let actor_IDs = [];
    let genre_IDs = [];

    function modify_string(str) {
      return str.replace(/\s+/g, " ").trim().replace(/ /g, "+");
    }

    // map actor names with their IDs

    let actor_names = search_terms["actors"];
    let normalized_name = "";

    for (let index = 0; index < actor_names.length; index++) {
      const name = actor_names[index];
      try {
        normalized_name = modify_string(name);
        // console.log(`${normalized_name} <-------------`);
        let actor_mapping_output = await this.map_actor_with_ID(
          normalized_name
        );
        // if (actor_mapping_output != ACTOR_NOT_FOUND)
        if (this.actor_mapping[normalized_name] != null)
          actor_IDs.push(this.actor_mapping[normalized_name]);
      } catch (err) {
        console.log(`failed to map ${name} with an ID`);
      }
    }

    // extract IDs of given genre out of mapped genre
    search_terms["genre"].forEach((genre) => {
      if (this.genre_mapping[genre] != null)
        genre_IDs.push(this.genre_mapping[genre]);
    });

    // turning the IDs into strings
    genre_id_string = genre_IDs.join(",");
    actor_id_string = actor_IDs.join(",");

    console.log(`actor_IDs: ${actor_IDs}`);
    console.log(`genre_id_string: ${genre_id_string}`);
    console.log(`actor_id_string: ${actor_id_string}`);

    // send GET request to discover
    try {
      console.log("test");

      let config = {
        method: "get",
        url: `https://api.themoviedb.org/3/discover/movie?with_genres=${genre_id_string}&with_people=${actor_id_string}&sort_by=vote_average.desc&api_key=${process.env.THE_MOVIE_DB_KEY}`,
        headers: {},
      };

      const imdb_data = (await axios(config)).data.results;

      for (let index = 0; index < imdb_data.length; index++) {
        const element = imdb_data[index];
        movie_names[index] = {
          id: element["id"],
          "original title": element["original_title"],
          overview: element["overview"].substring(0, 50),
        };
      }
    } catch (err) {
      console.error(err.message);
      movie_names = "...";
    }
    // console.table(movie_names);
    const names = movie_names.map((e) => {
      return e["original title"];
    });
    console.log(`movie titles -----> ${names}`);
    return movie_names;

    /* 
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
        */
    // return movie_names;
  }
}
module.exports = { send_imdb_query };

// // mapping with IDs
// let actor_mapping = {};
// let genre_mapping = {};
// map_genre_with_ID();

// async function map_genre_with_ID() {
//     try {
//         // console.log(`mapping ${genre_name}`);
//         let config = {
//             method: 'get',
//             url: `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.THE_MOVIE_DB_KEY}`,
//             headers: {}
//         };
//         const genre_ID_response = await axios(config);

//         genre_ID_response.data["genres"].forEach((element) => {
//             genre_mapping[element['name']] = element["id"];
//         });
//         console.log(genre_mapping);
//         return true;
//     }
//     catch (err) {
//         console.log(`Failed to map genres`);
//         return null;
//     }
// }

// function get_query_from_user() {
//     console.log(queries);
//     console.log(Object.values(queries));
//     console.log(Object.keys(queries));
// }

// // get_query_from_user();

// function generate_get_payload(category, query) {
//     let config = {
//         method: 'get',
//         url: `https://api.themoviedb.org/3/search/${category}?api_key=${process.env.THE_MOVIE_DB_KEY}&language=en-US&include_adult=false&query=${query}`,
//         headers: {}
//     };
//     return config;
// }

// async function map_actor_with_ID(actor_name) {
//     if (actor_mapping[actor_name] != null) // already mapped
//         return;

//     try {
//         console.log(`mapping ${actor_name}`);
//         let config = {
//             method: 'get',
//             url: `https://api.themoviedb.org/3/search/person?api_key=${process.env.THE_MOVIE_DB_KEY}&query=${actor_name}`,
//             headers: {}
//         };
//         const actor_ID_response = await axios(config);
//         if (actor_ID_response["total_results"] == 0) { // map with unidentified
//             // actor_mapping[actor_name] = ACTOR_NOT_FOUND;
//             return null;
//         }
//         actor_mapping[actor_name] = actor_ID_response.data.results[0]["id"];
//         console.log(actor_mapping[actor_name]);
//         return;
//     }
//     catch (err) {
//         console.error(err.message);
//         console.log(`Failed to identify ${actor_name}`);
//         return;
//     }
// }

// async function find_queries(search_terms) {
//     let movie_names = {};
//     let err_flag = false;
//     let actor_id_string = "";
//     let genre_id_string = "";

//     let actor_IDs = [];
//     let genre_IDs = [];

//     function modify_string(str) {
//         return str.replace(/\s+/g, ' ').trim().replace(/ /g, '+')
//     }

//     // map actor names with their IDs

//     let actor_names = search_terms["actors"];
//     let normalized_name = "";

//     for (let index = 0; index < actor_names.length; index++) {
//         const name = actor_names[index];
//         try {
//             normalized_name = modify_string(name);
//             let actor_mapping_output = await map_actor_with_ID(normalized_name);
//             // if (actor_mapping_output != ACTOR_NOT_FOUND)
//             if (actor_mapping[normalized_name] != null)
//                 actor_IDs.push(actor_mapping[normalized_name]);
//         }
//         catch (err) {
//             console.log(`failed to map ${name} with an ID`);
//         }
//     }

//     // extract IDs of given genre out of mapped genre
//     search_terms["genre"].forEach((genre) => {
//         if (genre_mapping[genre] != null)
//             genre_IDs.push(genre_mapping[genre]);
//     });

//     // turning the IDs into strings
//     genre_id_string = genre_IDs.join(",");
//     actor_id_string = actor_IDs.join(",");

//     console.log(actor_IDs);
//     console.log(genre_id_string);
//     console.log(actor_id_string);

//     // send GET request to discover

//     try {
//         console.log("test");

//         let config = {
//             method: 'get',
//             url: `https://api.themoviedb.org/3/discover/movie?with_genres=${genre_id_string}&with_people=${actor_id_string}&sort_by=vote_average.desc&api_key=${process.env.THE_MOVIE_DB_KEY}`,
//             headers: {}
//         };

//         const imdb_data = (await axios(config)).data.results;

//         for (let index = 0; index < imdb_data.length; index++) {
//             const element = imdb_data[index];
//             movie_names[index + 1] = {
//                 "id": element["id"],
//                 "original title": element["original_title"],
//                 "overview": (element["overview"]).substring(0, 50)
//             }
//         }
//     }
//     catch (err) {
//         console.error(err.message);
//         movie_names = "...";
//     }
//     console.table(movie_names);

//     /*
//         for (const term in search_terms) {
//             console.log(`${term}: ${search_terms[term]}`);

//             let category = term;
//             let query = modify_string(search_terms[term]);

//             try {
//                 console.log("test");
//                 const imdb_data = await axios(generate_get_payload(category, query));
//                 movie_names[category] = imdb_data.data.results;
//             }
//             catch (err) {
//                 console.error(err.message);
//                 movie_names[category] = "...";
//             }
//         }
//      */
//     // return movie_names;
// }
// find_queries(queries);
// // console.table(make_requests(queries))

// /* https://api.themoviedb.org/3/search/movie?api_key=8c043f8ad54e1796695922f5011748a9&language=en-US&page=1&include_adult=false&query=Jurassic+Park
// https://api.themoviedb.org/3/search/person?api_key=<<api_key>>&language=en-US&page=1&include_adult=false
// */
