# Classroom Attendance System

## Overview
The **Classroom Attendance System** is a facial recognition-based attendance tracking system designed to automate the process of taking attendance in classrooms. Using OpenCV for facial recognition and React for the admin page, this system allows instructors to easily monitor and track student attendance.

## Features
- Facial recognition for automatic student identification.
- Real-time attendance tracking via a web-based admin page.
- Integration with Google Cloud for storing and managing attendance data.

## Documentation
You can view the full project documentation [here](./Phase%203.pdf).

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
### Setting Up Authentication Keys
Make sure to setup auth keys for Gcloud. To integrate with Google Cloud or any other external services, you need to set up authentication keys:
1. **Google Cloud Service Account Key:**
   - Create a service account key in the Google Cloud Console:
     1. Go to the [Google Cloud Console](https://console.cloud.google.com).
     2. Navigate to **IAM & Admin** > **Service Accounts**.
     3. Select or create a service account.
     4. Click **Keys** and create a new JSON key.
     5. Download the key file and place it in a secure directory (e.g., `edge-service/config/`).

2. **Environment Variable Configuration:**
   - Set up environment variables to point to the authentication key file:
     ```bash
     export GOOGLE_APPLICATION_CREDENTIALS="edge-service/config/your-key-file.json"
     ```
   - Add this line to your shell configuration file (e.g., `.bashrc` or `.zshrc`) for persistence.

3. Update `upload_to_gcloud.py` or other scripts to use the key for authentication.

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

### Setting Up Firebase
If Firebase is used for user authentication, database management, or hosting, follow these steps to set it up:

1. **Create a Firebase Project:**
   - Go to the [Firebase Console](https://console.firebase.google.com/).
   - Click **Add Project** and follow the prompts to create a new project.

2. **Add a Web App:**
   - In your Firebase project, navigate to **Project Settings** > **Your Apps**.
   - Click **Add App** and select the **Web** platform.
   - Register your app and copy the Firebase configuration object.

3. **Configure Firebase in Your Project:**
   - Add the Firebase configuration to your React project:
     - Create a file named `firebaseConfig.js` in the `src` directory of `admin-page`.
     - Paste the configuration object:
       ```javascript
       import { initializeApp } from "firebase/app";

       const firebaseConfig = {
         apiKey: "YOUR_API_KEY",
         authDomain: "YOUR_AUTH_DOMAIN",
         projectId: "YOUR_PROJECT_ID",
         storageBucket: "YOUR_STORAGE_BUCKET",
         messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
         appId: "YOUR_APP_ID"
       };

       const app = initializeApp(firebaseConfig);
       export default app;
       ```

4. **Install Firebase SDK:**
   ```bash
   npm install firebase
   ```

5. **Set Up Firebase Services:**
   - For Authentication:
     ```javascript
     import { getAuth } from "firebase/auth";
     const auth = getAuth(app);
     export default auth;
     ```
   - For Firestore Database:
     ```javascript
     import { getFirestore } from "firebase/firestore";
     const db = getFirestore(app);
     export default db;
     ```

6. **Update `.env` for Security (Recommended):**
   - Instead of hardcoding Firebase credentials, use environment variables.
   - Create a `.env` file in the root directory and add:
     ```
     REACT_APP_FIREBASE_API_KEY=YOUR_API_KEY
     REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
     ```
   - Update your `firebaseConfig.js` to use these environment variables.

7. **Enable Firebase Services:**
   - In the Firebase Console, go to **Build** > **Authentication** and enable your preferred authentication methods.
   - For Firestore, navigate to **Build** > **Firestore Database** and click **Create Database**.

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
