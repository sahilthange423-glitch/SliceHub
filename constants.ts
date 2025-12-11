import { Pizza } from './types';

export const MENU_ITEMS: Pizza[] = [
  {
    id: '1',
    name: 'Margherita Supreme',
    description: 'Classic delight with 100% real mozzarella cheese, fresh basil, and tangy tomato sauce.',
    price: 12,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
    category: 'veg',
    spiciness: 1,
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Pepperoni Feast',
    description: 'American classic with double pepperoni and extra cheese on a hand-tossed crust.',
    price: 15,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
    category: 'non-veg',
    spiciness: 2,
    rating: 4.9,
  },
  {
    id: '3',
    name: 'Veggie Paradise',
    description: 'Loaded with crisp capsicum, onion, corn, mushroom, and golden corn.',
    price: 14,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    category: 'veg',
    spiciness: 1,
    rating: 4.6,
  },
  {
    id: '4',
    name: 'Spicy Chicken BBQ',
    description: 'Grilled chicken strips in spicy BBQ sauce, onion, and red paprika.',
    price: 16,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    category: 'non-veg',
    spiciness: 3,
    rating: 4.7,
  },
  {
    id: '5',
    name: 'Mushroom Truffle',
    description: 'Exotic mushrooms with truffle oil, garlic, and parmesan cheese.',
    price: 18,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80', // Placeholder
    category: 'veg',
    spiciness: 1,
    rating: 4.9,
  },
  {
    id: '6',
    name: 'Meat Lover\'s',
    description: 'Packed with pepperoni, ham, spicy beef, and sausage.',
    price: 19,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80',
    category: 'non-veg',
    spiciness: 2,
    rating: 4.8,
  }
];

export const MOCK_ORDERS = [
  {
    id: 'ORD-1001',
    userId: 'user-1',
    items: [{ ...MENU_ITEMS[0], quantity: 1 }, { ...MENU_ITEMS[2], quantity: 2 }],
    total: 40,
    status: 'delivered',
    date: '2023-10-25T14:30:00Z',
    deliveryAddress: '123 Main St',
    paymentMethod: 'card'
  },
  {
    id: 'ORD-1002',
    userId: 'user-2',
    items: [{ ...MENU_ITEMS[1], quantity: 1 }],
    total: 15,
    status: 'preparing',
    date: '2023-10-26T10:15:00Z',
    deliveryAddress: '456 Oak Ave',
    paymentMethod: 'upi'
  },
  {
    id: 'ORD-1003',
    userId: 'user-3',
    items: [{ ...MENU_ITEMS[3], quantity: 1 }],
    total: 16,
    status: 'pending',
    date: '2023-10-26T11:00:00Z',
    deliveryAddress: '789 Pine Ln',
    paymentMethod: 'cod'
  },
];
