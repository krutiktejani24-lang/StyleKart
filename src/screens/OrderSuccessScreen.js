import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Button } from '../components';
import { inr } from '../data';
import { colors } from '../theme';

export default function OrderSuccessScreen({ route, navigation }) {
  const { order } = route.params;
  const eta = new Date(Date.now() + order.delivery.days * 86400000).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });
  return (
    <SafeAreaView style={s.safe}>
      <View style={s.center}>
        <Ionicons name="checkmark-circle" size={96} color={colors.accent} />
        <Text style={s.title}>Order placed!</Text>
        <Text style={s.sub}>Thank you, {order.address.name}. Your order is confirmed.</Text>
        <View style={s.card}>
          <Row k="Order ID" v={order.id} />
          <Row k="Amount to pay" v={`${inr(order.totals.total)} (Cash on Delivery)`} />
          <Row k="Expected delivery" v={eta} />
          <Row k="Delivering to" v={`${order.address.line}, ${order.address.city} - ${order.address.pincode}`} />
        </View>
      </View>
      <View style={s.actions}>
        <Button title="View my orders" onPress={() => navigation.navigate('Orders')} />
        <Button title="Continue shopping" variant="outline" onPress={() => navigation.navigate('Main', { screen: 'Home' })} />
      </View>
    </SafeAreaView>
  );
}

const Row = ({ k, v }) => (
  <View style={s.row}><Text style={s.k}>{k}</Text><Text style={s.v}>{v}</Text></View>
);

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg, padding: 24 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '900', color: colors.ink, marginTop: 8 },
  sub: { color: colors.muted, textAlign: 'center', marginTop: 6 },
  card: { alignSelf: 'stretch', backgroundColor: colors.surface, borderRadius: 6, padding: 16, marginTop: 24, gap: 12 },
  row: { gap: 2 },
  k: { color: colors.muted, fontSize: 12 },
  v: { color: colors.ink, fontWeight: '700' },
  actions: { gap: 10 },
});
