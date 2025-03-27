from api.extensions import db

def reset_db():
    """DANGER: Drops and recreates all tables"""
    db.drop_all()
    db.create_all()
    print("Database reset complete")

def init_db():
    """Safe initialization (creates tables if missing)"""
    db.create_all()