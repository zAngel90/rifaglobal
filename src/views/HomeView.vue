<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { API_URL, getImageUrl } from '../config'

const rifasDisponibles = ref([])

// Cargar rifas desde el backend
const cargarRifas = async () => {
  try {
    const response = await axios.get(`${API_URL}/rifas`)
    rifasDisponibles.value = response.data
  } catch (error) {
    console.error('Error al cargar las rifas:', error)
  }
}

onMounted(() => {
  cargarRifas()
})
</script>

<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="relative min-h-screen pt-20 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white">
      <div class="max-w-screen-xl mx-auto px-4 sm:px-6 relative">
        <!-- Contenido Principal -->
        <div class="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <!-- Texto y CTA -->
          <div class="lg:col-span-6 relative z-10">
            <div class="space-y-6 lg:space-y-8">
              <div class="inline-flex items-center space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-accent-500/10 rounded-full border border-accent-500/20">
                <span class="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></span>
                <span class="text-accent-600 text-xs sm:text-sm">Próximo sorteo en vivo</span>
              </div>
              
              <h1 class="text-4xl sm:text-5xl lg:text-7xl font-black">
                <span class="text-slate-900">Gana</span>
                <div class="relative inline-block">
                  <span class="relative z-10 bg-gradient-to-r from-accent-500 to-accent-600 text-transparent bg-clip-text">
                    Premios
                  </span>
                  <div class="absolute -inset-1 bg-accent-500/20 blur-xl"></div>
                </div>
                <span class="text-slate-900">Increíbles</span>
              </h1>

              <p class="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl">
                Participa en nuestras rifas exclusivas y llévate premios extraordinarios. 
                <span class="font-medium text-accent-600">Desde $5 USD.</span>
              </p>

              <div class="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <button class="group relative px-6 py-3 sm:px-8 sm:py-4 bg-accent-600 rounded-xl text-white overflow-hidden w-full sm:w-auto">
                  <span class="relative z-10 flex items-center justify-center">
                    Ver Rifas Activas
                    <svg class="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
                  </span>
                  <div class="absolute inset-0 bg-gradient-to-r from-accent-500 to-accent-600 transform translate-y-full transition-transform group-hover:translate-y-0"></div>
                </button>
                
                <button class="group px-6 py-3 sm:px-8 sm:py-4 bg-slate-100 rounded-xl text-slate-700 border border-slate-200 hover:bg-slate-200 transition-all duration-300 w-full sm:w-auto">
                  <span class="flex items-center justify-center">
                    ¿Cómo Funciona?
                    <svg class="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </span>
                </button>
              </div>

              <!-- Enlaces Sociales -->
              <div class="flex flex-col gap-4 mt-6 sm:mt-8">
                <h3 class="text-lg font-bold text-slate-900">SÍGUENOS</h3>
                <div class="flex flex-wrap gap-3 sm:gap-4">
                  <a href="https://whatsapp.com/channel/0029Vb2HPR0BfxoAkITP9M1v" 
                     target="_blank"
                     class="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-xl hover:bg-emerald-500/20 transition-all duration-300">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <span>Canal WhatsApp</span>
                  </a>
                  <a href="https://www.instagram.com/turifaglobal?igsh=MXVnb3BxZWJ2bWg1cg==" 
                     target="_blank"
                     class="flex items-center gap-2 px-4 py-2 bg-pink-500/10 text-pink-600 rounded-xl hover:bg-pink-500/20 transition-all duration-300">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                    </svg>
                    <span>Instagram</span>
                  </a>
                  <a href="https://t.me/+m40j7OUnTZhiMzcx" 
                     target="_blank"
                     class="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-600 rounded-xl hover:bg-blue-500/20 transition-all duration-300">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                    <span>Canal de Telegram</span>
                  </a>
                </div>
              </div>

              <!-- Estadísticas -->
              <div class="grid grid-cols-3 gap-4 sm:gap-8 pt-6 sm:pt-8 border-t border-slate-200">
                <div>
                  <p class="text-3xl font-bold text-slate-900">500+</p>
                  <p class="text-sm text-slate-600">Ganadores</p>
                </div>
                <div>
                  <p class="text-3xl font-bold text-slate-900">98%</p>
                  <p class="text-sm text-slate-600">Satisfacción</p>
                </div>
                <div>
                  <p class="text-3xl font-bold text-slate-900">24/7</p>
                  <p class="text-sm text-slate-600">Soporte</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Tarjeta de Premio Destacado -->
          <div class="lg:col-span-6 relative" v-if="rifasDisponibles.length > 0">
            <div class="relative bg-white rounded-2xl border border-slate-200 p-8 shadow-xl hover:shadow-2xl transition-all duration-500">
              <div class="aspect-[16/9] rounded-xl overflow-hidden mb-8">
                <img :src="getImageUrl(rifasDisponibles[0].imagenPerfil)" :alt="rifasDisponibles[0].titulo" class="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700">
              </div>
              <div class="space-y-6">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="text-2xl font-bold text-slate-900">{{ rifasDisponibles[0].titulo }}</h3>
                    <p class="text-slate-600 mt-1">{{ rifasDisponibles[0].fecha }}</p>
                  </div>
                  <span class="px-4 py-1 bg-accent-500/10 text-accent-600 rounded-full text-sm font-medium">
                    {{ rifasDisponibles[0].boletosDisponibles }} boletos
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-slate-600">Precio por boleto</p>
                    <p class="text-3xl font-bold text-slate-900">${{ rifasDisponibles[0].precio }} <span class="text-sm text-slate-600">USD</span></p>
                  </div>
                  <router-link :to="{ name: 'rifaDetail', params: { id: rifasDisponibles[0].id } }" class="group relative px-6 py-3 bg-accent-600 rounded-xl text-white hover:bg-accent-500 transition-all duration-300">
                    Participar
                    <svg class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Sección de Rifas Disponibles -->
    <section class="py-16 sm:py-24 relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div class="max-w-screen-xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-12 sm:mb-20">
          <div class="inline-flex items-center space-x-2 px-4 py-2 bg-accent-500/10 rounded-full border border-accent-500/20 mb-4">
            <span class="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></span>
            <span class="text-accent-600 text-sm">Rifas Disponibles</span>
          </div>
          <h2 class="text-4xl lg:text-5xl font-bold mt-4 text-slate-900">Sorteos Activos</h2>
          <p class="mt-4 text-xl text-slate-600 max-w-2xl mx-auto">
            Explora nuestros sorteos activos y encuentra el premio de tus sueños
          </p>
        </div>

        <!-- Showcase 3D de Rifas -->
        <div class="relative">
          <!-- Carrusel 3D -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div v-for="(rifa, index) in rifasDisponibles" :key="rifa.id" 
                 class="group relative perspective">
              <!-- Tarjeta con efecto 3D -->
              <div class="relative transform-gpu transition-all duration-500 group-hover:scale-105 group-hover:rotate-y-12">
                <!-- Capa de fondo con efecto de profundidad -->
                <div class="absolute -inset-2 bg-gradient-to-r from-accent-500 to-accent-600 opacity-0 group-hover:opacity-10 blur-xl transition-all duration-500"></div>
                
                <!-- Contenedor principal -->
                <div class="relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500">
                  <!-- Imagen con efecto parallax -->
                  <div class="relative aspect-[16/9] overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                    <img :src="getImageUrl(rifa.imagenPerfil)" :alt="rifa.titulo" class="w-full h-full object-cover transform group-hover:scale-110 transition-all duration-700">
                    <!-- Overlay con información flotante -->
                    <div class="absolute bottom-4 left-4 right-4 z-20">
                      <div class="flex items-end justify-between">
                        <div>
                          <p class="text-sm text-accent-200">Disponible hasta</p>
                          <p class="text-white font-medium">{{ rifa.fecha }}</p>
                        </div>
                        <div class="text-right">
                          <p class="text-sm text-accent-200">Boletos restantes</p>
                          <p class="text-white font-medium">{{ rifa.boletosDisponibles }}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Contenido con efecto de elevación -->
                  <div class="relative p-6">
                    <!-- Título con efecto de brillo -->
                    <div class="relative mb-4">
                      <h3 class="text-2xl font-bold text-slate-900 group-hover:text-accent-600 transition-colors">
                        {{ rifa.titulo }}
                      </h3>
                    </div>

                    <!-- Precio con diseño destacado -->
                    <div class="flex items-center justify-between mb-6">
                      <div class="relative">
                        <p class="text-sm text-slate-600">Precio por boleto</p>
                        <div class="flex items-baseline">
                          <span class="text-3xl font-bold text-slate-900">${{ rifa.precio }}</span>
                          <span class="ml-1 text-sm text-slate-600">USD</span>
                        </div>
                      </div>
                      <!-- Badge de estado -->
                      <div class="px-3 py-1 bg-accent-500/10 text-accent-600 rounded-full text-sm font-medium">
                        Activo
                      </div>
                    </div>

                    <!-- Botones con efectos -->
                    <div class="flex gap-4">
                      <router-link :to="{ name: 'rifaDetail', params: { id: rifa.id } }" class="flex-1 group relative px-6 py-3 bg-accent-600 rounded-xl text-white overflow-hidden hover:bg-accent-500 transition-all duration-300">
                        <span class="relative z-10 flex items-center justify-center">
                          Participar
                          <svg class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                          </svg>
                        </span>
                      </router-link>
                      <button class="relative p-3 bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-200 transition-all duration-300 group">
                        <svg class="w-5 h-5 transform group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Indicador de popularidad -->
                  <div class="absolute top-4 right-4 z-30">
                    <div class="flex items-center space-x-1 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full">
                      <span class="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></span>
                      <span class="text-xs text-white">Popular</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
  background-color: white;
}

.perspective {
  perspective: 2000px;
}
</style>
