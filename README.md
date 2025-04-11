#  E-Commerce App


A full-stack e-commerce platform with user authentication, admin tools, and Stripe-powered checkout.


![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![React](https://img.shields.io/badge/Frontend-React-blue)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)
![Stripe](https://img.shields.io/badge/Payment-Stripe-purple)


## Structure Overview
- **Frontend:** React, React Router, Context API  
- **Backend:** Node.js, Express  
- **Database:** PostgreSQL  
- **Auth:** JSON Web Tokens (JWT), Google OAuth  
- **Payment:** Stripe  
_(For the server side, use the [stripe](https://stripe.com/docs/libraries#node-library) npm library — API docs [here](https://stripe.com/docs/api), tutorial [here](https://stripe.com/docs/payments/accept-a-payment)) to accept tokens from your front-end app and send charges via the Stripe API.)_

---

## Prerequisites

Before running the project locally, make sure you have:

- Node.js v18+
- PostgreSQL v14+
- A `.env` file with the following variables:

    ```env
    DATABASE_URL=your_database_connection_string
    JWT_SECRET=your_jwt_secret
    STRIPE_SECRET_KEY=your_stripe_secret_key
    ```

---


## Getting Started

To run the app locally:

1. Clone the repository:
    
    ```bash
    git clone https://github.com/your-repo/ecommerce-app.git
    ```

2. Navigate into the project and install dependencies for both backend and frontend (see steps below).

3. Create your `.env` file inside the `server/` directory.

4. Start both servers:

    In one terminal tab (backend):
    ```bash
    npm run dev
    ```

    In another terminal tab (frontend):
    ```bash
    cd client
    npm run dev
    ```


---

## Backend Setup

```bash
cd server
```

#### Install backend dependencies
```bash
npm install express cors pg bcrypt jsonwebtoken dotenv stripe
```

#### Install backend dev dependencies
```bash
npm install --save-dev nodemon jest supertest
```

#### Add scripts to package.json
```js
 "scripts": {
   "start": "node index.js",
   "dev": "nodemon index.js",
   "test": "jest"
 }
```

---


Database Diagram URL  
[DATABASE](https://dbdiagram.io/d/Goofy-Capstone-67f675134f7afba184f3fd8a)


![Database diagram preview](https://github.com/user-attachments/assets/28f41f59-2b7a-48b1-922c-9dbda893c87d)



---

## Frontend Setup
```bash
cd ../client
```

### Install frontend dependencies
```bash
npm install react-router-dom 
```

### Done
```bash
echo "All dependencies installed! You can now start the frontend with 'npm run dev'"
```

---

## Features 

### MVP

#### Guest User
- View all products (`ProductList.jsx`)
- View individual product details (`ProductDetails.jsx`)
- Register an account (`Register.jsx`)
- Login to an existing account (`Login.jsx`)

#### Logged User
- Persistent shopping cart (`Cart.jsx`)
- Add/edit/remove items from cart
- Checkout confirmation (`Checkout.jsx`, `OrderConfirmation.jsx`)
- Optional: User dashboard (`Account.jsx`)

#### Admin 
- Admin dashboard (`AdminDashboard.jsx`)
- Manage products: list, add, edit, delete
  - `AdminProductList.jsx`
  - `AdminAddProduct.jsx`
  - `AdminEditProduct.jsx`
- View all users (`AdminUserList.jsx`)

---

### ⚙ Essentials

#### Guest Enhancements
- Sort/filter products (`ProductList.jsx`)
- Responsive/mobile-friendly layout (`Navbar.jsx`, `MobileNav.jsx`)
- ADA compliance features ([A11y Checklist](https://www.a11yproject.com/checklist/), [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker))
- Loading indicators (`LoadingSpinner.jsx`)
- Error pages (`NotFound.jsx`)
- Persistent cart for guests (localStorage/session)
- Guest-to-logged-in cart merge

#### Logged-In User
- Order history (`OrderHistory.jsx`)
- Edit user profile (`Profile.jsx`)

#### Admin Enhancements
- Manage stock/inventory (`AdminProductList.jsx`)
- Category/tag management
- Manage orders by status (`AdminOrders.jsx`)
- Modify/delete users and promote to admin (`AdminEditUser.jsx`)

---

### Extra Features

#### Guest
- OAuth login (e.g., Google) (`OAuthLogin.jsx`)

#### Logged-In User
- Wishlist system
  - View and manage wishlist (`Wishlist.jsx`)
  - Shareable wishlist view (`SharedWishlist.jsx`)
- Notifications (`Notifications.jsx`)
- Advanced search, pagination, infinite scroll (`ProductList.jsx`)
- Product recommendations (`Recommendations.jsx`)

#### Admin
- View user wishlists (`AdminUserList.jsx`)
- Trigger password resets (`AdminEditUser.jsx`)
- Deduct stock on orders 
- Handle inventory availability errors

---

## Component Overview

| Component/Page          | Description                                  |
|-------------------------|----------------------------------------------|
| `Home.jsx`              | Optional homepage                            |
| `Navbar.jsx`            | Navigation bar                               |
| `ProductList.jsx`       | Display all products                         |
| `ProductDetails.jsx`    | Individual product info                      |
| `Register.jsx`          | Create a new user                            |
| `Login.jsx`             | Log into existing account                    |
| `Cart.jsx`              | Persistent cart management                   |
| `Checkout.jsx`          | Checkout page                                |
| `OrderConfirmation.jsx` | Post-purchase confirmation                   |
| `Account.jsx`           | User dashboard                               |
| `OrderHistory.jsx`      | List of past orders                          |
| `Profile.jsx`           | Edit user profile                            |
| `Wishlist.jsx`          | Manage personal wishlist                     |
| `SharedWishlist.jsx`    | Public view of shared wishlist               |
| `Notifications.jsx`     | Alerts and updates                           |
| `AdminDashboard.jsx`    | Admin home panel                             |
| `AdminProductList.jsx`  | Product management (view/edit/delete)        |
| `AdminAddProduct.jsx`   | Add new product                              |
| `AdminEditProduct.jsx`  | Edit existing product                        |
| `AdminUserList.jsx`     | View all users                               |
| `AdminEditUser.jsx`     | Edit/delete/promote users                    |
| `AdminOrders.jsx`       | Manage orders and status                     |
| `OAuthLogin.jsx`        | Google OAuth login page                      |
| `LoadingSpinner.jsx`    | Reusable loading indicator                   |
| `NotFound.jsx`          | 404 Error page                               |

---



## Development Notes

- Use `npm run dev` from the root to launch the Express backend with `nodemon`.
- Use `npm run dev` inside `/client` to run the frontend with Vite.
- The shopping cart persists for both guest and logged-in users using `localStorage` and backend sync.
- Google OAuth is integrated via the `OAuthLogin.jsx` component (client-side) and `/auth/google` routes (backend).
- All authenticated routes require a valid JWT stored in the browser.
- The app uses role-based access control to differentiate between Admin and regular users.
- Seed scripts are recommended for testing (users, products, orders) — can be added as `scripts/seed.js`.


---

## Contributors/Authors 🧑‍💻👩‍💻
- [Andy Edwards](https://github.com/aedwardsk)
- [Charley Lea](https://github.com/charleylea)
- [Sydney Mitchell](https://github.com/sydmitch)
- [Joshua Thomas](https://github.com/Josh-A-T)
- [Connor Wotkowicz](https://github.com/sandpitt-turtle)
