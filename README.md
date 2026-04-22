# Sayan Trendz

Production-ready premium Indian jewelry and accessories eCommerce platform built with:

- React + Vite
- Tailwind CSS + Framer Motion
- Node.js + Express
- MongoDB + Mongoose
- Firebase Authentication
- Razorpay checkout

## Features

- Premium storefront with responsive luxury UI
- Firebase-backed auth with demo fallback for local preview
- MongoDB product, order, wishlist, coupon, and analytics models
- Admin dashboard for product uploads, coupon management, order updates, low-stock visibility, and analytics
- Secure checkout flow with Razorpay server order creation and payment verification
- Wishlist persistence, order history, user account management, and AI-style product recommendations
- Dark mode, lazy-loaded routes, vendor chunk splitting, and SEO metadata

## Project Structure

```text
src/
  components/
  context/
  lib/
  pages/
server/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    services/
    utils/
```

## Local Setup

1. Copy `.env.example` to `.env`
2. Add MongoDB, Firebase, Razorpay, and SMTP credentials
3. Install packages:

```bash
npm install
```

4. Run client and server together:

```bash
npm run dev
```

5. Build the frontend:

```bash
npm run build
```

6. Verify the backend app imports cleanly:

```bash
npm run check:server
```

## Notes

- If Firebase or Razorpay env vars are missing, the UI falls back to a safe demo-friendly flow for local preview.
- Admin image uploads are stored in `server/uploads/`.
- `npm audit` still reports unresolved third-party dependency vulnerabilities and should be reviewed before production deployment.
