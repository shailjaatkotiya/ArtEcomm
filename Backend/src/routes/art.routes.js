const express = require('express');
const router = express.Router();
const artController = require('../controllers/art.controller');
const validate = require('../middleware/validate');
const { createArtSchema, updateArtSchema } = require('../validators/art.validator');

router.post('/', validate(createArtSchema), artController.createArt);
router.get('/', artController.getArts);
router.get('/:id', artController.getArtById);
router.put('/:id', validate(updateArtSchema), artController.updateArt);
router.delete('/:id', artController.deleteArt);

module.exports = router;
