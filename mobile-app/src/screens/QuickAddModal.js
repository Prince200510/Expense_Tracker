import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ref, push } from 'firebase/database';
import { database } from '../services/firebase';
import { sendLocalNotification } from '../services/NotificationService';

export default function QuickAddModal({ isOpen, onClose }) {
    const [amount, setAmount] = useState('');
    const [purpose, setPurpose] = useState('');
    const [type, setType] = useState('debit');

    const handleSubmit = async () => {
        if (!amount || !purpose) return;

        const dateObj = new Date();
        const dateStr = dateObj.toLocaleDateString('en-GB'); 
        const timeStr = dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        const newTx = {
            amount: amount,
            purpose: purpose,
            type: type,
            date: dateStr,
            time: timeStr,
            category: 'General',
            payment_method: 'GPay',
            description: ''
        };

        try {
            const expenseRef = ref(database, 'expense_data_history');
            await push(expenseRef, newTx);
            
            // Trigger offline local notification instead of sweetalert
            sendLocalNotification(
                'Transaction Added! ✅',
                `${type === 'credit' ? '+' : '-'}₹${amount} for ${purpose}`
            );

            setAmount('');
            setPurpose('');
            onClose();
        } catch (error) {
            console.error("Error adding transaction: ", error);
        }
    };

    return (
        <Modal visible={isOpen} transparent={true} animationType="slide">
            <View className="flex-1 justify-end bg-black/40">
                <View className="bg-white rounded-t-3xl p-6">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-xl font-bold text-gray-800">Quick Add Transaction</Text>
                        <TouchableOpacity onPress={onClose}>
                            <MaterialIcons name="close" size={24} color="#4B5563" />
                        </TouchableOpacity>
                    </View>

                    <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Amount (₹)</Text>
                    <TextInput 
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-2xl font-bold mb-4 text-gray-800"
                        keyboardType="numeric"
                        placeholder="0"
                        value={amount}
                        onChangeText={setAmount}
                    />

                    <View className="flex-row bg-gray-100 p-1 rounded-xl mb-4">
                        <TouchableOpacity 
                            className={`flex-1 py-3 rounded-lg items-center ${type === 'debit' ? 'bg-red-100' : ''}`}
                            onPress={() => setType('debit')}
                        >
                            <Text className={`font-bold ${type === 'debit' ? 'text-red-500' : 'text-gray-500'}`}>Expense</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            className={`flex-1 py-3 rounded-lg items-center ${type === 'credit' ? 'bg-green-100' : ''}`}
                            onPress={() => setType('credit')}
                        >
                            <Text className={`font-bold ${type === 'credit' ? 'text-green-500' : 'text-gray-500'}`}>Income</Text>
                        </TouchableOpacity>
                    </View>

                    <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Purpose</Text>
                    <TextInput 
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base mb-6 text-gray-800"
                        placeholder="e.g. Grocery"
                        value={purpose}
                        onChangeText={setPurpose}
                    />

                    <TouchableOpacity 
                        className="bg-purple-600 rounded-xl py-4 items-center mb-4"
                        onPress={handleSubmit}
                    >
                        <Text className="text-white font-bold text-lg">Save Transaction</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
