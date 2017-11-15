import express from 'express';
import Product from '../models/product.js';
import fs from 'fs';

let router = express.Router();

router.get('/', (req, res) => {
	Product.find({}).exec((err, products) => {
		if(err) res.status(400).json(err);
		else res.status(200).json(products);
	})
})

router.get('/:id', (req, res) => {
	Product.findById(req.params.id, (err, product) => {
		if(err) res.status(400).json(err);
		else res.status(200).json(product);
	})
})

router.delete('/:id', (req, res) => {
	Product.remove({'_id': req.params.id}, (err, product) => {
		if(err) res.status(400).json(err);
		else {
			console.log(product);
		    res.status(200).json({id: product._id});
		}
	})
})

router.put('/:id', (req, res) => {
	let arrImage = [];
	let images = req.body.images.filter(image => {
			if(image.data[0] !== 'd') {
				return {
					data: image.data,
					isMainImage: image.isMainImage
				};	
			}
		});
	for(let i = 0; i < images.length; i++) {
		arrImage.push(images[i].data);
	}
	let base64Data;
	if(req.body.imagesRemove) {
		req.body.imagesRemove.forEach(function(filename) {
			filename = './public/' + filename;
			console.log(filename);
			fs.unlink(filename, (err) => {
				if (err) {
					console.log("failed to delete local image:"+err);
				} else {
					console.log('successfully deleted local image');                                
				}
			});
		});
	}
	if(req.body.images) {
		base64Data = req.body.images.filter(image=> {
			if(image.data[0] === 'd') {
				return {
					data: image.data,
					isMainImage: image.isMainImage
				};
			}
		});
		base64Data = base64Data.map((image, index) => {
			return {
				data: image.data.replace(/^data:image\/(png|gif|jpeg);base64,/, ""),
				isMainImage: image.isMainImage
			}
		});
		if(base64Data.length > 0) {
			let j = 0;
			for(var i = 0; i < base64Data.length; i++) {
				while(arrImage.includes(`${req.body.name}-${j}.png`)) {
					j++;
				}
				let img = {};
				img.data = `${req.body.name}-${j}.png`;
				arrImage.push(img.data);
				img.isMainImage = base64Data[i].isMainImage;
				images.push(img);
				fs.writeFile(`./public/${req.body.name}-${j}.png`, base64Data[i].data, 'base64', function(err) {
					console.log(err);
				});
			}	
		}
		req.body.images = images;
	}

	req.body.dateUpdated = new Date();
	Product.update({_id: req.params.id}, req.body, (err) => {
		if(err) res.status(400).json({faild: err});
		else {
			res.status(200).json(base64Data);
		}
	})
})

router.get('/category/:type', (req, res) => {
	Product.find({}, (err, products) => {
		if(err) res.status(400).json(err);
		else {
			products = products.filter((product) => {
				if(product.category.length > 0 && product.category.includes(req.params.type)) {
					return product;
				}
			})
			res.status(200).json(products);
		}
	})
})

router.post('/', (req, res) => {
	let newProduct = req.body;
	let base64Data;
	let images = [];
	if(req.body.images) {
		base64Data = req.body.images.map((image, index) => {
			let imageObject = {};
			imageObject.data = `${req.body.name}-${index}.png`;
			imageObject.isMainImage = image.isMainImage;
			images.push(imageObject);
			return image.data.replace(/^data:image\/(png|gif|jpeg);base64,/, "");
		})
		newProduct.images = images;
	}
	if(req.body.category) {
		newProduct.category = req.body.category;
	}
	newProduct.dateCreated = new Date();
	let product = new Product(newProduct);
	product.save((err, product) => {
		if(err) res.status(400).json(err);
		else {
			for(var i = 0; i < base64Data.length; i++) {
				fs.writeFile(`./public/${req.body.name}-${i}.png`, base64Data[i], 'base64', function(err) {
					console.log(err);
				});
			}
			res.status(200).json(product)
		};
	})
})
export default router;