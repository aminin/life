const express = require('express');
const fs = require('fs');

const app = express();

const dataFileName = 'var/data/data.json';

// Если файла нет — создаём
if (!fs.existsSync(dataFileName)) {
    fs.writeFileSync(dataFileName, '{}');
}

//let data = JSON.parse(fs.readFileSync(dataFileName).toString());

//console.log('Data from file ', data);
app.listen(3000, () => {
    console.log('Server running on port 3000');
});

// Главную страницу по адресу http://localhost:3000/
app.use(express.static('public'));
app.use(express.urlencoded());
app.use(express.json());

function getData() {
    return JSON.parse(fs.readFileSync(dataFileName).toString());
}

function setData(data) {
    fs.writeFileSync(dataFileName, JSON.stringify(data));
}

app.param('id', function (req, res, next, id) {
    next();
});

// api_matrix_list
app.get('/api/matrix', (req, res, next) => {
    let data = getData();
    res.json(data);
});

// api_matrix_create
app.post('/api/matrix', (req, res, next) => {
    let item = req.body;

    if (
        !item['name'] ||
        !item['width'] ||
        !item['height'] ||
        !item['data']
    ) {
        return res.badRequest();
    }

    let data = getData();
    let maxId = Math.max(Object.keys(data).map('parseInt'));
    let newId = '' + ((maxId || 0) + 1);
    item = Object.assign(item, {id: newId});
    data[newId] = item;
    setData(data);
    res.json(item);
});

// api_matrix_show
app.get('/api/matrix/:id', (req, res, next) => {
    const id = (req.params.id).toString();
    const data = getData();
    if (!data[id]) {
        return res.notFound(); // res.status(404).send('Not Found');
    }

    res.json(data[id]);
});

// api_matrix_delete
app.delete('/api/matrix/:id', (req, res, next) => {
    const id = (req.params.id).toString();
    let data = getData();
    if (!data[id]) {
        return res.notFound(); // res.status(404).send('Not Found');
    }

    const item = data[id];
    delete data[id];
    setData(data);

    res.json(item);
});

// api_matrix_deletee
app.get('/api/matrix/:id/destroy', (req, res, next) => {
    const id = (req.params.id).toString();
    let data = getData();
    if (!data[id]) {
        return res.notFound(); // res.status(404).send('Not Found');
    }

    const item = data[id];
    delete data[id];
    setData(data);

    res.json(item);
});


