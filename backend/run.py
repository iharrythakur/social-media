from app import create_app
from app.services.database import db_service

app = create_app()

if __name__ == '__main__':
    # Initialize database tables
    try:
        db_service.init_database()
        print("Database initialized successfully")
    except Exception as e:
        print(f"Database initialization failed: {e}")

    app.run(debug=True, host='0.0.0.0', port=5000)
