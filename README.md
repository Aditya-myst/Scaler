# 🛒 Amazon Clone — Full Stack E-Commerce App


<div align="center">



![Amazon Clone](https://img.shields.io/badge/Amazon-Clone-FF9900?style=for-the-badge&logo=amazon&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Sequelize-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

**A production-ready Amazon.in clone with full e-commerce functionality**

[🌐 Live Demo](https://amazonclone-omega-pink.vercel.app) · [🐛 Report Bug](https://github.com/Aditya-myst/Scaler/issues) · [✨ Request Feature](https://github.com/Aditya-myst/Scaler/issues)

</div>

---

## ✨ Features

### 🛍️ Shopping
- 🔍 **Smart Search** — Live search suggestions with category filters, keyboard navigation & text highlighting
- 📦 **Product Catalog** — Browse 50+ products with category filtering, sorting (price, rating), and pagination
- 🛒 **Cart Management** — Add, update quantity, remove items with real-time total calculation
- ❤️ **Wishlist** — Save favourite products, move to cart with one click

### 👤 User
- 🔐 **Authentication** — JWT-based login & signup with protected routes
- 📋 **Order History** — View all past orders with detailed breakdown and status tracking
- 📧 **Email Notifications** — Automated order confirmation emails via Nodemailer

### 🎨 UI/UX
- 📱 **Fully Responsive** — Mobile, tablet & desktop optimised layouts
- 🎠 **Hero Carousel** — Auto-rotating banners with smooth transitions
- ⚡ **Loading States** — Skeleton loaders and smooth animations throughout
- 🔔 **Toast Notifications** — Real-time feedback for all user actions

---

## 🏗️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 | UI framework with hooks |
| React Router v6 | Client-side routing |
| Tailwind CSS | Utility-first styling |
| Axios | HTTP client |
| Context API | Global state management |
| Vite | Build tool |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js + Express | REST API server |
| Sequelize ORM | Database abstraction |
| PostgreSQL | Relational database |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| Nodemailer | Email notifications |

---



## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/Aditya-myst/Scaler.git
cd Scaler
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=amazon_clone
DB_USER=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

Start the backend:
```bash
node app.js
```

> The server will auto-sync the database schema on startup.

### 3. Setup Frontend
```bash
cd frontend
npm install
```

Create a `.env` file in `/frontend`:
```env
VITE_API_BASE_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

### 4. Open the app
```
http://localhost:5173
```

---

## 🗄️ Database Schema

```
Users ──────┐
            ├── Carts ── CartItems ── Products ── Categories
            ├── Orders ── OrderItems
            └── Wishlists
```

| Model | Key Fields |
|-------|-----------|
| User | id, name, email, password |
| Product | id, name, price, stock_quantity, image_urls, category_id |
| Cart | id, user_id, total_price |
| CartItem | id, cart_id, product_id, quantity, price |
| Order | id, user_id, total_price, shipping_address, status |
| OrderItem | id, order_id, product_id, quantity, price |
| Wishlist | id, user_id, product_id |

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register new user |
| POST | `/auth/login` | Login & get JWT token |
| GET | `/auth/me` | Get current user |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | Get all products (with search, filter, pagination) |
| GET | `/products/:id` | Get single product |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cart` | Get user's cart |
| POST | `/cart/add` | Add item to cart |
| PUT | `/cart/update` | Update item quantity |
| DELETE | `/cart/remove/:id` | Remove item from cart |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/orders/checkout` | Place order |
| GET | `/orders/history` | Get order history |

### Wishlist
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/wishlist` | Get wishlist |
| POST | `/wishlist/add` | Add to wishlist |
| DELETE | `/wishlist/remove/:productId` | Remove from wishlist |

---

## 📧 Email Setup

This project uses Gmail SMTP for order confirmation emails. To configure:

1. Enable **2-Factor Authentication** on your Google account
2. Go to **Google Account → Security → App Passwords**
3. Generate a new App Password for "Mail"
4. Add to your `.env`:
```env
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16_char_app_password
```

---

## 🚢 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy /dist to Vercel
```

### Backend (Railway / Render)
- Set all environment variables in the dashboard
- The app uses `sequelize.sync({ alter: true })` so the DB will auto-migrate

---

## 🛣️ Roadmap

- [ ] Payment gateway integration (Razorpay)
- [ ] Product reviews & ratings
- [ ] Admin dashboard
- [ ] Order tracking with status updates
- [ ] Product image upload
- [ ] Coupon / discount codes

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author

**Aditya Kumar Jha**

[![GitHub](https://img.shields.io/badge/GitHub-Aditya--myst-181717?style=flat&logo=github)](https://github.com/Aditya-myst)

---

<div align="center">

⭐ **Star this repo if you found it helpful!** ⭐

Made with ❤️ and ☕

</div>
