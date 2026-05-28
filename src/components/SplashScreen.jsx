import React from 'react';
import { motion } from 'framer-motion';

const SplashScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.8, delay: 2, ease: "easeInOut" }}
      onAnimationComplete={() => document.body.style.overflow = 'auto'}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#0F172A',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        pointerEvents: 'none'
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}
      >
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #7C3AED, #4C1D95)',
          borderRadius: '20px',
          display: 'grid',
          placeItems: 'center',
          boxShadow: '0 0 40px rgba(124, 58, 237, 0.6)'
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        </div>
        <motion.h1 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700', 
            letterSpacing: '4px',
            color: 'white',
            textShadow: '0 0 20px rgba(124, 58, 237, 0.5)'
          }}
        >
          ECOMM LITE
        </motion.h1>
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
