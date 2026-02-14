import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [role, setRole] = useState('customer');

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({ 
                    email, 
                    password,
                    options: {
                        data: {
                            role: role
                        }
                    }
                });
                if (error) throw error;
            }
            navigate('/');
        } catch (error) {
            alert(error.error_description || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container container" style={{maxWidth: '400px', margin: '40px auto', border: '1px solid var(--border-color)', padding: '20px', borderRadius: '5px', background: 'var(--surface-primary)'}}>
            <h1 style={{fontSize: '28px', marginBottom: '20px'}}>{isLogin ? 'Sign-In' : 'Create Account'}</h1>
            
            <div style={{
                background: 'var(--surface-secondary)', 
                border: '1px solid var(--border-color)', 
                borderRadius: '4px', 
                padding: '10px 12px', 
                marginBottom: '20px', 
                fontSize: '12px', 
                color: 'var(--text-secondary)'
            }}>
                ℹ️ This is a test form. You can enter fake data to test the application.
            </div>

            <form onSubmit={handleAuth}>
                <div style={{marginBottom: '15px'}}>
                    <label style={{fontWeight: 'bold', fontSize: '12px'}}>Email</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{width: '100%', padding: '5px 8px', marginTop: '5px', borderRadius: '4px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)'}}
                    />
                </div>
                <div style={{marginBottom: '15px'}}>
                    <label style={{fontWeight: 'bold', fontSize: '12px'}}>Password</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        style={{width: '100%', padding: '5px 8px', marginTop: '5px', borderRadius: '4px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)'}}
                    />
                </div>

                {/* Role selector — only shown when creating a new account */}
                {!isLogin && (
                    <div style={{marginBottom: '15px'}}>
                        <label style={{fontWeight: 'bold', fontSize: '12px', display: 'block', marginBottom: '8px'}}>I want to register as:</label>
                        <div style={{display: 'flex', gap: '10px'}}>
                            <label 
                                style={{
                                    flex: 1, 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '8px',
                                    padding: '10px 12px', 
                                    border: role === 'customer' ? '2px solid var(--amazon-orange)' : '1px solid var(--border-color)', 
                                    borderRadius: '6px', 
                                    cursor: 'pointer',
                                    background: role === 'customer' ? 'var(--surface-secondary)' : 'var(--surface-primary)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <input 
                                    type="radio" 
                                    name="role" 
                                    value="customer" 
                                    checked={role === 'customer'} 
                                    onChange={() => setRole('customer')} 
                                />
                                <div>
                                    <div style={{fontWeight: 'bold', fontSize: '13px'}}>🛒 Client</div>
                                    <div style={{fontSize: '11px', color: 'var(--text-secondary)'}}>Buy & add to wishlist</div>
                                </div>
                            </label>
                            <label 
                                style={{
                                    flex: 1, 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '8px',
                                    padding: '10px 12px', 
                                    border: role === 'seller' ? '2px solid var(--amazon-orange)' : '1px solid var(--border-color)', 
                                    borderRadius: '6px', 
                                    cursor: 'pointer',
                                    background: role === 'seller' ? 'var(--surface-secondary)' : 'var(--surface-primary)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <input 
                                    type="radio" 
                                    name="role" 
                                    value="seller" 
                                    checked={role === 'seller'} 
                                    onChange={() => setRole('seller')} 
                                />
                                <div>
                                    <div style={{fontWeight: 'bold', fontSize: '13px'}}>📦 Seller</div>
                                    <div style={{fontSize: '11px', color: 'var(--text-secondary)'}}>Manage products</div>
                                </div>
                            </label>
                        </div>
                    </div>
                )}

                <button 
                    disabled={loading} 
                    style={{
                        width: '100%', 
                        background: 'var(--login-btn-bg)', 
                        border: '1px solid var(--login-btn-border)', 
                        padding: '8px', 
                        cursor: 'pointer',
                        borderRadius: '3px',
                        boxShadow: '0 1px 0 rgba(255,255,255,.4) inset',
                        color: '#0f1111',
                        fontWeight: 'bold',
                        fontSize: '14px'
                    }}
                >
                    {loading ? 'Processing...' : (isLogin ? 'Sign-In' : `Create ${role === 'seller' ? 'Seller' : 'Client'} Account`)}
                </button>
            </form>
            <div style={{textAlign: 'center', marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '10px'}}>
                <span 
                    onClick={() => setIsLogin(!isLogin)}
                    style={{color: 'var(--accent-link)', fontSize: '12px', cursor: 'pointer'}}
                >
                    {isLogin ? 'New to Amazon? Create your account' : 'Already have an account? Sign-In'}
                </span>
            </div>
        </div>
    );
};

export default LoginPage;
