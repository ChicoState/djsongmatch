from flask import Blueprint, jsonify
from sqlalchemy.exc import SQLAlchemyError
# from api.decorators import internal_only  # TODO - create decorators.py
from api.database.models import Song
from api.services.song_service import SongService
from api.services.camelot_keys_service import CamelotKeysService

songs_bp = Blueprint('songs', __name__)

def _serialize_song(song: Song):
    # @internal_only # TODO - create decorators.py to restrict route for internal use only
    """Convert Song model to API response format"""
    return {
        'id': song.song_id,
        'title': song.title,
        'artist': song.artist,
        'bpm': song.tempo,
        'key': song.camelot_key.key_str if song.camelot_key else None,
        'popularity': song.popularity,
        'duration': song.duration,
        'energy': song.energy,
        'loudness': song.loudness,
        'danceability': song.danceability
        # can modify if needed
    }

@song_bp.route('/', methods=['GET'])
# @internal_only # TODO - create decorators.py to restrict route for internal use only
def get_all_songs():
    """Get all songs (for debugging/admin)"""
    try:
        songs = SongService.get_songs()
        return jsonify([_serialize_song(song) for song in songs])
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500

@song_bp.route('/<int:song_id>', methods=['GET'])
def get_song(song_id: int):
    """Get a specific song"""
    try:
        song = SongService.get_song(song_id)
        if not song:
            return jsonify({'error': 'Song not found'}), 404
        
        response = _serialize_song(song)
        return jsonify(response)
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500

@song_bp.route('/<int:song_id>/recommendations', methods=['GET'])
def get_song_recommendations(song_id: int):
    """Get recommended songs with compatible keys and similar BPM"""
    try:
        base_song = SongService.get_song(song_id)
        if not base_song:
            return jsonify({'error': 'Base song not found'}), 404

        # Get recommendations (already filtered by compatible keys and tempo)
        recommendations = SongService.get_recommendations(song_id)
        
        # Add compatibility type to each recommendation
        compatible_keys = {
            k['id']: k['compatibility_type'] 
            for k in CamelotKeysService.get_compatible_keys(base_song.camelot_key_id)
        }
        
        serialized = []
        for song in recommendations:
            song_data = _serialize_song(song)
            song_data['compatibility_type'] = compatible_keys.get(song.camelot_key_id)
            serialized.append(song_data)
        
        return jsonify(serialized)
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500

# May not need this...
# @song_bp.route('/', methods=['POST'])
# def add_song():
#     data = request.get_json()
#     new_song = create_song(
#         song_id=data['Song_ID'],
#         title=data['Track'],
#         artist=data['Artist'],
#         year=data['Year'],
#         duration=data['Duration'],
#         time_signature=data['Time_Signature'],
#         camelot_key_id=data['Camelot_Key'],
#         tempo=data['Tempo'],
#         danceability=data['Danceability'],
#         energy=data['Energy'],
#         loudness=data['Loudness'],
#         loudness_dB=data['Loudness_dB'],
#         speechiness=data['Speechiness'],
#         acousticness=data['Acousticness'],
#         instrumentalness=data['Instrumentalness'],
#         liveness=data['Liveness'],
#         valence=data['Valence'],
#         popularity=data['Popularity'],
#         genre=data['Genre']
#     )
#     return jsonify({
#         'id': new_song.song_id,
#         'message': 'Song created successfully'
#     }), 201