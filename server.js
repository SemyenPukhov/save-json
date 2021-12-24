const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");

app.use(bodyParser.json());
app.use(cors());

app.post("/:id", (req, res) => {
  console.log("req.body", req.body, req.params);

  const body = req.body;

  if (
    !body ||
    !body.config ||
    typeof body.config !== "object" ||
    body.config.splice
  ) {
    return res.status(400).json({
      message: "Requst body must contain config property with object type"
    });
  }

  const { id } = req.params;

  fs.readFile("./configs.json", "utf8", (_, data) => {
    try {
      const json = JSON.parse(data) || {};

      json[id] = body.config;

      const content = JSON.stringify(json);

      fs.writeFile("./configs.json", content, err => {
        if (err) {
          console.error(err);
          return res.status(500).json(null);
        }

        res.json({ message: "Success" });
      });
    } catch (error) {
      res.status(500).json(null);
    }
  });
});

app.get("/:id", (req, res) => {
  const { id } = req.params;

  fs.readFile("./configs.json", "utf8", (_, data) => {
    try {
      const json = JSON.parse(data) || {};
      const config = json[id] || null;

      return res.json(config);
    } catch (error) {}

    res.json(null);
  });
});

app.listen(port, void 0);
