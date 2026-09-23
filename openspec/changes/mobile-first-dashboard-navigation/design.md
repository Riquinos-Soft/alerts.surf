## Context

Véanse `proposal.md` y `specs/dashboard-navigation/spec.md`. `SurferDashboard.vue` ya tiene cuatro secciones y una sola variable de sección activa, pero usa botones horizontales y estilos oscuros; Vant 4 ya está incluido por el cambio `redesign-landing-3d-vant`. Las PR de autenticación y landing son la base de esta propuesta.

## Goals / Non-Goals

**Goals:**
- Una navegación coherente con la landing clara y cómoda para uso táctil desde el primer tamaño de pantalla.
- Una única selección activa compartida por las variantes móvil y escritorio, sin duplicar el contenido de las secciones.
- Conservar el comportamiento de carga, error, autenticación y logout mientras se cambia el menú.

**Non-Goals:**
- Añadir rutas profundas, URLs compartibles, Vue Router o persistencia de la pestaña seleccionada.
- Crear nuevas páginas, datos, endpoints, reportes reales o funciones de alertas.
- Rehacer las tarjetas y contenido de cada sección más allá de lo necesario para integrarlos en el nuevo layout.

## Decisions

### 1. Reutilizar las cuatro secciones y el estado local

La selección seguirá dentro del dashboard: Playas, Mareas, Tablas y Alertas son vistas de un mismo resumen, no páginas independientes en este slice. Una clave activa alimentará tanto el menú como el contenido. Añadir Vue Router ahora introduciría una dependencia y cambios de URL que el contrato no requiere. Si una futura spec pide enlaces directos a secciones, se revisará esta decisión entonces.

### 2. Componentes Vant adecuados a cada espacio

En móvil, utilizar [`Tabbar`/`TabbarItem` de Vant](https://github.com/youzan/vant/blob/main/packages/vant/src/tabbar/README.zh-CN.md) con nombres estables, icono y texto para las cuatro secciones; habilitar el área segura inferior y reservar espacio para el menú fijo. En escritorio, utilizar [`Sidebar`/`SidebarItem`](https://github.com/youzan/vant/blob/main/packages/vant/src/sidebar/README.md) junto al contenido. Se mostrará una sola variante según el ancho, conectada al mismo estado. La cabecera puede usar [`NavBar`](https://github.com/youzan/vant/blob/main/packages/vant/src/nav-bar/README.md) si encaja con la acción de logout; no se usarán componentes solo para exhibir la biblioteca.

### 3. Integración pequeña y verificable

Mantener la petición de `/api/dashboard/summary` y los cuatro paneles existentes. Añadir pruebas Vitest que seleccionen cada entrada, comprueben el panel/estado activo y la disponibilidad de logout durante carga y error. Revisar visualmente anchos de teléfono y escritorio, teclado y área segura; ejecutar type-check y build. No habrá cambios en backend ni infraestructura.

## Risks / Trade-offs

- **[Riesgo]** Dos variantes de menú podrían desincronizarse. **Mitigación:** un único estado de sección activa y una sola estructura de datos con nombres/etiquetas.
- **[Riesgo]** Un `Tabbar` fijo puede ocultar el final del contenido en móvil. **Mitigación:** espacio inferior y safe-area explícitos, verificados en viewport estrecho.
- **[Riesgo]** La pestaña activa no se conserva al recargar ni tiene URL propia. **Mitigación:** aceptar ese límite en esta slice; no añadir routing prematuro.
