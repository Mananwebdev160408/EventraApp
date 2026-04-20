# 🎫 Eventra - Your Ultimate Event Experience Companion

![Eventra Banner](https://img.shields.io/badge/Eventra-Premium_Experience-blueviolet?style=for-the-badge&logo=expo)
![React Native](https://img.shields.io/badge/React_Native-v0.81.5-61DAFB?style=for-the-badge&logo=react)
![Expo](https://img.shields.io/badge/Expo-v54.0.33-000020?style=for-the-badge&logo=expo)

**Eventra** is a cutting-edge mobile application designed to redefine how users discover, attend, and interact with events. From seamless ticketing to real-time stadium navigation and in-event commerce, Eventra provides a comprehensive ecosystem for both event-goers and organizers.

---

## 🚀 Key Features

### 🔍 Event Discovery & Exploration
- **Smart Search:** Find events by category, location, or date.
- **Dynamic Explore:** Interactive maps and live heatmaps to see where the action is.
- **Personalized Recommendations:** Tailored event suggestions based on user interests.

### 🎟️ Advanced Ticketing System
- **Interactive Seating:** View stadium layouts, select specific blocks, and pick your perfect seat.
- **Digital Wallet:** Quick access to tickets and comprehensive order history.
- **QR Entry:** Seamless entry with digital tickets.

### 🏟️ In-Event Experience
- **Live Stadium Maps:** Real-time navigation within venues to find seats, gates, and facilities.
- **Live Heatmaps:** Stay updated on crowd density and popular spots.
- **Emergency Services:** Quick access to help and safety features during events.

### 🍔 In-App Commerce
- **Food & Beverage Ordering:** Browse menus, order food, and track your order without leaving your seat.
- **Official Merchandise Store:** Purchase event-exclusive products and track deliveries.
- **Cart & Checkout:** Secure and streamlined payment process.

### 🛠️ Admin & Management Dashboard
- **Event Creation:** Tools for organizers to add and schedule events.
- **Real-time Analytics:** Track attendance, sales, and system logs.
- **Inventory Management:** Manage store items and food menus.
- **System Monitoring:** Comprehensive logs and analytics for seamless operations.

---

## 💻 Tech Stack

- **Frontend:** React Native (Expo)
- **State Management:** React Context API
- **Navigation:** React Navigation (Native Stack & Bottom Tabs)
- **Styling:** Custom Design System with Expo Linear Gradient
- **Icons:** Lucide React Native
- **Networking:** Axios & STOMP (WebSockets)
- **Charts:** React Native Chart Kit
- **Maps:** React Native Maps & Expo Location

---

## 📂 Project Structure

```text
EventraApp/
├── src/
│   ├── api/          # API services and configuration
│   ├── assets/       # Images, fonts, and static resources
│   ├── components/   # Reusable UI components
│   ├── context/      # Auth, User, and Cart state providers
│   ├── navigation/   # App and Screen navigators
│   └── screens/      # Feature-specific screens
│       ├── admin/    # Management & Analytics
│       ├── auth/     # Login & Signup
│       ├── commerce/ # Food, Store & Checkout
│       ├── main/     # Core user features (Explore, Tickets, Maps)
│       └── onboarding/# Initial UX & Splash
├── App.js            # Main entry point
└── app.json          # Expo configuration
```

---

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer)
- [Expo Go](https://expo.dev/client) app on your mobile device (or an emulator)

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd EventraApp
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the App
Start the Expo development server:
```bash
npm start
```
- Scan the QR code with **Expo Go** (Android) or the **Camera app** (iOS).
- Press `a` for Android Emulator.
- Press `i` for iOS Simulator.
- Press `w` for Web.

### Seed Firebase Demo Data
Seed linked demo accounts and inter-connected Firestore data:

```bash
npm run seed:firebase
```

Collections seeded:
- `users`
- `stadiums`
- `events`
- `seats`
- `bookings`
- `restaurants`
- `foodItems`
- `foodOrders`
- `merchandise`
- `merchandiseOrders`
- `feedback`
- `sos`

Demo login credentials:
- `demo.fan@eventra.app` / `Fan@1234`
- `demo.admin@eventra.app` / `Admin@1234`
- `demo.fan2@eventra.app` / `Fan2@1234`
- `demo.fan3@eventra.app` / `Fan3@1234`
- `demo.fan4@eventra.app` / `Fan4@1234`

---

## 🛡️ License
This project is private and intended for internal use only.

---

<p align="center">Made with ❤️ by the Eventra Team</p>
