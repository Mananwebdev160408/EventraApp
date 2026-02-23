import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity } from "react-native";
import { COLORS } from "../constants/theme";
import {
  Home,
  Ticket,
  User,
  ShoppingBag,
  Calendar,
  LayoutDashboard,
  Settings,
  Activity,
  Package,
} from "lucide-react-native";

// Auth Screens
import AuthLandingScreen from "../screens/auth/AuthLandingScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import SignupScreen from "../screens/auth/SignupScreen";
import StadiumOnboardingScreen from "../screens/auth/StadiumOnboardingScreen";

// User Screens
import DiscoverEventsScreen from "../screens/main/DiscoverEventsScreen";
import EventDetailsScreen from "../screens/main/EventDetailsScreen";
import SelectSeatsScreen from "../screens/main/SelectSeatsScreen";
import SeatBlockScreen from "../screens/main/SeatBlockScreen";
import SeatInformationScreen from "../screens/main/SeatInformationScreen";
import TicketScreen from "../screens/main/TicketScreen";
import ProfileScreen from "../screens/main/ProfileScreen";
import EmergencyScreen from "../screens/main/EmergencyScreen";
import ActivityHistoryScreen from "../screens/main/ActivityHistoryScreen";
import EditProfileScreen from "../screens/main/EditProfileScreen";

// Commerce Screens
import StoreScreen from "../screens/commerce/StoreScreen";
import FoodOrderingScreen from "../screens/commerce/FoodOrderingScreen";
import CartScreen from "../screens/commerce/CartScreen";
import CheckoutScreen from "../screens/commerce/CheckoutScreen";
import TrackOrderScreen from "../screens/commerce/TrackOrderScreen";
import ProductDetailsScreen from "../screens/commerce/ProductDetailsScreen";
import OrderConfirmedScreen from "../screens/commerce/OrderConfirmedScreen";
import MenuScreen from "../screens/commerce/MenuScreen";

// Admin Screens
import AdminDashboardScreen from "../screens/admin/AdminDashboardScreen";
import AdminAnalyticsScreen from "../screens/admin/AdminAnalyticsScreen";
import AdminEventScheduleScreen from "../screens/admin/AdminEventScheduleScreen";
import AdminSettingsScreen from "../screens/admin/AdminSettingsScreen";
import AddEventScreen from "../screens/admin/AddEventScreen";
import ManageEventDetailsScreen from "../screens/admin/ManageEventDetailsScreen";
import AdminLayoutScreen from "../screens/admin/AdminLayoutScreen";
import AdminStoreScreen from "../screens/admin/AdminStoreScreen";
import AdminInventoryScreen from "../screens/admin/AdminInventoryScreen";
import AdminProfileScreen from "../screens/admin/AdminProfileScreen";
import MyTicketsScreen from "../screens/main/MyTicketsScreen";
import StadiumMapScreen from "../screens/main/StadiumMapScreen";
import StadiumDetailsScreen from "../screens/main/StadiumDetailsScreen";
import SystemLogsScreen from "../screens/admin/SystemLogsScreen";
import NotificationsScreen from "../screens/main/NotificationsScreen";
import OrderHistoryScreen from "../screens/main/OrderHistoryScreen";
import LiveHeatmapScreen from "../screens/main/LiveHeatmapScreen";

// Placeholder screens

// Main User Tabs
import ExploreScreen from "../screens/main/ExploreScreen";
import EventDashboardScreen from "../screens/main/EventDashboardScreen";
import {
  Compass,
  Calendar as CalendarIcon,
  Ticket as TicketIcon,
} from "lucide-react-native";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const AdminTab = createBottomTabNavigator();

// Mock state for "In Event"
// In a real app, this would be managed by a Context or Redux
const isInEvent = true;

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor: COLORS.border,
          height: 70,
          paddingBottom: 12,
          paddingTop: 12,
        },
        tabBarActiveTintColor: COLORS.brandPurple,
        tabBarInactiveTintColor: COLORS.gray500,
        tabBarLabelStyle: { fontSize: 10, fontWeight: "700" },
      }}
    >
      <Tab.Screen
        name="Discover"
        component={DiscoverEventsScreen}
        options={{
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />

      {isInEvent && (
        <Tab.Screen
          name="Dashboard"
          component={EventDashboardScreen}
          options={{
            tabBarLabel: "DASHBOARD",
            tabBarIcon: ({ color }) => (
              <LayoutDashboard size={24} color={color} />
            ),
          }}
        />
      )}

      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarIcon: ({ color }) => <Compass size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="MyEvents"
        component={MyTicketsScreen}
        options={{
          tabBarLabel: "MY EVENTS",
          tabBarIcon: ({ color }) => <TicketIcon size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

function AdminTabs() {
  return (
    <AdminTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor: COLORS.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: COLORS.brandPurple,
        tabBarInactiveTintColor: COLORS.gray500,
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600" },
      }}
    >
      <AdminTab.Screen
        name="Dashboard"
        component={AdminDashboardScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <LayoutDashboard size={24} color={color} />
          ),
        }}
      />
      <AdminTab.Screen
        name="Events"
        component={AdminEventScheduleScreen}
        options={{
          tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
        }}
      />
      <AdminTab.Screen
        name="Layout"
        component={AdminLayoutScreen}
        options={{
          tabBarIcon: ({ color }) => <Activity size={24} color={color} />,
        }}
      />
      <AdminTab.Screen
        name="Store"
        component={AdminStoreScreen}
        options={{
          tabBarIcon: ({ color }) => <ShoppingBag size={24} color={color} />,
        }}
      />
      <AdminTab.Screen
        name="Inventory"
        component={AdminInventoryScreen}
        options={{
          tabBarIcon: ({ color }) => <Package size={24} color={color} />,
        }}
      />
      <AdminTab.Screen
        name="Profile"
        component={AdminProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </AdminTab.Navigator>
  );
}

import { useAuth } from "../context/AuthContext";

export default function AppNavigator() {
  const { userToken, userInfo, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading App...</Text>
      </View>
    );
  }

  console.log("AppNavigator - UserInfo:", JSON.stringify(userInfo, null, 2));

  // Improved role detection
  const getRoles = (user) => {
    if (!user) return [];

    // 1. Check for 'roles' or 'role' or 'authorities' or 'permissions'
    const source = user.userDetails || user;
    const rolesData =
      source.roles ||
      source.role ||
      source.authorities ||
      source.permissions ||
      [];

    // 2. If it's an array, process each item
    if (Array.isArray(rolesData)) {
      return rolesData
        .map((r) => {
          if (typeof r === "string") return r.toUpperCase();
          if (typeof r === "object") {
            // Flatten object to string (check name, authority, value, etc)
            return (
              r.name ||
              r.authority ||
              r.value ||
              r.role ||
              ""
            ).toUpperCase();
          }
          return "";
        })
        .filter(Boolean);
    }

    // 3. If it's a single string, return as array
    if (typeof rolesData === "string") {
      return [rolesData.toUpperCase()];
    }

    // 4. If it's a single object, extract role name
    if (typeof rolesData === "object" && rolesData !== null) {
      const roleName =
        rolesData.name || rolesData.authority || rolesData.role || "";
      if (roleName) return [roleName.toUpperCase()];
    }

    // 5. Hard check on username if it contains 'admin' (only as a safety fallback)
    if (
      user.username &&
      user.username.toLowerCase().includes("admin") &&
      !user.roles
    ) {
      return ["ADMIN"];
    }

    return [];
  };

  const currentRoles = getRoles(userInfo);
  const isAdmin = currentRoles.some(
    (r) =>
      r === "ADMIN" ||
      r === "ROLE_ADMIN" ||
      r === "STADIUM_ADMIN" ||
      r.includes("ADMIN"),
  );

  console.log(
    "AppNavigator - IsAdmin:",
    isAdmin,
    "Roles Detected:",
    currentRoles,
  );

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: COLORS.background },
          }}
        >
          {!userToken ? (
            <>
              <Stack.Screen name="AuthLanding" component={AuthLandingScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
              <Stack.Screen
                name="StadiumOnboarding"
                component={StadiumOnboardingScreen}
              />
            </>
          ) : isAdmin ? (
            <>
              {/* Admin Flow */}
              <Stack.Screen name="AdminTabs" component={AdminTabs} />
              <Stack.Screen name="AddEvent" component={AddEventScreen} />
              <Stack.Screen
                name="ManageEventDetails"
                component={ManageEventDetailsScreen}
              />
              <Stack.Screen
                name="AdminSettings"
                component={AdminSettingsScreen}
              />
              <Stack.Screen
                name="AdminEventSchedule"
                component={AdminEventScheduleScreen}
              />
              <Stack.Screen
                name="AdminAnalytics"
                component={AdminAnalyticsScreen}
              />
              <Stack.Screen name="AdminStore" component={AdminStoreScreen} />
              <Stack.Screen name="SystemLogs" component={SystemLogsScreen} />
            </>
          ) : (
            <>
              {/* User Main Flow */}
              <Stack.Screen name="MainTabs" component={MainTabs} />
              <Stack.Screen
                name="EventDetails"
                component={EventDetailsScreen}
              />
              <Stack.Screen name="SelectSeats" component={SelectSeatsScreen} />
              <Stack.Screen name="SeatBlock" component={SeatBlockScreen} />
              <Stack.Screen
                name="SeatInformation"
                component={SeatInformationScreen}
                options={{
                  presentation: "transparentModal",
                  animation: "slide_from_bottom",
                }}
              />
              <Stack.Screen name="Ticket" component={TicketScreen} />
              <Stack.Screen
                name="OrderHistory"
                component={OrderHistoryScreen}
              />

              {/* Commerce Flow */}
              <Stack.Screen name="Store" component={StoreScreen} />
              <Stack.Screen
                name="FoodOrdering"
                component={FoodOrderingScreen}
              />
              <Stack.Screen name="Cart" component={CartScreen} />
              <Stack.Screen name="Checkout" component={CheckoutScreen} />
              <Stack.Screen name="TrackOrder" component={TrackOrderScreen} />
              <Stack.Screen
                name="ProductDetails"
                component={ProductDetailsScreen}
              />
              <Stack.Screen name="Menu" component={MenuScreen} />
              <Stack.Screen
                name="OrderConfirmed"
                component={OrderConfirmedScreen}
              />
            </>
          )}

          <Stack.Screen name="Notifications" component={NotificationsScreen} />

          {/* Shared Screens */}
          <Stack.Screen name="StadiumMap" component={StadiumMapScreen} />
          <Stack.Screen
            name="StadiumDetails"
            component={StadiumDetailsScreen}
          />
          <Stack.Screen name="Emergency" component={EmergencyScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="LiveHeatmap" component={LiveHeatmapScreen} />
          <Stack.Screen name="AdminProfile" component={AdminProfileScreen} />
          <Stack.Screen
            name="ActivityHistory"
            component={ActivityHistoryScreen}
          />
        </Stack.Navigator>
        <StatusBar style="dark" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
