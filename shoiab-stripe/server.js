import dotenv from 'dotenv'
dotenv.config();
import express from 'express'
import cors from 'cors'
const app = express();
//const { resolve } = require("path");
// This is your test secret API key.
import Stripe from 'stripe'
const stripe = new Stripe(process.env.TEST_SECRET);

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const createLocation = async () => {
  const location = await stripe.terminal.locations.create({
    display_name: 'HQ',
    address: {
      line1: '1272 Valencia Street',
      city: 'San Francisco',
      state: 'CA',
      country: 'US',
      postal_code: '94110',
    }
  });

  return location;
};

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.ENDPOINT_KEY;

app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      response.json(paymentIntentSucceeded);
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
      response.send();
  }

  // Return a 200 response to acknowledge receipt of the event
  
});

//------------------------connecting bigcommerce webhook endpoint to get order details------------
app.post('v1/webhook_endpoints/', async (req,res)=>{
  const ID = req.body.webhook_endpoints_ID ;
  const webhookEndpoint = await stripe.webhookEndpoints.retrieve(
      ID
    );
    res.json({amount: webhookEndpoint.amount});
})

// The ConnectionToken's secret lets you connect to any Stripe Terminal reader
// and take payments with your Stripe account.
// Be sure to authenticate the endpoint for creating connection tokens.
app.post("/connection_token", async(req, res) => {
  let connectionToken = await stripe.terminal.connectionTokens.create();
  res.json({secret: connectionToken.secret});
})

app.post("/create_payment_intent", async(req, res) => {
  // For Terminal payments, the 'payment_method_types' parameter must include 'card_present'.
  // To automatically capture funds when a charge is authorized, set `capture_method` to `automatic`.
  const intent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: 'usd',
    payment_method_types: [
      'card_present',
    ],
    capture_method: 'manual',
  });
  //console.log(intent);
  res.json(intent);
});



app.post("/capture_payment_intent", async(req, res) => {
  const intent = await stripe.paymentIntents.capture(req.body.payment_intent_id);
  console.log(intent)
  res.send(intent);
});

app.listen(4242, () => console.log('Node server listening on port 4242!'));