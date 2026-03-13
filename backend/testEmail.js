require('dotenv').config();

require('dotenv').config();
console.log("Email User:", process.env.EMAIL_USER);
console.log("Email Pass:", process.env.EMAIL_PASS ? "Loaded (hidden)" : "Not Loaded");
const { sendOrderConfirmationEmail } = require('./services/emailService'); // path to your file


const mockOrder = {
    id: 1001,
    total_price: 1500,
    shipping_address: "Flat 402, Green Apartments, Bangalore, 560001",
    OrderItems: [
        {
            quantity: 1,
            price: 1500,
            Product: { name: "Echo Dot (5th Gen)" }
        }
    ]
};

async function runTest() {
    try {
        console.log("Attempting to send test email...");
        await sendOrderConfirmationEmail('your-personal-email@gmail.com', 'Test User', mockOrder);
        console.log("✅ Success! Check your inbox.");
    } catch (error) {
        console.error("❌ Failed to send:", error);
    }
}

runTest();