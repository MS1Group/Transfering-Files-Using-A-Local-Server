from flask import Flask, send_from_directory, jsonify, request, render_template_string, redirect, url_for, flash, session
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
import os
import json
import bcrypt
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key = 'your-secret-key-change-this-to-something-random'  # Change this!
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_NAME'] = 'file_manager_session'

# Flask-Login setup
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
login_manager.session_protection = "strong"  # Extra protection

BASE_FOLDER = "/path/to/your/folder"  # Change this to the folder you want to manage
USERS_FILE = "users.json"

# User class for Flask-Login
class User(UserMixin):
    def __init__(self, username):
        self.id = username

def load_users():
    """Load users from JSON file"""
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, 'r') as f:
            return json.load(f)
    return {}

def save_users(users):
    """Save users to JSON file"""
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f, indent=2)

def create_default_user():
    """Create default user if no users exist"""
    users = load_users()
    if not users:
        # Default credentials - CHANGE THESE!
        username = "admin"
        password = "password123"
        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        users[username] = hashed.decode('utf-8')
        save_users(users)
        print(f"Created default user: {username} / {password}")
        print("Please change these credentials!")

@login_manager.user_loader
def load_user(user_id):
    users = load_users()
    if user_id in users:
        return User(user_id)
    return None

@app.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        users = load_users()
        
        if username in users:
            stored_hash = users[username].encode('utf-8')
            if bcrypt.checkpw(password.encode('utf-8'), stored_hash):
                user = User(username)
                login_user(user, remember=False)  # Don't remember across sessions
                session.permanent = False  # Make session expire on browser close
                return redirect(url_for('home'))
        
        flash('Invalid credentials')
    
    return render_template_string('''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - File Manager</title>
    <style>
        :root {
            --bg-primary: #faf9f6;
            --bg-card: #ffffff;
            --accent-yellow: #ffd60a;
            --text-primary: #1a1a1a;
            --text-secondary: #6b6b6b;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: var(--bg-primary);
            color: var(--text-primary);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .login-container {
            background: var(--bg-card);
            border: 2px solid var(--text-primary);
            border-radius: 16px;
            padding: 40px;
            width: 100%;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        h1 {
            font-size: 24px;
            margin-bottom: 24px;
            text-align: center;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            font-weight: 600;
            margin-bottom: 8px;
            font-size: 14px;
        }
        input[type="text"],
        input[type="password"] {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid var(--text-primary);
            border-radius: 12px;
            font-size: 14px;
            font-weight: 500;
            background: var(--bg-primary);
        }
        input:focus {
            outline: none;
            background: var(--accent-yellow);
            box-shadow: 0 0 0 4px rgba(255, 214, 10, 0.2);
        }
        button {
            width: 100%;
            padding: 12px;
            background: var(--accent-yellow);
            border: 2px solid var(--text-primary);
            border-radius: 24px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s ease;
        }
        button:hover {
            transform: translateY(-2px);
        }
        button:active {
            transform: translateY(0);
        }
        .error {
            background: #ff6b6b;
            color: white;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 14px;
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <h1>📁 File Manager Login</h1>
        {% with messages = get_flashed_messages() %}
            {% if messages %}
                <div class="error">{{ messages[0] }}</div>
            {% endif %}
        {% endwith %}
        <form method="POST">
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required autofocus>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit">Login</button>
        </form>
    </div>
</body>
</html>
    ''')

@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route("/")
@login_required
def home():
    return app.send_static_file("index.html")

def safe_path(path):
    full_path = os.path.abspath(os.path.join(BASE_FOLDER, path))
    if not full_path.startswith(os.path.abspath(BASE_FOLDER)):
        return BASE_FOLDER
    return full_path

@app.route("/files")
@login_required
def list_files():
    path = request.args.get("path", "")
    folder = safe_path(path)

    items = []
    for name in os.listdir(folder):
        if name.startswith("."):
            continue
        full = os.path.join(folder, name)
        items.append({
            "name": name,
            "is_dir": os.path.isdir(full)
        })

    return jsonify(items)

@app.route("/open/<path:filename>")
@login_required
def open_file(filename):
    folder = os.path.dirname(filename)
    file = os.path.basename(filename)
    return send_from_directory(safe_path(folder), file, as_attachment=False)

@app.route("/download/<path:filename>")
@login_required
def download_file(filename):
    folder = os.path.dirname(filename)
    file = os.path.basename(filename)
    return send_from_directory(safe_path(folder), file, as_attachment=True)

@app.route("/upload", methods=['POST'])
@login_required
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['file']
    path = request.form.get('path', '')
    
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    filename = secure_filename(file.filename)
    target_folder = safe_path(path)
    
    # Ensure target folder exists
    os.makedirs(target_folder, exist_ok=True)
    
    file_path = os.path.join(target_folder, filename)
    file.save(file_path)
    
    return jsonify({"success": True, "filename": filename})

@app.route("/delete/<path:filename>", methods=['POST'])
@login_required
def delete_file(filename):
    try:
        file_path = safe_path(filename)
        
        # Check if file exists
        if not os.path.exists(file_path):
            return jsonify({"error": "File not found"}), 404
        
        # Check if it's a file (not directory)
        if os.path.isdir(file_path):
            return jsonify({"error": "Cannot delete directories"}), 400
        
        # Delete the file
        os.remove(file_path)
        return jsonify({"success": True, "message": "File deleted"})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/delete-multiple", methods=['POST'])
@login_required
def delete_multiple():
    try:
        data = request.get_json()
        files = data.get('files', [])
        
        if not files:
            return jsonify({"error": "No files provided"}), 400
        
        deleted = []
        failed = []
        
        for filename in files:
            try:
                file_path = safe_path(filename)
                
                if not os.path.exists(file_path):
                    failed.append({"file": filename, "reason": "Not found"})
                    continue
                
                if os.path.isdir(file_path):
                    failed.append({"file": filename, "reason": "Is a directory"})
                    continue
                
                os.remove(file_path)
                deleted.append(filename)
            except Exception as e:
                failed.append({"file": filename, "reason": str(e)})
        
        return jsonify({
            "success": True,
            "deleted": len(deleted),
            "failed": len(failed),
            "details": {"deleted": deleted, "failed": failed}
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/create-folder", methods=['POST'])
@login_required
def create_folder():
    try:
        data = request.get_json()
        folder_name = data.get('name', '').strip()
        path = data.get('path', '')
        
        if not folder_name:
            return jsonify({"error": "Folder name is required"}), 400
        
        # Sanitize folder name
        folder_name = secure_filename(folder_name)
        
        target_folder = safe_path(path)
        new_folder_path = os.path.join(target_folder, folder_name)
        
        # Check if folder already exists
        if os.path.exists(new_folder_path):
            return jsonify({"error": "Folder already exists"}), 400
        
        # Create the folder
        os.makedirs(new_folder_path)
        return jsonify({"success": True, "message": "Folder created"})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/delete-folder/<path:foldername>", methods=['POST'])
@login_required
def delete_folder(foldername):
    try:
        folder_path = safe_path(foldername)
        
        # Check if folder exists
        if not os.path.exists(folder_path):
            return jsonify({"error": "Folder not found"}), 404
        
        # Check if it's a directory
        if not os.path.isdir(folder_path):
            return jsonify({"error": "Not a directory"}), 400
        
        # Check if folder is empty
        if os.listdir(folder_path):
            return jsonify({"error": "Folder is not empty"}), 400
        
        # Delete the folder
        os.rmdir(folder_path)
        return jsonify({"success": True, "message": "Folder deleted"})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    create_default_user()
    app.run(host="0.0.0.0", port=5505, debug=True)
