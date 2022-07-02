import express from "express";

import events from "./events";
import points from "./points";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get("/", (req, res) => {
  res.send("hello, world!");
});

app.use("/events", events);
app.use("/point", points);

app.listen(5000, () => console.log("Start server: " + 5000));
