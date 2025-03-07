<template>
  <div class="max-w-screen-xl mx-auto p-4 sm:p-6">
    <h1 class="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">{{ rifa.titulo }}</h1>
    <div class="relative">
      <img :src="getImageUrl(rifa.imagenBanner)" alt="Banner" class="w-full h-48 sm:h-64 object-cover rounded-lg mb-4" />
      <img :src="getImageUrl(rifa.imagenPerfil)" alt="Perfil" class="absolute -bottom-4 left-4 w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-full border-2 border-accent-500" />
    </div>
    
    <div class="mt-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <p class="text-lg font-semibold">Fecha: {{ rifa.fecha }}</p>
        <p class="text-lg font-semibold">Precio por boleto: ${{ rifa.precio }} USD</p>
        <p class="text-lg font-semibold">Boletos disponibles: {{ rifa.boletosDisponibles }}</p>
      </div>
      <p class="text-lg font-semibold text-blue-600 mb-6">Números seleccionados: {{ selectedBoletos.length }}/20</p>

      <!-- Descripción de la Rifa -->
      <div class="mb-8 p-4 sm:p-6 bg-gray-50 rounded-xl border border-gray-200">
        <h3 class="text-xl font-semibold mb-4 text-gray-800">
          <i class="fas fa-info-circle mr-2"></i>Descripción del Premio
        </h3>
        <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ rifa.descripcion }}</p>
      </div>
    </div>

    <h2 class="text-xl sm:text-2xl font-semibold mb-4">Selecciona tus números</h2>
    
    <!-- Buscador de números -->
    <div class="mb-4 flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <input 
          v-model="numeroBuscado" 
          type="number" 
          min="1" 
          :max="rifa.boletosDisponibles" 
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
          placeholder="Buscar número específico..."
        />
      </div>
      <div class="flex gap-2">
        <button 
          @click="buscarNumero" 
          class="flex-1 sm:flex-none px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Buscar
        </button>
        <button 
          v-if="numeroBuscado"
          @click="limpiarBusqueda" 
          class="flex-1 sm:flex-none px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
        >
          Mostrar Todos
        </button>
      </div>
    </div>

    <div class="mb-4">
      <div class="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
        <div v-for="index in boletosEnPaginaActual" :key="index" 
             :class="['border p-2 sm:p-3 rounded-lg transition-transform duration-300 text-center', 
                      numerosOcupados.includes(index) ? 'bg-gray-400 text-white cursor-not-allowed' :
                      selectedBoletos.includes(index) ? 'bg-blue-600 text-white transform scale-105 shadow-lg' : 
                      selectedBoletos.length >= 20 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300 cursor-pointer',
                      index === numeroResaltado ? 'ring-4 ring-yellow-400' : '']" 
             @click="toggleBoleto(index)">
          <span class="text-sm sm:text-lg font-bold">
            <i :class="numerosOcupados.includes(index) ? 'fas fa-lock' : 'fas fa-ticket-alt'"></i> 
            {{ index }}
          </span>
        </div>
      </div>
    </div>

    <!-- Paginación -->
    <div class="flex justify-center gap-2 mb-4">
      <button 
        @click="cambiarPagina(paginaActual - 1)" 
        :disabled="paginaActual === 1"
        class="px-3 sm:px-4 py-2 rounded bg-blue-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed">
        Anterior
      </button>
      <span class="px-3 sm:px-4 py-2">Página {{ paginaActual }} de {{ totalPaginas }}</span>
      <button 
        @click="cambiarPagina(paginaActual + 1)" 
        :disabled="paginaActual === totalPaginas"
        class="px-3 sm:px-4 py-2 rounded bg-blue-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed">
        Siguiente
      </button>
    </div>

    <div class="flex flex-col sm:flex-row gap-4 mb-6">
      <button @click="seleccionarAleatorio" 
              :disabled="selectedBoletos.length >= 20"
              class="w-full sm:w-auto bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed">
        Elegir a la Suerte
      </button>

      <div class="flex-1 flex gap-4">
        <input v-model="cantidadBoletos" 
               type="number" 
               min="1" 
               :max="20" 
               class="flex-1 border p-2 rounded" 
               placeholder="Cantidad de números (máximo 20)" />
        
        <router-link 
          :to="{ 
            name: 'participar', 
            params: { id: rifa.id },
            query: { numeros: selectedBoletos.join(',') }
          }" 
          class="w-full sm:w-auto bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-center"
          :class="{ 'opacity-50 cursor-not-allowed': selectedBoletos.length === 0 }"
          :disabled="selectedBoletos.length === 0"
        >
          Comprar Boletos
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { API_URL, getImageUrl } from '../config';

const route = useRoute();
const rifa = ref({});
const cantidadBoletos = ref(1);
const selectedBoletos = ref([]);
const paginaActual = ref(1);
const boletosPorPagina = 100;
const numerosOcupados = ref([]);
const numeroBuscado = ref('');
const numeroResaltado = ref(null);

// Computed properties para la paginación
const totalPaginas = computed(() => Math.ceil(rifa.value.boletosDisponibles / boletosPorPagina));
const boletosEnPaginaActual = computed(() => {
  // Si hay un número buscado, solo mostrar ese número
  if (numeroBuscado.value) {
    const numero = parseInt(numeroBuscado.value);
    if (numero >= 1 && numero <= rifa.value.boletosDisponibles) {
      return [numero];
    }
  }
  
  // Si no hay búsqueda, mostrar la página normal
  const inicio = (paginaActual.value - 1) * boletosPorPagina + 1;
  const fin = Math.min(inicio + boletosPorPagina - 1, rifa.value.boletosDisponibles);
  return Array.from({ length: fin - inicio + 1 }, (_, i) => inicio + i);
});

// Cargar los detalles de la rifa y números ocupados desde el backend
const cargarRifa = async () => {
  try {
    const [rifaResponse, numerosResponse] = await Promise.all([
      axios.get(`${API_URL}/rifas/${route.params.id}`),
      axios.get(`${API_URL}/rifas/${route.params.id}/numeros-disponibles`)
    ]);
    rifa.value = rifaResponse.data;
    numerosOcupados.value = numerosResponse.data.numerosOcupados;
  } catch (error) {
    console.error('Error al cargar la rifa:', error);
  }
};

// Cargar números ocupados
const cargarNumerosOcupados = async () => {
  try {
    const response = await axios.get(`${API_URL}/rifas/${route.params.id}/numeros-disponibles`);
    numerosOcupados.value = response.data.numerosOcupados;
  } catch (error) {
    console.error('Error al cargar números ocupados:', error);
  }
};

const toggleBoleto = (numero) => {
  // Si el número está ocupado, no permitir la selección
  if (numerosOcupados.value.includes(numero)) {
    return;
  }

  const index = selectedBoletos.value.indexOf(numero);
  if (index === -1) {
    // Si no está seleccionado y no hemos llegado al límite de 20, lo agregamos
    if (selectedBoletos.value.length < 20) {
      selectedBoletos.value.push(numero);
      selectedBoletos.value.sort((a, b) => a - b);
    } else {
      alert('Has alcanzado el límite máximo de 20 boletos');
    }
  } else {
    // Si ya está seleccionado, lo removemos
    selectedBoletos.value.splice(index, 1);
  }
};

const seleccionarAleatorio = () => {
  if (selectedBoletos.value.length < 20) {
    const numerosDisponibles = Array.from(
      { length: rifa.value.boletosDisponibles }, 
      (_, i) => i + 1
    ).filter(num => !numerosOcupados.value.includes(num) && !selectedBoletos.value.includes(num));

    if (numerosDisponibles.length > 0) {
      const randomIndex = Math.floor(Math.random() * numerosDisponibles.length);
      const randomBoleto = numerosDisponibles[randomIndex];
      selectedBoletos.value.push(randomBoleto);
      selectedBoletos.value.sort((a, b) => a - b); // Ordenar números
    } else {
      alert('No hay números disponibles para selección aleatoria');
    }
  }
};

const cambiarPagina = (nuevaPagina) => {
  if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas.value) {
    paginaActual.value = nuevaPagina;
  }
};

// Función para buscar un número específico
const buscarNumero = () => {
  if (!numeroBuscado.value) {
    numeroResaltado.value = null;
    return;
  }
  
  const numero = parseInt(numeroBuscado.value);
  if (numero < 1 || numero > rifa.value.boletosDisponibles) {
    alert('Número fuera del rango disponible');
    return;
  }

  // Resaltar el número buscado permanentemente
  numeroResaltado.value = numero;
};

// Función para limpiar la búsqueda
const limpiarBusqueda = () => {
  numeroBuscado.value = '';
  numeroResaltado.value = null;
};

onMounted(async () => {
  await Promise.all([
    cargarRifa(),
    cargarNumerosOcupados()
  ]);
});
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 0.5rem;
}

.border {
  border: 2px solid #e5e7eb;
}

.bg-gray-200 {
  background-color: #e5e7eb;
}

.bg-blue-600 {
  background-color: #3b82f6;
}

.text-white {
  color: #ffffff;
}

.text-lg {
  font-size: 1.125rem;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(5, 1fr);
  }
}
</style> 