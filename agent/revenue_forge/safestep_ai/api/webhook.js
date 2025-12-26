// /api/webhook.js
// This file is automatically picked up by Vercel as a Serverless Function.
// It runs in a Node.js environment, identical to AWS Lambda.

// NOTE: You must install 'stripe' package: npm install stripe

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(request, response) {
    if (request.method === 'POST') {
        const sig = request.headers['stripe-signature'];
        let event;

        try {
            // 1. Verify the event came completely from Stripe
            // In Vercel, request.body is already parsed for JSON, but Stripe needs the raw buffer.
            // We might need to disable body parsing for this specific route in vercel.json
            event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
        } catch (err) {
            console.error('Webhook Error:', err.message);
            response.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }

        // 2. Handle the event
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
                console.log('Payment Successful!', session);

                // TODO: Fulfill the order
                // e.g. Email the PDF to session.customer_details.email
                // We can use Resend or SendGrid here.
                break;

            case 'payment_intent.payment_failed':
                const paymentIntent = event.data.object;
                console.log('Payment Failed', paymentIntent.last_payment_error?.message);
                break;

            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        response.status(200).send({ received: true });
    } else {
        response.setHeader('Allow', 'POST');
        response.status(405).end('Method Not Allowed');
    }
}
