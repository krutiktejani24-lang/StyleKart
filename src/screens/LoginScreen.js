import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context';
import { Button, Field } from '../components';
import { colors, fonts } from '../theme';

export default function LoginScreen({ navigation }) {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    if (!email || !password) return setError('Enter your email and password.');
    const err = login(email, password);
    if (err) setError(err);
  };

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={s.wrap}>
        <Text style={s.logo}>StyleKart</Text>
        <Text style={s.title}>Log in to continue shopping</Text>
        {!!error && <Text style={s.error}>{error}</Text>}
        <Field placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />
        <Field placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
        <Button title="Log in" onPress={submit} />
        <Text style={s.hint}>Demo: demo@shop.com / 123456</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={s.link}>New here? Create an account</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  wrap: { flex: 1, justifyContent: 'center', padding: 24 },
  logo: { fontFamily: fonts.serif, fontSize: 36, fontWeight: '900', color: colors.accent, marginBottom: 6 },
  title: { fontSize: 16, color: colors.muted, marginBottom: 24 },
  error: { color: colors.sale, marginBottom: 12 },
  hint: { color: colors.muted, textAlign: 'center', marginTop: 14, fontSize: 12 },
  link: { color: colors.accent, textAlign: 'center', marginTop: 18, fontWeight: '600' },
});
