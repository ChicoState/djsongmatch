from flask import Blueprint, jsonify, request
from db.models import Song
from api.extensions import db
from api.services.song_service import get_songs, create_song, get_song_by_id

song_bp = Blueprint('songs', __name__)

@song_bp.route('/', methods=['GET'])
def get_all_songs():
    songs = get_songs()
    return jsonify([{
        'id': song.song_id,
        'title': song.title,
        'artist': song.artist
        # Include other fields as needed
    } for song in songs])

@song_bp.route('/<int:song_id>', methods=['GET'])
def get_song(song_id):
    song = get_song_by_id(song_id)
    if not song:
        return jsonify({'error': 'Song not found'}), 404
    return jsonify({
        'id': song.song_id,
        'title': song.title,
        'artist': song.artist
        # Include other fields as needed
    })

@song_bp.route('/', methods=['POST'])
def add_song():
    data = request.get_json()
    new_song = create_song(
        song_id=data['Song_ID'],
        title=data['Track'],
        artist=data['Artist'],
        year=data['Year'],
        duration=data['Duration'],
        time_signature=data['Time_Signature'],
        camelot_key_id=data['Camelot_Key'],
        tempo=data['Tempo'],
        danceability=data['Danceability'],
        energy=data['Energy'],
        loudness=data['Loudness'],
        loudness_dB=data['Loudness_dB'],
        speechiness=data['Speechiness'],
        acousticness=data['Acousticness'],
        instrumentalness=data['Instrumentalness'],
        liveness=data['Liveness'],
        valence=data['Valence'],
        popularity=data['Popularity'],
        genre=data['Genre']
    )
    return jsonify({
        'id': new_song.song_id,
        'message': 'Song created successfully'
    }), 201