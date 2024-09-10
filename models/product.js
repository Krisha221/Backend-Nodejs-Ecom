const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        reqiured: true
    },
    price: {
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
    image: {
        type: String
    },
    description: {
        type: String,

    },
    popularity: {
        type: [
            {
                type: String,
                enum: ['best seller', 'most liked']
            }
        ]

    },
    business: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business'
    }]

})

const Product = mongoose.model('product', productSchema)

module.exports = Product