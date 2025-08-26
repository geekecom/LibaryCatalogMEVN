<template>
  <div style="max-width: 600px; margin: 0 auto;">
    <h1>Library Members</h1>
    <table border="1" cellpadding="8" cellspacing="0" style="width:100%; border-collapse:collapse;">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Borrowed Books</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="member in members" :key="member._id">
          <td>{{ member.name }}</td>
          <td>{{ member.email }}</td>
          <td>
            <router-link :to="`/member/${member._id}`">View Borrowed Books</router-link>
          </td>
        </tr>
      </tbody>
    </table>
    <div style="margin-top: 20px;">
      <router-link to="/">&larr; Back to Catalog</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const members = ref([]);

const fetchMembers = async () => {
  const res = await axios.get('http://localhost:5000/api/members');
  members.value = res.data;
};

onMounted(fetchMembers);
</script>
