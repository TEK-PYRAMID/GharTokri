# Grocery App

[![Netlify Status](https://api.netlify.com/api/v1/badges/56335178-7221-4468-9bdc-559dff4a75a4/deploy-status)](https://app.netlify.com/projects/ghartokr/deploys)

Quick-commerce grocery web app — 9-developer team project (React + Vite + Tailwind).

## Folder Structure

```
src/
├── assets/          Images, icons, static files
├── components/
│   └── common/      Shared reusable UI (Button, Input, Modal, Loader, Toast, ErrorState, EmptyState, Navbar, Footer) — Owner: Prashant
├── pages/           One folder per page, each with <PageName>.jsx + index.js
├── layouts/         MainLayout.jsx — Owner: Prashant
├── routes/          AppRoutes.jsx — central route definitions — Owner: Prashant
├── context/         AuthContext, CartContext, WishlistContext, UserContext, OrderContext
├── services/        API service layer, one per module + shared apiClient.js
├── hooks/           Shared custom hooks
├── utils/           Helper functions
├── data/            Mock data / static JSON
├── validations/     Form validation schemas/helpers
└── App.jsx          Root component — providers + routes
```

## Page Ownership

| Page | Owner |
|---|---|
| Home | Sayeed |
| Categories | Sayeed |
| Login / Signup / OTP Verification / Forgot Password | Alcious |
| Product Listing / Product Details / Search Results | Poorvika |
| Cart / Wishlist | Mubeena |
| Address Management / Checkout / Payment | Ashwariya |
| Order Confirmation | Ashwariya + Twjaswi |
| My Orders / Order Details / Order Tracking | Twjaswi |
| Profile / Account Settings | Sundaravadhani |
| Shared Layout / 404 / Common UI | Ramya |
| QA across all pages | Prashant |

## Git Flow

```
main
└── develop
    ├── feature/prashant-shared-ui
    ├── feature/alcious-auth
    ├── feature/sayeed-home
    ├── feature/poorvika-products
    ├── feature/mubeena-cart
    ├── feature/ashwariya-checkout
    ├── feature/twjaswi-orders
    ├── feature/sundaravadhani-profile
    └── feature/ramya-qa
```

Feature branch → develop → integration testing → main → production. Every PR needs 2 approvals.
