const fs = require('fs');

const users = JSON.parse(fs.readFileSync('users.json', 'utf8'));

for (let user of users) {
    let bodyContent = JSON.stringify(user);

    fetch("http://localhost:3001/api/adduser", {
        method: "POST",
        body: bodyContent,
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then(response => response.json())
        .then(json => console.log(json))
        .catch(error => console.error(error));
}