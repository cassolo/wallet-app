<template>
  <div class="dashboard-container">
    <h1>Dashboard</h1>
    <p>Bienvenido, tu ID es: <strong>{{ userId }}</strong></p>

    <button @click="$router.push('/transaction')">Nueva Transaccion</button>
    <button @click="$router.push('/log')">Ver Historial de Movimientos</button>
    <button @click="$router.push('/status')">Ver estado</button>

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
