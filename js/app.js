document.addEventListener("DOMContentLoaded", () => {

    /* ==================================================
       ELEMENTOS
    ================================================== */

    const loginPage =
        document.getElementById("loginPage");

    const app =
        document.getElementById("app");

    const loginForm =
        document.getElementById("loginForm");

    const loginMessage =
        document.getElementById("loginMessage");

    const emailInput =
        document.getElementById("email");

    const passwordInput =
        document.getElementById("password");

    const passwordToggle =
        document.getElementById("passwordToggle");

    const forgotPassword =
        document.getElementById("forgotPassword");

    const rememberMe =
        document.getElementById("rememberMe");

    const logoutButton =
        document.getElementById("logoutButton");

    const emailAlertsToggle =
        document.getElementById("emailAlertsToggle");


    /* ==================================================
       UTILITÁRIOS DE USUÁRIO
    ================================================== */

    function getSavedUser() {

        const stored =
            localStorage.getItem("sensus_user");

        if (!stored) {
            return null;
        }

        try {
            return JSON.parse(stored);
        } catch {
            return null;
        }
    }


    function createUserName(email) {

        const username =
            email
                .split("@")[0]
                .replace(/[._-]/g, " ");

        return username
            .split(" ")
            .filter(Boolean)
            .map(word =>
                word.charAt(0).toUpperCase() +
                word.slice(1)
            )
            .join(" ");
    }


    function createInitials(name) {

        return name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map(word => word.charAt(0))
            .join("")
            .toUpperCase();
    }


    function updateUserInterface(user) {

        if (!user) {
            return;
        }

        const name =
            createUserName(user.email);

        const initials =
            createInitials(name);


        const elements = {

            sidebarName:
                document.getElementById("sidebarName"),

            sidebarEmail:
                document.getElementById("sidebarEmail"),

            sidebarAvatar:
                document.getElementById("sidebarAvatar"),

            topbarName:
                document.getElementById("topbarName"),

            topbarAvatar:
                document.getElementById("topbarAvatar"),

            profileName:
                document.getElementById("profileName"),

            profileEmail:
                document.getElementById("profileEmail"),

            profileAvatar:
                document.getElementById("profileAvatar")

        };


        elements.sidebarName.textContent =
            name;

        elements.sidebarEmail.textContent =
            user.email;

        elements.sidebarAvatar.textContent =
            initials;

        elements.topbarName.textContent =
            name;

        elements.topbarAvatar.textContent =
            initials;

        elements.profileName.textContent =
            name;

        elements.profileEmail.textContent =
            user.email;

        elements.profileAvatar.textContent =
            initials;
    }


    /* ==================================================
       LOGIN / LOGOUT
    ================================================== */

    function enterApplication(user) {

        loginPage.hidden = true;

        app.hidden = false;

        updateUserInterface(user);

    }


    function logout() {

        localStorage.removeItem(
            "sensus_user"
        );

        app.hidden = true;

        loginPage.hidden = false;

        loginForm.reset();

        loginMessage.textContent = "";

        loginMessage.style.color =
            "var(--red)";

    }


    loginForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const email =
                emailInput.value
                    .trim()
                    .toLowerCase();

            const password =
                passwordInput.value;


            if (!email || !password) {

                loginMessage.textContent =
                    "Preencha seu e-mail e sua senha.";

                return;
            }


            /*
             * VERSÃO VISUAL
             *
             * A autenticação real será feita
             * posteriormente por um serviço
             * de autenticação.
             *
             * A senha não é armazenada.
             */

            const user = {
                email
            };


            if (rememberMe.checked) {

                localStorage.setItem(
                    "sensus_user",
                    JSON.stringify(user)
                );

            }


            loginMessage.textContent = "";

            enterApplication(user);

        }
    );


    /* ==================================================
       MOSTRAR SENHA
    ================================================== */

    passwordToggle.addEventListener(
        "click",
        () => {

            const showing =
                passwordInput.type === "text";


            passwordInput.type =
                showing
                    ? "password"
                    : "text";


            passwordToggle.setAttribute(
                "aria-label",
                showing
                    ? "Mostrar senha"
                    : "Ocultar senha"
            );

        }
    );


    /* ==================================================
       RECUPERAÇÃO DE SENHA
    ================================================== */

    forgotPassword.addEventListener(
        "click",
        () => {

            const email =
                emailInput.value.trim();


            if (!email) {

                loginMessage.style.color =
                    "var(--red)";

                loginMessage.textContent =
                    "Digite seu e-mail primeiro.";

                emailInput.focus();

                return;
            }


            loginMessage.style.color =
                "var(--green)";

            loginMessage.textContent =
                "O link de recuperação será enviado por e-mail.";

        }
    );


    /* ==================================================
       NAVEGAÇÃO
    ================================================== */

    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );

    const sections =
        document.querySelectorAll(
            ".page-section"
        );

    const sectionButtons =
        document.querySelectorAll(
            "[data-section]"
        );

    const breadcrumb =
        document.getElementById(
            "breadcrumbCurrent"
        );


    const sectionNames = {

        dashboard:
            "Dashboard",

        monitoramento:
            "Doenças",

        vacinacao:
            "Vacinação",

        alertas:
            "Alertas",

        dados:
            "Fontes de dados",

        perfil:
            "Meu perfil"

    };


    function showSection(sectionId) {

        sections.forEach(section => {

            section.classList.remove(
                "active-section"
            );

        });


        const target =
            document.getElementById(
                sectionId
            );


        if (!target) {
            return;
        }


        target.classList.add(
            "active-section"
        );


        navItems.forEach(item => {

            item.classList.remove(
                "active"
            );


            if (
                item.dataset.section ===
                sectionId
            ) {

                item.classList.add(
                    "active"
                );

            }

        });


        if (breadcrumb) {

            breadcrumb.textContent =
                sectionNames[sectionId]
                || "Sensus";

        }


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    sectionButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const section =
                    button.dataset.section;


                if (!section) {
                    return;
                }


                showSection(section);

            }
        );

    });


    /* ==================================================
       MENU MOBILE
    ================================================== */

    const mobileMenu =
        document.getElementById(
            "mobileMenu"
        );


    mobileMenu.addEventListener(
        "click",
        () => {

            /*
             * O menu mobile completo
             * poderá ser expandido
             * posteriormente.
             */

            alert(
                "Menu mobile: navegação em desenvolvimento."
            );

        }
    );


    /* ==================================================
       FILTROS DO GRÁFICO
    ================================================== */

    const chartFilters =
        document.querySelectorAll(
            ".chart-filter"
        );


    chartFilters.forEach(filter => {

        filter.addEventListener(
            "click",
            () => {

                chartFilters.forEach(
                    item => {
                        item.classList.remove(
                            "active"
                        );
                    }
                );


                filter.classList.add(
                    "active"
                );


                console.log(
                    "Período:",
                    filter.dataset.period
                );

            }
        );

    });


    const chartDisease =
        document.getElementById(
            "chartDisease"
        );


    chartDisease.addEventListener(
        "change",
        () => {

            console.log(
                "Doença:",
                chartDisease.value
            );

            /*
             * FUTURO:
             *
             * Aqui será feita a consulta
             * aos dados reais.
             */

        }
    );


    /* ==================================================
       PREFERÊNCIA DE E-MAIL
    ================================================== */

    const savedEmailPreference =
        localStorage.getItem(
            "sensus_email_alerts"
        );


    if (
        savedEmailPreference !== null
    ) {

        emailAlertsToggle.checked =
            savedEmailPreference === "true";

    }


    emailAlertsToggle.addEventListener(
        "change",
        () => {

            localStorage.setItem(
                "sensus_email_alerts",
                emailAlertsToggle.checked
            );

        }
    );


    /* ==================================================
       BOTÃO DE NOTIFICAÇÕES
    ================================================== */

    const emailNotifications =
        document.getElementById(
            "emailNotifications"
        );


    emailNotifications.addEventListener(
        "click",
        () => {

            showSection("perfil");

        }
    );


    /* ==================================================
       SESSÃO SALVA
    ================================================== */

    const savedUser =
        getSavedUser();


    if (savedUser) {

        enterApplication(
            savedUser
        );

    }


    /* ==================================================
       LOG
    ================================================== */

    console.log(
        "Sensus Saúde — interface iniciada."
    );

});
