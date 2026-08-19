const taches = JSON.parse(localStorage.getItem("taches")) || [];

const tbody = document.getElementById("tacheAfaire");

const tbody2 = document.getElementById("tacheEffectuer");

function afficherTaches() {

    tbody.innerHTML = "";
    tbody2.innerHTML = "";

    taches.forEach((tache) => {

        if (tache.completed === false) {

            // Tâche à faire
            tbody.innerHTML += `
                <tr>

                    <td>
                        <input
                            type="checkbox"
                            style="transform: scale(1.5);"
                            onchange="terminerTache(${tache.id})"
                        >
                    </td>
                    <td></td>
                    <td></td>
                    <td>
                        ${tache.nom}
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                        <button
                            class="btn btn-success"
                            onclick="modifierTache(${tache.id})">
                            <i class="bi bi-pen-fill"></i>
                            Modifier
                        </button>

                        <button
                            class="btn btn-danger"
                            onclick="ouvrirModalSuppression(${tache.id})">
                            <i class="bi bi-trash3-fill"></i>
                            Supprimer
                        </button>
                    </td>

                </tr>
            `;

        } else {

            // Tâche effectuée
            tbody2.innerHTML += `
                <tr>

                    <td>
                        <input
                            type="checkbox"
                            style="transform: scale(1.5);"
                            checked
                            onchange="terminerTache(${tache.id})"
                        >
                    </td>
                    <td></td>
                    <td></td>
                    <td>
                        ${tache.nom}
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                        <button
                            class="btn btn-danger"
                            onclick="ouvrirModalSuppression(${tache.id})">
                            <i class="bi bi-trash3-fill"></i>
                            Supprimer
                        </button>
                    </td>

                </tr>
            `;
        }

    });
}

document
.getElementById("ajouterTache")
.addEventListener("click", (e) => {

    e.preventDefault();

    const tacheValue = document
            .getElementById("tache")
            .value
            .trim();

        // Vérifier que le champ n'est pas vide
        if (tacheValue === "") {
            alert("Veuillez entrer une tache.");
            return;
        }


        // Vérifier si le TAG existe déjà
        const tacheExiste = taches.some(
            (tache) => tache.nom === tacheValue
        );

        if (tacheExiste) {
            alert("Cette tache existe déjà.");
            return;
        }

        let id = 1;

        if (taches.length > 0) {

            const dernierId = Math.max(
                ...taches.map((tache) => Number(tache.id))
            );

            id = dernierId + 1;
        }

        const tache = {
            id: id,
            nom: tacheValue,
            completed: false
        };


        taches.push(tache);

        localStorage.setItem("taches", JSON.stringify(taches));

        afficherTaches();


        const inputTache = document.getElementById("tache");
        inputTache.value = "";


         // Fermer la modal
        const modal = bootstrap.Modal.getInstance(
            document.getElementById("animalModal")
        );

        if (modal) {
            modal.hide();
        }


        console.log("Nouvelle :", tache);
        console.log("Toutes les taches :", taches);

});


function terminerTache(id) {
    
    const tache = taches.find((tache) =>
         tache.id === id)

    if (tache) {
        
        tache.completed = !tache.completed;

        localStorage.setItem("taches", JSON.stringify(taches));

        afficherTaches();
    }
}

function supprimerTache(id) {
    
    const index = taches.findIndex((tache) =>
         tache.id === id);

    if (index !== -1) {
        taches.splice(index, 1);

        localStorage.setItem("taches", JSON.stringify(taches));

        afficherTaches();
    }
}

function ouvrirModalSuppression(id) {

    const tache = taches.find(
        (tache) => tache.id === id
    );

    if (!tache) {
        return;
    }

    const modalElement = document.getElementById("supModal");

    const modal = bootstrap.Modal.getOrCreateInstance(
        modalElement
    );

    const nomTache = document.getElementById(
        "nomTacheSuppression"
    );

    nomTache.textContent = tache.nom;

    const boutonSuppression = document.getElementById(
        "btnConfirmerSuppression"
    );

    boutonSuppression.onclick = function () {

        supprimerTache(id);

        modal.hide();
    };

    modal.show();
}

let idTacheAModifier = null;

function modifierTache(id) {

    const tache = taches.find(
        (tache) => tache.id === Number(id)
    );

    if (!tache) {
        console.log("Tâche introuvable");
        return;
    }

    idTacheAModifier = Number(id);

    document.getElementById("tacheModification").value =
        tache.nom;

    const modal = new bootstrap.Modal(
        document.getElementById("modifierTacheModal")
    );

    modal.show();

    console.log("Tâche à modifier :", tache);
}

const sauvegarderTache = document.getElementById(
    "btnModifierTache"
);

sauvegarderTache.addEventListener("click", () => {

    const input = document.getElementById(
        "tacheModification"
    );

    const nouveauNom = input.value.trim();

    if (nouveauNom === "") {
        alert("Veuillez entrer une tâche.");
        return;
    }

    const tache = taches.find(
        (tache) => tache.id === idTacheAModifier
    );

    if (!tache) {
        console.log("Tâche introuvable");
        return;
    }

    tache.nom = nouveauNom;

    localStorage.setItem(
        "taches",
        JSON.stringify(taches)
    );

    afficherTaches();

    const modal = bootstrap.Modal.getInstance(
        document.getElementById("modifierTacheModal")
    );

    if (modal) {
        modal.hide();
    }

    console.log("Nouveau nom :", nouveauNom);
    console.log("ID :", idTacheAModifier);
});

afficherTaches();