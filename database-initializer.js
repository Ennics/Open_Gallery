const mongoose = require("mongoose");
const Artwork = require("./ArtworkModel.js");
const User = require("./UserModel.js");
const gallery = require("./gallery.json");

//Array of registered users.
const users = [
	{'username': 'Corrine Hunt', 'password':'password', 'followers':[], 'following': [], 'artworks': []},
	{'username': 'Luke', 'password':'password', 'followers':[], 'following': [], 'artworks': []},
	{'username': 'Anatoliy Kushch', 'password':'password', 'followers':[], 'following': [], 'artworks': []},
	{'username': 'Lea Roche', 'password':'password', 'followers':[], 'following': [], 'artworks': []},
	{'username': 'Jim Dine', 'password':'password', 'followers':[], 'following': [], 'artworks': []},
	{'username': 'Shari Hatt', 'password':'password', 'followers':[], 'following': [], 'artworks': []},
	{'username': 'Sebastian McKinnon', 'password':'password', 'followers':[], 'following': [], 'artworks': []},
	{'username': 'Kimika Hara', 'password':'password', 'followers':[], 'following': [], 'artworks': []},
	{'username': 'Keith Mallett', 'password':'password', 'followers':[], 'following': [], 'artworks': []},
	{'username': 'ArtMind', 'password':'password', 'followers':[], 'following': [], 'artworks': []},
	{'username': 'BuzzFeed', 'password':'password', 'followers':[], 'following': [], 'artworks': []},
	{'username': 'Bella Marler', 'password':'password', 'followers':[], 'following': [], 'artworks': []},
	{'username': 'Bored Panda', 'password':'password', 'followers':[], 'following': [], 'artworks': []}
];

const loadData = async () => {
	// connect, remove database and start a new one
  	await mongoose.connect('mongodb://localhost:27017/data');
	await mongoose.connection.dropDatabase();

	// map each artwork object into a new Artwork model
	let artworkCollection = gallery.map( artwork => new Artwork(artwork));

	//Map each registered user object into the a new User model.
	let access = users.map( aUser => new User(aUser));

	// add artworks to appropriate users
	for (let i = 0; i < access.length; i++) {
		for (let j = 0; j < artworkCollection.length; j++) {
			if (access[i].username == artworkCollection[j].artist) {
				access[i].artworks.push(artworkCollection[j]);
				access[i].profile = "artist";
			}
		}
	}


	// create documents for collections 
	await Artwork.create(artworkCollection);
	await User.create(access);
}

loadData()
  .then((result) => {
	console.log("Closing database connection.");
	mongoose.connection.close();
  })
  .catch(err => console.log(err));