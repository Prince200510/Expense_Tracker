import React, { useState, useEffect, useRef } from 'react';
import { ref, onValue, push, remove, update } from "firebase/database";
import { database } from '../services/firebase';
import { FaTrash, FaEdit, FaPalette, FaTimes, FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';
import './note.css';

const COLORS = [
  '#ffffff', // Default white
  '#f28b82', // Red
  '#fbbc04', // Orange
  '#fff475', // Yellow
  '#ccff90', // Green
  '#a7ffeb', // Teal
  '#cbf0f8', // Blue
  '#aecbfa', // Dark Blue
  '#d7aefb', // Purple
  '#fdcfe8', // Pink
  '#e6c9a8', // Brown
  '#e8eaed', // Gray
];

const Save_note = () => {
    // New note state
    const [title, setTitle] = useState('');
    const [note, setNote] = useState('');
    const [color, setColor] = useState(COLORS[0]);
    const [showColorPalette, setShowColorPalette] = useState(false);
    
    // Notes list
    const [notes, setNotes] = useState([]);

    // Modal / Edit state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editNote, setEditNote] = useState('');
    const [editColor, setEditColor] = useState('');
    const [showEditColorPalette, setShowEditColorPalette] = useState(false);

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
          } else {
            setNotes([]);
          }
        });
    
        return () => unsubscribe();
      }, []);

    const handleKeyDown = (e, text, setText) => {
        if (e.key === 'Enter') {
          const cursorPosition = e.target.selectionStart;
          const textBeforeCursor = text.substring(0, cursorPosition);
          const textAfterCursor = text.substring(cursorPosition);
          const lines = textBeforeCursor.split('\n');
          const currentLine = lines[lines.length - 1];
          
          // Match bullet (- or *) or number (1.)
          const bulletMatch = currentLine.match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
          // Also match empty bullet lines
          const emptyBulletMatch = currentLine.match(/^(\s*)([-*]|\d+\.)\s*$/);
          
          if (emptyBulletMatch) {
             // If user hits enter on an empty bullet, remove the bullet and go to new line
             e.preventDefault();
             const newTextBefore = textBeforeCursor.substring(0, textBeforeCursor.length - currentLine.length);
             setText(newTextBefore + '\n' + textAfterCursor);
             setTimeout(() => {
                e.target.selectionStart = e.target.selectionEnd = newTextBefore.length + 1;
             }, 0);
          } else if (bulletMatch) {
            e.preventDefault();
            const prefix = bulletMatch[1];
            const listMarker = bulletMatch[2];
            
            let newMarker = listMarker;
            if (/\d+\./.test(listMarker)) {
                newMarker = `${parseInt(listMarker) + 1}.`;
            }
            
            const insertStr = `\n${prefix}${newMarker} `;
            const newText = textBeforeCursor + insertStr + textAfterCursor;
            setText(newText);
            
            setTimeout(() => {
                e.target.selectionStart = e.target.selectionEnd = cursorPosition + insertStr.length;
            }, 0);
          }
        }
    };

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

    const save = async ()  => {
        if(!title && !note){
            return;
        } 
        const { date, time } = formatDateAndTime();
        const store_data = {
            title: title || '',
            note: note || '',
            color: color,
            date: date,
            time: time
        }
        const save_data = ref(database, 'keep_note');
        await push(save_data, store_data);
        setTitle('');
        setNote('');
        setColor(COLORS[0]);
        setShowColorPalette(false);
    };

    const deleteNote = async (id, e) => {
        e.stopPropagation(); // Prevent opening modal
        const result = await Swal.fire({
            title: 'Delete Note?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            const noteRef = ref(database, `keep_note/${id}`);
            await remove(noteRef);
            if (isModalOpen && selectedNote?.id === id) {
                closeModal();
            }
        }
    };

    const openModal = (noteItem) => {
        setSelectedNote(noteItem);
        setEditTitle(noteItem.title);
        setEditNote(noteItem.note);
        setEditColor(noteItem.color || COLORS[0]);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedNote(null);
        setShowEditColorPalette(false);
    };

    const updateNote = async () => {
        if (selectedNote) {
            const { date, time } = formatDateAndTime(); // Option to update modified time, or keep original. Let's update it.
            const noteRef = ref(database, `keep_note/${selectedNote.id}`);
            await update(noteRef, {
                title: editTitle,
                note: editNote,
                color: editColor,
                updated_date: date,
                updated_time: time
            });
            closeModal();
        }
    };

    return(
        <div className="p-4 md:p-8 w-full max-w-7xl mx-auto flex flex-col items-center">
            
            {/* Create Note Input Area */}
            <div 
                className="w-full max-w-2xl bg-white rounded-xl shadow-md border border-gray-200 transition-all duration-300 relative group overflow-hidden mb-12"
                style={{ backgroundColor: color }}
            >
                <div className="p-4 flex flex-col gap-3">
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        placeholder="Title"
                        className="w-full bg-transparent border-none outline-none font-bold text-lg text-gray-800 placeholder-gray-500"
                    />
                    <textarea 
                        value={note} 
                        onChange={(e) => setNote(e.target.value)} 
                        onKeyDown={(e) => handleKeyDown(e, note, setNote)}
                        placeholder="Take a note... (Use -, *, or 1. for lists)"
                        className="w-full bg-transparent border-none outline-none text-gray-700 resize-none min-h-[80px]"
                    />
                </div>
                
                <div className="flex justify-between items-center p-2 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="relative">
                        <button 
                            className="p-2 rounded-full hover:bg-black/10 text-gray-600 tooltip-trigger"
                            onClick={() => setShowColorPalette(!showColorPalette)}
                            title="Background options"
                        >
                            <FaPalette />
                        </button>
                        {showColorPalette && (
                            <div className="absolute top-10 left-0 bg-white p-2 rounded-lg shadow-xl border border-gray-200 flex flex-wrap gap-2 w-48 z-10">
                                {COLORS.map(c => (
                                    <div 
                                        key={c}
                                        onClick={() => setColor(c)}
                                        className={`w-6 h-6 rounded-full cursor-pointer border hover:border-gray-600 ${color === c ? 'border-gray-800 border-2' : 'border-gray-300'}`}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    <button 
                        onClick={save}
                        className="px-4 py-1.5 font-semibold text-gray-800 hover:bg-black/10 rounded-md transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>

            {/* Notes Grid */}
            <div className="w-full masonry-grid">
                {notes.length > 0 ? (
                    notes.map(noteItem => (
                        <div 
                            key={noteItem.id} 
                            className="masonry-item bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer group hover:shadow-md transition-shadow relative mb-4"
                            style={{ backgroundColor: noteItem.color || '#fff' }}
                            onClick={() => openModal(noteItem)}
                        >
                            <div className="p-4 max-h-[350px] relative overflow-hidden">
                                {noteItem.title && <h3 className="font-bold text-lg mb-2 text-gray-800">{noteItem.title}</h3>}
                                <div className="text-gray-700 whitespace-pre-wrap font-normal break-words text-sm leading-relaxed">
                                    {noteItem.note}
                                </div>
                                {/* Fade out effect for long notes */}
                                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--card-bg)] to-transparent opacity-0 pointer-events-none" style={{ '--card-bg': noteItem.color || '#fff', opacity: 1 }}></div>
                            </div>
                            
                            <div className="px-4 pb-2 opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-center absolute bottom-0 left-0 right-0 bg-black/5 backdrop-blur-sm">
                                <span className="text-[10px] text-gray-500 font-medium">{noteItem.date} {noteItem.time}</span>
                                <button 
                                    className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                                    onClick={(e) => deleteNote(noteItem.id, e)}
                                    title="Delete note"
                                >
                                    <FaTrash size={14} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="w-full flex justify-center mt-12 opacity-50">
                        <div className="text-center">
                            <FaEdit size={48} className="mx-auto mb-4 text-gray-400" />
                            <p className="text-gray-500 text-lg">Notes you add appear here</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {isModalOpen && selectedNote && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={closeModal}>
                    <div 
                        className="w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden relative flex flex-col"
                        style={{ backgroundColor: editColor, maxHeight: '90vh' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-5 flex-1 overflow-y-auto min-h-[300px]">
                            <input 
                                type="text" 
                                value={editTitle} 
                                onChange={(e) => setEditTitle(e.target.value)} 
                                placeholder="Title"
                                className="w-full bg-transparent border-none outline-none font-bold text-2xl text-gray-800 placeholder-gray-500 mb-4"
                            />
                            <textarea 
                                value={editNote} 
                                onChange={(e) => setEditNote(e.target.value)} 
                                onKeyDown={(e) => handleKeyDown(e, editNote, setEditNote)}
                                placeholder="Take a note..."
                                className="w-full bg-transparent border-none outline-none text-gray-700 min-h-[200px] h-[calc(100%-40px)] resize-none"
                            />
                        </div>
                        
                        <div className="p-3 bg-black/5 flex justify-between items-center">
                            <div className="flex gap-2">
                                <div className="relative">
                                    <button 
                                        className="p-2 rounded-full hover:bg-black/10 text-gray-600"
                                        onClick={() => setShowEditColorPalette(!showEditColorPalette)}
                                        title="Background options"
                                    >
                                        <FaPalette size={18} />
                                    </button>
                                    {showEditColorPalette && (
                                        <div className="absolute bottom-12 left-0 bg-white p-2 rounded-lg shadow-xl border border-gray-200 flex flex-wrap gap-2 w-48 z-10">
                                            {COLORS.map(c => (
                                                <div 
                                                    key={c}
                                                    onClick={() => {
                                                        setEditColor(c);
                                                        setShowEditColorPalette(false);
                                                    }}
                                                    className={`w-6 h-6 rounded-full cursor-pointer border hover:border-gray-600 ${editColor === c ? 'border-gray-800 border-2' : 'border-gray-300'}`}
                                                    style={{ backgroundColor: c }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <span className="p-2 text-xs text-gray-500 self-center">
                                    Edited {selectedNote.updated_date || selectedNote.date}
                                </span>
                            </div>
                            
                            <div className="flex gap-2">
                                <button 
                                    onClick={closeModal}
                                    className="px-4 py-2 font-medium text-gray-600 hover:bg-black/10 rounded-md transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={updateNote}
                                    className="px-4 py-2 font-bold text-gray-800 bg-white/50 border border-black/10 hover:bg-black/10 rounded-md transition-colors shadow-sm"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
};

export default Save_note;