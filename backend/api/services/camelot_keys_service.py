from typing import List, Dict, Optional
from backend.api.database.models import CamelotKey

class CamelotKeysService:
    @staticmethod
    def get_all_camelot_keys() -> List[CamelotKey]:
        return CamelotKey.query.all()

    @staticmethod
    def get_camelot_key(key_id) -> Optional[CamelotKey]:
        """Get a specific Camelot key by ID"""
        return CamelotKey.query.get(key_id)

    @staticmethod
    def get_compatible_keys(key_id: int, as_dict: bool = False) -> List[Dict]:
        """
        Determine compatible Camelot keys based on:
        - Same wheel (inner/outer) and +/-1 (e.g., 8A works with 7A and 9A)
        - Parallel key (e.g., 8A works with 8B)
        """
        
        # Calculate compatible keys
        if 1 <= key_id <= 12:
            compatible_ids = [
                key_id - 1 if key_id > 1 else 12, # Adjacent
                key_id,
                key_id + 1 if key_id < 12 else 1, # Adjacent
                key_id + 12 # Parallel
            ]
        else:
            compatible_ids = [
                key_id - 1 if key_id > 13 else 24, # Adjacent
                key_id,
                key_id + 1 if key_id < 24 else 13, # Adjacent
                key_id - 12 # Parallel
            ]
        
        # Query all compatible keys from database
        compatible_keys = CamelotKey.query.filter(
            CamelotKey.id.in_(compatible_ids)
        ).all()
        
        if as_dict:
            harmonic_keys = compatible_ids[:3] # Adjacent keys; same mode (harmonic mixing)
            return [{
                'id': k.id,
                'key_str': k.key_str,
                'compatibility_type': (
                    'harmonic' if k.id in harmonic_keys 
                    else 'parallel'
                )
            } for k in compatible_keys]
        
        return compatible_keys