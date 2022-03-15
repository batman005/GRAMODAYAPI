const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    cmdtyName : {   
        type: String
    },
    cmdtyID : {   
        type: String,
        required: [true, 'Commodity ID is required'],
    },
    marketID : {
        type: String,
        required: [true, 'Market ID is required'],
    },
    marketName : {
        type: String,
    },
    marketType : {
        type: String,
    },
    userID: {
        type: [String],
        required: [true, 'User ID is required'],
        validate: v => Array.isArray(v) && v.length > 0,
    },
    timestamp : {
        type: Number,
		default: Date.now()
    },
    priceUnits : {
        type : String,
        default : "Kg"
    },
    convFctr : {
        type : Number,
        default : 100,
        required : [true, 'Conversion factor is required']
    },
    price : {
        type : Number,
        required : [true, "price is required"]
    }
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;