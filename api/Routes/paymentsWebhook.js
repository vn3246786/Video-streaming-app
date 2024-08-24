const router = require('express').Router()
const User = require('../Models/User')
const verify =require('../VerifyToken')
const stripe = require('stripe')(process.env.STRIPE_SECRETE_KEY);
const express = require('express');

const endpointSecret =`${process.env.STRIPE_ENDPOINTSECRETE}`

router.post('/webhook',express.raw({ type: 'application/json' }),async (request, response) => {
    const sig = request.headers['stripe-signature'];
  
    let event;
  
  try {
      event =  stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      console.log(err)
      return;
    }
    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
       
        try {
          user =await User.findByIdAndUpdate(event.data.object.metadata.userId,
           {subscription_details: {
            plan:event.data.object.metadata.plan,
            subscriptionId:event.data.object.id,
              invoice:event.data.object.latest_invoice,
            startDate:new Date(event.data.object.current_period_start * 1000).toUTCString(),
            endDate:new Date(event.data.object.current_period_end * 1000).toUTCString(),
            amount:event.data.object.metadata.amount,
            currency:event.data.object.metadata.currency,
            plan:event.data.object.metadata.plan
            },
            payment_status:true},{new:true}
          )
        } catch (error) {
          console.log(error)
          try {
            const invoice = await stripe.invoices.retrieve(event.data.object.latest_invoice);
           await stripe.refunds.create({
              payment_intent: invoice.payment_intent,
            }); 
          } catch (error) {
            console.log("could not refund")
          }
        }
        break;
      // ... handle other event types
      case 'customer.subscription.deleted':
        console.log("deleted")
        // Then define and call a function to handle the event payment_intent.succeeded
        try {
          const user =await User.findByIdAndUpdate(event.data.object.metadata.userId,
           {subscription_details: {},
            payment_status:false},{new:true}
          )
        } catch (error) {
          console.log(error)
        }
        break;
      // ... handle other event types
      case 'customer.subscription.updated':
        console.log("updated")
        // Then define and call a function to handle the event payment_intent.succeeded
        try {
          const user =await User.findByIdAndUpdate(event.data.object.metadata.userId,
           {subscription_details: {
            plan:event.data.object.metadata.plan,
            subscriptionId:event.data.object.id,
              invoice:event.data.object.latest_invoice,
            startDate:new Date(event.data.object.current_period_start * 1000).toUTCString(),
            endDate:new Date(event.data.object.current_period_end * 1000).toUTCString(),
            amount:event.data.object.metadata.amount
            },
            payment_status:true},{new:true}
          )
        } catch (error) {
          console.log(error)
        }
        break;
      // ... handle other event types
    }
  
    // Return a 200 response to acknowledge receipt of the event
  });

  module.exports=router