'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Address {
  _id?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  phone?: string;
}

interface PaymentMethod {
  _id?: string;
  type: 'card' | 'upi' | 'netbanking';
  last4: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  upiId?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  items: any[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [orderFilter, setOrderFilter] = useState('all');
  
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({ name: '', email: '', phone: '' });
  
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState<Address>({ line1: '', city: '', state: '', zip: '' });
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState<PaymentMethod>({ type: 'card', last4: '', brand: '' });

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [trackingData, setTrackingData] = useState<any>(null);

  useEffect(() => {
    fetchUserData();
    fetchOrders();
  }, []);

  async function fetchUserData() {
    try {
      const res = await fetch('/api/user/me');
      if (!res.ok) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      setUser(data);
      setProfileData({ name: data.name, email: data.email, phone: data.phone || '' });
    } catch (error) {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }

  async function fetchOrders() {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to fetch orders');
    }
  }

  async function updateProfile() {
    try {
      const res = await fetch('/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });
      if (res.ok) {
        const updated = await res.json();
        setUser(updated);
        setEditingProfile(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      alert('Failed to update profile');
    }
  }

  async function saveAddress() {
    try {
      const res = await fetch('/api/user/address', {
        method: editingAddress ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingAddress ? { ...addressForm, _id: editingAddress._id } : addressForm),
      });
      if (res.ok) {
        await fetchUserData();
        setShowAddressModal(false);
        setEditingAddress(null);
        setAddressForm({ line1: '', city: '', state: '', zip: '' });
        alert(editingAddress ? 'Address updated!' : 'Address added!');
      }
    } catch (error) {
      alert('Failed to save address');
    }
  }

  async function deleteAddress(id: string) {
    if (!confirm('Delete this address?')) return;
    try {
      const res = await fetch(`/api/user/address?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchUserData();
        alert('Address deleted');
      }
    } catch (error) {
      alert('Failed to delete address');
    }
  }

  async function savePaymentMethod() {
    try {
      const res = await fetch('/api/user/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentForm),
      });
      if (res.ok) {
        await fetchUserData();
        setShowPaymentModal(false);
        setPaymentForm({ type: 'card', last4: '', brand: '' });
        alert('Payment method added!');
      }
    } catch (error) {
      alert('Failed to save payment method');
    }
  }

  async function deletePaymentMethod(id: string) {
    if (!confirm('Delete this payment method?')) return;
    try {
      const res = await fetch(`/api/user/payment?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchUserData();
        alert('Payment method deleted');
      }
    } catch (error) {
      alert('Failed to delete payment method');
    }
  }

  async function handleCancelOrder() {
    if (!cancelReason) {
      alert('Please select a cancellation reason');
      return;
    }
    try {
      const res = await fetch('/api/orders/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: cancelOrderId, reason: cancelReason }),
      });
      if (res.ok) {
        await fetchOrders();
        setShowCancelModal(false);
        setCancelOrderId('');
        setCancelReason('');
        alert('Order cancelled successfully');
      } else {
        alert('Failed to cancel order');
      }
    } catch (error) {
      alert('Failed to cancel order');
    }
  }

  async function handleTrackOrder(orderId: string) {
    try {
      const res = await fetch(`/api/orders/track?orderId=${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setTrackingData(data);
        setShowTrackModal(true);
      } else {
        alert('Failed to fetch tracking information');
      }
    } catch (error) {
      alert('Failed to fetch tracking information');
    }
  }

  if (loading) {
    return <div className="container py-20 text-center">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6" style={{ color: '#0B7FB3' }}>My Dashboard</h1>
      
      <div className="grid md:grid-cols-4 gap-6">
        <aside className="md:col-span-1">
          <nav className="card p-4 space-y-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-[#0B7FB3] text-white' : 'hover:bg-neutral-900'}`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeTab === 'addresses' ? 'bg-[#0B7FB3] text-white' : 'hover:bg-neutral-900'}`}
            >
              Addresses
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeTab === 'payments' ? 'bg-[#0B7FB3] text-white' : 'hover:bg-neutral-900'}`}
            >
              Payment Methods
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-[#0B7FB3] text-white' : 'hover:bg-neutral-900'}`}
            >
              Order History
            </button>
          </nav>
        </aside>

        <main className="md:col-span-3">
          {activeTab === 'profile' && (
            <div className="card p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Profile Information</h2>
                {!editingProfile && (
                  <button onClick={() => setEditingProfile(true)} className="btn btn-outline">Edit Profile</button>
                )}
              </div>

              {editingProfile ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-1 text-white/80">Name</label>
                    <input
                      className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-white/10 focus:border-[#0B7FB3] focus:outline-none"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-white/80">Email</label>
                    <input
                      className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-white/10 focus:border-[#0B7FB3] focus:outline-none"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-white/80">Phone Number</label>
                    <input
                      className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-white/10 focus:border-[#0B7FB3] focus:outline-none"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={updateProfile} className="btn btn-primary">Save Changes</button>
                    <button onClick={() => setEditingProfile(false)} className="btn btn-outline">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-white/60">Name</p>
                    <p className="text-lg">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Email</p>
                    <p className="text-lg">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Phone Number</p>
                    <p className="text-lg">{user.phone || 'Not provided'}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="card p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Saved Addresses</h2>
                <button
                  onClick={() => {
                    setEditingAddress(null);
                    setAddressForm({ line1: '', city: '', state: '', zip: '' });
                    setShowAddressModal(true);
                  }}
                  className="btn btn-primary"
                >
                  Add New Address
                </button>
              </div>

              <div className="space-y-4">
                {user.addresses?.length === 0 && <p className="text-white/60">No saved addresses</p>}
                {user.addresses?.map((addr: any, idx: number) => (
                  <div key={idx} className="bg-neutral-900 p-4 rounded-lg">
                    <p className="font-medium">{addr.line1}</p>
                    {addr.line2 && <p className="text-sm text-white/70">{addr.line2}</p>}
                    <p className="text-sm text-white/70">{addr.city}, {addr.state} - {addr.zip}</p>
                    {addr.phone && <p className="text-sm text-white/70">Phone: {addr.phone}</p>}
                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => {
                          setEditingAddress(addr);
                          setAddressForm(addr);
                          setShowAddressModal(true);
                        }}
                        className="text-sm text-[#0B7FB3] hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteAddress(addr._id)}
                        className="text-sm text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="card p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Payment Methods</h2>
                <button onClick={() => setShowPaymentModal(true)} className="btn btn-primary">
                  Add Payment Method
                </button>
              </div>

              <div className="space-y-4">
                {user.paymentMethods?.length === 0 && <p className="text-white/60">No saved payment methods</p>}
                {user.paymentMethods?.map((pm: any, idx: number) => (
                  <div key={idx} className="bg-neutral-900 p-4 rounded-lg flex justify-between items-center">
                    <div>
                      {pm.type === 'card' && (
                        <>
                          <p className="font-medium">{pm.brand} •••• {pm.last4}</p>
                          <p className="text-sm text-white/70">Expires {pm.expiryMonth}/{pm.expiryYear}</p>
                        </>
                      )}
                      {pm.type === 'upi' && (
                        <p className="font-medium">UPI: {pm.upiId}</p>
                      )}
                      {pm.type === 'netbanking' && (
                        <p className="font-medium">Net Banking - {pm.brand}</p>
                      )}
                    </div>
                    <button
                      onClick={() => deletePaymentMethod(pm._id)}
                      className="text-sm text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="card p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Order History</h2>
                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-neutral-900 border border-white/10 focus:border-[#0B7FB3] focus:outline-none"
                >
                  <option value="all">All Orders</option>
                  <option value="processing">In Progress</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="space-y-4">
                {orders.length === 0 && <p className="text-white/60">No orders yet</p>}
                {orders
                  .filter((order) => {
                    if (orderFilter === 'all') return true;
                    if (orderFilter === 'processing') return order.status === 'processing' || order.status === 'paid';
                    return order.status === orderFilter;
                  })
                  .map((order) => (
                    <div key={order._id} className="bg-neutral-900 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-medium">Order #{order.orderNumber}</p>
                          <p className="text-sm text-white/70">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span
                          className="px-3 py-1 rounded-full text-sm font-medium"
                          style={{
                            backgroundColor: 
                              order.status === 'delivered' ? '#26a541' : 
                              order.status === 'cancelled' ? '#ff3f6c' :
                              order.status === 'shipped' ? '#0B7FB3' :
                              '#fbbf24',
                            color: 'white',
                          }}
                        >
                          {order.status === 'processing' ? 'In Progress' : 
                           order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>

                      {/* Product Images */}
                      <div className="flex gap-2 mb-3 overflow-x-auto">
                        {order.items.slice(0, 4).map((item: any, idx: number) => (
                          <img
                            key={idx}
                            src={item.image || 'https://images.unsplash.com/photo-1520975922284-5f573fb8c642?q=80&w=800&auto=format&fit=crop'}
                            alt={item.title}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        ))}
                        {order.items.length > 4 && (
                          <div className="w-16 h-16 bg-neutral-800 rounded-md flex items-center justify-center text-xs text-white/70">
                            +{order.items.length - 4}
                          </div>
                        )}
                      </div>

                      <p className="text-lg font-semibold mb-2">₹ {order.totalAmount}</p>
                      <p className="text-sm text-white/70 mb-3">{order.items.length} items</p>

                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => router.push('/orders')}
                          className="px-4 py-1.5 text-sm font-semibold rounded-md border border-[#0B7FB3] hover:bg-[#0B7FB3]/10"
                          style={{ color: '#0B7FB3' }}
                        >
                          View Details
                        </button>
                        {order.status !== 'cancelled' && order.status !== 'delivered' && (
                          <button
                            onClick={() => {
                              setCancelOrderId(order._id);
                              setShowCancelModal(true);
                            }}
                            className="px-4 py-1.5 text-sm font-semibold rounded-md border border-red-500 text-red-500 hover:bg-red-500/10"
                          >
                            Cancel
                          </button>
                        )}
                        {(order.status === 'shipped' || order.status === 'processing') && (
                          <button
                            onClick={() => handleTrackOrder(order._id)}
                            className="px-4 py-1.5 text-sm font-semibold rounded-md border border-[#0B7FB3] hover:bg-[#0B7FB3]/10"
                            style={{ color: '#0B7FB3' }}
                          >
                            Track
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                }
                {orders.filter((order) => {
                  if (orderFilter === 'all') return true;
                  if (orderFilter === 'processing') return order.status === 'processing' || order.status === 'paid';
                  return order.status === orderFilter;
                }).length === 0 && orders.length > 0 && (
                  <p className="text-white/60 text-center py-8">
                    No {orderFilter === 'all' ? '' : orderFilter} orders found
                  </p>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {showAddressModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-950 rounded-lg p-6 max-w-md w-full border border-white/10">
            <h3 className="text-xl font-semibold mb-4">{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
            <div className="space-y-3">
              <input
                className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-white/10 focus:border-[#ff3f6c] focus:outline-none"
                placeholder="Address Line 1"
                value={addressForm.line1}
                onChange={(e) => setAddressForm({ ...addressForm, line1: e.target.value })}
              />
              <input
                className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-white/10 focus:border-[#ff3f6c] focus:outline-none"
                placeholder="Address Line 2 (Optional)"
                value={addressForm.line2 || ''}
                onChange={(e) => setAddressForm({ ...addressForm, line2: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  className="px-4 py-2 rounded-lg bg-neutral-900 border border-white/10 focus:border-[#ff3f6c] focus:outline-none"
                  placeholder="City"
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                />
                <input
                  className="px-4 py-2 rounded-lg bg-neutral-900 border border-white/10 focus:border-[#ff3f6c] focus:outline-none"
                  placeholder="State"
                  value={addressForm.state}
                  onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                />
              </div>
              <input
                className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-white/10 focus:border-[#ff3f6c] focus:outline-none"
                placeholder="ZIP Code"
                value={addressForm.zip}
                onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })}
              />
              <input
                className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-white/10 focus:border-[#ff3f6c] focus:outline-none"
                placeholder="Phone (Optional)"
                value={addressForm.phone || ''}
                onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
              />
              <div className="flex gap-3 pt-3">
                <button onClick={saveAddress} className="btn btn-primary flex-1">
                  {editingAddress ? 'Update' : 'Add'} Address
                </button>
                <button
                  onClick={() => {
                    setShowAddressModal(false);
                    setEditingAddress(null);
                    setAddressForm({ line1: '', city: '', state: '', zip: '' });
                  }}
                  className="btn btn-outline flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-950 rounded-lg p-6 max-w-md w-full border border-white/10">
            <h3 className="text-xl font-semibold mb-4">Add Payment Method</h3>
            <div className="space-y-3">
              <select
                className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-white/10 focus:border-[#ff3f6c] focus:outline-none"
                value={paymentForm.type}
                onChange={(e) => setPaymentForm({ ...paymentForm, type: e.target.value as any })}
              >
                <option value="card">Credit/Debit Card</option>
                <option value="upi">UPI</option>
                <option value="netbanking">Net Banking</option>
              </select>

              {paymentForm.type === 'card' && (
                <>
                  <input
                    className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-white/10 focus:border-[#ff3f6c] focus:outline-none"
                    placeholder="Card Brand (e.g., Visa, Mastercard)"
                    value={paymentForm.brand || ''}
                    onChange={(e) => setPaymentForm({ ...paymentForm, brand: e.target.value })}
                  />
                  <input
                    className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-white/10 focus:border-[#ff3f6c] focus:outline-none"
                    placeholder="Last 4 digits"
                    maxLength={4}
                    value={paymentForm.last4}
                    onChange={(e) => setPaymentForm({ ...paymentForm, last4: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      className="px-4 py-2 rounded-lg bg-neutral-900 border border-white/10 focus:border-[#ff3f6c] focus:outline-none"
                      placeholder="Expiry Month (MM)"
                      type="number"
                      value={paymentForm.expiryMonth || ''}
                      onChange={(e) => setPaymentForm({ ...paymentForm, expiryMonth: parseInt(e.target.value) })}
                    />
                    <input
                      className="px-4 py-2 rounded-lg bg-neutral-900 border border-white/10 focus:border-[#ff3f6c] focus:outline-none"
                      placeholder="Expiry Year (YYYY)"
                      type="number"
                      value={paymentForm.expiryYear || ''}
                      onChange={(e) => setPaymentForm({ ...paymentForm, expiryYear: parseInt(e.target.value) })}
                    />
                  </div>
                </>
              )}

              {paymentForm.type === 'upi' && (
                <input
                  className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-white/10 focus:border-[#ff3f6c] focus:outline-none"
                  placeholder="UPI ID (e.g., yourname@paytm)"
                  value={paymentForm.upiId || ''}
                  onChange={(e) => setPaymentForm({ ...paymentForm, upiId: e.target.value, last4: e.target.value.slice(-4) })}
                />
              )}

              {paymentForm.type === 'netbanking' && (
                <input
                  className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-white/10 focus:border-[#ff3f6c] focus:outline-none"
                  placeholder="Bank Name"
                  value={paymentForm.brand || ''}
                  onChange={(e) => setPaymentForm({ ...paymentForm, brand: e.target.value, last4: 'BANK' })}
                />
              )}

              <div className="flex gap-3 pt-3">
                <button onClick={savePaymentMethod} className="btn btn-primary flex-1">Add Payment Method</button>
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setPaymentForm({ type: 'card', last4: '', brand: '' });
                  }}
                  className="btn btn-outline flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCancelModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-950 rounded-lg p-6 max-w-md w-full border border-white/10">
            <h3 className="text-xl font-semibold mb-4">Cancel Order</h3>
            <p className="text-white/70 mb-4">Please select a reason for cancellation:</p>
            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-white/10 focus:border-[#0B7FB3] focus:outline-none mb-4"
            >
              <option value="">-- Select Reason --</option>
              <option value="Changed my mind">Changed my mind</option>
              <option value="Found a better price">Found a better price</option>
              <option value="Ordered by mistake">Ordered by mistake</option>
              <option value="Delivery time too long">Delivery time too long</option>
              <option value="Other">Other</option>
            </select>
            <div className="flex gap-3">
              <button
                onClick={handleCancelOrder}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Confirm Cancellation
              </button>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelOrderId('');
                  setCancelReason('');
                }}
                className="flex-1 px-4 py-2 rounded-lg border border-white/10 hover:bg-neutral-900 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showTrackModal && trackingData && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-950 rounded-lg p-6 max-w-md w-full border border-white/10">
            <h3 className="text-xl font-semibold mb-4">Track Order</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-white/70">Order Number</p>
                <p className="font-semibold">{trackingData.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-white/70">Current Status</p>
                <p className="font-semibold capitalize">{trackingData.currentStatus}</p>
              </div>
              {trackingData.estimatedDelivery && (
                <div>
                  <p className="text-sm text-white/70">Estimated Delivery</p>
                  <p className="font-semibold">{new Date(trackingData.estimatedDelivery).toLocaleDateString()}</p>
                </div>
              )}
              {trackingData.trackingUpdates && trackingData.trackingUpdates.length > 0 && (
                <div>
                  <p className="text-sm text-white/70 mb-2">Tracking History</p>
                  <div className="space-y-2">
                    {trackingData.trackingUpdates.map((update: any, idx: number) => (
                      <div key={idx} className="bg-neutral-900 p-3 rounded-lg">
                        <p className="text-sm font-medium">{update.status}</p>
                        <p className="text-xs text-white/60">{new Date(update.timestamp).toLocaleString()}</p>
                        {update.location && <p className="text-xs text-white/60">{update.location}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => {
                setShowTrackModal(false);
                setTrackingData(null);
              }}
              className="w-full mt-4 px-4 py-2 rounded-lg border border-white/10 hover:bg-neutral-900 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
