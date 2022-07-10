import Wallet from "../models/walletModel";
import Stock from "../models/stockModel";
const alpha = require('alphavantage')({ key: 'GJ0X8OLY4UNPL2V2' });

export const checkStock = (req, res) => {
    alpha.data.quote(req.params.stockSymbol).then((data) => {
        if (data["Global Quote"]['05. price'] !== undefined) {
            return res.json(data["Global Quote"]['05. price']);
        }
        else {
            return res.status(401).send('Incorrect symbol')
        }
      }).catch((err) => {
        return res.status(500).send('Fail to connect server');
      });
}

export const buyShare = async (req, res) => {
    
    const wallet  = await Wallet.findOne({ owner_id: req.session.userid});
    if (!wallet) {
        return res.status(403).send('Please login')
    }
    const data = await alpha.data.quote(req.params.stockSymbol);
    if (data["Global Quote"]['05. price'] === undefined) return res.status(401).send('Incorrect symbol')

    let price = parseFloat(data["Global Quote"]['05. price']);
    const amount = parseInt(req.body.amount);

    if (wallet.balance >= price * amount) {
        let newBalance = wallet.balance - price * amount;
        let stocks = await Stock.findOne({ owner_id: req.session.userid});
        if (!stocks) return res.status(403).send('Please login')
        console.log(stocks)
        let stockIndex = stocks.items.findIndex(item => item.symbol === req.params.stockSymbol)
        let stock;
        if (stockIndex === -1) {
            stock = {
                symbol: req.params.stockSymbol,
                shares: amount
            }
            stocks.items.push(stock)
        } else {
            stock = stocks.items[stockIndex];
            stock.shares = parseInt(stock.shares) + amount;
            stocks.items[stockIndex] = stock;
        }
        
        wallet.balance = newBalance;
        await wallet.save();
        await stocks.save();

        return res.send('bought shares')
    } else {
        return res.status(401).send('Not enough balance')
    }
}

export const sellShare = async (req, res) => {
    
    const wallet  = await Wallet.findOne({ owner_id: req.session.userid});
    if (!wallet) return res.status(403);
    const amount = parseInt(req.body.amount);
    const stocks = await Stock.findOne({ owner_id: req.session.userid});
    let stockIndex = stocks.items.findIndex(item => item.symbol === req.params.stockSymbol)
    if (stockIndex !== -1 && stocks.items[stockIndex].shares >= amount) {
        const data = await alpha.data.quote(req.params.stockSymbol);
        if (data["Global Quote"]['05. price'] === undefined) return res.status(401).send('Incorrect symbol')

        let price = parseFloat(data["Global Quote"]['05. price']);
        let newBalance = wallet.balance + price * amount;
        stocks.items[stockIndex].shares -= amount;
        if (stocks.items[stockIndex].shares == 0) {
            stocks.items.splice(stockIndex, 1);
        }
        wallet.balance = newBalance;
        await wallet.save()
        await stocks.save()
        return res.send('Sold shares')
    } else {
        return res.status(401).send('Not enough shares')
    }
}

export const subscribe = async (req, res) => {
    let stock = await Stock.findOne({ owner_id: req.session.userid});
    let data;
    try {
        data = await alpha.data.quote(req.params.stockSymbol);
    } catch (error) {
        return res.status(500).send('Thank you for using Alpha Vantage! Our standard API call frequency is 5 calls per minute and 500 calls per day. Please visit https://www.alphavantage.co/premium/ if you would like to target a higher API call frequency.');
    }
    if (data["Global Quote"]['05. price'] === undefined) return res.status(401).send('Incorrect symbol')
    
    // stock.updateMany({}, {$addToSet: {"subscription": req.params.stockSymbol}}, {upsert: true})
    if (!stock.subscription.find( item => item.symbol === req.params.stockSymbol)) {
        stock.subscription.push({symbol: req.params.stockSymbol});
        stock = await stock.save();
    }
    return res.send('Subscribed ' + req.params.stockSymbol)
}   