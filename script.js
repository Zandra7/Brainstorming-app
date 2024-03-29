// Kode som inkluderes i Index.html og Signup.html:

async function login(event){
    event.preventDefault(); // Hindrer formen fra å submitte
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value

    const respons = await fetch("/login", { // Fetcher fra /login pathen
        method:"POST", 
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({username, password}) 
    })

    if (respons.ok) { 
        const data = await respons.json() 
        window.location.href = "home.html?id="+data.data.id // Redirect til home.html
    } else {
        const data = await respons.json() 
        document.getElementById("error").textContent = data.error
    }
}

async function signup(event){
    event.preventDefault(); // Prevent the form from submitting
    const signupUsername = document.getElementById("signup-username").value;
    const signupPassword = document.getElementById("signup-password").value;
    
    const response = await fetch("/signup", { // Fetcher fra /signup pathen
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({username: signupUsername, password: signupPassword}) // Sender brukernavn og passord
    });

    if (response.ok) {
        const data = await response.json();
        window.location.href = "Index.html"; // Redirect til index.html
    } else {
        const data = await response.json();
        document.getElementById("error").textContent = data.error;
        console.log(data.error);
    }
}