from flask import Blueprint, jsonify, request
from db.models import CamelotKey
from api.extensions import db

camelot_key_bp = Blueprint('camelot_keys', __name__)

@camelot_key_bp.route('/', methods=['GET'])
def get_all_camelot_keys():
    """Get all Camelot keys with their associated songs"""
    cam_keys = db.session.query(CamelotKey).all()
    return jsonify([{
        'id': cam_key.id,
        'key': cam_key.key,
        'mode': cam_key.mode,
        'key_str': cam_key.key_str,
        'song_count': len(cam_key.songs)
    } for cam_key in cam_keys])

@camelot_key_bp.route('/<int:key_id>', methods=['GET'])
def get_camelot_key(key_id):
    """Get a specific Camelot key by ID"""
    cam_key = db.session.get(CamelotKey, key_id)
    if not cam_key:
        return jsonify({'error': 'Camelot key not found'}), 404
    
    return jsonify({
        'id': cam_key.id,
        'key': cam_key.key,
        'mode': cam_key.mode,
        'key_str': cam_key.key_str,
        'song_count': len(cam_key.songs),
        'songs': cam_key.songs
    })

@camelot_key_bp.route('/by-key/<string:key_str>', methods=['GET'])
def get_camelot_key_by_string(key_str):
    """Get Camelot key by its string representation (e.g., 'C Maj')"""
    cam_key = db.session.query(CamelotKey).filter_by(key_str=key_str).first()
    if not cam_key:
        return jsonify({'error': 'Camelot key not found'}), 404
    
    return jsonify({
        'id': cam_key.id,
        'key': cam_key.key,
        'mode': cam_key.mode,
        'key_str': cam_key.key_str,
        'compatible_keys': get_compatible_keys(cam_key),
        'song_count': len(cam_key.songs),
        'songs': cam_key.songs
    })

@camelot_key_bp.route('/', methods=['POST'])
def add_camelot_key():
    """Add a new Camelot key (admin-only in production)"""
    data = request.get_json()
    
    # Validate required fields
    if not all(k in data for k in ['id', 'key', 'mode', 'key_str']):
        return jsonify({'error': 'Missing required fields'}), 400
    
    try:
        new_key = CamelotKey(
            id=data['id'],
            key=data['key'],
            mode=data['mode'],
            key_str=data['key_str']
        )
        db.session.add(new_key)
        db.session.commit()
        
        return jsonify({
            'id': new_key.id,
            'message': 'Camelot key created successfully'
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@camelot_key_bp.route('/<int:key_id>', methods=['DELETE'])
def delete_camelot_key(key_id):
    """Delete a Camelot key (admin-only in production)"""
    key = db.session.get(CamelotKey, key_id)
    if not key:
        return jsonify({'error': 'Camelot key not found'}), 404
    
    try:
        db.session.delete(key)
        db.session.commit()
        return jsonify({'message': 'Camelot key deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

def get_compatible_keys(cam_key: CamelotKey):
    """
    Helper function to determine compatible Camelot keys based on:
    - Same wheel (inner/outer) and +/-1 (e.g., 8A works with 7A and 9A)
    - Parallel key (e.g., 8A works with 8B)
    """
    id = cam_key.id
    
    # Calculate compatible keys
    if 1 <= id <= 12:
        compatible_ids = [
            id - 1 if id > 1 else 12, # Adjacent
            id,
            id + 1 if id < 12 else 1, # Adjacent
            id + 12 # Parallel
        ]
    else:
        compatible_ids = [
            id - 1 if id > 13 else 24, # Adjacent
            id,
            id + 1 if id < 24 else 13, # Adjacent
            id - 12 # Parallel
        ]
    
    # Adjacent keys; same mode (harmonic mixing)
    harmonic_keys = compatible_ids[:3]
    
    # Parallel key (relative mixing)
    parallel_key = compatible_ids[-1]
    
    # Query all compatible keys from database
    compatible_keys = db.session.query(CamelotKey).filter(
        CamelotKey.id.in_(compatible_ids)
    ).all()
    
    return [{
        'id': k.id,
        'key_str': k.key_str,
        'compatibility_type': (
            'harmonic' if k.id in harmonic_keys 
            else 'parallel'
        )
    } for k in compatible_keys]