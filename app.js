const express = require("express");
const morgan = require("morgan");
const { db } = require("./models");
const app = express();
const { wikiRouter } = require("./routes/wiki.js");
const { userRouter } = require("./routes/users.js");

db.authenticate().then(() => {
  console.log("connected to the database");
});

app.use(morgan("dev"));
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const init = async () => {
  //await Page.sync();
  //await User.sync();
  await db.sync();
};
init();

app.use("/wiki", wikiRouter);
app.get("/", (req, res, next) => {
  res.redirect("/wiki");
});

const port = 3000;
app.listen(port, () => {
  console.log("listening on port ->", port);
});
