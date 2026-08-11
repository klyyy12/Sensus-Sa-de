const loginScreen = document.getElementById("loginScreen");
const app = document.getElementById("app");

const loginForm = document.getElementById("loginForm");
const logoutButton = document.getElementById("logoutButton");

const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const userAvatar = document.getElementById("userAvatar");
const settingsEmail = document.getElementById("settingsEmail");

const navItems = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".page");

const quickNavigationButtons = document.querySelectorAll("[data-go]");


/* =====================================================
   UTILIDADES
===================================================== */

function formatUserName(email) {

    const username = email.split("@")[0];

    return username
        .replace(/[._-]+/g, " ")
        .trim()
        .split(" ")
        .filter(Boolean)
        .map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
}


/* =====================================================
   LOGIN
===================================================== */

function showApp(email) {

    const name = formatUserName(email);

    loginScreen.style.display = "none";

    app.classList.add("visible");

    userName.textContent = name || "Usuário";
    userEmail.textContent = email;

    settingsEmail.textContent = email;

    userAvatar.textContent =
        (name.charAt(0) || "U").toUpperCase();

    localStorage.setItem(
        "sensus_email",
        email
    );

    openPage("overview");
}


function showLogin() {

    app.classList.remove("visible");

    loginScreen.style.display = "flex";

    localStorage.removeItem("sensus_email");

    document.getElementById("email").value = "";
}


loginForm.addEventListener("submit", event => {

    event.preventDefault();

    const emailInput = document.getElementById("email");

    const email = emailInput.value.trim();

    if (!email) {
        emailInput.focus();
        return;
    }

    if (!emailInput.checkValidity()) {
        emailInput.reportValidity();
        return;
    }

    showApp(email);
});


logoutButton.addEventListener("click", () => {

    showLogin();

});


/* =====================================================
   NAVEGAÇÃO
===================================================== */

function openPage(target) {

    const selectedPage = document.getElementById(target);

    if (!selectedPage) {
        return;
    }


    pages.forEach(page => {

        page.classList.remove("active-page");

    });


    selectedPage.classList.add("active-page");


    navItems.forEach(item => {

        item.classList.toggle(
            "active",
            item.dataset.section === target
        );

    });


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


navItems.forEach(item => {

    item.addEventListener("click", () => {

        const target = item.dataset.section;

        openPage(target);

    });

});


/* =====================================================
   BOTÕES INTERNOS
===================================================== */

quickNavigationButtons.forEach(button => {

    button.addEventListener("click", () => {

        const target = button.dataset.go;

        openPage(target);

    });

});


/* =====================================================
   SESSÃO SALVA
===================================================== */

const savedEmail =
    localStorage.getItem("sensus_email");


if (savedEmail) {

    showApp(savedEmail);

} else {

    loginScreen.style.display = "flex";

    app.classList.remove("visible");

}
