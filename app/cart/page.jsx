'use client';

import React, { useState, useEffect } from 'react'; // Added useEffect for localStorage
import '@/componentStyles/Cart.css';
import PageTitle from '@/components/PageTitle';
import Footer from '@/components/Footer';
import CartItem from '@/Cart/CartItem';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { saveShippingInfo } from '@/features/cart/cartSlice';
import { toast } from 'react-toastify';

function CartPage() {
    const { cartItems, shippingInfo } = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const [selectedZone, setSelectedUserZone] = useState(shippingInfo.shippingMethod || null);

    // Load payment settings from localStorage
    const [paymentSettings, setPaymentSettings] = useState({
        taxPercentage: 0,
        shippingZones: [],
        freeShippingThreshold: 10000,
    });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchPaymentSettings = async () => {
            try {
                const res = await fetch('/api/payment-settings', { cache: 'no-store' });
                const data = await res.json();
                console.log("Fetched Payment Settings:", data); // Debug log
                setPaymentSettings({
                    taxPercentage: data.taxPercentage || 0,
                    shippingZones: data.shippingZones || [],
                    freeShippingThreshold: data.freeShippingThreshold || 10000,
                });
            } catch (error) {
                toast.error("Error fetching payment settings");
            } finally {
                setLoading(false);
            }
        };
        fetchPaymentSettings();
    }, []);

    const calculateDays = (start, end) => {
        if (!start || !end) return 1;
        const s = new Date(start);
        const e = new Date(end);
        const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return diff > 0 ? diff : 1;
    };

    const subtotal = cartItems.reduce((acc, item) => {
        const days = calculateDays(item.startDate, item.endDate);
        return acc + (item.price * item.quantity * days);
    }, 0);

    const securityDepositTotal = cartItems.reduce((acc, item) => {
        return acc + ((item.securityDeposit || 0) * item.quantity);
    }, 0);
    
    // Dynamic Tax Calculation
    const tax = subtotal * (paymentSettings.taxPercentage / 100); 

    // Dynamic Shipping Charges Calculation
    const isFreeShipping = subtotal >= (paymentSettings.freeShippingThreshold || 10000);
    const zoneData = paymentSettings.shippingZones.find(z => z.name === selectedZone);
    const currentShippingCharges = isFreeShipping ? 0 : (zoneData ? zoneData.cost : 0);

    const total = subtotal + securityDepositTotal + tax + currentShippingCharges;

    const router = useRouter();
    const checkoutHandler = () => {
        // Check for missing color selection
        const itemMissingColor = cartItems.find(item => Array.isArray(item.colors) && item.colors.length > 0 && !item.color);
        if (itemMissingColor) {
            toast.error(`Please select a color for ${itemMissingColor.name}`);
            return;
        }

        if (!selectedZone) {
            toast.error("Please select your shipping area");
            return;
        }
        dispatch(saveShippingInfo({
            address: shippingInfo.address,
            pinCode: shippingInfo.pinCode,
            state: shippingInfo.state,
            city: shippingInfo.city,
            country: shippingInfo.country,
            phoneNumber: shippingInfo.phoneNumber,
            shippingMethod: selectedZone
        }));
        router.push('/shipping'); // Assuming /shipping is the next step
    };

    return (
        <>
            <PageTitle title="Your Cart" />
            {cartItems.length === 0 ? (
                <div className="emply-cart-container">
                    <p className="empty-cart-message">Your cart is Empty</p>
                    <Link href="/products" className='viewproducts'>View Products</Link>
                </div>
            ) : (
                <div className="cart-page">
                    <div className="cart-items">
                        <div className="cart-items-heading">Your Cart</div>
                        <div className="cart-table">
                            <div className="cart-table-header">
                                <div className="header-product">Product</div>
                                <div className="header-quantity">Quantity</div>
                                <div className="header-totalitem-total-heading">Item Total</div>
                                <div className="header-action">Actions</div>
                            </div>
                            {/* cart items*/}
                            {cartItems && cartItems.map((item) => <CartItem item={item} key={item.name} />)}
                        </div>
                    </div>
                    <div className="price-summary">
                        <div className='shipping-page'>
                            <div className=" shipping-summary">
                                <h3 className="price-summary-header">Shipping Area</h3>
                                {loading ? <p>Loading...</p> : (
                                    paymentSettings.shippingZones.length > 0 ? (
                                        paymentSettings.shippingZones.map((zone, idx) => (
                                            <div className='shipping-item' key={idx}>
                                                <input
                                                    type="radio"
                                                    id={`zone-${idx}`}
                                                    name="shippingZone"
                                                    value={zone.name}
                                                    checked={selectedZone === zone.name}
                                                    onChange={() => setSelectedUserZone(zone.name)}
                                                />
                                                <label htmlFor={`zone-${idx}`}>{zone.name} (TK {zone.cost.toFixed(2)})</label>
                                            </div>
                                        ))
                                    ) : <p>No shipping zones configured.</p>
                                )}
                            </div>
                        </div>
                        <h3 className="price-summary-header">Price Summary</h3>
                        {loading ? <p>Loading...</p> : <>
                            <div className="summary-item">
                                <p className="summary-label">Rental Subtotal</p>
                                <p className="summary-label">TK {subtotal.toFixed(2)}</p>
                            </div>
                            <div className="summary-item">
                                <p className="summary-label">Security Deposit (Refundable)</p>
                                <p className="summary-label">TK {securityDepositTotal.toFixed(2)}</p>
                            </div>
                            <div className="summary-item">
                                <p className="summary-label">Tax ({paymentSettings.taxPercentage}%)</p>
                                <p className="summary-label">TK {tax.toFixed(2)}</p>
                            </div>
                            <div className="summary-item">
                                <p className="summary-label">Shipping</p>
                                <p className="summary-label" style={{ color: isFreeShipping ? 'green' : 'inherit' }}>
                                    {isFreeShipping ? 'FREE' : `TK ${currentShippingCharges.toFixed(2)}`}
                                </p>
                            </div>
                            {isFreeShipping && (
                                <p style={{ fontSize: '12px', color: 'green', margin: '0 0 10px 0' }}>
                                    * Free shipping applied for orders over TK {paymentSettings.freeShippingThreshold}
                                </p>
                            )}
                            <div className="summary-total">
                                <p className="total-label">Total Amount</p>
                                <p className="total-value">TK {total.toFixed(2)}</p>
                            </div>
                        </>}
                        <button className="checkout-btn" onClick={checkoutHandler} disabled={loading}>
                            {loading ? 'Loading...' : 'Proceed To CheckOut'}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default CartPage;
