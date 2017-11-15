import express from 'express';
import Blog from '../models/blog.js';
import fs from 'fs';

let router = express.Router();

router.get('/', (req, res) => {
  Blog.find({}).sort({dateCreated: -1}).exec((err, blogs) => {
    if(err) res.status(400).json(err);
    else res.status(200).json(blogs);
  });
})

router.get('/:id', (req, res) => {
    Blog.findById(req.params.id, (err, blog) => {
        if(err) res.status(400).json(err);
        else res.status(200).json(blog);
    })
})
router.post('/', (req, res) => {
    let base64Data = '';
    if(req.body.thumbnail) {    
        base64Data = req.body.thumbnail.replace(/^data:image\/(png|gif|jpeg);base64,/, "");
        req.body.thumbnail = `/blog/${req.body.name}.png`;
    }
    let newBlog = new Blog(req.body);
    newBlog.save((err, blog) => {
        if(err) res.status(400).json(err);
        else {
            if(base64Data !== '') {
                fs.writeFile(`./public/blog/${req.body.name}.png`, base64Data, 'base64', function (err) {
                    if (err) res.status(400).json(err);
                    else res.status(200).json(blog);
                });
            } else res.status(200).json(blog);
        }
    })
})

router.put('/:id', (req, res) => {
    if(req.body.imgRemove) {
        fs.unlink(`./public${req.body.imgRemove}`, (err) => {
            if(!err) console.log('ok');
        })
    }
    if(req.body.thumbnail && req.body.thumbnail[0] === 'd') {
        let base64Data = req.body.thumbnail.replace(/^data:image\/(png|gif|jpeg);base64,/, "");
        if(fs.existsSync(`./public/blog/${req.body.name}.png`)) {
            console.log('isExist');
            fs.unlink(`./public/blog/${req.body.name}.png`, (err) => {
                if (err) console.log(err)
                else console.log('ok');
            })
        }
        req.body.thumbnail = `/blog/${req.body.name}.png`;
        fs.writeFile(`./public/blog/${req.body.name}.png`, base64Data, 'base64', function (error) {
            if(error) console.log(error);
            else console.log('ok');
        });
    }
    Blog.findOneAndUpdate({'_id': req.params.id}, req.body, (err, blog) => {
        if(err) res.status(400).json(err);
        else res.status(200).json(blog);
    });
})

router.delete('/:id', (req, res) => {
    console.log(req.params.id);
    Blog.remove({'_id': req.params.id}, (err, blog) => {
        if(!err) res.status(200).json(blog);
    });
})
export default router;