import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, type ProductFormData } from '../schemas';
import type { Product } from '../types';

const SellerPage: React.FC = () => {
    const { user, isSeller, isLoggedIn } = useAuth();

    const [loading, setLoading] = useState(false);
    const [myProducts, setMyProducts] = useState<Product[]>([]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            title: '',
            price: '',
            description: '',
            image_url: '',
            category: 'Electronics',
        },
    });

    useEffect(() => {
        if (user && isSeller) {
            fetchMyProducts();
        }
    }, [user, isSeller]);

    // Redirect visitors to login
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    // Block non-sellers
    if (!isSeller) {
        return (
            <div className="container" style={{padding: '40px', textAlign: 'center'}}>
                <h2>Access Restricted</h2>
                <p style={{marginTop: '10px', color: 'var(--text-secondary)'}}>
                    The Seller Dashboard is only available for seller accounts.
                </p>
                <p style={{marginTop: '5px', color: 'var(--text-secondary)', fontSize: '13px'}}>
                    If you want to sell products, please create a new account with the seller role.
                </p>
                <Link to="/" style={{color: 'var(--accent-link)', marginTop: '15px', display: 'inline-block'}}>Go to Home</Link>
            </div>
        );
    }

    const fetchMyProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('seller_id', user!.id);

            if (error) throw error;
            setMyProducts((data as Product[]) || []);
        } catch (error) {
            console.error('Error fetching my products:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        setLoading(true);
        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setMyProducts(prev => prev.filter(p => p.id !== id));
            alert('Product deleted successfully');
        } catch (error: any) {
            alert('Error deleting product: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: ProductFormData) => {
        setLoading(true);

        try {
            const { data: inserted, error } = await supabase.from('products').insert([
                {
                    title: data.title,
                    price: parseFloat(data.price),
                    description: data.description,
                    image_url: data.image_url,
                    category: data.category,
                    seller_id: user!.id
                }
            ]).select();

            if (error) throw error;
            alert('Product added successfully!');
            reset();
            if (inserted) setMyProducts(prev => [...prev, ...(inserted as Product[])]);
        } catch (error: any) {
            alert('Error adding product: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="seller-dashboard container">
            <h1 style={{fontSize: '24px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px'}}>
                📦 Seller Dashboard
                <span style={{fontSize: '13px', fontWeight: 'normal', marginLeft: '10px', color: 'var(--text-secondary)'}}>
                    ({user?.email})
                </span>
            </h1>

            <div style={{background: 'var(--surface-tertiary)', border: '1px solid var(--border-color)', padding: '20px', borderRadius: '8px', marginBottom: '40px'}}>
                <h2 style={{fontSize: '20px', marginBottom: '15px'}}>Add a New Product</h2>
                <form onSubmit={handleSubmit(onSubmit)} noValidate style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                    {/* Title */}
                    <div>
                        <label className="form-label">Product Title</label>
                        <input
                            type="text"
                            className={`form-input ${errors.title ? 'form-input-error' : ''}`}
                            {...register('title')}
                            placeholder="e.g. Wireless Bluetooth Headphones"
                        />
                        {errors.title && <p className="form-error">{errors.title.message}</p>}
                    </div>

                    {/* Price + Category Row */}
                    <div className="seller-form-row">
                        <div>
                            <label className="form-label">Price ($)</label>
                            <input
                                type="text"
                                inputMode="decimal"
                                className={`form-input ${errors.price ? 'form-input-error' : ''}`}
                                {...register('price')}
                                placeholder="29.99"
                            />
                            {errors.price && <p className="form-error">{errors.price.message}</p>}
                        </div>
                        <div>
                            <label className="form-label">Category</label>
                            <select
                                className={`form-input ${errors.category ? 'form-input-error' : ''}`}
                                {...register('category')}
                            >
                                <option value="Electronics">Electronics</option>
                                <option value="Gaming">Gaming</option>
                                <option value="Wearables">Wearables</option>
                                <option value="Home">Home</option>
                                <option value="Fashion">Fashion</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.category && <p className="form-error">{errors.category.message}</p>}
                        </div>
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className="form-label">Image URL</label>
                        <input
                            type="url"
                            className={`form-input ${errors.image_url ? 'form-input-error' : ''}`}
                            {...register('image_url')}
                            placeholder="https://example.com/image.jpg"
                        />
                        {errors.image_url && <p className="form-error">{errors.image_url.message}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="form-label">Description</label>
                        <textarea
                            rows={4}
                            className={`form-input ${errors.description ? 'form-input-error' : ''}`}
                            {...register('description')}
                            placeholder="Describe your product in detail..."
                            style={{resize: 'vertical'}}
                        />
                        {errors.description && <p className="form-error">{errors.description.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="form-submit-btn"
                        style={{alignSelf: 'flex-start'}}
                    >
                        {loading ? 'Processing...' : 'Add Product'}
                    </button>
                </form>
            </div>

            {/* Product Listings */}
            <div>
                <h2 style={{fontSize: '22px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px'}}>Your Listings</h2>
                {myProducts.length === 0 ? (
                    <p style={{color: 'var(--text-secondary)'}}>No products listed yet. Add your first product above!</p>
                ) : (
                    <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                        {myProducts.map(product => (
                            <div key={product.id} className="seller-product-item">
                                <img src={product.image_url} alt={product.title} />
                                <div style={{flexGrow: 1, minWidth: 0}}>
                                    <h3 style={{fontSize: '16px', margin: '0 0 5px 0', wordBreak: 'break-word'}}>{product.title}</h3>
                                    <p style={{fontWeight: 'bold', color: 'var(--price-color)'}}>${product.price}</p>
                                    <p style={{fontSize: '12px', color: 'var(--text-secondary)', marginTop: '3px'}}>{product.category}</p>
                                </div>
                                <button
                                    onClick={() => handleDelete(product.id)}
                                    style={{
                                        background: 'var(--surface-primary)',
                                        border: '1px solid var(--border-color)',
                                        padding: '5px 10px',
                                        borderRadius: '5px',
                                        color: 'var(--delete-color)',
                                        cursor: 'pointer',
                                        flexShrink: 0
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerPage;
