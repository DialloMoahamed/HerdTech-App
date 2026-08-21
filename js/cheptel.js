const utilisateurConnecter = JSON.parse(
    localStorage.getItem("UserConnecter")
);

if (!utilisateurConnecter) {
    window.location.href = "Login.html";
}

const userId = utilisateurConnecter.id;

const animaux = JSON.parse(localStorage.getItem("animaux")) || [];
const tags = JSON.parse(localStorage.getItem("tags")) || [];

const form = document.getElementById("animalForm");
const tbody = document.getElementById("animalList");


// =====================================================
// AFFICHER LES ANIMAUX
// =====================================================

function afficherAnimaux(liste = animaux) {

    tbody.innerHTML = "";

    liste.forEach((a) => {

        tbody.innerHTML += `
            <tr>
                <th scope="row">
                    <input
                        style="transform: scale(1.9);"
                        type="checkbox"
                    >
                </th>

                <td>${a.id}</td>
                <td>${a.rfid}</td>
                <td>${a.sex}</td>
                <td>${a.category}</td>
                <td>${a.birthDate}</td>
                <td>${a.status}</td>

                <td>
                    <button
                        class="btn btn-success text-dark"
                        onclick="openEditModal('${a.id}')">
                        <i class="bi bi-pen-fill"></i>
                        Modifier
                    </button>
                </td>

                <td>
                    <button
                        class="btn btn-danger text-dark"
                        onclick="askDelete('${a.id}')">
                        <i class="bi bi-trash3-fill"></i>
                        Supprimer
                    </button>
                </td>
            </tr>
        `;
    });
}


// =====================================================
// AJOUTER UN ANIMAL
// =====================================================

form.addEventListener("submit", (e) => {

    e.preventDefault();

    const rfid = document.getElementById("animalRfid").value;
    const category = document.getElementById("animalCategory").value;
    const sex = document.getElementById("animalSex").value;
    const birthDate = document.getElementById("animalBirthDate").value;
    const status = document.getElementById("animalStatus").value;


    // Génération de l'ID

    let id = 1;

    if (animaux.length > 0) {

        const dernierId = Math.max(
            ...animaux.map((animal) => animal.id)
        );

        id = dernierId + 1;
    }


    // Création de l'animal

    const animal = {
        id,
        userId: userId,
        rfid,
        sex,
        category,
        birthDate,
        status
    };


    // Ajout dans le tableau

    animaux.push(animal);


    // Sauvegarde dans localStorage

    localStorage.setItem(
        "animaux",
        JSON.stringify(animaux)
    );


    // Réafficher le tableau

    afficherAnimaux();
    afficherStatistiques();


    // Réinitialiser le formulaire

    form.reset();

    const modal = bootstrap.Modal.getInstance(
        document.getElementById("animalModal")
    );

    modal.hide();


    console.log("Nouvel animal :", animal);
    console.log("Nouveau tableau :", animaux);
});


// =====================================================
// MODIFIER UN ANIMAL
// =====================================================

function openEditModal(id) {

    const animal = animaux.find(
        (animal) => animal.id === Number(id)
    );


    if (!animal) {
        console.log("Animal introuvable");
        return;
    }


    // Remplir la modale avec les informations de l'animal

    document.getElementById("editAnimalRfid").value =
        animal.rfid;

    document.getElementById("editAnimalCategory").value =
        animal.category;

    document.getElementById("editAnimalSex").value =
        animal.sex;

    document.getElementById("editAnimalBirthDate").value =
        animal.birthDate;

    document.getElementById("editAnimalStatus").value =
        animal.status;


    // Garder l'ID de l'animal à modifier

    document
        .getElementById("editAnimalForm")
        .setAttribute("data-id", animal.id);


    // Ouvrir la modale

    const modal = new bootstrap.Modal(
        document.getElementById("modifierModal")
    );

    modal.show();
}


// =====================================================
// SAUVEGARDER LES MODIFICATIONS
// =====================================================

document
    .getElementById("editAnimalForm")
    .addEventListener("submit", (e) => {

        e.preventDefault();

        // Récupérer l'ID de l'animal

        const id = Number(
            e.target.getAttribute("data-id")
        );

        // Rechercher l'animal

        const animal = animaux.find(
            (animal) => animal.id === id
        );

        if (!animal) {
            console.log("Animal introuvable");
            return;
        }

        // Modifier ses informations

        animal.rfid =
            document.getElementById("editAnimalRfid").value;

        animal.category =
            document.getElementById("editAnimalCategory").value;

        animal.sex =
            document.getElementById("editAnimalSex").value;

        animal.birthDate =
            document.getElementById("editAnimalBirthDate").value;

        animal.status =
            document.getElementById("editAnimalStatus").value;

        // Sauvegarder dans localStorage

        localStorage.setItem(
            "animaux",
            JSON.stringify(animaux)
        );

        // Réafficher le tableau

        afficherAnimaux();
        afficherStatistiques();

        // Fermer la modale

        const modal = bootstrap.Modal.getInstance(
            document.getElementById("modifierModal")
        );

        modal.hide();

        console.log("Animal modifié :", animal);
});


// =====================================================
// PRÉPARER LA SUPPRESSION
// =====================================================

let animalToDelete = null;

function askDelete(id) {

    const animal = animaux.find(
        (animal) => animal.id === Number(id)
    );

    if (!animal) {
        console.log("Animal introuvable");
        return;
    }

    // Garder l'ID de l'animal à supprimer

    animalToDelete = animal.id;

    // Afficher son RFID dans la modale

    document.getElementById("deleteAnimalRfid").textContent =
        animal.rfid;

    // Ouvrir la modale

    const modal = new bootstrap.Modal(
        document.getElementById("sprimerModal")
    );

    modal.show();
}


// =====================================================
// CONFIRMER LA SUPPRESSION
// =====================================================

document
    .getElementById("confirmDeleteAnimal")
    .addEventListener("click", () => {


        if (animalToDelete === null) {
            return;
        }

        // Trouver la position de l'animal

        const index = animaux.findIndex(
            (animal) => animal.id === animalToDelete
        );

        if (index === -1) {
            return;
        }

        // Supprimer l'animal

        animaux.splice(index, 1);

        // Sauvegarder

        localStorage.setItem(
            "animaux",
            JSON.stringify(animaux)
        );

        // Réafficher

        afficherAnimaux();
        afficherStatistiques();

        // Fermer la modale

        const modal = bootstrap.Modal.getInstance(
            document.getElementById("sprimerModal")
        );

        modal.hide();

        // Réinitialiser

        animalToDelete = null;

        console.log("Animal supprimé");
});

// =====================================================
// Filtrage animaux
// =====================================================


function filtrerAnimaux() {

    const rfid = document.getElementById("RFID_filtre").value;
    const sex = document.getElementById("sex_filtre").value;
    const category = document.getElementById("categorie_filtre").value;
    const date = document.getElementById("date_filtre").value;
    const status = document.getElementById("Status_filtre").value;

    const animauxFiltres = animaux.filter((animal) => {

        if (rfid !== "" && animal.rfid !== rfid) {
            return false;
        }

        if (sex !== "" && animal.sex !== sex) {
            return false;
        }

        if (category !== "" && animal.category !== category) {
            return false;
        }

         if (date !== "" && animal.birthDate !== date) {
            return false;
        }

        if (status !== "" && animal.status !== status) {
            return false;
        }

        return true;
    });

    afficherAnimaux(animauxFiltres);
}

document
    .getElementById("RFID_filtre")
    .addEventListener("change", filtrerAnimaux);

document
    .getElementById("sex_filtre")
    .addEventListener("change", filtrerAnimaux);

document
    .getElementById("categorie_filtre")
    .addEventListener("change", filtrerAnimaux);

document
    .getElementById("date_filtre")
    .addEventListener("change", filtrerAnimaux);

document
    .getElementById("Status_filtre")
    .addEventListener("change", filtrerAnimaux);

// =====================================================
// Filtrage animaux par status
// =====================================================
        
document
    .getElementById("restore")
    .addEventListener("click", () => {

        document.getElementById("RFID_filtre").value = "";
        document.getElementById("sex_filtre").value = "";
        document.getElementById("categorie_filtre").value = "";
        document.getElementById("date_filtre").value = "";
        document.getElementById("Status_filtre").value = "";

        afficherAnimaux();
        
    } );
    
// =====================================================
// STATISTIQUES DU CHEPTEL
// =====================================================    
    
function afficherStatistiques() {
    const totalAnimaux = animaux.length;

    const totalTaureaux = animaux.filter((animal) =>
        animal.category === "Vache").length;

    const totalVache = animaux.filter((animal) =>
        animal.category === "Taureau"
    ).length;

    const totalMouton = animaux.filter((animal) =>
        animal.category === "Mouton"
    ).length;

    const totalChèvre = animaux.filter((animal) =>
        animal.category === "Chèvre"
    ).length;

    const totalBovins = totalTaureaux + totalVache;
    const totalOvins = totalMouton + totalChèvre;

    document.getElementById("tBovins").textContent = totalBovins;
    console.log(totalBovins);
    
    document.getElementById("tTaureaux").textContent = totalTaureaux;
    console.log(totalTaureaux);
    
    document.getElementById("tVaches").textContent = totalVache;
    console.log(totalVache);
    
    document.getElementById("tOvins").textContent = totalOvins;
    console.log(totalOvins);
    
    document.getElementById("tBéliers").textContent = totalMouton;
    console.log(totalMouton);
    
    document.getElementById("tBrebis").textContent = totalChèvre;
    console.log(totalChèvre);
    
    document.getElementById("totalAnimaux").textContent = totalAnimaux;
    console.log(totalAnimaux);
    
    document.getElementById("totalOvins").textContent = totalOvins;
    document.getElementById("totalBovins").textContent = totalBovins
}    


function afficherAnimauxDuTagDansSelect() {

    // Chercher le TAG
    const tag = tags.find(
        (tag) => tag.userId === userId
    );

    if (!tag) {
        console.log("TAG introuvable");
        return;
    }
  

    const selectAjouter = document.getElementById('animalRfid');
    const selectModifier = document.getElementById('editAnimalRfid');

    selectAjouter.innerHTML = `<option>-- Select RFID --</option>`;
    selectModifier.innerHTML = `<option>-- Select RFID --</option>`;

    tags.forEach((tag) => {

        const optionAjouter = document.createElement("option");

        optionAjouter.value = tag.nom;
        optionAjouter.innerHTML = tag.nom;

        selectAjouter.appendChild(optionAjouter);

        const optionModifier = document.createElement("option");

        optionModifier.value = tag.nom;
        optionModifier.innerHTML = tag.nom;

        selectModifier.appendChild(optionModifier);
    });
    

} 

// =====================================================
// AFFICHAGE INITIAL
// =====================================================
afficherAnimaux();
afficherStatistiques();
afficherAnimauxDuTagDansSelect();
