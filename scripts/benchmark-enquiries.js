const autocannon = require('autocannon');
const crypto = require('crypto');

async function run() {
  console.log("Starting 60s load test on POST /api/v1/enquiries (c=5, fresh idempotency key)...");
  const result = await autocannon({
    url: 'http://localhost:8080/api/v1/enquiries',
    connections: 5,
    duration: 60,
    timeout: 15,
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-idempotency-key': crypto.randomUUID(),
    },
    setupClient: (client) => {
      client.on('response', () => {
        client.setHeaders({
          'content-type': 'application/json',
          'x-idempotency-key': crypto.randomUUID(),
        });
        client.setBody(JSON.stringify({
          name: "Load Test Customer",
          email: "loadtest@candela.com",
          phone: "+919876543210",
          message: "Benchmarking idempotency and load: " + Date.now()
        }));
      });
    },
    body: JSON.stringify({
      name: "Load Test Customer",
      email: "loadtest@candela.com",
      phone: "+919876543210",
      message: "Initial enquiry payload"
    })
  });

  console.log(autocannon.printResult(result));
}

run().catch(console.error);
