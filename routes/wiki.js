const wikiRouter = require("express").Router();
const addPage = require("../views/addPage.js");
const wikipage = require("../views/wikipage.js");
const main = require("../views/main.js");
const { Page, User } = require("../models/index");

wikiRouter.get("/", async (req, res, next) => {
  try {
    const pages = await Page.findAll();
    res.send(main(pages));
  } catch (err) {
    res.status(500);
    next(err);
  }
});

wikiRouter.get("/add", (req, res) => {
  res.send(addPage());
});

wikiRouter.post("/", async (req, res, next) => {
  try {
    const author = req.body.author;
    const email = req.body.email;
    const title = req.body.title;
    const content = req.body.content;
    const status = req.body.status;

    const page = await Page.create({
      title: req.body.title,
      content: req.body.content,
      status: req.body.status,
    });

    const user = await User.create({
      name: req.body.author,
      email: req.body.email,
    });

    res.redirect(`/wiki/${page.slug}`);
  } catch (error) {
    next(error);
  }
});

wikiRouter.get("/:slug", async (req, res, next) => {
  const slugUrl = req.params.slug;
  const page = await Page.findOne({ where: { slug: slugUrl } });
  const user = await User.findByPk(page.id);
  console.log(user);
  res.send(wikipage(page, user.name));
});

module.exports = { wikiRouter };
