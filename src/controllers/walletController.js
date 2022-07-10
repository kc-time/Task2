import Wallet from "../models/walletModel";

export const addBalance = (req, res) => {
    
    let { amount } = req.body;

    Wallet.findOneAndUpdate({ owner_id: req.session.userid}, {$inc: {"balance": amount }}, { new: true, useFindAndModify: false }, (err, wallet) => {
        if (err) {
            return res.send(err);
        }

        return res.json({message: 'Success add balance'});
    })
}

