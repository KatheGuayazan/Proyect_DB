////////////////////////////////////////////////////////////////////
//players colection

document.getElementById("submitPlayer").addEventListener("click", async (event) => {
    alert("llame al boton")
    event.preventDefault();
    alert("Button clicked");

    const idPlayer = document.getElementById("idPlayer").value;
    const name = document.getElementById("name").value;
    const username = document.getElementById("username").value;

    const data = {
        idPlayer: idPlayer,
        name: name,
        username: username,
    };

    fetch("http://localhost:3000/uploadnosql", {
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
});

//////////////////////////////////////////////////////////////////////
//matches coleccion 

document.getElementById("submitButton").addEventListener("click", async (event) => {
    alert("llame al boton")
    event.preventDefault();
    alert("Button clicked");

    const idMatches = document.getElementById("idMatches").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const score = document.getElementById("score").value;
    const LevelName = document.getElementById("LevelName").value;
    const levelId = document.getElementById("levelId").value;
    const difficultyName = document.getElementById("difficultyName").value;
    const difficultyId = document.getElementById("difficultyId").value;

    const data = {
        idMatches: idMatches,
        date: date,
        time: time,
        score: score,
        LevelName: LevelName,
        levelId: levelId,
        difficultyName: difficultyName,
        difficultyId: difficultyId
    };

    fetch("http://localhost:3000/matches", {
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
});

////////////////////////////////////////////////////////////////////
// CARGA MASIVA
////////////////////////////////////////////////////////////////////

// Functions to generate random data
const nombres = [
    "Alex", "Maria", "Carlos", "Ana", "Luis", "Sofia", "Diego", "Carmen", 
    "Miguel", "Laura", "Pedro", "Elena", "Jorge", "Lucia", "Rafael", 
    "Isabel", "Antonio", "Patricia", "Manuel", "Rosa", "Francisco", 
    "Monica", "Jose", "Andrea", "David", "Cristina"
];

const apellidos = [
    "Garcia", "Rodriguez", "Lopez", "Martinez", "Gonzalez", "Perez", 
    "Sanchez", "Ramirez", "Cruz", "Flores", "Gomez", "Morales", 
    "Jimenez", "Herrera", "Silva", "Castro", "Vargas", "Ortiz"
];

const niveles = [
    { id: 1, name: "Principiante" },
    { id: 2, name: "Intermedio" },
    { id: 3, name: "Avanzado" },
    { id: 4, name: "Experto" },
    { id: 5, name: "Maestro" }
];

const dificultades = [
    { id: 1, name: "Fácil" },
    { id: 2, name: "Normal" },
    { id: 3, name: "Difícil" },
    { id: 4, name: "Muy Difícil" },
    { id: 5, name: "Extremo" }
];

// Function to generate unique ID
function generarId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}
/*
let ultimoId = 0;

function generarId() {
    return Date.now();
}*/

// Function to generate random name
function generarNombreAleatorio() {
    const nombre = nombres[Math.floor(Math.random() * nombres.length)];
    const apellido = apellidos[Math.floor(Math.random() * apellidos.length)];
    return `${nombre} ${apellido}`;
}

// Function to generate random username
function generarUsernameAleatorio() {
    const prefijos = [1, 2, 3, 4, 5, 6, 7];
    const prefijo = prefijos[Math.floor(Math.random())];
    const numero = Math.floor(Math.random() * 9999);
    return `${numero}`;
}

// Function to generate random date (last 30 days)
function generarFechaAleatoria() {
    const hoy = new Date();
    const fechaInicio = new Date(hoy.getTime() - (30 * 24 * 60 * 60 * 1000));
    const fechaAleatoria = new Date(fechaInicio.getTime() + Math.random() * (hoy.getTime() - fechaInicio.getTime()));
    return fechaAleatoria.toISOString().split('T')[0];
}

// Function to generate random time
function generarHoraAleatoria() {
    const horas = Math.floor(Math.random() * 24).toString().padStart(2, '0');
    const minutos = Math.floor(Math.random() * 60).toString().padStart(2, '0');
    return `${horas}:${minutos}`;
}

// Function to generate random score
function generarScoreAleatorio() {
    return Math.floor(Math.random() * 10000) + 100;
}

// Function to get random level
function obtenerNivelAleatorio() {
    return niveles[Math.floor(Math.random() * niveles.length)];
}

// Function to get random difficulty
function obtenerDificultadAleatoria() {
    return dificultades[Math.floor(Math.random() * dificultades.length)];
}

// Function to generate a random player
function generarJugadorAleatorio() {
    return {
        idPlayer: generarId("PLY"),
        name: generarNombreAleatorio(),
        username: generarUsernameAleatorio()
    };
}

// Function to generate a random match
function generarMatchAleatorio() {
    const nivel = obtenerNivelAleatorio();
    const dificultad = obtenerDificultadAleatoria();
    
    return {
        idMatches: generarId("MTH"),
        date: generarFechaAleatoria(),
        time: generarHoraAleatoria(),
        score: generarScoreAleatorio(),
        LevelName: nivel.name,
        levelId: nivel.id,
        difficultyName: dificultad.name,
        difficultyId: dificultad.id
    };
}

//Main bulk load function
async function realizarCargaMasiva(cantidad) {
    const resultados = {
        jugadores: { exitosos: 0, fallidos: 0 },
        matches: { exitosos: 0, fallidos: 0 },
        errores: []
    };

    // Create progress indicator
    const progressContainer = document.createElement('div');
    progressContainer.innerHTML = `
        <div style="margin: 20px 0; padding: 15px; border: 1px solid #ccc; border-radius: 5px;">
            <h3>Progreso de Carga Masiva</h3>
            <div>Jugadores: <span id="progressPlayers">0</span>/${cantidad}</div>
            <div>Matches: <span id="progressMatches">0</span>/${cantidad}</div>
            <div style="margin-top: 10px;">
                <div style="background-color: #f0f0f0; height: 20px; border-radius: 10px;">
                    <div id="progressBar" style="background-color: #4CAF50; height: 100%; border-radius: 10px; width: 0%; transition: width 0.3s;"></div>
                </div>
            </div>
            <div id="statusMessage" style="margin-top: 10px; font-weight: bold;">Iniciando carga...</div>
        </div>
    `;
    
    // Insert after the generateButton button
    const generateButton = document.getElementById('generateButton');
    generateButton.parentNode.insertBefore(progressContainer, generateButton.nextSibling);

    const progressPlayers = document.getElementById('progressPlayers');
    const progressMatches = document.getElementById('progressMatches');
    const progressBar = document.getElementById('progressBar');
    const statusMessage = document.getElementById('statusMessage');

    try {
    // Generate data for bulk loading
        const jugadores = [];
        const matches = [];
        
        for (let i = 0; i < cantidad; i++) {
            jugadores.push(generarJugadorAleatorio());
            matches.push(generarMatchAleatorio());
        }

        // Send data to the server for bulk upload
        statusMessage.textContent = "Enviando datos al servidor...";
        
        const response = await fetch("http://localhost:3000/carga-masiva", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ jugadores, matches })
        });

        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status}`);
        }

        const resultado = await response.json();
        
        // Update interface with results
        progressPlayers.textContent = resultado.jugadores.exitosos;
        progressMatches.textContent = resultado.matches.exitosos;
        progressBar.style.width = '100%';
        statusMessage.textContent = "¡Carga completada!";
        statusMessage.style.color = "green";
        
        let mensaje = `Carga masiva completada:\n\n`;
        mensaje += `Jugadores - Exitosos: ${resultado.jugadores.exitosos}, Fallidos: ${resultado.jugadores.fallidos}\n`;
        mensaje += `Matches - Exitosos: ${resultado.matches.exitosos}, Fallidos: ${resultado.matches.fallidos}\n`;
        
        if (resultado.errores && resultado.errores.length > 0) {
            mensaje += `\nErrores encontrados: ${resultado.errores.length}`;
            console.log("Errores detallados:", resultado.errores);
        }
        
        alert(mensaje);

    } catch (error) {
        statusMessage.textContent = "Error en la carga masiva";
        statusMessage.style.color = "red";
        console.error("Error general en carga masiva:", error);
        alert("Error general en la carga masiva. Ver consola para detalles.");
    }
}

    // Event listener for the bulk upload button
document.addEventListener('DOMContentLoaded', function() {
    const generateButton = document.getElementById('generateButton');
    
    if (generateButton) {
        generateButton.addEventListener('click', async function(event) {
            event.preventDefault();
            
            const cantidadInput = document.querySelector('input[name="cantidad"]');
            const cantidad = parseInt(cantidadInput.value);
            
            if (cantidad < 1 || cantidad > 100) {
                alert("La cantidad debe estar entre 1 y 100");
                return;
            }
            
            const confirmar = confirm(`¿Estás seguro de que quieres generar ${cantidad} jugadores y ${cantidad} matches aleatorios?`);
            
            if (confirmar) {
                // Disable the button during loading
                const originalText = generateButton.textContent;
                generateButton.disabled = true;
                generateButton.textContent = "Cargando...";
                
                try {
                    await realizarCargaMasiva(cantidad);
                } finally {
                // Re-enable the button
                    generateButton.disabled = false;
                    generateButton.textContent = originalText;
                }
            }
        });
    }
});