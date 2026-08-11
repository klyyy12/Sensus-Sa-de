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


loginForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const emailInput = document.getElementById("email");
    const email = emailInput.value.trim();

    if (!email) {
        return;
    }

    if (!emailInput.checkValidity()) {
        emailInput.reportValidity();
        return;
    }

    showApp(email);
});


logoutButton.addEventListener("click", function() {
    showLogin();
});


// =========================
// NAVEGAÇÃO
// =========================

navItems.forEach(item => {

    item.addEventListener("click", () => {

        const target = item.dataset.section;

        navItems.forEach(nav => {
            nav.classList.remove("active");
        });

        item.classList.add("active");

        sections.forEach(section => {
            section.classList.remove("active-section");
        });

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
// SESSÃO
// =========================

const savedEmail = localStorage.getItem("sensus_email");

if (savedEmail) {
    showApp(savedEmail);
} else {
    loginScreen.style.display = "flex";
    app.classList.remove("visible");
}
