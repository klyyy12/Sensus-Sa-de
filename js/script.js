const loginScreen = document.getElementById("loginScreen");
const app = document.getElementById("app");

const loginForm = document.getElementById("loginForm");
const logoutButton = document.getElementById("logoutButton");

const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const userAvatar = document.getElementById("userAvatar");
const settingsEmail = document.getElementById("settingsEmail");

const navItems = document.querySelectorAll(".nav-item");
const mobileNavItems = document.querySelectorAll(".mobile-nav-item");
const sections = document.querySelectorAll(".dashboard-section");

const mobileMenu = document.getElementById("mobileMenu");
const sidebar = document.querySelector(".sidebar");

const familyModal = document.getElementById("familyModal");
const familyForm = document.getElementById("familyForm");
const closeFamilyModal = document.getElementById("closeFamilyModal");

const addFamilyButton = document.getElementById("addFamilyButton");
const addFamilyButtonEmpty = document.getElementById("addFamilyButtonEmpty");


// =========================================================
// ÍCONES
// =========================================================

if (window.lucide) {
    lucide.createIcons();
}


// =========================================================
// LOGIN
// =========================================================

function formatUserName(email) {
    const username = email
        .split("@")[0]
        .replace(/[._-]/g, " ")
        .trim();

    return username
        .split(" ")
        .filter(Boolean)
        .map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
}


function showApp(email) {

    loginScreen.style.display = "none";
    app.classList.add("visible");

    const name = formatUserName(email);

    userName.textContent = name || "Usuário";
    userEmail.textContent = email;
    settingsEmail.textContent = email;

    userAvatar.textContent =
        (name || email).charAt(0).toUpperCase();

    localStorage.setItem("sensus_email", email);
}


function showLogin() {

    app.classList.remove("visible");
    loginScreen.style.display = "flex";

    localStorage.removeItem("sensus_email");

    if (loginForm) {
        loginForm.reset();
    }
}


loginForm.addEventListener("submit", event => {

    event.preventDefault();

    const emailInput = document.getElementById("email");

    const email = emailInput.value.trim().toLowerCase();

    if (!email) {
        emailInput.focus();
        return;
    }

    if (!emailInput.checkValidity()) {
        emailInput.reportValidity();
        return;
    }

    showApp(email);

    resetNavigation();

});


// =========================================================
// LOGOUT
// =========================================================

logoutButton.addEventListener("click", () => {
    showLogin();
});


// =========================================================
// NAVEGAÇÃO
// =========================================================

function changeSection(target) {

    if (!target) return;

    navItems.forEach(item => {
        item.classList.toggle(
            "active",
            item.dataset.section === target
        );
    });

    mobileNavItems.forEach(item => {
        item.classList.toggle(
            "active",
            item.dataset.section === target
        );
    });

    sections.forEach(section => {
        section.classList.toggle(
            "active-section",
            section.id === target
        );
    });

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    closeMobileSidebar();
}


function resetNavigation() {
    changeSection("overview");
}


navItems.forEach(item => {

    item.addEventListener("click", () => {

        changeSection(item.dataset.section);

    });

});


mobileNavItems.forEach(item => {

    item.addEventListener("click", () => {

        changeSection(item.dataset.section);

    });

});


document.querySelectorAll("[data-goto]").forEach(button => {

    button.addEventListener("click", () => {

        const target = button.dataset.goto;

        changeSection(target);

    });

});


// =========================================================
// MOBILE SIDEBAR
// =========================================================

function closeMobileSidebar() {

    if (sidebar) {
        sidebar.classList.remove("open");
    }

}


if (mobileMenu) {

    mobileMenu.addEventListener("click", () => {

        sidebar.classList.toggle("open");

    });

}


document.addEventListener("click", event => {

    if (
        window.innerWidth <= 800 &&
        sidebar &&
        sidebar.classList.contains("open") &&
        !sidebar.contains(event.target) &&
        !mobileMenu.contains(event.target)
    ) {

        closeMobileSidebar();

    }

});


// =========================================================
// MODAL — FAMÍLIA
// =========================================================

function openFamilyModal() {

    if (!familyModal) return;

    familyModal.classList.add("open");

    const nameInput = document.getElementById("familyName");

    setTimeout(() => {
        if (nameInput) {
            nameInput.focus();
        }
    }, 100);

}


function closeFamilyModalFunction() {

    if (!familyModal) return;

    familyModal.classList.remove("open");

    if (familyForm) {
        familyForm.reset();
    }

}


if (addFamilyButton) {
    addFamilyButton.addEventListener(
        "click",
        openFamilyModal
    );
}


if (addFamilyButtonEmpty) {
    addFamilyButtonEmpty.addEventListener(
        "click",
        openFamilyModal
    );
}


if (closeFamilyModal) {

    closeFamilyModal.addEventListener(
        "click",
        closeFamilyModalFunction
    );

}


if (familyModal) {

    familyModal.addEventListener("click", event => {

        if (event.target === familyModal) {
            closeFamilyModalFunction();
        }

    });

}


document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
        closeFamilyModalFunction();
        closeMobileSidebar();
    }

});


// =========================================================
// CADASTRO DEMONSTRATIVO DE FAMÍLIA
// =========================================================

if (familyForm) {

    familyForm.addEventListener("submit", event => {

        event.preventDefault();

        const nameInput =
            document.getElementById("familyName");

        const birthInput =
            document.getElementById("familyBirth");

        const name = nameInput.value.trim();
        const birth = birthInput.value;

        if (!name || !birth) {
            return;
        }

        /*
         * Neste momento o cadastro é apenas local.
         *
         * A próxima etapa poderá substituir esta parte
         * por uma persistência real em banco de dados.
         */

        localStorage.setItem(
            "sensus_last_family_member",
            JSON.stringify({
                name,
                birth
            })
        );

        closeFamilyModalFunction();

        showFamilySuccess(name);

    });

}


function showFamilySuccess(name) {

    const familyEmpty =
        document.querySelector(".family-empty");

    if (!familyEmpty) return;

    familyEmpty.innerHTML = `
        <div class="family-empty-icon">
            <i class="icon icon-circle-check"></i>
        </div>

        <span class="panel-label">
            CADASTRO REALIZADO
        </span>

        <h2>${escapeHtml(name)} foi adicionado</h2>

        <p>
            O cadastro foi salvo neste dispositivo.
            A integração com o calendário de vacinação
            será conectada posteriormente.
        </p>

        <button
            class="outline-button"
            id="addAnotherFamily"
        >
            <i class="icon icon-plus"></i>
            Adicionar outra pessoa
        </button>
    `;

    if (window.lucide) {
        lucide.createIcons();
    }

    const addAnother =
        document.getElementById("addAnotherFamily");

    if (addAnother) {
        addAnother.addEventListener(
            "click",
            openFamilyModal
        );
    }

}


function escapeHtml(value) {

    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;

}


// =========================================================
// SESSÃO SALVA
// =========================================================

const savedEmail =
    localStorage.getItem("sensus_email");

if (savedEmail) {

    showApp(savedEmail);

} else {

    loginScreen.style.display = "flex";
    app.classList.remove("visible");

}


// =========================================================
// RECRIAR ÍCONES APÓS ALTERAÇÕES
// =========================================================

if (window.lucide) {
    lucide.createIcons();
}
