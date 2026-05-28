import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Info, Zap, Timer, Laptop, Apple, Sparkles, TrendingUp, Brain, Filter, MapPin } from 'lucide-react';
import ProductModal from '../components/ProductModal';
import MapView from '../components/MapView';

const INR = (usd) => Math.round((usd || 0) * 83);

// --- 🔥 DYNAMIC IMAGE MAPPING ---
export function getProductImage(product) {
  try {
    const name = (product.name || "").toLowerCase();

    // FOOD / GROCERIES
    if (name.includes("milk")) return "https://images.unsplash.com/photo-1563636619-e9143da7973b";
    if (name.includes("bread")) return "https://images.unsplash.com/photo-1608198093002-ad4e005484ec";
    if (name.includes("apple")) return "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce";
    if (name.includes("banana")) return "https://images.unsplash.com/photo-1574226516831-e1dff420e12f";
    if (name.includes("carrot")) return "https://images.unsplash.com/photo-1447175008436-1701707bb46c";
    if (name.includes("vegetable")) return "https://images.unsplash.com/photo-1542838132-92c53300491e";
    if (name.includes("juice")) return "https://images.unsplash.com/photo-1553530666-ba11a7da3888";
    if (name.includes("egg")) return "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f";
    if (name.includes("rice")) return "https://images.unsplash.com/photo-1586201375761-83865001e31c";

    // ELECTRONICS
    if (name.includes("phone")) return "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9";
    if (name.includes("headphone")) return "https://images.unsplash.com/photo-1518449036015-5e1e4d5b2a3c";
    if (name.includes("laptop")) return "https://images.unsplash.com/photo-1517336714731-489689fd1ca8";

    // DEFAULT
    return "https://images.unsplash.com/photo-1607083206968-13611e3d76db";
  } catch (err) {
    return "https://via.placeholder.com/300";
  }
}

// --- 🔥 DISTANCE CALCULATION ---
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI/180;
  const dLon = (lon2 - lon1) * Math.PI/180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const distance = R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
  return Math.max(distance, 0.5);
}

// --- 🔥 ML: USER PROFILE ---
const updateUserProfile = (product) => {
  try {
    const profile = JSON.parse(localStorage.getItem("userProfile")) || { categories: {}, avgPrice: 0, count: 0 };
    profile.categories[product.category] = (profile.categories[product.category] || 0) + 1;
    profile.avgPrice = (profile.avgPrice * profile.count + product.price) / (profile.count + 1);
    profile.count += 1;
    localStorage.setItem("userProfile", JSON.stringify(profile));
  } catch (err) { console.error(err); }
};

const getSmartRecommendations = (products) => {
  try {
    const profile = JSON.parse(localStorage.getItem("userProfile"));
    if (!profile) return products.slice(0, 4);
    return [...products].sort((a,b) => {
      const scoreA = profile.categories[a.category] || 0;
      const scoreB = profile.categories[b.category] || 0;
      return scoreB - scoreA;
    }).slice(0, 4);
  } catch { return products.slice(0, 4); }
};

const ProductCard = ({ product, index, onAddToCart, onViewDetails }) => {
  const isExpiring = (product.expiryDays || 10) <= 3;
  const isSuperUrgent = (product.expiryDays || 10) <= 1;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="card-premium">
      <div style={{ position: 'relative' }}>
        {isExpiring && (
          <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10, background: 'var(--accent-gradient)', padding: '4px 10px', borderRadius: '8px', fontSize: '0.65rem', fontWeight: '800' }}>
            {isSuperUrgent ? "🔥 EXPIRING IN HOURS" : "⚡ EXPIRING SOON"}
          </div>
        )}
        <div style={{ height: '200px', borderRadius: '20px 20px 0 0', overflow: 'hidden', cursor: 'pointer' }} onClick={() => onViewDetails(product)}>
          <img 
            src={getProductImage(product)} 
            alt={product.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            onError={(e) => { e.target.src = "https://via.placeholder.com/300"; }}
          />
        </div>
      </div>
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div>
           <p style={{ color: 'var(--primary)', fontSize: '0.65rem', fontWeight: '800' }}>{product.category} • {product.ownerName || 'Platform'}</p>
           {product.distance !== undefined && product.distance !== null && (
             <p style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '600', marginTop: '4px', display: 'flex', alignItems: 'center', gap:'4px' }}>
               <MapPin size={12} color="#f43f5e" /> {product.distance.toFixed(1)} km away
             </p>
           )}
           <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
             <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>{product.name}</h3>
             <span style={{ fontWeight: '800' }}>${product.price ? product.price.toFixed(2) : "0.00"}</span>
           </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
           <button onClick={() => onAddToCart(product)} className="btn-premium" style={{ flexGrow: 1, height: '40px', fontSize: '0.8rem' }}>Add to Bag</button>
           <button onClick={() => onViewDetails(product)} style={{ width: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }}><Info size={16}/></button>
        </div>
      </div>
    </motion.div>
  );
};

const Products = ({ isAuthenticated }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [userLocations, setUserLocations] = useState([]);
  const [inputLocation, setInputLocation] = useState("");
  const [sortMode, setSortMode] = useState("balanced");
  const [highlightedProduct, setHighlightedProduct] = useState(null);

  const chennaiZones = [
    { name: "Adyar", top: 30, left: 70 },
    { name: "T Nagar", top: 45, left: 55 },
    { name: "Anna Nagar", top: 20, left: 40 },
    { name: "Velachery", top: 60, left: 65 },
    { name: "Tambaram", top: 80, left: 60 },
    { name: "Porur", top: 50, left: 30 },
    { name: "OMR", top: 70, left: 80 }
  ];

  const parsedLocations = userLocations.map(loc => 
    chennaiZones.find(z => z.name.toLowerCase() === loc.toLowerCase())
  ).filter(Boolean);

  const addLocation = () => {
    if (!inputLocation.trim()) return;
    if (!chennaiZones.find(z => z.name.toLowerCase() === inputLocation.trim().toLowerCase())) {
      alert("City not found in bounds! Try Adyar, T Nagar, Velachery, OMR, etc.");
      return;
    }
    setUserLocations(prev => [...prev, inputLocation.trim()]);
    setInputLocation("");
  };

  function getMinDistance(product, locationsArray) {
    if (!locationsArray.length) return 999;
    let minDistance = 999;
    locationsArray.forEach(loc => {
      const pTop = product.mapPosition?.top || 50;
      const pLeft = product.mapPosition?.left || 50;
      const distance = Math.sqrt(Math.pow(pTop - loc.top, 2) + Math.pow(pLeft - loc.left, 2));
      if (distance < minDistance) minDistance = distance;
    });
    return (minDistance / 10).toFixed(1);
  }

  useEffect(() => {
    const shopNames = [
      "Adyar Fresh Market", "T Nagar Organic Store", "Velachery Veggies Hub",
      "Anna Nagar Daily Needs", "Porur Green Basket", "Mylapore Fresh Farm",
      "Guindy Essentials", "Chromepet Local Mart", "Tambaram Grocery Point",
      "Nungambakkam Food Hub"
    ];
    const vendorNamesList = ["Ravi Kumar", "Suresh Iyer", "Murugan M", "Srinivasan", "Karthik P"];

    const generateVendors = (zone) => {
      return Array.from({ length: 2 + Math.floor(Math.random() * 3) }, (_, i) => {
        const vendorNameStr = vendorNamesList[Math.floor(Math.random()*vendorNamesList.length)];
        return {
          ...zone,
          shopName: shopNames[Math.floor(Math.random() * shopNames.length)],
          vendor: {
            name: vendorNameStr,
            phone: "+91 9" + Math.floor(100000000 + Math.random() * 899999999),
            url: "https://freshmart-demo.vercel.app"
          },
          ownerName: vendorNameStr,
          id: `gen-${zone.name}-${i}-${Math.random()}`
        };
      });
    };

    const baseProducts = [
      // GROCERIES
      { id:1, name:"Organic Milk", price:3, category:"Groceries" },
      { id:2, name:"Fresh Bread", price:2, category:"Groceries" },
      { id:3, name:"Red Apples", price:3, category:"Groceries" },
      { id:4, name:"Banana Bunch", price:2, category:"Groceries" },
      { id:5, name:"Carrots Pack", price:2, category:"Groceries" },
      { id:6, name:"Tomatoes", price:2, category:"Groceries" },
      { id:7, name:"Spinach Leaves", price:1, category:"Groceries" },
      { id:8, name:"Egg Pack", price:4, category:"Groceries" },
      { id:9, name:"Orange Juice", price:3, category:"Groceries" },
      { id:10, name:"Rice Bag", price:6, category:"Groceries" },

      // MORE VARIETY
      { id:11, name:"Potatoes", price:2, category:"Groceries" },
      { id:12, name:"Onions", price:2, category:"Groceries" },
      { id:13, name:"Capsicum", price:3, category:"Groceries" },
      { id:14, name:"Paneer Pack", price:5, category:"Groceries" },
      { id:15, name:"Butter", price:4, category:"Groceries" },

      // ELECTRONICS
      { id:16, name:"Smartphone", price:700, category:"Electronics" },
      { id:17, name:"Wireless Headphones", price:120, category:"Electronics" },
      { id:18, name:"Laptop", price:900, category:"Electronics" }
    ];

    const defaultProducts = [];
    chennaiZones.forEach(zone => {
      const vendors = generateVendors(zone);
      vendors.forEach(vendor => {
        const randomProduct = baseProducts[Math.floor(Math.random() * baseProducts.length)];
        const basePrice = randomProduct.price;
        const category = randomProduct.category;

        defaultProducts.push({
          ...randomProduct,
          price: Math.max(1, basePrice + Math.floor(Math.random() * 20 - 10)),
          expiryHours: category === "Groceries" ? Math.floor(Math.random() * 24) + 1 : null,
          inStock: category === "Electronics" ? false : true,
          id: `${randomProduct.id}-${vendor.shopName}`,
          ownerName: vendor.ownerName,
          shopName: vendor.shopName,
          vendor: vendor.vendor,
          mapPosition: { top: vendor.top, left: vendor.left },
          locationName: vendor.name,
          description: "Fresh surplus stock sourced from local Chennai vendors. High quality and nearing expiry, available at discounted pricing.",
          phone: vendor.vendor.phone
        });
      });
    });

    const vendorProducts = JSON.parse(localStorage.getItem("vendorProducts")) || [];
    setProducts([...defaultProducts, ...vendorProducts]);
    setLoading(false);
  }, []);

  const notifyVendor = (product, buyer) => {
    const notification = {
      vendor: product.ownerName,
      shop: product.shopName,
      buyer: buyer.name,
      product: product.name,
      time: new Date().toLocaleTimeString()
    };
    console.log("📩 Vendor Notification:", notification);
    localStorage.setItem("vendorNotifications",
      JSON.stringify([
        ...(JSON.parse(localStorage.getItem("vendorNotifications")) || []),
        notification
      ])
    );
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    localStorage.setItem("cart", JSON.stringify([...cart.filter(i => i.id !== product.id), product]));
    updateUserProfile(product);
    notifyVendor(product, { name: "Guest User" });
    alert(`Added ${product.name}! 🌍`);
  };

  const filteredProducts = products.filter(p => {
    if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
    if (userLocations.length > 0) {
      if (!userLocations.some(loc => loc.toLowerCase() === p.locationName.toLowerCase())) return false;
    }
    return true;
  });

  // STEP 6: Default Location Safety Net
  const safeProducts = filteredProducts.map(p => ({
    ...p,
    mapPosition: p.mapPosition || {
      top: 50,
      left: 50
    },
    locationName: p.locationName || "Chennai"
  }));

  // Geo Spatial Product Distances via Multi-Location Support
  const enrichedProducts = safeProducts.map(p => ({
    ...p,
    distance: getMinDistance(p, parsedLocations)
  }));

  // Hybrid Vendor Comparison Sorting
  const groupByName = (items) => {
    const map = {};
    items.forEach(p => {
      const key = p.name.toLowerCase();
      if (!map[key]) map[key] = [];
      map[key].push(p);
    });
    return Object.values(map);
  };

  const groupedProducts = groupByName(enrichedProducts);
  const comparedProducts = groupedProducts.map(group => {
    return group.sort((a, b) => {
      // Feature 11: Priority distance ASC then price ASC
      if (a.distance !== b.distance) return a.distance - b.distance;
      return a.price - b.price;
    });
  });

  if (loading) return <div style={{ textAlign: 'center', padding: '5rem' }}>Loading Inventory...</div>;

  return (
    <div style={{ padding: '2rem 0' }}>
      <style>{`
        .card-premium {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card-premium:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }
        .highlighted {
          border: 2px solid #a855f7 !important;
          box-shadow: 0 0 20px rgba(168,85,247,0.4);
        }
        .hover-popup {
          position: absolute;
          bottom: 105%;
          left: 50%;
          width: 260px;
          background: #0f172a;
          padding: 16px;
          border-radius: 16px;
          pointer-events: none;
          z-index: 100;
          box-shadow: 0 10px 25px rgba(0,0,0,0.8);
          border: 1px solid rgba(255,255,255,0.1);
          opacity: 0;
          transform: translateX(-50%) translateY(10px) scale(0.95);
          transition: all 0.25s ease;
        }
        .card-premium:hover .hover-popup {
          opacity: 1;
          transform: translateX(-50%) translateY(0) scale(1);
        }
        .distance-tag {
          font-size: 0.75rem;
          color: #94a3b8;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 4px;
          animation: fadeIn 0.5s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulsate {
          0% { box-shadow: 0 0 5px #f43f5e; opacity: 1; }
          50% { box-shadow: 0 0 20px #f43f5e; opacity: 0.8; }
          100% { box-shadow: 0 0 5px #f43f5e; opacity: 1; }
        }
      `}</style>
      <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800' }}>Surplus <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Marketplace</span></h1>
      </header>

      {/* Categories Filter */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
        {['All', 'Groceries', 'Electronics', 'Essentials'].map(cat => (
          <button key={cat} onClick={() => setCategoryFilter(cat)} 
            style={{ 
              padding: '10px 24px', borderRadius: '12px', border: '1px solid var(--glass-border)',
              background: categoryFilter === cat ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.05)',
              color: 'white', cursor: 'pointer', fontWeight: '700', transition: 'all 0.2s'
            }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Multiple Location Input */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <input 
            type="text" 
            placeholder="Add multiple areas (e.g., T Nagar, Adyar)" 
            value={inputLocation} 
            onChange={(e) => setInputLocation(e.target.value)} 
            style={{ width: '350px', padding: '0.8rem 1.25rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '14px', color: 'white', outline: 'none' }}
          />
          <button onClick={addLocation} className="btn-premium" style={{ height: '48px', padding: '0 1.5rem', fontSize: '0.9rem', borderRadius: '14px' }}>
            Add 📍
          </button>
        </div>
        
        {/* Render Location Chips */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <AnimatePresence>
            {userLocations.map((loc, i) => (
              <motion.span 
                initial={{ scale: 0, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                key={i} 
                style={{ background: 'rgba(244, 63, 94, 0.2)', border: '1px solid #f43f5e', color: '#f43f5e', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '800', textTransform: 'capitalize' }}
              >
                {loc}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <section style={{ marginBottom: '5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
          <MapPin size={24} color="#f43f5e" />
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>🗺 Shops Near You</h2>
        </div>
        <MapView products={enrichedProducts} userLocations={parsedLocations} highlightedProduct={highlightedProduct} onPinClick={setHighlightedProduct} />
      </section>

      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
          <TrendingUp size={24} color="var(--primary)" />
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Vendor Comparison Matrix</h2>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
          {comparedProducts.map((group, groupIdx) => {
            const best = group[0];
            return (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: groupIdx * 0.1 }} key={`group-${groupIdx}`} style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '28px', border: '1px solid var(--glass-border)' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem', color: 'white' }}>{best.name}</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
                  {group.map(product => {
                    const isHigh = highlightedProduct === product.id;
                    return (
                      <div key={product.id} className={`card-premium ${isHigh ? 'highlighted' : ''}`} style={{ border: product.id === best.id ? '2px solid var(--primary)' : '1px solid var(--glass-border)', position: 'relative', background: product.id === best.id ? 'rgba(34, 197, 94, 0.05)' : 'rgba(255,255,255,0.03)' }}>
                        
                        {/* Interactive UI Hover Popup */}
                        <div className="hover-popup">
                          <h3 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '8px' }}>{product.name}</h3>
                          <p style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '12px', fontStyle: 'italic', lineHeight: '1.3' }}>{product.description}</p>
                          <hr style={{ borderColor: 'rgba(255,255,255,0.1)', marginBottom: '12px' }} />
                          <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '800' }}>🏪 {product.shopName || product.ownerName}</p>
                          <p style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '4px' }}>👤 {product.vendor?.name || product.ownerName}</p>
                          <p style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '4px' }}>📞 {product.vendor?.phone || product.phone}</p>
                          <div style={{ marginTop: '10px' }}>
                            <a href={product.vendor?.url || "#"} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: '#60a5fa', textDecoration: 'none', fontWeight: 'bold' }}>
                              Visit Store 🌐
                            </a>
                          </div>
                          <p style={{ fontSize: '0.8rem', color: '#f43f5e', marginTop: '12px', fontWeight: '700' }}>📍 {product.locationName}</p>
                          {product.distance !== '99.9' && (
                            <p style={{ fontSize: '0.8rem', color: '#4ade80', marginTop: '4px', fontWeight: '700' }}>🚗 {product.distance} km away</p>
                          )}
                        </div>
                        
                        {product.expiryHours && (
                          <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10, background: 'var(--accent-gradient)', padding: '4px 10px', borderRadius: '8px', fontSize: '0.65rem', fontWeight: '800', border: '1px solid #f43f5e', animation: 'pulsate 2s infinite' }}>
                            ⏳ Expiring in {product.expiryHours} hrs
                          </div>
                        )}
                        
                        {(!product.expiryHours && product.id === best.id) && (
                          <div style={{ position: 'absolute', top: '-10px', right: '10px', background: 'var(--accent-gradient)', color: 'white', padding: '4px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800', zIndex: 10, boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
                            🔥 BEST DEAL
                          </div>
                        )}
                        
                        <div style={{ height: '160px', borderRadius: '12px 12px 0 0', overflow: 'hidden', cursor: 'pointer' }} onClick={() => setSelectedProduct(product)} onMouseEnter={() => setHighlightedProduct(product.id)} onMouseLeave={() => setHighlightedProduct(null)}>
                          <img src={getProductImage(product)} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} onError={(e) => { e.target.src = "https://via.placeholder.com/300"; }} />
                        </div>
                        
                        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <p style={{ color: 'var(--text-gray)', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase' }}>🏪 {product.shopName || product.ownerName}</p>
                          
                          <p style={{ fontSize: '0.85rem', opacity: 0.7, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.vendorDescription || product.description || "No description available"}</p>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                            <h4 style={{ fontWeight: '800', fontSize: '1.2rem', color: 'white' }}>₹{INR(product.price)}</h4>
                            {product.distance !== '99.9' && (
                              <p className="distance-tag">
                                🚗 {product.distance} km
                              </p>
                            )}
                          </div>
                          
                          {product.inStock === false ? (
                            <button disabled className="btn-premium" style={{ marginTop: '0.75rem', height: '40px', fontSize: '0.85rem', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', cursor: 'not-allowed', border: '1px solid rgba(255,255,255,0.1)' }}>
                              Out of Stock
                            </button>
                          ) : (
                            <button onClick={() => addToCart(product)} className="btn-premium" style={{ marginTop: '0.75rem', height: '40px', fontSize: '0.85rem' }}>
                              {product.id === best.id ? "Snag Best Deal" : "Add to Bag"}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <ProductModal product={selectedProduct} isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={addToCart} />
    </div>
  );
};

export default Products;
