import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, X, Bot, Sparkles } from 'lucide-react';

const Chatbot = ({ products }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hey bestie! 🌎 I'm your Surplus Assistant. Ask me for cheap deals, premium picks, or recommendations!" }
  ]);
  
  // 🔥 STEP 2: SAFE PRODUCT ACCESS
  const safeProducts = Array.isArray(products) ? products : [];

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => { scrollToBottom(); }, [messages]);

  // 🔥 STEP 3: SYNCHRONOUS RESPONSE GENERATOR
  function getBotResponse(input, products) {
    try {
      const text = input.toLowerCase();
      const list = Array.isArray(products) ? products : [];

      if (list.length === 0) {
        return "No products available right now 😅";
      }

      // 🔥 FIND MATCHING PRODUCT
      const matchedProduct = list.find(p =>
        text.includes(p.name.toLowerCase().split(" ")[0]) ||
        text.includes(p.name.toLowerCase())
      );

      // 🟢 PRICE QUERY
      if (text.includes("price") && matchedProduct) {
        return `💰 ${matchedProduct.name} costs $${matchedProduct.price.toFixed(2)}`;
      }

      // 🟢 GENERAL PRODUCT QUERY
      // Make sure we aren't overriding generic commands like cheap/expensive
      if (matchedProduct && !text.includes("cheap") && !text.includes("expensive") && !text.includes("premium")) {
        return `🛍️ ${matchedProduct.name} is available for $${matchedProduct.price.toFixed(2)}`;
      }

      // 🟢 CHEAPEST
      if (text.includes("cheap") || text.includes("lowest")) {
        const cheapest = [...list].sort((a,b) => a.price - b.price)[0];
        return `💸 Cheapest: ${cheapest.name} at $${cheapest.price.toFixed(2)}`;
      }

      // 🟢 EXPENSIVE
      if (text.includes("expensive") || text.includes("premium")) {
        const expensive = [...list].sort((a,b) => b.price - a.price)[0];
        return `💎 Premium: ${expensive.name} at $${expensive.price.toFixed(2)}`;
      }

      // 🟢 EXPIRING
      if (text.includes("expire") || text.includes("soon")) {
        const urgent = list.filter(p => p.expiryDays <= 3);
        if (urgent.length === 0) return "No urgent items right now 😌";
        return `⚡ ${urgent[0].name} expires soon!`;
      }

      // 🟢 CATEGORY
      if (text.includes("grocery") || text.includes("groceries")) {
        const groceries = list.filter(p => p.category.toLowerCase().includes("grocer"));
        return groceries.length
          ? `🥬 Try ${groceries[0].name} for $${groceries[0].price.toFixed(2)}`
          : "No groceries available 😅";
      }

      if (text.includes("tech") || text.includes("electronic")) {
        const tech = list.filter(p => p.category.toLowerCase().includes("tech") || p.category.toLowerCase().includes("electronic"));
        return tech.length
          ? `💻 Check ${tech[0].name} for $${tech[0].price.toFixed(2)}`
          : "No tech items 😅";
      }

      return "Ask me about product prices, deals, or categories 😉";
    } catch (err) {
      console.error("Chatbot error:", err);
      return "Oops 😅 something broke!";
    }
  }

  // 🔥 STEP 4: HANDLE SEND WITHOUT DELAYS
  function handleSend() {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };

    const botMsg = {
      role: "bot",
      text: getBotResponse(input, safeProducts)
    };

    setMessages(prev => [...prev, userMsg, botMsg]);
    setInput("");
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="glass-morphism" style={{ position: 'fixed', bottom: '2rem', right: '2rem', width: '64px', height: '64px', borderRadius: '24px', display: 'grid', placeItems: 'center', cursor: 'pointer', border: '1px solid var(--glass-border)', zIndex: 1000, background: 'var(--accent-gradient)' }} >
        <MessageSquare color="white" size={32} />
      </button>

      {isOpen && (
        <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="glass-morphism" style={{ position: 'fixed', bottom: '6rem', right: '2rem', width: '380px', height: '520px', borderRadius: '32px', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid var(--glass-border)', zIndex: 1001, boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }} >
          <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '12px', display: 'grid', placeItems: 'center' }}>
                <Bot color="white" size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Surplus Assistant</h3>
                <p style={{ fontSize: '0.7rem', color: '#4ade80', fontWeight: '600' }}>ONLINE • INSTANT SYNC</p>
              </div>
            </div>
            <X size={24} onClick={() => setIsOpen(false)} style={{ cursor: 'pointer', opacity: 0.5 }} />
          </div>

          <div style={{ flexGrow: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.75rem', alignSelf: m.role === 'bot' ? 'flex-start' : 'flex-end', maxWidth: '85%' }}>
                {m.role === 'bot' && (
                  <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                    <Sparkles size={16} color="var(--primary)" />
                  </div>
                )}
                <div style={{ padding: '1rem', borderRadius: '18px', fontSize: '0.9rem', lineHeight: '1.5', background: m.role === 'bot' ? 'rgba(255,255,255,0.05)' : 'var(--accent-gradient)', color: 'white', border: m.role === 'bot' ? '1px solid var(--glass-border)' : 'none', borderTopLeftRadius: m.role === 'bot' ? '4px' : '18px', borderTopRightRadius: m.role === 'bot' ? '18px' : '4px', whiteSpace: 'pre-wrap' }}>
                   {m.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ padding: '1.25rem', display: 'flex', gap: '0.75rem', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid var(--glass-border)' }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask about deals..." style={{ flexGrow: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '0 1rem', color: 'white', outline: 'none' }} />
            <button onClick={handleSend} className="btn-premium" style={{ width: '48px', height: '48px', padding: 0 }}>
              <Send size={20} />
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Chatbot;
