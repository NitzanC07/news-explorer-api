const express = require('express');
const { default: mongoose } = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/newsExplorer', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

app.post('/signup', createUser);

app.get('/', (req, res) => {
  res.send(`This is the root page.`)
})


app.listen(PORT, () => {
  console.log(`App listening to port ${PORT}.`);
});
