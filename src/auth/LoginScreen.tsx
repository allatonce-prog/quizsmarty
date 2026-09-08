import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { authStyles } from './AuthScreen.styles';
import { Sparkles } from 'lucide-react-native';

export const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { loginEmail, loginAnonymous, loading } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Required', 'Please enter email and password.');
      return;
    }
    try {
      await loginEmail(email.trim(), password);
    } catch (e: any) {
      Alert.alert('Login Failed', e.message || 'Check credentials and try again.');
    }
  };

  const handleGuestLogin = async () => {
    try {
      await loginAnonymous();
    } catch (e: any) {
      Alert.alert('Error', 'Failed to continue as Guest.');
    }
  };

  return (
    <View style={authStyles.container}>
      <View style={authStyles.logoSection}>
        <View style={authStyles.logoIconBox}>
          <Sparkles size={36} color="#818CF8" />
        </View>
        <Text style={authStyles.appName}>QuizSmarty AI</Text>
        <Text style={authStyles.appTagline}>Smart AI Quiz Generator & Study Companion</Text>
      </View>

      <View style={authStyles.card}>
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

        <TouchableOpacity style={authStyles.primaryBtn} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={authStyles.primaryBtnText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <View style={authStyles.dividerRow}>
          <View style={authStyles.dividerLine} />
          <Text style={authStyles.dividerText}>OR</Text>
          <View style={authStyles.dividerLine} />
        </View>

        <TouchableOpacity style={authStyles.guestBtn} onPress={handleGuestLogin} disabled={loading}>
          <Text style={authStyles.guestBtnText}>Continue as Guest Student</Text>
        </TouchableOpacity>

        <View style={authStyles.switchRow}>
          <Text style={authStyles.switchText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={authStyles.switchLink}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
