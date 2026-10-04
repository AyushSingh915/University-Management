// ======================================================
// API URL
// ======================================================

const API_URL = "http://localhost:5000/api";



// ======================================================
// GET ALL COURSES
// ======================================================

async function getCourses() {

    try {

        const response = await fetch(
            `${API_URL}/courses`
        );


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.message
            );

        }


        displayCourses(
            data.courses
        );


    } catch (error) {

        console.log(
            "Error loading courses:",
            error
        );


        const container =
            document.getElementById(
                "coursesContainer"
            );


        if (container) {

            container.innerHTML =
                "<p>Failed to load courses.</p>";

        }

    }

}



// ======================================================
// DISPLAY COURSES
// ======================================================

function displayCourses(courses) {

    const container =
        document.getElementById(
            "coursesContainer"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (courses.length === 0) {

        container.innerHTML =
            "<p>No courses available.</p>";

        return;
    }


    courses.forEach(course => {

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "student-course-card";


        card.innerHTML = `

            <h3>
                ${course.title}
            </h3>


            <p>
                <strong>Course Code:</strong>
                ${course.courseCode}
            </p>


            <p>
                <strong>Instructor:</strong>
                ${course.instructor}
            </p>


            <p>
                <strong>Credits:</strong>
                ${course.credits}
            </p>


            <p>
                ${course.description}
            </p>


            <button
                class="enroll-btn"
                onclick="enrollCourse('${course._id}')"
            >
                Enroll
            </button>

        `;


        container.appendChild(
            card
        );

    });

}



// ======================================================
// LOGIN
// ======================================================

const loginForm =
    document.getElementById(
        "loginForm"
    );


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document.getElementById(
                    "loginEmail"
                ).value;


            const password =
                document.getElementById(
                    "loginPassword"
                ).value;


            const message =
                document.getElementById(
                    "loginMessage"
                );


            try {

                const response =
                    await fetch(
                        `${API_URL}/auth/login`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                email: email,

                                password: password

                            })

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    message.textContent =
                        data.message;

                    return;
                }


                // Save JWT token
                localStorage.setItem(
                    "token",
                    data.token
                );


                // Save user information
                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        data.user
                    )
                );


                message.textContent =
                    "Login successful!";


                // Clear login form
                loginForm.reset();


                // Update page
                updateUserUI();


                // Load courses
                getCourses();


            } catch (error) {

                console.log(
                    "Login error:",
                    error
                );


                message.textContent =
                    "Unable to connect to server.";

            }

        }
    );

}



// ======================================================
// UPDATE USER INTERFACE
// ======================================================

function updateUserUI() {

    const token =
        localStorage.getItem(
            "token"
        );


    const userData =
        localStorage.getItem(
            "user"
        );


    const welcomeMessage =
        document.getElementById(
            "welcomeMessage"
        );


    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );


    const loginSection =
        document.getElementById(
            "loginSection"
        );


    const studentSection =
        document.getElementById(
            "studentSection"
        );


    const adminSection =
        document.getElementById(
            "adminSection"
        );


    const studentWelcome =
        document.getElementById(
            "studentWelcome"
        );


    const registerSection =
        document.getElementById(
            "registerForm"
        );



    // ==================================================
    // USER NOT LOGGED IN
    // ==================================================

    if (!token || !userData) {

        if (welcomeMessage) {

            welcomeMessage.textContent =
                "Welcome, Guest";

        }


        if (logoutBtn) {

            logoutBtn.style.display =
                "none";

        }


        if (loginSection) {

            loginSection.style.display =
                "block";

        }


        if (studentSection) {

            studentSection.style.display =
                "none";

        }


        if (adminSection) {

            adminSection.style.display =
                "none";

        }


        return;
    }



    // ==================================================
    // GET USER
    // ==================================================

    const user =
        JSON.parse(
            userData
        );



    // ==================================================
    // USER INFORMATION
    // ==================================================

    if (welcomeMessage) {

        welcomeMessage.textContent =
            `Welcome, ${user.name} (${user.role})`;

    }


    if (logoutBtn) {

        logoutBtn.style.display =
            "inline-block";

    }


    if (loginSection) {

        loginSection.style.display =
            "none";

    }



    // ==================================================
    // STUDENT
    // ==================================================

    if (user.role === "student") {

        if (studentSection) {

            studentSection.style.display =
                "block";

        }


        if (adminSection) {

            adminSection.style.display =
                "none";

        }


        if (studentWelcome) {

            studentWelcome.textContent =
                `Welcome, ${user.name}`;

        }


        loadMyCourses();

    }



    // ==================================================
    // ADMIN
    // ==================================================

    else if (user.role === "admin") {

        if (studentSection) {

            studentSection.style.display =
                "none";

        }


        if (adminSection) {

            adminSection.style.display =
                "block";

        }


        loadAdminCourses();

    }

}



// ======================================================
// LOGOUT
// ======================================================

function logout() {

    localStorage.removeItem(
        "token"
    );


    localStorage.removeItem(
        "user"
    );


    location.reload();

}



// ======================================================
// ENROLL COURSE
// ======================================================

async function enrollCourse(courseId) {

    const token =
        localStorage.getItem(
            "token"
        );


    if (!token) {

        alert(
            "Please login first."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/enrollments`,
                {
                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body: JSON.stringify({

                        courseId:
                            courseId

                    })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message
            );

            return;
        }


        alert(
            "✅ Enrolled successfully!"
        );


        // Refresh My Courses
        loadMyCourses();


    } catch (error) {

        console.log(
            "Enrollment error:",
            error
        );


        alert(
            "Something went wrong."
        );

    }

}



// ======================================================
// LOAD MY COURSES
// ======================================================

async function loadMyCourses() {

    const token =
        localStorage.getItem(
            "token"
        );


    const container =
        document.getElementById(
            "myCoursesContainer"
        );


    if (!container) {
        return;
    }


    if (!token) {

        container.innerHTML =
            "<p>Please login to see your courses.</p>";

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/enrollments/my-courses`,
                {
                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            container.innerHTML =
                `<p>${data.message}</p>`;

            return;
        }


        container.innerHTML = "";


        if (
            data.enrollments.length === 0
        ) {

            container.innerHTML =
                "<p>You are not enrolled in any course yet.</p>";

            return;
        }


        data.enrollments.forEach(
            enrollment => {

                const course =
                    enrollment.course;


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "student-course-card";


                card.innerHTML = `

                    <h3>
                        ${course.title}
                    </h3>


                    <p>
                        <strong>Course Code:</strong>
                        ${course.courseCode}
                    </p>


                    <p>
                        <strong>Instructor:</strong>
                        ${course.instructor}
                    </p>


                    <p>
                        <strong>Credits:</strong>
                        ${course.credits}
                    </p>


                    <p>
                        ${course.description}
                    </p>


                    <span class="enrolled-badge">
                        ✅ Enrolled
                    </span>

                `;


                container.appendChild(
                    card
                );

            }
        );


    } catch (error) {

        console.log(
            "My courses error:",
            error
        );


        container.innerHTML =
            "<p>Failed to load your courses.</p>";

    }

}



// ======================================================
// REGISTER STUDENT
// ======================================================

const registerForm =
    document.getElementById(
        "registerForm"
    );


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const name =
                document.getElementById(
                    "registerName"
                ).value;


            const email =
                document.getElementById(
                    "registerEmail"
                ).value;


            const password =
                document.getElementById(
                    "registerPassword"
                ).value;


            const message =
                document.getElementById(
                    "registerMessage"
                );


            try {

                const response =
                    await fetch(
                        `${API_URL}/auth/register`,
                        {
                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body: JSON.stringify({

                                name:
                                    name,

                                email:
                                    email,

                                password:
                                    password

                            })

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    message.textContent =
                        data.message;

                    return;
                }


                message.textContent =
                    "Registration successful! You can now login.";


                registerForm.reset();


            } catch (error) {

                console.log(
                    "Registration error:",
                    error
                );


                message.textContent =
                    "Unable to connect to server.";

            }

        }
    );

}



// ======================================================
// ADMIN - ADD COURSE
// ======================================================

const courseForm =
    document.getElementById(
        "courseForm"
    );


if (courseForm) {

    courseForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const token =
                localStorage.getItem(
                    "token"
                );


            if (!token) {

                alert(
                    "Please login as admin."
                );

                return;
            }


            const title =
                document.getElementById(
                    "courseTitle"
                ).value;


            const courseCode =
                document.getElementById(
                    "courseCode"
                ).value;


            const description =
                document.getElementById(
                    "courseDescription"
                ).value;


            const instructor =
                document.getElementById(
                    "courseInstructor"
                ).value;


            const credits =
                document.getElementById(
                    "courseCredits"
                ).value;


            const message =
                document.getElementById(
                    "courseMessage"
                );


            try {

                const response =
                    await fetch(
                        `${API_URL}/courses`,
                        {
                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${token}`

                            },

                            body: JSON.stringify({

                                title:
                                    title,

                                courseCode:
                                    courseCode,

                                description:
                                    description,

                                instructor:
                                    instructor,

                                credits:
                                    Number(
                                        credits
                                    )

                            })

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    message.textContent =
                        data.message;

                    return;
                }


                message.textContent =
                    "Course added successfully!";


                courseForm.reset();


                // Refresh available courses
                getCourses();


                // Refresh admin courses
                loadAdminCourses();


            } catch (error) {

                console.log(
                    "Add course error:",
                    error
                );


                message.textContent =
                    "Failed to add course.";

            }

        }
    );

}



// ======================================================
// LOAD ADMIN COURSES
// ======================================================

async function loadAdminCourses() {

    const token =
        localStorage.getItem(
            "token"
        );


    if (!token) {
        return;
    }


    const adminCourses =
        document.getElementById(
            "adminCourses"
        );


    const totalCourses =
        document.getElementById(
            "totalCourses"
        );


    if (!adminCourses) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/courses`
            );


        const data =
            await response.json();


        if (!response.ok) {

            adminCourses.innerHTML =
                `<p>${data.message}</p>`;

            return;
        }


        adminCourses.innerHTML =
            "";


        // Show total courses
        if (totalCourses) {

            totalCourses.textContent =
                data.count;

        }


        if (data.courses.length === 0) {

            adminCourses.innerHTML =
                "<p>No courses available.</p>";

            return;
        }


        data.courses.forEach(
            course => {

                const courseCard =
                    document.createElement(
                        "div"
                    );


                courseCard.className =
                    "admin-course-card";


                courseCard.innerHTML = `

                    <h3>
                        ${course.title}
                    </h3>


                    <p>
                        <strong>Code:</strong>
                        ${course.courseCode}
                    </p>


                    <p>
                        <strong>Instructor:</strong>
                        ${course.instructor}
                    </p>


                    <p>
                        <strong>Credits:</strong>
                        ${course.credits}
                    </p>


                    <p>
                        ${course.description}
                    </p>


                    <button
                        class="edit-btn"
                        onclick="editCourse('${course._id}')"
                    >
                        ✏️ Edit
                    </button>


                    <button
                        class="delete-btn"
                        onclick="deleteCourse('${course._id}')"
                    >
                        🗑️ Delete
                    </button>

                `;


                adminCourses.appendChild(
                    courseCard
                );

            }
        );


    } catch (error) {

        console.log(
            "Admin courses error:",
            error
        );

    }

}



// ======================================================
// EDIT COURSE
// ======================================================

async function editCourse(courseId) {

    const newTitle =
        prompt(
            "Enter new course title:"
        );


    if (!newTitle) {
        return;
    }


    const token =
        localStorage.getItem(
            "token"
        );


    if (!token) {

        alert(
            "Please login as admin."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/courses/${courseId}`,
                {
                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body: JSON.stringify({

                        title:
                            newTitle

                    })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message
            );

            return;
        }


        alert(
            "Course updated successfully!"
        );


        getCourses();

        loadAdminCourses();


    } catch (error) {

        console.log(
            "Edit course error:",
            error
        );


        alert(
            "Something went wrong."
        );

    }

}



// ======================================================
// DELETE COURSE
// ======================================================

async function deleteCourse(courseId) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this course?"
        );


    if (!confirmDelete) {
        return;
    }


    const token =
        localStorage.getItem(
            "token"
        );


    if (!token) {

        alert(
            "Please login as admin."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/courses/${courseId}`,
                {
                    method: "DELETE",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message
            );

            return;
        }


        alert(
            "Course deleted successfully!"
        );


        getCourses();

        loadAdminCourses();


    } catch (error) {

        console.log(
            "Delete course error:",
            error
        );


        alert(
            "Something went wrong."
        );

    }

}



// ======================================================
// INITIAL PAGE LOAD
// ======================================================

getCourses();

updateUserUI();