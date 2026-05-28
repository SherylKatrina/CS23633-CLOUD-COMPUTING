import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const chennaiZones = [
  { name: "Adyar", top: 30, left: 70 },
  { name: "T Nagar", top: 45, left: 55 },
  { name: "Anna Nagar", top: 20, left: 40 },
  { name: "Velachery", top: 60, left: 65 },
  { name: "Tambaram", top: 80, left: 60 },
  { name: "Porur", top: 50, left: 30 },
  { name: "OMR", top: 70, left: 80 }
];
const INR = (usd) => Math.round((usd || 0) * 83);

const MapView = ({ products, userLocations, onPinClick, highlightedProduct }) => {
  const [liveProducts, setLiveProducts] = useState([]);
  const [jitter, setJitter] = useState({ lat: 0, lng: 0 });

  // Sync props to local state for simulation
  useEffect(() => {
    if (products?.length) {
      setLiveProducts(products.map(p => ({
        ...p,
        description: "Fresh surplus stock sourced from local Chennai vendors. High quality and nearing expiry, available at discounted pricing.",
        mapPosition: p.mapPosition || chennaiZones[0]
      })));
    }
  }, [products]);

  // Real-time movement simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveProducts(prev => 
        prev.map(p => ({
          ...p,
          mapPosition: {
            ...p.mapPosition,
            top: p.mapPosition.top + (Math.random() - 0.5) * 0.2,
            left: p.mapPosition.left + (Math.random() - 0.5) * 0.2
          }
        }))
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Geospatial Clustering Logic (Simple Distance-Based)
  const clusteredItems = useMemo(() => {
    const clusters = [];
    const threshold = 1.5; // Approx % in top/left units for visual clustering

    liveProducts.forEach(product => {
      let added = false;
      for (let cluster of clusters) {
        const dist = Math.sqrt(
          Math.pow(cluster.top - product.mapPosition.top, 2) + 
          Math.pow(cluster.left - product.mapPosition.left, 2)
        );
        if (dist < threshold) {
          cluster.members.push(product);
          added = true;
          break;
        }
      }
      if (!added) {
        clusters.push({
          id: `cluster-${product.id}`,
          top: product.mapPosition.top,
          left: product.mapPosition.left,
          members: [product]
        });
      }
    });

    return clusters;
  }, [liveProducts]);

  return (
    <>
      <style>{`
        .map-container {
          background: 
            radial-gradient(circle at center, rgba(168,85,247,0.1), transparent),
            linear-gradient(#0f172a, #020617);
          border-radius: 20px;
          position: relative;
          height: 450px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0,0,0,0.6);
          border: 1px solid rgba(255,255,255,0.1);
          cursor: crosshair;
        }

        .map-label-header {
          position: absolute;
          top: 20px;
          left: 20px;
          font-size: 14px;
          font-weight: 900;
          color: white;
          z-index: 100;
          background: rgba(15, 23, 42, 0.8);
          padding: 8px 16px;
          border-radius: 12px;
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.1);
          letter-spacing: 1px;
        }

        .map-area-label {
          position: absolute;
          font-size: 10px;
          font-weight: 800;
          opacity: 0.3;
          color: #94a3b8;
          transform: translate(-50%, -50%);
          pointer-events: none;
          text-transform: uppercase;
          letter-spacing: 2px;
          z-index: 5;
        }

        .heat-zone {
          position: absolute;
          width: 120px;
          height: 120px;
          background: radial-gradient(circle, rgba(168, 85, 247, 0.15), transparent 70%);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 2;
          filter: blur(10px);
        }

        .map-pin {
          position: absolute;
          transform: translate(-50%, -50%);
          width: 14px;
          height: 14px;
          background: #a855f7;
          border-radius: 50%;
          box-shadow: 0 0 12px #a855f7;
          cursor: pointer;
          z-index: 20;
          animation: dropIn 0.5s ease, pulseGlow 2s infinite;
        }

        .cluster-pin {
          position: absolute;
          transform: translate(-50%, -50%);
          background: #a855f7;
          min-width: 24px;
          height: 24px;
          border-radius: 12px;
          color: white;
          font-size: 11px;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 6px;
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.8);
          cursor: pointer;
          z-index: 25;
          border: 2px solid white;
          animation: dropIn 0.6s ease;
        }

        @keyframes pulseGlow {
          0% { box-shadow: 0 0 0 0 rgba(168, 85, 247, 0.6); }
          70% { box-shadow: 0 0 0 15px rgba(168, 85, 247, 0); }
          100% { box-shadow: 0 0 0 0 rgba(168, 85, 247, 0); }
        }

        @keyframes dropIn {
          from { transform: translate(-50%, -100%) scale(0); opacity: 0; }
          to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }

        .map-tooltip {
          position: absolute;
          bottom: 25px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 12px 16px;
          border-radius: 16px;
          width: 180px;
          opacity: 0;
          pointer-events: none;
          transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 100;
          box-shadow: 0 20px 40px rgba(0,0,0,0.6);
          color: white;
        }

        .map-pin:hover .map-tooltip, 
        .cluster-pin:hover .map-tooltip {
          opacity: 1;
          transform: translateX(-50%) translateY(-5px);
        }

        .map-tooltip h4 { margin: 0 0 4px 0; font-size: 13px; color: #a855f7; font-weight: 800; }
        .map-tooltip p { margin: 2px 0; font-size: 11px; opacity: 0.8; font-weight: 600; }

        .is-highlighted {
          background: #f43f5e !important;
          box-shadow: 0 0 25px #f43f5e !important;
          z-index: 50;
          transform: translate(-50%, -50%) scale(1.4);
        }

        .user-marker {
          position: absolute;
          transform: translate(-50%, -100%);
          font-size: 24px;
          z-index: 40;
          filter: drop-shadow(0 5px 10px rgba(0,0,0,1));
        }
      `}</style>

      <div className="map-container">
        <div className="map-label-header">✨ RADAR: LIVE SURPLUS FEED</div>

        {/* Heat Zones */}
        {clusteredItems.map((cluster, idx) => cluster.members.length > 2 && (
          <div key={`heat-${idx}`} className="heat-zone" style={{ top: cluster.top + "%", left: cluster.left + "%" }} />
        ))}

        {/* Static Area Labels */}
        {chennaiZones.map(zone => (
          <div key={zone.name} className="map-area-label" style={{ top: zone.top + "%", left: zone.left + "%" }}>
            {zone.name}
          </div>
        ))}

        <AnimatePresence>
          {clusteredItems.map((cluster) => {
            const isSingle = cluster.members.length === 1;
            const item = cluster.members[0];

            if (isSingle) {
              const isHigh = highlightedProduct === item.id;
              return (
                <motion.div
                  key={item.id}
                  layoutId={`pin-${item.id}`}
                  className={`map-pin ${isHigh ? 'is-highlighted' : ''}`}
                  style={{ top: cluster.top + "%", left: cluster.left + "%" }}
                  onClick={() => onPinClick?.(item.id)}
                >
                  <div className="map-tooltip">
                    <h4>🏪 {item.shopName || item.ownerName}</h4>
                    <p style={{ color: '#4ade80' }}>💰 ₹{INR(item.price)}</p>
                    <p>🚗 {item.distance || '0.0'} km</p>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={cluster.id}
                className="cluster-pin"
                style={{ top: cluster.top + "%", left: cluster.left + "%" }}
              >
                +{cluster.members.length}
                <div className="map-tooltip">
                  <h4>{cluster.members.length} Vendors</h4>
                  <p>In this cluster zone</p>
                  <p style={{ fontSize: '9px', marginTop: '6px' }}>Click to expand view</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* User Markers */}
        {userLocations?.map((loc, idx) => (
          <motion.div
            key={`user-${idx}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="user-marker"
            style={{ top: loc.top + "%", left: loc.left + "%" }}
          >
            📍
          </motion.div>
        ))}

        {/* Distance Line Visualization for Highlighted Product */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>
          {highlightedProduct && userLocations?.[0] && clusteredItems.some(c => c.members.some(m => m.id === highlightedProduct)) && (() => {
             const cluster = clusteredItems.find(c => c.members.some(m => m.id === highlightedProduct));
             if (!cluster) return null;
             const user = userLocations[0];
             const highlightedItem = cluster.members.find(m => m.id === highlightedProduct) || cluster.members[0];
             const distVal = parseFloat(highlightedItem.distance || '0');
             const lineColor = distVal < 5 ? "#4ade80" : "rgba(244,63,94,0.3)";
             
             return (
               <>
                 <motion.line 
                   initial={{ pathLength: 0 }}
                   animate={{ pathLength: 1 }}
                   transition={{ duration: 0.5, ease: "easeInOut" }}
                   x1={`${user.left}%`} 
                   y1={`${user.top}%`} 
                   x2={`${cluster.left}%`} 
                   y2={`${cluster.top}%`} 
                   stroke={lineColor} 
                   strokeWidth="3" 
                   strokeDasharray="6,6"
                   style={{ filter: `drop-shadow(0px 0px 5px ${lineColor})` }}
                 />
                 <circle cx={`${cluster.left}%`} cy={`${cluster.top}%`} r="6" fill={lineColor} />
                 <circle cx={`${user.left}%`} cy={`${user.top}%`} r="6" fill="#a855f7" />
               </>
             );
          })()}
        </svg>
      </div>
    </>
  );
};

export default MapView;

