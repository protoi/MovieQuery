
class name_splitter {

    constructor(message) {
        const nlp = require('compromise')

        const plg = require('compromise-speech');
        this.message = message.replace(",", " 1 ");

        nlp.extend(plg);
        this.json = nlp(message).json();

        this.genres = ["action", "comedy", "romance", "drama", "horror"];
        this.found_genres = [];
        this.name_list = [];
        this.buffer = [];
        this.identifiers = ["Person", "ProperNoun"];
    }


    // const { builtinModules, Module } = require('module');

    // let message = "Action and romance movies starring arnold schwarzenegger and sylvie stallone and brad pitt";
    // console.log(json)
    // console.log(JSON.stringify(json[0].terms, null, 1))
    extract_context() {
        this.json[0].terms.forEach(element => {
            // console.log(element);
            if (this.genres.includes(element["text"].toLowerCase())) {
                this.found_genres.push(element["text"].toLowerCase());
                return;
            }
            // console.log(element["text"] + " <-----> " + element["tags"]);
            
            if (this.identifiers.some((POS) => element["tags"].includes(POS)))
                this.buffer.push(element["text"]);
            else {
                if (this.buffer.length != 0) {
                    this.name_list.push(this.buffer.join(" "));
                    this.buffer.length = 0;
                    // console.log(this.name_list);
                }
            }
        });

        if (this.buffer.length != 0) {
            this.name_list.push(this.buffer.join(" "));
            this.buffer.length = 0;
            // console.log(this.name_list);
        }

/* 
        console.log("hello world");
        console.log(`original message ->${this.message}`)
        console.log(this.name_list);
        console.log(this.found_genres);
 */
        const query_object = {
            "actors": this.name_list,
            "genre": this.found_genres
        }
        console.table(query_object)
        return query_object;
    }

}

// module.export(query_object);
/* 
const a = new name_splitter("Action and romance movies starring arnold schwarzenegger and sylvie stallone and brad pitt");
a.extract_context(); */

module.exports = { name_splitter };