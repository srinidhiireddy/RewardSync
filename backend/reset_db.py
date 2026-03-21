import os
import sqlite3

db_path = "rewardsync.db"

if os.path.exists(db_path):
    print(f"Deleting existing database: {db_path}")
    os.remove(db_path)
else:
    print("Database not found, nothing to delete.")

print("The next user to sign up will automatically become the ADMIN.")
print("Database reset complete.")
