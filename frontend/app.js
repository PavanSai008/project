// Toggle navbar menu (if needed)
function togglemenu() {
  const links = document.getElementById("navlinks");
  links.classList.toggle("active");
  console.log("toggled");
}

function showWhiteBox() {
    const box = document.querySelector('.white-box');
    box.classList.toggle('show');
}

// Wait for the document to fully load
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            // For radio buttons, get the checked value
            data.gender = form.querySelector('input[name="gender"]:checked')?.value || "";

            const response = await fetch('http://127.0.0.1:4000/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });
            const result = await response.json();
            alert(result.message || result.error);
            if (response.ok) {
                // Save email for later use in document upload
                localStorage.setItem('savedEmail', data.email);
                window.location.href = "sec5.html";
            }
        });
    }

    // Document upload logic
    const uploadButton = document.getElementById("uploadAllButton");
    if (uploadButton) {
        uploadButton.addEventListener("click", async () => {
            const savedEmail = localStorage.getItem('savedEmail');
            if (!savedEmail) {
                alert("Please register first to get your email linked.");
                return;
            }
            // Check all required files
            const aadhaar = document.querySelector('input[name="aadhaar"]').files[0];
            const pan = document.querySelector('input[name="pan"]').files[0];
            const resume = document.querySelector('input[name="resume"]').files[0];
            const certificate = document.querySelector('input[name="certificate"]').files[0];
            const photo = document.querySelector('input[name="photo"]').files[0];

            if (!aadhaar || !pan || !resume || !certificate || !photo) {
                alert("All files (Aadhaar, PAN, Resume, Certificate, Photo) are required!");
                return;
            }

            const formData = new FormData();
            formData.append("email", savedEmail);
            formData.append("aadhaar", aadhaar);
            formData.append("pan", pan);
            formData.append("resume", resume);
            formData.append("certificate", certificate);
            formData.append("photo", photo);

            try {
                const response = await fetch("http://localhost:4000/upload", {
                    method: "POST",
                    body: formData
                });
                const result = await response.json();
                alert(result.message || result.error);
                if (response.ok) {
                    window.location.href = "sec6.html";
                }
            } catch (error) {
                alert("❌ File upload failed");
                console.error(error);
            }
        });
    }
});