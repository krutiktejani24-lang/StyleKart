import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'stylekart:v2';
const EMPTY = { cart: [], wishlist: [], orders: [], address: null };
const INITIAL = {
  users: [{ name: 'Demo', email: 'demo@shop.com', password: '123456' }],
  session: null, // email of the logged-in user
  data: {}, // per-user data: { [email]: { cart, wishlist, orders, address } }
};

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

export function AppProvider({ children }) {
  const [db, setDb] = useState(INITIAL);
  const [ready, setReady] = useState(false);

  // Load saved data once, then save on every change (data stays after app restart)
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) setDb(JSON.parse(raw));
      } catch (e) {}
      setReady(true);
    })();
  }, []);
  useEffect(() => {
    if (ready) AsyncStorage.setItem(KEY, JSON.stringify(db)).catch(() => {});
  }, [db, ready]);

  const user = db.users.find((u) => u.email === db.session) || null;
  const me = user ? { ...EMPTY, ...(db.data[user.email] || {}) } : EMPTY;

  // Update only the logged-in user's data
  const patchMe = (fn) =>
    setDb((d) => {
      if (!d.session) return d;
      const cur = { ...EMPTY, ...(d.data[d.session] || {}) };
      return { ...d, data: { ...d.data, [d.session]: { ...cur, ...fn(cur) } } };
    });

  // ---- Auth (demo, local only). Real app: call your Node.js API here. ----
  const login = (email, password) => {
    const found = db.users.find((u) => u.email === email.trim().toLowerCase() && u.password === password);
    if (!found) return 'Email or password is incorrect.';
    setDb((d) => ({ ...d, session: found.email }));
    return null;
  };
  const register = (name, email, password) => {
    const e = email.trim().toLowerCase();
    if (db.users.some((u) => u.email === e)) return 'This email is already registered.';
    setDb((d) => ({ ...d, users: [...d.users, { name: name.trim(), email: e, password }], session: e }));
    return null;
  };
  const logout = () => setDb((d) => ({ ...d, session: null }));

  // ---- Cart (each item = product + size) ----
  const addToCart = (product, size, qty = 1, color = null) =>
    patchMe((cur) => {
      const key = `${product.id}-${size}-${color || ''}`;
      const i = cur.cart.findIndex((x) => x.key === key);
      if (i === -1) return { cart: [...cur.cart, { key, product, size, color, qty }] };
      return { cart: cur.cart.map((x, idx) => (idx === i ? { ...x, qty: x.qty + qty } : x)) };
    });
  const saveAddress = (address) => patchMe(() => ({ address }));
  const changeQty = (key, delta) =>
    patchMe((cur) => ({ cart: cur.cart.map((x) => (x.key === key ? { ...x, qty: x.qty + delta } : x)).filter((x) => x.qty > 0) }));
  const removeFromCart = (key) => patchMe((cur) => ({ cart: cur.cart.filter((x) => x.key !== key) }));

  // ---- Wishlist ----
  const toggleWish = (product) =>
    patchMe((cur) => ({
      wishlist: cur.wishlist.some((p) => p.id === product.id)
        ? cur.wishlist.filter((p) => p.id !== product.id)
        : [...cur.wishlist, product],
    }));
  const isWished = (id) => me.wishlist.some((p) => p.id === id);

  // ---- Orders (no payment yet: orders are placed as Cash on Delivery) ----
  const placeOrder = ({ address, delivery, coupon, totals }) => {
    const order = {
      id: 'SK' + Date.now().toString().slice(-8),
      date: new Date().toISOString(),
      items: me.cart,
      address, delivery, coupon, totals,
      payment: 'Cash on Delivery',
      status: 'Placed',
    };
    patchMe((cur) => ({ orders: [order, ...cur.orders], cart: [], address }));
    return order;
  };
  const cancelOrder = (id) =>
    patchMe((cur) => ({ orders: cur.orders.map((o) => (o.id === id ? { ...o, status: 'Cancelled' } : o)) }));

  const cartCount = me.cart.reduce((s, x) => s + x.qty, 0);
  const cartTotal = me.cart.reduce((s, x) => s + x.qty * x.product.price, 0);
  const cartMrp = me.cart.reduce((s, x) => s + x.qty * x.product.mrp, 0);

  const value = useMemo(
    () => ({
      ready, user, login, register, logout,
      cart: me.cart, wishlist: me.wishlist, orders: me.orders, address: me.address,
      addToCart, saveAddress, changeQty, removeFromCart, toggleWish, isWished, placeOrder, cancelOrder,
      cartCount, cartTotal, cartMrp,
    }),
    [db, ready]
  );
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
