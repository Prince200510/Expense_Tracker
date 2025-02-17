import React, {useState, useEffect} from 'react';
import { getDatabase, ref, onValue, push } from "firebase/database";
import { initializeApp } from "firebase/app";
import './note.css';
import Swal from 'sweetalert2'

const firebaseConfig = {
    apiKey: "AIzaSyD1XsSEliGNIDSssSme2DNuFpSllCYKcgc",
    authDomain: "expense-1abe9.firebaseapp.com",
    projectId: "expense-1abe9",
    storageBucket: "expense-1abe9.appspot.com",
    messagingSenderId: "263700836599",
    appId: "1:263700836599:web:a3073a338efe5fba0d63f2",
    measurementId: "G-7JC08M5B4S"
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

const Save_note = () => {
    const [title, setTitle] = useState('');
    const [note, setNote] = useState('');
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        const dataRetrieval = ref(database, 'keep_note');
        const unsubscribe = onValue(dataRetrieval, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const notesList = Object.keys(data).map(key => ({
              id: key,
              ...data[key]
            }));
            setNotes(notesList.reverse());
          }
        });
    
        return () => unsubscribe();
      }, []);

    const save = async ()  => {
        if(!title || !note){
            Swal.fire({
                title: 'Error!',
                text: 'Please fill all the details',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
            return
        } else {
            const formatDateAndTime = () => {
                const now = new Date();
                const date = now.toLocaleDateString();
                const time = now.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                });
                return { date, time };
            };
        
            const { date, time } = formatDateAndTime();
            const store_data = {
                title: title,
                note: note,
                date: date,
                time: time
            }
            const save_data = ref(database, 'keep_note');
            await push(save_data, store_data);
        }
    };

    return(
        <>
            <h2>Note</h2>
            <hr></hr>
            <div class="keep-note">
                <div className="add-expense-data">
                    <input type='text' style={{width: "250px", fontWeight: "600"}} value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Title'></input><br></br>
                    <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder='Take a note...'></textarea><br></br>
                    <button onClick={save}>Save</button>
                </div>
                <div class="savenote">
                    {notes.length > 0 ? (
                        notes.map(note => (
                            <div key={note.id} className="note">
                                <div class="scroll-bar-note">
                                    <div class="keep-data-note">
                                        <h3>{note.title}</h3>
                                        <hr></hr>
                                        <p>{note.note}</p>
                                        <p style={{color: "grey", fontSize: "10px"}}>{note.date} {note.time}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No notes available.</p>
                    )}
                </div>
            </div>
        </>
    )
};

export default Save_note;