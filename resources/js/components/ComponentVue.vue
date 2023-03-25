<template>
  <div>
    <button style="height: 100px; width: 100px" id="payment-request-button" @click="handlePaymentRequest">Pay with Payment Request API</button>
  </div>
</template>

<script setup>
import {loadStripe} from '@stripe/stripe-js/pure';

const stripePromise = loadStripe('pk_test_51MmpRBIg1YYd1pAGOIGnAoBAqBPTPiaL6ME7c3VpzsGPM0pmjXUURpZGfMbEwRwJgNunikGEXdnc1XkWbGaCsPKF00qcfu3LWp');

const handlePaymentRequest = async () => {
  const stripe = await stripePromise;

  const paymentRequest = stripe.paymentRequest({
    country: 'US',
    currency: 'usd',
    total: {
      label: 'Demo total',
      amount: 1099,
    },
    requestPayerName: true,
    requestPayerEmail: true,
  });

  const elements = stripe.elements();

  const paymentRequestButton = elements.create('paymentRequestButton', {
    paymentRequest,
  });

  paymentRequest.canMakePayment().then((result) => {
    if (result) {
      paymentRequestButton.mount('#payment-request-button');
    } else {
      document.getElementById('payment-request-button').style.display = 'none';
    }
  });

  paymentRequestButton.on('paymentmethod', async (event) => {
    const {error} = await stripe.confirmCardPayment(
      '{{ clientSecret }}',
      {payment_method: event.paymentMethod.id},
      {handleActions: false}
    );

    if (error) {
      event.complete('fail');
    } else {
      event.complete('success');
      const {paymentIntent} = await stripe.confirmCardPayment('{{ clientSecret }}');
      handlePayment(paymentIntent);
    }
  });
};
</script>
