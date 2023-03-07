const mongoose = require("mongoose");
const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const app = express();

// import session from 'express-session';
// import { default as connectMongoDBSession} from 'connect-mongodb-session';
// const MongoDBStore = connectMongoDBSession(session);

//Defining the location of the sessions data in the database.
var store = new MongoDBStore({
  uri: 'mongodb://localhost:27017/data',
  collection: 'sessions'
});

//Setting up the express sessions to be stored in the database.
app.use(session(
    { 
      secret: 'top secret key',
      resave: true,
      saveUninitialized: false,
      store: store 
    })
);

app.use(express.urlencoded({extended: true}));

// import artwork model
const Artwork = require("./ArtworkModel.js");
const User = require("./UserModel.js");
const { update } = require("./ArtworkModel.js");

app.use(express.static("./public"));
app.use(express.json());

//Setting pug as our template engine.
app.set('views', './views');
app.set('view engine', 'pug');

//This get method has two endpoints going to the same rendered pug file
app.get(['/', '/home'], async (req, res) => {
    const searchResult = await Artwork.find({});
	res.render('pages/home', { session: req.session, artworks: searchResult });
});

// Rendering the registration page.
app.get("/register", (req, res) => {
	res.render("pages/register", { session: req.session });
});

// Saving the user registration to the database.
app.post("/register", async (req, res) => {
    let newUser = req.body;
    try{
        const searchResult = await User.findOne({ username: newUser.username});
        if(searchResult == null) {
            console.log("registering: " + JSON.stringify(newUser));
            await User.create(newUser);
            res.status(200).send();
        } else {
            console.log("Send error.");
            res.status(404).json({'error': 'Exists'});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error registering" });
    }  
});

// Search the database to match the username and password .
app.post("/login", async (req, res) => {
	let username = req.body.username;
	let password = req.body.password;
    try {
        const searchResult = await User.findOne({ username: username });
        if(searchResult != null) { 
            if(searchResult.password === password) {
                req.session.loggedin = true;
                req.session.username = searchResult.username;
                req.session.userid = searchResult._id;
                const searchResult2 = await Artwork.find({});
                res.render('pages/home', { session: req.session, artworks: searchResult2 })
            } else {
                res.status(401).send("Not authorized. Invalid password.");
            }
        } else {
            res.status(401).send("Not authorized. Invalid password.");
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: "Error logging in."});
    }    

});

// Log the user out of the application.
app.get("/logout", (req, res) => {

    // Set the session loggedin property to false.
	if(req.session.loggedin) {
		req.session.loggedin = false;
	}
	res.redirect(`http://localhost:3000/home`);

});

// Find the user associated with the username 
app.get('/login/:userName', async (req, res) => {
    let username = req.params.userName;
    const searchResult = await Artwork.findOne({ artist: username });
    const users = await User.find({});
    if (searchResult != null) {
        res.render('pages/person', { artwork: searchResult, session: req.session, users: users});
    } else {
        // user does not have any artwork posted
        res.render('pages/person', { artwork: {artist: username}, session: req.session, users: users});
    }
    
});

// load a specific users page
app.post("/login/:userName", async (req, res) => {
    let username = req.params.userName;
    let action = req.body.action;
    // check if session user is following user they are viewing and update buttons accordingly
    if (req.session.loggedin) {
        if (action == "follow") {
            let userWithFollowing = await User.find({username: req.session.username});
            let arrayOfFollowing = userWithFollowing[0].following;
            arrayOfFollowing.push(username);
            await User.updateOne({username: req.session.username}, {$set: {following: arrayOfFollowing}});
            // update username "followers" array to include req.session.username
            let userWithFollowers = await User.find({username: username});
            let arrayOfFollowers = userWithFollowers[0].followers;
            arrayOfFollowers.push(req.session.username);
            await User.updateOne({username: username}, {$set: {followers: arrayOfFollowers}});

            res.send("processed!");
        } else {
            let userWithFollowing = await User.find({username: req.session.username});
            let arrayOfFollowing = userWithFollowing[0].following;
            arrayOfFollowing.splice(arrayOfFollowing.indexOf(username), 1);
            await User.updateOne({username: req.session.username}, {$set: {following: arrayOfFollowing}});
            // update username "followers" array to include req.session.username
            let userWithFollowers = await User.find({username: username});
            let arrayOfFollowers = userWithFollowers[0].followers;
            arrayOfFollowers.splice(arrayOfFollowing.indexOf(req.session.username), 1);
            await User.updateOne({username: username}, {$set: {followers: arrayOfFollowers}});

            res.send("processed!");
        }
    } else {
        res.status(404).send("Login account not found.");
    }
});

// gets the list of followers
app.get("/login/:userName/followers", async (req, res) => {
    let username = req.params.userName;
    let userWithFollowing = await User.find({username: username});
    res.render('pages/follwersAndFollowing', {name: username, session: req.session, followers: userWithFollowing[0].followers, type: "followers"});
});

// gets the list of following
app.get("/login/:userName/following", async (req, res) => {
    let username = req.params.userName;
    let userWithFollowing = await User.find({username: username});
    res.render('pages/follwersAndFollowing', {name: username, session: req.session, following: userWithFollowing[0].following, type: "following"});
});

// gets the add artwork page to get info from user
app.get("/login/:userName/addArtwork", async (req, res) => {
    let username = req.params.userName;
    if (username == req.session.username) {
        res.render('pages/addArtwork', {session: req.session});
    } else {
        res.status(401).send("Unautherized action.")
    }
});

// updates database with new artwork
app.post("/addArtwork", async (req, res) => {
    let newArtworkInfo = req.body;
    let allArtworks = await Artwork.find();
    let userWithArtworks = await User.findOne({username: req.session.username});
    let keepGoing = true;

    // check to see if name is unique, send error code if not
    for (let i = 0; i < allArtworks.length; i++) {
        if (allArtworks[i].name == newArtworkInfo.name) {
            res.status(400).send("Artwork name already exists.");
            keepGoing = false;
        }
    }
    if (keepGoing) {
        // update database with new artwork
        let updatedArtworksArray = userWithArtworks.artworks;
        updatedArtworksArray.push(newArtworkInfo);
        await User.updateOne({username: req.session.username}, {$set: {artworks: updatedArtworksArray}});
        await Artwork.insertMany(newArtworkInfo);
        res.send();
    }
});

// Save the new citizen to the database. 
app.post("/switch", async (req, res)=>{
    let switchTo = req.body.switch;
    await User.updateOne({username: req.session.username}, {$set: {profile: switchTo}});
    res.send();
});

// async function to load the data
const loadData = async () => {
	
	//Connect to the mongo database
  	const result = await mongoose.connect('mongodb://localhost:27017/data');
    return result;

};

// call to load the data
loadData()
  .then(() => {
    app.listen(3000);
    console.log("Server running on port 3000...");
  })
  .catch(err => console.log(err));
