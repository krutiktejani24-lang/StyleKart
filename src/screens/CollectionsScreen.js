import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ProductImage, CartButton } from '../components';
import { TYPES, photo, PRODUCTS } from '../data';
import { colors, fonts, shadow } from '../theme';

const GENDER_CARDS = [
  { name: 'Men', kw: 'men,fashion' },
  { name: 'Women', kw: 'women,fashion' },
  { name: 'Kids', kw: 'kids,fashion' },
];

export default function CollectionsScreen({ navigation }) {
  const go = (params) => navigation.navigate('Shop', { ...params, stamp: Date.now() });
  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.topBar}>
        <Text style={s.title}>Categories</Text>
        <CartButton navigation={navigation} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 30, gap: 14 }} showsVerticalScrollIndicator={false}>
        {TYPES.map((t, i) => (
          <TouchableOpacity key={t.name} style={s.card} activeOpacity={0.92} onPress={() => go({ type: t.name })}>
            <View style={s.cardText}>
              <Text style={s.cardTitle}>{t.name}</Text>
              <Text style={s.cardSub}>{t.sub}</Text>
              <Text style={s.cardCount}>{PRODUCTS.filter((p) => p.type === t.name).length} products</Text>
            </View>
            <ProductImage uri={photo(t.kw, 300 + i, 400, 300)} type={t.name} style={s.cardImg} />
            <View style={s.arrow}><Ionicons name="arrow-forward" size={18} color={colors.ink} /></View>
          </TouchableOpacity>
        ))}

        <Text style={s.section}>Shop by gender</Text>
        <View style={s.genderRow}>
          {GENDER_CARDS.map((g, i) => (
            <TouchableOpacity key={g.name} style={s.gCard} activeOpacity={0.92} onPress={() => go({ gender: g.name, type: 'All' })}>
              <ProductImage uri={photo(g.kw, 400 + i, 300, 360)} type="Clothes" style={s.gImg} />
              <View style={s.gLabel}><Text style={s.gTxt}>{g.name}</Text></View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 6 },
  title: { fontFamily: fonts.serif, fontSize: 30, fontWeight: '800', color: colors.ink },
  card: { flexDirection: 'row', height: 104, backgroundColor: colors.card, borderRadius: 20, overflow: 'hidden', ...shadow },
  cardText: { flex: 1.2, padding: 16, justifyContent: 'center' },
  cardTitle: { fontFamily: fonts.serif, fontSize: 22, fontWeight: '700', color: colors.ink },
  cardSub: { color: colors.muted, marginTop: 2, fontSize: 12.5 },
  cardCount: { color: colors.accent, marginTop: 6, fontSize: 12, fontWeight: '700' },
  cardImg: { flex: 1, height: '100%' },
  arrow: { position: 'absolute', right: 12, bottom: 12, width: 34, height: 34, borderRadius: 17, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', ...shadow },
  section: { fontFamily: fonts.serif, fontSize: 21, fontWeight: '700', color: colors.ink, marginTop: 10 },
  genderRow: { flexDirection: 'row', gap: 12 },
  gCard: { flex: 1, borderRadius: 18, overflow: 'hidden', ...shadow },
  gImg: { width: '100%', aspectRatio: 0.8 },
  gLabel: { position: 'absolute', left: 8, right: 8, bottom: 8, backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 12, paddingVertical: 7, alignItems: 'center' },
  gTxt: { fontWeight: '800', color: colors.ink },
});
