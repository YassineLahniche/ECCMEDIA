# ECC Media Platform

A media platform with user authentication, article publishing, and admin capabilities.

## Features

- User authentication (login, register)
- Role-based access control (admin, writer)
- Article creation and management
- Admin dashboard
- Responsive designs

## Tech Stack

- **Backend**: Flask, SQLAlchemy, JWT Authentication
- **Frontend**: React, React Router, Axios
- **Database**: SQLite (development), PostgreSQL (production-ready)

## Project Structure

```
ecc-media/
│
├── backend/         # Flask REST API
├── frontend/        # React application
└── admin/           # Admin interface documentation
```

## Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run the Flask application:
   ```
   python app.py
   ```
   
The backend API will be available at http://localhost:5000.

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

The frontend application will be available at http://localhost:3000.

## Production Deployment

For production deployment:

1. Set proper environment variables in .env
2. Update DATABASE_URL to point to your production database
3. Generate a secure JWT_SECRET_KEY
4. Build the frontend:
   ```
   cd frontend
   npm run build
   ```
5. Serve the Flask application with a production server like Gunicorn

## Color Palette

- **#00325A** - Deep Navy Blue (Primary Color)
- **#3A46B** - Dark Slate Blue (Secondary Color)
- **#193331** - Dark Forest Green (Accent Color)
- **#CF9D04** - Golden Yellow (Highlight Color)
- **#FAF9F6** - Soft Cream White (Background/Neutral Color)
