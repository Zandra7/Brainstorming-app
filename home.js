const urlParameter = new URLSearchParams(window.location.search)
const id = urlParameter.get("id")
const session = urlParameter.get("session")

const user = document.getElementById("user")

const roomBtn = document.getElementById("roomBtn")
const writeWrapper = document.getElementById("writeWrapper")
const saveIcon = document.getElementById("saveIcon")

const rom = document.getElementById("rom")
const roomInput = document.getElementById("roomInput")


function reload() { // Reloader siden | Skal egentlig bare ta deg tilbake så du kan se de to knappene igjen
    location.reload()
}

function createSession() {
    const response = fetch("/session", { // Fetcher fra /session pathen
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({owner: id}) // Sender id-en til brukeren som eier rommet
    })
    .then(response => response.json())
    .then(function(data){
        console.log("Fetch session returnerte:", data)
        if (data.error) {
            document.getElementById("error").textContent = data.error
        } 
        else {
            console.log(data)
            window.location.href = "home.html?id="+data.data.owner+"&session="+data.data.new_sessionid // Redirect til session.html
        }
    })
    .catch(error => console.error("Error:", error))
}

async function joinSession() {
    console.log("joinSession kjører")
    const sessionId = document.getElementById("roomInput").value;

    const urlParameter = new URLSearchParams(window.location.search)
    const userId = urlParameter.get("id")    

    const response = await fetch("/join", { // Fetcher fra /session pathen
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({sessionid: sessionId, userid: userId}) // Sender id-en til brukeren som eier rommet
    });
    console.log("joinSession har fetchet")

    if (response.ok) {
        const data = await response.json();
        console.log("joinSession har fått ok")
        window.location.href = "home.html?id="+userId+"&session="+sessionId // Redirect til session.html
    } else {
        const data = await response.json();
        document.getElementById("error").textContent = data.error;
        console.log(data.error);
    }
}

async function addIdea() { // Legger til ideen i databasen
    const content = document.getElementById("idea").value;
    const urlParameter = new URLSearchParams(window.location.search) 
    const userId = urlParameter.get("id")
    const sessionId = urlParameter.get("session")

    const response = await fetch("/addidea", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({content: content, userid: userId, sessionid: sessionId}) // Sender innholdet i ideen, id-en til brukeren som la den til og id-en til rommet den ble lagt til i
    });
    console.log("addIdea har fetchet")
    document.getElementById("idea").value = "" // Tømmer input-feltet

    if (response.ok) {
        const data = await response.json();
        console.log("addIdea har fått ok")
        const ideas = document.getElementById("ideas") 
        const idea = document.createElement("li") // Lager en ny li for hver ide
        idea.textContent = content // Setter teksten i li-en til innholdet i ideen
        ideas.appendChild(idea) // Legger til li-en i ul-en
    } else {
        const data = await response.json();
        document.getElementById("error").textContent = data.error; 
        console.log(data.error);
    }
}

async function logout() {
    const response = await fetch("/logout", { // Fetcher fra /session pathen
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({id: id}) // Sender id-en til brukeren som eier rommet
    });
    console.log("logout har fetchet")

    if (response.ok) {
        const data = await response.json();
        console.log("logout har fått ok")
        window.location.href = "index.html" // Redirect til index.html
    } else {
        const data = await response.json();
        document.getElementById("error").textContent = data.error;
        console.log(data.error);
    }
}

fetch("/user?id=" + id) // Fetcher brukeren med id-en som ble sendt med fra login.js
    .then(response => response.json())
    .then(function(data){
        console.log("Fetch user returnerte:", data)
        if (data.error) {
            user.textContent = data.error 
        } 
        else {
            user.textContent = data.data.username
        }
    })
    .catch(error => console.error("Error:", error))

if (!session) {
    saveIcon.style.display = "none"
}
    
if (session) {
    roomBtn.style.display = "none"
    writeWrapper.style.display = "block"

    rom.textContent = "Rom: " + session

    fetch("/ideas?sessionid=" + session) // Fetcher ideene med session-id-en som ble sendt med fra login.js
        .then(response => response.json())
        .then(function(data){
            console.log("Fetch ideas returnerte:", data)
            if (data.error) {
                document.getElementById("error").textContent = data.error 
            } 
            else {
                const ideas = document.getElementById("ideas")
                for (let i = 0; i < data.data.length; i++) {
                    const idea = document.createElement("li")
                    idea.textContent = data.data[i].content
                    ideas.appendChild(idea)
                }
            }
        })
        .catch(error => console.error("Error:", error))

    fetch("/activeusers?userid=" + id + "&sessionid=" + session) // Fetcher aktive brukere med bruker-id-en og session-id-en som ble sendt med fra login.js
        .then(response => response.json())
        .then(function(data){
            console.log("Fetch activeusers returnerte:", data)
            if (data.error) {
                document.getElementById("error").textContent = data.error 
            } 
            else {
                const activeUsers = document.getElementById("activeUsers")
                for (let i = 0; i < data.data.length; i++) {
                    const user = document.createElement("li")
                    user.textContent = data.data[i].username
                    activeUsers.appendChild(user)
                }
            }
        })
        .catch(error => console.error("Error:", error))

}