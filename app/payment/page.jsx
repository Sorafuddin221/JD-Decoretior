'use client';

import React, { useState } from 'react';
import '@/CartStyles/Payment.css';
import PageTitle from '@/components/PageTitle';
import CheckoutPath from '@/Cart/CheckoutPath';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { createOrder } from '@/features/order/orderSlice';
import { clearCart } from '@/features/cart/cartSlice';

function PaymentPage() {
    const orderData = typeof window !== 'undefined' && sessionStorage.getItem('orderData') ? JSON.parse(sessionStorage.getItem('orderData')) : null;
    const [settings, setSettings] = useState({ bkashNumber: '01XXXXXXXXX', bkashInstructions: '' });

    // Fetch settings
    React.useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch('/api/payment-settings');
                if (response.ok) {
                    const data = await response.json();
                    setSettings({
                        bkashNumber: data.bkashNumber || '01XXXXXXXXX',
                        bkashInstructions: data.bkashInstructions || 'Please Send Money to this number and provide TrxID below.'
                    });
                }
            } catch (error) {
                console.error('Error fetching payment settings:', error);
            }
        };
        fetchSettings();
    }, []);

    // Filter orderData to only send necessary information to the backend for order creation
    const filteredOrderData = orderData ? {
        shippingInfo: orderData.shippingInfo,
        orderItems: orderData.orderItems.map(item => ({
            product: item.product,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            Image: item.Image,
            color: item.color,
        })),
        startDate: orderData.startDate,
        endDate: orderData.endDate,
        totalDays: orderData.totalDays,
        securityDepositTotal: orderData.securityDepositTotal,
        itemPrice: orderData.itemPrice,
        taxPrice: orderData.taxPrice,
        shippingPrice: orderData.shippingPrice,
        totalPrice: orderData.totalPrice,
        paymentInfo: orderData.paymentInfo,
    } : null;

    const { user } = useSelector(state => state.user);
    const router = useRouter();
    const dispatch = useDispatch();
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [bkashNumber, setBkashNumber] = useState('');
    const [trxID, setTrxID] = useState('');
    const [paidAmount, setPaidAmount] = useState('');

    const completePayment = async () => {
        if (!filteredOrderData) {
            toast.error('No order data found. Please confirm your order again.', { position: 'top-center', autoClose: 3000 });
            router.push('/order/confirm'); // Redirect back to confirm page
            return;
        }

        // Validate bKash details if selected
        if (paymentMethod === 'bkash') {
            if (!bkashNumber || bkashNumber.length < 11) {
                toast.error('Please enter a valid bKash number', { position: 'top-center' });
                return;
            }
            if (!trxID || trxID.length < 8) {
                toast.error('Please enter a valid Transaction ID', { position: 'top-center' });
                return;
            }
            if (!paidAmount || Number(paidAmount) <= 0) {
                toast.error('Please enter the amount you paid', { position: 'top-center' });
                return;
            }
        }

        const finalOrderData = {
            ...filteredOrderData,
            paymentInfo: {
                ...filteredOrderData.paymentInfo,
                method: paymentMethod,
                bkashNumber: paymentMethod === 'bkash' ? bkashNumber : undefined,
                trxID: paymentMethod === 'bkash' ? trxID : undefined,
                paidAmount: paymentMethod === 'bkash' ? Number(paidAmount) : 0,
                status: paymentMethod === 'cod' ? 'Processing' : 'Pending Verification'
            }
        };

        try {
            const resultAction = await dispatch(createOrder(finalOrderData));
            if (createOrder.fulfilled.match(resultAction)) {
                toast.success(paymentMethod === 'cod' ? 'Order Confirmed (COD)!' : 'bKash Payment Submitted!', { position: 'top-center', autoClose: 3000 });
                dispatch(clearCart());
                sessionStorage.removeItem('orderData');
                sessionStorage.setItem('orderItem', JSON.stringify(resultAction.payload.order));
                router.push(`/paymentSuccess?method=${paymentMethod}`);
            } else {
                toast.error(resultAction.payload?.message || 'Order creation failed', {
                    position: 'top-center',
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.error("Failed to create order:", error);
            toast.error('Something went wrong during order creation', {
                position: 'top-center',
                autoClose: 3000,
            });
        }
    };

    // If orderData is not available, redirect or show an error
    if (!orderData) {
        return (
            <>
                <PageTitle title="Payment Error" />
                <div className="payment-container">
                    <p>No order data found. Please go back to confirm your order.</p>
                    <Link href="/order/confirm" className='payment-go-back'>Go Back to Order Confirmation</Link>
                </div>
            </>
        );
    }

    return (
        <>
            <PageTitle title="Payment Processing" />
            <CheckoutPath activePath={2} />
            <div className="payment-container">
                <div className="payment-methods">
                    <h3>Select Payment Method</h3>
                    
                    <div 
                        className={`method-option ${paymentMethod === 'cod' ? 'selected' : ''}`}
                        onClick={() => setPaymentMethod('cod')}
                    >
                        <input
                            type="radio"
                            id="cod"
                            name="paymentMethod"
                            value="cod"
                            checked={paymentMethod === 'cod'}
                            readOnly
                        />
                        <label htmlFor="cod">Cash on Delivery (COD)</label>
                    </div>

                    <div 
                        className={`method-option ${paymentMethod === 'bkash' ? 'selected' : ''}`}
                        onClick={() => setPaymentMethod('bkash')}
                    >
                        <input
                            type="radio"
                            id="bkash"
                            name="paymentMethod"
                            value="bkash"
                            checked={paymentMethod === 'bkash'}
                            readOnly
                        />
                        <label htmlFor="bkash">bKash (Send Money)</label>
                    </div>

                    {paymentMethod === 'bkash' && (
                        <div className="bkash-form">
                            <div className="bkash-instructions">
                                <p>Please <strong>Send Money</strong> to this number:</p>
                                <p style={{fontSize: '1.2rem', margin: '5px 0'}}><strong>{settings.bkashNumber}</strong> (Personal)</p>
                                <p>Amount: <strong>৳{filteredOrderData?.totalPrice}</strong></p>
                                <p>{settings.bkashInstructions}</p>
                            </div>
                            <div className="bkash-input-group">
                                <input 
                                    type="text" 
                                    placeholder="Your bKash Number (e.g. 017...)" 
                                    value={bkashNumber}
                                    onChange={(e) => setBkashNumber(e.target.value)}
                                    maxLength={11}
                                />
                                <input 
                                    type="text" 
                                    placeholder="Transaction ID (TrxID)" 
                                    value={trxID}
                                    onChange={(e) => setTrxID(e.target.value)}
                                />
                                <input 
                                    type="number" 
                                    placeholder="Amount Paid (e.g. 500)" 
                                    value={paidAmount}
                                    onChange={(e) => setPaidAmount(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="payment-actions">
                    <Link href={"/order/confirm"} className='payment-go-back'>Go Back</Link>
                    <button className="payment-btn" onClick={completePayment}>
                        Confirm Order
                    </button>
                </div>
            </div>
        </>
    );
}

export default PaymentPage;
