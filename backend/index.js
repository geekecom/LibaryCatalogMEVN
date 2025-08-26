import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const expressPort = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost:27017/library', {});


const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  available: { type: Boolean, default: true },
  borrowedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', default: null }
});
const Book = mongoose.model('Book', bookSchema);

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }
});
const Member = mongoose.model('Member', memberSchema);
// Create a new member
app.post('/api/members', async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  try {
    const member = new Member({ name, email });
    await member.save();
    res.status(201).json(member);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
});

// Get all books, populate borrowedBy
app.get('/api/books', async (req, res) => {
  const books = await Book.find().populate('borrowedBy', 'name email');
  res.json(books);
});

// Borrow a book (requires memberId)
app.post('/api/borrow/:id', async (req, res) => {
  const { memberId } = req.body;
  if (!memberId) {
    return res.status(400).json({ error: 'Member ID is required to borrow a book' });
  }
  const member = await Member.findById(memberId);
  if (!member) {
    return res.status(404).json({ error: 'Member not found' });
  }
  const book = await Book.findByIdAndUpdate(
    req.params.id,
    { available: false, borrowedBy: memberId },
    { new: true }
  );
  res.json(book);
});

app.post('/api/return/:id', async (req, res) => {
  const book = await Book.findByIdAndUpdate(
    req.params.id,
    { available: true, borrowedBy: null },
    { new: true }
  );
  res.json(book);
});

// Get all members
app.get('/api/members', async (req, res) => {
  const members = await Member.find();
  res.json(members);
});

// Insert sample books if collection is empty
async function insertSampleBooks() {
  const count = await Book.countDocuments();
  if (count === 0) {
    await Book.insertMany([
      { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
      { title: 'To Kill a Mockingbird', author: 'Harper Lee' },
      { title: '1984', author: 'George Orwell' },
      { title: 'Pride and Prejudice', author: 'Jane Austen' }
    ]);
    console.log('Sample books inserted');
  }
}

// Insert sample members if collection is empty
async function insertSampleMembers() {
  const count = await Member.countDocuments();
  if (count === 0) {
    await Member.insertMany([
      { name: 'Lorenzo L', email: 'lorenzolerate@gmail.com' },
      { name: 'Pepi L', email: 'pepilerateramirez@outlook.com' }
    ]);
    console.log('Sample books inserted');
  }
}
app.listen(expressPort, async () => {
  await insertSampleBooks();
  await insertSampleMembers();
  console.log('Backend running on port', expressPort);
});

// Create a new book
app.post('/api/books', async (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).json({ error: 'Title and author are required' });
  }
  const book = new Book({ title, author });
  await book.save();
  res.status(201).json(book);
});

// Get books borrowed by a specific member
app.get('/api/member-borrowed-books/:id', async (req, res) => {
  const member = await Member.findById(req.params.id);
  if (!member) {
    return res.status(404).json({ error: 'Member not found' });
  }
  const books = await Book.find({ borrowedBy: member._id });
  res.json({ memberName: member.name, books });
});
// Get books borrowed by a specific member
app.get('/api/member-borrowed-books/:id', async (req, res) => {
  const member = await Member.findById(req.params.id);
  if (!member) {
    return res.status(404).json({ error: 'Member not found' });
  }
  const books = await Book.find({ borrowedBy: member._id });
  res.json({ memberName: member.name, books });
});