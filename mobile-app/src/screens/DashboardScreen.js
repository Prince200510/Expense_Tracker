import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { ref, onValue } from 'firebase/database';
import { database } from '../services/firebase';
import { sendLocalNotification } from '../services/NotificationService';
import QuickAddModal from './QuickAddModal';

export default function DashboardScreen() {
    const [transactions, setTransactions] = useState([]);
    const [surplusNum, setSurplusNum] = useState(0);
    const [inflowNum, setInflowNum] = useState(0);
    const [outflowNum, setOutflowNum] = useState(0);
    const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

    useEffect(() => {
        const expenseRef = ref(database, 'expense_data_history');
        onValue(expenseRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const txList = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                // Sort by date (assuming id is roughly chronological, or need proper date parsing)
                txList.reverse();
                setTransactions(txList);

                // Calculate balances
                let totalIn = 0;
                let totalOut = 0;
                txList.forEach(tx => {
                    const amount = Number(tx.amount || 0);
                    if (tx.type === 'credit') {
                        totalIn += amount;
                    } else {
                        totalOut += amount;
                    }
                });
                
                const newSurplus = totalIn - totalOut;
                
                // Balance risk check
                if (surplusNum > 1000 && newSurplus < 1000) {
                    sendLocalNotification('Balance Risk ⚠️', 'Your balance has dropped below ₹1000!');
                }

                setInflowNum(totalIn);
                setOutflowNum(totalOut);
                setSurplusNum(newSurplus);
            }
        });
    }, [surplusNum]);

    const balance = surplusNum.toLocaleString('en-IN');
    const income = inflowNum.toLocaleString('en-IN');
    const expenses = outflowNum.toLocaleString('en-IN');

    return (
        <View className="flex-1 bg-[#F8F9FA]">
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }} bounces={false}>
                {/* HERO SECTION */}
                <LinearGradient
                    colors={['#A88BFA', '#8B5CF6', '#7C3AED']}
                    className="w-full rounded-b-[40px] px-6 pt-16 pb-32 relative overflow-hidden"
                >
                    <View className="flex-row items-center justify-between mt-8 mb-8 z-10">
                        <View className="flex-1" />
                        <TouchableOpacity className="flex-row items-center bg-white/20 px-4 py-2 rounded-full border border-white/20">
                            <Text className="text-white font-medium mr-1">This Month</Text>
                            <MaterialIcons name="expand-more" size={16} color="white" />
                        </TouchableOpacity>
                        <View className="flex-1 items-end">
                            <TouchableOpacity className="w-10 h-10 rounded-full bg-white/20 border border-white/20 items-center justify-center">
                                <MaterialIcons name="notifications" size={20} color="white" />
                                <View className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-400 border border-purple-500" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="items-center mt-2 z-10">
                        <Text className="text-white/80 font-medium tracking-widest uppercase text-xs mb-1">Current Balance</Text>
                        <View className="flex-row items-start">
                            <Text className="text-white text-3xl font-light mt-1">₹</Text>
                            <Text className="text-white text-5xl font-bold tracking-tighter">{balance}</Text>
                        </View>
                        <View className="flex-row items-center bg-white/20 px-3 py-1 rounded-full mt-4">
                            <MaterialIcons name="trending-up" size={14} color="white" />
                            <Text className="text-white/90 text-xs font-medium ml-1">Solid surplus this period</Text>
                        </View>
                    </View>
                </LinearGradient>

                {/* OVERLAPPING CARD */}
                <View className="px-5 -mt-20 z-20">
                    <View className="bg-white rounded-3xl p-5 shadow-lg border border-gray-100">
                        <View className="flex-row items-center justify-between mb-4">
                            <View className="flex-row items-center">
                                <Text className="text-gray-800 font-bold text-lg mr-1">Your Money</Text>
                                <MaterialIcons name="info" size={16} color="#9CA3AF" />
                            </View>
                            <TouchableOpacity className="flex-row items-center">
                                <Text className="text-gray-400 font-medium text-sm">Details</Text>
                                <MaterialIcons name="chevron-right" size={16} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row justify-between">
                            <View className="flex-1 bg-blue-50 border border-blue-100 rounded-2xl p-4 mr-2">
                                <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mb-3">
                                    <MaterialIcons name="account-balance-wallet" size={20} color="#3B82F6" />
                                </View>
                                <Text className="text-gray-500 text-xs font-medium">Income</Text>
                                <Text className="text-gray-900 font-bold text-lg mt-1">₹{income}</Text>
                            </View>
                            
                            <View className="flex-1 bg-red-50 border border-red-100 rounded-2xl p-4 ml-2">
                                <View className="w-10 h-10 rounded-full bg-red-100 items-center justify-center mb-3">
                                    <MaterialIcons name="account-balance" size={20} color="#EF4444" />
                                </View>
                                <Text className="text-gray-500 text-xs font-medium">Expenses</Text>
                                <Text className="text-gray-900 font-bold text-lg mt-1">₹{expenses}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* TRANSACTIONS */}
                <View className="px-5 mt-8">
                    <Text className="text-gray-800 font-bold text-lg mb-4">Recent Activity</Text>
                    {transactions.slice(0, 10).map((tx, idx) => {
                        const isIncome = tx.type === 'credit';
                        return (
                            <View key={idx} className="flex-row items-center justify-between bg-white p-4 rounded-2xl mb-3 shadow-sm border border-gray-100">
                                <View className="flex-row items-center">
                                    <View className={`w-12 h-12 rounded-xl items-center justify-center ${isIncome ? 'bg-blue-50' : 'bg-red-50'}`}>
                                        <MaterialIcons name={isIncome ? "payments" : "shopping-bag"} size={24} color={isIncome ? "#3B82F6" : "#EF4444"} />
                                    </View>
                                    <View className="ml-3">
                                        <Text className="text-gray-900 font-bold text-base">{tx.description || tx.purpose || 'Transaction'}</Text>
                                        <View className="flex-row items-center mt-1">
                                            <MaterialIcons name="label" size={14} color="#9CA3AF" />
                                            <Text className="text-gray-500 text-xs ml-1">{tx.category || 'General'}</Text>
                                        </View>
                                    </View>
                                </View>
                                <Text className={`font-bold text-base ${isIncome ? 'text-green-500' : 'text-red-500'}`}>
                                    {isIncome ? '+' : '-'}₹{Number(tx.amount || 0).toLocaleString('en-IN')}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>

            {/* FLOATING ACTION BUTTON */}
            <TouchableOpacity 
                className="absolute bottom-8 right-6 w-14 h-14 bg-purple-600 rounded-full items-center justify-center shadow-lg"
                onPress={() => setIsQuickAddOpen(true)}
            >
                <MaterialIcons name="add" size={30} color="white" />
            </TouchableOpacity>

            <QuickAddModal 
                isOpen={isQuickAddOpen} 
                onClose={() => setIsQuickAddOpen(false)} 
            />
        </View>
    );
}
