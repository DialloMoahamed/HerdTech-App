const utilisateurConnecter = JSON.parse(
    localStorage.getItem("UserConnecter")
);

if (!utilisateurConnecter) {
    window.location.href = "Login.html";
}

const welcome = document.getElementById("welcome");

welcome.innerText = `Bienvenue ${utilisateurConnecter.name}`;
