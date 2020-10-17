const express = require("express");
const db = require("./knex");
const cors = require("cors");
const knexfile = require("../knexfile");
const moment = require("moment")
require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_API_KEY)


const setupServer = () => {
  const app = express()
  app.use(cors());
  app.use(express.json());

  //POST method
  app.post("/visits/:patient_id", async (req, res) => {
    const { patient_id } = req.params;
    const time = new Date;


    try {
      await db.table('visits')/*.where('patient_id', req.params.patient_id)*/.insert({
        "patient_id": req.body.patient_id,
        "visit_date": time,
        "treatment": req.body.treatment,
        "symptoms": req.body.symptoms,
        "doctor": req.body.doctor,
        "price": req.body.price,
        "paid": req.body.paid,
        "hospital_name": req.body.hospital_name,
        "medicine": req.body.medicine
      }).then(function (result) {
        res.json({ success: true, message: 'ok' })
      })
    } catch (err) {
      res.status(500).json({ message: "Error updating new post", error: err })

    }

  });


  //GET method
  app.get("/payments", async (req, res) => {
    const ptData = await db
      .select(
        "visit_id",
        "price",
        "hospital_name",
        "treatment",
        "visit_date",
        "doctor",
        "paid",
        "medicine"
      )
      .from("visits")
      .where("patient_id", 1);

    //change price format from string to number
    for (let obj of ptData) {
      if(obj.price){
        let strPrice = obj.price;
        console.log(obj.price)
        let initial = strPrice.substr(0, 1);
        let num = strPrice.substr(1);
        console.log(initial)
        if (initial === "¥") {
          obj.price = Number(num);
        } else {
          obj.price = Number(obj.price);
        }
      }
    }
    res.json(ptData);
  });

  //PATCH method: getting visit_id and update the paid value
  app.patch("/payments/:visit_id", async (req, res) => {
    const visit_id = req.params;

    await db
      .table("visits")
      .where('visit_id', req.body.visit_id)
      .update({ paid: true })
      .then(() => res.send("success"))
      .catch(() => res.status(500).json({ message: "Error updating new patch", error: err }))


  })

  //Test endpoint for stripe checkout, probably will change
  app.post('/create-session', async (req, res) => {

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: 'doctor_visit'
            },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `https://dr-stripe-frontend.vercel.app/`,
      cancel_url: `https://dr-stripe-frontend.vercel.app/`,
    });
    res.json({ id: session.id });
  });


  return app;
};

module.exports = { setupServer };
