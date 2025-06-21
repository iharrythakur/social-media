import uuid
from datetime import datetime
from typing import Optional


class Post:
    def __init__(self, user_id: str, content: str, image_url: Optional[str] = None,
                 likes_count: int = 0, id: Optional[str] = None,
                 created_at: Optional[datetime] = None, updated_at: Optional[datetime] = None):
        self.id = id or str(uuid.uuid4())
        self.user_id = user_id
        self.content = content
        self.image_url = image_url
        self.likes_count = likes_count
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'content': self.content,
            'image_url': self.image_url,
            'likes_count': self.likes_count,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def like(self):
        """Increment the likes count (Medium's Clap feature)"""
        self.likes_count += 1
        self.updated_at = datetime.utcnow()

    def update(self, content: Optional[str] = None, image_url: Optional[str] = None):
        if content is not None:
            self.content = content
        if image_url is not None:
            self.image_url = image_url
        self.updated_at = datetime.utcnow()

    @staticmethod
    def from_dict(data: dict):
        created_at = data.get('created_at')
        if created_at and isinstance(created_at, str):
            created_at = datetime.fromisoformat(created_at)

        updated_at = data.get('updated_at')
        if updated_at and isinstance(updated_at, str):
            updated_at = datetime.fromisoformat(updated_at)

        return Post(
            id=data.get('id'),
            user_id=data['user_id'],
            content=data['content'],
            image_url=data.get('image_url'),
            likes_count=data.get('likes_count', 0),
            created_at=created_at,
            updated_at=updated_at
        )
