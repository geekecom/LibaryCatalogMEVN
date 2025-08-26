<template>
  <div>
    <h1>Library Catalog</h1>
    <form @submit.prevent="createBook" style="margin-bottom: 20px;">
      <input v-model="newTitle" placeholder="Title" required />
      <input v-model="newAuthor" placeholder="Author" required />
      <button type="submit">Add Book</button>
    </form>
    <form @submit.prevent="createMember" style="margin-bottom: 20px;">
      <input v-model="newMemberName" placeholder="Member Name" required />
      <input v-model="newMemberEmail" placeholder="Member Email" required type="email" />
      <button type="submit">Add Member</button>
      <span v-if="memberMsg" :style="{ color: memberMsgColor }">{{ memberMsg }}</span>
    </form>
    <div style="margin-bottom: 20px;">
      <button @click="router.push('/members')" style="padding: 8px 16px; font-weight: bold; cursor: pointer;">View Members List</button>
    </div>

    <div style="margin-bottom: 16px;">
      <label for="searchBooks">Search Books:</label>
      <input id="searchBooks" v-model="searchTerm" placeholder="Type title or author..." style="margin-right: 16px;" />
      <br><br>
      <label for="memberSelect">Select Member to Borrow:</label>
      <select id="memberSelect" v-model="selectedMemberId">
        <option value="">-- Select Member --</option>
        <option v-for="member in members" :key="member._id" :value="member._id">
          {{ member.name }} ({{ member.email }})
        </option>
      </select>
      <span v-if="borrowMsg" :style="{ color: borrowMsgColor, marginLeft: '10px' }">{{ borrowMsg }}</span>
    </div>
    <table border="1" cellpadding="8" cellspacing="0" style="width:100%; border-collapse:collapse;">
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Status</th>
          <th>Borrowed By</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in filteredBooks" :key="book._id">
          <td>{{ book.title }}</td>
          <td>{{ book.author }}</td>
          <td>
            <span v-if="book.available" style="color:green;">Available</span>
            <span v-else style="color:red;">Borrowed</span>
          </td>
          <td>
            <span v-if="book.borrowedBy">{{ book.borrowedBy.name }} ({{ book.borrowedBy.email }})</span>
          </td>
          <td style="text-align: center;">
            <button v-if="book.available" @click="borrowBook(book._id)" style="width: 90%;">Borrow</button>
            <button v-else @click="returnBook(book._id)" style="width: 90%">Return</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

const books = ref([]);
const searchTerm = ref("");
const filteredBooks = computed(() => {
  if (!searchTerm.value.trim()) return books.value;
  const term = searchTerm.value.trim().toLowerCase();
  return books.value.filter(book =>
    book.title.toLowerCase().includes(term) ||
    book.author.toLowerCase().includes(term)
  );
});
const members = ref([]);
const selectedMemberId = ref("");
const newTitle = ref("");
const newAuthor = ref("");
const newMemberName = ref("");
const newMemberEmail = ref("");
const memberMsg = ref("");
const memberMsgColor = ref("green");
const borrowMsg = ref("");
const borrowMsgColor = ref("red");

const fetchBooks = async () => {
  const res = await axios.get('http://81.36.111.243:5000/api/books');
  books.value = res.data;
};

const fetchMembers = async () => {
  const res = await axios.get('http://81.36.111.243:5000/api/members');
  members.value = res.data;
};

const createBook = async () => {
  if (!newTitle.value.trim() || !newAuthor.value.trim()) return;
  await axios.post('http://81.36.111.243:5000/api/books', {
    title: newTitle.value,
    author: newAuthor.value
  });
  newTitle.value = "";
  newAuthor.value = "";
  fetchBooks();
};

const createMember = async () => {
  if (!newMemberName.value.trim() || !newMemberEmail.value.trim()) return;
  try {
    await axios.post('http://81.36.111.243:5000/api/members', {
      name: newMemberName.value,
      email: newMemberEmail.value
    });
    memberMsg.value = 'Member created!';
    memberMsgColor.value = 'green';
    newMemberName.value = "";
    newMemberEmail.value = "";
    fetchMembers();
  } catch (err) {
    memberMsg.value = err.response?.data?.error || 'Error creating member';
    memberMsgColor.value = 'red';
  }
  setTimeout(() => { memberMsg.value = ""; }, 3000);
};

const borrowBook = async (id) => {
  if (!selectedMemberId.value) {
    borrowMsg.value = 'Please select a member to borrow a book.';
    borrowMsgColor.value = 'red';
    setTimeout(() => { borrowMsg.value = ""; }, 2000);
    return;
  }
  await axios.post(`http://81.36.111.243:5000/api/borrow/${id}`, {
    memberId: selectedMemberId.value
  });
  fetchBooks();
  borrowMsg.value = '';
};

const returnBook = async (id) => {
  await axios.post(`http://81.36.111.243:5000/api/return/${id}`);
  fetchBooks();
};

onMounted(() => {
  fetchBooks();
  fetchMembers();
});
</script>
