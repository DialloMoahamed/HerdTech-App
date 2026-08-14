const utilisateurConnecter = JSON.parse(
    localStorage.getItem("UserConnecter")
);

if (!utilisateurConnecter) {
    window.location.href = "Login.html";
}

const welcome = document.getElementById("welcome");

welcome.innerText = `Bienvenue ${utilisateurConnecter.name}`;

const userId = utilisateurConnecter.id;

const addData = document.getElementById("addData");
const dataList = document.getElementById("dataList");

const datas = JSON.parse(localStorage.getItem("Data")) || [];

// Générer le prochain ID
let id = 1;

if (datas.length > 0) {
    const dernierId = Math.max(
        ...datas.map((data) => data.id)
    );

    id = dernierId + 1;
}


// Fonction pour afficher uniquement les données de l'utilisateur connecté
function afficherMesDonnees() {

    const datasUtilisateur = datas.filter(
        (data) => data.userId === userId
    );

    let affichage = "";

    datasUtilisateur.forEach((data) => {
        affichage += `ID: ${data.id} - ${data.name}\n`;
    });

    dataList.innerText = affichage;
}


// Afficher les données dès l'arrivée sur la page
afficherMesDonnees();


// Ajouter une donnée
addData.addEventListener("click", () => {

    const data = {
        id: id,
        userId: userId,
        name: utilisateurConnecter.name
    };

    datas.push(data);

    localStorage.setItem(
        "Data",
        JSON.stringify(datas)
    );

    console.log("Nouvelle donnée :", data);
    console.log("Toutes les données :", datas);

    id++;

    // Actualiser l'affichage
    afficherMesDonnees();
});