<template>
    <div class="dashboard-container">
      <h1>Dashboard</h1>
      <p>Bienvenido, tu ID es: <strong>{{ userId }}</strong></p>
      <button @click="$router.push('/new-purchase')">Nueva Compra</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        userId: '',
      };
    },
    created() {
      this.userId = localStorage.getItem('user_id') || '';
      if (!this.userId) {
        this.$router.push('/login');
      }
    },
  };
  </script>
  
  <style>
  .dashboard-container {
    text-align: center;
    padding: 20px;
  }
  </style>
  