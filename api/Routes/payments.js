const router = require('express').Router()
const User = require('../Models/User')
const Plan = require('../Models/Plans')
const verify =require('../VerifyToken')
const stripe = require('stripe')(process.env.STRIPE_SECRETE_KEY);
const { ref, deleteObject } = require('firebase/storage')
const firebaseStorage = require('../firebase')

router.post('/create-plan',verify,async(req,res)=>{
  if(req.user.isAdmin===true){
    
    try {
      const price = await stripe.prices.create({
        currency: req.body.currency,
        unit_amount: req.body.price,
        recurring: {
          interval: req.body.interval,
        },
        product_data: {
          name: req.body.name,
        },
      })
      const plan= await new Plan({...req.body,priceId:price.id}).save()
       res.json(plan)
      } catch (error) {
        console.log(error)
        res.json('server error')
      }
    
    
  }else res.json('you are not authorized')
})

router.put('/update-plan/:id',verify,async(req,res)=>{
  if(req.user.isAdmin===true){
    try {
      const price = await stripe.prices.create({
        currency: req.body.currency,
        unit_amount: req.body.price,
        recurring: {
          interval: req.body.interval,
        },
        product_data: {
          name: req.body.name,
        },
      })
    const plan= await Plan.findByIdAndUpdate(req.params.id,{...req.body,priceId:price.id},{new:true})
     res.json(plan)
    } catch (error) {
      console.log(error)
      res.json('server error')
    }
  }else res.json('you are not authorized')
})


router.get('/get-plans',verify,async(req,res)=>{
    try {
    const plan= await Plan.find()
     res.json(plan)
    } catch (error) {
      console.log(error)
      res.json('server error')
    }
})

router.delete('/delete-plan/:id',verify,async(req,res)=>{
  if(req.user.isAdmin===true){
    const imageRef = ref(firebaseStorage,req.body.image)
    deleteObject(imageRef).then( async () => {
      try {
         await Plan.findByIdAndDelete(req.params.id)
         const plan = await Plan.find()
         res.json(plan)
        } catch (error) {
          console.log(error)
          res.json('server error')
        }
    }).catch(error=>{
      res.json("server error")
    })
}else res.json("you are not authorised")
})



async function getPrices(req,res,next){
try {
  const plan = await Plan.findById(req.body.planId)
  req.planDetails=plan
  next()
} catch (error) {
  res.json('server error')
}
}

router.post('/create-checkout-session/:userid',verify,getPrices, async (req, res) => {
 if(req.user.id===req.params.userid){
   try {
     const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price:req.planDetails.priceId,
          quantity:1
        },
      ],
      subscription_data:{
        metadata:{
          amount:req.planDetails.price,
          plan:req.planDetails.name,
          currency:req.planDetails.currency,
          userId:req.params.userid
        }
      },
      mode: 'subscription',
      ui_mode: 'embedded' ,
      // The URL of your payment completion page
      return_url: `${process.env.DOMAIN_URL}/return?session_id={CHECKOUT_SESSION_ID}`,   
     
   
  })
  res.json({clientSecret: session.client_secret})
  }
    catch (error) {
    console.log(error)
     res.json('server error')
   }

 }else res.json('you are not authorised')
   
  });

  

router.put('/update-subscription/:userid',verify,getPrices,async(req,res)=>{
if(req.user.id===req.params.userid){
  try {
    await stripe.subscriptions.update(
  req.body.subscriptionId,
 { items:[  
  {
    price:req.planDetails.priceId,
    
  },
],
  metadata:{
    amount:req.planDetails.price,
    plan:req.planDetails.name,
    currency:req.planDetails.currency,
    userId:req.params.userid
  }
}
    )
    res.json("plan updated")
  } catch (error) {
    console.log(error)
    res.json('server error')
  }
}else res.json("you are not authorized")

})


router.put('/cancel-subscription/:userid',verify,async(req,res)=>{
if(req.user.id===req.params.userid){
  try {
    await stripe.subscriptions.update(
  req.body.subscriptionId,
  {cancel_at_period_end:true}
    )
    res.json("success")
  } catch (error) {
    console.log(error)
    res.json('server error')
  }
}else res.json("you are not authorized")

})


  router.get('/session_status', async (req, res) => {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
  
    res.json({
      status: session.status,
      payment_status: session.payment_status,
      customer_email: session.customer_details.email
    });
});


module.exports = router;