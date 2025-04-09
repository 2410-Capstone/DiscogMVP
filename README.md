# Database diagram Url 
- ** https://dbdiagram.io/d/Goofy-Capstone-67f675134f7afba184f3fd8a



#  E-Commerce App

## Structure Overview
- **Frontend:** React, React Router, Context API  
- **Backend:** Node.js, Express  
- **Database:** PostgreSQL  
- **Auth:** JSON Web Tokens (JWT), Google OAuth  
- **Payment:** Stripe  
  _(For the server side, use the `[stripe](<https://stripe.com/docs/libraries#node-library>)` npm library (API docs [here](https://stripe.com/docs/api), tutorial [here](https://stripe.com/docs/payments/accept-a-payment)) to accept tokens from your front-end app and send charges via the Stripe API.)_




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



## Reminders:
- Use `localStorage` or `sessionStorage` for guest carts
- Use protected routes with `AuthRoute.jsx` for role-based access
- Seed database with dummy data for dev testing (users, products, orders) 

---

## Contributors/Authors 🧑‍💻👩‍💻
- Andy Edwards
- Charley Lea
- Sydney Mitchell
- Joshua Thomas
- Connor Wotkowicz 
