<template>
    <div class="estado-actual-container">
        <h1>Análisis del Estado Actual</h1>
        <table v-if="analisis.length > 0">
            <thead>
                <tr>
                    <th>Criptomoneda</th>
                    <th>Cantidad</th>
                    <th>Valor en ARS</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="crypto in analisis" :key="crypto.name">
                    <td>{{ crypto.name.toUpperCase() }}</td>
                    <td>{{ crypto.amount }}</td>
                    <td>$ {{ crypto.value.toFixed(2) }}</td>
                </tr>
            </tbody>
        </table>
        <p v-else>Cargando datos...</p>
        <h2 v-if="analisis.length > 0">Total en ARS: $ {{ total.toFixed(2) }}</h2>
    </div>
</template>

<script>
import apiClient from '../apiClient';
import axios from 'axios';

export default {
    data() {
        return {
            analisis: [], 
            total: 0, 
        };
    },
    async created() {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
            alert('Usuario no autenticado.');
            this.$router.push('/login');
            return;
        }

        try {
            const response = await apiClient.get(`/transactions?q={"user_id": "${userId}"}`);
            const transacciones = response.data;

            const cantidades = {};
            transacciones.forEach(({ crypto_code, crypto_amount, action }) => {
                const code = crypto_code.toLowerCase();
                const amount = parseFloat(crypto_amount);
                if (!cantidades[code]) cantidades[code] = 0;
                cantidades[code] += action === 'purchase' ? amount : -amount;
            });

            const criptosConCantidad = Object.entries(cantidades).filter(([, amount]) => amount > 0);

            const analisisPromises = criptosConCantidad.map(async ([name, amount]) => {
                const precioResponse = await axios.get(`https://criptoya.com/api/satoshitango/${name}/ars`);
                const precio = parseFloat(precioResponse.data.totalBid);
                return {
                    name,
                    amount,
                    value: amount * precio,
                };
            });

            this.analisis = await Promise.all(analisisPromises);

            this.total = this.analisis.reduce((sum, crypto) => sum + crypto.value, 0);
        } catch (error) {
            console.error('Error al obtener el estado actual:', error);
            alert('Hubo un problema al cargar el estado actual.');
        }
    },
};
</script>

<style>
.estado-actual-container {
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

h2 {
    text-align: right;
    margin-top: 20px;
    color: #333;
}
</style>