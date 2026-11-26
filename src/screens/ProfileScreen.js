import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useApp } from '../context';
import { colors, fonts, shadow } from '../theme';

export default function ProfileScreen({ navigation }) {
  const { user, orders, wishlist, cartCount, logout } = useApp();

  const items = [
    { icon: 'receipt-outline', label: 'My Orders', badge: orders.length, onPress: () => navigation.navigate('Orders') },
    { icon: 'heart-outline', label: 'Wishlist', badge: wishlist.length, onPress: () => navigation.navigate('Wishlist') },
    { icon: 'bag-handle-outline', label: 'My Cart', badge: cartCount, onPress: () => navigation.navigate('Cart') },
    { icon: 'location-outline', label: 'Shipping Addresses', onPress: () => navigation.navigate('Addresses') },
    { icon: 'card-outline', label: 'Payment Methods', onPress: () => navigation.navigate('Info', { kind: 'payments', title: 'Payment Methods' }) },
    { icon: 'settings-outline', label: 'Settings', onPress: () => navigation.navigate('Info', { kind: 'settings', title: 'Settings' }) },
    { icon: 'help-circle-outline', label: 'Help & Support', onPress: () => navigation.navigate('Info', { kind: 'help', title: 'Help & Support' }) },
  ];

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView contentContainerStyle={s.wrap} showsVerticalScrollIndicator={false}>
        <Text style={s.title}>Profile</Text>
        <View style={s.head}>
          <View style={s.avatar}><Text style={s.initial}>{user?.name?.[0]?.toUpperCase()}</Text></View>
          <Text style={s.name}>{user?.name}</Text>
          <Text style={s.email}>{user?.email}</Text>
        </View>

        <View style={s.menu}>
          {items.map((it, i) => (
            <TouchableOpacity key={it.label} style={[s.row, i < items.length - 1 && s.rowLine]} onPress={it.onPress} activeOpacity={0.7}>
              <Ionicons name={it.icon} size={22} color={colors.ink} />
              <Text style={s.label}>{it.label}</Text>
              {!!it.badge && <View style={s.badge}><Text style={s.badgeTxt}>{it.badge}</Text></View>}
              <Ionicons name="chevron-forward" size={18} color={colors.muted} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={s.logout} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color={colors.sale} />
          <Text style={s.logoutTxt}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  wrap: { padding: 16, paddingBottom: 30 },
  title: { fontFamily: fonts.serif, fontSize: 30, fontWeight: '800', color: colors.ink },
  head: { alignItems: 'center', marginTop: 18, marginBottom: 22 },
  avatar: { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.tint, borderWidth: 3, borderColor: '#fff', alignItems: 'center', justifyContent: 'center', ...shadow },
  initial: { fontFamily: fonts.serif, fontSize: 38, fontWeight: '800', color: colors.accent },
  name: { fontFamily: fonts.serif, fontSize: 22, fontWeight: '700', color: colors.ink, marginTop: 12 },
  email: { color: colors.muted, marginTop: 2 },
  menu: { backgroundColor: colors.card, borderRadius: 20, paddingHorizontal: 16, ...shadow },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 17 },
  rowLine: { borderBottomWidth: 1, borderColor: colors.line },
  label: { flex: 1, fontSize: 15.5, color: colors.ink, fontWeight: '600' },
  badge: { backgroundColor: colors.tint, minWidth: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  badgeTxt: { color: colors.accent, fontWeight: '800', fontSize: 12 },
  logout: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 22, paddingVertical: 14, borderRadius: 14, borderWidth: 1, borderColor: colors.sale },
  logoutTxt: { color: colors.sale, fontWeight: '800' },
});
