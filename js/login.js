const users = JSON.parse(localStorage.getItem('User')) || [];
const form = document.getElementById("Sform");
console.log("FORM :", form);


form.addEventListener("submit", (event) => {
     event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log("EMAIL :", email);
    console.log("PASSWORD :", password);


    const utilisateurExiste = users.find(
        (user) => user.email === email && user.password === password);

    if (utilisateurExiste) {
        localStorage.setItem("UserConnecter", JSON.stringify(utilisateurExiste));
        window.location.href = "index.html";
        return
    }


        alert("email ou mot de passe incorrect")
    } 
);
