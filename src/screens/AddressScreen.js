import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useApp } from '../context';
import { Button, Field } from '../components';
import { colors } from '../theme';

export default function AddressScreen() {
  const { address, user, saveAddress } = useApp();
  const [a, setA] = useState(address || { name: user?.name || '', phone: '', line: '', city: '', state: '', pincode: '' });
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const set = (k) => (v) => { setA({ ...a, [k]: v }); setMsg(''); };

  const save = () => {
    if (!a.name.trim() || !a.line.trim() || !a.city.trim() || !a.state.trim()) return setErr('Please fill in all fields.');
    if (!/^\d{10}$/.test(a.phone)) return setErr('Enter a valid 10-digit mobile number.');
    if (!/^\d{6}$/.test(a.pincode)) return setErr('Enter a valid 6-digit pincode.');
    setErr('');
    saveAddress(a);
    setMsg('Address saved. It will be used at checkout.');
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
      <Text style={s.hint}>{address ? 'Your saved delivery address' : 'Add a delivery address'}</Text>
      <Field placeholder="Full name" autoCapitalize="words" value={a.name} onChangeText={set('name')} />
      <Field placeholder="Mobile number (10 digits)" keyboardType="number-pad" maxLength={10} value={a.phone} onChangeText={set('phone')} />
      <Field placeholder="House no., street, area" autoCapitalize="sentences" value={a.line} onChangeText={set('line')} />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1 }}><Field placeholder="City" autoCapitalize="words" value={a.city} onChangeText={set('city')} /></View>
        <View style={{ flex: 1 }}><Field placeholder="State" autoCapitalize="words" value={a.state} onChangeText={set('state')} /></View>
      </View>
      <Field placeholder="Pincode (6 digits)" keyboardType="number-pad" maxLength={6} value={a.pincode} onChangeText={set('pincode')} />
      {!!err && <Text style={s.err}>{err}</Text>}
      {!!msg && <Text style={s.ok}>{msg}</Text>}
      <Button title="Save address" onPress={save} style={{ marginTop: 6 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  hint: { color: colors.muted, marginBottom: 14 },
  err: { color: colors.sale, marginBottom: 10, fontWeight: '600' },
  ok: { color: '#2E7D32', marginBottom: 10, fontWeight: '600' },
});
