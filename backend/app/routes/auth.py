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
        data = request.get_json()

        if not data or 'id_token' not in data:
            return jsonify({'error': 'Firebase ID token is required'}), 400

        # Verify Firebase token
        firebase_user = firebase_auth.verify_token(data['id_token'])
        if not firebase_user:
            return jsonify({'error': 'Invalid Firebase token'}), 401

        # Check if user already exists
        existing_user = db_service.get_user_by_firebase_uid(
            firebase_user['uid'])
        if existing_user:
            return jsonify({'error': 'User already exists'}), 409

        # Create new user
        user = User(
            firebase_uid=firebase_user['uid'],
            name=data.get('name', firebase_user.get('name', 'Anonymous')),
            email=firebase_user['email'],
            bio=data.get('bio'),
            profile_picture_url=data.get(
                'profile_picture_url', firebase_user.get('picture'))
        )

        created_user = db_service.create_user(user)

        # Create JWT token
        access_token = create_access_token(identity=created_user.id)

        return jsonify({
            'message': 'User registered successfully',
            'user': created_user.to_dict(),
            'access_token': access_token
        }), 201

    except Exception as e:
        print(f"Registration error: {e}")
        return jsonify({'error': 'Internal server error'}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Login user with Firebase authentication
    """
    try:
        data = request.get_json()

        if not data or 'id_token' not in data:
            return jsonify({'error': 'Firebase ID token is required'}), 400

        # Verify Firebase token
        firebase_user = firebase_auth.verify_token(data['id_token'])
        if not firebase_user:
            return jsonify({'error': 'Invalid Firebase token'}), 401

        # Get user from database
        user = db_service.get_user_by_firebase_uid(firebase_user['uid'])
        if not user:
            return jsonify({'error': 'User not found. Please register first.'}), 404

        # Create JWT token
        access_token = create_access_token(identity=user.id)

        return jsonify({
            'message': 'Login successful',
            'user': user.to_dict(),
            'access_token': access_token
        }), 200

    except Exception as e:
        print(f"Login error: {e}")
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
        print(f"Get profile error: {e}")
        return jsonify({'error': 'Internal server error'}), 500


@auth_bp.route('/verify', methods=['POST'])
def verify_token():
    """
    Verify Firebase token and return user info
    """
    try:
        data = request.get_json()

        if not data or 'id_token' not in data:
            return jsonify({'error': 'Firebase ID token is required'}), 400

        # Verify Firebase token
        firebase_user = firebase_auth.verify_token(data['id_token'])
        if not firebase_user:
            return jsonify({'error': 'Invalid Firebase token'}), 401

        # Get user from database
        user = db_service.get_user_by_firebase_uid(firebase_user['uid'])

        if user:
            # User exists, create JWT token
            access_token = create_access_token(identity=user.id)
            return jsonify({
                'user': user.to_dict(),
                'access_token': access_token,
                'exists': True
            }), 200
        else:
            # User doesn't exist
            return jsonify({
                'exists': False,
                'firebase_user': firebase_user
            }), 200

    except Exception as e:
        print(f"Token verification error: {e}")
        return jsonify({'error': 'Internal server error'}), 500
