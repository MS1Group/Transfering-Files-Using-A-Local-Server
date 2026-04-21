📁 Local File Manager

A secure, modern web-based file manager for transferring files across devices on a local network.
Built with a minimalist UI, authentication, and full mobile responsiveness.

✨ Features
🔐 Secure Authentication — bcrypt hashing + session management
📤 File Upload — single and multi-file support
📂 Folder Upload — recursive upload with hidden file detection + confirmation
📥 File Download — via right-click or menu
📁 Folder Management — create and delete folders
🗑️ Multi-Select Delete — bulk file deletion
🔍 Search — filter files in current directory
🌙 Dark Mode — persistent theme toggle
📱 Responsive Design — optimized for mobile/tablet
⌨️ Keyboard Shortcuts — power-user controls
🎨 Modern UI — clean design with cyan/yellow accents
🚀 Quick Start
Prerequisites
Python 3.9+
pip
Installation
git clone https://github.com/yourusername/local-file-manager.git
cd local-file-manager

Install dependencies:

pip install flask flask-login bcrypt

For Python 3.11:

pip3.11 install flask flask-login bcrypt
Setup Credentials
python3 change_credentials.py
Creates users.json with hashed credentials

Alternative:

Run the app without setup → defaults to:
Username: admin
Password: password123

⚠️ Change immediately.

Configuration

Edit app.py:

app.secret_key = "your-secret-key"
BASE_FOLDER = "/your/storage/path"

Generate a secure key:

python3 -c "import secrets; print(secrets.token_hex(32))"
Project Structure
local-file-manager/
├── app.py
├── change_credentials.py
├── users.json
├── README.md
└── static/
    ├── index.html
    ├── script.js
    ├── style.css
    └── favicon.svg

Move frontend files if needed:

mkdir static
mv index.html script.js style.css favicon.svg static/
Run Server
python3 app.py

Server runs on:

http://0.0.0.0:5505
🌐 Access
Local Machine
http://localhost:5505
Other Devices (Same Network)
http://YOUR_IP:5505

Find IP:

macOS/Linux:

ifconfig

Windows:

ipconfig
📖 Usage
Authentication
Login via browser
Session ends when tab closes
Uploading
Click 📤 Upload
Upload:
Files
Entire folders

Hidden files:

Auto-detected
Confirmation prompt before upload
Navigation
Click folders → open
Click files → view
Breadcrumb navigation available
Backspace → go up directory
Downloading

Desktop:

Right-click → Download

Mobile:

Tap ⋮ → Download
Deleting
Single file → right-click / ⋮ → Delete
Multiple files → Ctrl/Cmd + click → Delete Selected
Folders → only if empty
Creating Folders
Click 📁 New Folder
Enter name
Search
Desktop → type in search bar
Mobile → tap 🔍
Dark Mode
Toggle 🌙
Preference saved automatically
Keyboard Shortcuts
Backspace → Up directory
Ctrl/Cmd + Click → Multi-select
Ctrl/Cmd + A → Select all
Ctrl/Cmd + K → Focus search
Esc → Clear selection
🔧 Configuration
Change Credentials
python3 change_credentials.py
Change Storage Folder
BASE_FOLDER = "/new/path"
Change Port
app.run(host="0.0.0.0", port=5505, debug=True)
🔒 Security
✅ Implemented
bcrypt password hashing
session authentication
path traversal protection
⚠️ Limitations

This is NOT production-safe.

Missing:

HTTPS
rate limiting
file size restrictions
file type validation
CSRF protection
If Exposing Publicly

Minimum requirements:

HTTPS (nginx + Let’s Encrypt)
Rate limiting
Disable debug mode
Firewall rules
Prefer VPN instead
🔥 Firewall Setup

macOS

sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /path/to/python
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblockapp /path/to/python

Linux (ufw)

sudo ufw allow 5505

Windows

Allow TCP port 5505 in firewall settings
🐛 Troubleshooting
Cannot connect from other devices
Same network?
Firewall blocking?
Use IP instead of hostname
Forgot password
python3 change_credentials.py

or

rm users.json
python3 app.py
Upload issues
Check BASE_FOLDER exists
Verify permissions
Check browser console
Files not appearing
Refresh page
Verify correct directory
Check backend logs
Session expires
Intended behavior (tab-based sessions)
🛠️ Development
Tech Stack
Backend: Flask
Auth: Flask-Login + bcrypt
Frontend: Vanilla JS
Styling: CSS
Modify

Frontend:

static/style.css
static/index.html
static/script.js

Backend:

app.py
📡 API Endpoints
Method	Endpoint	Description
GET	/	Main app
GET	/login	Login page
POST	/login	Authenticate
GET	/logout	Logout
GET	/files	List files
GET	/open/	View file
GET	/download/	Download file
POST	/upload	Upload files
POST	/delete/	Delete file
POST	/delete-multiple	Bulk delete
POST	/create-folder	Create folder
POST	/delete-folder/	Delete folder
🤝 Contributing
git checkout -b feature/your-feature
git commit -m "Add feature"
git push origin feature/your-feature

Open a Pull Request.

📄 License

MIT License © 2025

⚠️ Final Note

This tool is built for local network file transfer.
If you expose it publicly without hardening security, expect it to break or get abused.
