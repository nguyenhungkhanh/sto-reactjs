import express from 'express';
import Config from '../models/config.js';
import fs from 'fs';

let router = express.Router();

router.get('/', (req, res) => {
    Config.find({}, (err, config) => {
        if(err) res.status(400);
        else res.status(200).json(config[0]);
    })
});

router.put('/:id', (req, res) => {
    if(req.body.customersLogo) {
        let { customer, customersLogo } = req.body;
        let base64Data = req.body.customer.logo.replace(/^data:image\/(png|gif|jpeg);base64,/, "");
        customer.logo = `/customers/${customer.name}-logo.png`;
        customersLogo.push(customer);
        Config.updateOne({'_id': req.params.id}, {customers: customersLogo}, (err, config) => {
            if(err) res.status(400).json({status: false});
            else {
                fs.writeFile(`./public/customers/${customer.name}-logo.png`, base64Data, 'base64', function(err) {
                    if(err) res.status(400).json({err});
                    else res.status(200).json({config});
				});
            };
        });
    } else {
        if(req.body.customersRemove) {
            Config.updateOne({'_id': req.params.id}, req.body, (err, config) => {
                if(err) res.status(400).json({status: false});
                else {
                    req.body.customersRemove.forEach(function(filename) {
                        filename = './public' + filename;
                        console.log(filename);
                        fs.unlink(filename, (err) => {
                            if (err) {
                                console.log(err);
                                res.status(400).json({err})
                            } else {
                                res.status(200).json({status: true})                                
                            }
                        });
                    });
                };
            });
        } else if (req.body.customersEdit) {
            console.log(req.body.index);
            let base64Data = '';
            if(req.body.customer.imgRemove) {
                let filename = './public' + req.body.customer.imgRemove;
                fs.unlink(filename, (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('ok')                             
                    }
                });
            }
            if(req.body.customer.logo[0] === 'd') {
                base64Data = req.body.customer.logo.replace(/^data:image\/(png|gif|jpeg);base64,/, "");
            }
            let newCustomer = req.body.customer;
            if(base64Data !== '') {
                newCustomer.logo = `/customers/${req.body.customer.name}-logo.png`;
            }
            req.body.customersEdit[req.body.index] = newCustomer;
            console.log(req.body.customersEdit);
            Config.updateOne({'_id': req.params.id}, {customers: req.body.customersEdit}, (err, config) => {
                if(err) res.status(400).json({status: false});
                else {
                    if(base64Data !== '') {
                        fs.writeFile(`./public/customers/${req.body.customer.name}-logo.png`, base64Data, 'base64', function(err) {
                            if(err) res.status(400).json({err});
                            else res.status(200).json({config});
                        });
                    } else res.status(200).json({config});
                }
            });
        } else {
            Config.updateOne({'_id': req.params.id}, req.body, (err, config) => {
                if(err) res.status(400).json({status: false});
                else res.status(200).json({status: true});
            });
        }
    }
});

export default router;