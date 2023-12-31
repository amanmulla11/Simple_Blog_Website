//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
const { MongoClient, ServerApiVersion } = require('mongodb');

const homeStartingContent = "Welcome to our blog, a digital haven where inspiration knows no bounds. Here, you'll embark on a journey through a myriad of topics, from the art of mindfulness to the science of space exploration, from delicious culinary adventures to the wonders of eco-conscious living. We believe that knowledge is a treasure to be shared, and we're here to be your guide. Whether you're seeking expert advice, creative insights, or simply a moment of reflection, our blog is designed to offer a little something for everyone. So, kick back, explore, and let your curiosity run wild in the endless sea of ideas, stories, and wisdom that awaits you. This is where your adventure begins.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const uri = "mongodb+srv://amanmulla11:Test12345@cluster0.kmukqxq.mongodb.net/simple_blogDB?retryWrites=true&w=majority";

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
mongoose.connect(uri, {
  poolSize: 10, // Adjust the pool size as needed
});
app.get("/", function (req, res) {
  // Fetch all posts from the database
  Post.find({})
    .then((posts) => {
      if (posts.length === 0) {
        // Handle the case when there are no posts
        res.render("home", {
          startingContent: homeStartingContent,
          posts: [] // Empty array
        });
      } else {
        res.render("home", {
          startingContent: homeStartingContent,
          posts: posts
        });
      }
    })
    .catch((err) => {
      console.error(err);
      // Handle the error appropriately, e.g., res.status(500).send('Internal Server Error');
    });
});



app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err){
    if (err){
      // Handle the error, e.g., res.status(500).send('Internal Server Error');
    }
  });

  // Redirect outside of the callback, always executed
  res.redirect("/");
});



  app.get("/posts/:postId", function(req, res){
    const requestedPostId = req.params.postId;
  
    Post.findOne({ _id: requestedPostId }, function(err, post){
      if (!err) {
        res.render("post", {
          title: post.title,
          content: post.content
        });
      }
    });
    Post.find({})
  .then((posts) => {
    // Handle the data
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
  });

  });
  



app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
