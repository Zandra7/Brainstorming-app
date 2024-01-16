const urlParameter = new URLSearchParams(window.location.search)
const id = urlParameter.get("id")

const user = document.getElementById("user")

const roomBtn = document.getElementById("roomBtn")
const writeWrapper = document.getElementById("writeWrapper")

function hideBtn() {
    roomBtn.style.display = "none"
    writeWrapper.style.display = "block"
}

fetch("/user?id=" + id)
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