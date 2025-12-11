import React, { useState } from 'react';
import { StoreProvider, useStore } from './store/StoreContext.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { CustomerView } from './components/CustomerView.tsx';
import { Modal, Input, Button } from './components/Shared.tsx';
import { Pizza, ShoppingBag, User as UserIcon, LogOut } from 'lucide-react';
import { UserRole } from './types.ts';

// Wrapper component to use the context
const AppContent: React.FC = () => {
  const { user, login, logout, isAuthModalOpen, setAuthModalOpen, cart } = useStore();
  const [view, setView] = useState('home'); // home, menu, cart, checkout, tracking, admin

  // Simple Auth Form State
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authName, setAuthName] = useState('');
  const [authRole, setAuthRole] = useState<UserRole>('customer');

  const handleAuthSubmit = () => {
    // For demo purposes, we accept any login. 
    // If name is 'admin', we force admin role for convenience in demo
    const role = authName.toLowerCase() === 'admin' ? 'admin' : authRole;
    login(authName, role);
    if (role === 'admin') setView('admin');
  };

  const Navbar = () => (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => setView(user?.role === 'admin' ? 'admin' : 'home')}>
            <div className="bg-red-600 p-1.5 rounded-lg mr-2">
              <Pizza className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">Slice<span className="text-red-600">Hub</span></span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {user?.role === 'admin' ? (
               <Button variant="outline" size="sm" onClick={() => setView('admin')}>Dashboard</Button>
            ) : (
              <>
                <button 
                  onClick={() => setView('menu')} 
                  className={`text-sm font-medium hover:text-red-600 transition-colors ${view === 'menu' ? 'text-red-600' : 'text-gray-600'}`}
                >
                  Menu
                </button>
                <div className="relative cursor-pointer group" onClick={() => setView('cart')}>
                  <div className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ShoppingBag className="w-6 h-6 text-gray-700 group-hover:text-red-600" />
                    {cart.length > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                        {cart.reduce((a, b) => a + b.quantity, 0)}
                      </span>
                    )}
                  </div>
                </div>
              </>
            )}

            {user ? (
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <span className="text-sm font-medium text-gray-700 hidden sm:block">Hi, {user.name}</span>
                <button onClick={() => { logout(); setView('home'); }} className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Logout">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Button size="sm" icon={UserIcon} onClick={() => setAuthModalOpen(true)}>Login</Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );

  return (
    <>
      {user?.role !== 'admin' && <Navbar />}
      
      {user?.role === 'admin' ? (
        <AdminDashboard />
      ) : (
        <CustomerView setView={setView} currentView={view} />
      )}

      {/* Global Auth Modal */}
      <Modal 
        isOpen={isAuthModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        title={authMode === 'login' ? 'Welcome Back' : 'Create Account'}
      >
        <div className="space-y-4">
          <Input 
            label="Name" 
            placeholder="Enter your name" 
            value={authName} 
            onChange={e => setAuthName(e.target.value)}
          />
          {/* In a real app, we would have password, etc. */}
          <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
            <p><strong>Demo Mode:</strong></p>
            <p>Enter "Admin" to access the dashboard.</p>
            <p>Any other name logs in as Customer.</p>
          </div>
          
          <Button className="w-full" onClick={handleAuthSubmit}>
            {authMode === 'login' ? 'Sign In' : 'Sign Up'}
          </Button>

          <div className="text-center text-sm text-gray-500">
             {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
             <button 
               className="text-red-600 hover:underline font-medium"
               onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
             >
               {authMode === 'login' ? 'Sign Up' : 'Log In'}
             </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
};

export default App;