import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: String,
  category: String,
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

async function checkProducts() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined');
    }

    await mongoose.connect(MONGODB_URI);
    const products = await Product.find({}, 'title category').limit(10);
    console.log(JSON.stringify(products, null, 2));
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkProducts();
