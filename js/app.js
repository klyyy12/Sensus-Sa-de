document.addEventListener("DOMContentLoaded", () => {

    /*
    ========================================
    ELEMENTOS PRINCIPAIS
    ========================================
    */

    const loginScreen = document.getElementById("loginScreen");
    const app = document.getElementById("app");

    const loginForm = document.getElementById("loginForm");
    const loginMessage = document.getElementById("loginMessage");

    const password = document.getElementById("password");
    const passwordToggle = document.getElementById("passwordToggle");

    const forgotPassword =
        document.getElementById("forgotPassword");

    const logoutButton =
        document.getElementById("logoutButton");

    const rememberMe =
        document.getElementById("rememberMe");


    /*
    ========================================
    LOGIN DEMONSTRATIVO
    ========================================
    */

    function getSavedUser() {

        const savedUser =
            localStorage.getItem("sensus_user");

        if (!savedUser) {
            return null;
        }

        try {
            return JSON.parse(savedUser);
        } catch {
            return null;
        }
    }


    function updateUserInterface(user) {

        if (!user) return;

        const email = user.email;

        const name =
            email
                .split("@")[0]
                .replace(/[._-]/g, " ")
                .replace(/\b\w/g, letter => letter.toUpperCase());

        const initials =
            name
                .split(" ")
                .slice(0, 2)
                .map(word => word[0])
                .join("")
                .toUpperCase();


        const headerName =
            document.getElementById("headerName");

        const headerEmail =
            document.getElementById("headerEmail");

        const headerAvatar =
            document.getElementById("headerAvatar");

        const profileName =
            document.getElementById("profileName");

        const profileEmail =
            document.getElementById("profileEmail");

        const profileAvatar =
            document.getElementById("profileAvatar");


        if (headerName)
            headerName.textContent = name;

        if (headerEmail)
            headerEmail.textContent = email;

        if (headerAvatar)
            headerAvatar.textContent = initials;

        if (profileName)
            profileName.textContent = name;

        if (profileEmail)
            profileEmail.textContent = email;

        if (profileAvatar)
            profileAvatar.textContent = initials;
    }


    function enterApp(user) {

        loginScreen.hidden = true;

        app.hidden = false;

        updateUserInterface(user);

    }


    function logout() {

        localStorage.removeItem("sensus_user");

        app.hidden = true;

        loginScreen.hidden = false;

        loginForm.reset();

        loginMessage.textContent = "";

    }


    /*
    ========================================
    LOGIN
    ========================================
    */

    loginForm.addEventListener("submit", event => {

        event.preventDefault();

        const email =
            document
                .getElementById("email")
                .value
                .trim()
                .toLowerCase();

        const passwordValue =
            password.value;


        if (!email || !passwordValue) {

            loginMessage.textContent =
                "Preencha seu e-mail e sua senha.";

            return;

        }


        /*
        IMPORTANTE:

        Esta é apenas a versão visual.

        Na próxima etapa o login será conectado
        ao Supabase Auth.

        A senha NÃO deve ser armazenada
        no localStorage.
        */


        const user = {
            email: email
        };


        if (rememberMe.checked) {

            localStorage.setItem(
                "sensus_user",
                JSON.stringify(user)
            );

        }


        loginMessage.textContent = "";

        enterApp(user);

    });


    /*
    ========================================
    MOSTRAR / OCULTAR SENHA
    ========================================
    */

    passwordToggle.addEventListener("click", () => {

        if (password.type === "password") {

            password.type = "text";

            passwordToggle.textContent = "◌";

        } else {

            password.type = "password";

            passwordToggle.textContent = "◉";

        }

    });


    /*
    ========================================
    RECUPERAÇÃO DE SENHA
    ========================================
    */

    forgotPassword.addEventListener("click", () => {

        const email =
            document
                .getElementById("email")
                .value
                .trim();


        if (!email) {

            loginMessage.textContent =
                "Digite seu e-mail para receber o link de recuperação.";

            return;

        }


        loginMessage.style.color = "var(--green)";

        loginMessage.textContent =
            "Em breve enviaremos o link de recuperação por e-mail.";

    });


    /*
    ========================================
    LOGOUT
    ========================================
    */

    logoutButton.addEventListener(
        "click",
        logout
    );


    /*
    ========================================
    NAVEGAÇÃO
    ========================================
    */

    const navItems =
        document.querySelectorAll(".nav-item");

    const sections =
        document.querySelectorAll(".page-section");

    const sectionLinks =
        document.querySelectorAll("[data-section-link]");


    function showSection(sectionId) {

        sections.forEach(section => {

            section.classList.remove(
                "active-section"
            );

        });


        const target =
            document.getElementById(sectionId);


        if (target) {

            target.classList.add(
                "active-section"
            );

        }


        navItems.forEach(item => {

            item.classList.remove("active");


            if (
                item.dataset.section === sectionId
            ) {

                item.classList.add("active");

            }

        });


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    navItems.forEach(item => {

        item.addEventListener("click", () => {

            showSection(
                item.dataset.section
            );

        });

    });


    sectionLinks.forEach(link => {

        link.addEventListener("click", () => {

            showSection(
                link.dataset.sectionLink
            );

        });

    });


    /*
    ========================================
    PESQUISA
    ========================================
    */

    const searchInput =
        document.getElementById("searchInput");


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            event => {

                const search =
                    event.target.value
                        .toLowerCase()
                        .trim();


                const diseaseRows =
                    document.querySelectorAll(
                        ".table-row"
                    );


                diseaseRows.forEach(row => {

                    const text =
                        row.textContent
                            .toLowerCase();


                    if (text.includes(search)) {

                        row.style.display =
                            "grid";

                    } else {

                        row.style.display =
                            "none";

                    }

                });

            }
        );

    }


    /*
    ========================================
    FILTRO DO GRÁFICO
    ========================================
    */

    const chartFilter =
        document.getElementById("chartFilter");


    if (chartFilter) {

        chartFilter.addEventListener(
            "change",
            event => {

                console.log(
                    "Doença selecionada:",
                    event.target.value
                );

                /*
                FUTURO:

                Aqui entra a consulta
                aos dados reais do DataSUS.
                */

            }
        );

    }


    /*
    ========================================
    ATUALIZAÇÃO
    ========================================
    */

    const updateElements =
        document.querySelectorAll(".last-update");


    updateElements.forEach(element => {

        element.addEventListener(
            "click",
            () => {

                element.innerHTML = `
                    <span class="update-dot"></span>
                    Atualizando...
                `;


                setTimeout(() => {

                    element.innerHTML = `
                        <span class="update-dot"></span>
                        Atualizado agora
                    `;

                }, 1000);

            }
        );

    });


    /*
    ========================================
    PREFERÊNCIAS DE E-MAIL
    ========================================
    */

    const emailAlertsToggle =
        document.getElementById(
            "emailAlertsToggle"
        );


    if (emailAlertsToggle) {

        emailAlertsToggle.addEventListener(
            "change",
            () => {

                const enabled =
                    emailAlertsToggle.checked;


                localStorage.setItem(
                    "sensus_email_alerts",
                    enabled
                );

                console.log(
                    "Alertas por e-mail:",
                    enabled
                );

            }
        );

    }


    /*
    ========================================
    NOTIFICAÇÕES
    ========================================
    */

    const emailNotifications =
        document.getElementById(
            "emailNotifications"
        );


    if (emailNotifications) {

        emailNotifications.addEventListener(
            "click",
            () => {

                showSection("perfil");

            }
        );

    }


    /*
    ========================================
    SESSÃO SALVA
    ========================================
    */

    const savedUser =
        getSavedUser();


    if (savedUser) {

        enterApp(savedUser);

    }


    console.log(
        "Sensus Saúde iniciado."
    );

});
