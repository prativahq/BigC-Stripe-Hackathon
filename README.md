# BigC-Stripe-Hackathon

When calling the /createOrder endpoint with a query parameter, you would need to use a POST request to 
http://localhost:3000/orders/storeHash
with a JSON body that includes the customeremail and products properties.
JSON Body:
{ "email": "abc@gmail.com", "products":[
          {
            "name": "Fog Linen Chambray Towel - Beige Stripe",
            "quantity": 0,
            "price_inc_tax": 0,
            "price_ex_tax": 0
          }
        ] }

assumption: the customer's address is not empty


To use endpoint '/orders/:storeHash/:id/fulfill' , you would need to send a PUT request to http://localhost:3000/orders/storeHash/id/fulfill with the storeHash and id parameters set to the store hash and ID of the order to be updated. For example, to update order with ID 123 in a store with a hash of abc123, you would send a PUT request to http://localhost:3000/orders/abc123/123/fulfill.
