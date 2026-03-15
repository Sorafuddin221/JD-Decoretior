'use client';

import React, { useEffect } from 'react';
import '@/CartStyles/PaymentSuccess.css';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import PageTitle from '@/components/PageTitle';
import Loader from '@/components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { removeErrors, removeSuccess } from '@/features/order/orderSlice';
import { clearCart } from '@/features/cart/cartSlice';

function PaymentSuccessClientComponent() {
    const searchParams = useSearchParams();
    const method = searchParams.get('method'); // Expecting 'cod'

    const { loading, error, success } = useSelector(state => state.order);
    const dispatch = useDispatch();

    useEffect(() => {
        if (['cod', 'bkash', 'rocket', 'nagad'].includes(method)) {
            if (method === 'cod') {
                toast.success('Your order has been confirmed successfully (Cash on Delivery).', { position: 'top-center', autoClose: 3000 });
            } else {
                toast.success(`Your order has been submitted successfully. ${method.charAt(0).toUpperCase() + method.slice(1)} payment is currently pending verification.`, { position: 'top-center', autoClose: 3000 });
            }
            dispatch(clearCart());
            sessionStorage.removeItem('orderData');
            sessionStorage.removeItem('orderItem');
        } else {
            toast.error('The payment method was not recognized, or an unexpected error occurred. Please contact support.', { position: 'top-center', autoClose: 3000 });
            sessionStorage.removeItem('orderData');
            sessionStorage.removeItem('orderItem');
        }

        return () => {
            dispatch(removeSuccess());
            dispatch(removeErrors());
        };
    }, [dispatch, method]);


    return (
        <>
            {loading ? (<Loader />) : (
                <>
                    <PageTitle title="Payment Status" />
                    <div className="payment-success-container">
                        <div className="success-content">
                            <div className="success-icon">
                                <div className="checkmart"></div>
                            </div>
                            <h1>Order Confirmed!</h1>
                            <p>Your order has been placed successfully and will be processed soon.</p>
                            <Link className='explore-btn' href='/orders/user'>View All Orders</Link>
                        </div>
                    </div>
                </>)}
        </>
    );
}

export default PaymentSuccessClientComponent;
