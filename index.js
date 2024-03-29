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

app.get('/', function(request, response){
    response.sendFile(path.join(__dirname, 'index.html')) // sender deg til index.html
})

app.get('/user', function(request, response){
    let sqlSporring = "SELECT * FROM users WHERE id = ?" // spørring for å hente bruker med en bestemt id
    let parameter = [request.query.id] // parameteren som skal settes inn i spørringen

    database.get(sqlSporring, parameter, function(error, row) { // kjører spørringen
        if (error) {
            response.status(500).json({"error":error.message}) // internal database error
            return
        }
        if (row) { // hvis det er en rad i databasen med den id-en
            response.json({
                "melding":"suksess",
                "data": row 
            })
        } else {
            response.status(400).json({"error":"Bruker ikke funnet"}) // sender tilbake melding om at brukeren ikke ble funnet
        }
    })
})

app.post("/login", function(request, response){
    let sqlSporring = "SELECT * FROM users WHERE username = ? AND password = ?" // ? = placeholder
    let parameter = [request.body.username, request.body.password] // parameterene som skal settes inn i spørringen

    database.get(sqlSporring, parameter, function(error, row){ // kjører spørringen
        if (error) {
            response.status(500).json({"error":error.message}) // internal database error
            return
        }
        if (row) { // hvis det er en rad i databasen med det brukernavnet og passordet
            response.json({
                "melding":"suksess",
                "data": row 
            })
            // kjør spørring som setter aktiv i users tabellen til 1
            let sqlSporring = "UPDATE users SET active = 1 WHERE id = ?" 
            let parameter = [row.id] // parameteren som skal settes inn i spørringen
            database.run(sqlSporring, parameter, function(error){ // kjører spørringen
                if (error) {
                    console.log(error.message)
                } else {
                    console.log("Bruker aktivert")
                }
            })
            console.log("Logget inn", row)
        } else { 
            response.status(400).json({"error":"Feil brukernavn eller passord"}) // sender tilbake melding om at det er feil brukernavn eller passord
        }
    })
})

app.post("/logout", function(request, response){
    let parameter = [request.body.id] // parameteren som skal settes inn i spørringe
    // kjør spørring som setter aktiv i users tabellen til 0
    let sqlSporring = "UPDATE users SET active = 0 WHERE id = ?" 
    database.run(sqlSporring, parameter, function(error){ // kjører spørringen
        if (error) {
            console.log(error.message)
            response.status(500).json({"error":error.message}) // internal database error
        } else {
            console.log("Bruker deaktivert")
            response.json({ "message": "Logged out successfully"}); // sender tilbake melding om at brukeren har logget ut
        }
    })
    console.log("Logget ut brukerid: ", request.body.id)
})

// registrere ny bruker
app.post("/signup", function(request, response) { 
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

// add user to session
function addUserToSession(sessionid, userid) {
    const insertSql = "INSERT INTO user_session_conn (session_id, user_id) VALUES (?, ?)"; // spørring for å legge til bruker i rom
    database.run(insertSql, [sessionid, userid], function(error) { // kjører spørringen
        if (error) {
            console.log("Bruker allerede i rom");
        }
        else {
            console.log("Bruker lagt til i rom, userid = ", userid, "sessionid = ", sessionid);
        }
    });
}

// lage nytt rom
app.post("/session", function(request, response) {
    const owner = request.body.owner; 
    const insertSql = "INSERT INTO sessions (owner) VALUES (?)"; // spørring for å legge til rom i databasen
    database.run(insertSql, [owner], function(error) { // kjører spørringen
        if (error) {
            response.status(500).json({"error": error}); // sender tilbake melding om at det har skjedd en feil
            return;
        }
        else {
            addUserToSession(this.lastID, owner); // legger til brukeren i rommet
            console.log("Nytt rom har id=",this.lastID);
            response.json({ // sender tilbake melding om at rommet er opprettet
                "message": "Session created successfully",
                "data": {
                    "new_sessionid" : this.lastID,
                    "owner": owner
                }
            });
        }
    });
})

// legge til bruker i rom
app.post("/join", function(request, response) {
    const sessionid = request.body.sessionid;
    const userid = request.body.userid;

    let sqlSporring = "SELECT * FROM sessions WHERE id = ?"; // spørring for å hente rom med en bestemt session-id
    let parameter = [request.body.sessionid]; // parameteren som skal settes inn i spørringen

    database.get(sqlSporring, parameter, function(error, row) {
        if (error) {
            response.status(500).json({"error": error});
            return;
        }
        else {
            if (row) { // hvis det er en rad i databasen med den session-id-en
                addUserToSession(sessionid, userid); // legger til brukeren i rommet
                response.json({
                    "message": "Session joined successfully",
                    "data": row
                });
            } else {
                response.status(400).json({"error": "Session not found"}); // sender tilbake melding om at rommet ikke ble funnet
            }
        }
    });
})

app.post("/addidea", function(request, response) { // legge til ide i rom
    const sessionid = request.body.sessionid;
    const userid = request.body.userid;
    const content = request.body.content;

    const insertSql = "INSERT INTO ideas (session_id, user_id, content) VALUES (?, ?, ?)"; // spørring for å legge til ide i rom
    database.run(insertSql, [sessionid, userid, content], function(error) { // kjører spørringen
        console.log(sessionid, userid, content)
        if (error) {
            response.status(500).json({"error": error}); // sender tilbake melding om at det har skjedd en feil
            return;
        }
        else {
            response.json({ // sender tilbake melding om at ideen er lagt til
                "message": "Idea added successfully",
                "data": {
                    "new_ideaid" : this.lastID, 
                    // trenger egentlig ikke sende dette tilbake til klienten
                    "sessionid": sessionid,
                    "userid": userid,
                    "content": content
                }
            });
        }
    });
})

app.get('/ideas', function(request, response){ // hente ideer
    let sqlSporring = "SELECT * FROM ideas WHERE session_id = ? ORDER BY id" // spørring for å hente ideer med en bestemt session-id
    let parameter = [request.query.sessionid] // parameteren som skal settes inn i spørringen

    database.all(sqlSporring, parameter, function(error, rows) { // kjører spørringen
        if (error) {
            response.status(500).json({"error":error.message}) // internal database error
            return
        }
        if (rows) { // hvis det er en rad i databasen med den session-id-en
            response.json({
                "melding":"suksess",
                "data": rows 
            })
        } else {
            response.status(400).json({"error":"Ideer ikke funnet"}) // sender tilbake melding om at ideene ikke ble funnet
        }
    })
})

// hent alle aktive brukere dersom man er logget inn som eier av sessionen
app.get('/activeusers', function(request, response){
    let parameter = [request.query.userid] // parameteren som skal settes inn i spørringen
    // skjekker om du er eier av en session
    let sqlSporring = "SELECT * FROM sessions WHERE owner = ?"
    database.all(sqlSporring, parameter, function(error, rows) { // kjører spørringen
        if (error) {
            response.status(500).json({"error":error.message}) // internal database error
            return
        }
        if (rows.length>0) { // hvis det er en rad i databasen med den bruker-id-en
            let sqlSporring = "SELECT * FROM users WHERE active = 1" // spørring for å hente aktive brukere
            database.all(sqlSporring, function(error, rows) { // kjører spørringen
                if (error) {
                    response.status(500).json({"error":error.message}) // internal database error
                    return
                }
                if (rows) { // hvis det er en rad i databasen med den bruker-id-en
                    response.json({ 
                        "melding":"suksess",
                        "data": rows 
                    })
                    console.log("Aktive brukere", rows)
                } else {
                    response.json({
                        "melding":"suksess, men ingen aktive brukere",
                        "data": [] 
                    })
                } 
            })
        } else {
            response.json({
                "melding":"suksess, men du er ikke eier av et rom",
                "data": [] 
            })
        }
    })

})

app.listen(portNummer, function(){ // starter serveren
    console.log(`Server kjører på http://localhost:${portNummer}`)
})