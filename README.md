# Classroom Attendance System

## Overview
The **Classroom Attendance System** is a facial recognition-based attendance tracking system designed to automate the process of taking attendance in classrooms. Using OpenCV for facial recognition and React for the admin page, this system allows instructors to easily monitor and track student attendance.

## Features
- Facial recognition for automatic student identification.
- Real-time attendance tracking via a web-based admin page.
- Integration with Google Cloud for storing and managing attendance data.

## Documentation
You can view the full documentation [here](./Phase%203.pdf).

## Installation

### Backend (Python)
1. Clone the repository:
   ```bash
   git clone https://github.com/edwjlr/classroom-attendance-system.git
   cd classroom-attendance-system
   ```

2. Set up a Python virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   pip install -r backend/requirements.txt
   ```

3. Run the facial recognition scripts to generate encodings or recognize faces:
   ```bash
   python backend/generate_encodings.py  # To generate face encodings if need to
   python recface.py  # To recognize faces and track attendance (start uploading recognized faces to cloud services
   ```

### Frontend (React)
1. Navigate to the `admin-page` directory:
   ```bash
   cd admin-page
   ```

2. Install the necessary Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```
   This will launch the admin page at `http://localhost:3000`.

## Usage
- The backend will detect faces using OpenCV and compare them to pre-stored encodings.
- The admin page allows instructors to view attendance records and manage student data.
- Attendance updates are triggered automatically once a recognized face is detected.

## File Structure
```
classroom-attendance-system/
│
├── edge-service/
│   ├── scripts/
│   │   ├── 68face.py                 # 68 key points facial detection script used
│   │   ├── generate_encodings.py     # Script to generate face encodings
│   │   ├── purge.py                  # Cleanup utility
│   │   ├── recognize_faces.py        # Script for real-time face recognition
│   ├── services/
│   │   ├── upload_to_gcloud.py       # Uploads data to Google Cloud
│   │   ├── recface.py                # Core facial recognition logic
│   ├── models/
│   │   ├── face_encodings.pkl        # Pre-stored face encodings
│   │   ├── shape_predictor_68_face_landmarks.dat  # Pre-trained facial landmarks model
│   ├── requirements.txt              # Python dependencies
│
├── admin-page/
│   ├── src/                          # React source files
│   ├── public/                       # Static files
│   ├── package.json                  # React dependencies
│   ├── package-lock.json             # Lock file for React dependencies
│
└── README.md                         # This file
```

## Pre-trained Models
The system requires the **shape_predictor_68_face_landmarks.dat** model for facial feature detection.

## License
This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
