# 📁 Local File Manager

A secure, modern file manager web application for transferring files between devices on your local network. Features a clean minimalist UI with dark mode support, authentication, and mobile-responsive design.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.9+-blue.svg)

✨ Features
🔐 Secure Authentication - Bcrypt password hashing with session management
📤 File Upload - Upload single or multiple files
📂 Folder Upload - Upload entire folders with all contents, including hidden file detection with user confirmation
📥 File Download - Download files with right-click or three-dot menu
📁 Folder Management - Create and delete folders
🗑️ Multi-Select Delete - Select multiple files and delete at once
🔍 Search - Filter files by name in current directory
🌙 Dark Mode - Toggle between light and dark themes
📱 Mobile Responsive - Optimized UI for phones and tablets
⌨️ Keyboard Shortcuts - Power user features (see Info button)
🎨 Modern UI - Clean, minimal design with cyan/yellow accents

🚀 Quick Start
Prerequisites
Python 3.9 or higher
pip (Python package manager)

Installation
Clone the repository
git clone https://github.com/yourusername/local-file-manager.git
cd local-file-manager

Install dependencies
pip install flask flask-login bcrypt
Or if using Python 3.11:
pip3.11 install flask flask-login bcrypt

Set up credentials
python3 change_credentials.py
Enter your desired username and password. The script will create a users.json file with your hashed credentials.

Alternative: Run the app without setting credentials first, and it will create default credentials (admin/password123). ⚠️ Change these immediately!

Configure the application
Edit app.py and update these settings:
# Change this to a random secret key (required)
app.secret_key = 'your-secret-key-change-this-to-something-random'

# Change this to your file storage folder
BASE_FOLDER = "/Users/yehya/Documents/Data For Local Server"

Generate a secure secret key:
python3 -c "import secrets; print(secrets.token_hex(32))"

Create the static folder structure
Your project should have this structure:
local-file-manager/
├── app.py
├── change_credentials.py
├── users.json (created automatically)
├── README.md
└── static/
    ├── index.html
    ├── script.js
    ├── style.css
    └── favicon.svg

Move frontend files to the static/ folder:
mkdir static
mv index.html script.js style.css favicon.svg static/

Run the server
python3 app.py
The server will start on http://0.0.0.0:5505

🌐 Accessing the File Manager
From the Same Computer
http://localhost:5505

From Other Devices on Your Network
http://YOUR_COMPUTER_IP:5505

Find your computer's IP address:
macOS/Linux: ifconfig or ip addr
Windows: ipconfig
Example: http://192.168.1.100:5505

📖 Usage Guide
Login
- Open the file manager in your browser
- Enter the username and password you set up
- Session expires when you close the browser tab

Uploading Files
Click the 📤 Upload button
- Select one or multiple files, OR
- Select an entire folder to upload with all its contents

📂 Folder Upload & Hidden Files:
- When uploading a folder, the app recursively includes all subfolders and files
- Hidden files (e.g., .gitignore, .DS_Store, .env) are automatically detected
- A confirmation dialog will appear listing detected hidden files
- You can choose to include or exclude hidden files before upload begins
- Progress indicator shows during upload

Browsing Files
- Click folders to navigate into them
- Click files to open them in a new tab
- Use breadcrumb navigation to go back
- Press Backspace to go up one level

Downloading Files
Desktop:
- Right-click on any file
- Select "⬇️ Download"

Mobile:
- Tap the ⋮ button on the file card
- Select "⬇️ Download"

Deleting Files
Single file:
- Right-click (desktop) or tap ⋮ (mobile)
- Select "🗑️ Delete"
- Confirm deletion

Multiple files:
- Hold Ctrl/Cmd and click files to select
- Click "🗑️ Delete Selected (X)" button
- Confirm deletion

Delete folders:
- Right-click (desktop) or tap ⋮ (mobile) on a folder
- Select "🗑️ Delete Folder"
- Note: Only empty folders can be deleted

Creating Folders
- Click 📁 New Folder button
- Enter folder name
- Folder is created in current directory

Search
Desktop: Type in the search bar at the top

Mobile:
- Tap the 🔍 icon
- Search bar expands
- Type to filter files
- Tap outside to collapse

Dark Mode
- Click the 🌙 button to toggle dark mode
- Preference is saved automatically
- Dark mode uses bright cyan accents for better contrast

Keyboard Shortcuts
Press ℹ️ Info button to see all shortcuts:
- Backspace - Go up one directory
- Ctrl/Cmd + Click - Select multiple files
- Ctrl/Cmd + A - Select all files
- Ctrl/Cmd + K - Focus search bar
- Escape - Clear selection or close modals

Mobile Navigation
Hamburger Menu (☰):
- New Folder
- Info
- Dark Mode
- Logout
All features accessible through the collapsible menu.

🔧 Configuration
Changing Credentials
Run the credential manager script anytime:
python3 change_credentials.py
This will overwrite the existing credentials in users.json.

Changing the Base Folder
Edit app.py:
BASE_FOLDER = "/path/to/your/folder"

Changing the Port
Edit app.py:
app.run(host="0.0.0.0", port=5505, debug=True)  # Change 5505 to your port

🔒 Security Notes
✅ What's Secure
- Passwords hashed with bcrypt (not stored in plain text)
- Session-based authentication with strong protection
- Path traversal protection (users can't access files outside BASE_FOLDER)
- Sessions expire when browser tab closes

⚠️ Important Security Warnings
This application is designed for LOCAL NETWORK use only.

❌ DO NOT expose this to the internet without additional security:
- No HTTPS (credentials sent in plain text over network)
- No rate limiting (vulnerable to brute force attacks)
- No file size limits (can fill your disk)
- No file type restrictions (any file can be uploaded)
- No CSRF protection
- Debug mode enabled (should be disabled in production)

If you must expose this externally:
- Set up HTTPS (use nginx with Let's Encrypt)
- Add rate limiting
- Implement file size limits
- Add file type restrictions
- Disable debug mode
- Use a firewall
- Consider using a VPN instead

Firewall Configuration
Make sure your computer's firewall allows connections on port 5505:

macOS:
# Add firewall rule
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /path/to/python
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblockapp /path/to/python

Linux (ufw):
sudo ufw allow 5505

Windows:
Windows Defender Firewall → Advanced Settings → Inbound Rules → New Rule
Port: 5505, TCP
Allow the connection

🐛 Troubleshooting
Can't connect from other devices
- Verify devices are on the same network
- Check firewall settings (see above)
- Try using IP address instead of hostname
- Make sure server is running (check terminal output)

Forgot password
# Option 1: Use credential manager
python3 change_credentials.py

# Option 2: Delete users.json and restart
rm users.json
python3 app.py  # Creates default admin/password123

Upload not working
- Check that BASE_FOLDER exists and has write permissions
- Check browser console for error messages
- Verify you're logged in (session didn't expire)

Files not appearing after upload
- Check that you're in the correct directory
- Refresh the page (F5)
- Check terminal for error messages
- Verify BASE_FOLDER path is correct

Session keeps expiring
- This is intentional - sessions expire on tab close
- Don't close the tab while using the app
- If it expires during use, there may be a network issue

"Error loading files" message
- Check that BASE_FOLDER path exists
- Verify you have read permissions for the folder
- Check terminal for Python errors

Mobile three-dot menu not appearing
The menu is only visible on:
- Screens ≤768px wide, OR
- Touch devices (tablets, phones)
Desktop users should use right-click instead.

🛠️ Development
Project Structure
local-file-manager/
├── app.py                    # Flask backend server
├── change_credentials.py     # Credential management script
├── users.json               # Hashed user credentials (auto-generated)
├── README.md                # This file
└── static/
    ├── index.html           # Main HTML structure
    ├── script.js            # Frontend JavaScript
    ├── style.css            # Styling and themes
    └── favicon.svg          # Browser tab icon

Key Technologies
- Backend: Flask (Python web framework)
- Authentication: Flask-Login + bcrypt
- Frontend: Vanilla JavaScript (no frameworks)
- Styling: CSS with CSS variables for theming

Making Changes
To modify the UI:
- Edit static/style.css for styling
- Edit static/index.html for structure
- Edit static/script.js for functionality

To modify the backend:
- Edit app.py for routes and logic

After changes:
- Restart the Flask server (Ctrl+C, then python3 app.py)
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

📝 API Endpoints
For developers who want to integrate or extend:
GET  /                    - Main page (requires login)
GET  /login              - Login page
POST /login              - Submit credentials
GET  /logout             - Logout user
GET  /files?path=...     - List files in directory
GET  /open/<path>        - Open/view file
GET  /download/<path>    - Download file
POST /upload             - Upload file(s) or folder (with hidden file detection)
POST /delete/<path>      - Delete single file
POST /delete-multiple    - Delete multiple files
POST /create-folder      - Create new folder
POST /delete-folder/<path> - Delete empty folder

Guidelines
- Fork the repository
- Create a feature branch (git checkout -b feature/amazing-feature)
- Commit your changes (git commit -m 'Add amazing feature')
- Push to the branch (git push origin feature/amazing-feature)
- Open a Pull Request

📄 License
This project is licensed under the MIT License - see below for details.

MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

🙏 Acknowledgments
- Built with Flask and modern web technologies
- Icons: Emoji (no external dependencies)
- Inspired by modern file managers and cloud storage interfaces

⚠️ Remember: This is designed for local network use between your own devices. Do not expose to the public internet without proper security measures.

Made with ❤️ for easy file sharing between your devices
