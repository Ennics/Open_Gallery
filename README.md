# Open_Gallery
- General Information -
Written by: Nicholas Nicolaev 

- Description -
An open gallery website. Users can register a new account, log into an existing account or view artworks as a guest that is logged out with limited functionality. Once registered, a user can log in with a unique username and a password of their choice. All new accounts are “patron” accounts that only allow the user to follow other users with no ability to add artwork of their own. The user can switch to an “artist” account that will allow them to add their own artwork and they may switch back to a patron account whenever they please. The user can follow and unfollow other accounts and view their profiles. All artworks that are uploaded are saved in the database.

- How to Run -
1. Open a terminal
2. Enter the directory in which this file resides
3. Type "npm install" in the terminal
4. Ensure a mongo-db service is running on your machine
5. Type “node database-initializer.js” to start up the database
6. Type “node server.js” to run the server
7. Open "localhost:3000" in your browser to view the home page, explore the website from here
8. Press ctrl + c in terminal to close server
9. 
- Overall Design -
Starting with the files, they are all organized in separate folders for proper separation of html
(pug), css and javascript. The client side javascript is handled in the public/js folder and is responsible for some of the buttons functionality across the website. The client communicates with the server and updates the database where necessary. If there are any errors, a proper error code is sent by the server along with an appropriate message. A design choice that would have made the code even more organized would have been to add routers to handle the pug pages instead of hard coding them all into the server.js file. This would have resulted in a much more organized server.js file.
