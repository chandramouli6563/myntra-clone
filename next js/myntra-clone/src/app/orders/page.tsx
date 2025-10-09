'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface OrderItem {
  product: string;
  title: string;
  image?: string;
  quantity: number;
  price: number;
}

interface TrackingStatus {
  stage: string;
  message: string;
  updatedAt: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  deliveryDate?: string;
  trackingStatus?: TrackingStatus[];
  cancellationReason?: string;
  rating?: {
    stars: number;
    review?: string;
  };
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelModal, setCancelModal] = useState<string | null>(null);
  const [trackModal, setTrackModal] = useState<Order | null>(null);
  const [ratingModal, setRatingModal] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const res = await fetch('/api/orders');
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch orders');
      }
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancelOrder() {
    if (!cancelModal || !cancelReason) return;
    
    setActionLoading(true);
    try {
      const res = await fetch('/api/orders/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: cancelModal, reason: cancelReason }),
      });

      if (!res.ok) throw new Error((await res.json()).message);
      
      await fetchOrders();
      setCancelModal(null);
      setCancelReason('');
      alert('Order cancelled successfully');
    } catch (error: any) {
      alert(error.message || 'Failed to cancel order');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleTrackOrder(orderId: string) {
    try {
      const res = await fetch(`/api/orders/track?orderId=${orderId}`);
      if (!res.ok) throw new Error('Failed to track order');
      
      const data = await res.json();
      setTrackModal(data.order);
      await fetchOrders();
    } catch (error: any) {
      alert(error.message || 'Failed to track order');
    }
  }

  async function handleAddRating() {
    if (!ratingModal) return;

    setActionLoading(true);
    try {
      const res = await fetch('/api/orders/rating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: ratingModal._id, stars: rating, review }),
      });

      if (!res.ok) throw new Error((await res.json()).message);
      
      await fetchOrders();
      setRatingModal(null);
      setReview('');
      setRating(5);
      alert('Thank you for your rating!');
    } catch (error: any) {
      alert(error.message || 'Failed to add rating');
    } finally {
      setActionLoading(false);
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'processing':
      case 'shipped':
        return 'text-blue-500';
      case 'delivered':
        return 'text-[#26a541]';
      case 'cancelled':
        return 'text-red-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  }

  function getStatusText(status: string) {
    switch (status) {
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      case 'failed':
        return 'Payment Failed';
      default:
        return 'Pending';
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0B7FB3]"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md px-4"
        >
          <div className="w-48 h-48 mx-auto mb-8 relative">
            <Image
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800&auto=format&fit=crop"
              alt="No orders"
              fill
              className="object-contain opacity-50"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Orders Yet!</h2>
          <p className="text-gray-600 mb-8">You haven't placed any orders. Start shopping to see your orders here.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-[#0B7FB3] text-white px-8 py-3 rounded-md font-semibold hover:bg-[#0969A0] transition-colors"
          >
            Start Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-1">{orders.length} {orders.length === 1 ? 'Order' : 'Orders'}</p>
        </div>

        <div className="space-y-4">
          {orders.map((order, index) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 pb-4 border-b border-gray-200">
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-gray-900">Order #{order.orderNumber}</h3>
                      <span className={`text-sm font-semibold ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span>
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                      {order.deliveryDate && order.status !== 'cancelled' && (
                        <span className="text-[#26a541] font-medium">
                          {order.status === 'delivered' ? 'Delivered on' : 'Delivery by'}{' '}
                          {new Date(order.deliveryDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                    <p className="text-2xl font-bold text-gray-900">₹{order.totalAmount}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {order.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex gap-4">
                      <div className="relative w-20 h-24 md:w-24 md:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={item.image || 'https://images.unsplash.com/photo-1520975922284-5f573fb8c642?q=80&w=800&auto=format&fit=crop'}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Qty: {item.quantity}</span>
                          <span className="font-semibold text-gray-900">₹{item.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {order.cancellationReason && (
                  <div className="mt-4 p-3 bg-red-50 rounded-md">
                    <p className="text-sm text-red-700">
                      <strong>Cancellation Reason:</strong> {order.cancellationReason}
                    </p>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-gray-200 flex flex-wrap gap-3">
                  {(order.status === 'processing' || order.status === 'shipped') && (
                    <>
                      <button
                        onClick={() => handleTrackOrder(order._id)}
                        className="px-6 py-2 bg-[#0B7FB3] text-white rounded-md font-semibold hover:bg-[#0969A0] transition-colors"
                      >
                        Track Order
                      </button>
                      <button
                        onClick={() => setCancelModal(order._id)}
                        className="px-6 py-2 border border-red-500 text-red-500 rounded-md font-semibold hover:bg-red-50 transition-colors"
                      >
                        Cancel Order
                      </button>
                    </>
                  )}
                  
                  {order.status === 'delivered' && !order.rating && (
                    <button
                      onClick={() => setRatingModal(order)}
                      className="px-6 py-2 bg-[#26a541] text-white rounded-md font-semibold hover:bg-[#1f8836] transition-colors"
                    >
                      Rate Order
                    </button>
                  )}

                  {order.status === 'delivered' && order.rating && (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex text-yellow-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-5 h-5 ${star <= order.rating!.stars ? 'fill-current' : 'fill-none stroke-current'}`}
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-gray-600">Your Rating</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Cancel Modal */}
      <AnimatePresence>
        {cancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setCancelModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Cancel Order</h3>
              <p className="text-gray-600 mb-4">Please select a reason for cancelling this order:</p>
              
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#0B7FB3] focus:outline-none mb-6"
                required
              >
                <option value="">Select reason...</option>
                <option value="Changed my mind">Changed my mind</option>
                <option value="Found better price">Found better price</option>
                <option value="Ordered by mistake">Ordered by mistake</option>
                <option value="Delivery time too long">Delivery time too long</option>
                <option value="Want to modify order">Want to modify order</option>
                <option value="Other reasons">Other reasons</option>
              </select>

              <div className="flex gap-3">
                <button
                  onClick={() => setCancelModal(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md font-semibold hover:bg-gray-50"
                  disabled={actionLoading}
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={!cancelReason || actionLoading}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? 'Cancelling...' : 'Cancel Order'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Track Modal */}
      <AnimatePresence>
        {trackModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setTrackModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Track Order #{trackModal.orderNumber}</h3>
              
              <div className="space-y-4">
                {trackModal.trackingStatus?.map((track, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        idx === (trackModal.trackingStatus?.length || 0) - 1 
                          ? 'bg-[#0B7FB3] text-white' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {idx === (trackModal.trackingStatus?.length || 0) - 1 ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span className="text-sm font-bold">{idx + 1}</span>
                        )}
                      </div>
                      {idx < (trackModal.trackingStatus?.length || 0) - 1 && (
                        <div className="w-0.5 h-16 bg-gray-200 my-1"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <p className="font-semibold text-gray-900 capitalize">
                        {track.stage.replace('_', ' ')}
                      </p>
                      <p className="text-sm text-gray-600">{track.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(track.updatedAt).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setTrackModal(null)}
                className="mt-6 w-full px-4 py-2 bg-[#0B7FB3] text-white rounded-md font-semibold hover:bg-[#0969A0]"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rating Modal */}
      <AnimatePresence>
        {ratingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setRatingModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Rate Your Order</h3>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-3">How would you rate this order?</p>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="text-3xl transition-colors"
                    >
                      <svg
                        className={`w-10 h-10 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Write a review (optional)
                </label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#0B7FB3] focus:outline-none resize-none"
                  rows={4}
                  placeholder="Share your experience with this order..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setRatingModal(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md font-semibold hover:bg-gray-50"
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddRating}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 bg-[#0B7FB3] text-white rounded-md font-semibold hover:bg-[#0969A0] disabled:opacity-50"
                >
                  {actionLoading ? 'Submitting...' : 'Submit Rating'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
