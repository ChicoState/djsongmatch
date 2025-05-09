"""
DJ Song Match Data Management CLI

A unified tool for processing, loading and updating song data.

Usage:
    python -m backend.scripts.manage_data [command] [options]

Commands:
    process     Transform raw CSV data into normalized format
    seed        Initialize a fresh database with data
    update      Update existing database records
    index       Build the FAISS similarity index
    all         Process, seed and build index in one step
"""

import argparse
import logging
from backend.constants import RAW_CSV_PATH, PROCESSED_CSV_PATH

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Import operations from the operations subfolder
from backend.scripts.operations.pre_process import process_data
from backend.scripts.operations.seed import seed_database
from backend.scripts.operations.update import update_existing_songs
from backend.scripts.operations.index import build_faiss_index

# Create Flask app context for database operations
from backend.api import create_app

def main():
    parser = argparse.ArgumentParser(description="DJ Song Match Data Management Tool")
    subparsers = parser.add_subparsers(dest='command', help='Command to run')
    
    # Process command
    process_parser = subparsers.add_parser('process', help='Process raw data into normalized format')
    process_parser.add_argument('--input', default=str(RAW_CSV_PATH), help='Input CSV path')
    process_parser.add_argument('--output', default=str(PROCESSED_CSV_PATH), help='Output CSV path')
    
    # Seed command
    seed_parser = subparsers.add_parser('seed', help='Initialize database with song data')
    seed_parser.add_argument('--no-refresh', action='store_true', help='Don\'t drop existing tables')
    seed_parser.add_argument('--csv', help='Custom CSV path to import from')
    
    # Update command
    update_parser = subparsers.add_parser('update', help='Update existing database records')
    update_parser.add_argument('--retry', action='store_true', help='Only retry previously failed updates')
    
    # Index command  
    index_parser = subparsers.add_parser('index', help='Build FAISS similarity index')
    
    # All command
    all_parser = subparsers.add_parser('all', help='Process, seed and build index')
    all_parser.add_argument('--no-refresh', action='store_true', help='Don\'t drop existing tables')
    
    args = parser.parse_args()
    
    if args.command == 'process':
        process_data(input_path=args.input, output_path=args.output)
    elif args.command == 'seed':
        app = create_app()
        with app.app_context():
            seed_database(csv_path=args.csv, refresh=not args.no_refresh)
    elif args.command == 'update':
        app = create_app()
        with app.app_context():
            update_existing_songs(retry_only=args.retry)
    elif args.command == 'index':
        build_faiss_index()
    elif args.command == 'all':
        # Process the data
        process_data()
        
        # Seed the database
        app = create_app()
        with app.app_context():
            seed_database(refresh=not args.no_refresh)
                
        # Build FAISS index
        build_faiss_index()
    else:
        parser.print_help()

if __name__ == "__main__":
    main()