'use client';
import React, { useEffect, useState } from 'react';
import '@/AdminStyles/UpdateOrder.css';
import PageTitle from '@/components/PageTitle'
import { useParams } from 'next/navigation'; 
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails as getUserOrderDetails } from '@/features/order/orderSlice';
import Loader from '@/components/Loader';
import { toast } from 'react-toastify'; 
import { getAdminOrderDetails, removeErrors, removeSuccess, updateOrderStatus, updatePaymentStatus } from '@/features/admin/adminSlice.js';

 function UpdateOrderPage() {
    const [status, setStatus] = useState("");
    const { orderId } = useParams();
    const { loading: orderLoading, error: orderError } = useSelector(state => state.order);
    const { order: adminOrder, success, loading: adminLoading, error: adminError } = useSelector(state => state.admin);
    const loading = orderLoading || adminLoading;

    const dispatch = useDispatch();
    useEffect(() => {
        if (orderId) {
            dispatch(getAdminOrderDetails(orderId));
        }

    }, [dispatch, orderId]);

    const {
        shippingInfo = {},
        orderItems = [],
        paymentInfo = {},
        orderStatus,
        totalPrice,
        taxPrice,
        shippingPrice,
        itemPrice,
        startDate,
        endDate,
        totalDays,
        securityDepositTotal
    } = adminOrder;

    const paidAmount = paymentInfo?.paidAmount || 0;
    const dueAmount = (totalPrice || 0) - (paidAmount || 0);
    const paymentStatus = paymentInfo.status === 'succeeded' || paymentInfo.status === 'Paid' ? 'Paid' : (paymentInfo.status || 'Not Paid');
    const finalOrderStatus = orderStatus;

    const handleStatusUpdate = async () => {
        if (!status) {
            toast.error('Please select a status', { position: 'top-center', autoClose: 3000 });
            return;
        }
        await dispatch(updateOrderStatus({ orderId, status }));
    };

    const handleMarkAsPaid = async () => {
        if (window.confirm("Are you sure you want to mark this order as Paid? Verify bKash TrxID first.")) {
            // For COD, mark full total as paid. For others, keep current paidAmount or update.
            const amountToMark = paymentInfo.method === 'cod' ? totalPrice : paidAmount;
            await dispatch(updatePaymentStatus({ orderId, status: 'Paid', paidAmount: amountToMark }));
        }
    };

    const handleGeneratePackingSlip = async () => {
        try {
            const response = await fetch(`/api/admin/order/${orderId}/packing-slip`);
            const contentType = response.headers.get("content-type");

            if (!response.ok) {
                let errorMessage = `Failed to generate Packing Slip: ${response.status} ${response.statusText}`;
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                    console.error('Server error generating Packing Slip:', errorData.stack || errorData);
                } else {
                    const errorText = await response.text();
                    console.error('Server error generating Packing Slip:', errorText);
                }
                toast.error(errorMessage, { position: 'top-center', autoClose: 3000 });
                return;
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `packing-slip-${orderId}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            toast.success("Packing Slip Generated", { position: 'top-center', autoClose: 3000 });
        } catch (error) {
            console.error('Error generating packing slip:', error);
            toast.error(error.message || 'Failed to generate packing slip', { position: 'top-center', autoClose: 3000 });
        }
    };

    const handleGenerateInvoice = async () => {
        try {
            const response = await fetch(`/api/admin/order/${orderId}/invoice`);
            const contentType = response.headers.get("content-type");

            if (!response.ok) {
                let errorMessage = `Failed to generate Invoice: ${response.status} ${response.statusText}`;
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                    console.error('Server error generating Invoice:', errorData.stack || errorData);
                } else {
                    const errorText = await response.text();
                    console.error('Server error generating Invoice:', errorText);
                }
                toast.error(errorMessage, { position: 'top-center', autoClose: 3000 });
                return;
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoice-${orderId}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            toast.success("Invoice Generated", { position: 'top-center', autoClose: 3000 });
        } catch (error) {
            console.error('Error generating invoice:', error);
            toast.error(error.message || 'Failed to generate invoice', { position: 'top-center', autoClose: 3000 });
        }
    };

    useEffect(() => {
        if (orderError) {
            toast.error(orderError, { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors()); // Assuming removeErrors from orderSlice
        }
    }, [dispatch, orderError]);
    
    useEffect(() => {
        if (adminError) {
            toast.error(adminError.message,
                { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors());
        }
        if (success) {
            toast.success("Order Status Updated Successfully",
                { position: 'top-center', autoClose: 3000 });
            dispatch(removeSuccess());
            dispatch(getUserOrderDetails(orderId));
        }
    }, [dispatch, adminError, success, orderId]);

    return (
        <>
            <PageTitle title="Update Order" />
            {loading ? (<Loader />) : (<div className="order-container">
                <h1 className="order-title">Update Order</h1>
                <div className="order-details">
                    <h2>order Information</h2>
                    <p><strong>Customer Name :</strong>{adminOrder.user?.name}</p>
                    <p><strong>Order ID :</strong>{orderId}</p>
                    <p><strong>Shipping Address :</strong>{shippingInfo.address}, {shippingInfo.thana}, {shippingInfo.city}, {shippingInfo.state }
                        {shippingInfo.Country}, {shippingInfo.pinCode}</p>
                    <p><strong>Phone :</strong>{shippingInfo.phoneNo}</p>
                    <p><strong>Rental Period :</strong> {startDate ? `${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}` : "N/A"}</p>
                    <p><strong>Total Days :</strong> {totalDays || "N/A"}</p>
                    <p><strong>Items Price :</strong> TK {itemPrice || 0}</p>
                    <p><strong>Shipping Price :</strong> TK {shippingPrice || 0}</p>
                    <p><strong>Tax Price :</strong> TK {taxPrice || 0}</p>
                    <p><strong>Security Deposit :</strong> TK {securityDepositTotal || 0} (Refundable)</p>
                    <p><strong>Order Status :</strong>{finalOrderStatus}</p>
                    <div style={{border: '1px solid #eee', padding: '15px', borderRadius: '8px', margin: '15px 0', backgroundColor: '#fdfdfd', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'}}>
                        <h3 style={{fontSize: '1rem', marginBottom: '10px', color: '#555', borderBottom: '1px solid #eee', paddingBottom: '5px'}}>Payment Verification</h3>
                        <p><strong>Method :</strong> {paymentInfo.method?.toUpperCase() || 'N/A'}</p>
                        <p><strong>Status :</strong> <span style={{color: paymentStatus === 'Paid' ? '#28a745' : '#fd7e14', fontWeight: 'bold'}}>{paymentStatus}</span></p>
                        {paymentInfo.method === 'bkash' && (
                            <>
                                <p><strong>Customer bKash No :</strong> {paymentInfo.bkashNumber || 'N/A'}</p>
                                <p><strong>Transaction ID :</strong> <span style={{color: '#d12053', fontWeight: 'bold', letterSpacing: '1px'}}>{paymentInfo.trxID || 'N/A'}</span></p>
                            </>
                        )}
                        <p><strong>Amount Paid :</strong> <span style={{color: '#28a745', fontWeight: 'bold'}}>TK {paidAmount}</span></p>
                        <p><strong>Due Amount :</strong> <span style={{color: '#dc3545', fontWeight: 'bold'}}>TK {Math.round(dueAmount)}</span></p>

                        {paymentStatus !== 'Paid' && (
                            <button 
                                onClick={handleMarkAsPaid} 
                                className="update-button" 
                                style={{marginTop: '15px', backgroundColor: '#28a745', width: 'auto', padding: '8px 20px'}}
                                disabled={loading}
                            >
                                Verify & Mark as Paid
                            </button>
                        )}
                        </div>
                        <p><strong>total Price :</strong>{Math.round(totalPrice)}</p>
                    <div className="pdf-actions">
                        <button onClick={handleGeneratePackingSlip} className="update-button">Generate Packing Slip</button>
                        <button onClick={handleGenerateInvoice} className="update-button">Generate Invoice</button>
                    </div>
                </div>
                <div className="order-items">
                    <h2>Order Items</h2>
                    <div className="table-responsive">
                    <table className="order-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Quantity</th>
                                <th>Price/Day</th>
                                <th>Color</th>
                                <th>Total (Item)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderItems.map((item) => (
                                <tr key={item._id}>
                                    <td>
                                        <img src={item.Image} alt={item.name} className='order-item-image' />
                                    </td>
                                    <td>{item.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.price}/-</td>
                                    <td>{item.color || 'N/A'}</td>
                                    <td>TK {(item.price * item.quantity * (totalDays || 1)).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                </div>
                <div className="order-status">
                    <h2>Update Status</h2>
                    <select disabled={loading || orderStatus === 'Delivered'} name="" id="" className="status-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="">Select Status</option>
                        <option value="Shipped">Shipped</option>
                        <option value="On The Way">On The Way</option>
                        <option value="Delivered">Delivered</option>
                    </select>
                    <button disabled={loading || !status || orderStatus === 'Delivered'} onClick={handleStatusUpdate} className="update-button">Update Status</button>
                </div>
            </div>)}
        </>
    );
}

export default UpdateOrderPage;

