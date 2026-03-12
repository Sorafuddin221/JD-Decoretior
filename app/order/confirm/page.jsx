'use client';

import React, { useState, useEffect } from 'react'; // Added useState, useEffect for localStorage
import '@/CartStyles/OrderConfirm.css';
import PageTitle from '@/components/PageTitle';
import { useDispatch, useSelector } from 'react-redux';
import CheckoutPath from '@/Cart/CheckoutPath';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { createOrder } from '@/features/order/orderSlice';
import { clearCart } from '@/features/cart/cartSlice';


function OrderConfirmPage() {
    const { shippingInfo, cartItems } = useSelector(state => state.cart);
    const { user } = useSelector(state => state.user);

    // Load payment settings from API
    const [paymentSettings, setPaymentSettings] = useState({
        taxPercentage: 0,
        shippingZones: [],
        freeShippingThreshold: 10000,
        securityDepositPercentage: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPaymentSettings = async () => {
            try {
                const res = await fetch('/api/payment-settings');
                const data = await res.json();
                setPaymentSettings({
                    taxPercentage: data.taxPercentage || 0,
                    shippingZones: data.shippingZones || [],
                    freeShippingThreshold: data.freeShippingThreshold || 10000,
                    securityDepositPercentage: data.securityDepositPercentage || 0,
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
        const days = calculateDays(item.startDate, item.endDate);
        const itemRentalTotal = item.price * item.quantity * days;
        // Use individual item deposit if set (>0), otherwise use global percentage
        const deposit = item.securityDeposit > 0 
            ? (item.securityDeposit * item.quantity) 
            : (itemRentalTotal * (paymentSettings.securityDepositPercentage / 100));
        return acc + deposit;
    }, 0);
    
    // Dynamic Tax Calculation
    const tax = subtotal * (paymentSettings.taxPercentage / 100); 

    // Dynamic Shipping Charges Calculation
    const isFreeShipping = subtotal >= (paymentSettings.freeShippingThreshold || 10000);
    const selectedZone = paymentSettings.shippingZones ? paymentSettings.shippingZones.find(z => z.name === shippingInfo.shippingMethod) : null;
    const shippingCharges = isFreeShipping ? 0 : (selectedZone ? selectedZone.cost : 0);

    const total = Math.round(subtotal + securityDepositTotal + tax + shippingCharges);

    const router = useRouter();
    const dispatch = useDispatch();

    const proceedToPayment = async () => {
        // Assume all items share the same rental period for the global order dates
        const firstItem = cartItems[0] || {};
        const orderData = {
            shippingInfo: {
                ...shippingInfo,
                Country: shippingInfo.country,
                phoneNo: shippingInfo.phoneNumber,
                shippingMethod: shippingInfo.shippingMethod,
                thana: shippingInfo.thana,
            },
            orderItems: cartItems.map(item => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                Image: item.image,
                product: item.product,
                color: item.color,
            })),
            startDate: firstItem.startDate,
            endDate: firstItem.endDate,
            totalDays: calculateDays(firstItem.startDate, firstItem.endDate),
            securityDepositTotal: securityDepositTotal,
            itemPrice: subtotal,
            taxPrice: tax,
            shippingPrice: shippingCharges,
            totalPrice: Math.round(total),
        };

        sessionStorage.setItem('orderData', JSON.stringify(orderData));
        router.push('/payment');
    };

    return (
        <>
            <PageTitle title="Order Confirm" />
            <CheckoutPath activePath={1} />
            <div className="confirm-container">
                <h2 className="confirm-header">Order Confirm</h2>
                <div className="confirm-table-container">
                    <table className="confirm-table">
                        <caption>Shipping Details</caption>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>{user?.name}</td><td>{shippingInfo.phoneNumber}</td><td>{shippingInfo.address}, {shippingInfo.thana}, {shippingInfo.city}, {shippingInfo.state} {shippingInfo.country}, {shippingInfo.pinCode}</td></tr>
                        </tbody>
                    </table>
                    <table className="confirm-table cart-table">
                        <caption>Cart Item</caption>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Product Name</th>
                                <th>Price/Day</th>
                                <th>Dates</th>
                                <th>Days</th>
                                <th>Deposit</th>
                                <th>Quantity</th>
                                <th>Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => {
                                const days = calculateDays(item.startDate, item.endDate);
                                const itemRentalTotal = item.price * item.quantity * days;
                                const deposit = item.securityDeposit > 0 
                                    ? (item.securityDeposit * item.quantity) 
                                    : (itemRentalTotal * (paymentSettings.securityDepositPercentage / 100));
                                
                                return (
                                    <tr key={item.product}>
                                        <td><img src={item.image} alt={item.name} className='item-image' /></td>
                                        <td>{item.name}</td>
                                        <td>{item.price}</td>
                                        <td>{item.startDate} to {item.endDate}</td>
                                        <td>{days}</td>
                                        <td>{deposit.toFixed(2)}</td>
                                        <td>{item.quantity}</td>
                                        <td>TK {(itemRentalTotal + deposit).toFixed(2)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>

                    </table>
                    <table className="confirm-table">
                        <caption>Order Summary</caption>
                        <thead>
                            <tr>
                                <th>Rental Subtotal</th>
                                <th>Security Deposit</th>
                                <th>Shipping Charge</th>
                                <th>Tax</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5">Loading...</td>
                                </tr>
                            ) : (
                                <tr>
                                    <td>TK {subtotal.toFixed(2)}</td>
                                    <td>TK {securityDepositTotal.toFixed(2)}</td>
                                    <td>{isFreeShipping ? <span style={{color: 'green', fontWeight: 'bold'}}>FREE</span> : `TK ${shippingCharges.toFixed(2)}`}</td>
                                    <td>TK {tax.toFixed(2)}</td>
                                    <td>TK {total}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <button className="proceed-button" onClick={proceedToPayment} disabled={loading}>
                    {loading ? 'Loading...' : 'Proceed to Payment'}
                </button>
            </div>
        </>
    );
}

export default OrderConfirmPage;