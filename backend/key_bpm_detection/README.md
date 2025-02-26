# Python Key, BPM Database

# Dependencies

Recommended to use a virtual environment:
```bash
python -m venv venv
source venv/bin/activate
```
Then, install dependencies:
```bash
pip install -r requirements.txt
```

# Usage

To print the key and bpm of a song:
```bash
python key_bpm_detection.py <path_to_audio_file>
```

To add a song to a sqlite3 database:
```bash
python database.py <path_to_audio_file> [path_to_db_file]
```
