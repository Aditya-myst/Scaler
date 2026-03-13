const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ✅ Price formatter — always 2 decimal places
const fmt = (num) => parseFloat(num).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

async function sendOrderConfirmationEmail(userEmail, userName, order) {
    const itemsHtml = order.OrderItems?.map(item => `
        <tr>
            <td style="padding:10px 8px;border-bottom:1px solid #eee;font-size:14px">
                ${item.Product?.name || 'Product'}
            </td>
            <td style="padding:10px 8px;border-bottom:1px solid #eee;text-align:center;font-size:14px">
                ${item.quantity}
            </td>
            <td style="padding:10px 8px;border-bottom:1px solid #eee;text-align:right;font-size:14px">
                ₹${fmt((item.price || 0) * (item.quantity || 0))}
            </td>
        </tr>
    `).join('') || '<tr><td colspan="3" style="padding:10px;text-align:center;color:#999">No items</td></tr>';

    const subtotal = parseFloat(order.total_price);
    const gst = subtotal * 0.18;
    const total = subtotal * 1.18;

    const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:20px">
        
        <!-- Header -->
        <div style="background:#131921;padding:20px;text-align:center;border-radius:8px 8px 0 0">
            <h1 style="color:white;margin:0;font-size:24px">
                amazon<span style="color:#FF9900">.</span><span style="font-size:14px">in</span>
            </h1>
        </div>

        <!-- Body -->
        <div style="background:white;padding:30px;border-radius:0 0 8px 8px;box-shadow:0 2px 8px rgba(0,0,0,0.1)">
            
            <!-- Success Icon -->
            <div style="text-align:center;margin-bottom:24px">
                <div style="width:64px;height:64px;background:#d4edda;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:30px;margin-bottom:12px">✓</div>
                <h2 style="color:#232F3E;margin:0 0 6px">Order Confirmed!</h2>
                <p style="color:#666;margin:0;font-size:15px">Thank you for shopping with us, <strong>${userName}</strong>!</p>
            </div>

            <!-- Order ID -->
            <div style="background:#f8f9fa;border-radius:8px;padding:16px;margin-bottom:24px;text-align:center">
                <p style="margin:0 0 4px;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:1px">Order ID</p>
                <p style="margin:0;font-size:22px;font-weight:bold;color:#c7511f">#${String(order.id).padStart(8, '0')}</p>
            </div>

            <!-- Items Table -->
            <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
                <thead>
                    <tr style="background:#f8f9fa">
                        <th style="padding:10px 8px;text-align:left;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:0.5px">Item</th>
                        <th style="padding:10px 8px;text-align:center;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:0.5px">Qty</th>
                        <th style="padding:10px 8px;text-align:right;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:0.5px">Price</th>
                    </tr>
                </thead>
                <tbody>${itemsHtml}</tbody>
            </table>

            <!-- Price Breakdown -->
            <div style="border-top:2px solid #eee;padding-top:16px">
                <table style="width:100%;border-collapse:collapse">
                    <tr>
                        <td style="padding:4px 0;color:#666;font-size:13px">Subtotal</td>
                        <td style="padding:4px 0;text-align:right;font-size:13px">₹${fmt(subtotal)}</td>
                    </tr>
                    <tr>
                        <td style="padding:4px 0;color:#666;font-size:13px">GST (18%)</td>
                        <td style="padding:4px 0;text-align:right;font-size:13px">₹${fmt(gst)}</td>
                    </tr>
                    <tr style="border-top:1px solid #eee">
                        <td style="padding:10px 0 4px;font-size:16px;font-weight:bold;color:#232F3E">Total</td>
                        <td style="padding:10px 0 4px;text-align:right;font-size:16px;font-weight:bold;color:#232F3E">₹${fmt(total)}</td>
                    </tr>
                </table>
            </div>

            <!-- Delivery Info -->
            <div style="background:#fff8e1;border:1px solid #ffe082;border-radius:8px;padding:16px;margin-top:20px">
                <p style="margin:0 0 6px;font-size:13px;color:#856404">
                    📦 <strong>Estimated Delivery:</strong> 3-7 business days
                </p>
                <p style="margin:0;font-size:13px;color:#856404">
                    🚚 <strong>Shipping to:</strong> ${order.shipping_address}
                </p>
            </div>

            <!-- Footer -->
            <p style="text-align:center;color:#bbb;font-size:11px;margin-top:28px;border-top:1px solid #f0f0f0;padding-top:16px">
                This is an automated email. Please do not reply.<br/>
                © ${new Date().getFullYear()} Amazon.in Clone
            </p>
        </div>
    </div>`;

    await transporter.sendMail({
        from: `"Amazon.in" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: `✅ Order Confirmed - #${String(order.id).padStart(8, '0')}`,
        html
    });
}

module.exports = { sendOrderConfirmationEmail };