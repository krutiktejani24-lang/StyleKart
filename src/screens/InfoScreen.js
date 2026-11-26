import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, fonts, shadow } from '../theme';

const FAQ = [
  ['How do I track my order?', 'Open Profile, then My Orders. Each order shows its status and delivery details.'],
  ['Can I cancel an order?', 'Yes. Open My Orders and tap Cancel on an order that is still in Placed status.'],
  ['What is the return policy?', 'You can return most products within 7 days of delivery for a refund or exchange.'],
  ['Is delivery free?', 'Standard delivery is free on orders above \u20B9999. Express delivery costs \u20B999.'],
];

export default function InfoScreen({ route }) {
  const { kind } = route.params;
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16, gap: 12 }}>
      {kind === 'payments' && <Payments />}
      {kind === 'settings' && <Settings />}
      {kind === 'help' && <Help />}
    </ScrollView>
  );
}

const Payments = () => (
  <>
    <View style={s.card}>
      <Ionicons name="cash-outline" size={26} color={colors.accent} />
      <View style={{ flex: 1 }}>
        <Text style={s.title}>Cash on Delivery</Text>
        <Text style={s.sub}>Pay in cash when your order arrives.</Text>
      </View>
      <Text style={s.on}>Available</Text>
    </View>
    {[['card-outline', 'Credit / Debit Card'], ['phone-portrait-outline', 'UPI'], ['business-outline', 'Net Banking']].map(([icon, label]) => (
      <View key={label} style={[s.card, { opacity: 0.6 }]}>
        <Ionicons name={icon} size={26} color={colors.muted} />
        <View style={{ flex: 1 }}><Text style={s.title}>{label}</Text><Text style={s.sub}>Online payment will be added soon.</Text></View>
        <Text style={s.soon}>Coming soon</Text>
      </View>
    ))}
  </>
);

const Settings = () => {
  const [orders, setOrders] = useState(true);
  const [offers, setOffers] = useState(true);
  return (
    <>
      <View style={s.card}>
        <View style={{ flex: 1 }}><Text style={s.title}>Order updates</Text><Text style={s.sub}>Get notified about your orders.</Text></View>
        <Switch value={orders} onValueChange={setOrders} trackColor={{ true: colors.accent }} />
      </View>
      <View style={s.card}>
        <View style={{ flex: 1 }}><Text style={s.title}>Offers and deals</Text><Text style={s.sub}>Sale alerts and new arrivals.</Text></View>
        <Switch value={offers} onValueChange={setOffers} trackColor={{ true: colors.accent }} />
      </View>
      <View style={s.card}>
        <View style={{ flex: 1 }}><Text style={s.title}>About</Text><Text style={s.sub}>StyleKart, version 1.0.0</Text></View>
      </View>
    </>
  );
};

const Help = () => {
  const [open, setOpen] = useState(0);
  return (
    <>
      <Text style={s.h}>Frequently asked questions</Text>
      {FAQ.map(([q, a], i) => (
        <TouchableOpacity key={q} style={s.faq} activeOpacity={0.8} onPress={() => setOpen(open === i ? -1 : i)}>
          <View style={s.faqHead}>
            <Text style={[s.title, { flex: 1 }]}>{q}</Text>
            <Ionicons name={open === i ? 'chevron-up' : 'chevron-down'} size={18} color={colors.muted} />
          </View>
          {open === i && <Text style={[s.sub, { marginTop: 8 }]}>{a}</Text>}
        </TouchableOpacity>
      ))}
      <View style={s.card}>
        <Ionicons name="mail-outline" size={24} color={colors.accent} />
        <View style={{ flex: 1 }}><Text style={s.title}>Contact support</Text><Text style={s.sub}>support@stylekart.app</Text></View>
      </View>
    </>
  );
};

const s = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.card, borderRadius: 16, padding: 16, ...shadow },
  title: { fontWeight: '700', color: colors.ink, fontSize: 15 },
  sub: { color: colors.muted, fontSize: 13, marginTop: 2, lineHeight: 19 },
  on: { color: '#2E7D32', fontWeight: '800', fontSize: 12 },
  soon: { color: colors.muted, fontWeight: '700', fontSize: 11 },
  h: { fontFamily: fonts.serif, fontSize: 20, fontWeight: '700', color: colors.ink, marginBottom: 2 },
  faq: { backgroundColor: colors.card, borderRadius: 16, padding: 16, ...shadow },
  faqHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});
