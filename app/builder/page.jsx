"use client";

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectItem, removeItem, updateQuantity } from '@/features/builder/builderSlice';
import { addItemsToCart } from '@/features/cart/cartSlice';
import { getProduct, removeErrors as removeProductErrors } from '@/features/products/productSlice';
import { getAllCategories } from '@/features/category/categorySlice';
import Image from 'next/image';
import '../../componentStyles/EventBuilder.css';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { toast } from 'react-toastify';

const EventBuilder = () => {
    const dispatch = useDispatch();
    
    // Get categories and products from Redux
    const { categories, loading: categoriesLoading } = useSelector((state) => state.category);
    const { selectedItems } = useSelector((state) => state.builder);
    const { products, loading: productsLoading } = useSelector((state) => state.product);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Fetch categories on mount
    useEffect(() => {
        dispatch(getAllCategories());
    }, [dispatch]);

    const totalSelected = Object.values(selectedItems).flat().length;
    const totalPrice = Object.values(selectedItems).flat().reduce((sum, item) => sum + ((item.offeredPrice || item.price) * (item.quantity || 1)), 0);

    const handleOpenModal = (category) => {
        setCurrentCategory(category);
        setIsModalOpen(true);
        setSearchTerm(''); // Reset search
        // Fetch products for this specific category
        dispatch(getProduct({ category: category.name }));
    };

    const handleSelectItem = (product) => {
        dispatch(selectItem({ stepId: currentCategory._id, product }));
        setIsModalOpen(false);
        toast.success(`${product.name} added to your event plan.`);
    };

    const handleRemoveItem = (categoryId, index) => {
        dispatch(removeItem({ stepId: categoryId, index }));
    };

    const handleUpdateQuantity = (categoryId, index, newQuantity) => {
        dispatch(updateQuantity({ stepId: categoryId, index, quantity: newQuantity }));
    };

    const handleAddAllToCart = () => {
        if (!startDate || !endDate) {
            toast.error('Please select event dates first.');
            return;
        }

        const allItems = Object.values(selectedItems).flat();
        if (allItems.length === 0) {
            toast.error('Please select at least one item.');
            return;
        }

        allItems.forEach(item => {
            dispatch(addItemsToCart({ 
                id: item._id, 
                quantity: item.quantity || 1,
                startDate,
                endDate
            }));
        });
        toast.success('All items added to cart for the selected dates!');
    };

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="builder-container">
            <div className="builder-header">
                <div>
                    <h1>Event Package Builder</h1>
                    <p>Select multiple items from your available categories</p>
                </div>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <div className="date-picker-group" style={{ display: 'flex', gap: '10px' }}>
                        <div>
                            <label style={{ fontSize: '12px', display: 'block' }}>Event Start</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ddd' }} />
                        </div>
                        <div>
                            <label style={{ fontSize: '12px', display: 'block' }}>Event End</label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ddd' }} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="builder-steps">
                {categoriesLoading ? (
                    <p>Loading categories...</p>
                ) : categories.length > 0 ? (
                    categories.map((category) => (
                        <div key={category._id} className="builder-step">
                            <div className="step-info-row">
                                <div className="step-info">
                                    <div className="step-icon">
                                        {category.image && category.image[0] ? (
                                            <Image src={category.image[0].url} alt={category.name} width={40} height={40} style={{ borderRadius: '50%' }} />
                                        ) : (
                                            <span>📂</span>
                                        )}
                                    </div>
                                    <div className="step-details">
                                        <h3>{category.name}</h3>
                                        <p>Add {category.name} to your event</p>
                                    </div>
                                </div>
                                <div className="builder-actions">
                                    <button className="choose-btn" onClick={() => handleOpenModal(category)}>
                                        + Add {category.name}
                                    </button>
                                </div>
                            </div>

                            {selectedItems[category._id] && selectedItems[category._id].length > 0 && (
                                <div className="selected-items-list">
                                    {selectedItems[category._id].map((item, index) => (
                                        <div key={`${item._id}-${index}`} className="selected-product">
                                            <Image 
                                                src={item.image[0]?.url || '/images/placeholder.svg'} 
                                                alt={item.name}
                                                width={60}
                                                height={60}
                                            />
                                            <div className="product-info">
                                                <h4>{item.name}</h4>
                                                <p>৳{item.offeredPrice || item.price}</p>
                                            </div>
                                            <div className="quantity-controls">
                                                <button onClick={() => handleUpdateQuantity(category._id, index, (item.quantity || 1) - 1)}>
                                                    <RemoveIcon fontSize="small" />
                                                </button>
                                                <span>{item.quantity || 1}</span>
                                                <button onClick={() => handleUpdateQuantity(category._id, index, (item.quantity || 1) + 1)}>
                                                    <AddIcon fontSize="small" />
                                                </button>
                                            </div>
                                            <button className="remove-btn" onClick={() => handleRemoveItem(category._id, index)}>
                                                <DeleteIcon />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No categories found. Please add categories in the admin dashboard.</p>
                )}
            </div>

            <div className="builder-summary">
                <div className="summary-info">
                    <h2>Total Summary</h2>
                    <p>{totalSelected} categories configured</p>
                </div>
                <div className="total-price">
                    ৳{totalPrice}
                </div>
                <button 
                    className="add-all-btn" 
                    onClick={handleAddAllToCart}
                    disabled={totalSelected === 0}
                >
                    <ShoppingCartIcon /> Add All to Cart
                </button>
            </div>

            {isModalOpen && (
                <div className="builder-modal-overlay">
                    <div className="builder-modal">
                        <div className="modal-header">
                            <h3>Select {currentCategory?.name}</h3>
                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                <div className="search-box" style={{ position: 'relative' }}>
                                    <input 
                                        type="text" 
                                        placeholder="Search products..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{ padding: '8px 30px 8px 10px', borderRadius: '5px', border: '1px solid #ddd' }}
                                    />
                                    <SearchIcon style={{ position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                                </div>
                                <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <CloseIcon />
                                </button>
                            </div>
                        </div>
                        <div className="modal-content">
                            {productsLoading ? (
                                <p>Loading products...</p>
                            ) : filteredProducts.length > 0 ? (
                                <div className="product-grid">
                                    {filteredProducts.map((product) => (
                                        <div key={product._id} className="product-card" onClick={() => handleSelectItem(product)}>
                                            <Image 
                                                src={product.image[0]?.url || '/images/placeholder.svg'} 
                                                alt={product.name}
                                                width={150}
                                                height={150}
                                            />
                                            <h4>{product.name}</h4>
                                            <p className="price">৳{product.offeredPrice || product.price}</p>
                                            <button className="select-product-btn">Select</button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '40px' }}>
                                    <p>No products found in "{currentCategory?.name}" category.</p>
                                    <p style={{ fontSize: '14px', color: '#666' }}>Make sure you have assigned products to this category in the admin panel.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventBuilder;
