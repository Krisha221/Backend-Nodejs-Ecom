const Vendor = require('../models/Vendor')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const dotEnv = require('dotenv')

dotEnv.config()

const secretKey = process.env.WisName


const vendorRegister = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "Username, email, and password are required" });
    }


    try {
        const vendorEmail = await Vendor.findOne({ email });
        if (vendorEmail) {
            return res.status(400).json("Email already taken");
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        const newVendor = new Vendor({
            username,
            email,
            password: hashedPassword
        });
        await newVendor.save();

        res.status(201).json({ message: "Vendor registered successfully" })
        console.log('registered')

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}


//function for vendorlogin
const vendorLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const vendor = await Vendor.findOne({ email })
        if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
            return res.status(401).json({ error: "Invalid username or password" })
        }
        const token = jwt.sign({ vendorId: vendor._id }, secretKey, { expiresIn: "1h" })

        res.status(200).json({ success: "Login Successful", token })
        console.log(`${email} logged in, the token is ${token}`)

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });

    }
}

const getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find().populate('Business')
        res.json({ vendors })
    } catch (error) {
        console.error()
        res.status(500).json({ error: "Internal server error" })
    }

}

const getVendorById = async (req, res) => {
    const vendorId = req.params.id

    try {
        const vendor = await Vendor.findById(vendorId).populate('Business')
        if (!vendor) {
            return res.status(404).json({ error: "Vendor not found" })
        }
        res.status(200).json({ vendor })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server error" })
    }
}

module.exports = { vendorRegister, vendorLogin, getAllVendors, getVendorById }