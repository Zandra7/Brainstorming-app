async function login(){
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value

    const respons = await fetch("/", {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({username, password})
    })

    if (respons.ok) {
        const data = await respons.json()
        window.location.href = "home.html"
    } else {
        const data = await respons.json()
        document.getElementById("error").textContent = data.feilmelding
    }
}