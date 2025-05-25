import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { FirestoreService } from './nosql/firestore_service.js';
import SqlConnection from './sql/connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

const imagesService = new FirestoreService("LoginApp");

// Middleware básico
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
/*
// Configuración de Multer para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// POST /upload — subir imagen y guardar nombre en Firestore
app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');

  try {
    await imagesService.PostDocument(req.file.filename, {
      filename: req.file.filename,
      uploadedAt: new Date().toISOString()
    });
    res.send(`Image uploaded: ${req.file.filename}`);
  } catch (error) {
    console.error("Firestore error:", error);
    res.status(500).send('Error saving image info.');
  }
});
*/

// POST /register — insertar usuario en base de datos SQL
app.post('/register', async (req, res) => {
  const { idPlayer, name, username } = req.body;
  if (!idPlayer || !name || !username) return res.status(400).send("Missing fields.");

  const db = new SqlConnection();

  try {
    await db.connectToDb();
    await db.query(
      "INSERT INTO player (idPlayer, name, username) VALUES (?, ?, ?)",
      [idPlayer, name, username]
    );
    res.status(200).send("User registered.");
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).send("Error registering user.");
  } finally {
    await db.closeConnection();
  }
});

// GET /user/:username — consultar usuario en base de datos SQL
app.get('/player/:username', async (req, res) => {
  const db = new SqlConnection();
  try {
    await db.connectToDb();
    const result = await db.query(
      "SELECT * FROM player WHERE username = ?",
      [req.params.username]
    );
    await db.closeConnection();

    if (result.length === 0) {
      res.status(404).send("User not found.");
    } else {
      res.status(200).json(result[0]);
    }
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).send("Error retrieving user.");
  }
});

app.post('/uploadsql', async (req, res) => {
  const { idPlayer, name, username } = req.body;
  if (!idPlayer || !name || !username) return res.status(400).send("Missing fields.");

  
  const data = {
    idPlayer: idPlayer,
    name: name,
    username: username
  }

  try {
    const db = new FirestoreService("Users");
    await db.PostDocument(idPlayer, data);
    res.status(200).send("User registered.");
  } catch (err) {
    console.error("noSQL error:", err);-
    res.status(500).send("Error registering user.");
  } finally {
    await db.closeConnection();
  }
});

app.get('/players', async (req, res) => {
  const db = new SqlConnection();
  try {
    await db.connectToDb();
    const results = await db.query('SELECT * FROM player');
    res.json(results);
  } catch (err) {
    console.error('SQL error:', err);
    res.status(500).json({ error: 'Error al obtener datos' });
  } finally {
    await db.closeConnection();
  }
});


//////////////////////////////////////////////////////////////////////
app.get('/migrar-players', async (req, res) => {
  const firestore = new FirestoreService("players");
  const db = new SqlConnection();

  try {
    const documents = await firestore.getAllDocuments(); // Necesitas este método en firestore_service.js

    if (!documents || documents.length === 0) {
      return res.status(404).send("No hay jugadores en Firebase.");
    }

    await db.connectToDb();

    let exitosos = 0;
    let fallidos = 0;

    for (const doc of documents) {
      const { idPlayer, name, username } = doc;

      try {
        await db.query(
          "INSERT INTO player (idPlayer, name, username) VALUES (?, ?, ?)",
          [idPlayer, name, username]
        );
        exitosos++;
      } catch (err) {
        console.error("Error insertando jugador:", idPlayer, err.message);
        fallidos++;
      }
    }

    res.status(200).json({ mensaje: "Migración completada", exitosos, fallidos });

  } catch (error) {
    console.error("Error general en migración:", error);
    res.status(500).send("Error durante la migración.");
  } finally {
    await db.closeConnection();
  }
});

/*
// POST /register — insertar usuario en base de datos SQL
app.post('/register', async (req, res) => {
  const {idMatches, date, time, score, levelIdLevel, LavelName, difficultyIdDifficulty, difficultyName} = req.body;
  if (!idMatches || !date || !time || !score || !levelIdLevel || !LavelName || !difficultyIdDifficulty || !difficultyName) return res.status(400).send("Missing fields.");

  const db = new SqlConnection();

  try {
    await db.connectToDb();
    await db.query(
      "INSERT INTO player (idMatches, date, time, score, levelIdLevel, LavelName, difficultyIdDifficulty, difficultyName, player_idPlayer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)",
      [idMatches, date, time, score, levelIdLevel, LavelName, difficultyIdDifficulty, difficultyName, player_idPlayer]
    );
    res.status(200).send("User registered.");
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).send("Error registering user.");
  } finally {
    await db.closeConnection();
  }
});
*/
////////////////////////////////////////////////////////
// function to Upload player colection
app.post('/uploadnosql', async (req, res) => {
  const { idPlayer, name, username } = req.body; 
 
  const data = {
    idPlayer: idPlayer,
    name: name,
    username: username,
  }
  
  const firestore = new FirestoreService("players");
 
  try {
    await firestore.PostDocument(idPlayer, data);
    res.status(200).send("User registered.");
  } catch (err) {
    console.error("noSQL error:", err);
    res.status(500).send("Error registering user.");
  }
});

/////////////////////////////////////
// function to Upload matches colection
app.post('/matches', async (req, res) => {
  const { idMatches, date, time, score, LevelName, levelId, difficultyName, difficultyId} = req.body; 
 
  const data = {
        idMatches: idMatches,
        date: date,
        time: time,
        score: score,
        LevelName: LevelName,
        levelId: levelId,
        difficultyName: difficultyName,
        difficultyId: difficultyId
  }
  
  const firestore = new FirestoreService("matches");
 
  try {
    await firestore.PostDocument(idMatches, data);
    res.status(200).send("User registered.");
  } catch (err) {
    console.error("noSQL error:", err);
    res.status(500).send("Error registering user.");
  }
});

////////////////////////////////////////////////////////////////////
// MASSIVE LOAD
////////////////////////////////////////////////////////////////////

// Function to process bulk load
app.post('/carga-masiva', async (req, res) => {
  const { jugadores, matches } = req.body;

  if (!jugadores || !matches) {
    return res.status(400).json({ 
      error: "Se requieren arrays de jugadores y matches" 
    });
  }

  const resultados = {
    jugadores: { exitosos: 0, fallidos: 0 },
    matches: { exitosos: 0, fallidos: 0 },
    errores: []
  };

  try {
    // Process players
    console.log(`Iniciando carga masiva: ${jugadores.length} jugadores y ${matches.length} matches`);
    
    const firestorePlayers = new FirestoreService("players");
    
    for (let i = 0; i < jugadores.length; i++) {
      try {
        const jugador = jugadores[i];
        await firestorePlayers.PostDocument(jugador.idPlayer, jugador);
        resultados.jugadores.exitosos++;
        
      // Log every 10 records for tracking
        if ((i + 1) % 10 === 0) {
          console.log(`Procesados ${i + 1}/${jugadores.length} jugadores`);
        }
      } catch (error) {
        resultados.jugadores.fallidos++;
        resultados.errores.push(`Error jugador ${i + 1}: ${error.message}`);
        console.error(`Error procesando jugador ${i + 1}:`, error);
      }
    }

    // Process matches
    const firestoreMatches = new FirestoreService("matches");
    
    for (let i = 0; i < matches.length; i++) {
      try {
        const match = matches[i];
        await firestoreMatches.PostDocument(match.idMatches, match);
        resultados.matches.exitosos++;
        
    // Log every 10 records for tracking
        if ((i + 1) % 10 === 0) {
          console.log(`Procesados ${i + 1}/${matches.length} matches`);
        }
      } catch (error) {
        resultados.matches.fallidos++;
        resultados.errores.push(`Error match ${i + 1}: ${error.message}`);
        console.error(`Error procesando match ${i + 1}:`, error);
      }
    }

    console.log('Carga masiva completada:', resultados);
    
    // Send results to the client
    res.status(200).json(resultados);

  } catch (error) {
    console.error("Error general en carga masiva:", error);
    res.status(500).json({ 
      error: "Error interno del servidor durante la carga masiva",
      detalles: error.message 
    });
  }
});



app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});