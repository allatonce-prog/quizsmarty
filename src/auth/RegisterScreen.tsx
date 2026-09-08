import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { authStyles } from './AuthScreen.styles';
import { Sparkles } from 'lucide-react-native';

export const RegisterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { registerEmail, loading } = useAuth();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleRegister = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Required', 'Please enter email and password.');
      return;
    }
    try {
      await registerEmail(email.trim(), password, name.trim());
    } catch (e: any) {
      Alert.alert('Registration Failed', e.message || 'Error creating account.');
    }
  };

  return (
    <View style={authStyles.container}>
      <View style={authStyles.logoSection}>
        <View style={authStyles.logoIconBox}>
          <Sparkles size={36} color="#818CF8" />
        </View>
        <Text style={authStyles.appName}>Create Account</Text>
        <Text style={authStyles.appTagline}>Join QuizSmarty AI Student Community</Text>
      </View>

      <View style={authStyles.card}>
        <View style={authStyles.inputGroup}>
          <Text style={authStyles.inputLabel}>FULL NAME</Text>
          <TextInput
            style={authStyles.input}
            value={name}
            onChangeText={setName}
            placeholder="Alex Scholar"
            placeholderTextColor="#64748B"
          />
        </View>

        <View style={authStyles.inputGroup}>
          <Text style={authStyles.inputLabel}>EMAIL ADDRESS</Text>
          <TextInput
            style={authStyles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="student@university.edu"
            placeholderTextColor="#64748B"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={authStyles.inputGroup}>
          <Text style={authStyles.inputLabel}>PASSWORD</Text>
          <TextInput
            style={authStyles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor="#64748B"
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={authStyles.primaryBtn} onPress={handleRegister} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={authStyles.primaryBtnText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <View style={authStyles.switchRow}>
          <Text style={authStyles.switchText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={authStyles.switchLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
