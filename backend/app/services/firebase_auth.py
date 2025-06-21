import firebase_admin
from firebase_admin import credentials, auth
import os
from typing import Optional, Dict, Any


class FirebaseAuthService:
    def __init__(self):
        # Initialize Firebase Admin SDK
        if not firebase_admin._apps:
            # Try to load service account key from environment
            service_account_info = os.getenv('FIREBASE_SERVICE_ACCOUNT')
            if service_account_info:
                import json
                cred = credentials.Certificate(
                    json.loads(service_account_info))
            else:
                # Use default credentials (for development)
                cred = credentials.ApplicationDefault()

            firebase_admin.initialize_app(cred)

    def verify_token(self, id_token: str) -> Optional[Dict[str, Any]]:
        """
        Verify Firebase ID token and return user information
        """
        try:
            decoded_token = auth.verify_id_token(id_token)
            return {
                'uid': decoded_token['uid'],
                'email': decoded_token.get('email'),
                'name': decoded_token.get('name'),
                'picture': decoded_token.get('picture')
            }
        except Exception as e:
            print(f"Token verification failed: {e}")
            return None

    def get_user_by_uid(self, uid: str) -> Optional[Dict[str, Any]]:
        """
        Get user information from Firebase by UID
        """
        try:
            user = auth.get_user(uid)
            return {
                'uid': user.uid,
                'email': user.email,
                'display_name': user.display_name,
                'photo_url': user.photo_url
            }
        except Exception as e:
            print(f"Failed to get user by UID: {e}")
            return None


# Global Firebase auth service instance
firebase_auth = FirebaseAuthService()
