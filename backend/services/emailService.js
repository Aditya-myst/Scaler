const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendOrderConfirmationEmail(userEmail, userName, order) {
    const itemsHtml = order.OrderItems?.map(item => `
        <tr>
            <td style="padding:8px;border-bottom:1px solid #eee">${item.Product?.name || 'Product'}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">₹${parseFloat((item.price || 0) * (item.quantity || 0)).toLocaleString('en-IN')}</td>
        </tr>
    `).join('') || '';

    const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:20px">
        <div style="background:#131921;padding:20px;text-align:center;border-radius:8px 8px 0 0">
            <h1 style="color:white;margin:0;font-size:24px">amazon<span style="color:#FF9900">.</span><span style="font-size:14px">in</span></h1>
        </div>
        <div style="background:white;padding:30px;border-radius:0 0 8px 8px;box-shadow:0 2px 8px rgba(0,0,0,0.1)">
            <div style="text-align:center;margin-bottom:24px">
                <div style="width:60px;height:60px;background:#d4edda;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:28px">✓</div>
                <h2 style="color:#232F3E;margin:12px 0 4px">Order Confirmed!</h2>
                <p style="color:#666;margin:0">Thank you for shopping with us, ${userName}!</p>
            </div>

            <div style="background:#f8f9fa;border-radius:8px;padding:16px;margin-bottom:20px">
                <p style="margin:0 0 4px;color:#666;font-size:13px">Order ID</p>
                <p style="margin:0;font-size:20px;font-weight:bold;color:#c7511f">#${String(order.id).padStart(8, '0')}</p>
            </div>

            <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
                <thead>
                    <tr style="background:#f8f9fa">
                        <th style="padding:10px 8px;text-align:left;font-size:13px;color:#666">Item</th>
                        <th style="padding:10px 8px;text-align:center;font-size:13px;color:#666">Qty</th>
                        <th style="padding:10px 8px;text-align:right;font-size:13px;color:#666">Price</th>
                    </tr>
                </thead>
                <tbody>${itemsHtml}</tbody>
            </table>

            <div style="border-top:2px solid #eee;padding-top:16px;text-align:right">
                <p style="margin:4px 0;color:#666;font-size:13px">Subtotal: <strong>₹${parseFloat(order.total_price).toLocaleString('en-IN')}</strong></p>
                <p style="margin:4px 0;color:#666;font-size:13px">GST (18%): <strong>₹${(parseFloat(order.total_price) * 0.18).toLocaleString('en-IN')}</strong></p>
                <p style="margin:8px 0 0;font-size:18px;font-weight:bold;color:#232F3E">Total: ₹${(parseFloat(order.total_price) * 1.18).toLocaleString('en-IN')}</p>
            </div>

            <div style="background:#fff8e1;border:1px solid #ffe082;border-radius:8px;padding:16px;margin-top:20px">
                <p style="margin:0;font-size:13px;color:#856404">📦 Estimated Delivery: <strong>3-7 business days</strong></p>
                <p style="margin:4px 0 0;font-size:13px;color:#856404">🚚 Shipping to: ${order.shipping_address}</p>
            </div>

            <p style="text-align:center;color:#999;font-size:12px;margin-top:24px">
                This is an automated email. Please do not reply.<br/>
                © 2025 Amazon.in Clone
            </p>
        </div>
    </div>`;

    await transporter.sendMail({
        from: `"Amazon.in" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: `Order Confirmed - #${String(order.id).padStart(8, '0')}`,
        html
    });
}

module.exports = { sendOrderConfirmationEmail };