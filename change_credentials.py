#!/usr/bin/env python3
"""
Simple script to manage file manager credentials
Run this to change your username/password
"""

import json
import bcrypt
import os

USERS_FILE = "users.json"

def load_users():
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, 'r') as f:
            return json.load(f)
    return {}

def save_users(users):
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f, indent=2)

def change_credentials():
    print("=" * 50)
    print("File Manager - Credential Manager")
    print("=" * 50)
    
    username = input("\nEnter username: ").strip()
    if not username:
        print("❌ Username cannot be empty")
        return
    
    password = input("Enter password: ").strip()
    if not password:
        print("❌ Password cannot be empty")
        return
    
    confirm = input("Confirm password: ").strip()
    if password != confirm:
        print("❌ Passwords don't match")
        return
    
    # Hash the password
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    # Save to file
    users = {username: hashed.decode('utf-8')}
    save_users(users)
    
    print(f"\n✅ Credentials updated successfully!")
    print(f"Username: {username}")
    print(f"Password: {'*' * len(password)}")
    print(f"\nCredentials saved to {USERS_FILE}")

if __name__ == "__main__":
    change_credentials()
