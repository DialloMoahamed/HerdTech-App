const themeToggle = document.getElementById("themeToggle");

const theme = localStorage.getItem("theme");

    if (theme === "dark") {
        // ajouter dark-mode au body
        document.body.classList.add("dark-mode");
    }

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
    // sauvegarder dark
    localStorage.setItem("theme", "dark");
    } else {
    // sauvegarder light
    localStorage.setItem("theme", "light");
    }
});