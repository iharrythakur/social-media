import logging
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from ..services.database import db_service
from ..services.firebase_auth import firebase_auth
from ..models.user import User

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Register a new user with Firebase authentication
    """
    try:
        logging.info("Registration request received")
        data = request.get_json()

        if not data or 'id_token' not in data:
            logging.error("Registration failed: Firebase ID token is required")
            return jsonify({'error': 'Firebase ID token is required'}), 400

        # Verify Firebase token
        logging.info("Verifying Firebase token for registration")
        firebase_user = firebase_auth.verify_token(data['id_token'])
        if not firebase_user:
            logging.error("Registration failed: Invalid Firebase token")
            return jsonify({'error': 'Invalid Firebase token'}), 401

        logging.info(f"Firebase user verified: {firebase_user['uid']}")

        # Check if user already exists
        existing_user = db_service.get_user_by_firebase_uid(
            firebase_user['uid'])
        if existing_user:
            logging.warning(
                f"Registration failed: User already exists with UID {firebase_user['uid']}")
            return jsonify({'error': 'User already exists'}), 409

        # Create new user
        logging.info(
            f"Creating new user with Firebase UID: {firebase_user['uid']}")
        user = User(
            firebase_uid=firebase_user['uid'],
            name=data.get('name', firebase_user.get('name', 'Anonymous')),
            email=firebase_user['email'],
            bio=data.get('bio'),
            profile_picture_url=data.get(
                'profile_picture_url', firebase_user.get('picture'))
        )

        created_user = db_service.create_user(user)
        logging.info(f"User created successfully with ID: {created_user.id}")

        # Create JWT token
        access_token = create_access_token(identity=created_user.id)

        return jsonify({
            'message': 'User registered successfully',
            'user': created_user.to_dict(),
            'access_token': access_token
        }), 201

    except Exception as e:
        logging.error(f"Registration error: {e}")
        return jsonify({'error': 'Internal server error'}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Login user with Firebase authentication
    """
    try:
        logging.info("Login request received")
        data = request.get_json()

        if not data or 'id_token' not in data:
            logging.error("Login failed: Firebase ID token is required")
            return jsonify({'error': 'Firebase ID token is required'}), 400

        # Verify Firebase token
        logging.info("Verifying Firebase token for login")
        firebase_user = firebase_auth.verify_token(data['id_token'])
        if not firebase_user:
            logging.error("Login failed: Invalid Firebase token")
            return jsonify({'error': 'Invalid Firebase token'}), 401

        logging.info(
            f"Firebase user verified for login: {firebase_user['uid']}")

        # Get user from database
        user = db_service.get_user_by_firebase_uid(firebase_user['uid'])
        if not user:
            logging.error(
                f"Login failed: User not found for Firebase UID {firebase_user['uid']}")
            return jsonify({'error': 'User not found. Please register first.'}), 404

        logging.info(f"User found for login: {user.id}")

        # Create JWT token
        access_token = create_access_token(identity=user.id)

        return jsonify({
            'message': 'Login successful',
            'user': user.to_dict(),
            'access_token': access_token
        }), 200

    except Exception as e:
        logging.error(f"Login error: {e}")
        return jsonify({'error': 'Internal server error'}), 500


@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """
    Get current user profile
    """
    try:
        user_id = get_jwt_identity()
        user = db_service.get_user_by_id(user_id)

        if not user:
            return jsonify({'error': 'User not found'}), 404

        return jsonify({
            'user': user.to_dict()
        }), 200

    except Exception as e:
        logging.error(f"Get profile error: {e}")
        return jsonify({'error': 'Internal server error'}), 500


@auth_bp.route('/verify', methods=['POST'])
def verify_token():
    """
    Verify Firebase token and return user info
    """
    try:
        logging.info("Token verification request received")
        data = request.get_json()

        if not data or 'id_token' not in data:
            logging.error(
                "Token verification failed: Firebase ID token is required")
            return jsonify({'error': 'Firebase ID token is required'}), 400

        # Verify Firebase token
        logging.info("Verifying Firebase token")
        firebase_user = firebase_auth.verify_token(data['id_token'])
        if not firebase_user:
            logging.error("Token verification failed: Invalid Firebase token")
            return jsonify({'error': 'Invalid Firebase token'}), 401

        logging.info(
            f"Firebase token verified for UID: {firebase_user['uid']}")

        # Get user from database
        user = db_service.get_user_by_firebase_uid(firebase_user['uid'])

        if user:
            logging.info(f"User found in database: {user.id}")
            # User exists, create JWT token
            access_token = create_access_token(identity=user.id)
            return jsonify({
                'user': user.to_dict(),
                'access_token': access_token,
                'exists': True
            }), 200
        else:
            logging.info(
                f"User not found in database for Firebase UID: {firebase_user['uid']}")
            # User doesn't exist
            return jsonify({
                'exists': False,
                'firebase_user': firebase_user
            }), 200

    except Exception as e:
        logging.error(f"Token verification error: {e}")
        return jsonify({'error': 'Internal server error'}), 500
