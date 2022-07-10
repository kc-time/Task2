import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ObjectId = mongoose.Schema.ObjectId;
const WalletSchema = new Schema({
    owner_id: {
        type: ObjectId,
        ref: 'User'
    },
    balance: {
        type: Number,
        default: 0
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Wallet", WalletSchema)
