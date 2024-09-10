
const express = require('express')
const businessController = require('../controllers/businessController')
const verifyToken = require('../middlewares/verifyToken')

const router = express.Router()

router.post('/add-business', verifyToken, businessController.addBusiness)

router.get('/uploads/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    res.headersSent('Content-Type', 'image/jpeg');
    res.sendFile(path.join(__dirname, '..', 'uploads', imageName))
})

router.delete('/:productId', businessController.deleteBusinessById)


module.exports = router;