# CampusEats — Public Food Delivery System (Frontend Demo)

A university project: a fully responsive, frontend-only food delivery web app
built with **React + Vite + React Router**, focused on restaurants around a
university, hostels, messes and residential areas.

No backend is required — all data is mock data (`src/data/mockData.js`) and
state (cart, saved locations, session, orders) is kept in React Context and
persisted to `localStorage` so it survives a page refresh.

---

## 1. Installation

```bash
npm install
```

## 2. Run the project

```bash
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

## 3. Build for production

```bash
npm run build
npm run preview   # serve the production build locally
```

---

## 4. Project Structure

```
src/
 ├── components/       Reusable UI: Navbar, Footer, RestaurantCard, FoodCard,
 │                      CartItem, OrderStatus (tracking timeline), Rating,
 │                      LocationSelector, DashboardLayout (sidebar shell)
 │
 ├── pages/             Customer-facing pages (Home, Restaurants, Restaurant
 │                      Details, Food Details, Cart, Checkout, Order Tracking,
 │                      Order History, Login, Register, OTP Verification,
 │                      Profile, Saved Locations, Rating & Review)
 │
 ├── dashboards/        RestaurantDashboard, RiderDashboard, AdminDashboard
 │                      (each with their own sidebar layout via DashboardLayout)
 │
 ├── context/           React Context providers for global state:
 │                      CartContext, AuthContext, LocationContext,
 │                      OrderContext, ToastContext (all persisted to localStorage)
 │
 ├── data/
 │    └── mockData.js   All mock restaurants, foods, orders, users, riders,
 │                      admin records used across the app
 │
 ├── utils/storage.js   Small localStorage read/write helpers
 ├── App.jsx            All routes, wraps the app in the context providers
 ├── main.jsx           React entry point
 └── index.css          Design tokens (colors, type, spacing) + base styles
```

## 5. Major Components Explained

- **Navbar** — sticky top navigation; collapses into a hamburger drawer on
  mobile. Shows the active delivery location, cart item count, and
  login/profile state.
- **RestaurantCard / FoodCard** — the "tiffin-box" styled cards (colored top
  bar, rounded corners) used throughout Home, Restaurants, and Restaurant
  Details.
- **LocationSelector** — dropdown used in the Home hero and Checkout; supports
  picking a saved address or using the browser's Geolocation API.
- **CartItem** — quantity stepper + remove button, used on the Cart page.
- **OrderStatus** — the vertical delivery-route timeline used on the Order
  Tracking page, with a pulsing indicator on the current step.
- **DashboardLayout** — shared sidebar shell (with a mobile drawer) reused by
  all three role dashboards.

## 6. Implemented Features

- Home page: hero with location selector + search, popular/nearby
  restaurants, food categories, popular foods
- Restaurant listing: search, category filter, sort by rating/delivery fee
- Restaurant details: cover header, category tabs, menu grid
- Food details: quantity selector, add to cart
- Cart: quantity update, remove item, subtotal/delivery/total, empty state
- Checkout: saved/current location selection, Cash on Delivery or a **mock**
  online payment form (no real gateway), order summary, place order
- Order tracking: 7-step visual timeline, order details, ETA
- Order history: past + active orders, rate & review link
- Login / Register / OTP Verification (demo only — any input is accepted;
  the OTP screen does not send a real code)
- Profile: view/edit details, change password, logout
- Saved Locations: add / edit / delete / set default, GPS capture via the
  browser Geolocation API
- Rating & Review: star ratings for restaurant + food, review list
- Restaurant Dashboard: order queue (accept/reject/update status), food menu
  management (add/edit/delete/availability), profile
- Rider Dashboard: assigned orders, delivery history, status buttons
  (Accept → Picked Up → Out for Delivery → Delivered)
- Admin Dashboard: customers (block/unblock), restaurants (approve/reject),
  riders (approve/reject/block), all/active/completed/cancelled orders
- Toasts for success/error feedback, loading and empty states throughout
- Fully responsive: sidebars and navbar collapse into mobile drawers, cards
  reflow to a single column, forms stack on small screens

## 7. Intentionally Excluded (per project scope)

AI recommendations, in-app chat, group ordering, wallet, loyalty program,
real-time rider GPS tracking, demand prediction, table reservation,
subscriptions, advanced coupons, a real payment gateway, and a real OTP
service — none of these are implemented, per the finalized requirements.
