from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..services.database import db_service
from ..models.post import Post

posts_bp = Blueprint('posts', __name__)


@posts_bp.route('', methods=['GET'])
def get_posts():
    """
    Get all posts with pagination
    """
    try:
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 20, type=int)

        # Validate pagination parameters
        if page < 1:
            page = 1
        if limit < 1 or limit > 100:
            limit = 20

        offset = (page - 1) * limit

        posts = db_service.get_all_posts(limit=limit, offset=offset)

        return jsonify({
            'posts': posts,
            'pagination': {
                'page': page,
                'limit': limit,
                'offset': offset
            }
        }), 200

    except Exception as e:
        print(f"Get posts error: {e}")
        return jsonify({'error': 'Internal server error'}), 500


@posts_bp.route('', methods=['POST'])
@jwt_required()
def create_post():
    """
    Create a new post
    """
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        content = data.get('content', '').strip()
        if not content:
            return jsonify({'error': 'Post content is required'}), 400

        if len(content) > 1000:
            return jsonify({'error': 'Post content cannot exceed 1000 characters'}), 400

        # Create post
        post = Post(
            user_id=user_id,
            content=content,
            image_url=data.get('image_url')
        )

        created_post = db_service.create_post(post)

        # Get user info for the response
        user = db_service.get_user_by_id(user_id)
        post_dict = created_post.to_dict()
        post_dict['user_name'] = user.name if user else 'Unknown User'
        post_dict['user_profile_picture'] = user.profile_picture_url if user else None

        return jsonify({
            'message': 'Post created successfully',
            'post': post_dict
        }), 201

    except Exception as e:
        print(f"Create post error: {e}")
        return jsonify({'error': 'Internal server error'}), 500


@posts_bp.route('/<post_id>', methods=['GET'])
def get_post(post_id):
    """
    Get a specific post by ID
    """
    try:
        post = db_service.get_post_by_id(post_id)

        if not post:
            return jsonify({'error': 'Post not found'}), 404

        # Get user info
        user = db_service.get_user_by_id(post.user_id)
        post_dict = post.to_dict()
        post_dict['user_name'] = user.name if user else 'Unknown User'
        post_dict['user_profile_picture'] = user.profile_picture_url if user else None

        return jsonify({
            'post': post_dict
        }), 200

    except Exception as e:
        print(f"Get post error: {e}")
        return jsonify({'error': 'Internal server error'}), 500


@posts_bp.route('/<post_id>/like', methods=['PUT'])
@jwt_required()
def like_post(post_id):
    """
    Like a post (Medium's Clap feature - can like multiple times)
    """
    try:
        user_id = get_jwt_identity()

        # Check if post exists
        post = db_service.get_post_by_id(post_id)
        if not post:
            return jsonify({'error': 'Post not found'}), 404

        # Like the post
        updated_post = db_service.like_post(post_id)

        if not updated_post:
            return jsonify({'error': 'Failed to like post'}), 500

        # Get user info for the response
        user = db_service.get_user_by_id(updated_post.user_id)
        post_dict = updated_post.to_dict()
        post_dict['user_name'] = user.name if user else 'Unknown User'
        post_dict['user_profile_picture'] = user.profile_picture_url if user else None

        return jsonify({
            'message': 'Post liked successfully',
            'post': post_dict
        }), 200

    except Exception as e:
        print(f"Like post error: {e}")
        return jsonify({'error': 'Internal server error'}), 500


@posts_bp.route('/user/<user_id>', methods=['GET'])
def get_user_posts(user_id):
    """
    Get all posts by a specific user
    """
    try:
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 20, type=int)

        # Validate pagination parameters
        if page < 1:
            page = 1
        if limit < 1 or limit > 100:
            limit = 20

        offset = (page - 1) * limit

        # Check if user exists
        user = db_service.get_user_by_id(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        posts = db_service.get_posts_by_user(
            user_id, limit=limit, offset=offset)

        # Add user info to each post
        posts_with_user = []
        for post in posts:
            post_dict = post.to_dict()
            post_dict['user_name'] = user.name
            post_dict['user_profile_picture'] = user.profile_picture_url
            posts_with_user.append(post_dict)

        return jsonify({
            'posts': posts_with_user,
            'user': user.to_dict(),
            'pagination': {
                'page': page,
                'limit': limit,
                'offset': offset
            }
        }), 200

    except Exception as e:
        print(f"Get user posts error: {e}")
        return jsonify({'error': 'Internal server error'}), 500
