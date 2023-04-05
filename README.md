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
