const express = require('express');
const router = express.Router();
const Show = require('../models/showModel');


router.post('/add-show', async (req, res) => {
  try {
    const newShow = new Show(req.body);
    await newShow.save();
    res.send({
      success: true,
      message: 'New show has been added!'
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message
    });
  }
});


router.post('/get-all-shows-by-theatre', async (req, res) => {
  try {
    const shows = await Show.find({ theatre: req.body.theatreId }).populate('movie');
    res.send({
      success: true,
      message: "All shows fetched",
      data: shows
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message
    });
  }
});


router.post('/delete-show', async (req, res) => {
  try {
    await Show.findByIdAndDelete(req.body.showId);
    res.send({
      success: true,
      message: 'The show has been deleted!'
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message
    });
  }
});


router.put('/update-show', async (req, res) => {
  try {
    await Show.findByIdAndUpdate(req.body.showId, req.body);
    res.send({
      success: true,
      message: 'The show has been updated!'
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message
    });
  }
});


router.post('/get-all-theatres-by-movie', async (req, res) => {
  try {
    const { movie, date } = req.body;
    const shows = await Show.find({ movie, date }).populate('theatre');
    const uniqueTheatres = [];
    shows.forEach(show => {
      if (!uniqueTheatres.some(theatre => theatre._id.equals(show.theatre._id))) {
        uniqueTheatres.push({
          ...show.theatre._doc,
          shows: shows.filter(showObj => showObj.theatre._id.equals(show.theatre._id))
        });
      }
    });
    res.send({
      success: true,
      message: 'All theatres fetched!',
      data: uniqueTheatres
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message
    });
  }
});


router.post('/get-show-by-id', async (req, res) => {
  try {
    const show = await Show.findById(req.body.showId).populate('movie').populate('theatre');
    res.send({
      success: true,
      message: 'Show fetched!',
      data: show
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;
