## Why

Tras iniciar sesión, el dashboard ya muestra Playas, Mareas, Tablas y Alertas, pero su menú horizontal y su estilo actual no ofrecen una navegación cómoda en móvil ni coherente con la landing. Esta mejora debe convertir esas secciones existentes en una experiencia de navegación usable sin adelantar nuevas funciones de surf.

## What Changes

- Añadir una estructura de navegación mobile-first para las cuatro secciones existentes del dashboard.
- Mostrar un menú inferior táctil en móvil, con estado activo claro y adaptación al área segura del dispositivo; presentar una navegación adecuada al espacio disponible en pantallas grandes.
- Mantener cabecera, contenido, estados de carga/error y salida de sesión accesibles al cambiar de sección.
- Usar componentes de Vant ya incorporados al frontend, con pruebas automatizadas de navegación y regresión del login/logout.
- No crear pantallas vacías, nuevas entidades, endpoints ni capacidades de surf.

## Capabilities

### New Capabilities

- `dashboard-navigation`: Navegación autenticada, responsive y accesible entre las cuatro secciones existentes del dashboard.

### Modified Capabilities

Ninguna. La navegación concreta se especifica como una capacidad nueva sin alterar los contratos de autenticación ni los datos del dashboard.

## Impact

- Frontend Vue: `SurferDashboard.vue`, estilos y pruebas asociadas; quizá un componente de menú si su reutilización inmediata lo justifica.
- Dependencias: reutilizar Vant existente; no añadir Vue Router ni otra dependencia salvo que el diseño aprobado demuestre necesidad.
- Backend, base de datos, despliegue y APIs: sin cambios.
