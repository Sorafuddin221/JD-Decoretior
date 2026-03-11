
export const getPackingSlipHTML = (order, settings) => {
    const { _id, createdAt, shippingInfo, orderItems, user, startDate, endDate, totalDays } = order;

    const modernDate = new Date(createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const rentalPeriod = startDate && endDate 
        ? `${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`
        : 'N/A';

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Packing Slip</title>
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
            .header .order-details {
                text-align: right;
            }
            .header .order-details p {
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
                    ${settings.siteLogoUrl ? `<img src="${settings.siteLogoUrl}" alt="YaMart BD" style="max-height: 50px; margin-bottom: 10px;">` : ''}
                    <p><strong>${settings.siteTitle}</strong></p>
                    <p>Gazipur, Dhaka, Bangladesh</p>
                </div>
                <h1>Packing Slip</h1>
                <div class="order-details">
                    <p><strong>Order ID:</strong> #${_id}</p>
                    <p><strong>Order Date:</strong> ${modernDate}</p>
                </div>
            </div>

            <div class="info-grid">
                <div className="info-section">
                    <h2>Shipping To</h2>
                    <p><strong>Name:</strong> ${user?.name}</p>
                    <p><strong>Address:</strong> ${shippingInfo?.address}, ${shippingInfo?.thana}, ${shippingInfo?.city}, ${shippingInfo?.state} - ${shippingInfo?.pinCode}</p>
                    <p><strong>Phone:</strong> ${shippingInfo?.phoneNo}</p>
                </div>
                <div class="info-section">
                    <h2>Rental Details</h2>
                    <p><strong>Period:</strong> ${rentalPeriod}</p>
                    <p><strong>Total Days:</strong> ${totalDays || 1}</p>
                </div>
            </div>

            <h2>Items</h2>
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Color</th>
                    </tr>
                </thead>
                <tbody>
                    ${orderItems.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.quantity}</td>
                            <td>${item.color || 'N/A'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div class="footer">
                <p>Thank you for choosing ${settings.siteTitle} for your decoration needs!</p>
            </div>
        </div>
    </body>
    </html>
    `;
};
