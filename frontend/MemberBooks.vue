<template>
  <div>
    <h1>Borrowed Books for {{ memberName }}</h1>
    <ul>
      <li v-for="book in borrowedBooks" :key="book._id">
        {{ book.title }} by {{ book.author }}
      </li>
    </ul>
    <router-link to="/">Back to Catalog</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const memberId = route.params.id;
const memberName = ref('');
const borrowedBooks = ref([]);

const fetchBorrowedBooks = async () => {
  const res = await axios.get(`http://81.36.111.243:5000/api/member-borrowed-books/${memberId}`);
  borrowedBooks.value = res.data.books;
  memberName.value = res.data.memberName;
};

onMounted(fetchBorrowedBooks);
</script>
