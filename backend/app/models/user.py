import uuid
from datetime import datetime
from typing import Optional


class User:
    def __init__(self, firebase_uid: str, name: str, email: str, bio: Optional[str] = None,
                 profile_picture_url: Optional[str] = None, id: Optional[str] = None,
                 created_at: Optional[datetime] = None, updated_at: Optional[datetime] = None):
        self.id = id or str(uuid.uuid4())
        self.firebase_uid = firebase_uid
        self.name = name
        self.email = email
        self.bio = bio
        self.profile_picture_url = profile_picture_url
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()

    def to_dict(self):
        return {
            'id': self.id,
            'firebase_uid': self.firebase_uid,
            'name': self.name,
            'email': self.email,
            'bio': self.bio,
            'profile_picture_url': self.profile_picture_url,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def update(self, name: Optional[str] = None, bio: Optional[str] = None,
               profile_picture_url: Optional[str] = None):
        if name is not None:
            self.name = name
        if bio is not None:
            self.bio = bio
        if profile_picture_url is not None:
            self.profile_picture_url = profile_picture_url
        self.updated_at = datetime.utcnow()

    @staticmethod
    def from_dict(data: dict):
        created_at = data.get('created_at')
        if created_at and isinstance(created_at, str):
            created_at = datetime.fromisoformat(created_at)

        updated_at = data.get('updated_at')
        if updated_at and isinstance(updated_at, str):
            updated_at = datetime.fromisoformat(updated_at)

        return User(
            id=data.get('id'),
            firebase_uid=data['firebase_uid'],
            name=data['name'],
            email=data['email'],
            bio=data.get('bio'),
            profile_picture_url=data.get('profile_picture_url'),
            created_at=created_at,
            updated_at=updated_at
        )
