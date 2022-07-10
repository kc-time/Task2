import User from "../models/userModel";
import Wallet from "../models/walletModel";
import Stock from "../models/stockModel";
const alpha = require('alphavantage')({ key: 'GJ0X8OLY4UNPL2V2' });

let session;

export const register = (req, res) => {
  const {
    username,
    password
  } = req.body;

  let newUser = new User({ username: username, password: password });

  newUser.save((err, user) => {
    if (err) {
      return res.status(400).send(err)
    }
    let newWallet = new Wallet({
      owner_id: user._id
    })
    newWallet.save((err, wallet) => {
      if (err) {
        return res.status(400).send(err)
      }
    })
    let newStock = new Stock({
      owner_id: user._id
    })
    newStock.save((err, stock) => {
      if (err) {
        return res.status(400).send(err)
      }
    })

    return res.status(201).send({
      message: "Register success!"
    });
  })

  
}

export const login = (req, res) => {
  const {
    username,
    password
  } = req.body;
  session=req.session;
  User.findOne({ username: username }).exec(function (error, user) {
    if (error) {
      return res.status(500).send({ error: true })
    } else if (!user) {
      return res.status(400).send({ error: true })
    } else {
      user.comparePassword(password, function (matchError, isMatch) {
        if (matchError) {
          return res.status(400).send({ error: true })
        } else if (!isMatch) {
          return res.status(400).send({ error: true })
        } else {
          // req.sessions.userid = user._id
          session.userid=user._id;
          return res.send({ success: true, userid: user._id })
        }
      })
    }
  })
}

export const logout = (req, res) => {
  req.session.destroy(() => {
    req.send('User logout')
  });
}

export const showPortfolio = async (req, res) => {

  const wallet = await Wallet.findOne({owner_id: req.session.userid});
  if (!wallet) return res.status(403);
  const stock = await Stock.findOne({owner_id: req.session.userid});
  if (!stock) return res.status(403);

  let data;
  let hasError = false;
  const subscription =  await Promise.all(stock.subscription.slice(-5).map(async item => {
      if (hasError) return;
      try {
          data = await alpha.data.quote(item.symbol);
      } catch (error) {
          hasError = true;
          return res.status(500).send('Thank you for using Alpha Vantage! Our standard API call frequency is 5 calls per minute and 500 calls per day. Please visit https://www.alphavantage.co/premium/ if you would like to target a higher API call frequency.');
      }
      return {symbol: item.symbol, price: data ? data["Global Quote"]['05. price'] || null : null};
  }));
  if (!hasError)
  return res.send({
      balance: wallet.balance,
      stocks: stock.items,
      subscription
  })
}
