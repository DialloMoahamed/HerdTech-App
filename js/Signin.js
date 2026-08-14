const users = JSON.parse(localStorage.getItem("User")) || [];

const form = document.getElementById("Sform");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Récupération des valeurs du formulaire
    const name = document.getElementById("nom").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmpassword = document.getElementById("confirmpassword").value;

    // Vérification de la confirmation du mot de passe
    if (password !== confirmpassword) {
        alert("La confirmation du mot de passe est incorrecte.");
        return;
    }

    // Vérification de l'existence de l'email
    const emailExiste = users.some((user) => user.email === email);

    if (emailExiste) {
        alert("Cet email possède déjà un compte.");
        return;
    }

    // Génération d'un ID unique
    let id;

    if (users.length === 0) {
        id = 1;
    } else {
        const dernierId = Math.max(...users.map((user) => user.id));
        id = dernierId + 1;
    }

    // Création du nouvel utilisateur
    const nouvelUtilisateur = {
        id: id,
        name: name,
        email: email,
        password: password
    };

    // Ajout de l'utilisateur
    users.push(nouvelUtilisateur);

    // Sauvegarde des utilisateurs
    localStorage.setItem("User", JSON.stringify(users));

    console.log("Nouvel utilisateur :", nouvelUtilisateur);
    console.log("Tous les utilisateurs :", users);

    alert("Compte créé avec succès !");

    // Retour vers la page de connexion
    window.location.href = "Login.html";
});