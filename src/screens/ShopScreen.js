import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, ScrollView, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ProductCard, CartButton } from '../components';
import { PRODUCTS, GENDERS, TYPES, discount } from '../data';
import { colors, fonts, shadow } from '../theme';

const SORTS = [
  { id: 'rel', label: 'Relevance' },
  { id: 'plh', label: 'Price: Low to High' },
  { id: 'phl', label: 'Price: High to Low' },
  { id: 'disc', label: 'Discount: High to Low' },
  { id: 'rate', label: 'Customer rating' },
];

export default function ShopScreen({ navigation, route }) {
  const [gender, setGender] = useState('All');
  const [type, setType] = useState('All');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('rel');
  const [sortOpen, setSortOpen] = useState(false);

  // Open with a category / search coming from Home or Collections
  useEffect(() => {
    const p = route.params;
    if (!p) return;
    if (p.type) setType(p.type);
    if (p.gender) setGender(p.gender);
    if (p.query !== undefined) setQuery(p.query);
  }, [route.params?.stamp]);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = PRODUCTS.filter(
      (p) =>
        (gender === 'All' || p.category === gender) &&
        (type === 'All' || p.type === type) &&
        (p.name + p.brand + p.type).toLowerCase().includes(q)
    );
    const by = {
      plh: (a, b) => a.price - b.price,
      phl: (a, b) => b.price - a.price,
      disc: (a, b) => discount(b) - discount(a),
      rate: (a, b) => b.rating - a.rating,
    }[sort];
    return by ? [...list].sort(by) : list;
  }, [gender, type, query, sort]);

  const filtered = gender !== 'All' || type !== 'All' || query !== '';

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.topBar}>
        <Text style={s.title}>Shop</Text>
        <View style={s.topRight}>
          <TouchableOpacity style={s.round} onPress={() => setSortOpen(true)}><Ionicons name="swap-vertical" size={20} color={colors.ink} /></TouchableOpacity>
          <CartButton navigation={navigation} />
        </View>
      </View>

      <View style={s.searchWrap}>
        <Ionicons name="search-outline" size={18} color={colors.muted} />
        <TextInput style={s.search} placeholder="Search shoes, bags, brands..." placeholderTextColor={colors.muted} value={query} onChangeText={setQuery} />
        {!!query && <TouchableOpacity onPress={() => setQuery('')}><Ionicons name="close-circle" size={18} color={colors.muted} /></TouchableOpacity>}
      </View>

      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.pills}>
          {['All', ...TYPES.map((t) => t.name)].map((t) => (
            <TouchableOpacity key={t} onPress={() => setType(t)} style={[s.pill, type === t && s.pillOn]}>
              <Text style={[s.pillTxt, type === t && { color: '#fff' }]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={s.genders}>
        {GENDERS.map((g) => (
          <TouchableOpacity key={g} onPress={() => setGender(g)}>
            <Text style={[s.gTxt, gender === g && s.gTxtOn]}>{g}</Text>
          </TouchableOpacity>
        ))}
        <View style={{ flex: 1 }} />
        <Text style={s.count}>{items.length} items</Text>
        {filtered && <TouchableOpacity onPress={() => { setGender('All'); setType('All'); setQuery(''); }}><Text style={s.clear}>Clear</Text></TouchableOpacity>}
      </View>

      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ gap: 14, paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingBottom: 24, gap: 14, paddingTop: 4 }}
        renderItem={({ item }) => <ProductCard item={item} navigation={navigation} />}
        ListEmptyComponent={
          <View style={s.emptyBox}>
            <Ionicons name="search-outline" size={40} color={colors.muted} />
            <Text style={s.empty}>No products found. Try another word or clear the filters.</Text>
          </View>
        }
      />

      <Modal visible={sortOpen} transparent animationType="slide" onRequestClose={() => setSortOpen(false)}>
        <Pressable style={s.overlay} onPress={() => setSortOpen(false)}>
          <View style={s.sheet}>
            <Text style={s.sheetTitle}>Sort by</Text>
            {SORTS.map((o) => (
              <TouchableOpacity key={o.id} style={s.sheetRow} onPress={() => { setSort(o.id); setSortOpen(false); }}>
                <Text style={[s.sheetTxt, sort === o.id && { color: colors.accent, fontWeight: '800' }]}>{o.label}</Text>
                <Ionicons name={sort === o.id ? 'radio-button-on' : 'radio-button-off'} size={20} color={colors.accent} />
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 6 },
  title: { fontFamily: fonts.serif, fontSize: 30, fontWeight: '800', color: colors.ink },
  topRight: { flexDirection: 'row', gap: 10 },
  round: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', ...shadow },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, margin: 16, marginBottom: 10, backgroundColor: colors.card, borderRadius: 14, paddingHorizontal: 14, ...shadow },
  search: { flex: 1, paddingVertical: 12, color: colors.ink },
  pills: { paddingHorizontal: 16, gap: 10, paddingVertical: 4 },
  pill: { paddingHorizontal: 18, paddingVertical: 9, borderRadius: 20, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line },
  pillOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  pillTxt: { fontWeight: '700', color: colors.ink },
  genders: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 16, paddingVertical: 12 },
  gTxt: { color: colors.muted, fontWeight: '600' },
  gTxtOn: { color: colors.accent, fontWeight: '800', textDecorationLine: 'underline' },
  count: { color: colors.muted, fontSize: 12 },
  clear: { color: colors.sale, fontWeight: '700', fontSize: 12 },
  emptyBox: { alignItems: 'center', padding: 40, gap: 10 },
  empty: { textAlign: 'center', color: colors.muted },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.bg, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 32 },
  sheetTitle: { fontFamily: fonts.serif, fontSize: 20, fontWeight: '800', color: colors.ink, marginBottom: 8 },
  sheetRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderColor: colors.line },
  sheetTxt: { fontSize: 15, color: colors.ink },
});
