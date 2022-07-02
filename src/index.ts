import express from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get("/", (req, res) => {
  res.send("hello, world!");
});

app.listen(5000, () => console.log("Start server: " + 5000));
