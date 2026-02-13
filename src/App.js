import React, { useState, useEffect, useContext, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ChevronRight, Check, Minus, Plus } from 'lucide-react';
import './App.css';

// --- 1. STATE MANAGEMENT (Cart Context) ---
const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

// --- 2. COMPONENTS ---

// Navbar: Glassmorphism & Sticky
const Navbar = () => {
  const { cart } = useContext(CartContext);
  return (
    <nav className="navbar">
      <Link to="/" className="logo">ALBAIK</Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/track">Track Order</Link>
        <Link to="/checkout" className="tray-btn">
          <ShoppingBag size={20} />
          <span>Tray</span>
          {cart.length > 0 && <span className="badge">{cart.length}</span>}
        </Link>
      </div>
    </nav> 
  );
};

// Loading Screen
const LoadingScreen = () => (
  <div className="loader-container">
    <h1 className="pulsating-logo">ALBAIK</h1>
  </div>
);

// Success Modal
const SuccessModal = ({ onClose }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <div className="success-icon">🎉</div>
      <h3>Order Placed!</h3>
      <p>Your Albaik is being prepared.</p>
      <button onClick={onClose} className="close-btn">Track Order</button>
    </div>
  </div>
);

// Menu Item with Smart Spicy Toggle & Garlic Logic
const MenuItem = ({ data }) => {
  const { addToCart } = useContext(CartContext);
  const [garlicCount, setGarlicCount] = useState(1);
  const [isSpicy, setIsSpicy] = useState(false);
  const [isAdded, setIsAdded] = useState(false); // New: Success feedback state

  const garlicCost = garlicCount > 1 ? (garlicCount - 1) * 50 : 0;
  const totalItemPrice = data.basePrice + garlicCost;

  // Personality Logic for Garlic Labels
  const getGarlicLabel = (count) => {
    if (count === 1) return "Standard Garlic";
    if (count === 2) return "Garlic Lover";
    return "Vampire Proof 🧛‍♂️";
  };

  const handleAdd = () => {
    addToCart({ 
      ...data, 
      uniqueId: Date.now(), 
      garlicCount, 
      isSpicy, 
      finalPrice: totalItemPrice 
    });
    
    // Trigger Success Animation
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
    
    setGarlicCount(1);
    setIsSpicy(false);
  };

  return (
    <div className={`menu-card ${isSpicy ? 'spicy-border' : ''}`}>
      <div className="card-image-container">
        <img src={data.image} alt={data.name} className="card-img" />
        {isSpicy && <div className="heat-overlay">EXTREME HEAT 🔥</div>}
      </div>
      
      <div className="card-header">
        <h3>{data.name}</h3>
        <span className="price">PKR {data.basePrice}</span>
      </div>
      
      <div className="control-row">
        <button 
          className={`smart-toggle ${isSpicy ? 'active-spicy shake-animation' : 'active-regular'}`}
          onClick={() => setIsSpicy(!isSpicy)}
        >
          {isSpicy ? "🔥 CONFIRM SPICY" : "GO REGULAR?"}
        </button>
      </div>

      <div className="control-row garlic-row">
        <span>{getGarlicLabel(garlicCount)} ({garlicCount})</span>
        <div className="counter">
          <button onClick={() => setGarlicCount(Math.max(1, garlicCount - 1))}><Minus size={16} /></button>
          <button onClick={() => setGarlicCount(garlicCount + 1)}><Plus size={16} /></button>
        </div>
      </div>
      <div className="garlic-info">
        {garlicCount === 1 ? "1st sauce is on the house!" : `+${garlicCost} PKR (Extra Intensity)`}
      </div>

      <button 
        className={`add-btn ${isAdded ? 'added-success' : ''}`} 
        onClick={handleAdd}
        disabled={isAdded}
      >
        {isAdded ? (
          <><Check size={18} /> Added to Tray!</>
        ) : (
          `Add to Tray - PKR ${totalItemPrice}`
        )}
      </button>
    </div>
  );
};

// --- PAGES ---

// Home Page: Split Hero & Menu
const Home = () => {
  const menuItems = [
    { 
      id: 1, 
      name: "Spicy Chicken Fillet", 
      basePrice: 950, 
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80" 
    },
    { 
      id: 2, 
      name: "Double Big Baik", 
      basePrice: 950, 
      image: "https://menualbaik.com/wp-content/uploads/2024/05/Big_baik-removebg-preview.webp" 
    },
    { 
      id: 3, 
      name: "Chicken Nuggets (10pc)", 
      basePrice: 1050, 
      image: "https://img.freepik.com/premium-photo/chicken-nuggets-hd-8k-wallpaper-stock-photographic-image_890746-23978.jpg" 
    },
    { 
      id: 4, 
      name: "Jumbo Shrimp Meal", 
      basePrice: 1450, 
      image: "https://images.unsplash.com/photo-1623961990059-28356e226a77?auto=format&fit=crop&w=800&q=80" 
    },
    { 
      id: 5, 
      name: "French fries(LARGE)",
      basePrice: 450,
      image: "https://www.albaikfoods.in/public/uploads/menu-items/lights-bites/french-fries.png"
    },
    {
      id: 6,
      name: "Spicy Meat Tacos (4pc)",
      basePrice: 600,
      image: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=800&q=80"
    },
  ];

  return (
    <div>
      {/* 50/50 Split Hero Section */}
      <header className="hero-split">
        <div className="hero-text">
          <span className="company-tag">ALBAIK</span>
          <h1 className="hero-heading">
            <span className="text-red">KARACHI</span><br />
            <span className="text-black">TASTE THE LEGEND</span>
          </h1>
          <p className="hero-subtext">
            The crunch you waited for is finally here.<br />
            Order online and skip the line.
          </p>
          <a href="#menu" className="cta-button">View Menu</a>
        </div>

        <div className="hero-image">
          <div className="image-wrapper">
             <img 
               src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStmjDIa9pVCGSDO4kGMblULzhcbcsqKyd8IA&s" 
               alt="Albaik Bucket" 
               className="floating-img" 
             />
             
             {/* Floating Badge */}
             <div className="floating-badge">
               <div className="badge-title">NOW SERVING 🔥</div>
               <div className="badge-line"></div>
               <div className="badge-subtitle">JOHAR BLOCK 2</div>
             </div>
          </div>
        </div>
      </header>

      <div id="menu" className="page-container">
        <div className="menu-label">OUR MENU</div>
        <div className="menu-grid">
          {menuItems.map(item => <MenuItem key={item.id} data={item} />)}
        </div>
      </div>
    </div>
  );
};

// Checkout Page
const Checkout = () => {
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const total = cart.reduce((acc, item) => acc + item.finalPrice, 0);

  const closeAndTrack = () => { setShowModal(false); navigate('/track'); };

  return (
    <div className="page-container">
      {showModal && <SuccessModal onClose={closeAndTrack} />}
      <h2>Your Tray</h2>
      {cart.length === 0 ? (
        <div className="empty-state">
          <p>Your tray is empty.</p>
          <Link to="/" style={{color:'var(--primary-red)', fontWeight:'bold'}}>Go to Menu</Link>
        </div>
      ) : (
        <div className="cart-list">
          {cart.map((item) => (
            <div key={item.uniqueId} className="cart-item">
              <div>
                <h4>{item.name}</h4>
                {item.isSpicy && <span className="spicy-tag">🔥 SPICY</span>}
                <div className="details">Garlic Sauces: {item.garlicCount}</div>
              </div>
              <div className="item-price">PKR {item.finalPrice}</div>
            </div>
          ))}
          <div className="divider"></div>
          <div className="total-row"><span>Total</span><span>PKR {total}</span></div>
          <button className="checkout-btn" onClick={() => setShowModal(true)}>
            Proceed to Payment <ChevronRight size={18}/>
          </button>
        </div>
      )}
    </div>
  );
};

// Tracker Page
const Tracker = () => {
  const [timeLeft, setTimeLeft] = useState(15);
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);
  
  const isReady = timeLeft === 0;

  return (
    <div className="page-container tracker-page">
      <h2>Order Status</h2>
      <div className={`status-circle ${isReady ? 'ready' : 'preparing'}`}>
        {isReady ? <Check size={60} /> : <span className="countdown">{timeLeft}</span>}
      </div>
      <h3>{isReady ? "READY" : "PREPARING..."}</h3>
      <p>{isReady ? "Please pick up your order." : "We are preparing your crispy meal."}</p>
    </div>
  );
};

// Main App
const App = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => { setTimeout(() => setLoading(false), 2000); }, []);
  if (loading) return <LoadingScreen />;
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/track" element={<Tracker />} />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;
