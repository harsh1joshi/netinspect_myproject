NetInspect 🚀

NetInspect is a Flask-based network scanning tool that uses Nmap to detect open ports, analyze vulnerabilities, visualize severity levels, and generate exportable reports.

--------------------------------------------------

🔐 Login Credentials
Username: harsh#2098
Password: #@$&#q!

--------------------------------------------------

📁 Project Structure

NetInspect/
- app.py
- scanner.py
- db_setup.py
- run.sh
- requirements.txt
- README.md

templates/
- login.html
- index.html

static/
- main.js
- chart.js
- style.css

--------------------------------------------------

⚙️ Setup & Installation

1. Clone Repository
git clone <your-repo-link>
cd NetInspect

2. Create Virtual Environment
python3 -m venv venv

Activate:
source venv/bin/activate

3. Install Dependencies
pip install -r requirements.txt

4. Install Nmap (Required)
sudo apt update
sudo apt install nmap

5. Run Application
python app.py

6. Open in Browser
http://127.0.0.1:5000

--------------------------------------------------

🧪 Usage

1. Login using credentials
2. Enter target (example: scanme.nmap.org)
3. Select scan mode (Fast / Full)
4. Click Start Scan
5. View results and export reports

--------------------------------------------------

📊 Features

- Port scanning using Nmap
- Vulnerability detection
- Severity classification (High, Medium, Low, Info)
- Chart visualization
- CSV export
- Word report export

--------------------------------------------------

📦 Requirements

Flask
python-nmap
python-docx
requests

--------------------------------------------------

🚫 Do Not Upload

venv/
__pycache__/
*.pyc
netinspect.db

--------------------------------------------------

💡 Tech Stack

Python (Flask)
Nmap
SQLite
JavaScript (Chart.js)

--------------------------------------------------

📌 Status

Project complete and ready for submission ✔
