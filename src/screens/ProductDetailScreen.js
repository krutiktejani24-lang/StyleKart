import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useApp } from '../context';
import { PRODUCTS, COLORS, discount, inr } from '../data';
import { Button, ProductImage, Stars, CartButton } from '../components';
import { colors, fonts, shadow } from '../theme';

export default function ProductDetailScreen({ route, navigation }) {
  const { product: p } = route.params;
  const { addToCart, toggleWish, isWished, cart } = useApp();
  const oneSize = p.sizes.length === 1;
  const [size, setSize] = useState(oneSize ? p.sizes[0] : null);
  const [color, setColor] = useState(COLORS[0].name);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');
  const added = size && cart.some((x) => x.key === `${p.id}-${size}-${color}`);
  const wished = isWished(p.id);
  const similar = PRODUCTS.filter((x) => x.type === p.type && x.id !== p.id).slice(0, 8);

  const add = () => {
    if (!size) return setError('Please select a size.');
    setError('');
    addToCart(p, size, qty, color);
  };

  return (
    <View style={s.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <ProductImage uri={p.image} type={p.type} style={s.img} />
          <SafeAreaView edges={['top']} style={s.overlay}>
            <TouchableOpacity style={s.round} onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={22} color={colors.ink} /></TouchableOpacity>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity style={s.round} onPress={() => toggleWish(p)}>
                <Ionicons name={wished ? 'heart' : 'heart-outline'} size={21} color={wished ? colors.heart : colors.ink} />
              </TouchableOpacity>
              <CartButton navigation={navigation} />
            </View>
          </SafeAreaView>
        </View>

        <View style={s.sheet}>
          <Text style={s.type}>{p.category}  |  {p.type}</Text>
          <Text style={s.name}>{p.brand} {p.name}</Text>
          <View style={s.rateRow}>
            <Stars rating={p.rating} size={15} />
            <Text style={s.reviews}>  {p.rating}  ({p.reviews} reviews)</Text>
          </View>
          <View style={s.priceRow}>
            <Text style={s.price}>{inr(p.price)}</Text>
            <Text style={s.mrp}>{inr(p.mrp)}</Text>
            <View style={s.offPill}><Text style={s.offTxt}>{discount(p)}% OFF</Text></View>
          </View>
          <Text style={s.desc}>{p.desc}</Text>

          <Text style={s.label}>Color</Text>
          <View style={s.colors}>
            {COLORS.map((c) => (
              <TouchableOpacity key={c.name} onPress={() => setColor(c.name)} style={[s.swatchWrap, color === c.name && s.swatchOn]}>
                <View style={[s.swatch, { backgroundColor: c.hex }]} />
              </TouchableOpacity>
            ))}
            <Text style={s.colorName}>{color}</Text>
          </View>

          <Text style={s.label}>{oneSize ? 'Size' : 'Select size'}</Text>
          <View style={s.sizes}>
            {p.sizes.map((z) => (
              <TouchableOpacity key={z} onPress={() => { setSize(z); setError(''); }} style={[s.size, size === z && s.sizeOn]}>
                <Text style={[s.sizeText, size === z && { color: '#fff' }]}>{z}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {!!error && <Text style={s.error}>{error}</Text>}

          <View style={s.qtyRow}>
            <Text style={s.label2}>Quantity</Text>
            <View style={s.stepper}>
              <TouchableOpacity style={s.stepBtn} onPress={() => setQty(Math.max(1, qty - 1))}><Ionicons name="remove" size={18} color={colors.ink} /></TouchableOpacity>
              <Text style={s.qty}>{qty}</Text>
              <TouchableOpacity style={s.stepBtn} onPress={() => setQty(Math.min(10, qty + 1))}><Ionicons name="add" size={18} color={colors.ink} /></TouchableOpacity>
            </View>
          </View>

          <View style={s.perks}>
            <Perk icon="bicycle-outline" t1="Free Shipping" t2={`Orders over ${inr(999)}`} />
            <Perk icon="shield-checkmark-outline" t1="Secure Payment" t2="100% secure" />
            <Perk icon="refresh-outline" t1="Easy Returns" t2="Hassle-free" />
          </View>
        </View>

        {similar.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <Text style={[s.label, { paddingHorizontal: 16 }]}>You may also like</Text>
            <FlatList
              data={similar}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(x) => x.id}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
              renderItem={({ item }) => (
                <TouchableOpacity style={s.simCard} activeOpacity={0.9} onPress={() => navigation.push('ProductDetail', { product: item })}>
                  <ProductImage uri={item.image} type={item.type} style={s.simImg} />
                  <Text style={s.simBrand} numberOfLines={1}>{item.brand}</Text>
                  <Text style={s.simPrice}>{inr(item.price)}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={s.bar}>
        {added ? (
          <Button title="Go to Cart" onPress={() => navigation.navigate('Cart')} style={{ flex: 1 }} />
        ) : (
          <Button title={`Add to Cart  |  ${inr(p.price * qty)}`} onPress={add} style={{ flex: 1 }} />
        )}
      </SafeAreaView>
    </View>
  );
}

const Perk = ({ icon, t1, t2 }) => (
  <View style={s.perk}>
    <Ionicons name={icon} size={24} color={colors.accent} />
    <Text style={s.perkT1}>{t1}</Text>
    <Text style={s.perkT2}>{t2}</Text>
  </View>
);

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  img: { width: '100%', aspectRatio: 0.95 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8 },
  round: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', ...shadow },
  sheet: { backgroundColor: colors.bg, marginTop: -26, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20 },
  type: { color: colors.accent, fontWeight: '700', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.8 },
  name: { fontFamily: fonts.serif, fontSize: 24, fontWeight: '700', color: colors.ink, marginTop: 6 },
  rateRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  reviews: { color: colors.muted, fontSize: 13 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
  price: { fontSize: 28, fontWeight: '900', color: colors.ink },
  mrp: { color: colors.muted, textDecorationLine: 'line-through', fontSize: 15 },
  offPill: { backgroundColor: colors.ink, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 10 },
  offTxt: { color: '#fff', fontWeight: '800', fontSize: 11 },
  desc: { color: colors.muted, lineHeight: 22, marginTop: 14 },
  label: { fontFamily: fonts.serif, fontSize: 18, fontWeight: '700', color: colors.ink, marginTop: 22, marginBottom: 10 },
  label2: { fontFamily: fonts.serif, fontSize: 18, fontWeight: '700', color: colors.ink },
  colors: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  swatchWrap: { width: 38, height: 38, borderRadius: 19, borderWidth: 2, borderColor: 'transparent', alignItems: 'center', justifyContent: 'center' },
  swatchOn: { borderColor: colors.ink },
  swatch: { width: 28, height: 28, borderRadius: 14 },
  colorName: { color: colors.muted, marginLeft: 4 },
  sizes: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  size: { minWidth: 58, paddingVertical: 11, paddingHorizontal: 14, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card, borderRadius: 24, alignItems: 'center' },
  sizeOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  sizeText: { fontWeight: '700', color: colors.ink },
  error: { color: colors.sale, marginTop: 10, fontWeight: '600' },
  qtyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 },
  stepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 14, borderWidth: 1, borderColor: colors.line },
  stepBtn: { width: 42, height: 40, alignItems: 'center', justifyContent: 'center' },
  qty: { minWidth: 30, textAlign: 'center', fontWeight: '800', color: colors.ink, fontSize: 16 },
  perks: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 26, backgroundColor: colors.card, borderRadius: 18, padding: 14, ...shadow },
  perk: { flex: 1, alignItems: 'center', gap: 3 },
  perkT1: { fontWeight: '700', color: colors.ink, fontSize: 12, marginTop: 4 },
  perkT2: { color: colors.muted, fontSize: 11 },
  simCard: { width: 120 },
  simImg: { width: 120, height: 140, borderRadius: 16 },
  simBrand: { fontWeight: '800', color: colors.ink, marginTop: 6 },
  simPrice: { color: colors.ink },
  bar: { padding: 16, borderTopWidth: 1, borderColor: colors.line, flexDirection: 'row', backgroundColor: colors.bg },
});
