<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import './assets/main.css'
import HomeView from './views/HomeView.vue'
import { API_URL, getImageUrl } from './config'
import axios from 'axios'

const mobileMenu = ref(false)
const isScrolled = ref(false)

// Función para verificar autenticación
const isAuthenticated = () => {
  const auth = localStorage.getItem('adminAuth')
  if (!auth) return false
  
  try {
    const { isAuthenticated, timestamp } = JSON.parse(atob(auth))
    const now = new Date().getTime()
    const hours24 = 24 * 60 * 60 * 1000
    return isAuthenticated && (now - timestamp) < hours24
  } catch {
    return false
  }
}

// Función para manejar el scroll
const handleScroll = () => {
  isScrolled.value = window.scrollY > 30
}

// Agregar y remover event listener
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const rifas = ref([
  {
    id: 1,
    titulo: 'Super Premio Deportivo 2024',
    fecha: '15 Marzo, 2024',
    imagen: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=500',
    precio: 50,
    boletosDisponibles: 100
  },
  {
    id: 2,
    titulo: 'Gran Sorteo Tecnológico',
    fecha: '20 Marzo, 2024',
    imagen: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=500',
    precio: 75,
    boletosDisponibles: 50
  },
  {
    id: 3,
    titulo: 'Rifa Especial de Viajes',
    fecha: '25 Marzo, 2024',
    imagen: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=500',
    precio: 100,
    boletosDisponibles: 25
  }
])

const cuentasPago = ref([
  {
    banco: 'Banco Principal',
    titular: 'LuckyDraw Inc.',
    numero: '1234-5678-9012-3456',
    logo: 'https://placehold.co/200x100/png?text=Banco+Principal'
  },
  {
    banco: 'Banco Secundario',
    titular: 'LuckyDraw Inc.',
    numero: '9876-5432-1098-7654',
    logo: 'https://placehold.co/200x100/png?text=Banco+Secundario'
  },
  {
    banco: 'Banco Digital',
    titular: 'LuckyDraw Inc.',
    numero: '4567-8901-2345-6789',
    logo: 'https://placehold.co/200x100/png?text=Banco+Digital'
  }
])

const copiarCuenta = (numero) => {
  navigator.clipboard.writeText(numero)
    .then(() => alert('Número de cuenta copiado al portapapeles'))
    .catch(err => console.error('Error al copiar:', err))
}

// Cargar rifas
const cargarRifas = async () => {
  try {
    const response = await axios.get(`${API_URL}/rifas`);
    rifas.value = response.data;
  } catch (error) {
    console.error('Error al cargar las rifas:', error);
  }
};
</script>

<template>
  <div class="min-h-screen bg-[#f8fafc] w-screen overflow-x-hidden">
    <!-- Menú móvil -->
    <div v-if="mobileMenu" 
         class="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity md:hidden"
         @click="mobileMenu = false">
    </div>

    <div v-if="mobileMenu"
         class="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-black shadow-xl transition transform md:hidden"
         :class="mobileMenu ? 'translate-x-0' : 'translate-x-full'">
      <div class="flex flex-col h-full">
        <div class="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10">
          <h2 class="text-xl font-semibold text-white">Menú</h2>
          <button @click="mobileMenu = false" class="text-white">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div class="flex-1 px-6 py-6 overflow-y-auto">
          <nav class="flex flex-col gap-4">
            <router-link 
              to="/" 
              class="text-white hover:text-accent-500 transition-all duration-300 text-lg"
              @click="mobileMenu = false"
            >INICIO</router-link>
            <a href="#" 
               class="text-white hover:text-accent-500 transition-all duration-300 text-lg"
               @click="mobileMenu = false"
            >CUENTAS DE PAGO</a>
            <a href="#" 
               class="text-white hover:text-accent-500 transition-all duration-300 text-lg"
               @click="mobileMenu = false"
            >CONTACTO</a>
            <router-link 
              v-if="isAuthenticated()" 
              to="/admin" 
              class="text-white hover:text-accent-500 transition-all duration-300 text-lg"
              @click="mobileMenu = false"
            >ADMIN PANEL</router-link>
          </nav>
        </div>
        
        <div class="px-6 py-4 border-t border-white/10">
          <button class="w-full px-6 py-3 bg-accent-600 text-white rounded-md hover:bg-accent-700 transition-all duration-300 text-lg">
            EVENTOS
          </button>
        </div>
      </div>
    </div>

    <!-- Navbar Oscuro con animación -->
    <div class="w-full h-[4px] bg-accent-600 transition-all duration-300"></div>
    <nav class="fixed top-[4px] left-0 w-full z-50 transition-all duration-300"
         :class="[
           isScrolled ? 'bg-black h-20 backdrop-blur-sm' : 'bg-black h-24 backdrop-blur-sm',
           'after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-white/10'
         ]">
      <div class="max-w-screen-xl mx-auto px-6">
        <div class="flex justify-between items-center h-full"
             :class="isScrolled ? 'py-0' : 'py-4'">
          <!-- Logo y Nombre -->
          <router-link to="/" class="flex items-center gap-3">
            <svg class="transition-all duration-300" :class="isScrolled ? 'w-10 h-10' : 'w-12 h-12'" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- Círculo exterior con gradiente -->
              <circle cx="24" cy="24" r="23" stroke="url(#gradient-circle)" stroke-width="2" class="opacity-90"/>
              <!-- Globo terráqueo base -->
              <path d="M24 12C17.3726 12 12 17.3726 12 24C12 30.6274 17.3726 36 24 36C30.6274 36 36 30.6274 36 24C36 17.3726 30.6274 12 24 12Z" 
                    fill="url(#gradient-globe)" 
                    class="opacity-95"/>
              <!-- Meridianos principales -->
              <path d="M24 12V36" stroke="white" stroke-width="0.75" class="opacity-40"/>
              <path d="M12 24H36" stroke="white" stroke-width="0.75" class="opacity-40"/>
              <!-- Meridianos curvos -->
              <path d="M18 13.5C18 13.5 19 18 19 24C19 30 18 34.5 18 34.5" stroke="white" stroke-width="0.5" class="opacity-30"/>
              <path d="M30 13.5C30 13.5 29 18 29 24C29 30 30 34.5 30 34.5" stroke="white" stroke-width="0.5" class="opacity-30"/>
              <!-- Paralelos curvos -->
              <path d="M13.5 18C13.5 18 18 19 24 19C30 19 34.5 18 34.5 18" stroke="white" stroke-width="0.5" class="opacity-30"/>
              <path d="M13.5 30C13.5 30 18 29 24 29C30 29 34.5 30 34.5 30" stroke="white" stroke-width="0.5" class="opacity-30"/>
              <!-- Continentes estilizados -->
              <path d="M20 17C22 16 25 16.5 26 18C27 19.5 25 21 23 22C21 23 19 22.5 18.5 21C18 19.5 19 17.5 20 17Z" fill="white" class="opacity-20"/>
              <path d="M28 25C29 24 31 24.5 31.5 26C32 27.5 30.5 29 29 29.5C27.5 30 26 29.5 25.5 28C25 26.5 27 25.5 28 25Z" fill="white" class="opacity-20"/>
              <path d="M16 27C17 26 19 26.5 19.5 28C20 29.5 18.5 31 17 31.5C15.5 32 14 31.5 13.5 30C13 28.5 15 27.5 16 27Z" fill="white" class="opacity-20"/>
              <!-- Definición de gradientes -->
              <defs>
                <linearGradient id="gradient-circle" x1="0" y1="0" x2="48" y2="48">
                  <stop offset="0%" stop-color="#0891b2" stop-opacity="0.9"/>
                  <stop offset="100%" stop-color="#0e7490" stop-opacity="1"/>
                </linearGradient>
                <linearGradient id="gradient-globe" x1="12" y1="12" x2="36" y2="36">
                  <stop offset="0%" stop-color="#0891b2"/>
                  <stop offset="50%" stop-color="#0ea5e9"/>
                  <stop offset="100%" stop-color="#0e7490"/>
                </linearGradient>
              </defs>
            </svg>
            <h1 class="font-bold text-white navbar-font transition-all duration-300" 
                :class="isScrolled ? 'text-xl' : 'text-2xl'">
              Tu Rifa Global
            </h1>
          </router-link>
          <!-- Enlaces de Navegación -->
          <div class="hidden md:flex items-center gap-8">
            <router-link to="/" class="text-white hover:text-accent-500 transition-all duration-300 navbar-font" 
               :class="isScrolled ? 'text-base' : 'text-lg'">INICIO</router-link>
            <a href="#" class="text-white hover:text-accent-500 transition-all duration-300 navbar-font"
               :class="isScrolled ? 'text-base' : 'text-lg'">CUENTAS DE PAGO</a>
            <a href="#" class="text-white hover:text-accent-500 transition-all duration-300 navbar-font"
               :class="isScrolled ? 'text-base' : 'text-lg'">CONTACTO</a>
            <router-link 
              v-if="isAuthenticated()" 
              to="/admin" 
              class="text-white hover:text-accent-500 transition-all duration-300 navbar-font"
              :class="isScrolled ? 'text-base' : 'text-lg'"
            >ADMIN PANEL</router-link>
            <button class="px-6 py-2 bg-accent-600 text-white rounded-md hover:bg-accent-700 transition-all duration-300 navbar-font"
                    :class="[
                      isScrolled ? 'text-base' : 'text-lg',
                      isScrolled ? 'px-5 py-2' : 'px-6 py-3'
                    ]">
              EVENTOS
            </button>
          </div>
          <!-- Botón de menú móvil -->
          <button @click="mobileMenu = !mobileMenu" class="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!mobileMenu" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>
    <div class="w-full h-[4px] bg-accent-600 fixed z-50 transition-all duration-300"
         :style="{ top: isScrolled ? '84px' : '100px' }"></div>
    <!-- Espaciador ajustado -->
    <div class="transition-all duration-300" :class="isScrolled ? 'h-[88px]' : 'h-[96px]'" :style="{ backgroundColor: isScrolled ? 'black' : 'transparent' }"></div>

    <router-view />

    <!-- Footer Moderno -->
    <footer class="relative py-20 overflow-hidden bg-black">
      <div class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-500 to-transparent opacity-50"></div>
      
      <div class="max-w-screen-xl mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div class="flex items-center gap-3 mb-6">
              <svg class="w-8 h-8" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="24" cy="24" r="23" stroke="url(#gradient-circle-footer)" stroke-width="1.5"/>
                <path d="M24 12C17.3726 12 12 17.3726 12 24C12 30.6274 17.3726 36 24 36C30.6274 36 36 30.6274 36 24C36 17.3726 30.6274 12 24 12Z" fill="url(#gradient-globe-footer)"/>
                <defs>
                  <linearGradient id="gradient-circle-footer" x1="0" y1="0" x2="48" y2="48">
                    <stop offset="0%" stop-color="#0891b2" stop-opacity="0.8"/>
                    <stop offset="100%" stop-color="#0e7490" stop-opacity="0.9"/>
                  </linearGradient>
                  <linearGradient id="gradient-globe-footer" x1="12" y1="12" x2="36" y2="36">
                    <stop offset="0%" stop-color="#0891b2"/>
                    <stop offset="100%" stop-color="#0e7490"/>
                  </linearGradient>
                </defs>
              </svg>
              <h2 class="text-xl font-bold text-white">Tu Rifa Global</h2>
            </div>
            <p class="text-slate-400">Tu plataforma confiable de rifas en línea.</p>
          </div>
          
          <div>
            <h3 class="text-sm font-semibold text-white mb-6">Plataforma</h3>
            <ul class="space-y-4">
              <li><a href="#" class="text-slate-400 hover:text-accent-400 transition-all duration-300">Rifas Activas</a></li>
              <li><a href="#" class="text-slate-400 hover:text-accent-400 transition-all duration-300">Cómo Participar</a></li>
              <li><a href="#" class="text-slate-400 hover:text-accent-400 transition-all duration-300">Ganadores</a></li>
            </ul>
          </div>
          
          <div>
            <h3 class="text-sm font-semibold text-white mb-6">Soporte</h3>
            <ul class="space-y-4">
              <li><a href="#" class="text-slate-400 hover:text-accent-400 transition-all duration-300">Centro de Ayuda</a></li>
              <li><a href="#" class="text-slate-400 hover:text-accent-400 transition-all duration-300">Contacto</a></li>
              <li><a href="#" class="text-slate-400 hover:text-accent-400 transition-all duration-300">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h3 class="text-sm font-semibold text-white mb-6">Newsletter</h3>
            <div class="relative">
              <input type="email" placeholder="Tu email" 
                     class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-accent-500 transition-all duration-300">
              <button class="mt-4 w-full px-4 py-3 bg-accent-600 text-white rounded-xl hover:bg-accent-500 transition-all duration-300 group">
                <span class="flex items-center justify-center">
                  Suscribirse
                  <svg class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
        
        <div class="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p class="text-slate-400 text-sm">&copy; 2024 Tu Rifa Global. Todos los derechos reservados.</p>
          <div class="flex gap-6 mt-6 md:mt-0">
            <a href="#" class="group">
              <div class="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 hover:bg-accent-600 hover:border-transparent transition-all duration-300">
                <svg class="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
            </a>
            <a href="#" class="group">
              <div class="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 hover:bg-accent-600 hover:border-transparent transition-all duration-300">
                <svg class="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </div>
            </a>
            <a href="#" class="group">
              <div class="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 hover:bg-accent-600 hover:border-transparent transition-all duration-300">
                <svg class="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.824-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                </svg>
              </div>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
/* Importar fuentes */
@import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .nav-link {
    @apply text-slate-600 px-3 py-2 text-sm font-medium relative hover:text-accent-600;
  }
  
  .mobile-nav-link {
    @apply block px-4 py-2 text-slate-600 hover:text-accent-600;
  }

  .navbar-font {
    @apply font-['Roboto_Condensed'] tracking-wide text-xl uppercase font-bold;
  }
}

/* Efecto de línea para el navbar */
.nav-link {
  position: relative;
}

.nav-line {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #0891b2;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease-out;
}

.nav-link:hover .nav-line {
  transform: scaleX(1);
}

/* Estilos base */
:root {
  margin: 0;
  padding: 0;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  scroll-behavior: smooth;
  overflow-x: hidden;
  width: 100%;
  margin: 0;
  padding: 0;
  background-color: #f8fafc;
  font-family: 'Roboto Condensed', sans-serif;
}

#app {
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
}

/* Estilos para el scroll */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-slate-100;
}

::-webkit-scrollbar-thumb {
  @apply bg-accent-600 rounded-full;
}

/* Mejoras para dispositivos móviles */
@media (max-width: 640px) {
  .text-5xl {
    font-size: 2.5rem;
  }
  
  .py-24 {
    padding-top: 3rem;
    padding-bottom: 3rem;
  }
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

.animate-spin-slow {
  animation: spin-slow 20s linear infinite;
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}

/* Agregar estilos para la animación del navbar */
nav {
  transform-style: preserve-3d;
  backface-visibility: hidden;
}

.navbar-scroll-shadow {
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
}

/* Animación suave para todos los elementos del navbar */
nav * {
  transition: all 0.3s ease-in-out;
}
</style>
