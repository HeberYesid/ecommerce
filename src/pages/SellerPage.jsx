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
    const [loading, setLoading] = useState(false);

    if (!user) {
        return <div style={{textAlign: 'center', marginTop: '50px'}}>Please <a href="/login">sign in</a> to access the Seller Dashboard</div>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.from('products').insert([
                {
                    title,
                    price: parseFloat(price),
                    description,
                    image_url: imageUrl,
                    seller_id: user.id
                }
            ]);

            if (error) throw error;
            alert('Product added successfully!');
            setTitle('');
            setPrice('');
            setDescription('');
            setImageUrl('');
        } catch (error) {
            alert('Error adding product: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="seller-dashboard container" style={{maxWidth: '800px', margin: '40px auto'}}>
            <h1 className="dashboard-title" style={{fontSize: '28px', marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px'}}>Seller Dashboard</h1>
            
            <div className="add-product-form" style={{background: '#fcfcfc', border: '1px solid #ddd', padding: '20px', borderRadius: '4px'}}>
                <h2 style={{fontSize: '20px', marginBottom: '15px'}}>Add a New Product</h2>
                <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                    <div>
                        <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>Product Title</label>
                        <input 
                            type="text" 
                            required 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '3px'}}
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
                                style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '3px'}}
                            />
                        </div>
                        <div style={{flex: 2}}>
                            <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>Image URL</label>
                            <input 
                                type="url" 
                                required 
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '3px'}}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>Description</label>
                        <textarea 
                            required 
                            rows="4" 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '3px', resize: 'vertical'}}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{
                            alignSelf: 'flex-start',
                            background: '#f0c14b',
                            border: '1px solid #a88734',
                            padding: '8px 20px',
                            cursor: 'pointer',
                            borderRadius: '3px',
                            fontWeight: 'bold'
                        }}
                    >
                        {loading ? 'Adding Product...' : 'Add Product'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SellerPage;
