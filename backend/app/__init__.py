from flask import Flask, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os
from dotenv import load_dotenv
import logging
import sys

# Load environment variables
load_dotenv()


def create_app():
    # Configure logging
    logging.basicConfig(level=logging.INFO,
                        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                        stream=sys.stdout)

    logging.info("Starting to create the Flask app.")

    app = Flask(__name__)

    # Configuration
    logging.info("Loading configuration.")
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

    if not app.config['SECRET_KEY']:
        logging.error("SECRET_KEY environment variable not set.")
    if not app.config['JWT_SECRET_KEY']:
        logging.error("JWT_SECRET_KEY environment variable not set.")

    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False  # For development

    # Initialize extensions
    logging.info("Initializing extensions (CORS, JWT).")
    allowed_origins = os.getenv('CORS_ORIGINS')
    if not allowed_origins:
        logging.warning(
            "CORS_ORIGINS environment variable not set. Defaulting to localhost:3000 for development.")
        allowed_origins = 'http://localhost:3000'

    # Split multiple origins if provided
    origins_list = [origin.strip() for origin in allowed_origins.split(',')]
    logging.info(f"Allowed CORS origins: {origins_list}")

    CORS(app,
         origins=origins_list,
         supports_credentials=True,
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
         allow_headers=['Content-Type', 'Authorization', 'X-Requested-With'])
    JWTManager(app)

    # Import and register blueprints
    logging.info("Importing and registering blueprints.")
    from .routes.auth import auth_bp
    from .routes.users import users_bp
    from .routes.posts import posts_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(posts_bp, url_prefix='/api/posts')
    logging.info("Blueprints registered.")

    # Health check endpoint
    @app.route('/api/health')
    def health_check():
        return {'status': 'healthy', 'message': 'Social Media Platform API is running'}

    # Root endpoint for basic testing
    @app.route('/')
    def root():
        return {'message': 'Social Media Platform API', 'status': 'running'}

    # CORS preflight handler
    @app.route('/api/<path:path>', methods=['OPTIONS'])
    def handle_preflight(path):
        response = app.make_default_options_response()
        response.headers['Access-Control-Allow-Origin'] = request.headers.get(
            'Origin', '*')
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        return response

    logging.info("Flask app creation complete.")
    return app
