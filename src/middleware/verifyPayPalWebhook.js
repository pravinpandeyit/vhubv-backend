const axios = require('axios');
const ApiError = require('../utils/ApiError'); // Adjust the path as needed
const PAYPAL_BASE_URL = "https://api-m.sandbox.paypal.com";
let cachedAccessToken = null;
let tokenExpiryTime = null;

async function getPayPalAccessToken() {
    try {
        if (cachedAccessToken && tokenExpiryTime && tokenExpiryTime > Date.now()) {
            return cachedAccessToken; // Return cached token if valid
        }

        const response = await axios.post(
            `${PAYPAL_BASE_URL}/v1/oauth2/token`,
            "grant_type=client_credentials",
            {
                auth: {
                    username: process.env.PAYPAL_CLIENT_ID,
                    password: process.env.PAYPAL_SECRET,
                },
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        // Update cache
        cachedAccessToken = response.data.access_token;
        tokenExpiryTime = Date.now() + response.data.expires_in * 1000; // expires_in is in seconds

        console.log("PayPal access token fetched successfully.");
        return cachedAccessToken;
    } catch (err) {
        console.error(
            "Error fetching PayPal access token:",
            err.response?.status,
            err.response?.data || err.message
        );
        throw new Error("Failed to fetch PayPal access token.");
    }
}

async function checkTokenPermissions() {
    try {
        const accessToken = await getPayPalAccessToken();
        console.log(accessToken);
        
        const response = await axios.get(`${PAYPAL_BASE_URL}/v1/oauth2/token/userinfo`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        console.log("Token Info:", response.data);

    } catch (err) {
        console.error('Error fetching token info:', err.response?.data || err.message);
    }
}


// Verify PayPal Webhook
const verifyPayPalWebhook = async (req, res, next) => {
    try {
        // Log the incoming headers and body for debugging purposes
        console.log("Received Webhook Headers:", req.headers);
        console.log("Received Webhook Body:", req.body);

        // Fetch the access token dynamically if needed
        const accessToken = await getPayPalAccessToken();

        // Ensure all necessary headers are available
        const headers = req.headers;
        if (!headers['paypal-auth-algo'] || 
            !headers['paypal-cert-url'] || 
            !headers['paypal-transmission-id'] || 
            !headers['paypal-transmission-sig'] || 
            !headers['paypal-transmission-time']) {
            return res.status(400).json({ error: 'Missing required PayPal headers.' });
        }

        const verifyResponse = await axios.post(
            `${PAYPAL_BASE_URL}/v1/notifications/verify-webhook-signature`,
            {
                auth_algo: headers['paypal-auth-algo'],
                cert_url: headers['paypal-cert-url'],
                transmission_id: headers['paypal-transmission-id'],
                transmission_sig: headers['paypal-transmission-sig'],
                transmission_time: headers['paypal-transmission-time'],
                webhook_id: process.env.PAYPAL_WEBHOOK_ID,
                webhook_event: req.body, // Ensure the body is passed correctly
            },
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            }
        );

        // Log the response from PayPal for debugging
        console.log("PayPal Webhook Verification Response:", verifyResponse.data);

        if (verifyResponse.data.verification_status !== 'SUCCESS') {
            console.error('Webhook verification failed:', verifyResponse.data);
            return res.status(400).json({ error: 'Webhook signature verification failed.' });
        }

        console.log('Webhook verification successful:', verifyResponse.data);
        next();
    } catch (err) {
        console.error('Webhook verification error:', err.response?.data || err.message);
        return res.status(500).json({ error: 'Internal Server Error during webhook verification.' });
    }
};


module.exports = {
    verifyPayPalWebhook,
};


module.exports = {
    verifyPayPalWebhook:verifyPayPalWebhook
};
