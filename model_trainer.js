const { dockStart } = require("@nlpjs/basic");

(async () => {
  const dock = await dockStart({
    settings: {
      nlp: {
        forceNER: true,
        languages: ["en"],
        autoSave: false,
        corpora: ["./corpus_2.json"],
      }
    },
    use: ["Basic", "LangEn"],
  });

  const manager = dock.get("nlp");

  // Train the network
  await manager.train();
  manager.save("mymodel.nlp").then((response) => {
    console.log("model written");
  }).catch((err) => {
    console.log(err.message);
  });

  // const result = await manager.process(
  //   "en",
  //   "Give action movies of Tom Hanks, Johnny Depp and Tom Cruize"
  // );
  // console.log(JSON.stringify(result, null, 2));
})();
