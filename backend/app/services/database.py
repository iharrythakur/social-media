import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import List, Optional, Dict, Any
from ..models.user import User
from ..models.post import Post


class DatabaseService:
    def __init__(self):
        self.connection_string = os.getenv('DATABASE_URL')
        if not self.connection_string:
            # Fallback to individual environment variables
            self.connection_string = f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"

    def get_connection(self):
        return psycopg2.connect(self.connection_string, cursor_factory=RealDictCursor)

    # User operations
    def create_user(self, user: User) -> User:
        with self.get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO users (id, firebase_uid, name, email, bio, profile_picture_url, created_at, updated_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING *
                """, (
                    user.id, user.firebase_uid, user.name, user.email,
                    user.bio, user.profile_picture_url, user.created_at, user.updated_at
                ))
                result = cur.fetchone()
                conn.commit()
                return User.from_dict(dict(result))

    def get_user_by_firebase_uid(self, firebase_uid: str) -> Optional[User]:
        with self.get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT * FROM users WHERE firebase_uid = %s", (firebase_uid,))
                result = cur.fetchone()
                return User.from_dict(dict(result)) if result else None

    def get_user_by_id(self, user_id: str) -> Optional[User]:
        with self.get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM users WHERE id = %s", (user_id,))
                result = cur.fetchone()
                return User.from_dict(dict(result)) if result else None

    def update_user(self, user_id: str, updates: Dict[str, Any]) -> Optional[User]:
        with self.get_connection() as conn:
            with conn.cursor() as cur:
                set_clause = ", ".join([f"{k} = %s" for k in updates.keys()])
                values = list(updates.values()) + [user_id]
                cur.execute(f"""
                    UPDATE users SET {set_clause}, updated_at = NOW()
                    WHERE id = %s
                    RETURNING *
                """, values)
                result = cur.fetchone()
                return User.from_dict(dict(result)) if result else None

    # Post operations
    def create_post(self, post: Post) -> Post:
        with self.get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO posts (id, user_id, content, image_url, likes_count, created_at, updated_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    RETURNING *
                """, (
                    post.id, post.user_id, post.content, post.image_url,
                    post.likes_count, post.created_at, post.updated_at
                ))
                result = cur.fetchone()
                return Post.from_dict(dict(result))

    def get_all_posts(self, limit: int = 50, offset: int = 0) -> List[Post]:
        with self.get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT p.*, u.name as user_name, u.profile_picture_url as user_profile_picture
                    FROM posts p
                    JOIN users u ON p.user_id = u.id
                    ORDER BY p.created_at DESC
                    LIMIT %s OFFSET %s
                """, (limit, offset))
                results = cur.fetchall()
                posts = []
                for result in results:
                    post_data = dict(result)
                    # Remove user fields from post data
                    user_name = post_data.pop('user_name', None)
                    user_profile_picture = post_data.pop(
                        'user_profile_picture', None)
                    post = Post.from_dict(post_data)
                    # Add user info to post dict
                    post_dict = post.to_dict()
                    post_dict['user_name'] = user_name
                    post_dict['user_profile_picture'] = user_profile_picture
                    posts.append(post_dict)
                return posts

    def get_post_by_id(self, post_id: str) -> Optional[Post]:
        with self.get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM posts WHERE id = %s", (post_id,))
                result = cur.fetchone()
                return Post.from_dict(dict(result)) if result else None

    def like_post(self, post_id: str) -> Optional[Post]:
        with self.get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    UPDATE posts SET likes_count = likes_count + 1, updated_at = NOW()
                    WHERE id = %s
                    RETURNING *
                """, (post_id,))
                result = cur.fetchone()
                return Post.from_dict(dict(result)) if result else None

    def get_posts_by_user(self, user_id: str, limit: int = 20, offset: int = 0) -> List[Post]:
        with self.get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT * FROM posts 
                    WHERE user_id = %s 
                    ORDER BY created_at DESC
                    LIMIT %s OFFSET %s
                """, (user_id, limit, offset))
                results = cur.fetchall()
                return [Post.from_dict(dict(result)) for result in results]

    # Database initialization
    def init_database(self):
        """Create tables if they don't exist"""
        with self.get_connection() as conn:
            with conn.cursor() as cur:
                # Create users table
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS users (
                        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                        firebase_uid VARCHAR(255) UNIQUE NOT NULL,
                        name VARCHAR(255) NOT NULL,
                        email VARCHAR(255) UNIQUE NOT NULL,
                        bio TEXT,
                        profile_picture_url TEXT,
                        created_at TIMESTAMP DEFAULT NOW(),
                        updated_at TIMESTAMP DEFAULT NOW()
                    )
                """)

                # Create posts table
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS posts (
                        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                        content TEXT NOT NULL,
                        image_url TEXT,
                        likes_count INTEGER DEFAULT 0,
                        created_at TIMESTAMP DEFAULT NOW(),
                        updated_at TIMESTAMP DEFAULT NOW()
                    )
                """)

                conn.commit()


# Global database service instance
db_service = DatabaseService()
