# RINL Employee Verification System

This project is a web application for employee registration and document verification, using a Flask backend with MongoDB and a JavaScript/HTML/CSS frontend.

---

## Prerequisites

- **Python 3.8+**
- **Node.js** (for npm, optional, only if you want to use frontend build tools)
- **MongoDB client server** (running locally on default port 27017)

---

## Backend Setup

1. **Install Python dependencies:**

   ```terminal
   pip install flask flask-cors pymongo gridfs
   ```

2. **Start MongoDB**  
   Make sure MongoDB is running locally.  
   On Windows, you can start it from the command prompt:
   ```terminal
   mongod
   ```

3. **Run the Flask backend:**

   ```terminal
   cd backend
   python app.py
   ```

   The backend will be available at [http://127.0.0.1:4000].

---

## Frontend Setup

1. **No build step is required.**  
   Just open the `frontend/sec1.html` file in your browser to start the registration process.

2. **Make sure the backend is running before using the frontend.**

---

## Usage

1. **Introduction**
    An introductory page


2. **Do's & Dont's
    This page explains the do's and dont's in the plant premises


3. **Test**
    A samll test on what you have understood in the previous page


4. **Register:**  
   Fill out the registration form (`sec4.html`).  
   On successful registration, your email is saved in the browser for document upload.

5. **Upload Documents:**  
   After registration, you are redirected to `sec5.html` to upload your documents.

6. **Verification:**  
   After uploading, you are redirected to `sec6.html`.

---

## Troubleshooting

- If you see "Please register first to get your email linked," make sure you completed registration and your browser allows localStorage.
- If you get MongoDB connection errors, ensure MongoDB is running on your machine.
- For CORS issues, make sure you are running both frontend and backend on `localhost`.
E8u8A3rI5oBVOyUO
---
## Project structure

project/
├── backend/
│   └── app.py
├── frontend/
│   ├── all HTML,CSS & jpg files
│   └── app.js
├──readme.txt