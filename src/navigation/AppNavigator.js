import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';
import { COLORS } from '../constants/theme';
import { Home, Ticket, User, ShoppingBag } from 'lucide-react-native';
import LoginScreen from '../screens/auth/LoginScreen';
import RoleSelectionScreen from '../screens/auth/RoleSelectionScreen';
import DiscoverEventsScreen from '../screens/main/DiscoverEventsScreen';
import EventDetailsScreen from '../screens/main/EventDetailsScreen';
import SelectSeatsScreen from '../screens/main/SelectSeatsScreen';
import SeatInformationScreen from '../screens/main/SeatInformationScreen';
import TicketScreen from '../screens/main/TicketScreen';
import StoreScreen from '../screens/commerce/StoreScreen';
import FoodOrderingScreen from '../screens/commerce/FoodOrderingScreen';
import CartScreen from '../screens/commerce/CartScreen';

import ProfileScreen from '../screens/main/ProfileScreen';
import CheckoutScreen from '../screens/commerce/CheckoutScreen';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import EmergencyScreen from '../screens/main/EmergencyScreen';
import ActivityHistoryScreen from '../screens/main/ActivityHistoryScreen';
import TrackOrderScreen from '../screens/commerce/TrackOrderScreen';
import AdminAnalyticsScreen from '../screens/admin/AdminAnalyticsScreen';
import AdminEventScheduleScreen from '../screens/admin/AdminEventScheduleScreen';

// Placeholder screens
const MyTicketsScreen = ({navigation}) => {
  // Simple reuse/redirection to the Ticket data we have
  return (
    <View style={{flex:1, backgroundColor: COLORS.brandDark, alignItems: 'center', justifyContent: 'center'}}>
       <TouchableOpacity onPress={() => navigation.navigate('Ticket')}>
         <View style={{backgroundColor: COLORS.brandPurple, padding: 20, borderRadius: 12}}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>View My Ticket</Text>
         </View>
       </TouchableOpacity>
    </View>
  );
};

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.brandDark,
          borderTopColor: COLORS.white10,
        },
        tabBarActiveTintColor: COLORS.brandPurple,
        tabBarInactiveTintColor: COLORS.gray500,
      }}
    >
      <Tab.Screen 
        name="Discover" 
        component={DiscoverEventsScreen}
        options={{
          tabBarIcon: ({color}) => <Home size={24} color={color} />
        }}
      />
      <Tab.Screen 
        name="Store" 
        component={StoreScreen}
        options={{
          tabBarIcon: ({color}) => <ShoppingBag size={24} color={color} />
        }}
      />
      <Tab.Screen 
        name="Tickets" 
        component={MyTicketsScreen}
        options={{
          tabBarIcon: ({color}) => <Ticket size={24} color={color} />
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({color}) => <User size={24} color={color} />
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.brandDark } }}>
          {/* Auth Flow */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
          
          {/* Admin Flow */}
          <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
          <Stack.Screen name="AdminAnalytics" component={AdminAnalyticsScreen} />
          <Stack.Screen name="AdminEventSchedule" component={AdminEventScheduleScreen} />

          {/* Main Flow */}
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
          <Stack.Screen name="SelectSeats" component={SelectSeatsScreen} />
          <Stack.Screen 
            name="SeatInformation" 
            component={SeatInformationScreen} 
            options={{ presentation: 'transparentModal', animation: 'slide_from_bottom' }}
          />
          <Stack.Screen name="Ticket" component={TicketScreen} />
          <Stack.Screen name="Emergency" component={EmergencyScreen} />
          <Stack.Screen name="ActivityHistory" component={ActivityHistoryScreen} />
          
          {/* Commerce Flow */}
          <Stack.Screen name="FoodOrdering" component={FoodOrderingScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="TrackOrder" component={TrackOrderScreen} />
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
