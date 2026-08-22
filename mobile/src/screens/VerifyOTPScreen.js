import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { verifyOtpAPI } from '../api/auth';
import { useDispatch } from 'react-redux';
import { saveToken } from '../api/authStorage';
import { setCredentials } from '../redux/authSlice';

export default function VerifyOTPScreen({ route, navigation }) {
  const { email } = route.params;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleVerify = async () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }
    setLoading(true);
    try {
      const data = await verifyOtpAPI(email, otp);
      await saveToken(data.token);
      dispatch(setCredentials({ user: data.user, token: data.token }));
    } catch (error) {
      console.error(error);
      Alert.alert('Verification Failed', error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center p-6 bg-white">
      <Text className="text-3xl font-bold text-center text-blue-600 mb-4">Verify OTP</Text>
      <Text className="text-center text-gray-500 mb-8">Enter the OTP sent to {email}</Text>

      <TextInput
        className="bg-gray-100 p-4 rounded-lg mb-6 text-gray-800 text-center text-2xl tracking-widest"
        placeholder="------"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        maxLength={6}
      />
      
      <TouchableOpacity 
        className="bg-blue-600 p-4 rounded-lg items-center"
        onPress={handleVerify}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-bold text-lg">Verify & Login</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
