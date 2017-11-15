import express from 'express';
import Hire from '../models/hire.js';
import fs from 'fs';

let router = express.Router();

router.get('/', (req, res) => {
    Hire.find({}, (err, hires) => {
        if(err) res.status(400).json(err);
        else res.status(200).json(hires);
    })
})

router.get('/:id', (req, res) => {
    Hire.findById(req.params.id, (err, hire) => {
        if(err) res.status(400).json(err);
        else res.status(200).json(hire);
    })
})

router.post('/', (req, res) => {
    let hire = req.body, base64Data;
    if(hire.thumbnail) {
        if(hire.thumbnail[0] === 'd') {
            base64Data = hire.thumbnail.replace(/^data:image\/(png|gif|jpeg);base64,/, "");
        }
    }
    if(req.body.thumbnail) 
        hire.thumbnail = `/hire/${hire.title}.png`;
    let newHire = new Hire(hire);
    newHire.save((err, hire) => {
        if(err) res.status(400).json(err);
        else {
            fs.writeFile(`./public/hire/${hire.title}.png`, base64Data, 'base64', function(error) {
                if(error) res.status(400).json(error);
                else res.status(200).json(hire);
            });
        }
    })
})

router.put('/:id', (req, res) => {
    let base64Data = '';
    if (req.body.thumbnail && req.body.thumbnail[0] === 'd') {
        base64Data = req.body.thumbnail.replace(/^data:image\/(png|gif|jpeg);base64,/, "");
    }
    if (req.body.imgRemove) {
        const filename = './public' + req.body.imgRemove;
        fs.unlink(filename, (err) => {
            if (err) console.log('err');
            else console.log('ok');
        })
    } 
    if (base64Data !== '') {
        if(fs.existsSync(`./public/hire/${req.body.title}.png`)) {
            console.log('isExist');
            fs.unlink(`./public/hire/${req.body.title}.png`, (err) => {
                if (err) console.log(err)
                else console.log('ok');
            })
        }
        req.body.thumbnail = `/hire/${req.body.title}.png`;
        fs.writeFile(`./public/hire/${req.body.title}.png`, base64Data, 'base64', function (error) {
            if(error) console.log(error);
            else console.log('ok');
        });
    }
    Hire.findOneAndUpdate({ '_id': req.params.id }, req.body, (err, hire) => {
        if (err) res.status(400).json(err);
        else res.status(200).json(hire);
    })
})

router.delete('/:id', (req, res) => {
    Hire.remove({'_id': req.params.id}, (err) => {
        if(err) res.status(400).json(err);
        else {
            console.log('hire', req.body.thumbnail);
            res.status(200).json({success: true});
        }
    })
})
export default router;