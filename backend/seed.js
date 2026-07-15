const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@homeshop.com',
      password: hashedPassword,
      role: 'admin',
      isVerified: true

    });

    const products = [
        {
            name: "Wireless Noise-Cancelling Headphones",
            description: "Immersive sound with active noise cancellation.",
            price: 299.99,
            category: "Electronics",
            stock: 15,
            imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
            ratings: 4.8,
            numReviews: 24
        },
        {
            name: "Professional DSLR Camera",
            description: "Capture stunning photos and videos.",
            price: 1199.99,
            category: "Electronics",
            stock: 8,
            imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
            ratings: 4.9,
            numReviews: 50
        },
        {
            name: "Gaming Mechanical Keyboard",
            description: "RGB mechanical keyboard with blue switches.",
            price: 89.99,
            category: "Electronics",
            stock: 25,
            imageUrl: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae",
            ratings: 4.7,
            numReviews: 40
        },
        {
            name: "Wireless Bluetooth Speaker",
            description: "Portable speaker with deep bass.",
            price: 59.99,
            category: "Electronics",
            stock: 40,
            imageUrl: "https://images.unsplash.com/photo-1589003077984-894e133dabab",
            ratings: 4.6,
            numReviews: 35
        },
        {
            name: "Smart Watch",
            description: "Fitness tracking with heart rate monitor.",
            price: 199.99,
            category: "Electronics",
            stock: 20,
            imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
            ratings: 4.5,
            numReviews: 67
        },
        {
            name: "Minimalist Modern Chair",
            description: "Comfortable wooden chair for modern interiors.",
            price: 150,
            category: "Furniture",
            stock: 30,
            imageUrl: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1",
            ratings: 4.2,
            numReviews: 12
        },
        {
            name: "Office Desk",
            description: "Spacious wooden office desk.",
            price: 220,
            category: "Furniture",
            stock: 12,
            imageUrl: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd",
            ratings: 4.4,
            numReviews: 21
        },
        {
            name: "Bookshelf",
            description: "Five-tier wooden bookshelf.",
            price: 180,
            category: "Furniture",
            stock: 18,
            imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
            ratings: 4.3,
            numReviews: 18
        },
        {
            name: "Classic White Sneakers",
            description: "Comfortable everyday sneakers.",
            price: 85,
            category: "Clothing",
            stock: 50,
            imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
            ratings: 4.5,
            numReviews: 89
        },
        {
            name: "Men's Denim Jacket",
            description: "Stylish slim-fit denim jacket.",
            price: 75,
            category: "Clothing",
            stock: 25,
            imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
            ratings: 4.4,
            numReviews: 44
        },
        {
            name: "Women's Hoodie",
            description: "Soft fleece hoodie for winter.",
            price: 49.99,
            category: "Clothing",
            stock: 40,
            imageUrl: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
            ratings: 4.6,
            numReviews: 32
        },
        {
            name: "Running Shoes",
            description: "Lightweight shoes for running.",
            price: 110,
            category: "Clothing",
            stock: 35,
            imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
            ratings: 4.7,
            numReviews: 55
        },
        {
            name: "Non-Stick Frying Pan",
            description: "Premium non-stick cookware.",
            price: 39.99,
            category: "Kitchen",
            stock: 60,
            imageUrl: "https://images.unsplash.com/photo-1584990347449-ae5c7f94f84d",
            ratings: 4.5,
            numReviews: 28
        },
        {
            name: "Coffee Maker",
            description: "Automatic coffee machine for home.",
            price: 99.99,
            category: "Kitchen",
            stock: 15,
            imageUrl: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6",
            ratings: 4.8,
            numReviews: 61
        },
        {
            name: "The Pragmatic Programmer",
            description: "One of the best software engineering books.",
            price: 42,
            category: "Books",
            stock: 100,
            imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
            ratings: 4.9,
            numReviews: 140
        },
        {
            name: "Atomic Habits",
            description: "Build good habits and break bad ones.",
            price: 20,
            category: "Books",
            stock: 120,
            imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
            ratings: 4.9,
            numReviews: 250
        },
        {
            name: "Yoga Mat",
            description: "High-density anti-slip yoga mat.",
            price: 29.99,
            category: "Fitness",
            stock: 70,
            imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a",
            ratings: 4.6,
            numReviews: 38
        },
        {
            name: "Adjustable Dumbbells",
            description: "Perfect for home workouts.",
            price: 180,
            category: "Fitness",
            stock: 10,
            imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
            ratings: 4.8,
            numReviews: 26
        },
        {
            name: "Leather Wallet",
            description: "Premium genuine leather wallet.",
            price: 35,
            category: "Accessories",
            stock: 45,
            imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93",
            ratings: 4.4,
            numReviews: 22
        },
        {
            name: "Decorative Table Lamp",
            description: "Modern LED bedside table lamp.",
            price: 55,
            category: "Home Decor",
            stock: 28,
            imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
            ratings: 4.5,
            numReviews: 17
        },
        // ================== Beauty ==================
        {
            name: "Vitamin C Face Serum",
            description: "Brightens skin and reduces dark spots.",
            price: 24.99,
            category: "Beauty",
            stock: 60,
            imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be",
            ratings: 4.6,
            numReviews: 41
        },
        {
            name: "Hair Dryer",
            description: "Professional hair dryer with multiple heat settings.",
            price: 49.99,
            category: "Beauty",
            stock: 20,
            imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
            ratings: 4.4,
            numReviews: 22
        },

        // ================== Home Appliances ==================
        {
            name: "Air Purifier",
            description: "HEPA air purifier for clean indoor air.",
            price: 199.99,
            category: "Home Appliances",
            stock: 18,
            imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
            ratings: 4.7,
            numReviews: 35
        },
        {
            name: "Robot Vacuum Cleaner",
            description: "Automatic smart vacuum cleaner.",
            price: 349.99,
            category: "Home Appliances",
            stock: 12,
            imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
            ratings: 4.8,
            numReviews: 58
        },

        // ================== Mobile Accessories ==================
        {
            name: "Fast Charging Power Bank",
            description: "20000mAh portable power bank.",
            price: 39.99,
            category: "Mobile Accessories",
            stock: 55,
            imageUrl: "https://images.unsplash.com/photo-1609592806596-b43fdbcae3f6",
            ratings: 4.5,
            numReviews: 72
        },
        {
            name: "USB-C Fast Charger",
            description: "65W USB-C charger for laptops and phones.",
            price: 29.99,
            category: "Mobile Accessories",
            stock: 80,
            imageUrl: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0",
            ratings: 4.6,
            numReviews: 48
        },

        // ================== Bags ==================
        {
            name: "Travel Backpack",
            description: "Water-resistant backpack with laptop compartment.",
            price: 69.99,
            category: "Bags",
            stock: 32,
            imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
            ratings: 4.8,
            numReviews: 63
        },
        {
            name: "Leather Office Bag",
            description: "Premium office messenger bag.",
            price: 95,
            category: "Bags",
            stock: 18,
            imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa",
            ratings: 4.5,
            numReviews: 25
        },

        // ================== Watches ==================
        {
            name: "Luxury Analog Watch",
            description: "Elegant stainless steel wrist watch.",
            price: 149.99,
            category: "Watches",
            stock: 25,
            imageUrl: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49",
            ratings: 4.7,
            numReviews: 39
        },
        {
            name: "Digital Sports Watch",
            description: "Water-resistant sports watch.",
            price: 59.99,
            category: "Watches",
            stock: 40,
            imageUrl: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9",
            ratings: 4.4,
            numReviews: 28
        },

        // ================== Toys ==================
        {
            name: "Remote Control Car",
            description: "Rechargeable high-speed RC car.",
            price: 54.99,
            category: "Toys",
            stock: 35,
            imageUrl: "https://images.unsplash.com/photo-1558060370-d644479cb6f7",
            ratings: 4.5,
            numReviews: 31
        },
        {
            name: "Building Blocks Set",
            description: "Creative educational building block kit.",
            price: 39.99,
            category: "Toys",
            stock: 50,
            imageUrl: "https://images.unsplash.com/photo-1587654780291-39c9404d746b",
            ratings: 4.8,
            numReviews: 52
        },

        // ================== Groceries ==================
        {
            name: "Organic Honey",
            description: "Pure natural organic honey.",
            price: 14.99,
            category: "Groceries",
            stock: 120,
            imageUrl: "https://images.unsplash.com/photo-1587049352851-8d4e89133924",
            ratings: 4.9,
            numReviews: 74
        },
        {
            name: "Premium Basmati Rice",
            description: "5kg premium long-grain basmati rice.",
            price: 29.99,
            category: "Groceries",
            stock: 90,
            imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c",
            ratings: 4.6,
            numReviews: 55
        },

        // ================== Sports ==================
        {
            name: "Football",
            description: "Professional size football.",
            price: 25,
            category: "Sports",
            stock: 45,
            imageUrl: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d",
            ratings: 4.7,
            numReviews: 44
        },
        {
            name: "Cricket Bat",
            description: "English willow cricket bat.",
            price: 110,
            category: "Sports",
            stock: 18,
            imageUrl: "https://images.unsplash.com/photo-1624880357913-a8539238245b",
            ratings: 4.8,
            numReviews: 27
        },

        // ================== Stationery ==================
        {
            name: "Notebook Set",
            description: "Pack of 5 premium notebooks.",
            price: 18,
            category: "Stationery",
            stock: 80,
            imageUrl: "https://images.unsplash.com/photo-1531346878377-a5be20888e57",
            ratings: 4.5,
            numReviews: 40
        },
        {
            name: "Gel Pen Pack",
            description: "Smooth writing gel pens (20 pcs).",
            price: 12,
            category: "Stationery",
            stock: 150,
            imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a",
            ratings: 4.6,
            numReviews: 33
        },

        // ================== Pet Supplies ==================
        {
            name: "Dog Food Premium",
            description: "Nutritious dog food for adult dogs.",
            price: 34.99,
            category: "Pet Supplies",
            stock: 45,
            imageUrl: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee",
            ratings: 4.8,
            numReviews: 46
        },
        {
            name: "Cat Scratching Post",
            description: "Durable scratching post for cats.",
            price: 49.99,
            category: "Pet Supplies",
            stock: 20,
            imageUrl: "https://images.unsplash.com/photo-1519052537078-e6302a4968d4",
            ratings: 4.5,
            numReviews: 21
        }

        ];

    await Product.insertMany(products);
    
    console.log('✅ Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error with data import: ${error.message}`);
    process.exit(1);
  }
};

importData();