// Registrar usuario
document.getElementById("submitPlayer").addEventListener("click", () => {
    const idPlayer = document.getElementById("idPlayer").value;
    const name = document.getElementById("name").value;
    const username = document.getElementById("username").value;

    if (!idPlayer || !name || !username) {
        alert("All fields are required.");
        return;
    }

    const data = {
        idPlayer: idPlayer,
        name: name,
        username: username
    };

    fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error("Registration failed.");
            }
        })
        .then(message => {
            alert(message);
            document.getElementById("idPlayer").value = "";
            document.getElementById("name").value = "";
            document.getElementById("username").value = "";
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred while registering.");
        });
});

  document.getElementById('loadBtn').addEventListener('click', () => {
    fetch('http://localhost:3000/players')
      .then(response => response.json())
      .then(data => {
        const list = document.getElementById('playerList');
        list.innerHTML = ''; // Limpia lista previa si ya se cargó
        data.forEach(player => {
          const item = document.createElement('li');
          item.textContent = `Id: (${player.idPlayer}) name: (${player.name}) username: (${player.username})`;
          list.appendChild(item);
        });
      })
    .catch(error => console.error('Error:', error));
  });

document.getElementById("migrateBtn").addEventListener("click", () => {
  fetch("http://localhost:3000/migrar-players")
    .then(response => response.json())
    .then(result => {
      alert(`Migración completada:\nÉxitos: ${result.exitosos}\nFallos: ${result.fallidos}`);
    })
    .catch(error => {
      console.error("Error al migrar jugadores:", error);
      alert("Hubo un error al migrar los datos.");
    });
});

/*  document.getElementById("submitMatches").addEventListener("click", () => {
    const idMatches = document.getElementById("idMatches").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const score = document.getElementById("score").value;
    const levelIdLevel = document.getElementById("levelIdLevel").value;
    const LavelName = document.getElementById("LavelName").value;
    const difficultyIdDifficulty = document.getElementById("difficultyIdDifficulty").value;
    const difficultyName = document.getElementById("difficultyName").value;

    if (!idMatches || !date || !time || !score || !levelIdLevel || !LavelName || !difficultyIdDifficulty || !difficultyName) {
        alert("All fields are required.");
        return;
    }

    const data = {
        idMatches: idMatches,
        date: date,
        time: time,
        score: score,
        levelIdLevel: levelIdLevel,
        LavelName: LavelName,
        difficultyIdDifficulty: difficultyIdDifficulty,
        difficultyName: difficultyName,
    };

    fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error("Registration failed.");
            }
        })
        .then(message => {
            alert(message);
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred while registering.");
        });
});*/