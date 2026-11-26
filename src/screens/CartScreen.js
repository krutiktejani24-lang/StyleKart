import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context';
import { Button, ProductImage } from '../components';
import { inr } from '../data';
import { colors } from '../theme';

export default function CartScreen({ navigation }) {
  const { cart, changeQty, removeFromCart, cartTotal, cartMrp, cartCount } = useApp();

  if (cart.length === 0) {
    return (
      <SafeAreaView style={[s.safe, s.center]}>
        <Text style={s.emptyTitle}>Your bag is empty</Text>
        <Text style={s.emptySub}>Add something you like and it will show up here.</Text>
        <Button title="Start shopping" onPress={() => navigation.navigate('Main', { screen: 'Shop' })} style={{ marginTop: 20, paddingHorizontal: 32 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <FlatList
        data={cart}
        keyExtractor={(x) => x.key}
        contentContainerStyle={{ padding: 16, gap: 16 }}
        renderItem={({ item }) => (
          <View style={s.item}>
            <ProductImage uri={item.product.image} type={item.product.type} style={s.img} />
            <View style={{ flex: 1 }}>
              <Text style={s.brand}>{item.product.brand}</Text>
              <Text style={s.name} numberOfLines={2}>{item.product.name}</Text>
              <Text style={s.size}>Size: {item.size}{item.color ? `  |  ${item.color}` : ''}</Text>
              <Text style={s.price}>{inr(item.product.price * item.qty)}</Text>
              <View style={s.qtyRow}>
                <TouchableOpacity style={s.qtyBtn} onPress={() => changeQty(item.key, -1)}><Text style={s.qtyTxt}>−</Text></TouchableOpacity>
                <Text style={s.qty}>{item.qty}</Text>
                <TouchableOpacity style={s.qtyBtn} onPress={() => changeQty(item.key, 1)}><Text style={s.qtyTxt}>+</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => removeFromCart(item.key)} style={{ marginLeft: 'auto' }}>
                  <Text style={s.remove}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
      <View style={s.footer}>
        <View style={s.totalRow}><Text style={s.label}>You save</Text><Text style={s.save}>{inr(cartMrp - cartTotal)}</Text></View>
        <View style={s.totalRow}><Text style={s.totalLabel}>Subtotal</Text><Text style={s.total}>{inr(cartTotal)}</Text></View>
        <Button title="Proceed to checkout" onPress={() => navigation.navigate('Checkout')} />
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  center: { alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyTitle: { fontSize: 22, fontWeight: '800', color: colors.ink },
  emptySub: { color: colors.muted, marginTop: 6, textAlign: 'center' },
  heading: { fontSize: 22, fontWeight: '800', color: colors.ink, padding: 16, paddingBottom: 0 },
  item: { flexDirection: 'row', gap: 12 },
  img: { width: 90, height: 118, backgroundColor: colors.surface },
  brand: { fontWeight: '800', color: colors.ink },
  name: { color: colors.muted, fontSize: 13, marginTop: 2 },
  size: { color: colors.ink, fontSize: 12, marginTop: 4, fontWeight: '600' },
  price: { fontWeight: '800', marginTop: 6, color: colors.ink },
  qtyRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 10 },
  qtyBtn: { width: 30, height: 30, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center', borderRadius: 4 },
  qtyTxt: { fontSize: 18, color: colors.ink },
  qty: { minWidth: 20, textAlign: 'center', fontWeight: '700' },
  remove: { color: colors.sale, fontWeight: '600' },
  footer: { padding: 16, borderTopWidth: 1, borderColor: colors.line, gap: 10 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { color: colors.muted },
  save: { color: colors.accent, fontWeight: '700' },
  totalLabel: { fontSize: 16, color: colors.ink, fontWeight: '600' },
  total: { fontSize: 20, fontWeight: '900', color: colors.ink },
});
