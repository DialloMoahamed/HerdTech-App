const animaux = JSON.parse(localStorage.getItem("animaux")) || [];
const tags = JSON.parse(localStorage.getItem("tags")) || [];

const tbody = document.getElementById("tagListes");


// =====================================================
// AFFICHER LES TAGS
// =====================================================

function afficherTags() {

    tbody.innerHTML = "";

    tags.forEach((tag) => {

        // Chercher les animaux qui utilisent ce TAG
        const animauxDuTag = animaux.filter(
            (animal) => animal.rfid === tag.rfid
        );

        tbody.innerHTML += `
            <tr>

                <th scope="row">
                    <input
                        style="transform: scale(1.9);"
                        type="checkbox"
                    >
                </th>

                <td class="d-flex flex-column align-items-center">

                    <strong>
                        <i class="bi bi-tags-fill"></i>
                        ${tag.nom}
                    </strong>

                    ${tag.rfid}

                </td>

                <td></td>

                <td></td>

                <td>
                    Mallam
                </td>

                <td></td>

                <td>

                    <button
                        class="btn fw-bold"
                        style="background-color: #66BA45;"
                        onclick="afficherAnimauxDuTag(${tag.id})">
                        ${animauxDuTag.length}
                    </button>

                </td>

                <td></td>

                <td class="d-flex gap-2">

                    <button
                        class="btn text-white"
                        style="background-color: #66BA45;"
                        onclick="modifierTag(${tag.id})"
                    >
                    <i class="bi bi-pen-fill"></i>
                        Modifier
                    </button>

                    <button
                        class="btn btn-danger text-black"
                        onclick="supprimerTag(${tag.id})"
                    >
                    <i class="bi bi-trash3-fill"></i>
                        Supprimer
                    </button>
                </td>

            </tr>
        `;
    });
}


// =====================================================
// AJOUTER UN TAG
// =====================================================

document
    .getElementById("ajouterTag")
    .addEventListener("click", (e) => {

        e.preventDefault();

        const tagValue = document
            .getElementById("tag")
            .value
            .trim();

        // Vérifier que le champ n'est pas vide
        if (tagValue === "") {
            alert("Veuillez entrer un TAG.");
            return;
        }


        // Vérifier si le TAG existe déjà
        const tagExiste = tags.some(
            (tag) => tag.rfid === tagValue
        );

        if (tagExiste) {
            alert("Ce TAG existe déjà.");
            return;
        }


        // Générer l'ID
        let id = 1;

        if (tags.length > 0) {

            const dernierId = Math.max(
                ...tags.map((tag) => Number(tag.id))
            );

            id = dernierId + 1;
        }


        // Créer le TAG
        const tag = {
            id: id,
            nom: tagValue,
            rfid: tagValue
        };


        // Ajouter au tableau
        tags.push(tag);


        // Sauvegarder
        localStorage.setItem(
            "tags",
            JSON.stringify(tags)
        );


        // Réafficher
        afficherTags();


        // Vider le champ
        document.getElementById("tag").value = "";


        // Fermer la modal
        const modal = bootstrap.Modal.getInstance(
            document.getElementById("animalModal")
        );

        if (modal) {
            modal.hide();
        }


        console.log("Nouveau TAG :", tag);
        console.log("Tous les TAGs :", tags);

    });


function afficherAnimauxDuTag(tagId) {

    // Chercher le TAG
    const tag = tags.find(
        (tag) => tag.id === Number(tagId)
    );

    if (!tag) {
        console.log("TAG introuvable");
        return;
    }


    // Chercher les animaux associés à ce TAG
    const animauxDuTag = animaux.filter(
        (animal) => animal.rfid === tag.rfid
    );


    // Afficher le nom du TAG
    document.getElementById("tagModalNom").textContent =
        tag.nom;


    // Afficher le nombre
    document.getElementById("tagModalNombre").textContent =
        animauxDuTag.length;


    // Récupérer le tbody
    const tbodyAnimaux =
        document.getElementById("animauxTagList");


    // Vider le tableau
    tbodyAnimaux.innerHTML = "";


    // Aucun animal
    if (animauxDuTag.length === 0) {

        tbodyAnimaux.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted">
                    Aucun animal n'est associé à ce TAG.
                </td>
            </tr>
        `;

    } else {

        // Afficher les animaux
        animauxDuTag.forEach((animal) => {

            tbodyAnimaux.innerHTML += `
                <tr>

                    <td>
                        ${animal.id}
                    </td>

                    <td>
                        ${animal.rfid}
                    </td>

                    <td>
                        ${animal.category}
                    </td>

                    <td>
                        ${animal.sex}
                    </td>

                    <td>
                        ${animal.birthDate}
                    </td>

                    <td>
                        ${animal.status}
                    </td>

                </tr>
            `;

        });
    }


    // Ouvrir la modal
    const modal = new bootstrap.Modal(
        document.getElementById("animauxTagModal")
    );

    modal.show();
}


function modifierTag(id) {

    const tag = tags.find(
        (tag) => tag.id === Number(id)
    );

    if (!tag) {
        console.log("TAG introuvable");
        return;
    }

    document.getElementById("editTagRfid").value =
    tag.rfid;

    document
    .getElementById("editTagRfid")
    .setAttribute("data-id", tag.id);


    // Ouvrir la modale

    const modal = new bootstrap.Modal(
        document.getElementById("modifierTagModal")
    );

    modal.show();

    console.log("TAG à modifier :", tag)

}

const sauvegarderTag = document.getElementById("sauvegarderTag");

sauvegarderTag.addEventListener("click", () => {

    const input = document.getElementById("editTagRfid");

    const nouveauTag = input.value;
    const id = Number(input.getAttribute("data-id"));

    // 1. Retrouver le TAG avec son id
    const tag = tags.find(
        (tag) => tag.id === Number(id)
    );

    // 2. Modifier son RFID
    tag.rfid = nouveauTag;

    // 3. Sauvegarder dans localStorage
    localStorage.setItem("tags", JSON.stringify(tags));

    // 4. Réafficher les TAGs
    afficherTags();

    // Fermer la modal
    const modal = bootstrap.Modal.getInstance(
        document.getElementById("modifierTagModal")
    );

    if (modal) {
        modal.hide();
    }

    console.log("Nouveau TAG :", nouveauTag);
    console.log("ID :", id);
});



// =====================================================
// Supprimer UN TAG
// =====================================================
let tagToDelet = null;

function supprimerTag(id) {

    const tag = tags.find(
        (tag) => tag.id === Number(id)
    );

    if (!tag) {
        console.log("TAG introuvable");
        return;
    }

    tagToDelet = tag.id;

    const animauxDuTag = animaux.filter(
        (animal) => animal.rfid === tag.rfid
    );

    if (animauxDuTag.length > 0) {

        console.log(
            `Ce TAG est utilisé par ${animauxDuTag.length} animaux et ne peut pas être supprimé.`
        );

        const modal = new bootstrap.Modal(
            document.getElementById("sprimerModal")
        );

        modal.show();

        return;
    }

    // Si aucun animal n'utilise le TAG,
    // afficher la confirmation
    document.getElementById("tagASupprimer").textContent =
        tag.rfid
    const modal = new bootstrap.Modal(
        document.getElementById("supprimerTagModal")
    );

    modal.show();
}

document
    .getElementById("confirmerSuppressionTag")
    .addEventListener("click", () => {

        // Retrouver l'index
        const index = tags.findIndex(
            (tag) => tag.id === tagToDelet
        );

        if (index === -1) {
            return;
        }

        // Supprimer le TAG
        tags.splice(index, 1);

        // Sauvegarder
        localStorage.setItem(
            "tags",
            JSON.stringify(tags)
        );

        // Réafficher
        afficherTags();

        // Fermer la modal de confirmation
        const modal = bootstrap.Modal.getInstance(
            document.getElementById("supprimerTagModal")
        );

        if (modal) {
            modal.hide();
        }

        // Réinitialiser
        tagToDelet = null;

        console.log("TAG supprimé");
    });

// =====================================================
// AFFICHAGE INITIAL
// =====================================================

afficherTags();