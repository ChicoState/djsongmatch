
from flask import Blueprint #, jsonify
# from backend.api.decorators import internal_only  # TODO - create decorators.py
# from backend.api.services.camelot_keys_service import CamelotKeysService
# from backend.api.database.models import CamelotKey

camelot_keys_bp = Blueprint('camelot_keys', __name__)

# Only add routes if needed. Frontend should use the routes in songs.py for now.

# @camelot_key_bp.route('/<int:key_id>', methods=['GET'])
# # @internal_only # TODO - create decorators.py to restrict route for internal use only
# def get_all_camelot_keys():
#     """Get all Camelot keys with their associated song counts"""
#     camelot_keys = CamelotKeysService.get_all_camelot_keys()
#     return jsonify(camelot_keys)

# @camelot_key_bp.route('/<int:key_id>', methods=['GET'])
# # @internal_only # TODO - create decorators.py to restrict route for internal use only
# def get_camelot_key(key_id):
#     """Get a specific Camelot key by ID"""
#     key = CamelotKeysService.get_camelot_key(key_id)
#     return jsonify(key) if key else ('', 404)