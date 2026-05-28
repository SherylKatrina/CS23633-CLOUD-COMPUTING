import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, isAuthenticated } from '../auth/cognito';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock } from 'lucide-react';

const Login = ({ setIsAuthenticated }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // If already logged in, bounce away from /login immediately
  useEffect(() => {
    if (isAuthenticated()) {
      const role = localStorage.getItem("role") || "buyer";
      navigate(role === "vendor" ? "/vendor-dashboard" : "/products", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Kicks off Cognito Hosted UI OAuth redirect
    login();
  };

  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '80vh', padding: '1rem' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-morphism"
        style={{ width: '100%', maxWidth: '420px', padding: '3rem', position: 'relative', overflow: 'hidden' }}
      >
        {/* Glow accent */}
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'var(--primary-glow)', filter: 'blur(70px)', borderRadius: '50%' }} />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ width: '70px', height: '70px', background: 'rgba(124, 58, 237, 0.1)', borderRadius: '24px', display: 'grid', placeItems: 'center', margin: '0 auto 1.5rem', border: '1px solid rgba(124, 58, 237, 0.2)' }}>
            <LogIn size={32} color="var(--primary)" />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', color: 'white' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-gray)', marginTop: '0.75rem' }}>
            Sign in securely with your ECOMM LITE account
          </p>
        </div>

        {/* Single CTA — kicks off Cognito Hosted UI */}
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
          {/* Visual email/password hints (read-only — Cognito handles the actual form) */}
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-gray)', pointerEvents: 'none' }} />
            <input
              type="email"
              placeholder="Enter credentials on Cognito page →"
              readOnly
              tabIndex={-1}
              style={{ width: '100%', padding: '14px 14px 14px 48px', opacity: 0.4, cursor: 'default' }}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-gray)', pointerEvents: 'none' }} />
            <input
              type="password"
              placeholder="••••••••"
              readOnly
              tabIndex={-1}
              style={{ width: '100%', padding: '14px 14px 14px 48px', opacity: 0.4, cursor: 'default' }}
            />
          </div>

          {/* Cognito security badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', opacity: 0.5, fontSize: '0.78rem', color: 'var(--text-gray)' }}>
            <span>🔒</span>
            <span>Secured by AWS Cognito · ap-southeast-2</span>
          </div>

          <button
            type="submit"
            className="btn-premium"
            disabled={loading}
            style={{ marginTop: '0.5rem', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <LogIn size={18} />
            {loading ? 'Redirecting to login…' : 'Continue with AWS Cognito'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-gray)', fontSize: '0.9rem' }}>
          No account?{' '}
          <span
            onClick={() => login()}
            style={{ color: 'var(--primary)', fontWeight: '600', cursor: 'pointer' }}
          >
            Sign Up
          </span>
          {' '}via Cognito
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
