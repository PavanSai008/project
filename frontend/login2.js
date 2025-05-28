function togglemenu() {
    const links = document.getElementById("navlinks");
    links.classList.toggle("active");
    console.log("toggled")
}

function showWhiteBox() {
    const box = document.querySelector('.white-box');
    box.classList.toggle('show');
}

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Special case: hardcoded admin credentials
            if (email === "rinl@123" && password === "pass123") {
                localStorage.setItem('loggedInEmail', email);
                window.location.href = "dashboard.html";
                return;
            }

            const response = await fetch('http://localhost:4000/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ email, password })
            });
            const result = await response.json();
            if (response.ok) {
                localStorage.setItem('loggedInEmail', email);
                window.location.href = "user.html";
            } else {
                alert(result.error || "Login failed");
            }
        });
    }
});