import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { productService } from '@/src/api/product.service';
import { useWishlist } from '@/src/state/useWishlist';
import { useCart } from '@/src/state/useCart';
import { useAuth } from '@/src/contexts/AuthContext';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const { items: wished, add: wishAdd, remove: wishRemove } = useWishlist();
  const { add: addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (id) {
      loadProduct();
      loadReviews();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      const data = await productService.getProductById(id as string);
      setProduct(data.product || data);
      if (data.product?.sizes?.[0] || data.sizes?.[0]) {
        setSelectedSize(data.product?.sizes?.[0] || data.sizes?.[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const data = await productService.getProductReviews(id as string);
      setReviews(data.reviews || data);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (product.sizes?.length && !selectedSize) {
      Alert.alert('Size Required', 'Please select a size');
      return;
    }

    addToCart(
      {
        _id: product._id,
        title: product.title,
        price: product.price,
        images: product.images,
        size: selectedSize,
        brand: product.brand,
        category: product.category,
      },
      quantity
    );
    Alert.alert('Success', 'Added to cart');
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    const isWished = wished.some((w) => w._id === product._id);
    if (isWished) {
      wishRemove(product._id);
    } else {
      wishAdd({
        _id: product._id,
        title: product.title,
        price: product.price,
        images: product.images,
      });
    }
  };

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      Alert.alert('Login Required', 'Please login to submit a review');
      router.push('/login');
      return;
    }

    if (!comment.trim()) {
      Alert.alert('Error', 'Please write a comment');
      return;
    }

    try {
      await productService.addProductReview(id as string, { rating, comment });
      Alert.alert('Success', 'Review submitted');
      setComment('');
      loadReviews();
    } catch (error) {
      Alert.alert('Error', 'Failed to submit review');
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#FF3E6C" />
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-600">Product not found</Text>
      </View>
    );
  }

  const isWished = wished.some((w) => w._id === product._id);
  const discount = Math.round((1 - product.price / (product.price * 1.5)) * 100);
  const averageRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : product.rating || 0;

  return (
    <View className="flex-1 bg-white">
      <ScrollView>
        <View className="relative">
          {product.images?.[0] ? (
            <Image
              source={{ uri: product.images[0] }}
              className="w-full h-96"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-96 bg-gray-200" />
          )}

          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-12 left-4 bg-white/90 p-2 rounded-full"
          >
            <Text className="text-xl">←</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleToggleWishlist}
            className="absolute top-12 right-4 bg-white/90 p-2 rounded-full"
          >
            <Text className="text-xl">{isWished ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>

        <View className="p-4">
          <View className="mb-4">
            <Text className="text-2xl font-bold text-secondary mb-1">{product.title}</Text>
            {product.brand && (
              <Text className="text-gray-600">
                {product.brand} • {product.category}
              </Text>
            )}
            <View className="flex-row items-center mt-2">
              <Text className="text-gray-700">⭐ {averageRating.toFixed(1)}</Text>
              <Text className="text-gray-500 ml-2">({reviews.length} reviews)</Text>
            </View>
          </View>

          <View className="border-t border-gray-200 pt-4 mb-4">
            <View className="flex-row items-center">
              <Text className="text-3xl font-bold text-primary mr-3">₹{product.price}</Text>
              <Text className="text-lg text-gray-400 line-through">
                ₹{Math.round(product.price * 1.5)}
              </Text>
              <Text className="text-green-600 ml-2 font-semibold">{discount}% OFF</Text>
            </View>
            <Text className="text-gray-600 mt-2">Inclusive of all taxes</Text>
          </View>

          {product.sizes?.length > 0 && (
            <View className="mb-4">
              <Text className="font-semibold text-secondary mb-2">Select Size</Text>
              <View className="flex-row flex-wrap gap-2">
                {product.sizes.map((size: string) => (
                  <TouchableOpacity
                    key={size}
                    onPress={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border ${
                      selectedSize === size
                        ? 'bg-primary border-primary'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    <Text
                      className={`font-medium ${
                        selectedSize === size ? 'text-white' : 'text-gray-700'
                      }`}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View className="mb-6">
            <Text className="font-semibold text-secondary mb-2">Quantity</Text>
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                className="bg-gray-200 px-4 py-2 rounded-lg"
              >
                <Text className="text-xl font-semibold">-</Text>
              </TouchableOpacity>
              <Text className="mx-6 text-lg font-semibold">{quantity}</Text>
              <TouchableOpacity
                onPress={() => setQuantity(quantity + 1)}
                className="bg-gray-200 px-4 py-2 rounded-lg"
              >
                <Text className="text-xl font-semibold">+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity onPress={handleAddToCart} className="bg-primary py-4 rounded-lg mb-6">
            <Text className="text-white text-center font-bold text-lg">Add to Cart</Text>
          </TouchableOpacity>

          <View className="border-t border-gray-200 pt-6">
            <Text className="text-xl font-bold text-secondary mb-4">
              Reviews ({reviews.length})
            </Text>

            <View className="mb-6 p-4 bg-gray-50 rounded-lg">
              <Text className="font-semibold text-secondary mb-3">Write a Review</Text>
              <View className="flex-row items-center mb-3">
                <Text className="mr-3">Rating:</Text>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => setRating(star)}>
                    <Text className="text-2xl mr-1">
                      {star <= rating ? '⭐' : '☆'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 mb-3 min-h-20"
                placeholder="Write your review..."
                value={comment}
                onChangeText={setComment}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <TouchableOpacity
                onPress={handleSubmitReview}
                className="bg-secondary py-3 rounded-lg"
              >
                <Text className="text-white text-center font-semibold">Submit Review</Text>
              </TouchableOpacity>
            </View>

            {reviews.length > 0 ? (
              <View>
                {reviews.map((review, index) => (
                  <View key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <View className="flex-row items-center mb-2">
                      <Text className="font-semibold mr-2">{review.userName || 'Anonymous'}</Text>
                      <View className="flex-row">
                        {[...Array(5)].map((_, i) => (
                          <Text key={i} className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}>
                            ★
                          </Text>
                        ))}
                      </View>
                    </View>
                    <Text className="text-gray-700">{review.comment}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text className="text-gray-500 text-center py-6">
                No reviews yet. Be the first to review!
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
