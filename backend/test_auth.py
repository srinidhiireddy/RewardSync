import sys
import os

try:
    from fastapi.testclient import TestClient
    from main import app
    print("Testing FASTAPI Auth...")
    
    client = TestClient(app)
    
    # 1. Signup
    print("Attempting Signup...")
    signup_res = client.post("/signup", json={"username": "srini_test", "password": "password123"})
    print("Signup Response:", signup_res.status_code, signup_res.json())
    
    # 2. Login
    print("Attempting Login...")
    login_res = client.post("/login", json={"username": "srini_test", "password": "password123"})
    print("Login Response:", login_res.status_code, login_res.json())
    
except Exception as e:
    print(f"Test Error: {str(e)}")
