<template>
    <div class="login-container">
      <h1>Iniciar sesión</h1>
      <form @submit.prevent="handleLogin">
        <label for="userId">Ingrese su ID:</label>
        <input
          type="text"
          id="userId"
          v-model="userId"
          placeholder="ID único"
          required
        />
        <button type="submit">Ingresar</button>
      </form>
      <p v-if="error" style="color: red;">{{ error }}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LoginView',
    data() {
      return {
        userId: '',
        error: null,
      };
    },
    methods: {
      handleLogin() {
        if (this.userId.trim() === '') {
          this.error = 'El ID no puede estar vacío.';
          return;
        }
        
        localStorage.setItem('user_id', this.userId.trim());
        this.$router.push('/dashboard');
        
      },
    },
  };
  </script>
  
  <style>
  .login-container {
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
  }
  input {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  button {
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  button:hover {
    background-color: #0056b3;
  }
  </style>
  