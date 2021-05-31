const express = require('express');
const upload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const app = express();
const cors = require('cors');
const PORT = 3005;
let imageCach = {};

app.use(cors());
app.use(upload());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	res.send(imageCach);
});

app.post('/upload', (req, res) => {
	if (req.files) {
		const file = req.files.file;
		const filename = file.name;

		if (imageCach.hasOwnProperty(filename)) return res.send(imageCach);

		imageCach = { ...imageCach, [filename]: filename };

		console.log(imageCach);

		file.mv(`./public/images/${filename}`, (err) => {
			if (err) return res.send(err);
			// res.sendFile(__dirname + '/images');
			var files = fs.readdirSync(__dirname + '/public/images/');
			return res.send(imageCach);
			// res.json({ html: res.sendFile(__dirname + '/index.html'), files });
		});
	}
});

app.listen(PORT);
