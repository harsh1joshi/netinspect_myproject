#!/bin/bash

echo "==============================="
echo " NetInspect"
echo "==============================="

if ! command -v python3 &> /dev/null
then
  echo "Python3 not found"
  exit 1
fi

if [ ! -d "venv" ]; then
  python3 -m venv venv
fi

source venv/bin/activate

pip install --upgrade pip
pip install flask flask-bcrypt python-nmap python-docx openpyxl requests

python app.py

