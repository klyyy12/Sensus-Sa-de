const loginScreen = document.getElementById("loginScreen");
const app = document.getElementById("app");

const loginForm = document.getElementById("loginForm");
const logoutButton = document.getElementById("logoutButton");

const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const userAvatar = document.getElementById("userAvatar");
const settingsEmail = document.getElementById("settingsEmail");

const navItems = document.querySelectorAll(".nav-item");
const sections = document.querySelectorAll(".dashboard-section");

// =========================
// LOGIN
// =========================

function showApp(email) {
    if (!email) return;

    loginScreen.style.display = "none";
    app.classList.add("visible");

    const name = email
        .split("@")[0]
        .replace(/[._-]/g, " ")
        .replace(/\b\w/g, letter => letter.toUpperCase());

    userName.textContent = name;
    userEmail.textContent = email;
    settingsEmail.textContent = email;

    userAvatar.textContent = name.charAt(0).toUpperCase();

    localStorage.setItem("sensus_email", email);
}

function showLogin() {
    app.classList.remove("visible");
    loginScreen.style.display = "flex";

    localStorage.removeItem("sensus_email");
}

// =========================
// FORMULÁRIO DE LOGIN
// =========================

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const emailInput = document.getElementById("email");

        if (!emailInput) return;

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
}

// =========================
// LOGOUT
// =========================

if (logoutButton) {
    logoutButton.addEventListener("click", function () {
        showLogin();
    });
}

// =========================
// NAVEGAÇÃO
// =========================

navItems.forEach(item => {
    item.addEventListener("click", function () {

        const target = item.dataset.section;

        if (!target) return;

        // Remove ativo de todos
        navItems.forEach(nav => {
            nav.classList.remove("active");
        });

        // Ativa o botão selecionado
        item.classList.add("active");

        // Esconde todas as páginas
        sections.forEach(section => {
            section.classList.remove("active-section");
        });

        // Mostra a página selecionada
        const selectedSection = document.getElementById(target);

        if (selectedSection) {
            selectedSection.classList.add("active-section");
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
});

// =========================
// SESSÃO SALVA
// =========================

const savedEmail = localStorage.getItem("sensus_email");

if (savedEmail) {
    showApp(savedEmail);
} else {
    showLogin();
}
