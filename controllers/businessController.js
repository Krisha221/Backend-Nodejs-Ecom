const Business = require("../models/Business");
const Vendor = require('../models/Vendor')
const multer = require('multer')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + Path.extname(file.originalname))
    }
})
var upload = multer({ storage: storage })


const addBusiness = async (req, res) => {

    const { businessName, location, category, region, offers } = req.body


    if (!businessName || !location) {
        return res.status(400).json({ error: "businessName and location are required" });
    }

    try {

        const image = req.file ? req.file.filename : undefined

        const vendor = await Vendor.findById(req.vendorId)
        if (!vendor) {
            res.status(404).json({ message: "vendor not found" })
        }

        const business = new Business({
            businessName, location, category, region, offers, image, vendor: vendor._id
        })

        const savedBusiness = await business.save()

        vendor.Business.push(savedBusiness)

        await vendor.save()

        return res.status(200).json({ message: "Firm added successfully" })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "internal, server error" })
    }

}

const deleteBusinessById = async (req, res) => {
    try {
        const businessId = req.param.businessId

        const deleteBusiness = await Business.findByIdAndDelete(businessId)
        if (!deleteBusiness) {
            res.status(404).json({ error: "No Business found" })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "internal server error" })
    }
}

module.exports = { addBusiness: [upload.single('image'), addBusiness], deleteBusinessById }