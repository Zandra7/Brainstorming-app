const expressModul = require('express')
const pathModul = require('path')
const sqliteModul = require('sqlite3').verbose()

const app = expressModul() // express modul instans
const portNummer = 3000

app.use(expressModul.json()) // tolke forespørsler som json
app.use(expressModul.static(__dirname)) // hoste static filer

// hente database
let database = new sqliteModul.Database("database.db", function(error){
    if(error){
        console.error(error.message) // Viser error om det er noe galt
    } else {
        console.log("Database funnet") // viser at databasen er åpnet
    }
})

app.get('/', function(forespørsel, response){
    response.sendFile(path.join(__dirname, 'index.html'))
})

app.post("/", function(foresporsel, respons){
    let sqlSporring = "SELECT * FROM users WHERE username = ? AND password = ?" // ? er placeholder
    let parameter = [foresporsel.body.username, foresporsel.body.password] // parameterene som skal settes inn i spørringen

    database.get(sqlSporring, parameter, function(error, rad){
        if (error) {
            respons.status(400).json({"error":error.message})
            return
        }
        if (rad) {
            respons.json({
                "melding":"suksess",
                "data": rad
            })
        } else {
            respons.status(400).json({
                "error":"Feil brukernavn eller passord"
            })
        }
    })
})

app.post("/signup", function(request, response) {
    const username = request.body.username;
    const password = request.body.password;
    const insertSql = "INSERT INTO users (username, password) VALUES (?, ?)";
    database.run(insertSql, [username, password], function(error) {
        if (error) {
            response.status(500).json({"error": error.message});
            return;
        }
        response.json({ "message": "User created successfully" });
    });
});

app.get("/profil/:id", function(foresporsel, respons){
    const id = foresporsel.params.id
    database.get("SELECT * FROM users WHERE id = ?", id, function(error, rad){
        if (error) {
            respons.status(500).json({error: error.message})
            return
        } 
        if (rad) {
            respons.json(rad)
        } else {
            respons.status(404).json({error: "Ingen bruker med denne IDen finnes"})
        }
    })
})

app.listen(portNummer, function(){
    console.log(`Server kjører på http://localhost:${portNummer}`)
})