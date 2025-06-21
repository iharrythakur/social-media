from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..services.database import db_service

users_bp = Blueprint('users', __name__)


@users_bp.route('/<user_id>', methods=['GET'])
def get_user(user_id):
    """
    Get user profile by ID
    """
    try:
        user = db_service.get_user_by_id(user_id)

        if not user:
            return jsonify({'error': 'User not found'}), 404

        return jsonify({
            'user': user.to_dict()
        }), 200

    except Exception as e:
        print(f"Get user error: {e}")
        return jsonify({'error': 'Internal server error'}), 500


@users_bp.route('/<user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    """
    Update user profile (only the user themselves can update)
    """
    try:
        current_user_id = get_jwt_identity()

        # Check if user is updating their own profile
        if current_user_id != user_id:
            return jsonify({'error': 'Unauthorized'}), 403

        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Validate input
        updates = {}
        if 'name' in data:
            if not data['name'] or len(data['name'].strip()) == 0:
                return jsonify({'error': 'Name cannot be empty'}), 400
            updates['name'] = data['name'].strip()

        if 'bio' in data:
            updates['bio'] = data['bio'].strip() if data['bio'] else None

        if 'profile_picture_url' in data:
            updates['profile_picture_url'] = data['profile_picture_url'].strip(
            ) if data['profile_picture_url'] else None

        if not updates:
            return jsonify({'error': 'No valid fields to update'}), 400

        # Update user
        updated_user = db_service.update_user(user_id, updates)

        if not updated_user:
            return jsonify({'error': 'User not found'}), 404

        return jsonify({
            'message': 'User updated successfully',
            'user': updated_user.to_dict()
        }), 200

    except Exception as e:
        print(f"Update user error: {e}")
        return jsonify({'error': 'Internal server error'}), 500


@users_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
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
        print(f"Get current user error: {e}")
        return jsonify({'error': 'Internal server error'}), 500


@users_bp.route('/me', methods=['PUT'])
@jwt_required()
def update_current_user():
    """
    Update current user profile
    """
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Validate input
        updates = {}
        if 'name' in data:
            if not data['name'] or len(data['name'].strip()) == 0:
                return jsonify({'error': 'Name cannot be empty'}), 400
            updates['name'] = data['name'].strip()

        if 'bio' in data:
            updates['bio'] = data['bio'].strip() if data['bio'] else None

        if 'profile_picture_url' in data:
            updates['profile_picture_url'] = data['profile_picture_url'].strip(
            ) if data['profile_picture_url'] else None

        if not updates:
            return jsonify({'error': 'No valid fields to update'}), 400

        # Update user
        updated_user = db_service.update_user(user_id, updates)

        if not updated_user:
            return jsonify({'error': 'User not found'}), 404

        return jsonify({
            'message': 'Profile updated successfully',
            'user': updated_user.to_dict()
        }), 200

    except Exception as e:
        print(f"Update current user error: {e}")
        return jsonify({'error': 'Internal server error'}), 500
