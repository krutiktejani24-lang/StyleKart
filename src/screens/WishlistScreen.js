import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useApp } from '../context';
import { Button, ProductImage, Stars, CartButton } from '../components';
import { inr } from '../data';
import { colors, fonts, shadow } from '../theme';

export default function WishlistScreen({ navigation }) {
  const { wishlist, toggleWish } = useApp();
  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.topBar}>
        <Text style={s.title}>Wishlist</Text>
        <CartButton navigation={navigation} />
      </View>
      {wishlist.length === 0 ? (
        <View style={s.center}>
          <Ionicons name="heart-outline" size={52} color={colors.muted} />
          <Text style={s.emptyTitle}>Your wishlist is empty</Text>
          <Text style={s.emptySub}>Tap the heart on any product to save it here.</Text>
          <Button title="Browse products" onPress={() => navigation.navigate('Shop')} style={{ marginTop: 20, paddingHorizontal: 32 }} />
        </View>
      ) : (
        <FlatList
          data={wishlist}
          keyExtractor={(p) => p.id}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={s.item} activeOpacity={0.92} onPress={() => navigation.navigate('ProductDetail', { product: item })}>
              <ProductImage uri={item.image} type={item.type} style={s.img} />
              <View style={{ flex: 1 }}>
                <Text style={s.name} numberOfLines={1}>{item.brand} {item.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                  <Stars rating={item.rating} size={11} />
                  <Text style={s.reviews}> ({item.reviews})</Text>
                </View>
                <Text style={s.price}>{inr(item.price)}</Text>
              </View>
              <TouchableOpacity onPress={() => toggleWish(item)} hitSlop={10}>
                <Ionicons name="heart" size={22} color={colors.heart} />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 6 },
  title: { fontFamily: fonts.serif, fontSize: 30, fontWeight: '800', color: colors.ink },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyTitle: { fontFamily: fonts.serif, fontSize: 22, fontWeight: '700', color: colors.ink, marginTop: 12 },
  emptySub: { color: colors.muted, marginTop: 6, textAlign: 'center' },
  item: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.card, borderRadius: 18, padding: 10, ...shadow },
  img: { width: 78, height: 78, borderRadius: 14 },
  name: { fontWeight: '700', color: colors.ink, fontSize: 14 },
  reviews: { color: colors.muted, fontSize: 11 },
  price: { fontWeight: '900', color: colors.ink, marginTop: 6, fontSize: 16 },
});
