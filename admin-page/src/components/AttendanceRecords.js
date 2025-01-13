import React, { useEffect, useState } from 'react';
import { firestore, storage } from '../config/firebase-config';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { format, utcToZonedTime } from 'date-fns-tz';
import styles from './AttendanceRecords.module.css';

function AttendanceRecords() {
    const [records, setRecords] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedClass, setSelectedClass] = useState('MondayWednesday');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        setLoading(true);
        const q = query(collection(firestore, "log_entries"), orderBy("timestamp", "desc"));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchTasks = snapshot.docs.map(doc => {
                const data = doc.data();
                const photoRefName = data.unique_id ? `${data.unique_id}_face.jpg` : `${data.name}_face.jpg`;
                const photoRef = ref(storage, photoRefName);
                return getDownloadURL(photoRef)
                  .then(photoUrl => ({
                      id: doc.id,
                      photoUrl,
                      ...data
                  }))
                  .catch(() => ({
                      id: doc.id,
                      photoUrl: null, // Provide a default or null if the photo can't be fetched
                      ...data
                  }));
            });

            Promise.all(fetchTasks).then(newRecords => {
                setRecords(newRecords);
                setLoading(false);
            });
        });

        return () => unsubscribe();
    }, []);

    const handleThumbnailClick = (photoUrl) => {
        setSelectedImage(photoUrl);
    };

    const handleCloseImage = () => {
        setSelectedImage(null);
    };

    const filterRecords = (records, selectedClass, selectedDate) => {
    if (!records || !selectedClass || !selectedDate) {
        return [];
    }

    // Assuming your Firestore timestamp is UTC
    // And you want to convert it to 'America/Los_Angeles' timezone manually
    const timeZoneOffset = -7; // PDT timezone offset for 'America/Los_Angeles'

    return records.filter(record => {
        // Convert Firestore timestamp to JavaScript Date object
        const utcDate = record.timestamp.toDate();
        // Manually adjust for timezone
        const tzDate = new Date(utcDate.getTime() + timeZoneOffset * 3600 * 1000);
        // Format the record date string for comparison
        const recordDateString = tzDate.toISOString().split('T')[0];

        const isSameDay = recordDateString === selectedDate;
        const dayOfWeek = tzDate.getUTCDay(); // Get day of week with timezone adjustment

        if (selectedClass === '24hours') {
            return isSameDay;
        } else if (selectedClass === 'MondayWednesday' && isSameDay) {
            // Define class times for Monday & Wednesday (9:30 AM to 10:50 AM)
            if (dayOfWeek === 1 || dayOfWeek === 3) { // 1 = Monday, 3 = Wednesday
                // Convert the selectedDate to a Date object at 00:00:00 hours
                const selectedDateObj = new Date(selectedDate + 'T00:00:00Z');
                // Adjust selected date for timezone to compare hours
                const classStartTime = new Date(selectedDateObj.getTime() + timeZoneOffset * 3600 * 1000).setHours(9, 30, 0, 0);
                const classEndTime = new Date(selectedDateObj.getTime() + timeZoneOffset * 3600 * 1000).setHours(10, 50, 0, 0);

                // Check if the timestamp falls within class hours for the selected day
                const tzDateTime = tzDate.getTime();
                return tzDateTime >= classStartTime && tzDateTime <= classEndTime;
            }
            return false; // If not Monday or Wednesday
        } else {
            return false; // For any other class type, default to false
        }
    });
};


    const handleClassChange = (event) => {
        setSelectedClass(event.target.value);
    };

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    const filteredRecords = filterRecords(records, selectedClass, selectedDate);

    const downloadAttendanceRecords = () => {
        const recordsForDownload = filteredRecords.map(record => `${record.name}`).join('\n');
        const blob = new Blob([recordsForDownload], { type: 'text/plain' });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = `Attendance_${selectedClass}_${selectedDate.replace(/-/g, '')}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <h2>Attendance Records</h2>
            <div>
                <label htmlFor="classSelect">Select Class:</label>
                <select id="classSelect" value={selectedClass} onChange={handleClassChange}>
                    <option value="MondayWednesday">Monday & Wednesday</option>
                    <option value="24hours">24-Hour Class</option>
                </select>
            </div>
            <div>
                <label htmlFor="dateSelect">Select Date:</label>
                <input type="date" id="dateSelect" value={selectedDate} onChange={handleDateChange} />
            </div>
            <button onClick={downloadAttendanceRecords} style={{margin: "10px 0"}}>Download Attendance</button>
            {loading ? <p>Loading...</p> : (
                <ul className={styles.thumbnails}>
                    {filteredRecords.length > 0 ? (
                        filteredRecords.map((record) => (
                            <li key={record.id} onClick={() => handleThumbnailClick(record.photoUrl || 'path/to/default/image.jpg')}>
                                <img className={styles.thumbnail} src={record.photoUrl || 'path/to/default/image.jpg'} alt={record.name} />
                                <div>{record.name} - {format(record.timestamp.toDate(), 'PPpp', { timeZone: 'America/Los_Angeles' })}</div>
                            </li>
                        ))
                    ) : <p>No attendance recorded for this class on the selected date.</p>}
                </ul>
            )}
            {selectedImage && (
                <div className={styles.enlargedImage}>
                    <span className={styles.closeBtn} onClick={handleCloseImage}>Close</span>
                    <img src={selectedImage} alt="Enlarged view" />
                </div>
            )}
        </div>
    );
}

export default AttendanceRecords;
