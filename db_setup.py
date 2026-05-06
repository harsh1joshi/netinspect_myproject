import os, sqlite3, hashlib
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()
DB_NAME = "netinspect.db"

def hash_username(u):
    return hashlib.sha256(u.lower().encode()).hexdigest()

ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")
if not ADMIN_PASSWORD:
    raise Exception("Set ADMIN_PASSWORD env variable")

conn = sqlite3.connect(DB_NAME)
c = conn.cursor()

c.execute("""
CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username_hash TEXT UNIQUE,
    password TEXT,
    role TEXT
)
""")

c.execute("""
CREATE TABLE IF NOT EXISTS scans(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_hash TEXT,
    target TEXT,
    mode TEXT,
    result TEXT,
    time_taken REAL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)
""")

admin_hash = hash_username("admin")
admin_pass = bcrypt.generate_password_hash(ADMIN_PASSWORD).decode()

try:
    c.execute(
        "INSERT INTO users(username_hash,password,role) VALUES(?,?,?)",
        (admin_hash, admin_pass, "admin")
    )
    print("[+] Admin created")
except:
    print("[*] Admin exists")

conn.commit()
conn.close()

