require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Product = require('./models/product.model');
const Customer = require('./models/customer.model');

const products = [
  {
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and studio-quality sound. Perfect for work, travel, and music lovers.',
    price: 7999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    stock: 25
  },
  {
    name: 'Mechanical Gaming Keyboard',
    description: 'Compact TKL mechanical keyboard with Cherry MX switches, per-key RGB lighting, and a durable aluminium frame. Ideal for gamers and fast typists.',
    price: 4499,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&q=80',
    stock: 18
  },
  {
    name: '4K Ultra HD Smart TV – 55"',
    description: 'Crystal-clear 4K display with HDR10+, built-in Google TV, Dolby Atmos sound, and multiple HDMI 2.1 ports. Streaming and gaming in one sleek package.',
    price: 49999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&q=80',
    stock: 8
  },
  {
    name: 'Smartwatch Pro Series 7',
    description: 'Health-tracking smartwatch with blood oxygen monitor, ECG, GPS, 18-hour battery, and a beautiful always-on AMOLED display.',
    price: 18999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    stock: 30
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: 'Waterproof IPX7 portable speaker with 360° surround sound, 24-hour playtime, and built-in powerbank. Your adventure companion.',
    price: 3299,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80',
    stock: 40
  },
  {
    name: 'Men\'s Classic Fit Oxford Shirt',
    description: 'Crisp 100% cotton oxford shirt with a tailored collar and button-down front. Available in multiple colours. Dress it up or keep it casual.',
    price: 1299,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1602810316693-3667c854239a?w=600&q=80',
    stock: 60
  },
  {
    name: 'Women\'s Slim Fit Denim Jacket',
    description: 'Vintage-washed denim jacket with a modern slim cut, side pockets, and premium quality metal buttons. A wardrobe staple.',
    price: 2199,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&q=80',
    stock: 35
  },
  {
    name: 'Running Sneakers – Lightweight',
    description: 'Breathable mesh upper with a responsive foam midsole. Designed for daily running, cross-training, and casual wear. Sizes 6–12.',
    price: 3599,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    stock: 50
  },
  {
    name: 'Leather Bifold Wallet',
    description: 'Handcrafted genuine leather wallet with 6 card slots, 2 bill compartments, and RFID blocking. Slim profile, built to last.',
    price: 899,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80',
    stock: 75
  },
  {
    name: 'Atomic Habits',
    description: 'James Clear\'s groundbreaking guide to building good habits and breaking bad ones. Over 10 million copies sold. A must-read for self-improvement.',
    price: 449,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80',
    stock: 100
  },
  {
    name: 'The Psychology of Money',
    description: 'Morgan Housel explores timeless lessons on wealth, greed, and happiness through 19 short stories. Essential reading for anyone dealing with money.',
    price: 399,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&q=80',
    stock: 80
  },
  {
    name: 'Deep Work',
    description: 'Cal Newport\'s rules for focused success in a distracted world. Learn how to master hard things, produce at an elite level, and find meaning in your work.',
    price: 499,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80',
    stock: 65
  },
  {
    name: 'Ergonomic Office Chair',
    description: 'Lumbar support, adjustable armrests, breathable mesh back, and 360° swivel. Designed for 8+ hour comfort during long work-from-home sessions.',
    price: 12999,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80',
    stock: 15
  },
  {
    name: 'Stainless Steel French Press – 1L',
    description: 'Double-walled insulated French press that keeps coffee hot for 2 hours. BPA-free, dishwasher safe, and brews a rich, full-bodied cup every time.',
    price: 1799,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
    stock: 45
  },
  {
    name: 'Smart LED Desk Lamp',
    description: 'Touch-sensitive LED lamp with 5 brightness levels, 3 colour temperatures, USB-A charging port, and a flexible gooseneck arm. Eye-care certified.',
    price: 1499,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80',
    stock: 3
  },
  {
    name: 'Bamboo Cutting Board Set',
    description: 'Set of 3 eco-friendly bamboo cutting boards in graduated sizes. Naturally antimicrobial, gentle on knife edges, and easy to clean.',
    price: 699,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
    stock: 0
  },
  {
    name: 'Wireless Charging Pad – 15W',
    description: 'Ultra-fast 15W Qi-certified wireless charger compatible with iPhone 15 and all Qi-enabled Android phones. LED indicator, no more cable hunting.',
    price: 999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1591439657848-9f4b9ce436b9?w=600&q=80',
    stock: 55
  },
  {
    name: 'Women\'s Oversized Hoodie',
    description: 'Ultra-soft cotton-blend fleece hoodie with a relaxed oversized fit, kangaroo pocket, and cosy lined hood. Your new favourite loungewear.',
    price: 1599,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80',
    stock: 2
  }
];

const testUser = {
  fullName: 'Demo User',
  email: 'demo@shopkart.com',
  password: 'demo1234',
  phone: '9876543210'
};

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    console.log('Cleared existing products');

    const inserted = await Product.insertMany(products);
    console.log(`Inserted ${inserted.length} products`);

    const existingUser = await Customer.findOne({ email: testUser.email });
    if (!existingUser) {
      const hashed = await bcrypt.hash(testUser.password, 10);
      await Customer.create({ ...testUser, password: hashed });
      console.log(`Created test user: ${testUser.email} / ${testUser.password}`);
    } else {
      console.log(`Test user already exists: ${testUser.email}`);
    }

    console.log('\nDone. Log in with:');
    console.log(`  Email:    ${testUser.email}`);
    console.log(`  Password: ${testUser.password}`);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
