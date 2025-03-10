document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Evita el envío del formulario por defecto

        const usernameInput = document.getElementById("username").value.trim();
        const passwordInput = document.getElementById("password").value.trim();

        if (!usernameInput || !passwordInput) {
            alert("Please enter both username and password.");
            return;
        }

        try {
            const response = await fetch("https://api-corp-tort.onrender.com/users/get_users");
            if (!response.ok) {
                throw new Error("Error fetching users");
            }

            const users = await response.json();
            const user = users.find(u => (u.username === usernameInput) && u.password === passwordInput);

            if (user) {
                alert("Login successful!");
                // Aquí puedes guardar la sesión del usuario o redirigirlo a otra página
                window.location.href = "dashboard.html"; // Redirección tras el login
            } else {
                alert("Invalid username or password.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("There was an error logging in. Please try again.");
        }
    });
});
