import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useWishlist } from '@/src/state/useWishlist';
import { useCart } from '@/src/state/useCart';
import { productService } from '@/src/api/product.service';

type Product = {
  _id: string;
  title: string;
  price: number;
  images: string[];
  rating?: number;
  category: string;
  brand?: string;
  sizes?: string[];
};

const banners = [
  'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200',
];

const categories = [
  { name: 'Men', slug: 'men' },
  { name: 'Women', slug: 'women' },
  { name: 'Kids', slug: 'kids' },
  { name: 'Beauty', slug: 'beauty' },
  { name: 'Home', slug: 'home' },
];

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { items: wished, add: wishAdd, remove: wishRemove } = useWishlist();
  const { add: addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts({
        category: selectedCategory || undefined,
      });
      setProducts(data.products || data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter((p) =>
    query ? p.title.toLowerCase().includes(query.toLowerCase()) : true
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#FF3E6C" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        <Text className="text-3xl font-bold text-secondary mb-2">Discover</Text>
        <Text className="text-gray-600 mb-4">Find your perfect style</Text>

        <View className="mb-4">
          <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
            <Text className="text-gray-400 mr-2">🔍</Text>
            <TextInput
              placeholder="Search for products..."
              value={query}
              onChangeText={setQuery}
              className="flex-1 text-base"
            />
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          {banners.map((img, i) => (
            <Image
              key={i}
              source={{ uri: img }}
              className="w-80 h-40 rounded-2xl mr-3"
              resizeMode="cover"
            />
          ))}
        </ScrollView>

        <Text className="text-xl font-bold text-secondary mb-3">Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
          <TouchableOpacity
            onPress={() => setSelectedCategory('')}
            className={`px-5 py-2 rounded-full mr-2 ${
              selectedCategory === '' ? 'bg-primary' : 'bg-gray-100'
            }`}
          >
            <Text className={`font-medium ${selectedCategory === '' ? 'text-white' : 'text-gray-700'}`}>
              All
            </Text>
          </TouchableOpacity>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.slug}
              onPress={() => setSelectedCategory(cat.slug)}
              className={`px-5 py-2 rounded-full mr-2 ${
                selectedCategory === cat.slug ? 'bg-primary' : 'bg-gray-100'
              }`}
            >
              <Text
                className={`font-medium ${
                  selectedCategory === cat.slug ? 'text-white' : 'text-gray-700'
                }`}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold text-secondary">Products</Text>
          <Text className="text-gray-600">{filtered.length} items</Text>
        </View>
      </View>

      <View className="px-2">
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={{ gap: 8, paddingHorizontal: 8 }}
          contentContainerStyle={{ gap: 8 }}
          renderItem={({ item }) => {
            const discount = Math.round(Math.random() * 40 + 20);
            const isWished = wished.some((w) => w._id === item._id);

            return (
              <View className="flex-1 bg-white rounded-xl overflow-hidden border border-gray-200">
                <TouchableOpacity onPress={() => router.push(`/product/${item._id}`)}>
                  {item.images?.[0] ? (
                    <Image
                      source={{ uri: item.images[0] }}
                      className="w-full h-48"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-full h-48 bg-gray-200" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    isWished
                      ? wishRemove(item._id)
                      : wishAdd({
                          _id: item._id,
                          title: item.title,
                          price: item.price,
                          images: item.images,
                        })
                  }
                  className="absolute top-2 right-2 bg-white/90 p-2 rounded-full"
                >
                  <Text className="text-base">{isWished ? '❤️' : '🤍'}</Text>
                </TouchableOpacity>

                <View className="p-3">
                  <Text numberOfLines={1} className="font-semibold text-secondary mb-1">
                    {item.title}
                  </Text>
                  {item.brand && (
                    <Text className="text-xs text-gray-500 mb-2">{item.brand}</Text>
                  )}
                  <View className="flex-row items-center mb-2">
                    <Text className="text-lg font-bold text-primary mr-2">₹{item.price}</Text>
                    <Text className="text-xs text-gray-400 line-through">
                      ₹{Math.round(item.price * 1.5)}
                    </Text>
                    <Text className="text-xs text-green-600 ml-2">{discount}% OFF</Text>
                  </View>
                  {item.rating && (
                    <View className="flex-row items-center mb-3">
                      <Text className="text-xs text-gray-600">⭐ {item.rating}</Text>
                    </View>
                  )}
                  <TouchableOpacity
                    onPress={() => {
                      addToCart({
                        _id: item._id,
                        title: item.title,
                        price: item.price,
                        images: item.images,
                        brand: item.brand,
                      });
                    }}
                    className="bg-primary py-2 rounded-lg"
                  >
                    <Text className="text-white text-center font-semibold">Add to Cart</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      </View>
    </ScrollView>
  );
}
