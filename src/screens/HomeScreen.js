import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ProductCard, ProductImage, CartButton, SectionHeader } from '../components';
import { PRODUCTS, TYPES, photo, discount, inr } from '../data';
import { colors, fonts, shadow } from '../theme';

const BANNERS = [
  { title: 'Timeless Styles for Everyday Life', sub: 'New season, new you', type: 'Clothes', kw: 'fashion,clothes' },
  { title: 'Step into Comfort', sub: 'Shoes starting at \u20B9699', type: 'Shoes', kw: 'sneakers,shoes' },
  { title: 'Carry it Your Way', sub: 'Bags under \u20B91,999', type: 'Bags', kw: 'handbag' },
];

export default function HomeScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const [banner, setBanner] = useState(0);
  const [query, setQuery] = useState('');
  const listRef = useRef(null);
  const idx = useRef(0);

  // Banner slides automatically every 4 seconds
  useEffect(() => {
    const t = setInterval(() => {
      idx.current = (idx.current + 1) % BANNERS.length;
      listRef.current?.scrollToOffset({ offset: idx.current * width, animated: true });
      setBanner(idx.current);
    }, 4000);
    return () => clearInterval(t);
  }, [width]);

  const featured = useMemo(() => [...PRODUCTS].sort((a, b) => b.rating - a.rating).slice(0, 6), []);
  const deals = useMemo(() => [...PRODUCTS].sort((a, b) => discount(b) - discount(a)).slice(0, 8), []);
  const go = (params) => navigation.navigate('Shop', { ...params, stamp: Date.now() });

  const header = (
    <View>
      <FlatList
        ref={listRef}
        data={BANNERS}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(b) => b.title}
        onMomentumScrollEnd={(e) => { idx.current = Math.round(e.nativeEvent.contentOffset.x / width); setBanner(idx.current); }}
        renderItem={({ item, index }) => (
          <View style={{ width, paddingHorizontal: 16 }}>
            <View style={s.banner}>
              <View style={s.bannerText}>
                <Text style={s.bannerTitle}>{item.title}</Text>
                <Text style={s.bannerSub}>{item.sub}</Text>
                <TouchableOpacity style={s.bannerBtn} onPress={() => go({ type: item.type })}>
                  <Text style={s.bannerBtnTxt}>Shop Now</Text>
                  <Ionicons name="arrow-forward" size={14} color="#fff" />
                </TouchableOpacity>
              </View>
              <ProductImage uri={photo(item.kw, 100 + index, 400, 400)} type={item.type} style={s.bannerImg} />
            </View>
          </View>
        )}
      />
      <View style={s.dots}>
        {BANNERS.map((b, i) => <View key={b.title} style={[s.dot, i === banner && s.dotOn]} />)}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.cats}>
        {TYPES.map((t, i) => (
          <TouchableOpacity key={t.name} style={s.cat} onPress={() => go({ type: t.name })}>
            <ProductImage uri={photo(t.kw, 200 + i, 200, 200)} type={t.name} style={s.catImg} />
            <Text style={s.catText}>{t.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <SectionHeader title="Featured Products" action="View All" onAction={() => go({ type: 'All' })} />
    </View>
  );

  const footer = (
    <View style={{ marginTop: 22 }}>
      <SectionHeader title="Top Deals" action="See all" onAction={() => go({ type: 'All' })} />
      <FlatList
        data={deals}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(x) => x.id}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={s.deal} activeOpacity={0.92} onPress={() => navigation.navigate('ProductDetail', { product: item })}>
            <ProductImage uri={item.image} type={item.type} style={s.dealImg} />
            <Text style={s.dealName} numberOfLines={1}>{item.brand}</Text>
            <View style={s.dealRow}>
              <Text style={s.dealPrice}>{inr(item.price)}</Text>
              <Text style={s.dealOff}>{discount(item)}% off</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <View style={{ height: 24 }} />
    </View>
  );

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.topBar}>
        <Text style={s.logo}>Style<Text style={{ color: colors.accent }}>Kart</Text></Text>
        <View style={s.topRight}>
          <View style={s.bell}><Ionicons name="notifications-outline" size={22} color={colors.ink} /></View>
          <CartButton navigation={navigation} />
        </View>
      </View>
      <View style={s.searchWrap}>
        <Ionicons name="search-outline" size={18} color={colors.muted} />
        <TextInput
          style={s.search}
          placeholder="Search for products..."
          placeholderTextColor={colors.muted}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          onSubmitEditing={() => { go({ query }); setQuery(''); }}
        />
        <TouchableOpacity onPress={() => go({ type: 'All' })}><Ionicons name="options-outline" size={20} color={colors.ink} /></TouchableOpacity>
      </View>

      <FlatList
        data={featured}
        keyExtractor={(i) => i.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        columnWrapperStyle={{ gap: 14, paddingHorizontal: 16 }}
        contentContainerStyle={{ gap: 14 }}
        renderItem={({ item }) => <ProductCard item={item} navigation={navigation} />}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 6 },
  logo: { fontFamily: fonts.serif, fontSize: 28, fontWeight: '800', color: colors.ink },
  topRight: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  bell: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', ...shadow },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, margin: 16, marginBottom: 14, backgroundColor: colors.card, borderRadius: 14, paddingHorizontal: 14, ...shadow },
  search: { flex: 1, paddingVertical: 12, color: colors.ink },
  banner: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: 22, overflow: 'hidden', height: 170, ...shadow },
  bannerText: { flex: 1.1, padding: 18, justifyContent: 'center' },
  bannerTitle: { fontFamily: fonts.serif, fontSize: 22, lineHeight: 28, fontWeight: '700', color: colors.ink },
  bannerSub: { color: colors.muted, marginTop: 6, fontSize: 12.5 },
  bannerBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', backgroundColor: colors.ink, paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20, marginTop: 14 },
  bannerBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 12.5 },
  bannerImg: { flex: 1, height: '100%' },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 10 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.line },
  dotOn: { width: 18, backgroundColor: colors.ink },
  cats: { paddingHorizontal: 16, paddingVertical: 18, gap: 18 },
  cat: { alignItems: 'center', gap: 8 },
  catImg: { width: 66, height: 66, borderRadius: 33, borderWidth: 2, borderColor: '#fff' },
  catText: { fontSize: 12.5, color: colors.ink, fontWeight: '600' },
  deal: { width: 132 },
  dealImg: { width: 132, height: 150, borderRadius: 16 },
  dealName: { fontWeight: '800', color: colors.ink, marginTop: 8 },
  dealRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 2 },
  dealPrice: { fontWeight: '900', color: colors.ink },
  dealOff: { color: colors.sale, fontSize: 11, fontWeight: '800' },
});
