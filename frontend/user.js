function showFileConfirmation(storageKey, label, elementId, showImage = false) {
    const fileData = JSON.parse(localStorage.getItem(storageKey));
    const target = document.getElementById(elementId);
    if (target) {
        if (fileData) {
            target.innerHTML = `✅ <strong>${label}:</strong> ${fileData.name || "File uploaded"}`;
            if (showImage && fileData.type?.startsWith("image/")) {
                const img = document.createElement("img");
                img.src = fileData.content;
                img.width = 150;
                img.style.display = "block";
                img.style.marginTop = "8px";
                target.appendChild(img);
            }
        } else {
            target.innerHTML = `❌ <strong>${label}:</strong> Not uploaded`;
        }
    }
}

const idCardbtn = document.getElementById('idcardbtn');
const confirmbtn = document.getElementById('confirmbtn');
const contentDiv = document.getElementById('content');

function loadContent(contentType) {
    if (contentType === 'idcard') {
        // Fetch and display user details, QR code, and photo
        (async function() {
            const email = localStorage.getItem('loggedInEmail');
            const contentDiv = document.getElementById('content');
            if (!email) {
                if (contentDiv) contentDiv.innerHTML = "<p>Please log in first.</p>";
                return;
            }
            try {
                const response = await fetch(`http://localhost:4000/user?email=${encodeURIComponent(email)}`);
                const user = await response.json();
                if (!response.ok) {
                    if (contentDiv) contentDiv.innerHTML = `<p>${user.error}</p>`;
                    return;
                }
                // Get photo file ID if available
                let photoUrl = "";
                if (user.documents && user.documents.photo) {
                    photoUrl = `http://localhost:4000/admin/file/${user.documents.photo}`;
                }
                contentDiv.innerHTML = `
                <div class="user-details-container" style="display: flex; align-items: flex-start; gap: 40px;">
                    <div>
                        <h2>User Details</h2>
                        <ul>
                            <li><strong>Name:</strong> ${user.name || ""}</li>
                            <li><strong>Father's Name:</strong> ${user.father_name || ""}</li>
                            <li><strong>Gender:</strong> ${user.gender || ""}</li>
                            <li><strong>Age:</strong> ${user.age || ""}</li>
                            <li><strong>Date of Birth:</strong> ${user.dob || ""}</li>
                            <li><strong>State:</strong> ${user.state || ""}</li>
                            <li><strong>Status:</strong> ${user.status || "pending"}</li>
                        </ul>
                        <h3>Your QR Code:</h3>
                        <img src="https://quickchart.io/qr?text=${encodeURIComponent(user.name || '')}&centerImageUrl=https://static.wixstatic.com/media/2e3722_6b24505f16fb4b2fae7b9e4f57030921~mv2.png/v1/fill/w_352,h_331,al_c,q_85,enc_avif,quality_auto/2e3722_6b24505f16fb4b2fae7b9e4f57030921~mv2.png" alt="QR Code">
                    </div>
                    <div>
                        <h3>Your Photo</h3>
                        ${photoUrl ? `<img src="${photoUrl}" alt="User Photo" style="max-width:180px;max-height:220px;border-radius:8px;border:1px solid #ccc;">` : "<p>No photo uploaded.</p>"}
                    </div>
                </div>
                `;
            } catch (err) {
                const contentDiv = document.getElementById('content');
                if (contentDiv) contentDiv.innerHTML = "<p>Error loading user data.</p>";
            }
        })();
    } else if (contentType === 'confirm') {
        // Display all uploaded documents
        (async function() {
            const email = localStorage.getItem('loggedInEmail');
            const contentDiv = document.getElementById('content');
            if (!email) {
                if (contentDiv) contentDiv.innerHTML = "<p>Please log in first.</p>";
                return;
            }
            try {
                const response = await fetch(`http://localhost:4000/user?email=${encodeURIComponent(email)}`);
                const user = await response.json();
                if (!response.ok) {
                    if (contentDiv) contentDiv.innerHTML = `<p>${user.error}</p>`;
                    return;
                }
                let docsHtml = '';
                const docFields = [
                    { key: 'aadhaar', label: 'Aadhaar Card' },
                    { key: 'pan', label: 'PAN Card' },
                    { key: 'resume', label: 'Resume/CV' },
                    { key: 'certificate', label: 'Education Certificate' },
                    { key: 'photo', label: 'Photo for ID Card' }
                ];
                if (user.documents) {
                    docsHtml = '<ul>';
                    docFields.forEach(doc => {
                        if (user.documents[doc.key]) {
                            const fileUrl = `http://localhost:4000/admin/file/${user.documents[doc.key]}`;
                            docsHtml += `<li><strong>${doc.label}:</strong> <a href="${fileUrl}" target="_blank">View</a></li>`;
                        } else {
                            docsHtml += `<li><strong>${doc.label}:</strong> Not uploaded</li>`;
                        }
                    });
                    docsHtml += '</ul>';
                } else {
                    docsHtml = "<p>No documents uploaded.</p>";
                }
                contentDiv.innerHTML = `
                    <div class="heading">
                        <p>Uploaded Documents Confirmation</p>
                    </div>
                    <div class="content-section">
                        <h2>Your Uploaded Documents</h2>
                        ${docsHtml}
                    </div>
                `;
            } catch (err) {
                const contentDiv = document.getElementById('content');
                if (contentDiv) contentDiv.innerHTML = "<p>Error loading documents.</p>";
            }
        })();
    } else {
        // Default/error case
        const contentDiv = document.getElementById('content');
        if (contentDiv) {
            contentDiv.innerHTML = `
                <div class="heading">
                    <p> Welcome to RINL Employee Verification System </p>
                </div>
                <div class="content-section">
                    <h2>Error</h2>
                    <p>Content not found.</p>
                </div>
            `;
        }
    }
}

function generateIdCard() {
    const name = document.getElementById('name').value;
    const dob = document.getElementById('dob').value;
    const tempId = document.getElementById('temp-id').value;
    const preview = document.getElementById('id-card-preview');
    if (name && dob && tempId) {
        preview.innerHTML = `
            <h3>Temporary ID Card</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Date of Birth:</strong> ${dob}</p>
            <p><strong>Temporary ID:</strong> ${tempId}</p>
        `;
    } else {
        preview.innerHTML = '<p style="color: red;">Please fill all fields.</p>';
    }
}

function loadUploadedPhoto() {
    const photoImg = document.getElementById('employeePhoto');
    if (photoImg) {
        const photoData = JSON.parse(localStorage.getItem('uploadedIdCard'));
        if (photoData && photoData.type?.startsWith('image/') && photoData.content) {
            photoImg.src = photoData.content;
        }
    }
}

function togglemenu() {
    const navLinks = document.getElementById('navlinks');
    navLinks.classList.toggle('active');
}

idCardbtn.addEventListener('click', (e) => {
    e.preventDefault();
    loadContent('idcard');
});

confirmbtn.addEventListener('click', (e) => {
    e.preventDefault();
    loadContent('confirm');
});

loadContent('idcard');