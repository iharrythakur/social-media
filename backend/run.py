import logging
from app import create_app
from app.services.database import db_service

# Configure logging first
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

app = create_app()

if __name__ == '__main__':
    # Initialize database tables
    try:
        logging.info("Starting database initialization...")
        db_service.init_database()
        logging.info("Database initialized successfully")
    except Exception as e:
        logging.error(f"Database initialization failed: {e}")

    app.run(debug=True, host='0.0.0.0', port=5000)
