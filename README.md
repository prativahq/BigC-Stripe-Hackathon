# BigC-Stripe-Hackathon

When calling the /createOrder endpoint with a query parameter, you would need to use a POST request with a JSON body that includes the customerPhoneNumber and products properties.
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
