'use client';

import React, { useEffect } from 'react';
import { removeErrors, removeItemFromCart, removeMessage, addItemsToCart } from '@/features/cart/cartSlice';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

function CartItem({ item }) {
    const { success, loading, error, message } = useSelector(state => state.cart);
    const dispatch = useDispatch();

    const calculateDays = (start, end) => {
        if (!start || !end) return 1;
        const s = new Date(start);
        const e = new Date(end);
        const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
        return diff > 0 ? diff : 1;
    };

    const totalDays = calculateDays(item.startDate, item.endDate);
    const securityDepositTotal = (item.securityDeposit || 0) * item.quantity;
    const rentalTotal = item.price * item.quantity * totalDays;

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity < 1) {
            toast.error('Quantity cannot be less than 1', { position: 'top-center', autoClose: 3000 });
            return;
        }
        if (newQuantity > item.stock) {
            toast.error('Cannot exceed available stock!', { position: 'top-center', autoClose: 3000 });
            return;
        }
        // Dispatch the action to update the quantity in the Redux store
        dispatch(addItemsToCart({ 
            id: item.product, 
            quantity: newQuantity, 
            color: item.color,
            startDate: item.startDate,
            endDate: item.endDate
        }));
    };

    const decreaseQuantity = () => {
        handleQuantityChange(item.quantity - 1);
    };

    const increaseQuantity = () => {
        handleQuantityChange(item.quantity + 1);
    };

    useEffect(() => {
        if (error) {
            toast.error(error.message || 'An error occurred', { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors());
        }
    }, [dispatch, error]);

    useEffect(() => {
        if (success) {
            toast.success(message, {
                position: 'top-center',
                autoClose: 3000,
                toastId: 'cart-update'
            });
            dispatch(removeMessage());
        }
    }, [dispatch, success, message]);

    const handleRemove = () => {
        if (loading) return;
        dispatch(removeItemFromCart(item.product));
        toast.success("Item removed from cart successfully", {
            position: 'top-center',
            autoClose: 3000,
            toastId: 'cart-remove' // Use a different toastId to avoid conflicts
        });
    };

    return (
        <div className="cart-item">
            <div className="item-info">
                <img src={item.image} alt={item.name} className="item-image" />
                <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-price"><strong>Rate :</strong>TK {item.price.toFixed(1)} / Day</p>
                    {item.startDate && item.endDate && (
                        <p className="item-dates"><strong>Dates :</strong> {item.startDate} to {item.endDate} ({totalDays} Days)</p>
                    )}
                    {item.securityDeposit > 0 && (
                        <p className="item-deposit"><strong>Deposit :</strong> TK {securityDepositTotal.toFixed(1)} (Refundable)</p>
                    )}
                    {item.color && <p className="item-color"><strong>Color :</strong> {item.color}</p>}
                    <p className="item-quantity"><strong>Quantity :</strong>{item.quantity}</p>
                </div>
            </div>
            <div className="quantity-controls">
                <button className="quantity-button-decrease-btn" onClick={decreaseQuantity} disabled={loading}>-</button>
                <input type="number" readOnly min='1' value={item.quantity} className="quantity-input" />
                <button className="quantity-button-increase-btn" onClick={increaseQuantity} disabled={loading}>+</button>
            </div>
            <div className="item-total">
                <span className="item-total-price">TK {(rentalTotal + securityDepositTotal).toFixed(1)}</span>
            </div>
            <div className="item-actions">
                <button className="remove-item-btn" onClick={handleRemove} disabled={loading}>Remove</button>
            </div>
        </div>
    );
}

export default CartItem;