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

async function signup(){
    const signupUsername = document.getElementById("signup-username").value;
    const signupPassword = document.getElementById("signup-password").value;

    console.log("kjører")
    const response = await fetch("/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({signupUsername, signupPassword})
    });

    if (response.ok) {
        const data = await response.json();
        window.location.href = "Index.html"; // Redirect to login page after signup
    } else {
        const data = await response.json();
        document.getElementById("signup-error").textContent = data.error; // Display any errors
    }
}
