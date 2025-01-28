  <template>
    <div class="historial-container">
      <h1>Historial de Movimientos</h1>
      <p v-if="loading">Cargando...</p>
      <div v-if="transacciones.length > 0">
        <table>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Fecha</th>
              <th>Acción</th>
              <th>Criptomoneda</th>
              <th>Cantidad</th>
              <th>Total (ARS)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="transaccion in transacciones" :key="transaccion._id">
              <td>{{ transaccion.user_id }}</td>
              <td>{{ transaccion.datetime }}</td>
              <td>{{ transaccion.action === 'purchase' ? 'Compra' : 'Venta' }}</td>
              <td>{{ transaccion.crypto_code.toUpperCase() }}</td>
              <td>{{ transaccion.crypto_amount }}</td>
              <td>{{ transaccion.money }}</td>
              <td>
                <button @click="editarTransaccion(transaccion._id)">Editar</button>
                <button @click="borrarTransaccion(transaccion._id)">Borrar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else>{{ error || 'No hay movimientos registrados.' }}</p>
    </div>
  </template>

<script>
import apiClient from '../apiClient';

export default {
  data() {
    return {
      transacciones: [],
      error: null,
      loading: true,
    };
  },


  methods: {
    async cargarTransacciones() {
      try {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
          this.error = 'No se encontró un usuario autenticado.';
          this.loading = false;
          return;
        }

        const response = await apiClient.get('/transactions');
        const todasLasTransacciones = response.data;


        this.transacciones = todasLasTransacciones.filter(
          (transaccion) => transaccion.user_id === userId
        );
      } catch (error) {
        console.error('Error al obtener las transacciones:', error);
        this.error = 'Hubo un problema al cargar los movimientos.';
      } finally {
        this.loading = false;
      }
    },
    editarTransaccion(id) {
      this.$router.push(`/transaction/${id}/edit`)
    },
    async borrarTransaccion(id) {
      if (!confirm('¿Estás seguro de que quieres borrar esta transacción?')) return;

      try {
        await apiClient.delete(`/transactions/${id}`);
        alert('Transacción eliminada con éxito.');
        this.cargarTransacciones();
      } catch (error) {
        console.error('Error al borrar la transacción:', error);
        alert('Hubo un problema al borrar la transacción.');
      }
    }
  },
  async created() {
    await this.cargarTransacciones();
  }
};
</script>

<style>
.historial-container {
  max-width: 800px;
  margin: 20px auto;
  text-align: left;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
}

th {
  background-color: #f4f4f4;
  font-weight: bold;
}

p {
  text-align: center;
  color: #666;
}
</style>
