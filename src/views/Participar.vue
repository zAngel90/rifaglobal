<template>
  <div class="max-w-screen-xl mx-auto p-4 sm:p-6">
    <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <h1 class="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Completar Compra</h1>

      <!-- Resumen de la compra -->
      <div class="mb-6 sm:mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 class="text-lg sm:text-xl font-semibold mb-4">Resumen de tu compra</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-600">Rifa:</p>
            <p class="font-semibold">{{ rifa.titulo }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Números seleccionados:</p>
            <p class="font-semibold break-words">{{ numerosSeleccionados.join(', ') }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Precio por número:</p>
            <p class="font-semibold">${{ rifa.precio }} USD</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Total a pagar:</p>
            <p class="text-lg sm:text-xl font-bold text-accent-600">${{ totalPagar }} USD</p>
          </div>
        </div>
      </div>

      <!-- Formulario de datos personales -->
      <form @submit.prevent="enviarCompra" class="space-y-4 sm:space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Nombre completo</label>
            <input 
              v-model="formData.nombre" 
              type="text" 
              required
              class="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              placeholder="Ingresa tu nombre completo"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Correo electrónico</label>
            <input 
              v-model="formData.email" 
              type="email" 
              required
              class="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              placeholder="tu@email.com"
            >
          </div>
          <div class="sm:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Teléfono/WhatsApp</label>
            <input 
              v-model="formData.telefono" 
              type="tel" 
              required
              class="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              placeholder="+1234567890"
            >
          </div>
        </div>

        <!-- Instrucciones de pago -->
        <div class="mt-6 sm:mt-8 p-4 bg-accent-50 rounded-lg">
          <h3 class="text-base sm:text-lg font-semibold mb-4 text-accent-700">
            <i class="fas fa-info-circle mr-2"></i>Instrucciones de Pago
          </h3>
          <p class="text-sm sm:text-base text-accent-600 mb-4">
            Por favor, selecciona un método de pago y realiza la transferencia correspondiente:
          </p>
          
          <!-- Métodos de pago disponibles -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
            <div v-for="metodo in metodosPago" 
                 :key="metodo.id" 
                 @click="formData.metodo_pago = metodo.id"
                 :class="[
                   'p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all duration-200',
                   formData.metodo_pago === metodo.id 
                     ? 'border-accent-600 bg-accent-50' 
                     : 'border-gray-200 hover:border-accent-300'
                 ]"
            >
              <div class="flex items-center space-x-3">
                <img 
                  :src="getImageUrl(metodo.icono)" 
                  :alt="metodo.nombre"
                  class="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                />
                <div>
                  <h4 class="text-sm sm:text-base font-semibold">{{ metodo.nombre }}</h4>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Instrucciones del método de pago seleccionado -->
          <div v-if="metodoSeleccionado" class="mt-4 p-3 sm:p-4 bg-white rounded-lg border border-accent-200">
            <h4 class="text-sm sm:text-base font-semibold text-accent-700 mb-2">Instrucciones para {{ metodoSeleccionado.nombre }}</h4>
            <p class="text-sm sm:text-base text-gray-700 whitespace-pre-line">{{ metodoSeleccionado.descripcion }}</p>
          </div>
          
          <div v-if="metodosPago.length === 0" class="text-sm sm:text-base text-gray-600 text-center py-4">
            No hay métodos de pago disponibles en este momento.
          </div>
        </div>

        <!-- Subir comprobante -->
        <div class="mt-4 sm:mt-6">
          <label class="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Comprobante de pago</label>
          <div class="mt-1 flex justify-center px-4 sm:px-6 pt-4 sm:pt-5 pb-4 sm:pb-6 border-2 border-gray-300 border-dashed rounded-lg">
            <div class="space-y-1 text-center">
              <svg class="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div class="flex flex-col sm:flex-row items-center justify-center text-sm text-gray-600">
                <label for="comprobante" class="relative cursor-pointer bg-white rounded-md font-medium text-accent-600 hover:text-accent-500">
                  <span>Sube un archivo</span>
                  <input 
                    id="comprobante" 
                    name="comprobante" 
                    type="file" 
                    class="sr-only"
                    @change="handleComprobanteUpload"
                    accept="image/*,.pdf"
                    required
                  >
                </label>
                <p class="mt-2 sm:mt-0 sm:pl-1">o arrastra y suelta</p>
              </div>
              <p class="text-xs text-gray-500">PNG, JPG, PDF hasta 10MB</p>
            </div>
          </div>
          <div v-if="formData.comprobante" class="mt-2 text-xs sm:text-sm text-gray-600">
            Archivo seleccionado: {{ formData.comprobante.name }}
          </div>
        </div>

        <!-- Botón de envío -->
        <div class="mt-6 sm:mt-8">
          <button 
            type="submit"
            class="w-full bg-accent-600 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold hover:bg-accent-500 transition-colors duration-300"
            :disabled="enviando"
          >
            {{ enviando ? 'Procesando...' : 'Confirmar Compra' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { API_URL, getImageUrl } from '../config';

const route = useRoute();
const router = useRouter();
const rifa = ref({});
const enviando = ref(false);
const metodosPago = ref([]);

const formData = ref({
  nombre: '',
  email: '',
  telefono: '',
  comprobante: null,
  metodo_pago: ''
});

// Obtener números seleccionados de los query parameters
const numerosSeleccionados = computed(() => {
  return route.query.numeros ? route.query.numeros.split(',').map(Number) : [];
});

// Calcular total a pagar
const totalPagar = computed(() => {
  return (rifa.value.precio || 0) * numerosSeleccionados.value.length;
});

// Cargar datos de la rifa
const cargarRifa = async () => {
  try {
    const response = await axios.get(`${API_URL}/rifas/${route.params.id}`);
    rifa.value = response.data;
  } catch (error) {
    console.error('Error al cargar la rifa:', error);
  }
};

// Cargar métodos de pago
const cargarMetodosPago = async () => {
  try {
    const response = await axios.get(`${API_URL}/metodos-pago`);
    // Solo mostrar métodos de pago activos
    metodosPago.value = response.data.filter(metodo => metodo.activo);
  } catch (error) {
    console.error('Error al cargar métodos de pago:', error);
  }
};

// Manejar la carga del comprobante
const handleComprobanteUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    formData.value.comprobante = file;
  }
};

// Enviar la compra
const enviarCompra = async () => {
  // Validar que se haya seleccionado un método de pago
  if (!formData.value.metodo_pago) {
    alert('Por favor, selecciona un método de pago');
    return;
  }

  try {
    enviando.value = true;
    const formDataToSend = new FormData();
    formDataToSend.append('rifa_id', route.params.id);
    formDataToSend.append('nombre', formData.value.nombre);
    formDataToSend.append('email', formData.value.email);
    formDataToSend.append('telefono', formData.value.telefono);
    formDataToSend.append('numeros_seleccionados', JSON.stringify(numerosSeleccionados.value));
    formDataToSend.append('total_pagar', totalPagar.value);
    formDataToSend.append('comprobante', formData.value.comprobante);
    formDataToSend.append('metodo_pago_id', formData.value.metodo_pago);

    const response = await axios.post(`${API_URL}/compras`, formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    alert('¡Compra registrada exitosamente! Te contactaremos pronto para confirmar tu participación.');
    router.push('/');
  } catch (error) {
    console.error('Error al procesar la compra:', error);
    alert('Hubo un error al procesar tu compra. Por favor, intenta nuevamente.');
  } finally {
    enviando.value = false;
  }
};

// Computed para obtener el método de pago seleccionado
const metodoSeleccionado = computed(() => {
  return metodosPago.value.find(m => m.id === formData.value.metodo_pago);
});

onMounted(() => {
  cargarRifa();
  cargarMetodosPago();
});
</script>

<style scoped>
.bg-accent-50 {
  background-color: #f0f9ff;
}

.text-accent-600 {
  color: #2563eb;
}

.text-accent-700 {
  color: #1d4ed8;
}

.bg-accent-600 {
  background-color: #2563eb;
}

.hover\:bg-accent-500:hover {
  background-color: #3b82f6;
}
</style> 