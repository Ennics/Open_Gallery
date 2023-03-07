window.addEventListener('load', () => {
    document.getElementById("addArtwork").addEventListener("click", addArtwork);
});

function addArtwork() {  
    // get user input and assign it to variables
    let name = document.getElementById("name").value;
    let year = document.getElementById("year").value;
    let category = document.getElementById("category").value;
    let medium = document.getElementById("medium").value;
    let description = document.getElementById("description").value;
    let url = document.getElementById("url").value;

    // new artwork object
    let newArtwork = {'name': name, 'artist': document.getElementById("username").innerHTML, 'year': year, 'category': category, 'medium': medium, 'description': description, 'image': url}; 

    // send post request to update db from server
    fetch(`http://localhost:3000/addArtwork`, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newArtwork)
    })
    .then((response) => {
        if (!response.ok) {
            location.href=`http://localhost:3000/login/${document.getElementById("username").innerHTML}/addArtwork`;
        } else {
            location.href=`http://localhost:3000/login/${document.getElementById("username").innerHTML}`;
        }
    })
    .catch((error) => console.log(error));
}