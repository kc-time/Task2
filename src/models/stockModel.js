import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ObjectId = mongoose.Schema.ObjectId;
const StockSchema = new Schema({
    owner_id: {
        type: ObjectId,
        ref: 'User'
    },
    items: [
        {
            symbol: String,
            shares: Number
        }
    ],
    subscription: [
        {
            symbol: String
        }
    ],
    created_date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Stock", StockSchema)
