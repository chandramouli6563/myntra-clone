import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  originalPrice: Number,
  discount: Number,
  images: [String],
  category: String,
  brand: String,
  rating: Number,
  stock: Number,
  sizes: [String],
  colors: [String],
  reviews: [{
    user: String,
    rating: Number,
    comment: String,
    date: Date
  }],
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const products = [
  // MEN'S CATEGORY
  {
    title: "Classic Fit Polo T-Shirt",
    description: "Premium cotton polo t-shirt with classic fit. Perfect for casual and semi-formal occasions.",
    price: 899,
    originalPrice: 1499,
    discount: 40,
    images: ["https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?q=80&w=800&auto=format&fit=crop"],
    category: "men",
    brand: "Nike",
    rating: 4.5,
    stock: 45,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Navy Blue", "Grey"],
    reviews: []
  },
  {
    title: "Men's Slim Fit Denim Jeans",
    description: "Comfortable stretch denim with modern slim fit. Five-pocket styling.",
    price: 1799,
    originalPrice: 2999,
    discount: 40,
    images: ["https://images.unsplash.com/photo-1542272454315-7f6d5c8c7c9d?q=80&w=800&auto=format&fit=crop"],
    category: "men",
    brand: "Levis",
    rating: 4.3,
    stock: 30,
    sizes: ["30", "32", "34", "36", "38"],
    colors: ["Blue", "Black", "Grey"],
    reviews: []
  },
  {
    title: "Men's Casual Crew Neck T-Shirt",
    description: "Soft cotton blend crew neck t-shirt. Everyday comfort wear.",
    price: 599,
    originalPrice: 999,
    discount: 40,
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop"],
    category: "men",
    brand: "H&M",
    rating: 4.2,
    stock: 60,
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Black", "Red", "Green"],
    reviews: []
  },
  {
    title: "Athletic Performance Tank Top",
    description: "Moisture-wicking fabric for intense workouts. Breathable mesh panels.",
    price: 749,
    originalPrice: 1249,
    discount: 40,
    images: ["https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop"],
    category: "men",
    brand: "Puma",
    rating: 4.6,
    stock: 40,
    sizes: ["M", "L", "XL"],
    colors: ["Black", "Blue", "Red"],
    reviews: []
  },
  {
    title: "Formal Cotton Shirt - Slim Fit",
    description: "Premium formal shirt with wrinkle-resistant fabric. Perfect for office wear.",
    price: 1299,
    originalPrice: 2599,
    discount: 50,
    images: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop"],
    category: "men",
    brand: "Zara",
    rating: 4.4,
    stock: 25,
    sizes: ["38", "40", "42", "44"],
    colors: ["White", "Light Blue", "Pink"],
    reviews: []
  },

  // WOMEN'S CATEGORY
  {
    title: "Floral Summer Dress",
    description: "Lightweight floral print dress perfect for summer. Comfortable and stylish.",
    price: 1499,
    images: ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop"],
    category: "women",
    brand: "Zara",
    rating: 4.7,
    stock: 35,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Blue", "Pink", "Yellow"],
    reviews: []
  },
  {
    title: "Women's Casual Top",
    description: "Soft cotton blend top with relaxed fit. Perfect for everyday wear.",
    price: 799,
    images: ["https://images.unsplash.com/photo-1564859228273-274232fdb516?q=80&w=800&auto=format&fit=crop"],
    category: "women",
    brand: "H&M",
    rating: 4.3,
    stock: 50,
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Black", "Beige"],
    reviews: []
  },
  {
    title: "High-Waisted Skinny Jeans",
    description: "Stretchy denim with high-rise waist. Flattering skinny fit.",
    price: 1899,
    images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop"],
    category: "women",
    brand: "Forever 21",
    rating: 4.5,
    stock: 40,
    sizes: ["26", "28", "30", "32"],
    colors: ["Blue", "Black"],
    reviews: []
  },
  {
    title: "Elegant Evening Gown",
    description: "Stunning floor-length gown for special occasions. Premium fabric.",
    price: 3999,
    images: ["https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop"],
    category: "women",
    brand: "Mango",
    rating: 4.8,
    stock: 15,
    sizes: ["S", "M", "L"],
    colors: ["Black", "Red", "Navy Blue"],
    reviews: []
  },
  {
    title: "Women's Sports Leggings",
    description: "High-performance leggings with compression support. Perfect for yoga and gym.",
    price: 1199,
    images: ["https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=800&auto=format&fit=crop"],
    category: "women",
    brand: "Nike",
    rating: 4.6,
    stock: 45,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black", "Grey", "Purple"],
    reviews: []
  },

  // KIDS CATEGORY
  {
    title: "Kids Cotton Graphic T-Shirt",
    description: "Fun graphic print t-shirt for kids. 100% soft cotton.",
    price: 499,
    images: ["https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=800&auto=format&fit=crop"],
    category: "kids",
    brand: "GAP Kids",
    rating: 4.4,
    stock: 55,
    sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"],
    colors: ["Blue", "Red", "Yellow"],
    reviews: []
  },
  {
    title: "Kids Denim Shorts",
    description: "Comfortable denim shorts for active kids. Adjustable waist.",
    price: 699,
    images: ["https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?q=80&w=800&auto=format&fit=crop"],
    category: "kids",
    brand: "Carters",
    rating: 4.3,
    stock: 40,
    sizes: ["2-3Y", "4-5Y", "6-7Y"],
    colors: ["Blue", "Black"],
    reviews: []
  },
  {
    title: "Kids Party Dress",
    description: "Beautiful party dress with frills and bows. Perfect for special occasions.",
    price: 1299,
    images: ["https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=800&auto=format&fit=crop"],
    category: "kids",
    brand: "H&M Kids",
    rating: 4.6,
    stock: 30,
    sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"],
    colors: ["Pink", "White", "Purple"],
    reviews: []
  },

  // FOOTWEAR CATEGORY
  {
    title: "Men's Running Shoes",
    description: "Lightweight running shoes with superior cushioning. Breathable mesh upper.",
    price: 2999,
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop"],
    category: "footwear",
    brand: "Nike",
    rating: 4.7,
    stock: 35,
    sizes: ["7", "8", "9", "10", "11"],
    colors: ["Black", "White", "Blue"],
    reviews: []
  },
  {
    title: "Women's Casual Sneakers",
    description: "Trendy casual sneakers with comfortable fit. All-day comfort.",
    price: 1899,
    images: ["https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=800&auto=format&fit=crop"],
    category: "footwear",
    brand: "Adidas",
    rating: 4.5,
    stock: 40,
    sizes: ["5", "6", "7", "8", "9"],
    colors: ["White", "Pink", "Black"],
    reviews: []
  },
  {
    title: "Men's Formal Leather Shoes",
    description: "Classic leather oxford shoes. Perfect for formal occasions.",
    price: 3499,
    images: ["https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop"],
    category: "footwear",
    brand: "Clarks",
    rating: 4.6,
    stock: 25,
    sizes: ["7", "8", "9", "10", "11"],
    colors: ["Black", "Brown"],
    reviews: []
  },
  {
    title: "Women's High Heels",
    description: "Elegant high heels for parties and events. Comfortable heel height.",
    price: 2499,
    images: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop"],
    category: "footwear",
    brand: "Steve Madden",
    rating: 4.4,
    stock: 30,
    sizes: ["5", "6", "7", "8"],
    colors: ["Black", "Red", "Nude"],
    reviews: []
  },

  // ACCESSORIES CATEGORY
  {
    title: "Leather Messenger Bag",
    description: "Premium leather messenger bag with multiple compartments. Professional look.",
    price: 3999,
    images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop"],
    category: "accessories",
    brand: "Fossil",
    rating: 4.7,
    stock: 20,
    sizes: ["One Size"],
    colors: ["Brown", "Black"],
    reviews: []
  },
  {
    title: "Classic Analog Watch",
    description: "Stainless steel watch with leather strap. Water-resistant.",
    price: 4999,
    images: ["https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800&auto=format&fit=crop"],
    category: "accessories",
    brand: "Fossil",
    rating: 4.8,
    stock: 25,
    sizes: ["One Size"],
    colors: ["Silver", "Gold", "Black"],
    reviews: []
  },
  {
    title: "Women's Tote Bag",
    description: "Spacious tote bag perfect for daily use. Multiple pockets.",
    price: 1999,
    images: ["https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop"],
    category: "accessories",
    brand: "Michael Kors",
    rating: 4.5,
    stock: 30,
    sizes: ["One Size"],
    colors: ["Black", "Brown", "Beige"],
    reviews: []
  },
  {
    title: "Polarized Sunglasses",
    description: "UV protection sunglasses with polarized lenses. Trendy design.",
    price: 1499,
    images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop"],
    category: "accessories",
    brand: "Ray-Ban",
    rating: 4.6,
    stock: 40,
    sizes: ["One Size"],
    colors: ["Black", "Brown", "Blue"],
    reviews: []
  },

  // BEAUTY CATEGORY
  {
    title: "Matte Lipstick - Ruby Red",
    description: "Long-lasting matte lipstick with rich color payoff. Moisturizing formula.",
    price: 499,
    images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop"],
    category: "beauty",
    brand: "Maybelline",
    rating: 4.5,
    stock: 100,
    sizes: ["One Size"],
    colors: ["Red", "Pink", "Nude", "Mauve"],
    reviews: []
  },
  {
    title: "Hydrating Face Wash",
    description: "Gentle face wash with hyaluronic acid. Suitable for all skin types.",
    price: 349,
    images: ["https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=800&auto=format&fit=crop"],
    category: "beauty",
    brand: "Neutrogena",
    rating: 4.6,
    stock: 80,
    sizes: ["100ml", "200ml"],
    colors: [],
    reviews: []
  },
  {
    title: "Vitamin C Serum",
    description: "Brightening serum with 10% Vitamin C. Reduces dark spots and fine lines.",
    price: 899,
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop"],
    category: "beauty",
    brand: "The Ordinary",
    rating: 4.7,
    stock: 60,
    sizes: ["30ml"],
    colors: [],
    reviews: []
  },
  {
    title: "Kajal - Black",
    description: "Smudge-proof kajal with intense black color. Long-lasting formula.",
    price: 199,
    images: ["https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800&auto=format&fit=crop"],
    category: "beauty",
    brand: "Lakme",
    rating: 4.4,
    stock: 120,
    sizes: ["One Size"],
    colors: ["Black"],
    reviews: []
  },
  {
    title: "Moisturizing Cream - SPF 30",
    description: "Daily moisturizer with sun protection. Non-greasy formula.",
    price: 599,
    images: ["https://images.unsplash.com/photo-1571875257727-256c39da42af?q=80&w=800&auto=format&fit=crop"],
    category: "beauty",
    brand: "Neutrogena",
    rating: 4.5,
    stock: 70,
    sizes: ["50ml", "100ml"],
    colors: [],
    reviews: []
  },
  {
    title: "Nail Polish Set",
    description: "Set of 5 trendy nail polish shades. Quick-dry formula.",
    price: 699,
    images: ["https://images.unsplash.com/photo-1610992015732-2449b76344bc?q=80&w=800&auto=format&fit=crop"],
    category: "beauty",
    brand: "Maybelline",
    rating: 4.3,
    stock: 50,
    sizes: ["One Size"],
    colors: ["Red", "Pink", "Nude", "Black", "Blue"],
    reviews: []
  },
  {
    title: "Compact Powder",
    description: "Oil-control compact powder for matte finish. Suitable for all skin tones.",
    price: 449,
    images: ["https://images.unsplash.com/photo-1596704017254-9b121068ec31?q=80&w=800&auto=format&fit=crop"],
    category: "beauty",
    brand: "Lakme",
    rating: 4.4,
    stock: 90,
    sizes: ["One Size"],
    colors: ["Fair", "Medium", "Deep"],
    reviews: []
  }
];

async function seedDatabase() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');

    console.log('Clearing existing products...');
    await Product.deleteMany({});
    console.log('Existing products cleared');

    console.log('Inserting new products...');
    const inserted = await Product.insertMany(products);
    console.log(`Successfully inserted ${inserted.length} products`);

    console.log('\nProducts by category:');
    const categories = ['men', 'women', 'kids', 'footwear', 'accessories', 'beauty'];
    for (const category of categories) {
      const count = await Product.countDocuments({ category });
      console.log(`  ${category}: ${count} products`);
    }

    await mongoose.connection.close();
    console.log('\nDatabase seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
