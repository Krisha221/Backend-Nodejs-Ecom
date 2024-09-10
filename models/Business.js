
const mongoose = require('mongoose');
const Product = require('./product');

const businessSchema = new mongoose.Schema({
    businessName: {
        type: String,
        required: true,
        unique: true
    },
    location: {
        type: String,
        required: true
    },
    category: {
        type: [
            {
                type: String,
                enum: ['vegan', 'non-veg']
            }
        ]
    },
    region: {
        type: [
            {
                type: String,
                enum: ['indian', 'chinese', 'korean', 'thai']
            }
        ]
    },
    offers: {
        type: String,
    },
    image: {
        type: String
    },
    vendor: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'vendor'
        }
    ],
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
})

const Business = mongoose.model('Business', businessSchema)

module.exports = Business;