# 🛍️ Home Shop

**Home Shop** is a full-stack MERN E-Commerce application built using modern React (CRA), Express.js, MongoDB, and Node.js. It provides a complete online shopping experience with secure user authentication, email OTP verification, Razorpay payment integration, Cloudinary image management, and a dedicated admin dashboard.

---

# 🛠 Tech Stack

### Frontend
- React.js (Create React App)
- Redux Toolkit (Cart State Management)
- React Context API (JWT Authentication)
- React Router DOM

### Backend
- Node.js
- Express.js
- JWT Authentication
- Nodemailer (Email OTP Verification)

### Database
- MongoDB
- Mongoose

### Cloud Storage
- Cloudinary
- Multer

### Payments
- Razorpay (Test Mode)

---

# ✨ Features

## 👤 User Features

- User Registration
- Email OTP Verification
- Secure JWT Authentication
- Login & Logout
- Product Browsing
- Product Search
- Category Filtering
- Product Details Page
- Shopping Cart
- Checkout
- Razorpay Payment Gateway
- Order History
- User Profile
- Responsive UI

---

## 👑 Admin Features

- Admin Authentication
- Dashboard
- Add Products
- Edit Products
- Delete Products
- Upload Product Images (Cloudinary)
- View Users
- Manage Orders
- Analytics Dashboard

---

## 🔒 Security Features

- Password Hashing (bcrypt)
- JWT Authentication
- Protected Routes
- Role-Based Authorization
- Email OTP Verification
- Environment Variables
- Secure Payment Verification

---

# 📂 Project Structure

```
Home-Shop
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   └── seed.js
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── admin
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   ├── redux
│   │   └── styles
│   └── package.json
│
├── package.json
└── README.md
```

---

# 🚀 Getting Started

## 1️⃣ Clone Repository

```bash
git clone https://github.com/<your-github-username>/Home-Shop.git

cd Home-Shop
```

---

## 2️⃣ Install Dependencies

Install dependencies for both frontend and backend from the project root:

```bash
npm install
```

or

```bash
npm run install-all
```

---

## 3️⃣ Configure Environment Variables

Create a `.env` file inside the **backend** folder.

```env
PORT=5000

NODE_ENV=development

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email@gmail.com

EMAIL_PASS=your_gmail_app_password

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret

RAZORPAY_KEY_ID=your_test_key

RAZORPAY_KEY_SECRET=your_test_secret
```

---

## 4️⃣ Seed the Database

Populate the database with sample products and create an admin account.

```bash
npm run seed
```

### Admin Credentials

```
Email: admin@shopnest.com

Password: password123
```

---

## 5️⃣ Run the Application

Start both frontend and backend together.

```bash
npm run dev
```

Frontend

```
http://localhost:3000
```

Backend

```
http://localhost:5000
```

---

# 💳 Razorpay Integration

The application is configured to work with **Razorpay Test Mode**.

Use your **Test API Keys** inside the backend `.env` file.

No real money is deducted while testing.

---

# 📧 Email Verification

Every newly registered user receives a **6-digit OTP** via email.

A user can log in only after successfully verifying their email.

---

# ☁️ Deployment

This project is deployment-ready for platforms such as:

- Render
- Railway
- Vercel (Frontend)
- MongoDB Atlas

Set all required environment variables before deploying.

---

# 📸 Screenshots

_Add screenshots of your application here._

- Home Page
- Shop Page
- Product Details
- Cart
- Checkout
- OTP Verification
- Admin Dashboard

---

# 🔮 Future Improvements

- Wishlist
- Product Reviews & Ratings
- Coupons & Discounts
- Resend OTP
- Forgot Password
- Email Notifications
- Inventory Alerts
- Sales Reports
- Dark Mode
- Product Recommendations

---

# 👨‍💻 Author

**Vikas Kumar Prajapati**

B.Tech Information Technology

Rajiv Gandhi Institute of Petroleum Technology (RGIPT)

---

# 📄 License

This project is developed for educational and portfolio purposes.