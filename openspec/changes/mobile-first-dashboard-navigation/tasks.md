## 1. Menú autenticado

- [ ] 1.1 Sustituir los botones horizontales del dashboard por `Tabbar`/`TabbarItem` móvil y `Sidebar`/`SidebarItem` de escritorio, conectados a una sola sección activa; verificar con pruebas Vitest que cada entrada muestra el panel correspondiente y mantiene la selección.
- [ ] 1.2 Adaptar la cabecera y la acción de logout al nuevo layout sin modificar la autenticación ni la petición de resumen; verificar con pruebas que logout vuelve a la landing y que sigue disponible durante carga y error.

## 2. Responsive y accesibilidad

- [ ] 2.1 Aplicar el tema claro existente, el espacio inferior y la safe-area del menú fijo; verificar visualmente en viewports de teléfono y escritorio que ninguna entrada ni el final del contenido quedan ocultos.
- [ ] 2.2 Comprobar etiquetas, foco y selección activa con teclado y tecnología de asistencia disponible; añadir o ajustar pruebas automatizadas para las señales accesibles verificables.

## 3. Verificación

- [ ] 3.1 Ejecutar `bun run test`, `bun run type-check` y `bun run build` en frontend y confirmar cero fallos; revisar que no se añadieron endpoints, dependencias ni pantallas vacías.
- [ ] 3.2 Ejecutar `openspec validate --all --strict`, revisar el diff y documentar cualquier limitación de verificación visual antes de entregar la slice.
