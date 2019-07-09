const express = require('express');
const fs = require('fs');
const app = express();
const boduParser = require('body-parser');
app.use(express.static('./public'));
app.use(boduParser.json());
app.listen('3000', () => console.log('=================== server started ==================='));

app.get('/cart', (req, res) => {
    fs.readFile('./db/cart.json', 'utf-8',(err, data) => {
        if (err) {
            console.log(err)
        }
        res.send(data);
    });
});

app.get('/products', (req, res) => {
    fs.readFile('./db/products.json', 'utf-8',(err, data) => {
        if (err) {
            console.log(err)
        }
        res.send(data);
    });
});

app.post('/cart', (req, res) => {
    fs.readFile('./db/cart.json', 'utf-8',(err, data) => {
        if (err) {
            console.log(err)
        }

        const cart = JSON.parse(data);
        cart.push(req.body);

        fs.writeFile('./db/cart.json', JSON.stringify(cart), (err) => {
            if (err) {
                return console.log(err);
            }
            res.send(req.body);
            writeLog('add', req.body);
        });
    });
});

app.patch('/cart/:id', (req, res) => {
    fs.readFile('./db/cart.json', 'utf-8',(err, data) => {
        if (err) {
            return console.log(err)
        }
        let action;
        let tmpItem;
        let cart = JSON.parse(data);
    
        cart = cart.map((item) => {
            if (item.id === +req.params.id) {
                action = ( (item.count > req.body.count)? 'delete' : 'add');
                tmpItem = item;
                return { ...item, ...req.body };
            }
            return item;
        });
        fs.writeFile('./db/cart.json', JSON.stringify(cart), (err) => {
            if (err) {
                return console.log(err);
            }
            res.send(cart.find( (item) => item.id === +req.params.id));
            writeLog(action, tmpItem);
        });
    });
});

app.delete('/cart/:id', (req, res) => {
    fs.readFile('./db/cart.json', 'utf-8',(err, data) => {
        if (err) {
            return console.log(err)
        }
        let cart = JSON.parse(data);
        const tmpItem = cart.find((item) => item.id === +req.params.id);
        cart = cart.filter((item) => item.id !== +req.params.id);
   
        fs.writeFile('./db/cart.json', JSON.stringify(cart), (err) => {
            if (err) {
                return console.log(err);
            }
            res.send(cart);
            writeLog('delete', tmpItem);
        });
    });
});

function writeLog(action, item) {

    fs.readFile('./db/stats.json', 'utf-8',(err, data) => {
        if (err) {
            return console.log(err);
        }
        const history = (data.trim() === ''? [] :JSON.parse(data));
        let date = new Date();
        date = date.toISOString().split('.');
        history.push({
            action: action,
            productId: item.id,
            productName: item.name,
            datetime: date[0].replace(/[a-zA-Z]/g,' ')
        });
        fs.writeFile('./db/stats.json', JSON.stringify(history), (err) => {
            if (err) {
                return console.log(err);
            }
        });
    });
}