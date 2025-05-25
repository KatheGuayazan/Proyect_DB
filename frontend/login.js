// register user
document.getElementById("submitPlayer").addEventListener("click", () => {
    // get input values
    const idPlayer = document.getElementById("idPlayer").value;
    const name = document.getElementById("name").value;
    const username = document.getElementById("username").value;

    // check if all fields are filled
    if (!idPlayer || !name || !username) {
        alert("all fields are required.");
        return;
    }

    // create data object
    const data = {
        idPlayer: idPlayer,
        name: name,
        username: username
    };

    // send post request to register
    fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            // check if response is ok
            if (response.ok) {
                return response.text();
            } else {
                throw new Error("registration failed.");
            }
        })
        .then(message => {
            // show success message and clear fields
            alert(message);
            document.getElementById("idPlayer").value = "";
            document.getElementById("name").value = "";
            document.getElementById("username").value = "";
        })
        .catch(error => {
            // handle error
            console.error("error:", error);
            alert("an error occurred while registering.");
        });
});

// load players list
document.getElementById('loadBtn').addEventListener('click', () => {
    fetch('http://localhost:3000/players')
        .then(response => response.json())
        .then(data => {
            // get player list element
            const list = document.getElementById('playerList');
            list.innerHTML = ''; // clear previous list
            // add each player to the list
            data.forEach(player => {
                const item = document.createElement('li');
                item.textContent = `id: (${player.idPlayer}) name: (${player.name}) username: (${player.username})`;
                list.appendChild(item);
            });
        })
        .catch(error => console.error('error:', error));
});

// migrate players
document.getElementById("migrateBtn").addEventListener("click", () => {
    fetch("http://localhost:3000/migrar-players")
        .then(response => response.json())
        .then(result => {
            // show migration result
            alert(`migración completada:\néxitos: ${result.exitosos}\nfallos: ${result.fallidos}`);
        })
        .catch(error => {
            // handle migration error
            console.error("error al migrar jugadores:", error);
            alert("hubo un error al migrar los datos.");
        });
});

