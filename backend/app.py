from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from pymongo import MongoClient
import gridfs
import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from bson import ObjectId
import io

app = Flask(__name__)
CORS(app)

# MongoDB Atlas connection string (replace with your actual credentials)
MONGO_URI = "mongodb+srv://pavan_user:<password>@cluster0.pkiu3km.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"


# Initialize MongoDB client
client = MongoClient(MONGO_URI)
db = client["job_application"]
fs = gridfs.GridFS(db)

# MongoDB Collection
applicants = db["applicants"]

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.json if request.is_json else request.form
        applicant = {
            "name": data.get("name"),
            "father_name": data.get("father_name") or data.get("father-name"),
            "gender": data.get("gender"),
            "age": int(data.get("age")) if data.get("age") else None,
            "dob": data.get("dob"),
            "state": data.get("state"),
            "qualification": data.get("qualification"),
            "phone": data.get("phone"),
            "email": data.get("email"),
            "password": data.get("password"),
            "address": data.get("address"),
            "department": data.get("department"),
            "resumeFileId": None
        }
        if not applicant["email"]:
            return jsonify({"error": "Email is required"}), 400
        applicants.insert_one(applicant)
        return jsonify({"message": "Registration successful"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/upload', methods=['POST'])
def upload():
    try:
        email = request.form.get("email")
        if not email:
            return jsonify({"error": "Email is required"}), 400

        # Check if applicant exists
        applicant = applicants.find_one({"email": email})
        if not applicant:
            return jsonify({"error": "Applicant not found"}), 404

        file_fields = ["aadhaar", "pan", "photo", "certificate", "resume", "other"]
        uploaded_file_ids = {}
        for field in file_fields:
            file = request.files.get(field)
            if file:
                file_id = fs.put(file.read(), filename=file.filename, content_type=file.content_type)
                uploaded_file_ids[field] = str(file_id)  # Store ObjectId as string

        applicants.update_one(
            {"email": email},
            {"$set": {"documents": uploaded_file_ids}}
        )

        return jsonify({"message": "Files uploaded successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json if request.is_json else request.form
        email = data.get("email")
        password = data.get("password")
        # Find user by email and password
        user = applicants.find_one({"email": email, "password": password})
        if user:
            return jsonify({"message": "Login successful"}), 200
        else:
            return jsonify({"error": "Invalid Employee ID or Password"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/user', methods=['GET'])
def get_user():
    email = request.args.get('email')
    if not email:
        return jsonify({"error": "Email required"}), 400
    user = applicants.find_one({"email": email}, {"_id": 0, "password": 0})
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user), 200

@app.route('/admin/applicants', methods=['GET'])
def get_applicants():
    applicants_list = []
    for app in applicants.find():
        app['_id'] = str(app['_id'])
        # Prepare file links if documents exist
        docs = app.get('documents', {})
        app['files'] = {k: str(v) for k, v in docs.items()}
        applicants_list.append(app)
    return jsonify(applicants_list), 200

@app.route('/admin/file/<file_id>', methods=['GET'])
def get_file(file_id):
    try:
        file = fs.get(ObjectId(file_id))
        return send_file(io.BytesIO(file.read()), download_name=file.filename, as_attachment=True)
    except Exception as e:
        return jsonify({"error": str(e)}), 404

@app.route('/admin/applicant/status', methods=['POST'])
def update_status():
    data = request.json
    applicant_id = data.get('id')
    status = data.get('status')
    if not applicant_id or status not in ['approved', 'rejected']:
        return jsonify({"error": "Invalid data"}), 400
    result = applicants.update_one({'_id': ObjectId(applicant_id)}, {'$set': {'status': status}})
    if result.matched_count:
        return jsonify({"message": "Status updated"}), 200
    return jsonify({"error": "Applicant not found"}), 404

if __name__ == '__main__':
    app.run(port=4000, debug=True)
