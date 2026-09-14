import React, { useState, useEffect } from 'react';
import { ref, push, update } from "firebase/database";
import { database } from '../../services/firebase';
import Swal from 'sweetalert2';

const QuickAddModal = ({ isOpen, onClose, editTx }) => {
    const [amount, setAmount] = useState('');
    const [purpose, setPurpose] = useState('');
    const [type, setType] = useState('debit'); 
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('GPay');
    
    useEffect(() => {
        if (editTx && isOpen) {
            setAmount(editTx.amount || '');
            setPurpose(editTx.purpose || '');
            setType(editTx.type || 'debit');
            setCategory(editTx.category || '');
            setDescription(editTx.description || '');
            setPaymentMethod(editTx.payment_method || 'GPay');
        } else if (isOpen) {
            setAmount('');
            setPurpose('');
            setType('debit');
            setCategory('');
            setDescription('');
            setPaymentMethod('GPay');
        }
    }, [editTx, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!amount || !purpose) return;

        const dateObj = new Date();
        const dateStr = dateObj.toLocaleDateString('en-GB'); // dd/mm/yyyy
        const timeStr = dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        const newTx = {
            amount: amount,
            purpose: purpose,
            type: type,
            date: editTx ? editTx.date : dateStr,
            time: editTx ? editTx.time : timeStr,
            category: category || 'General',
            payment_method: paymentMethod,
            description: description
        };

        try {
            if (editTx) {
                const txRef = ref(database, 'expense_data_history/' + editTx.id);
                await update(txRef, newTx);
            } else {
                const expenseRef = ref(database, 'expense_data_history');
                await push(expenseRef, newTx);
            }
            
            // Reset and close
            setAmount('');
            setPurpose('');
            setType('debit');
            setCategory('');
            setDescription('');
            setPaymentMethod('GPay');
            onClose();

            // Show Toast Notification
            Swal.fire({
                title: editTx ? 'Transaction Updated!' : 'Transaction Added!',
                text: `${type === 'credit' ? '+' : '-'}₹${amount} for ${purpose}`,
                icon: 'success',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                customClass: {
                    popup: 'rounded-xl shadow-lg border border-gray-100',
                }
            });
        } catch (error) {
            console.error("Error adding transaction: ", error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to save transaction',
                icon: 'error',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-scrim/40 backdrop-blur-sm transition-opacity" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
            <div className="bg-surface-container-lowest w-full max-w-md rounded-xl shadow-2xl flex flex-col overflow-hidden border border-outline-variant/30" style={{ backgroundColor: 'white' }}>
                
                <div className="flex items-center justify-between px-space-lg py-space-md border-b border-outline-variant/30 bg-surface-container-low" style={{ padding: '1rem' }}>
                    <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2 text-xl font-bold">
                        <span className="material-symbols-outlined text-secondary">{editTx ? 'edit' : 'add_circle'}</span>
                        {editTx ? 'Edit Transaction' : 'Quick Add Transaction'}
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors">
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-space-lg flex flex-col gap-space-lg" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Amount Input */}
                    <div className="flex flex-col gap-1 relative">
                        <label className="font-label-sm text-label-sm uppercase text-outline tracking-wider font-semibold text-sm">Amount (₹)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-numeric-metric" style={{ position: 'absolute', left: '10px', top: '10px' }}>₹</span>
                            <input 
                                type="number" 
                                required
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full h-14 pl-10 pr-4 bg-surface rounded-lg border border-outline-variant/60 text-on-surface font-numeric-metric text-headline-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                                placeholder="0.00"
                                style={{ width: '100%', height: '40px', paddingLeft: '30px', border: '1px solid #ccc', borderRadius: '4px' }}
                            />
                        </div>
                    </div>

                    {/* Transaction Type Toggle */}
                    <div className="flex bg-surface-container rounded-lg p-1 w-full gap-1" style={{ display: 'flex', gap: '5px' }}>
                        <button 
                            type="button" 
                            onClick={() => setType('debit')}
                            className={`flex-1 py-2 font-body-md font-semibold rounded-md transition-colors ${type === 'debit' ? 'bg-error text-on-error shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'}`}
                            style={{ flex: 1, padding: '10px', borderRadius: '4px', border: 'none', backgroundColor: type === 'debit' ? '#ffebee' : '#f5f5f5', color: type === 'debit' ? 'red' : 'black', cursor: 'pointer' }}
                        >
                            Expense (- Debit)
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setType('credit')}
                            className={`flex-1 py-2 font-body-md font-semibold rounded-md transition-colors ${type === 'credit' ? 'bg-on-tertiary-container text-on-error shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'}`}
                            style={{ flex: 1, padding: '10px', borderRadius: '4px', border: 'none', backgroundColor: type === 'credit' ? '#e8f5e9' : '#f5f5f5', color: type === 'credit' ? 'green' : 'black', cursor: 'pointer' }}
                        >
                            Income (+ Credit)
                        </button>
                    </div>

                    {/* Details Grid */}
                    <div className="flex flex-col gap-space-md" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div className="flex flex-col gap-1">
                            <label className="font-label-sm text-label-sm uppercase text-outline tracking-wider font-semibold text-sm">Purpose / Merchant</label>
                            <input 
                                type="text" 
                                required
                                value={purpose}
                                onChange={(e) => setPurpose(e.target.value)}
                                className="w-full h-10 px-3 bg-surface rounded border border-outline-variant/60 text-on-surface font-body-md focus:outline-none focus:border-secondary transition-colors"
                                placeholder="e.g. Amazon, Salary, Grocery"
                                style={{ width: '100%', height: '40px', padding: '0 10px', border: '1px solid #ccc', borderRadius: '4px' }}
                            />
                        </div>
                        
                        <div className="flex flex-col gap-1">
                            <label className="font-label-sm text-label-sm uppercase text-outline tracking-wider font-semibold text-sm">Category (Optional)</label>
                            <select 
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full h-10 px-3 bg-surface rounded border border-outline-variant/60 text-on-surface font-body-md focus:outline-none focus:border-secondary transition-colors"
                                style={{ width: '100%', height: '40px', padding: '0 10px', border: '1px solid #ccc', borderRadius: '4px' }}
                            >
                                <option value="">General</option>
                                <option value="Food">Food & Dining</option>
                                <option value="Housing">Housing</option>
                                <option value="Transport">Transportation</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Salary">Salary / Income</option>
                            </select>
                        </div>
                        
                        <div className="flex flex-col gap-1">
                            <label className="font-label-sm text-label-sm uppercase text-outline tracking-wider font-semibold text-sm">Payment Method</label>
                            <select 
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-full h-10 px-3 bg-surface rounded border border-outline-variant/60 text-on-surface font-body-md focus:outline-none focus:border-secondary transition-colors"
                                style={{ width: '100%', height: '40px', padding: '0 10px', border: '1px solid #ccc', borderRadius: '4px' }}
                            >
                                <option value="GPay">GPay</option>
                                <option value="PhonePe">PhonePe</option>
                                <option value="Cash">Cash</option>
                                <option value="Credit Card">Credit Card</option>
                                <option value="Debit Card">Debit Card</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="font-label-sm text-label-sm uppercase text-outline tracking-wider font-semibold text-sm">Description (Optional)</label>
                            <input 
                                type="text" 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full h-10 px-3 bg-surface rounded border border-outline-variant/60 text-on-surface font-body-md focus:outline-none focus:border-secondary transition-colors"
                                placeholder="Add more details..."
                                style={{ width: '100%', height: '40px', padding: '0 10px', border: '1px solid #ccc', borderRadius: '4px' }}
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-space-sm pt-space-xs mt-space-sm border-t border-outline-variant/30" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #eee' }}>
                        <button type="button" onClick={onClose} className="px-4 h-10 rounded font-body-md font-medium text-on-surface hover:bg-surface-container transition-colors" style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', backgroundColor: '#f5f5f5', cursor: 'pointer' }}>
                            Cancel
                        </button>
                        <button type="submit" className="px-6 h-10 rounded bg-secondary text-on-secondary font-body-md font-semibold shadow-sm hover:bg-on-secondary-fixed-variant transition-colors flex items-center gap-2" style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', backgroundColor: 'blue', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span className="material-symbols-outlined text-[18px]">save</span>
                            {editTx ? 'Update Transaction' : 'Save Transaction'}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default QuickAddModal;
