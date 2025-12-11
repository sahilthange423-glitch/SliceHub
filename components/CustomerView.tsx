import React, { useState, useEffect } from 'react';
import { useStore } from '../store/StoreContext.tsx';
import { ShoppingCart, Star, Plus, Minus, Trash2, MapPin, CreditCard, Sparkles, ChefHat } from 'lucide-react';
import { Button, Input, Modal, Badge } from './Shared.tsx';
import { getPizzaRecommendation } from '../services/geminiService.ts';
import { Pizza, Order } from '../types.ts';

export const CustomerView: React.FC<{ setView: (v: string) => void, currentView: string }> = ({ setView, currentView }) => {
  const { menu, cart, addToCart } = useStore();
  const [showAiModal, setShowAiModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      {currentView === 'home' && (
        <div className="relative bg-gray-900 text-white overflow-hidden">
          <div className="absolute inset-0">
            <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1920&q=80" alt="Pizza Hero" className="w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 flex flex-col items-center text-center">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
              <span className="block">Authentic Italian</span>
              <span className="block text-red-500">Delivered Fast</span>
            </h1>
            <p className="mt-4 text-xl text-gray-300 max-w-2xl mx-auto mb-10">
              Hand-tossed dough, fresh locally sourced ingredients, and the perfect blend of cheeses. Experience the best slice in town.
            </p>
            <div className="flex gap-4">
              <Button size="lg" onClick={() => setView('menu')}>Order Now</Button>
              <Button size="lg" variant="secondary" icon={Sparkles} onClick={() => setShowAiModal(true)}>Ask AI Chef</Button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'menu' || currentView === 'home' ? (
          <>
            <div className="flex justify-between items-end mb-8">
               <h2 className="text-3xl font-bold text-gray-900">Our Menu</h2>
               <Button variant="outline" size="sm" icon={Sparkles} onClick={() => setShowAiModal(true)} className="hidden sm:flex">
                 Get Recommendation
               </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {menu.map(pizza => (
                <PizzaCard key={pizza.id} pizza={pizza} onAdd={() => addToCart(pizza)} />
              ))}
            </div>
          </>
        ) : null}

        {currentView === 'cart' && <CartPage setView={setView} />}
        {currentView === 'checkout' && <CheckoutPage setView={setView} />}
        {currentView === 'tracking' && <OrderTracking />}
      </main>

      <AIChefModal isOpen={showAiModal} onClose={() => setShowAiModal(false)} />
    </div>
  );
};

const PizzaCard: React.FC<{ pizza: Pizza, onAdd: () => void }> = ({ pizza, onAdd }) => (
  <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100">
    <div className="relative h-56 overflow-hidden">
      <img src={pizza.image} alt={pizza.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm">
        <div className="flex items-center space-x-1">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm font-bold">{pizza.rating}</span>
        </div>
      </div>
    </div>
    <div className="p-6">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold text-gray-900">{pizza.name}</h3>
        <Badge color={pizza.category === 'veg' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
          {pizza.category === 'veg' ? 'VEG' : 'NON-VEG'}
        </Badge>
      </div>
      <p className="text-gray-500 text-sm mb-4 line-clamp-2 h-10">{pizza.description}</p>
      <div className="flex items-center justify-between mt-4">
        <span className="text-2xl font-bold text-gray-900">${pizza.price}</span>
        <Button size="sm" onClick={onAdd} className="shadow-lg shadow-red-500/30">
          Add to Cart
        </Button>
      </div>
    </div>
  </div>
);

const CartPage: React.FC<{ setView: (v: string) => void }> = ({ setView }) => {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useStore();

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="bg-gray-100 rounded-full p-6 inline-block mb-4">
          <ShoppingCart className="h-10 w-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added any pizzas yet.</p>
        <Button onClick={() => setView('menu')}>Browse Menu</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-8">Shopping Cart</h2>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100">
          {cart.map(item => (
            <div key={item.id} className="p-6 flex items-center gap-6">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                <p className="text-gray-500 text-sm">${item.price} each</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-gray-100 rounded">
                  <Minus className="w-4 h-4 text-gray-600" />
                </button>
                <span className="font-medium w-8 text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-gray-100 rounded">
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <div className="text-right w-24">
                <div className="font-bold text-lg">${item.price * item.quantity}</div>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="p-2 text-gray-400 hover:text-red-500">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 p-6 flex justify-between items-center">
          <div className="text-gray-500">
            Total for {cart.reduce((a, b) => a + b.quantity, 0)} items
          </div>
          <div className="flex items-center gap-6">
            <div className="text-3xl font-bold text-gray-900">${cartTotal}</div>
            <Button size="lg" onClick={() => setView('checkout')}>Proceed to Checkout</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckoutPage: React.FC<{ setView: (v: string) => void }> = ({ setView }) => {
  const { placeOrder, cartTotal, user, setAuthModalOpen } = useStore();
  const [address, setAddress] = useState('');
  const [method, setMethod] = useState<'card' | 'upi' | 'cod'>('card');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      placeOrder({
        deliveryAddress: address,
        paymentMethod: method
      });
      setLoading(false);
      setView('tracking');
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>
      <div className="bg-white rounded-xl shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500" /> Delivery Details
            </h3>
            <Input 
              label="Street Address" 
              value={address} 
              onChange={e => setAddress(e.target.value)} 
              placeholder="123 Pizza Street, New York, NY"
              required 
            />
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-red-500" /> Payment Method
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: 'card', label: 'Credit Card' },
                { id: 'upi', label: 'UPI' },
                { id: 'cod', label: 'Cash on Delivery' }
              ].map(opt => (
                <div 
                  key={opt.id}
                  onClick={() => setMethod(opt.id as any)}
                  className={`cursor-pointer border-2 rounded-lg p-4 text-center transition-all ${
                    method === opt.id ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{opt.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 mt-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-600">Total Amount</span>
              <span className="text-2xl font-bold text-gray-900">${cartTotal}</span>
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? 'Processing...' : 'Place Order'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const OrderTracking: React.FC = () => {
  const { orders } = useStore();
  // For demo, just show the most recent order
  const latestOrder = orders[0];

  if (!latestOrder) return <div>No orders found.</div>;

  const steps = [
    { id: 'pending', label: 'Order Placed' },
    { id: 'preparing', label: 'In Kitchen' },
    { id: 'out-for-delivery', label: 'Out for Delivery' },
    { id: 'delivered', label: 'Delivered' }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === latestOrder.status);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-8 text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ChefHat className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order #{latestOrder.id}</h2>
        <p className="text-gray-500">Estimated Delivery: 30-40 mins</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="relative">
          <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full"></div>
          <div 
            className="absolute left-0 top-1/2 h-1 bg-red-500 -translate-y-1/2 rounded-full transition-all duration-1000"
            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
          ></div>
          <div className="relative flex justify-between">
            {steps.map((step, idx) => {
              const isCompleted = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <div key={step.id} className="flex flex-col items-center group">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 border-4 transition-colors duration-300 ${
                    isCompleted ? 'bg-red-600 border-red-600' : 'bg-white border-gray-200'
                  }`}>
                    {isCompleted && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                  </div>
                  <div className={`mt-3 text-sm font-medium ${isCurrent ? 'text-red-600' : isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                    {step.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const AIChefModal: React.FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const result = await getPizzaRecommendation(input);
    setResponse(result);
    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ask the AI Chef">
      <div className="space-y-4">
        {!response ? (
          <>
             <p className="text-gray-600">Tell me what you're craving! Spicy? Vegan? Lots of cheese? I'll find the perfect slice for you.</p>
             <div className="flex gap-2">
               <Input 
                 placeholder="e.g. I want something spicy with chicken..." 
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
               />
               <Button onClick={handleAsk} disabled={loading}>
                 {loading ? 'Thinking...' : 'Ask'}
               </Button>
             </div>
          </>
        ) : (
          <div className="animate-fade-in">
            <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                 <ChefHat className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                 <p className="text-gray-800 whitespace-pre-line">{response}</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => { setResponse(''); setInput(''); }} className="w-full">
              Ask Another Question
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};