# BigC-Stripe-Hackathon

When calling the /createOrder endpoint with a query parameter, you would need to use a POST request to 
http://localhost:3000/orders/:storeHash
with a JSON body that includes the customerPhoneNumber and products properties.
JSON Body:
{
  "customerPhoneNumber": "+1234567890",
  "products": [
    {
      "product_id": 123,
      "quantity": 2
    },
    {
      "product_id": 456,
      "quantity": 1
    }
  ]
}
you would need to set the HTTP method to POST and the URL to http://localhost:3000/createOrder

when calling the end point, which updates an order when it is fulfilled, there are no query parameters needed since we are using a route parameter id to specify the order to update. The request method is a PUT method and we are sending data in the request body to update the order status.

So you would need to send a PUT request to the endpoint with the order ID specified in the URL path, like so:
http://localhost:3000/orders/abc123/123/fulfill
where 123 is the order id and abc123 is the store hash
