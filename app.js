//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", { useNewUrlParser: true });

const articleSchema = {
  Titre: String,
  Resume: String,
  Content: String,
  Author: String,
  Creation: String,
  Updated: String,
};

const Article = mongoose.model("Article", articleSchema);

////////////////////////////////////////////////General Articles/////////////////////////////////////////////////

app.route("/articles")

.get(function (req, res) {
    Article.find(function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  
.post(function (req, res) {

    const newArticle = new Article({
        Titre: req.body.Titre,
        Resume: req.body.Resume,
        Content: req.body.Content,
        Author: req.body.Author,
        Creation: req.body.Creation,
        Updated: req.body.Updated
    });

    newArticle.save(function(err){
        if (!err) {
            res.send("Successfully added a new article.");
        } else {
            res.send(err);
        }
    });
});

////////////////////////////////////////////////Specific Articles/////////////////////////////////////////////////

app.route("/articles/:articleTitle")

.get(function(req, res) {
    Article.findOne({Titre: req.params.articleTitle}, function(err, foundArticle) {
        if (foundArticle) {
            res.send(foundArticle)
        } else {
            res.send("No article matching that title was found.")
        }
    });
})

// Fonction PUT pour modifier un article
.put(function(req, res) {
    Article.updateOne(
        {Titre: req.params.articleTitle},
        {Titre: req.body.Titre, Resume: req.body.Resume, Content: req.body.Content, Author: req.body.Author, Creation: req.body.Creation, Updated: req.body.Updated},
        function(err) {
            if (!err) {
                res.send("Successfully updated the content of the selected article")
            } else {
                res.send(err);
            }
        }
    );
})

// Fonction PATCH pour modifier un élement spécifique dans un article
.patch(function(req, res) {
    Article.updateOne(
        {Titre: req.params.articleTitle},
        {$set: req.body},
        function(err) {
            if (!err) {
                res.send("Successfully updated article.")
            } else {
                res.send(err);
            }
        }
    );
})

// Supprimer un article spécifique
.delete(function(req, res) {
    Article.deleteOne(
        {Titre: req.params.articleTitle},
        function(err) {
            if (!err) {
                res.send("Successfully deleted the corresponding article.")
            } else {
                res.send(err);
            }
        }
    );
});


app.listen(3000, function () {
  console.log("Server started on port 3000");
});
