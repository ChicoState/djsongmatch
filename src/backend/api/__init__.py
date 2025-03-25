from flask import Flask
from api.extensions import db
from api.routes.songs import song_bp
from api.routes.camelot_keys import key_bp

def create_api(config_class='config.Config'):
    api = Flask(__name__)
    api.config.from_object(config_class)

    # Initialize extensions
    db.init_app(api)

    # Register blueprints
    api.register_blueprint(song_bp, url_prefix='/api/songs')
    api.register_blueprint(key_bp, url_prefix='/api/keys')

    @api.route('/')
    def health_check():
        return {'status': 'healthy'}

    return api