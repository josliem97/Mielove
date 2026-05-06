from sqlalchemy.orm import Session
import sys
import os

# Add parent directory to path so we can import models/database
sys.path.append(os.path.dirname(os.path.abspath(__file__)) + "/..")

import models
import database
from templates import seed_templates

def run_seed():
    db = next(database.get_db())
    result = seed_templates(db)
    print(result)

if __name__ == "__main__":
    run_seed()
