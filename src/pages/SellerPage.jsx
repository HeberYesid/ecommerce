import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SellerPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [category, setCategory] = useState('Electronics');
    const [loading, setLoading] = useState(false);

    if (!user) {
        return <div style={{textAlign: 'center', marginTop: '50px'}}>Please <a href="/login">sign in</a> to access the Seller Dashboard</div>;
    }

    const [myProducts, setMyProducts] = useState([]);

    React.useEffect(() => {
        if (user) {
            fetchMyProducts();
        }
    }, [user]);

    const fetchMyProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('seller_id', user.id);
            
            if (error) throw error;
            setMyProducts(data || []);
        } catch (error) {
            console.error('Error fetching my products:', error);
        }
    };

    const handleDelete = async (id) => {
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
        } catch (error) {
            alert('Error deleting product: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase.from('products').insert([
                {
                    title,
                    price: parseFloat(price),
                    description,
                    image_url: imageUrl,
                    category,
                    seller_id: user.id
                }
            ]).select();

            if (error) throw error;
            alert('Product added successfully!');
            setTitle('');
            setPrice('');
            setDescription('');
            setImageUrl('');
            setCategory('Electronics');
            if (data) setMyProducts(prev => [...prev, ...data]);
        } catch (error) {
            alert('Error adding product: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="seller-dashboard container" style={{maxWidth: '800px', margin: '40px auto'}}>
            <h1 className="dashboard-title" style={{fontSize: '28px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px'}}>Seller Dashboard</h1>
            
            <div className="add-product-form" style={{background: 'var(--surface-tertiary)', border: '1px solid var(--border-color)', padding: '20px', borderRadius: '4px', marginBottom: '40px'}}>
                <h2 style={{fontSize: '20px', marginBottom: '15px'}}>Add a New Product</h2>
                <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                    <div>
                        <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>Product Title</label>
                        <input 
                            type="text" 
                            required 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{width: '100%', padding: '8px', border: '1px solid var(--input-border)', borderRadius: '3px', background: 'var(--input-bg)', color: 'var(--text-primary)'}}
                        />
                    </div>

                    <div style={{display: 'flex', gap: '20px'}}>
                        <div style={{flex: 1}}>
                            <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>Price ($)</label>
                            <input 
                                type="number" 
                                step="0.01" 
                                required 
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                style={{width: '100%', padding: '8px', border: '1px solid var(--input-border)', borderRadius: '3px', background: 'var(--input-bg)', color: 'var(--text-primary)'}}
                            />
                        </div>
                        <div style={{flex: 1}}>
                            <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>Category</label>
                            <select 
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                style={{
                                    width: '100%', 
                                    padding: '8px', 
                                    border: '1px solid var(--input-border)', 
                                    borderRadius: '3px',
                                    background: 'var(--input-bg)',
                                    color: 'var(--text-primary)'
                                }}
                            >
                                <option value="Electronics">Electronics</option>
                                <option value="Gaming">Gaming</option>
                                <option value="Wearables">Wearables</option>
                                <option value="Home">Home</option>
                                <option value="Fashion">Fashion</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>Image URL</label>
                        <input 
                            type="url" 
                            required 
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            style={{width: '100%', padding: '8px', border: '1px solid var(--input-border)', borderRadius: '3px', background: 'var(--input-bg)', color: 'var(--text-primary)'}}
                        />
                    </div>

                    <div>
                        <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>Description</label>
                        <textarea 
                            required 
                            rows="4" 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{width: '100%', padding: '8px', border: '1px solid var(--input-border)', borderRadius: '3px', resize: 'vertical', background: 'var(--input-bg)', color: 'var(--text-primary)'}}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{
                            alignSelf: 'flex-start',
                            background: 'var(--login-btn-bg)',
                            border: '1px solid var(--login-btn-border)',
                            padding: '8px 20px',
                            cursor: 'pointer',
                            borderRadius: '3px',
                            fontWeight: 'bold',
                            color: '#0f1111'
                        }}
                    >
                        {loading ? 'Processing...' : 'Add Product'}
                    </button>
                </form>
            </div>

            {/* My Products List */}
            <div className="my-products-list">
                <h2 style={{fontSize: '24px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px'}}>Your Listings</h2>
                {myProducts.length === 0 ? (
                    <p>No products listed yet.</p>
                ) : (
                    <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                        {myProducts.map(product => (
                            <div key={product.id} style={{display: 'flex', gap: '20px', padding: '15px', border: '1px solid var(--border-color)', background: 'var(--surface-primary)', borderRadius: '5px', alignItems: 'center'}}>
                                <img src={product.image_url} alt={product.title} style={{width: '80px', height: '80px', objectFit: 'contain'}} />
                                <div style={{flexGrow: 1}}>
                                    <h3 style={{fontSize: '16px', margin: '0 0 5px 0'}}>{product.title}</h3>
                                    <p style={{fontWeight: 'bold', color: 'var(--price-color)'}}>${product.price}</p>
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
                                        boxShadow: '0 2px 5px rgba(215,215,215, 0.5)'
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
