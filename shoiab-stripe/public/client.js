const terminal = StripeTerminal.create({
  onFetchConnectionToken: fetchConnectionToken,
  onUnexpectedReaderDisconnect: unexpectedDisconnect,
});

function unexpectedDisconnect() {
  // In this function, your app should notify the user that the reader disconnected.
  // You can also include a way to attempt to reconnect to a reader.
  console.log("Disconnected from reader")
}

async function fetchConnectionToken() {
  // Do not cache or hardcode the ConnectionToken. The SDK manages the ConnectionToken's lifecycle.
  const response = await fetch('/connection_token', { method: "POST" });
  const data = await response.json();
  return data.secret;
}

// Handler for a "Discover readers" button
async function discoverReaderHandler() {
  const config = {simulated: true};
  const discoverResult = await terminal.discoverReaders(config);
  if (discoverResult.error) {
      console.log('Failed to discover: ', discoverResult.error);
  } else if (discoverResult.discoveredReaders.length === 0) {
      console.log('No available readers.');
  } else {
      discoveredReaders = discoverResult.discoveredReaders;
      log('terminal.discoverReaders', discoveredReaders);
  }
}

// Handler for a "Connect Reader" button
async function connectReaderHandler(discoveredReaders) {
  // Just select the first reader here.
  const selectedReader = discoveredReaders[0];
  const connectResult = await terminal.connectReader(selectedReader);
  if (connectResult.error) {
      console.log('Failed to connect: ', connectResult.error);
  } else {
      console.log('Connected to reader: ', connectResult.reader.label);
      log('terminal.connectReader', connectResult)
  }
}
//creating paymentintent
async function fetchPaymentIntentClientSecret(amount) {
  const bodyContent = JSON.stringify({ amount: amount });
  const response = await fetch('/create_payment_intent', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: bodyContent
  })
  const data = await response.json();
  //console.log(data, '------------------------------------');
  return data.client_secret;
}

async function collectPayment() {

  //-----------------------fetching amount from bigcommerce store------------
  /*const ID = "BIGCommerce_webhookID"
  const response = await fetch('v1/webhook_endpoints/', {
    method: "POST",
    headers: {
       'Content-Type': 'application/json'
       },
    body: JSON.stringify({"webhook_endpoints_ID": ID})
  })
  const data = await response.json()
  const amount = data.amount;*/

  //------------------------fetching client secret------------------------
  const client_secret = await fetchPaymentIntentClientSecret("200"); 
  terminal.setSimulatorConfiguration({testCardNumber: '4242424242424242'});

  //------------------------collect payment method------------------------
  const result = await terminal.collectPaymentMethod(client_secret)
  //console.log(result, '------------------');
  if (result.error) {
    // Placeholder for handling result.error
  } else {
      log('terminal.collectPaymentMethod', result.paymentIntent);
      const result2 = await terminal.processPayment(result.paymentIntent) //processpayment
      if (result2.error) {
        // Placeholder for handling result.error
      } else if (result2.paymentIntent) {
          paymentIntentId = result2.paymentIntent.id;
          log('processPayment', result2.paymentIntent);
          //log('paymentIntentId', paymentIntentId);
      }
  }
}

//no need of capture if capture method is automatic
async function capture(paymentIntentId) {
  //log('paymentIntentId', paymentIntentId);
  const result = await fetch('/capture_payment_intent', {
      method: "POST",
      headers: {
         'Content-Type': 'application/json'
     	},
      body: JSON.stringify({"payment_intent_id": paymentIntentId})
  })

  const data = await result.json();
  log('server.capture', data);
}

var discoveredReaders;
var paymentIntentId;

const discoverButton = document.getElementById('discover-button');
discoverButton.addEventListener('click', async (event) => {
  discoverReaderHandler();
});

const connectButton = document.getElementById('connect-button');
connectButton.addEventListener('click', async (event) => {
  connectReaderHandler(discoveredReaders);
});

const collectButton = document.getElementById('collect-button');
collectButton.addEventListener('click', async (event) => {
  //amount = document.getElementById("amount-input").value
  
  collectPayment();
});

const captureButton = document.getElementById('capture-button');
captureButton.addEventListener('click', async (event) => {
  capture(paymentIntentId);
});

function log(method, message){
  var logs = document.getElementById("logs");
  var title = document.createElement("div");
  var log = document.createElement("div");
  var lineCol = document.createElement("div");
  var logCol = document.createElement("div");
  title.classList.add('row');
  title.classList.add('log-title');
  title.textContent = method;
  log.classList.add('row');
  log.classList.add('log');
  var hr = document.createElement("hr");
  var pre = document.createElement("pre");
  var code = document.createElement("code");
  code.textContent = formatJson(JSON.stringify(message, undefined, 2));
  pre.append(code);
  log.append(pre);
  logs.prepend(hr);
  logs.prepend(log);
  logs.prepend(title);
}

function formatJson(message){
  var lines = message.split('\n');
  var space = " ".repeat(2);
  var json = "";
  for(var i = 1; i <= lines.length; i += 1){
    let line = i + space + lines[i-1];
    json = json + line + '\n';
  }
  return json
}

/*<div class="row pad">
<div class="">
<input id="amount-input" type="text" value="2000">
</div>
</div>*/