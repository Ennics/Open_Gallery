window.addEventListener('load', () => { 
    if (document.getElementById("follow") != null) {
        if (document.getElementById("follow").innerHTML == "Follow") {
            document.getElementById("follow").onclick = follow;
        } else {
            document.getElementById("follow").onclick = unfollow;
        }
    } else if (document.getElementById("switch") != null) {
        document.getElementById("switch").onclick = switchAccounts;
    }
});

function follow() {
    // make a /login/:username POST request to server
    let action = {action: "follow"};
	fetch(`http://localhost:3000/login/${document.getElementById("username").innerHTML}`, { 
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(action)
    })
    .then((response) => {
        location.href=`http://localhost:3000/login/${document.getElementById("username").innerHTML}`;
    })
    .catch((error) => console.log(err));
}

function unfollow() {
    // make a /login/:username POST request to server
    let action = {action: "unfollow"};
    fetch(`http://localhost:3000/login/${document.getElementById("username").innerHTML}`, { 
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(action)
    })
    .then((response) => {
        location.href=`http://localhost:3000/login/${document.getElementById("username").innerHTML}`;
    })
    .catch((error) => console.log(err));
}

function switchAccounts() {
    let switchingTo = document.getElementById("switchTo").innerHTML;
    if (switchingTo == "Patron") {
        let action = {switch: "patron"};
        fetch(`http://localhost:3000/switch`, { 
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(action)
        })
        .then((response) => {
            location.href=`http://localhost:3000/login/${document.getElementById("username").innerHTML}`;
        })
        .catch((error) => console.log(err));
    } else {
        let action = {switch: "artist"};
        fetch(`http://localhost:3000/switch`, { 
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(action)
        })
        .then((response) => {
            location.href=`http://localhost:3000/login/${document.getElementById("username").innerHTML}`;
        })
        .catch((error) => console.log(err));
    }
}