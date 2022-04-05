router.post(/stripe-payment, async (req,res) => {
 try {
      const amount = req.body.amount * 100;

      const { cardNumber, cardExpMonth, cardExpYear, cardCVC } = req.body;
      if (cardNumber.length > 0 && cardExpMonth.length > 0 && cardExpYear.length > 0 && cardCVC.length > 0) {
        const cardToken = await stripe.tokens.create({
          card: {
            number: cardNumber,
            exp_month: cardExpMonth,
            exp_year: cardExpYear,
            cvc: cardCVC,
          },
        });
        const charge = await stripe.charges.create({
          amount: amount,
          currency: 'usd',
          source: cardToken.id,
          receipt_email: user.email,
          description: `Amount ${req.body.amount} deposited by ${user.email}`,
        });

        if (charge.status !== 'succeeded') {
          res.status(400).json({
            status: 400,
            message: 'Please try again',
          });
          return;
        }
      }
      catch (error) {
      res.status(400).json({ status: 400, message: error.message });
    }
}
