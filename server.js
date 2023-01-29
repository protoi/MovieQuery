const express = require("express");
const router = require("express").Router();
const axios = require("axios");
const exp = express();
const port = 9999;
const imdb = require("./imdb_lookup");
const context_extractor = require("./name_and_genre_splitter");
const PORT = 9999;

require("dotenv").config();

exp.use(express.json());
exp.use(express.urlencoded({ extended: true }));

exp.get("/", (req, res) => {
  res.send("Hello World");
});

exp.get("/movie", (req, res) => {
  if (req.query["hub.verify_token"] == process.env.SECRET)
    res.send(req.query["hub.challenge"]);
  else res.sendStatus(403);
});

function extract_number_and_message(payload) {
  try {
    const number = payload.entry[0].changes[0].value["messages"][0]["from"];
    const message =
      payload.entry[0].changes[0].value["messages"][0]["text"]["body"];
    console.log(`number: ${number}, message: ${message}`);
    return {
      num: number,
      msg: message,
    };
  } catch (error) {
    return null;
  }
}

function generate_payload(number, movie_list) {
  let reply_body = JSON.stringify({
    messaging_product: "whatsapp",
    to: number,
    type: "text",
    text: { body: movie_list.join(", ") },
  });

  const config = {
    method: "post",
    url: "https://graph.facebook.com/v15.0/105933825735159/messages",
    headers: {
      Authorization: `Bearer ${process.env.TOKEN}`,
      "Content-Type": "application/json",
    },
    data: reply_body,
  };
  console.log("payload generated");
  return config;
}

exp.post("/movie", async (req, res) => {
  let num, msg;
  const num_message_tuple = extract_number_and_message(req.body);
  console.log("extract_number_and_message EXITED");

  if (num_message_tuple != null) {
    num = num_message_tuple.num;
    msg = num_message_tuple.msg;

    res.sendStatus(200);
    console.log("sent status");

    try {
      const split_obj = new context_extractor.name_splitter();
      console.log("name splitter EXITED");
      const imdb_obj = await new imdb.send_imdb_query();
      console.log("imdb query EXITED");

      split_obj.set_message(msg);
      console.log("message set");

      try {
        const split_names = await split_obj.extract_context();
        console.log("context extracted");

        const movie_list = await imdb_obj.find_queries(split_names);
        console.log("queries found");

        if (
          movie_list["original_title"] == null ||
          movie_list["original_title"].length == 0
        ) {
          const config = generate_payload(num, movie_list["original title"]);
          console.log("payload generated");
          axios(config)
            .then((response) => {
              console.log("Message sent successfully");
            })
            .catch((err) => {
              console.log("Something went wrong while sending the message");
            });
        }
      } catch (err) {
        res.sendStatus(403);
        console.log("Payload was broken");
      }
    } catch (err) {
      // send "something wrong happened message" to whatsapp
      console.log("Number or message were broken");
    }
  } else {
    console.log(
      "oh no, something went wrong extracting the number and message"
    );
  }
});

exp.listen(PORT, () => {
  console.log(`express app listening to port #${PORT}`);
});
