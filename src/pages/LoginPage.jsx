import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = isLogin
                ? await supabase.auth.signInWithPassword({ email, password })
                : await supabase.auth.signUp({ 
                    email, 
                    password,
                    options: {
                        data: {
                            role: 'customer'
                        }
                    }
                });

            if (error) throw error;
            navigate('/');
        } catch (error) {
            alert(error.error_description || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container container" style={{maxWidth: '400px', margin: '40px auto', border: '1px solid var(--border-color)', padding: '20px', borderRadius: '5px', background: 'var(--surface-primary)'}}>
            <h1 className="a-size-medium" style={{fontSize: '28px', marginBottom: '20px'}}>Sign-In</h1>
            <form onSubmit={handleAuth}>
                <div className="mb-4" style={{marginBottom: '15px'}}>
                    <label style={{fontWeight: 'bold', fontSize: '12px'}}>Email (phone for mobile accounts)</label>
                    <input 
                        type="email" 
                        className="a-input-text" 
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
                        className="a-input-text" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{width: '100%', padding: '5px 8px', marginTop: '5px', borderRadius: '4px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)'}}
                    />
                </div>
                <button 
                    disabled={loading} 
                    className="a-button-primary"
                    style={{
                        width: '100%', 
                        background: 'var(--login-btn-bg)', 
                        border: '1px solid var(--login-btn-border)', 
                        padding: '5px 8px', 
                        cursor: 'pointer',
                        borderRadius: '3px',
                        boxShadow: '0 1px 0 rgba(255,255,255,.4) inset',
                        color: '#0f1111'
                    }}
                >
                    {loading ? 'Processing...' : (isLogin ? 'Sign-In' : 'Create your Amazon account')}
                </button>
            </form>
            <div className="a-divider-break" style={{textAlign: 'center', marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '10px'}}>
                <span className="a-declarative" 
                    onClick={() => setIsLogin(!isLogin)}
                    style={{color: 'var(--accent-link)', fontSize: '12px', cursor: 'pointer'}}
                >
                    {isLogin ? 'New to Amazon? Create your Amazon account' : 'Already have an account? Sign-In'}
                </span>
            </div>
        </div>
    );
};

export default LoginPage;
