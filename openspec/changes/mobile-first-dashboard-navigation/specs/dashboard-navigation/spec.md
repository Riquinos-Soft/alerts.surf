## Purpose

Permite a una persona autenticada moverse de forma clara y accesible entre las secciones que ya ofrece el dashboard de alerts.surf, especialmente desde un teléfono.

## ADDED Requirements

### Requirement: Navegación entre secciones existentes
El dashboard SHALL ofrecer entradas identificables para Playas, Mareas, Tablas y Alertas. Al seleccionar una entrada SHALL mostrar su contenido existente y señalar cuál está activa, sin solicitar de nuevo el inicio de sesión ni cargar datos de otra capacidad nueva.

#### Scenario: Cambiar de sección
- **WHEN** una persona autenticada selecciona Mareas desde Playas
- **THEN** ve el contenido de Mareas y Mareas aparece como sección activa

#### Scenario: Secciones disponibles
- **WHEN** una persona autenticada abre el dashboard
- **THEN** puede identificar y acceder a Playas, Mareas, Tablas y Alertas

### Requirement: Menú usable en móvil y escritorio
El dashboard SHALL presentar una navegación táctil inferior en pantallas pequeñas, respetar el área segura del dispositivo y evitar que el menú tape el contenido. En pantallas grandes SHALL mantener visibles las mismas entradas y un estado activo reconocible.

#### Scenario: Navegación en teléfono
- **WHEN** el dashboard se muestra en una pantalla estrecha con área segura inferior
- **THEN** las cuatro entradas siguen accesibles y el contenido de la sección activa no queda oculto bajo el menú

#### Scenario: Navegación en escritorio
- **WHEN** el dashboard se muestra en una pantalla amplia
- **THEN** las cuatro entradas y la sección activa siguen siendo visibles sin depender de un menú móvil superpuesto

### Requirement: Continuidad y accesibilidad de la sesión
El menú SHALL conservar una acción de salida accesible y SHALL permitir identificar y accionar cada sección con teclado y tecnologías de asistencia. Los estados de carga y error del resumen SHALL seguir visibles sin impedir salir de la sesión.

#### Scenario: Carga o error del resumen
- **WHEN** la petición del resumen está cargando o falla
- **THEN** el dashboard muestra ese estado y mantiene disponible la acción de cerrar sesión

#### Scenario: Navegación con teclado
- **WHEN** una persona navega mediante teclado entre las entradas del menú
- **THEN** puede activar una sección y reconocer cuál está seleccionada

#### Scenario: Cerrar sesión
- **WHEN** una persona selecciona la acción de salir
- **THEN** vuelve a la landing pública y deja de ver el menú autenticado
