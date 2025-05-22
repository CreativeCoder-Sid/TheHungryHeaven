const Booking = require('../models/Booking');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.checkAvailability = async (req, res) => {
  const { date, fromTime, toTime, guests } = req.body;

  try {
    const overlapping = await Booking.find({
      date,
      $or: [
        { fromTime: { $lt: toTime }, toTime: { $gt: fromTime } }
      ]
    });

    const availableTables = 20 - overlapping.length;
    if (availableTables > 0) {
      res.json({ available: true });
    } else {
      res.json({ available: false });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.bookTable = async (req, res) => {
  const { name, email, phone, date, fromTime, toTime, guests } = req.body;

  try {
    // Create new booking entry
    const newBooking = new Booking({
      name,
      email,
      phone,
      date,
      fromTime,
      toTime,
      guests,
      userId: req.user.id,
      tableNumber: Math.floor(Math.random() * 20) + 1,
      bookingId: Math.floor(100000 + Math.random() * 900000).toString(),
    });

    await newBooking.save();

    // Set up PDF path (at project root /pdfs)
    const pdfDirectory = path.join(__dirname, '..', 'pdfs');
    if (!fs.existsSync(pdfDirectory)) {
      fs.mkdirSync(pdfDirectory, { recursive: true });
    }

    const filePath = path.join(pdfDirectory, `booking-${newBooking.bookingId}.pdf`);
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(filePath);

    doc.pipe(writeStream);

    // PDF content
    doc.fontSize(20).text('Booking Confirmation', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Booking ID: ${newBooking.bookingId}`);
    doc.text(`Name: ${name}`);
    doc.text(`Email: ${email}`);
    doc.text(`Phone: ${phone}`);
    doc.text(`Date: ${date}`);
    doc.text(`From: ${fromTime}`);
    doc.text(`To: ${toTime}`);
    doc.text(`Guests: ${guests}`);
    doc.text(`Table Number: ${newBooking.tableNumber}`);
    doc.fontSize(25).text('Thank you',{align:'center'});
    doc.end();

    // Wait until PDF is fully written before responding
    writeStream.on('finish', () => {
      res.json({
        message: 'Booking successful',
        bookingId: newBooking.bookingId,
        tableNumber: newBooking.tableNumber,
        pdfUrl: `/pdfs/booking-${newBooking.bookingId}.pdf`,
      });
    });

    // Handle PDF generation error
    writeStream.on('error', (err) => {
      console.error('Error writing PDF:', err);
      res.status(500).json({ error: 'Failed to generate PDF' });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Booking failed' });
  }
};
