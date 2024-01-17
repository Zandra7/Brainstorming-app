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
}