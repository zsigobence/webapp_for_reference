const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const port = 5000;
app.use(cors());
app.use(bodyParser.json());
const { taskCollection } = require("./db");
const { connectDB } = require('./db');

connectDB();


app.post('/tasks', (req, res) => {
  const data = {
    date: req.body.date,
    text: req.body.text,
    completed: req.body.completed,
    editing: req.body.editing,
    isToday: req.body.isToday
  }
  taskCollection.insertMany([data])
    .then(() => {
      res.json({ success: true, message: 'Sikeres adatok beszúrása' });
    })
    .catch((err) => {
      res.status(500).json({ success: false, message: 'Hiba az adatok beszúrása során', error: err });
    });
});

app.get('/tasks', (req, res) => {
  taskCollection.find({})
    .then((data) => {
      res.json({ success: true, data: data });
    })
    .catch((err) => {
      res.status(500).json({ success: false, message: 'Hiba a lekérdezés során', error: err });
    });
});


app.post('/delete', async (req, res) => {
  const { taskid } = req.body;
  try {
    const result = await taskCollection.deleteOne({ _id: taskid });
    if (result.deletedCount === 1) {
      res.json({ success: true, message: 'Termék sikeresen törölve.' });
    } else {
      res.status(404).json({ success: false, message: 'A termék nem található.' });}
  } catch (error) {
    console.error('Hiba történt a törlés során:', error);
    res.status(500).json({ error: 'Hiba történt a törlés során.' });
  }
});





app.post('/edittask', async (req, res) => {
  const { taskid, text, date } = req.body;
  try {
    await taskCollection.findOneAndUpdate(
      {_id: taskid},
      {$set: { date: date, text: text }}
    );
    res.json({ success: true, message: 'Feladat sikeresen módosítva' })
  } catch (error) {
    console.error('Hiba történt a módosítás során:', error);
    res.status(500).json({ error: 'Hiba történt a módosítás során.' });
  }
});


app.post('/togglecomplete', async (req, res) => {
  const { taskid } = req.body;
  console.log(JSON.stringify(taskid))
  try {
    const task = await taskCollection.findOne({_id: taskid});
  await taskCollection.findOneAndUpdate(
    {_id:taskid},
    {$set:{completed:!task.completed}}
  )} catch (error) {
    console.error('Hiba történt a togglecomplete során:', error);
    res.status(500).json({ error: 'Hiba történt a togglecomplete során.' });
  }
});



app.listen(port, () => {
    console.log(`A szerver fut a http://localhost:${port} címen`);
  });