# Myntra Clone - E-commerce Platform

## Overview

A full-stack e-commerce application inspired by Myntra, offering a modern fashion retail experience. It features product browsing, wishlist management, shopping cart functionality, user authentication, and integrated payment processing. The platform includes both a Next.js web application and a React Native (Expo) mobile app, providing a consistent user experience across devices. Key capabilities include filtering, search, order management, and a comprehensive user dashboard.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Web Application (Next.js 15)**
- **Framework**: Next.js 15 with App Router and React Server Components.
- **Styling**: Tailwind CSS v4 with custom design tokens (Primary: #0B7FB3, Success: #26a541).
- **State Management**: Client-side state using React hooks with localStorage persistence for cart and wishlist.
- **Image Optimization**: Next.js Image component with remote patterns for Unsplash and CDN.
- **Development Server**: Runs on port 5000 with Turbopack.

**Mobile Application (React Native/Expo)**
- **Framework**: Expo SDK ~50.0 with Expo Router for file-based navigation.
- **Navigation**: Tab-based layout with bottom navigation (Home, Wishlist, Cart, Profile).
- **State Management**: Custom hooks (useCart, useWishlist) with AsyncStorage persistence.
- **API Communication**: Axios client with automatic token injection.
- **Platform Support**: iOS, Android, and Web via Metro bundler.
- **Styling**: NativeWind v4 for Tailwind className syntax.

### Backend Architecture

**API Structure**
- **Runtime**: Next.js API Routes (App Router convention).
- **Database**: MongoDB with Mongoose ODM.
- **Session Management**: JWT-based authentication with HttpOnly cookies for web and Bearer tokens for mobile. Unified session retrieval via `getSession()` helper.

**Authentication Flow**
- **Methods**: Google OAuth (NextAuth.js), OTP via Twilio SMS, Email/Password (bcryptjs).
- **Security**: JWTs signed with HS256 (7-day expiration), bcryptjs hashing (10 salt rounds), email reset tokens (1-hour expiration).
- **Features**: Dual authentication mode, phone number mandatory for signup, Google OAuth users complete profile with phone.

**Data Models**
- **User**: Name, email, hashed password, phone number, multiple addresses.
- **Product**: Title, description, price, images, category, brand, rating, stock, sizes, colors, embedded reviews.
- **Order**: Order number, user reference, items snapshot, payment status, Razorpay integration fields.

**System Design Choices & Features**
- **Premium Home Page Design**: Auto-rotating hero banner, shop by category/sale, new arrivals, trending collections, top brands carousel, newsletter subscription.
- **Category Page**: Dynamic routing, Myntra-style filters (brands, product types, price, colors), sorting options (price, rating, discount, popularity).
- **Modern Cart Page**: Empty cart state, quantity controls, price details sidebar, payment method icons, free delivery for orders above ₹1000.
- **Wishlist Page**: Dynamic item count, empty state, product grid with "MOVE TO BAG" functionality.
- **User Dashboard**: Profile management, CRUD for saved addresses, payment methods management, order history.
- **Order Management System**: Order status tracking (paid, processing, shipped, delivered, cancelled), automatic delivery scheduling, order cancellation with reasons, customer rating system, dashboard filtering, verified purchase reviews.
- **Enhanced Search UI**: Product images, responsive grid, brand/title/price/discount/ratings display.
- **Consistent Blue Theme**: All primary brand colors (#0B7FB3) applied across the application for a cohesive UI/UX.

### Payment Integration

**Razorpay Implementation**
- Order creation with amount in paise.
- Payment verification using HMAC SHA256 signature validation.
- Order status tracking: created → paid/failed.
- Client-side Razorpay checkout script.

## External Dependencies

**Third-Party Services**
- **Razorpay**: Payment gateway.
- **MongoDB**: Primary database.
- **Unsplash**: Image CDN for product photography.
- **Twilio**: SMS service for OTP authentication.
- **Nodemailer**: For sending password reset emails.

**Key NPM Packages**
- **Authentication**: `next-auth`, `jsonwebtoken`, `bcryptjs`, `@auth/mongodb-adapter`.
- **Database**: `mongoose`.
- **Payment**: `razorpay`.
- **Mobile HTTP**: `axios`.
- **Storage**: `@react-native-async-storage/async-storage`.

**Environment Variables**
- `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRE`
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `NEXT_PUBLIC_RAZORPAY_KEY`
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
- `EMAIL_SERVER`, `EMAIL_FROM`
- `EXPO_PUBLIC_API_BASE_URL` (for mobile app API endpoint)