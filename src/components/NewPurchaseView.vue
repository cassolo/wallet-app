<template>
    <div class="nueva-compra-container">
      <h1>Registrar una Nueva Compra</h1>
      <form @submit.prevent="registrarCompra">
        <label for="crypto">Criptomoneda:</label>
        <select v-model="crypto" id="crypto" @change="calcularPrecio" required>
          <option disabled value="">Seleccione una opción</option>
          <option v-for="moneda in monedas" :key="moneda" :value="moneda">
            {{ moneda }}
          </option>
        </select>
  
        <label for="cantidad">Cantidad:</label>
        <input
          type="number"
          id="cantidad"
          v-model.number="cantidad"
          min="0.0001"
          step="0.0001"
          placeholder="0.00"
          @input="calcularPrecio"
          required
        />
  
        <p>Total a pagar (ARS): {{ total ? `$${total}` : '-' }}</p>
  
        <button :disabled="!crypto || cantidad <= 0 || !total" type="submit">
          Registrar Compra
        </button>
      </form>
    </div>
  </template>
  
  <script>
import apiClient from '../apiClient';
import axios from 'axios';

export default {
  data() {
    return {
      crypto: '',
      cantidad: null,
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
  methods: {
    async calcularPrecio() {
      if (!this.crypto || this.cantidad <= 0) {
        this.total = null;
        return;
      }

      try {
        const response = await axios.get(
          `https://criptoya.com/api/satoshitango/${this.crypto.toLowerCase()}/ars/1`
        );
        this.total = (response.data.totalAsk * this.cantidad).toFixed(2);
      } catch (error) {
        console.error('Error al obtener el precio total:', error);
        this.total = null;
      }
    },
    async registrarCompra() {
      if (this.cantidad <= 0 || this.total <= 0) {
        this.error = 'La cantidad y el total deben ser mayores a 0.';
        return;
      }

      const userId = localStorage.getItem('user_id');
      if (!userId) {
        this.error = 'El usuario no está autenticado.';
        this.$router.push('/login');
        return;
      }


      const fecha = new Intl.DateTimeFormat('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23', 
    }).format(new Date());

      const body = {
        user_id: userId,
        action: 'purchase',
        crypto_code: this.crypto.toLowerCase(),
        crypto_amount: this.cantidad.toString(),
        money: this.total.toString(),
        datetime: fecha,
      };

      try { 
        await apiClient.post('/transactions', body);
        alert('Compra registrada con éxito.');
        this.$router.push('/dashboard');
      } catch (error) {
        console.error('Error al registrar la compra:', error);
        this.error = 'Hubo un problema al registrar la compra.';
      }
    },
  },
};
</script>
  
  
  <style>
  .nueva-compra-container {
    max-width: 400px;
    margin: 20px auto;
    text-align: left;
  }
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  input, select, button {
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
  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  </style>
  