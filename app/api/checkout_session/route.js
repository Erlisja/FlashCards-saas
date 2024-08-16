// import Stripe from 'stripe';
// import { NextResponse } from 'next/server';

// const stripe = new Stripe (process.env.STRIPE_SECRET_KEY) 

// const formatAmountForStripe =( amount) => {  
//     return Math.round(amount * 100);  
// }

// export async function GET(req) {
//     const searchParams = req.nextUrl.searchParams;
//     const sessionId = searchParams.get('session_id');

//     try {
//         const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
//         return NextResponse.json(checkoutSession)
         
//         }
//      catch (error) {
//       console.error("Error retrieving checkout session.",error);
//       return NextResponse.json({error: {message:error.message}},{status:500}), {
//       }
//     }
        
// }





// export async function POST(req) {
    
//     const params = {
//         mode: 'subscription',
//         payment_method_types: ['card'],
//         line_items: [
//           {
//             price_data: 
//             {
//                 currency: 'usd',
//                 product_data: {
//                     name: 'Premium Subscription',
//                 },
//               unit_amount: formatAmountForStripe(10),
//               recurring: {
//                 interval: 'month',
//                 interval_count: 1,
//               },
                
//             },
//             quantity: 1,
//           },
//         ],
//         success_url: `${req.headers.get('origin')}/result?session_id={CHECKOUT_SESSION_ID}`,
//         cancel_url: `${req.headers.get('origin')}/result?session_id={CHECKOUT_SESSION_ID}`,
//       };
//       const checkoutSession =await stripe.checkout.sessions.create(params);

//         return NextResponse.json(checkoutSession, {
//         status : 200
//         })


import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const formatAmountForStripe = (amount) => {  
    return Math.round(amount * 100);  
}

// POST: Create a new Checkout Session
export async function POST(req) {
    try {
        const { plan } = await req.json();

        if (!plan) {
            return NextResponse.json({ message: 'Plan is required' }, { status: 400 });
        }

        let unit_amount;
        if (plan === 'basic') {
            unit_amount = 500;  // $5
        } else if (plan === 'pro') {
            unit_amount = 1000; // $10
        } else {
            return NextResponse.json({ message: 'Invalid Plan Selected' }, { status: 400 });
        }

        const params = {
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Subscription`,
                        },
                        unit_amount,
                        recurring: {
                            interval: 'month',
                            interval_count: 1,
                        },
                    },
                    quantity: 1,
                },
            ],
            success_url: `${req.headers.get('origin')}/result?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get('origin')}/result?session_id={CHECKOUT_SESSION_ID}`,
        };

        const checkoutSession = await stripe.checkout.sessions.create(params);

        return NextResponse.json(checkoutSession, { status: 200 });
    } catch (error) {
        console.error("Error in checkout session:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// GET: Retrieve an existing Checkout Session
export async function GET(req) {
    const searchParams = req.nextUrl.searchParams;
    const sessionId = searchParams.get('session_id');

    try {
        const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
        return NextResponse.json(checkoutSession);
    } catch (error) {
        console.error("Error retrieving checkout session.", error);
        return NextResponse.json({ error: { message: error.message } }, { status: 500 });
    }
}
