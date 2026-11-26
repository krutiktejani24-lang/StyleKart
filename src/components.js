import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Text, TextInput, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, shadow, fonts } from './theme';
import { typeIcon, discount, inr, COLORS } from './data';
import { useApp } from './context';

export const Button = ({ title, onPress, variant = 'solid', style }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={[s.btn, variant === 'outline' && s.btnOutline, style]}>
    <Text style={[s.btnText, variant === 'outline' && { color: colors.ink }]}>{title}</Text>
  </TouchableOpacity>
);

export const Field = (props) => (
  <TextInput placeholderTextColor={colors.muted} autoCapitalize="none" style={s.input} {...props} />
);

// Photo with soft background. If it fails to load, shows an icon placeholder.
export function ProductImage({ uri, type, style }) {
  const [failed, setFailed] = useState(false);

  if (failed || !uri) {
    return (
      <View style={[style, s.fallback]}>
        <Ionicons name={typeIcon(type)} size={34} color={colors.accent} />
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={style}
      resizeMode="contain"
      onError={() => setFailed(true)}
    />
  );
}

export function Stars({ rating, size = 12 }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <View style={{ flexDirection: 'row' }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Ionicons key={i} name={i < full ? 'star' : i === full && half ? 'star-half' : 'star-outline'} size={size} color={colors.star} />
      ))}
    </View>
  );
}

export function CartButton({ navigation, style }) {
  const { cartCount } = useApp();
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={[s.round, style]} hitSlop={6}>
      <Ionicons name="bag-handle-outline" size={22} color={colors.ink} />
      {cartCount > 0 && <View style={s.badge}><Text style={s.badgeTxt}>{cartCount}</Text></View>}
    </TouchableOpacity>
  );
}

export function SectionHeader({ title, action, onAction }) {
  return (
    <View style={s.secRow}>
      <Text style={s.secTitle}>{title}</Text>
      {!!action && <TouchableOpacity onPress={onAction}><Text style={s.secAction}>{action}</Text></TouchableOpacity>}
    </View>
  );
}

export function ProductCard({ item, navigation }) {
  const { toggleWish, isWished, addToCart } = useApp();
  const [done, setDone] = useState(false);
  const wished = isWished(item.id);
  const quickAdd = () => {
    if (item.sizes.length > 1) return navigation.navigate('ProductDetail', { product: item });
    addToCart(item, item.sizes[0], 1, COLORS[0].name);
    setDone(true);
    setTimeout(() => setDone(false), 1200);
  };
  return (
    <TouchableOpacity style={s.card} activeOpacity={0.92} onPress={() => navigation.navigate('ProductDetail', { product: item })}>
      <View>
        <ProductImage uri={item.image} type={item.type} style={s.cardImg} />
        <TouchableOpacity style={s.heart} onPress={() => toggleWish(item)} hitSlop={8}>
          <Ionicons name={wished ? 'heart' : 'heart-outline'} size={18} color={wished ? colors.heart : colors.ink} />
        </TouchableOpacity>
        <View style={s.off}><Text style={s.offTxt}>{discount(item)}% OFF</Text></View>
      </View>
      <View style={{ padding: 10, paddingTop: 8 }}>
        <Text style={s.cardName} numberOfLines={1}>{item.brand} {item.name}</Text>
        <View style={s.rateRow}>
          <Stars rating={item.rating} size={11} />
          <Text style={s.reviews}> ({item.reviews})</Text>
        </View>
        <View style={s.priceRow}>
          <View>
            <Text style={s.price}>{inr(item.price)}</Text>
            <Text style={s.mrp}>{inr(item.mrp)}</Text>
          </View>
          <TouchableOpacity style={s.cartBtn} onPress={quickAdd} hitSlop={6}>
            <Ionicons name={done ? 'checkmark' : 'bag-add-outline'} size={17} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  btn: { backgroundColor: colors.ink, paddingVertical: 15, alignItems: 'center', borderRadius: 14 },
  btnOutline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.ink },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },
  input: { borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: colors.ink, marginBottom: 12 },
  fallback: { backgroundColor: colors.tint, alignItems: 'center', justifyContent: 'center' },
  round: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', ...shadow },
  badge: { position: 'absolute', top: -2, right: -2, minWidth: 17, height: 17, borderRadius: 9, backgroundColor: colors.heart, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  badgeTxt: { color: '#fff', fontSize: 10, fontWeight: '800' },
  secRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginTop: 8, marginBottom: 12 },
  secTitle: { fontFamily: fonts.serif, fontSize: 21, fontWeight: '700', color: colors.ink },
  secAction: { color: colors.accent, fontWeight: '700' },
  card: { flex: 1, backgroundColor: colors.card, borderRadius: 18, overflow: 'hidden', ...shadow },
  cardImg: { width: '100%', aspectRatio: 1 },
  heart: { position: 'absolute', top: 8, right: 8, backgroundColor: '#fff', width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  off: { position: 'absolute', top: 8, left: 8, backgroundColor: colors.ink, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8 },
  offTxt: { color: '#fff', fontSize: 10, fontWeight: '800' },
  cardName: { fontWeight: '700', color: colors.ink, fontSize: 13 },
  rateRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  reviews: { color: colors.muted, fontSize: 11 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 6 },
  price: { fontWeight: '900', color: colors.ink, fontSize: 16 },
  mrp: { color: colors.muted, textDecorationLine: 'line-through', fontSize: 11 },
  cartBtn: { width: 34, height: 34, borderRadius: 12, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
});
