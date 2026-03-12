
export const getInvoiceHTML = (order, settings) => {
    const { _id, createdAt, shippingInfo, orderItems, user, itemPrice, taxPrice, shippingPrice, totalPrice, paymentInfo, startDate, endDate, totalDays, securityDepositTotal } = order;

    const modernDate = new Date(createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const rentalPeriod = startDate && endDate 
        ? `${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`
        : 'N/A';

    const paidAmount = paymentInfo?.paidAmount || 0;
    const dueAmount = (totalPrice || 0) - (paidAmount || 0);
    const paymentStatus = (paymentInfo?.status === 'Paid' || paymentInfo?.status === 'succeeded') ? 'Paid' : (paidAmount > 0 ? 'Partial' : 'Unpaid');

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                margin: 0;
                padding: 20px;
                color: #333;
                background-color: #f9f9f9;
            }
            .container {
                max-width: 800px;
                margin: auto;
                background: #fff;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            }
            .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 2px solid #eee;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .header h1 {
                font-size: 2.0em;
                margin: 0;
                color: #2c3e50;
            }
            .header .invoice-details {
                text-align: right;
            }
            .header .invoice-details p {
                margin: 5px 0;
                font-size: 0.9em;
                color: #7f8c8d;
            }
            .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-bottom: 30px;
            }
            .info-section h2 {
                font-size: 1.2em;
                margin-bottom: 10px;
                color: #34495e;
                border-bottom: 1px solid #ecf0f1;
                padding-bottom: 5px;
            }
            .info-section p {
                margin: 4px 0;
                line-height: 1.6;
            }
            .items-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
            }
            .items-table th, .items-table td {
                border: 1px solid #ddd;
                padding: 12px;
                text-align: left;
            }
            .items-table th {
                background-color: #f2f2f2;
                font-weight: 600;
                color: #34495e;
            }
            .items-table tr:nth-child(even) {
                background-color: #f9f9f9;
            }
            .totals {
                margin-top: 30px;
                text-align: right;
            }
            .totals p {
                margin: 8px 0;
                font-size: 1.1em;
            }
            .totals .grand-total {
                font-size: 1.4em;
                font-weight: bold;
                color: #2c3e50;
            }
            .footer {
                text-align: center;
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                font-size: 0.9em;
                color: #95a5a6;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="company-details">
                    ${settings.siteLogoUrl ? `<img src="${settings.siteLogoUrl}" alt="JIBON DECORETOR" style="max-height: 50px; margin-bottom: 10px;">` : ''}
                    <p><strong>${settings.siteTitle}</strong></p>
                    <p>Gazipur, Dhaka, Bangladesh</p>
                </div>
                <h1>Invoice</h1>
                <div class="invoice-details">
                    <p><strong>Invoice ID:</strong> #${_id}</p>
                    <p><strong>Date:</strong> ${modernDate}</p>
                    <p><strong>Status:</strong> <span style="color: ${paymentStatus === 'Paid' ? '#27ae60' : (paymentStatus === 'Partial' ? '#f39c12' : '#e74c3c')}; font-weight: bold;">${paymentStatus}</span></p>
                </div>
            </div>

            <div class="info-grid">
                <div className="info-section">
                    <h2>Bill To</h2>
                    <p><strong>Name:</strong> ${user?.name}</p>
                    <p><strong>Address:</strong> ${shippingInfo?.address}, ${shippingInfo?.thana}, ${shippingInfo?.city}, ${shippingInfo?.state} - ${shippingInfo?.pinCode}</p>
                    <p><strong>Phone:</strong> ${shippingInfo?.phoneNo}</p>
                </div>
                <div class="info-section">
                    <h2>Rental Details</h2>
                    <p><strong>Period:</strong> ${rentalPeriod}</p>
                    <p><strong>Total Days:</strong> ${totalDays || 1}</p>
                    <p><strong>Deposit:</strong> TK ${securityDepositTotal ? securityDepositTotal.toFixed(2) : '0.00'}</p>
                </div>
            </div>

            <h2>Items</h2>
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Color</th>
                        <th>Price/Day</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${orderItems.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.quantity}</td>
                            <td>${item.color || 'N/A'}</td>
                            <td>TK ${item.price.toFixed(2)}</td>
                            <td>TK ${(item.quantity * item.price * (totalDays || 1)).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div class="totals">
                <p><strong>Rental Subtotal:</strong> TK ${itemPrice.toFixed(2)}</p>
                <p><strong>Security Deposit:</strong> TK ${securityDepositTotal ? securityDepositTotal.toFixed(2) : '0.00'}</p>
                <p><strong>Tax:</strong> TK ${taxPrice.toFixed(2)}</p>
                <p><strong>Shipping:</strong> TK ${shippingPrice.toFixed(2)}</p>
                <div style="border-top: 2px solid #eee; margin-top: 10px; padding-top: 10px;">
                    <p class="grand-total"><strong>Total Amount:</strong> TK ${Math.round(totalPrice)}</p>
                    <p style="color: #27ae60; font-size: 1.1em;"><strong>Paid Amount:</strong> TK ${paidAmount.toFixed(2)}</p>
                    <p style="color: #e74c3c; font-size: 1.1em;"><strong>Due Amount:</strong> TK ${Math.round(dueAmount)}</p>
                </div>
            </div>
            <div class="footer">
                <p>Thank you for choosing ${settings.siteTitle} for your decoration needs!</p>
            </div>
        </div>
    </body>
    </html>
    `;
};
