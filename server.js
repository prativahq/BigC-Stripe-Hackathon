
const port = 3000;

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// Endpoint to create a new order for a customer
app.post('/orders/:storeHash', (req, res) => {
  const storeHash = req.params.storeHash;
  const accessToken = 'a47m82m3rut6mpfrhkwx8cdshr2iqg'; // Replace with your own access token
  
  // Find the customer with the provided phone number
  var customeremail = req.body.email;
  //console.log(customeremail);
  //const encodedEmail = encodeURIComponent(customeremail);
  axios.get(`https://api.bigcommerce.com/stores/${storeHash}/v3/customers?email:in=${customeremail}`, {
    headers: {
      'X-Auth-Token': accessToken,
      'Accept': 'application/json'
    }
  })
  .then(customerResponse => {
    const customer = customerResponse.data.data[0]; // Assume the first result is the correct customer
    const customerId = customer.id;
    console.log(customerID);
    // Create a new order for the customer with the provided products
    const orderData = {
      customer_id: customerId,
      products: req.body.products
    };

    axios.post(`https://api.bigcommerce.com/stores/${storeHash}/v3/orders`, orderData, {
      headers: {
        'X-Auth-Token': accessToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(orderResponse => {
      const orderId = orderResponse.data.data.id;
      console.log(`Order ${orderId} has been created`);
      res.status(201).json({ orderId: orderId });
    })
    .catch(error => {
      console.error(`Unable to create order: ${error}`);
      res.sendStatus(500);
    });
  })
  .catch(error => {
    console.error(`Unable to find customer with customer email:${customeremail}: ${error}`);
    res.sendStatus(500);
  });
});


// Endpoint to update order status when order is fulfilled
app.put('/orders/:storeHash/:id/fulfill', (req, res) => {
  const storeHash = req.params.storeHash;
  const orderId = req.params.id;
  const accessToken = 'YOUR_ACCESS_TOKEN'; // Replace with your own access token

  // Update the order with the provided ID and set its status to "Shipped"
  const orderData = {
    status_id: 4 // "fullfilled" status
  };

  axios.put(`https://api.bigcommerce.com/stores/${storeHash}/v2/orders/${orderId}`, orderData, {
    headers: {
      'X-Auth-Token': accessToken,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log(`Order ${orderId} has been updated to order fulfilled status`);
    res.sendStatus(200);
  })
  .catch(error => {
    console.error(`Unable to update order ${orderId} status: ${error}`);
    res.sendStatus(500);
  });
});


// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
