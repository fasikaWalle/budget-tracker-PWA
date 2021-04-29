const router = require("express").Router();
const Transaction = require("../models/transaction.js");
const webpush=require('web-push');


router.post('/subscribe', (req, res) => {
  const subscription = req.body.subscription;

  res.status(201).json({});
 
  const payload = JSON.stringify({title:{amount:req.body.transactionInfo.amount,name:req.body.transactionInfo.transactionName}});

  console.log(subscription);

  webpush.sendNotification(subscription, payload).catch(error => {
    console.error(error);
  });
});


router.post("/api/transaction", ({body}, res) => {
  Transaction.create(body)
    .then(dbTransaction => {
      res.json(dbTransaction);
      
    })
    .catch(err => {
      res.status(404).json(err);
    });
});


      

router.post("/api/transaction/bulk", ({body}, res) => {
  Transaction.insertMany(body)
    .then(dbTransaction => {
      res.json(dbTransaction);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

router.get("/api/transaction", (req, res) => {
  Transaction.find({}).sort({date: -1})
    .then(dbTransaction => {
      res.json(dbTransaction);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});



module.exports = router;