import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useApp } from '../context';
import { Button, Field } from '../components';
import { inr } from '../data';
import { colors } from '../theme';

const DELIVERY = [
  { id: 'standard', label: 'Standard delivery', eta: '4-6 days', days: 5, fee: (sub) => (sub >= 999 ? 0 : 49) },
  { id: 'express', label: 'Express delivery', eta: '1-2 days', days: 2, fee: () => 99 },
];
const COUPONS = { STYLE10: 0.1 }; // 10% off

export default function CheckoutScreen({ navigation }) {
  const { cart, cartTotal, cartMrp, address, user, placeOrder } = useApp();
  const [a, setA] = useState(address || { name: user?.name || '', phone: '', line: '', city: '', state: '', pincode: '' });
  const set = (k) => (v) => setA({ ...a, [k]: v });
  const [deliveryId, setDeliveryId] = useState('standard');
  const [code, setCode] = useState('');
  const [coupon, setCoupon] = useState(null);
  const [couponMsg, setCouponMsg] = useState('');
  const [error, setError] = useState('');

  const delivery = DELIVERY.find((d) => d.id === deliveryId);
  const discountAmt = coupon ? Math.round(cartTotal * COUPONS[coupon]) : 0;
  const fee = delivery.fee(cartTotal);
  const total = cartTotal - discountAmt + fee;

  const applyCoupon = () => {
    const c = code.trim().toUpperCase();
    if (COUPONS[c]) { setCoupon(c); setCouponMsg(`${c} applied. You get ${COUPONS[c] * 100}% off.`); }
    else { setCoupon(null); setCouponMsg('This coupon code is not valid.'); }
  };

  const submit = () => {
    if (cart.length === 0) return setError('Your bag is empty.');
    if (!a.name.trim() || !a.line.trim() || !a.city.trim() || !a.state.trim()) return setError('Please fill in all address fields.');
    if (!/^\d{10}$/.test(a.phone)) return setError('Enter a valid 10-digit mobile number.');
    if (!/^\d{6}$/.test(a.pincode)) return setError('Enter a valid 6-digit pincode.');
    setError('');
    const order = placeOrder({
      address: a,
      delivery: { id: delivery.id, label: delivery.label, eta: delivery.eta, days: delivery.days },
      coupon,
      totals: { subtotal: cartTotal, mrp: cartMrp, discount: discountAmt, fee, total },
    });
    navigation.replace('OrderSuccess', { order });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={s.wrap} keyboardShouldPersistTaps="handled">
        <Text style={s.section}>1. Delivery address</Text>
        <Field placeholder="Full name" autoCapitalize="words" value={a.name} onChangeText={set('name')} />
        <Field placeholder="Mobile number (10 digits)" keyboardType="number-pad" maxLength={10} value={a.phone} onChangeText={set('phone')} />
        <Field placeholder="House no., street, area" autoCapitalize="sentences" value={a.line} onChangeText={set('line')} />
        <View style={s.two}>
          <View style={{ flex: 1 }}><Field placeholder="City" autoCapitalize="words" value={a.city} onChangeText={set('city')} /></View>
          <View style={{ flex: 1 }}><Field placeholder="State" autoCapitalize="words" value={a.state} onChangeText={set('state')} /></View>
        </View>
        <Field placeholder="Pincode (6 digits)" keyboardType="number-pad" maxLength={6} value={a.pincode} onChangeText={set('pincode')} />

        <Text style={s.section}>2. Delivery option</Text>
        {DELIVERY.map((d) => {
          const f = d.fee(cartTotal);
          return (
            <TouchableOpacity key={d.id} style={[s.option, deliveryId === d.id && s.optionOn]} onPress={() => setDeliveryId(d.id)}>
              <Ionicons name={deliveryId === d.id ? 'radio-button-on' : 'radio-button-off'} size={20} color={colors.accent} />
              <View style={{ flex: 1 }}>
                <Text style={s.optTitle}>{d.label}</Text>
                <Text style={s.optSub}>Arrives in {d.eta}</Text>
              </View>
              <Text style={s.optFee}>{f === 0 ? 'FREE' : inr(f)}</Text>
            </TouchableOpacity>
          );
        })}

        <Text style={s.section}>3. Coupon</Text>
        <View style={s.two}>
          <TextInput style={s.coupon} placeholder="Enter code (try STYLE10)" placeholderTextColor={colors.muted} autoCapitalize="characters" value={code} onChangeText={setCode} />
          <TouchableOpacity style={s.applyBtn} onPress={applyCoupon}><Text style={s.applyTxt}>Apply</Text></TouchableOpacity>
        </View>
        {!!couponMsg && <Text style={[s.couponMsg, { color: coupon ? colors.accent : colors.sale }]}>{couponMsg}</Text>}

        <Text style={s.section}>4. Payment</Text>
        <View style={[s.option, s.optionOn]}>
          <Ionicons name="cash-outline" size={22} color={colors.accent} />
          <View style={{ flex: 1 }}>
            <Text style={s.optTitle}>Cash on Delivery</Text>
            <Text style={s.optSub}>Pay when your order arrives. Online payment is coming soon.</Text>
          </View>
        </View>

        <Text style={s.section}>Order summary</Text>
        <View style={s.summary}>
          {cart.map((x) => (
            <View key={x.key} style={s.line}>
              <Text style={s.lineName} numberOfLines={1}>{x.qty} x {x.product.name} ({x.size})</Text>
              <Text style={s.lineVal}>{inr(x.product.price * x.qty)}</Text>
            </View>
          ))}
          <View style={s.divider} />
          <View style={s.line}><Text style={s.lineName}>Bag subtotal</Text><Text style={s.lineVal}>{inr(cartTotal)}</Text></View>
          <View style={s.line}><Text style={s.lineName}>You save on MRP</Text><Text style={[s.lineVal, { color: colors.accent }]}>{inr(cartMrp - cartTotal)}</Text></View>
          {discountAmt > 0 && <View style={s.line}><Text style={s.lineName}>Coupon ({coupon})</Text><Text style={[s.lineVal, { color: colors.accent }]}>- {inr(discountAmt)}</Text></View>}
          <View style={s.line}><Text style={s.lineName}>Delivery</Text><Text style={s.lineVal}>{fee === 0 ? 'FREE' : inr(fee)}</Text></View>
          <View style={s.divider} />
          <View style={s.line}><Text style={s.totalLabel}>Total to pay</Text><Text style={s.total}>{inr(total)}</Text></View>
        </View>
        {!!error && <Text style={s.error}>{error}</Text>}
      </ScrollView>
      <SafeAreaView edges={['bottom']} style={s.bar}>
        <Button title={`Place order  |  ${inr(total)}`} onPress={submit} style={{ flex: 1 }} />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  wrap: { padding: 16, paddingBottom: 32 },
  section: { fontSize: 16, fontWeight: '800', color: colors.ink, marginTop: 14, marginBottom: 10 },
  two: { flexDirection: 'row', gap: 10 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: colors.line, borderRadius: 6, padding: 14, marginBottom: 10 },
  optionOn: { borderColor: colors.accent, backgroundColor: '#F6EFE3' },
  optTitle: { fontWeight: '700', color: colors.ink },
  optSub: { color: colors.muted, fontSize: 12, marginTop: 2 },
  optFee: { fontWeight: '800', color: colors.ink },
  coupon: { flex: 1, borderWidth: 1, borderColor: colors.line, borderRadius: 4, paddingHorizontal: 14, paddingVertical: 12, color: colors.ink },
  applyBtn: { backgroundColor: colors.ink, paddingHorizontal: 20, justifyContent: 'center', borderRadius: 4 },
  applyTxt: { color: '#fff', fontWeight: '700' },
  couponMsg: { marginTop: 8, fontSize: 13 },
  summary: { backgroundColor: colors.surface, borderRadius: 6, padding: 14, gap: 8 },
  line: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  lineName: { flex: 1, color: colors.ink },
  lineVal: { fontWeight: '700', color: colors.ink },
  divider: { height: 1, backgroundColor: colors.line, marginVertical: 4 },
  totalLabel: { fontSize: 16, fontWeight: '800', color: colors.ink },
  total: { fontSize: 18, fontWeight: '900', color: colors.ink },
  error: { color: colors.sale, marginTop: 14, fontWeight: '600' },
  bar: { padding: 16, borderTopWidth: 1, borderColor: colors.line, flexDirection: 'row', backgroundColor: colors.bg },
});
