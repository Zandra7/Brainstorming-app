const expressModul = require('express')
const pathModul = require('path')
const sqliteModul = require('sqlite3').verbose()

const app = expressModul()
const portNummer = 3000 // portnummeret serveren skal kjøre på

app.use(expressModul.json()) // tolke forespørsler som json
app.use(expressModul.static(__dirname)) // hoste static filer

// hente database
let database = new sqliteModul.Database("database.db", function(error){
    if(error){
        console.error(error.message) // viser error om det er noe galt
    } else {
        console.log("Database funnet") // skriver i konsollen at databasen er funnet
    }
})

app.get('/', function(forespørsel, response){
    response.sendFile(path.join(__dirname, 'index.html')) // sender deg til index.html
})

app.post("/", function(request, response){
    let sqlSporring = "SELECT * FROM users WHERE username = ? AND password = ?" // ? = placeholder
    let parameter = [request.body.username, request.body.password] // parameterene som skal settes inn i spørringen

    database.get(sqlSporring, parameter, function(error, row){ // kjører spørringen
        if (error) { 
            response.status(400).json({"error":error.message}) 
            return
        }
        if (row) { // hvis det er en rad i databasen med det brukernavnet og passordet
            response.json({
                "melding":"suksess",
                "data": row 
            })
        } else { 
            response.status(400).json({"error":"Feil brukernavn eller passord"}) // sender tilbake melding om at det er feil brukernavn eller passord
        }
    })
})

app.post("/signup", function(request, response) { // registrere ny bruker
    const username = request.body.username; 
    const password = request.body.password; 
    const insertSql = "INSERT INTO users (username, password) VALUES (?, ?)"; // spørring for å legge til bruker i databasen
    database.run(insertSql, [username, password], function(error) { // kjører spørringen
        if (error) {
            if (error.errno === 19){
                response.status(500).json({"error": "User already exists"}); // sender tilbake melding om at brukeren allerede eksisterer
                return;
            }
            response.status(500).json({"error": error}); // sender tilbake melding om at det har skjedd en feil
            return;
        }
        else {
            response.json({ "message": "User created successfully"}); // sender tilbake melding om at brukeren er opprettet
        }
    });
});

app.listen(portNummer, function(){ // starter serveren
    console.log(`Server kjører på http://localhost:${portNummer}`)
})