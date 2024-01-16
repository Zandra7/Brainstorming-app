const urlParameter = new URLSearchParams(window.location.search)
const id = urlParameter.get("id")

const user = document.getElementById("user")

const roomBtn = document.getElementById("roomBtn")
const writeWrapper = document.getElementById("writeWrapper")

function reload() { // Reloader siden | Skal egentlig bare ta deg tilbake så du kan se de to knappene igjen
    location.reload()
}

function hideBtn() { // Skjuler knappen for å lage rom og viser skjemaet for å skrive meldinger
    roomBtn.style.display = "none"
    writeWrapper.style.display = "block"
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