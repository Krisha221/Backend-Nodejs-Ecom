const Product = require("../models/product")
const multer = require("multer");
const Business = require('../models/Business')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + Path.extname(file.originalname))
    }
})
var upload = multer({ storage: storage })

const addProduct = async (req, res) => {
    try {
        const { productName, price, category, description, popularity } = req.body
        const image = req.file ? req.file.filename : undefined

        const businessId = req.params.businessId
        const business = await Business.findById(businessId)

        if (!business) {
            return res.status(404).json({ error: "No firm found" })
        }

        const product = new Product({
            productName, price, category, description, popularity, image, business: business._id
        })
        const savedProduct = await product.save()

        business.products.push(savedProduct)

        await business.save()

        res.status(200).json(savedProduct)

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "internal server error" })
    }
}

const getProductsByBusiness = async (req, res) => {
    try {
        const businessId = req.params.businessId
        const business = await Business.findById(businessId)

        if (!business) {
            return res.status(404).json({ error: "No firm found" })
        }
        const businessName = business.businessName
        const products = await Product.find({ business: businessId })

        res.status(200).json({ businessName, products })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "internal server error" })
    }
}


const deleteProductById = async (req, res) => {
    try {
        const productId = req.params.productId

        const deletedProduct = await Product.findByIdAndDelete
        if (!deletedProduct) {
            return res.status(404).json({ error: "No product found" })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "internal server error" })
    }
}


module.exports = { addProduct: [upload.single('image'), addProduct], getProductsByBusiness, deleteProductById }