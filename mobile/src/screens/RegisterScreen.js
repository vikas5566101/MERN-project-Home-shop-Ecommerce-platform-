import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { registerAPI } from '../api/auth';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      await registerAPI(name, email, password);
      // Backend probably sends an OTP email
      Alert.alert('Success', 'OTP sent to your email');
      navigation.navigate('VerifyOTP', { email });
    } catch (error) {
      console.error(error);
      Alert.alert('Registration Failed', error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center p-6 bg-white">
      <Text className="text-3xl font-bold text-center text-blue-600 mb-8">Register</Text>

      <TextInput
        className="bg-gray-100 p-4 rounded-lg mb-4 text-gray-800"
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      
      <TextInput
        className="bg-gray-100 p-4 rounded-lg mb-4 text-gray-800"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TextInput
        className="bg-gray-100 p-4 rounded-lg mb-6 text-gray-800"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity 
        className="bg-blue-600 p-4 rounded-lg items-center"
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-bold text-lg">Sign Up</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        className="mt-6 items-center"
        onPress={() => navigation.goBack()}
      >
        <Text className="text-blue-500">Already have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}
