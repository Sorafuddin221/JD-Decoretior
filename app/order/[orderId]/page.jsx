'use client';

import React, { useEffect, use } from 'react';
import '@/OrderStyles/OrderDetails.css';
import PageTitle from '@/components/PageTitle';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails, removeErrors } from '@/features/order/orderSlice';
import Loader from '@/components/Loader';
import { toast } from 'react-toastify';
import MuiRating from '@mui/material/Rating'; // Importing MUI Rating for consistency

function OrderDetailsPage({ params }) {
    const resolvedParams = use(params);
    const { orderId } = resolvedParams;
    const { order, loading, error } = useSelector(state => state.order);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getOrderDetails(orderId));
    }, [dispatch, orderId]);

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors());
        }
    }, [dispatch, error]);

    const {
        shippingInfo = {},
        orderItems = [],
        paymentInfo = {},
        orderStatus,
        totalPrice,
        taxPrice,
        shippingPrice,
        itemPrice,
        paidAt,
        startDate,
        endDate,
        totalDays,
        securityDepositTotal
    } = order || {};

    const paidAmount = paymentInfo?.paidAmount || 0;
    const dueAmount = (totalPrice || 0) - (paidAmount || 0);
    const isFullyPaid = paymentInfo?.status === 'Paid' || paymentInfo?.status === 'succeeded';
    const orderStatusClass = `status-tag ${orderStatus?.toLowerCase().replace(/[\s\/]+/g, '-')}`;
    const paymentStatusClass = `pay-tag ${isFullyPaid ? 'paid' : (paidAmount > 0 ? 'partial' : 'not-paid')}`;

    return (

        <>
            <PageTitle title={orderId} />
            {loading ? (<Loader />) : (<div className="order-box">
                <div className="table-block">
                    <h2 className="table-title">Order Items</h2>
                    <div className="table-responsive">
                        <table className='table-main'>
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Quantity</th>
                                    <th>Price (TK)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderItems.map((item) => (
                                    <tr className='table-row' key={item.product}>
                                        <td className="table-cell">
                                            <img src={item.Image} alt={item.name} className="item-img" />
                                        </td>
                                        <td className="table-cell">{item.name}</td>
                                        <td className="table-cell">{item.quantity}</td>
                                        <td className="table-cell">{item.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="table-block">
                    <h2 className="table-title">Shipping Info</h2>
                    <div className="table-responsive">
                        <table className="table-main">
                            <tbody>
                                <tr className="table-row">
                                    <th className="table-cell">Name :-</th>
                                    <td className="table-cell">{order.user?.name}</td>
                                </tr>
                                <tr className="table-row">
                                    <th className="table-cell">Address :-</th>
                                    <td className="table-cell">{shippingInfo.address}, {shippingInfo.thana}, {shippingInfo.city}, {shippingInfo.state}, {shippingInfo.pinCode}</td>
                                </tr>
                                <tr className="table-row">
                                    <th className="table-cell">Phone :-</th>
                                    <td className="table-cell">{shippingInfo.phoneNo}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="table-block">
                    <h2 className="table-title">Order Summary</h2>
                    <div className="table-responsive">
                        <table className="table-main">
                            <tbody>
                                <tr className="table-row">
                                    <th className="table-cell">Order Status :-</th>
                                    <td className='table-cell'>
                                        <span className={orderStatusClass}>
                                            {orderStatus}
                                        </span>
                                    </td>
                                </tr>
                                <tr className="table-row">
                                    <th className="table-cell">Payment Status :-</th>
                                    <td className='table-cell'>
                                        <span className={paymentStatusClass}>
                                            {paymentInfo?.status}
                                        </span>
                                    </td>
                                </tr>
                                <tr className="table-row">
                                    <th className="table-cell">Rental Period :-</th>
                                    <td className='table-cell'>
                                        {startDate ? `${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}` : "N/A"}
                                    </td>
                                </tr>
                                <tr className="table-row">
                                    <th className="table-cell">Total Days :-</th>
                                    <td className='table-cell'>
                                        {totalDays || "N/A"}
                                    </td>
                                </tr>
                                <tr className="table-row">
                                    <th className="table-cell">Security Deposit :-</th>
                                    <td className='table-cell'>
                                        TK {securityDepositTotal || 0}
                                    </td>
                                </tr>
                                {paidAt && <tr className="table-row">
                                    <th className="table-cell">Paid At :-</th>
                                    <td className='table-cell'>
                                        {new Date(paidAt).toLocaleString()}
                                    </td>
                                </tr>}
                                <tr className="table-row">
                                    <th className="table-cell">Items Price :-</th>
                                    <td className='table-cell'>
                                        TK {itemPrice}
                                    </td>                            </tr>
                                <tr className="table-row">
                                    <th className="table-cell">Tax Price :-</th>
                                    <td className='table-cell'>
                                        TK {taxPrice}
                                    </td>
                                </tr>
                                <tr className="table-row">
                                    <th className="table-cell">Shipping Price :-</th>
                                    <td className='table-cell'>
                                        TK {shippingPrice}
                                    </td>                            
                                </tr>
                                <tr className="table-row">
                                    <th className="table-cell">Total Price :-</th>
                                    <td className='table-cell'>
                                        TK {totalPrice}
                                    </td>                           
                                </tr>
                                <tr className="table-row">
                                    <th className="table-cell">Paid Amount :-</th>
                                    <td className='table-cell' style={{color: '#28a745', fontWeight: 'bold'}}>
                                        TK {paidAmount}
                                    </td>                           
                                </tr>
                                <tr className="table-row">
                                    <th className="table-cell">Due Amount :-</th>
                                    <td className='table-cell' style={{color: '#dc3545', fontWeight: 'bold'}}>
                                        TK {dueAmount.toFixed(2)}
                                    </td>                           
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>)}
        </>
    );
}

export default OrderDetailsPage;
