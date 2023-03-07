// code from t9 demo
window.addEventListener('load', () => { 
    document.getElementById("submit").onclick = save;
});

function save(){
    // assign user input to variables
	document.getElementById("error").innerHTML = "";
	let name = document.getElementById("name").value;
	let pass = document.getElementById("pass").value;
	let newUser = { username: name, password: pass };
	
    // make a /register POST request to server
	fetch(`http://localhost:3000/register`, { 
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
    })
    .then((response) => {
        if (!response.ok) {
			document.getElementById("name").value = '';
			document.getElementById("pass").value = '';
			document.getElementById("error").innerHTML = "That username is taken. Please use a different username.";
        } else {
			location.href=`http://localhost:3000/home`;
		}
    })
    .catch((error) => console.log(err));
}