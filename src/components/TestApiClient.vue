<template>
    <div>
      <h1>API Client Test</h1>
      <p v-if="loading">Cargando...</p>
      <p v-if="error" style="color: red;">Error: {{ error }}</p>
      <div v-if="data">
        <h2>Respuesta:</h2>
        <pre>{{ data }}</pre>
      </div>
    </div>
  </template>
  
  <script>
  import apiClient from '../apiClient';
  
  export default {
    data() {
      return {
        loading: false,
        error: null,
        data: null,
      };
    },
    async created() {
      this.loading = true;
      try {
        const response = await apiClient.get('/transactions');
        this.data = response.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
  };
  </script>
  