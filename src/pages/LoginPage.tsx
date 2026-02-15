import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, registerSchema, type LoginFormData, type RegisterFormData } from '../schemas';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [serverError, setServerError] = useState('');

    const loginForm = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    });

    const registerForm = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: { email: '', password: '', confirmPassword: '', role: 'customer' },
    });

    const handleLogin = async (data: LoginFormData) => {
        setLoading(true);
        setServerError('');
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            });
            if (error) throw error;
            navigate('/');
        } catch (error: any) {
            setServerError(error.error_description || error.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (data: RegisterFormData) => {
        setLoading(true);
        setServerError('');
        try {
            const { error } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: { data: { role: data.role } },
            });
            if (error) throw error;
            navigate('/');
        } catch (error: any) {
            setServerError(error.error_description || error.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const switchMode = () => {
        setIsLogin(!isLogin);
        setServerError('');
        loginForm.reset();
        registerForm.reset();
    };

    const watchedRole = registerForm.watch('role');

    return (
        <div className="login-container container" style={{maxWidth: '420px', margin: '40px auto', border: '1px solid var(--border-color)', padding: '25px', borderRadius: '8px', background: 'var(--surface-primary)'}}>
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

            {serverError && (
                <div style={{
                    background: '#fef2f2',
                    border: '1px solid #fca5a5',
                    color: '#b91c1c',
                    padding: '10px 14px',
                    borderRadius: '6px',
                    marginBottom: '16px',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <span>⚠️</span> {serverError}
                </div>
            )}

            {/* ────── LOGIN FORM ────── */}
            {isLogin && (
                <form onSubmit={loginForm.handleSubmit(handleLogin)} noValidate>
                    <div style={{marginBottom: '16px'}}>
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className={`form-input ${loginForm.formState.errors.email ? 'form-input-error' : ''}`}
                            {...loginForm.register('email')}
                            placeholder="you@example.com"
                        />
                        {loginForm.formState.errors.email && <p className="form-error">{loginForm.formState.errors.email.message}</p>}
                    </div>

                    <div style={{marginBottom: '16px'}}>
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className={`form-input ${loginForm.formState.errors.password ? 'form-input-error' : ''}`}
                            {...loginForm.register('password')}
                            placeholder="At least 6 characters"
                        />
                        {loginForm.formState.errors.password && <p className="form-error">{loginForm.formState.errors.password.message}</p>}
                    </div>

                    <button type="submit" disabled={loading} className="form-submit-btn">
                        {loading ? 'Processing...' : 'Sign-In'}
                    </button>
                </form>
            )}

            {/* ────── REGISTER FORM ────── */}
            {!isLogin && (
                <form onSubmit={registerForm.handleSubmit(handleRegister)} noValidate>
                    <div style={{marginBottom: '16px'}}>
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className={`form-input ${registerForm.formState.errors.email ? 'form-input-error' : ''}`}
                            {...registerForm.register('email')}
                            placeholder="you@example.com"
                        />
                        {registerForm.formState.errors.email && <p className="form-error">{registerForm.formState.errors.email.message}</p>}
                    </div>

                    <div style={{marginBottom: '16px'}}>
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className={`form-input ${registerForm.formState.errors.password ? 'form-input-error' : ''}`}
                            {...registerForm.register('password')}
                            placeholder="At least 6 characters"
                        />
                        {registerForm.formState.errors.password && <p className="form-error">{registerForm.formState.errors.password.message}</p>}
                    </div>

                    <div style={{marginBottom: '16px'}}>
                        <label className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            className={`form-input ${registerForm.formState.errors.confirmPassword ? 'form-input-error' : ''}`}
                            {...registerForm.register('confirmPassword')}
                            placeholder="Repeat your password"
                        />
                        {registerForm.formState.errors.confirmPassword && <p className="form-error">{registerForm.formState.errors.confirmPassword.message}</p>}
                    </div>

                    <div style={{marginBottom: '16px'}}>
                        <label className="form-label" style={{marginBottom: '8px'}}>I want to register as:</label>
                        <div style={{display: 'flex', gap: '10px'}}>
                            <label className={`role-card ${watchedRole === 'customer' ? 'role-card-active' : ''}`}>
                                <input type="radio" value="customer" {...registerForm.register('role')} style={{marginRight: '6px'}} />
                                <div>
                                    <div style={{fontWeight: 'bold', fontSize: '13px'}}>🛒 Client</div>
                                    <div style={{fontSize: '11px', color: 'var(--text-secondary)'}}>Buy & add to wishlist</div>
                                </div>
                            </label>
                            <label className={`role-card ${watchedRole === 'seller' ? 'role-card-active' : ''}`}>
                                <input type="radio" value="seller" {...registerForm.register('role')} style={{marginRight: '6px'}} />
                                <div>
                                    <div style={{fontWeight: 'bold', fontSize: '13px'}}>📦 Seller</div>
                                    <div style={{fontSize: '11px', color: 'var(--text-secondary)'}}>Manage products</div>
                                </div>
                            </label>
                        </div>
                        {registerForm.formState.errors.role && <p className="form-error">{registerForm.formState.errors.role.message}</p>}
                    </div>

                    <button type="submit" disabled={loading} className="form-submit-btn">
                        {loading ? 'Processing...' : `Create ${watchedRole === 'seller' ? 'Seller' : 'Client'} Account`}
                    </button>
                </form>
            )}

            <div style={{textAlign: 'center', marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '12px'}}>
                <span
                    onClick={switchMode}
                    style={{color: 'var(--accent-link)', fontSize: '13px', cursor: 'pointer'}}
                >
                    {isLogin ? 'New to Amazon? Create your account' : 'Already have an account? Sign-In'}
                </span>
            </div>
        </div>
    );
};

export default LoginPage;
