import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useApp } from '../context';
import { Button, ProductImage } from '../components';
import { inr, fmtDate } from '../data';
import { colors } from '../theme';

export default function OrdersScreen({ navigation }) {
  const { orders, cancelOrder } = useApp();

  if (orders.length === 0) {
    return (
      <SafeAreaView style={[s.safe, s.center]}>
        <Ionicons name="receipt-outline" size={48} color={colors.muted} />
        <Text style={s.emptyTitle}>No orders yet</Text>
        <Text style={s.emptySub}>Your placed orders will show up here.</Text>
        <Button title="Start shopping" onPress={() => navigation.navigate('Main', { screen: 'Shop' })} style={{ marginTop: 20, paddingHorizontal: 32 }} />
      </SafeAreaView>
    );
  }

  const confirmCancel = (id) =>
    Alert.alert('Cancel order?', 'This order will be cancelled.', [
      { text: 'Keep order', style: 'cancel' },
      { text: 'Cancel order', style: 'destructive', onPress: () => cancelOrder(id) },
    ]);

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <FlatList
        data={orders}
        keyExtractor={(o) => o.id}
        contentContainerStyle={{ padding: 16, gap: 16 }}
        renderItem={({ item: o }) => {
          const cancelled = o.status === 'Cancelled';
          return (
            <View style={s.card}>
              <View style={s.head}>
                <View>
                  <Text style={s.id}>Order {o.id}</Text>
                  <Text style={s.date}>{fmtDate(o.date)}</Text>
                </View>
                <View style={[s.chip, cancelled && { backgroundColor: '#FBE9E6' }]}>
                  <Text style={[s.chipTxt, cancelled && { color: colors.sale }]}>{o.status}</Text>
                </View>
              </View>
              {o.items.map((x) => (
                <View key={x.key} style={s.item}>
                  <ProductImage uri={x.product.image} type={x.product.type} style={s.img} />
                  <View style={{ flex: 1 }}>
                    <Text style={s.brand}>{x.product.brand}</Text>
                    <Text style={s.name} numberOfLines={1}>{x.product.name}</Text>
                    <Text style={s.meta}>Size {x.size}{x.color ? `  |  ${x.color}` : ''}  |  Qty {x.qty}</Text>
                  </View>
                  <Text style={s.price}>{inr(x.product.price * x.qty)}</Text>
                </View>
              ))}
              <View style={s.foot}>
                <View>
                  <Text style={s.meta}>{o.delivery.label}  |  {o.payment}</Text>
                  <Text style={s.total}>Total {inr(o.totals.total)}</Text>
                </View>
                {!cancelled && (
                  <TouchableOpacity onPress={() => confirmCancel(o.id)}>
                    <Text style={s.cancel}>Cancel</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  center: { alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyTitle: { fontSize: 22, fontWeight: '800', color: colors.ink, marginTop: 12 },
  emptySub: { color: colors.muted, marginTop: 6 },
  heading: { fontSize: 22, fontWeight: '800', color: colors.ink, padding: 16, paddingBottom: 0 },
  card: { borderWidth: 1, borderColor: colors.line, borderRadius: 6, padding: 14, gap: 12 },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  id: { fontWeight: '800', color: colors.ink },
  date: { color: colors.muted, fontSize: 12, marginTop: 2 },
  chip: { backgroundColor: colors.tint, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  chipTxt: { color: colors.accent, fontWeight: '700', fontSize: 12 },
  item: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  img: { width: 52, height: 68, backgroundColor: colors.surface },
  brand: { fontWeight: '800', color: colors.ink },
  name: { color: colors.muted, fontSize: 13 },
  meta: { color: colors.muted, fontSize: 12, marginTop: 2 },
  price: { fontWeight: '700', color: colors.ink },
  foot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', borderTopWidth: 1, borderColor: colors.line, paddingTop: 12 },
  total: { fontWeight: '900', color: colors.ink, marginTop: 4, fontSize: 16 },
  cancel: { color: colors.sale, fontWeight: '700' },
});
