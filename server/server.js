const express = require('express');
const app = express();
const path = require('path');

const PORT = 3000;

// uncomment the below for proxy challenge

const leaderList = [
  // {name: 'Anna', id: 'a0'},
];

app.get('/api/leaders', (req, res) => {
  return res.status(200).send(leaderList);
});


// statically serve everything in the build folder on the route '/build'
console.log(path.join(__dirname, '../build'));
app.use('/build', express.static(path.join(__dirname, '../build')));
// serve index.html on the route '/'
app.get('/', (req, res) => {
  return res.status(200).sendFile(path.join(__dirname, '../index.html'));
});

// app.listen(3000); //listens on port 3000 -> http://localhost:3000/
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));

