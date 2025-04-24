import logging

from flask import Blueprint, jsonify, request
from sqlalchemy.exc import SQLAlchemyError
# from backend.api.decorators import internal_only  # TODO - create decorators.py
from backend.api.database.models import Song
from backend.api.services.song_service import SongService
from backend.api.services.camelot_keys_service import CamelotKeysService

songs_bp = Blueprint('songs', __name__)

def _serialize_song(song: Song):
    # @internal_only # TODO - create decorators.py to restrict route for internal use only
    """Convert Song model to API response format"""
    return {
        'songId': song.song_id,
        'title': song.title,
        'artist': song.artist,
        'tempo': song.tempo,
        'camelotKeyStr': song.camelot_key.key_str if song.camelot_key else None,
        'popularity': song.popularity,
        'duration': song.duration,
        'energy': song.energy,
        'loudness': song.loudness,
        'danceability': song.danceability
        # can modify if needed
    }

@songs_bp.route('/', methods=['GET'])
# @internal_only # TODO - create decorators.py to restrict route for internal use only
def get_all_songs():
    """Get all songs (for debugging/admin)"""
    try:
        songs = SongService.get_songs()
        return jsonify([_serialize_song(song) for song in songs])
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500

@songs_bp.route('/<int:song_id>', methods=['GET'])
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

@songs_bp.route('/<int:song_id>/recommendations', methods=['GET'])
def get_song_recommendations(song_id: int):
    """Get recommended songs based on clustering with compatible keys and similar BPM"""

    # Get contrast adjustments from query parameters (default is 0.0)
    danceability_contrast = request.args.get("danceability_contrast", default=0.0, type=float)
    energy_contrast = request.args.get("energy_contrast", default=0.0, type=float)
    loudness_contrast = request.args.get("loudness_contrast", default=0.0, type=float)
    start_year = request.args.get("start_year", default=0, type=int)
    end_year = request.args.get("end_year", default=10000, type=int)
    tempo_range = request.args.get("tempo_range", default=0, type=int)
    limit = request.args.get("limit", default=10, type=int)

    # For debugging purposes, could be removed
    for param in ["danceability_contrast", "energy_contrast", "loudness_contrast"]:
        if request.args.get(param) is None:
            logging.info(f"Did not find {param} in request.args")
        else:
            logging.info(
                f"Found: {param} in request.args with value of: {request.args[param]}"
            )

    if not isinstance(tempo_range, (int, float)):
        tempo_range = 5  # Default value
        print(f"Warning: Invalid tempo_range, using default {tempo_range}")

        if not isinstance(base_song.tempo, (int, float)):
            raise ValueError("Base song tempo must be a number")

    try:
        base_song = SongService.get_song(song_id)
        if not base_song:
            return jsonify({'error': 'Base song not found'}), 404
        
        recommendations = SongService.get_recommendations(
            base_song_id=song_id,
            danceability_contrast=danceability_contrast,
            energy_contrast=energy_contrast,
            loudness_contrast=loudness_contrast,
            start_year=start_year,
            end_year=end_year,
            tempo_range=tempo_range,
            limit=limit
        )
        print(f"Found {len(recommendations)} recommendations for song {song_id}")
        for i, song in enumerate(recommendations[:3]):  # Print first 3
            print(f"Rec {i+1}: {song.title} by {song.artist} (Cluster: {song.cluster})")

        # Add compatibility type to each recommendation
        compatible_keys = {
            k['id']: k['compatibility_type']
            for k in CamelotKeysService.get_compatible_keys(base_song.camelot_key_id, as_dict=True)
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