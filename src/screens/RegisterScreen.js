import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context';
import { Button, Field } from '../components';
import { colors, fonts } from '../theme';

export default function RegisterScreen({ navigation }) {
  const { register } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    if (!name || !email || !password) return setError('Fill in all the fields.');
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Enter a valid email address.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    if (password !== confirm) return setError('Passwords do not match.');
    const err = register(name, email, password);
    if (err) setError(err);
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.wrap} keyboardShouldPersistTaps="handled">
        <Text style={s.logo}>Create account</Text>
        <Text style={s.title}>Sign up to save your cart and orders</Text>
        {!!error && <Text style={s.error}>{error}</Text>}
        <Field placeholder="Full name" autoCapitalize="words" value={name} onChangeText={setName} />
        <Field placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />
        <Field placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
        <Field placeholder="Confirm password" secureTextEntry value={confirm} onChangeText={setConfirm} />
        <Button title="Create account" onPress={submit} />
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={s.link}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  wrap: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logo: { fontFamily: fonts.serif, fontSize: 30, fontWeight: '900', color: colors.ink, marginBottom: 6 },
  title: { fontSize: 15, color: colors.muted, marginBottom: 24 },
  error: { color: colors.sale, marginBottom: 12 },
  link: { color: colors.accent, textAlign: 'center', marginTop: 18, fontWeight: '600' },
});
