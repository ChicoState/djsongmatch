"""
Song API Routes

Provides endpoints for song retrieval and recommendations.
"""

import logging
from flask import Blueprint, jsonify, request
from sqlalchemy.exc import SQLAlchemyError

from backend.api.services.song_service import SongService, RecommendationService

# Configure logger
logger = logging.getLogger(__name__)

# Create a blueprint for the songs API
songs_bp = Blueprint('songs', __name__)


@songs_bp.route('/', methods=['GET'])
def get_all_songs():
    """Get all songs (for debugging/admin purposes)"""
    try:
        limit = request.args.get("limit", default=100, type=int)
        songs = SongService.get_songs(limit=limit)
        return jsonify([SongService.serialize_song(song) for song in songs])
    except SQLAlchemyError as e:
        logger.error(f"Database error retrieving songs: {e}")
        return jsonify({'error': 'Database error'}), 500

@songs_bp.route('/<int:song_id>', methods=['GET'])
def get_song(song_id: int):
    """Get a specific song by ID"""
    try:
        song = SongService.get_song(song_id)
        if not song:
            return jsonify({'error': 'Song not found'}), 404
        
        return jsonify(SongService.serialize_song(song))
    except SQLAlchemyError as e:
        logger.error(f"Database error retrieving song {song_id}: {e}")
        return jsonify({'error': 'Database error'}), 500

@songs_bp.route('/<int:song_id>/recommendations', methods=['GET'])
def get_song_recommendations(song_id: int):
    """Get DJ-optimized song recommendations"""
    # Get parameters
    danceability = request.args.get("danceability", type=float)
    energy = request.args.get("energy", type=float)
    loudness = request.args.get("loudness", type=float)
    tempo_tolerance = request.args.get("tempo_tolerance", default=4.0, type=float)
    start_year = request.args.get("start_year", default=0, type=int)
    end_year = request.args.get("end_year", default=3000, type=int)
    limit = request.args.get("limit", default=50, type=int)

    try:
        base_song = SongService.get_song(song_id)
        if not base_song:
            return jsonify({'error': 'Base song not found'}), 404
        
        # Check that FAISS index exists
        try:
            RecommendationService._load_assets()
        except Exception as e:
            logger.error(f"Failed to load FAISS index: {e}")
            return jsonify({'error': 'Failed to load recommendation engine', 'details': str(e)}), 500
        
        
        # Get recommendations
        recommendations = RecommendationService.get_similar_songs(
            base_song_id=song_id,
            tempo_tolerance=tempo_tolerance,
            start_year=start_year,
            end_year=end_year,
            danceability=danceability,
            energy=energy,
            loudness=loudness,
            limit=limit
        )



        logger.info(f"Found {len(recommendations)} recommendations for song {song_id}")
        for i, rec in enumerate(recommendations[:3]):  # Print first 3
            song = rec['song']  # Access the song object inside the recommendation
            logger.info(f"Rec {i+1}: {song_id} {song.title} by {song.artist}")

        # Format the response
        serialized = []
        for rec in recommendations:
            song_data = SongService.serialize_song(rec['song'])
            song_data['similarity'] = rec['similarity']
            song_data['compatibilityType'] = rec['compatibility_type']
            serialized.append(song_data)

        return jsonify(serialized)
    except ValueError as e:
        logger.error(f"Value error in recommendations: {str(e)}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logger.exception(f"Error getting recommendations for song {song_id}")
        return jsonify({'error': 'Server error', 'details': str(e)}), 500