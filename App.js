import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AppProvider, useApp } from './src/context';
import { colors, fonts } from './src/theme';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import ShopScreen from './src/screens/ShopScreen';
import CollectionsScreen from './src/screens/CollectionsScreen';
import WishlistScreen from './src/screens/WishlistScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import CartScreen from './src/screens/CartScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import OrderSuccessScreen from './src/screens/OrderSuccessScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import AddressScreen from './src/screens/AddressScreen';
import InfoScreen from './src/screens/InfoScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ICONS = {
  Home: ['home', 'home-outline'],
  Shop: ['bag-handle', 'bag-handle-outline'],
  Collections: ['grid', 'grid-outline'],
  Wishlist: ['heart', 'heart-outline'],
  Profile: ['person', 'person-outline'],
};

const navTheme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.bg, card: colors.bg, text: colors.ink, border: colors.line } };

function Tabs() {
  const { wishlist } = useApp();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.line },
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons name={ICONS[route.name][focused ? 0 : 1]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Shop" component={ShopScreen} />
      <Tab.Screen name="Collections" component={CollectionsScreen} />
      <Tab.Screen name="Wishlist" component={WishlistScreen} options={{ tabBarBadge: wishlist.length || undefined }} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function Root() {
  const { user, ready } = useApp();
  if (!ready) return null; // wait until saved data is loaded
  const header = {
    headerShown: true,
    headerStyle: { backgroundColor: colors.bg },
    headerTintColor: colors.ink,
    headerShadowVisible: false,
    headerBackTitleVisible: false,
    headerTitleStyle: { fontFamily: fonts.serif, fontWeight: '700' },
  };
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Main" component={Tabs} />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
            <Stack.Screen name="Cart" component={CartScreen} options={{ ...header, title: 'My Cart' }} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ ...header, title: 'Checkout' }} />
            <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} options={{ gestureEnabled: false }} />
            <Stack.Screen name="Orders" component={OrdersScreen} options={{ ...header, title: 'My Orders' }} />
            <Stack.Screen name="Addresses" component={AddressScreen} options={{ ...header, title: 'Shipping Addresses' }} />
            <Stack.Screen name="Info" component={InfoScreen} options={({ route }) => ({ ...header, title: route.params.title })} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
        <Root />
      </AppProvider>
    </SafeAreaProvider>
  );
}
