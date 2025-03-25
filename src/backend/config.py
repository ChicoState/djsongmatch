from pathlib import Path

class Config:
    PROJECT_ROOT = Path(__file__).parent.parent
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{PROJECT_ROOT}/db/ClassicHit.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False