/* ==========================================
   PORTFOLIO AUTHENTICATION SYSTEM
========================================== */


/* ==========================================
   DEFAULT ADMIN
========================================== */

const ADMIN_EMAIL = "admin@portfolio.com";
const ADMIN_PASSWORD = "admin123";


/* ==========================================
   GET ELEMENTS
========================================== */

const loginPage =
    document.getElementById("loginPage");

const signupPage =
    document.getElementById("signupPage");

const adminPage =
    document.getElementById("adminPage");

const userPage =
    document.getElementById("userPage");


/* ==========================================
   SHOW LOGIN
========================================== */

function showLogin() {

    loginPage.classList.remove("hidden");

    signupPage.classList.add("hidden");

    adminPage.classList.add("hidden");

    userPage.classList.add("hidden");

}


/* ==========================================
   SHOW SIGNUP
========================================== */

function showSignup() {

    loginPage.classList.add("hidden");

    signupPage.classList.remove("hidden");

    adminPage.classList.add("hidden");

    userPage.classList.add("hidden");

}


/* ==========================================
   LOGIN
========================================== */

document
    .getElementById("loginForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const email =
                document
                .getElementById("loginEmail")
                .value
                .trim();


            const password =
                document
                .getElementById("loginPassword")
                .value;


            const role =
                document
                .getElementById("loginRole")
                .value;


            const message =
                document.getElementById(
                    "loginMessage"
                );


            /* ==========================
               ADMIN LOGIN
            ========================== */

            if (role === "admin") {

                if (
                    email === ADMIN_EMAIL &&
                    password === ADMIN_PASSWORD
                ) {

                    const admin = {

                        name: "Admin",

                        email: ADMIN_EMAIL,

                        role: "admin"

                    };


                    localStorage.setItem(
                        "currentUser",
                        JSON.stringify(admin)
                    );


                    message.textContent =
                        "Admin login successful!";

                    message.style.color =
                        "green";


                    setTimeout(
                        showAdminDashboard,
                        500
                    );


                } else {

                    message.textContent =
                        "Invalid admin credentials.";

                    message.style.color =
                        "red";

                }


                return;

            }


            /* ==========================
               USER LOGIN
            ========================== */

            const users =
                JSON.parse(
                    localStorage.getItem(
                        "users"
                    )
                ) || [];


            const user =
                users.find(
                    function(user) {

                        return (
                            user.email === email &&
                            user.password === password
                        );

                    }
                );


            if (user) {

                localStorage.setItem(
                    "currentUser",
                    JSON.stringify(user)
                );


                message.textContent =
                    "Login successful!";

                message.style.color =
                    "green";


                setTimeout(
                    showUserDashboard,
                    500
                );


            } else {

                message.textContent =
                    "Invalid email or password.";

                message.style.color =
                    "red";

            }

        }
    );


/* ==========================================
   SIGNUP
========================================== */

document
    .getElementById("signupForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                document
                .getElementById("signupName")
                .value
                .trim();


            const email =
                document
                .getElementById("signupEmail")
                .value
                .trim();


            const password =
                document
                .getElementById("signupPassword")
                .value;


            const confirmPassword =
                document
                .getElementById("confirmPassword")
                .value;


            const message =
                document.getElementById(
                    "signupMessage"
                );


            /* CHECK PASSWORD */

            if (password !== confirmPassword) {

                message.textContent =
                    "Passwords do not match.";

                message.style.color =
                    "red";

                return;

            }


            /* GET USERS */

            let users =
                JSON.parse(
                    localStorage.getItem(
                        "users"
                    )
                ) || [];


            /* CHECK EXISTING USER */

            const existingUser =
                users.find(
                    function(user) {

                        return user.email === email;

                    }
                );


            if (existingUser) {

                message.textContent =
                    "Email already registered.";

                message.style.color =
                    "red";

                return;

            }


            /* CREATE USER */

            const newUser = {

                name: name,

                email: email,

                password: password,

                role: "user"

            };


            users.push(newUser);


            /* SAVE USER */

            localStorage.setItem(
                "users",
                JSON.stringify(users)
            );


            message.textContent =
                "Account created successfully!";

            message.style.color =
                "green";


            document
                .getElementById("signupForm")
                .reset();


            setTimeout(
                showLogin,
                1000
            );

        }
    );


/* ==========================================
   ADMIN DASHBOARD
========================================== */

function showAdminDashboard() {

    loginPage.classList.add("hidden");

    signupPage.classList.add("hidden");

    userPage.classList.add("hidden");

    adminPage.classList.remove("hidden");


    const currentUser =
        JSON.parse(
            localStorage.getItem(
                "currentUser"
            )
        );


    document.getElementById(
        "adminWelcome"
    ).textContent =
        "Welcome, " +
        currentUser.name +
        " 👋";


    displayAdminProjects();

    updateStatistics();

}


/* ==========================================
   USER DASHBOARD
========================================== */

function showUserDashboard() {

    loginPage.classList.add("hidden");

    signupPage.classList.add("hidden");

    adminPage.classList.add("hidden");

    userPage.classList.remove("hidden");


    const currentUser =
        JSON.parse(
            localStorage.getItem(
                "currentUser"
            )
        );


    document.getElementById(
        "userWelcome"
    ).textContent =
        "Welcome, " +
        currentUser.name +
        " 👋";


    displayUserProjects();

}


/* ==========================================
   ADD PROJECT
========================================== */

document
    .getElementById("projectForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const title =
                document
                .getElementById(
                    "projectTitle"
                )
                .value
                .trim();


            const technology =
                document
                .getElementById(
                    "projectTechnology"
                )
                .value
                .trim();


            const description =
                document
                .getElementById(
                    "projectDescription"
                )
                .value
                .trim();


            let projects =
                JSON.parse(
                    localStorage.getItem(
                        "projects"
                    )
                ) || [];


            const project = {

                id: Date.now(),

                title: title,

                technology: technology,

                description: description

            };


            projects.push(project);


            localStorage.setItem(
                "projects",
                JSON.stringify(projects)
            );


            document
                .getElementById(
                    "projectForm"
                )
                .reset();


            displayAdminProjects();

            updateStatistics();

        }
    );


/* ==========================================
   DISPLAY ADMIN PROJECTS
========================================== */

function displayAdminProjects() {

    const container =
        document.getElementById(
            "adminProjects"
        );


    const projects =
        JSON.parse(
            localStorage.getItem(
                "projects"
            )
        ) || [];


    container.innerHTML = "";


    if (projects.length === 0) {

        container.innerHTML =
            "<p>No projects added yet.</p>";

        return;

    }


    projects.forEach(
        function(project) {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "admin-project";


            div.innerHTML = `

                <div>

                    <h3>
                        ${project.title}
                    </h3>

                    <p>
                        <strong>
                            Technology:
                        </strong>

                        ${project.technology}
                    </p>

                    <p>
                        ${project.description}
                    </p>

                </div>


                <div class="actions">

                    <button
                        class="edit-btn"
                        onclick="editProject(${project.id})">

                        Edit

                    </button>


                    <button
                        class="delete-btn"
                        onclick="deleteProject(${project.id})">

                        Delete

                    </button>

                </div>

            `;


            container.appendChild(div);

        }
    );

}


/* ==========================================
   EDIT PROJECT
========================================== */

function editProject(id) {

    let projects =
        JSON.parse(
            localStorage.getItem(
                "projects"
            )
        ) || [];


    const project =
        projects.find(
            function(item) {

                return item.id === id;

            }
        );


    if (!project) return;


    const title =
        prompt(
            "Enter project title:",
            project.title
        );


    if (!title) return;


    const technology =
        prompt(
            "Enter technology:",
            project.technology
        );


    if (!technology) return;


    const description =
        prompt(
            "Enter project description:",
            project.description
        );


    if (!description) return;


    project.title =
        title;

    project.technology =
        technology;

    project.description =
        description;


    localStorage.setItem(
        "projects",
        JSON.stringify(projects)
    );


    displayAdminProjects();

    displayUserProjects();

}


/* ==========================================
   DELETE PROJECT
========================================== */

function deleteProject(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this project?"
        );


    if (!confirmDelete) return;


    let projects =
        JSON.parse(
            localStorage.getItem(
                "projects"
            )
        ) || [];


    projects =
        projects.filter(
            function(project) {

                return project.id !== id;

            }
        );


    localStorage.setItem(
        "projects",
        JSON.stringify(projects)
    );


    displayAdminProjects();

    updateStatistics();

}


/* ==========================================
   DISPLAY USER PROJECTS
========================================== */

function displayUserProjects() {

    const container =
        document.getElementById(
            "userProjects"
        );


    if (!container) return;


    const projects =
        JSON.parse(
            localStorage.getItem(
                "projects"
            )
        ) || [];


    container.innerHTML = "";


    if (projects.length === 0) {

        container.innerHTML = `

            <div>

                <h3>
                    No projects available
                </h3>

                <p>
                    Admin will add projects soon.
                </p>

            </div>

        `;

        return;

    }


    projects.forEach(
        function(project) {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "user-project";


            div.innerHTML = `

                <h3>
                    ${project.title}
                </h3>

                <p class="technology">
                    ${project.technology}
                </p>

                <p>
                    ${project.description}
                </p>

            `;


            container.appendChild(div);

        }
    );

}


/* ==========================================
   STATISTICS
========================================== */

function updateStatistics() {

    const projects =
        JSON.parse(
            localStorage.getItem(
                "projects"
            )
        ) || [];


    const users =
        JSON.parse(
            localStorage.getItem(
                "users"
            )
        ) || [];


    document.getElementById(
        "projectCount"
    ).textContent =
        projects.length;


    document.getElementById(
        "userCount"
    ).textContent =
        users.length;

}


/* ==========================================
   LOGOUT
========================================== */

function logout() {

    localStorage.removeItem(
        "currentUser"
    );


    showLogin();

}


/* ==========================================
   CHECK SESSION WHEN PAGE LOADS
========================================== */

window.addEventListener(
    "load",
    function() {

        const currentUser =
            JSON.parse(
                localStorage.getItem(
                    "currentUser"
                )
            );


        if (!currentUser) {

            showLogin();

            return;

        }


        if (
            currentUser.role === "admin"
        ) {

            showAdminDashboard();

        }


        else if (
            currentUser.role === "user"
        ) {

            showUserDashboard();

        }

    }
);