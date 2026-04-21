📁 Local File Manager
=====================

A secure, modern web-based file manager for transferring files across devices on a local network.\
Built with a minimalist UI, authentication, and full mobile responsiveness.

* * * * *

✨ Features
----------

-   🔐 **Secure Authentication** --- bcrypt hashing + session management

-   📤 **File Upload** --- single and multi-file support

-   📂 **Folder Upload** --- recursive upload with hidden file detection + confirmation

-   📥 **File Download** --- via right-click or menu

-   📁 **Folder Management** --- create and delete folders

-   🗑️ **Multi-Select Delete** --- bulk file deletion

-   🔍 **Search** --- filter files in current directory

-   🌙 **Dark Mode** --- persistent theme toggle

-   📱 **Responsive Design** --- optimized for mobile/tablet

-   ⌨️ **Keyboard Shortcuts** --- power-user controls

-   🎨 **Modern UI** --- clean design with cyan/yellow accents

* * * * *

🚀 Quick Start
--------------

### Prerequisites

-   Python 3.9+

-   pip

* * * * *

### Installation

```
git clone https://github.com/yourusername/local-file-manager.git
cd local-file-manager

```

```
pip install flask flask-login bcrypt

```

```
pip3.11 install flask flask-login bcrypt

```

* * * * *

### Setup Credentials

```
python3 change_credentials.py

```

-   Creates `users.json` with hashed credentials

**Default credentials (if skipped):**

-   Username: `admin`

-   Password: `password123`

⚠️ Change immediately.

* * * * *

### Configuration

Edit `app.py`:

```
app.secret_key = "your-secret-key"
BASE_FOLDER = "/your/storage/path"

```

Generate a secure key:

```
python3 -c "import secrets; print(secrets.token_hex(32))"

```

* * * * *

### Project Structure

```
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

```

* * * * *

### Run Server

```
python3 app.py

```

```
http://0.0.0.0:5505

```

* * * * *

🌐 Access
---------

**Local:**

```
http://localhost:5505

```

**Network:**

```
http://YOUR_IP:5505

```

Find IP:

```
ifconfig

```

```
ipconfig

```

* * * * *

📖 Usage
--------

### Uploading

-   Click **Upload**

-   Supports files + folders

-   Hidden files detected with confirmation

### Navigation

-   Click folders/files

-   Use breadcrumbs

-   `Backspace` to go up

### Download

-   Desktop: right-click

-   Mobile: ⋮ menu

### Delete

-   Single or multi-select

-   Folders must be empty

### Shortcuts

-   `Ctrl/Cmd + A` → select all

-   `Ctrl/Cmd + K` → search

-   `Esc` → clear

* * * * *

🔧 Configuration
----------------

```
python3 change_credentials.py

```

```
BASE_FOLDER = "/new/path"

```

```
app.run(host="0.0.0.0", port=5505, debug=True)

```

* * * * *

🔒 Security
-----------

### ✅ Implemented

-   bcrypt hashing

-   session authentication

-   path protection

### ⚠️ Missing (Not Production Safe)

-   HTTPS

-   rate limiting

-   file validation

-   CSRF protection

* * * * *

🐛 Troubleshooting
------------------

**Connection issues**

-   Same network?

-   Firewall open?

-   Use IP instead of hostname

**Reset password**

```
python3 change_credentials.py

```

or

```
rm users.json
python3 app.py

```

* * * * *

🛠️ Tech Stack
--------------

-   Flask

-   Flask-Login

-   bcrypt

-   Vanilla JS

-   CSS

* * * * *

📡 API
------

| Method | Endpoint |
| --- | --- |
| GET | `/` |
| GET | `/login` |
| POST | `/login` |
| GET | `/logout` |
| GET | `/files` |
| POST | `/upload` |
| POST | `/delete` |

* * * * *

📄 License
----------

MIT License © 2025

* * * * *

⚠️ Final Note
-------------

Local use only.\
If you expose this publicly without security layers, expect problems.
