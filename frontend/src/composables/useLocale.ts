import { ref } from 'vue'

const STORAGE_KEY = 'alerts.surf.language'

export type Locale = 'es' | 'en'

const spanish = {
  'Main navigation': 'Navegación principal',
  'Platform health': 'Estado de la plataforma',
  'Interface language': 'Idioma de la interfaz',
  'Dashboard sections': 'Secciones del panel',
  'Sign in': 'Entrar',
  'Intelligence': 'Inteligencia',
  'Agentic AI': 'IA agéntica',
  'Pricing': 'Precios',
  'Checking alerts.surf status...': 'Comprobando el estado de alerts.surf...',
  'alerts.surf is running': 'alerts.surf está funcionando',
  'alerts.surf is unavailable': 'alerts.surf no está disponible',
  '✨ Live Ocean Intelligence': '✨ Inteligencia oceánica en directo',
  'Know exactly when and where': 'Descubre cuándo y dónde',
  'the ocean turns on.': 'el mar se pone bueno.',
  'Hyper-local swell dynamics, 3D ocean simulation, high-resolution wind vectors, and an agentic AI assistant that understands your quiver and spots like a local shaper.': 'Oleaje local, simulación oceánica 3D, viento detallado y un asistente de IA que conoce tus tablas y playas como alguien de la zona.',
  'Explore Intelligence': 'Explorar la inteligencia',
  'Discover Surf Agent': 'Conocer el asistente de surf',
  'Sample spots': 'Playas de ejemplo',
  'LIVE SWELL TELEMETRY': 'DATOS DE OLEAJE EN DIRECTO',
  'Basque Country': 'País Vasco',
  'Firing': 'Épico',
  'Clean & Peeling': 'Limpio y ordenado',
  'Primary Swell': 'Oleaje principal',
  'Period:': 'Periodo:',
  'Local Wind': 'Viento local',
  'Favorable texture': 'Superficie favorable',
  'Tide Window': 'Ventana de marea',
  'Optimal window': 'Ventana óptima',
  'Agent Recommendation': 'Recomendación del asistente',
  'Matched to conditions': 'Adaptada a las condiciones',
  '7 kts Offshore (SSW)': '7 nudos terral (SSO)',
  '5 kts Light Cross (E)': '5 nudos cruzados suaves (E)',
  'Low tide rising (+0.8m)': 'Bajamar subiendo (+0,8 m)',
  'Mid tide falling (+1.4m)': 'Media marea bajando (+1,4 m)',
  'Independent Forecast': 'Previsión independiente',
  'Model Updates': 'Actualizaciones del modelo',
  'Voice & Chat': 'Voz y chat',
  'Agentic Ready': 'Asistente preparado',
  'Interactive app experience': 'Vista interactiva de la app',
  'Architected for Surfers': 'Diseñado para surfistas',
  'Everything traditional surf forecasts missed,': 'Todo lo que las previsiones de surf pasaron por alto,',
  'reimagined.': 'reinventado.',
  'From micro-climate wind patterns to an AI conversational agent that knows your boards and personal preferences.': 'Desde los patrones locales de viento hasta un asistente de IA que conoce tus tablas y preferencias.',
  'Powerful ocean swell barrel': 'Ola potente formando un tubo',
  'Condition Scoring That Actually Works': 'Una puntuación de condiciones que sí funciona',
  'No generic stars based solely on offshore wave height. alerts.surf correlates bathymetry, primary and secondary swell vectors, and tide levels into an honest 0-10 session score.': 'Sin estrellas genéricas basadas solo en la altura de las olas. alerts.surf combina batimetría, oleaje principal y secundario, y marea para dar una puntuación honesta de 0 a 10.',
  'Dual-Swell Decomposition': 'Análisis de dos oleajes',
  'Bathymetry Mapping': 'Mapa batimétrico',
  'Tide Curves': 'Curvas de marea',
  '✦ Agentic Voice & Vision': '✦ IA con voz y visión',
  'Your Personal AI Surf Caddy': 'Tu asistente personal de surf con IA',
  'Talk or chat naturally. Ask about conditions, save your surfboard quiver, and get tailored recommendations based on wave energy and board volume.': 'Habla o escribe con naturalidad. Pregunta por las condiciones, guarda tus tablas y recibe recomendaciones según la energía de las olas y el volumen de tu tabla.',
  'Surfer (Voice Prompt)': 'Surfista (consulta por voz)',
  '"Got 2 hours at dawn tomorrow. Should I wax the twin-fin or the round-pin?"': '«Mañana tengo dos horas al amanecer. ¿Preparo la twin-fin o la round-pin?»',
  'Grab your 6\'0" Round Pin. The 14s swell is peaking right as the tide begins pushing, giving the sandbar the shape it needs.': 'Lleva tu Round Pin de 6\'0". El oleaje de 14 s alcanza su pico cuando empieza a subir la marea y el banco de arena toma forma.',
  'Voice synthesizing': 'Sintetizando voz',
  'Listening...': 'Escuchando...',
  'Simulate Voice Query': 'Simular consulta por voz',
  'Board matched:': 'Tabla adecuada:',
  'Laser-Focused Notifications': 'Avisos solo cuando importa',
  'Set custom thresholds for your favorite breaks. We only ping you when conditions align, so you never wake up to blown-out surf.': 'Configura umbrales para tus playas favoritas. Te avisamos cuando las condiciones encajen, para que no madrugues por un mar desordenado.',
  'PUSH ALERT': 'ALERTA',
  'alerts.surf Agent': 'Asistente alerts.surf',
  'Mundaka hitting 9.4 tomorrow 07:30': 'Mundaka alcanzará 9,4 mañana a las 07:30',
  'Native Speed, Zero Bloat': 'Velocidad nativa, sin lastre',
  'Designed from day one as a lightning-fast SPA and offline-capable mobile PWA. Instant tide tables, real-time webcam links, and zero tracking ads.': 'Diseñada desde el principio como una app web rápida y preparada para funcionar sin conexión. Tablas de mareas, enlaces a cámaras en directo y sin anuncios de seguimiento.',
  'PWA Ready': 'Preparada para PWA',
  'Sub-second Loads': 'Carga en menos de un segundo',
  'Ad-Free': 'Sin anuncios',
  'Radically Fair Pricing': 'Precios radicalmente justos',
  'World-class surf forecasting,': 'Previsión de surf de primer nivel,',
  'made accessible.': 'al alcance de todos.',
  'Traditional forecast platforms charge exorbitant fees for bloated video player networks. We deliver raw ocean intelligence and agentic power at a fraction of the cost.': 'Las plataformas tradicionales cobran demasiado por servicios recargados. Ofrecemos información del mar y un asistente inteligente por mucho menos.',
  'Free Tier': 'Plan gratis',
  'forever': 'para siempre',
  'Essential forecast for weekend sessions and casual surfers.': 'Previsión esencial para sesiones de fin de semana y surfistas ocasionales.',
  'Free features': 'Funciones gratuitas',
  '3-day multi-model forecast': 'Previsión de 3 días con varios modelos',
  '1 spot alert notification': '1 aviso para una playa',
  'Core spot ratings (0–10 score)': 'Puntuación básica de playas (0–10)',
  'Hourly wind and tide curves': 'Curvas de viento y marea por horas',
  'Get Started Free': 'Empezar gratis',
  'MOST POPULAR': 'MÁS POPULAR',
  'Pro Forecaster + Agent': 'Previsión Pro + asistente',
  '/ month': '/ mes',
  'Unlimited hyper-local intelligence and your personal AI surf caddy.': 'Información local ilimitada y tu asistente personal de surf con IA.',
  'Pro features': 'Funciones Pro',
  'Agentic Voice & Chat': 'Voz y chat con IA',
  'quiver assistant': 'para elegir tabla',
  '16-day extended ensemble forecast': 'Previsión ampliada de 16 días con varios modelos',
  'Unlimited custom spot triggers': 'Alertas personalizadas ilimitadas para playas',
  'Dual-swell direction & bathymetry mapping': 'Dirección de dos oleajes y mapa batimétrico',
  'Offline-ready PWA & instant web app': 'App web preparada para funcionar sin conexión',
  'Start 14-Day Free Trial': 'Probar gratis durante 14 días',
  'Precision ocean forecasting, interactive 3D telemetry, and agentic intelligence for surfers worldwide.': 'Previsiones precisas del mar, datos interactivos en 3D e inteligencia para surfistas de todo el mundo.',
  'Product': 'Producto',
  'Telemetry': 'Datos en directo',
  'Crafted for surfers.': 'Creado para surfistas.',
  '5G LIVE': '5G EN DIRECTO',
  '7kt Off-shore': '7 nudos terral',
  '5kt Light Cross': '5 nudos cruzados suaves',
  '4kt Off-shore': '4 nudos terral',
  'Radar': 'Radar',
  'AI Quiver Advisory': 'Consejo de tablas con IA',
  '● Optimal Window Now': '● Ventana óptima ahora',
  '"Swell is peaking with 14s period. Ride the': '«El oleaje llega a su pico con 14 s de periodo. Usa la',
  'for speed over the shallow sandbar."': 'para ganar velocidad sobre el banco de arena».',
  '✓ Advisory Active': '✓ Consejo activo',
  '✨ Ask AI Surf Caddy': '✨ Preguntar al asistente de surf',
  'Tides': 'Mareas',
  'Tide Station: Cantábrico': 'Estación de mareas: Cantábrico',
  'Rising': 'Subiendo',
  'High Tide: 14:15 (+2.1m) • Low Tide: 20:30 (0.4m)': 'Pleamar: 14:15 (+2,1 m) • Bajamar: 20:30 (0,4 m)',
  'Low Tide': 'Bajamar',
  'High Tide': 'Pleamar',
  'Quiver': 'Tablas',
  '98% match today': '98 % de afinidad hoy',
  '92% match tomorrow': '92 % de afinidad mañana',
  'Surfer Dashboard': 'Panel de surf',
  'Logout': 'Salir',
  'Loading...': 'Cargando...',
  'Unable to load dashboard': 'No se pudo cargar el panel',
  'Beaches': 'Playas',
  'Boards': 'Tablas',
  'Alerts': 'Alertas',
  'Score:': 'Puntuación:',
  'Current:': 'Actual:',
  'High:': 'Pleamar:',
  'Low:': 'Bajamar:',
  'active': 'activa',
  'inactive': 'inactiva',
  'rising': 'subiendo',
  'falling': 'bajando',
  'Beta Login': 'Acceso beta',
  'Username': 'Usuario',
  'Password': 'Contraseña',
  'Cancel': 'Cancelar',
  'Logging in...': 'Entrando...',
  'Failed to login: Invalid credentials': 'No se pudo entrar: credenciales incorrectas',
} as const

export type TranslationKey = keyof typeof spanish

const locale = ref<Locale>('es')

export function detectLocale(browserLanguage: string | undefined): Locale {
  if (!browserLanguage) return 'es'
  return browserLanguage.toLowerCase().startsWith('es') ? 'es' : 'en'
}

export function initializeLocale(): void {
  let saved: string | null = null
  try {
    saved = localStorage.getItem(STORAGE_KEY)
  } catch {
    // Browsers can disable storage; the in-memory selection still works.
  }
  locale.value = saved === 'es' || saved === 'en'
    ? saved
    : detectLocale(typeof navigator === 'undefined' ? undefined : navigator.language)
  if (typeof document !== 'undefined') document.documentElement.lang = locale.value
}

export function setLocale(value: Locale): void {
  locale.value = value
  if (typeof document !== 'undefined') document.documentElement.lang = value
  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch {
    // A blocked storage API must not prevent switching language.
  }
}

export function useLocale() {
  return {
    locale,
    setLocale,
    t: (key: TranslationKey): string => locale.value === 'es' ? spanish[key] : key,
  }
}
