<template>
  <div class="editar-transaccion-container">
    <h1>Editar Transacción</h1>
    <form v-if="transaccion" @submit.prevent="guardarCambios">
      <label for="action">Acción:</label>
      <select v-model="transaccion.action" id="action" @change="calcularTotal" required>
        <option value="purchase">Compra</option>
        <option value="sale">Venta</option>
      </select>

      <label for="crypto">Criptomoneda:</label>
      <select v-model="transaccion.crypto_code" id="crypto" @change="calcularTotal" required>
        <option disabled value="">Seleccione una opción</option>
        <option v-for="moneda in monedas" :key="moneda" :value="moneda">
          {{ moneda.toUpperCase() }}
        </option>
      </select>

      <label for="cantidad">Cantidad:</label>
      <input type="number" id="cantidad" v-model.number="transaccion.crypto_amount" min="0.0001" step="0.0001"
        @input="calcularTotal" required />

      <p v-if="transaccion.action === 'purchase'">Total a pagar (ARS): {{ total ? `$${total}` : '-' }}</p>
      <p v-if="transaccion.action === 'sale'">Dinero cobrado (ARS): {{ total ? `$${total}` : '-' }}</p>

      <button type="submit">Guardar Cambios</button>
      <button type="button" @click="$router.push('/log')">Cancelar</button>
    </form>
    <p v-else>Cargando transacción...</p>
    <p v-if="error" style="color: red;">{{ error }}</p>
  </div>
</template>

<script>
import apiClient from '../apiClient';
import axios from 'axios';

export default {
  data() {
    return {
      transaccion: null,
      transaccionOriginal: null,
      total: null,
      error: null,
      monedas: [
        'BTC', 'ETH', 'USDT', 'USDC', 'DAI', 'UXD', 'USDP', 'WLD',
        'BNB', 'SOL', 'XRP', 'ADA', 'AVAX', 'DOGE', 'TRX', 'LINK',
        'DOT', 'MATIC', 'SHIB', 'LTC', 'BCH', 'EOS', 'XLM', 'FTM',
        'AAVE', 'UNI', 'ALGO', 'BAT', 'PAXG', 'CAKE', 'AXS', 'SLP',
        'MANA', 'SAND', 'CHZ'
      ],
    };
  },
  async created() {
    const id = this.$route.params.id;
    try {
      const response = await apiClient.get(`/transactions/${id}`);

      if (!response.data) {
        throw new Error('No se encontró la transacción.');
      }

      this.transaccion = response.data;
      this.transaccionOriginal = { ...response.data };

      const cryptoCode = this.transaccion.crypto_code ? this.transaccion.crypto_code.toUpperCase() : '';
      this.transaccion.crypto_code = this.monedas.includes(cryptoCode) ? cryptoCode : '';

      await this.calcularTotal();
    } catch (error) {
      console.error('Error al cargar la transacción:', error);
      this.error = 'No se pudo cargar la transacción.';
    }
  },
  methods: {
    async calcularTotal() {
      if (!this.transaccion.crypto_code || this.transaccion.crypto_amount <= 0) {
        this.total = null;
        return;
      }

      try {
        const response = await axios.get(
          `https://criptoya.com/api/satoshitango/${this.transaccion.crypto_code.toLowerCase()}/ars/1`
        );

        if (this.transaccion.action === 'purchase') {
          this.total = (response.data.totalAsk * this.transaccion.crypto_amount).toFixed(2);
        } else if (this.transaccion.action === 'sale') {
          this.total = (response.data.totalBid * this.transaccion.crypto_amount).toFixed(2);
        }

        this.transaccion.money = this.total;
      } catch (error) {
        console.error('Error al obtener el precio:', error);
        this.total = null;
      }
    },
    async guardarCambios() {
      const id = this.$route.params.id;

      const cambios = {};
      for (const key in this.transaccion) {
        if (this.transaccion[key] !== this.transaccionOriginal[key]) {
          cambios[key] = this.transaccion[key];
        }
      }

      if (Object.keys(cambios).length === 0) {
        alert('No se detectaron cambios para guardar.');
        return;
      }

      try {
        await apiClient.patch(`/transactions/${id}`, cambios);
        alert('Transacción actualizada con éxito.');
        this.$router.push('/log');
      } catch (error) {
        console.error('Error al guardar los cambios:', error);
        alert('Hubo un problema al guardar los cambios.');
      }
    },
  },
};
</script>

<style>
.editar-transaccion-container {
  max-width: 600px;
  margin: 20px auto;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input,
select,
button {
  width: 100%;
  margin-bottom: 15px;
  padding: 10px;
  font-size: 1em;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

button[type="button"] {
  background-color: #6c757d;
}

button[type="button"]:hover {
  background-color: #5a6268;
}
</style>
