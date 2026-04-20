# ⚡ Electrofik

**Aplicación comparativa de productos electrónicos**

Electrofik es una aplicación web estática que permite a los usuarios comparar hasta **3 productos electrónicos** simultáneamente, viendo sus especificaciones técnicas y precios lado a lado.

---

## 🚀 Demo rápida

Abre `index.html` en tu navegador. No se requiere servidor ni dependencias.

---

## ✨ Funcionalidades implementadas

| Funcionalidad | Estado |
|---|---|
| Catálogo de 10 productos (smartphones, laptops, auriculares, TV) | ✅ |
| Filtrado por categoría | ✅ |
| Búsqueda en tiempo real por nombre y marca | ✅ |
| Selección de hasta 3 productos para comparar | ✅ |
| Barra inferior de comparación (sticky tray) | ✅ |
| Tabla comparativa de especificaciones | ✅ |
| Diseño responsive (móvil / escritorio) | ✅ |
| Puntuaciones y valoraciones de usuarios | ✅ |

---

## 🗂️ Estructura del proyecto

```
Electrofik/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos completos (variables CSS, responsive)
├── js/
│   ├── data.js         # Base de datos de productos y categorías
│   └── app.js          # Lógica de la aplicación
└── README.md
```

---

## 📋 Plan de implementación

### Fase 1 – MVP *(completada)*
- [x] Estructura HTML semántica
- [x] Estilos con variables CSS y diseño responsive
- [x] Base de datos de productos en `data.js`
- [x] Renderizado dinámico de tarjetas de producto
- [x] Filtros por categoría mediante pestañas
- [x] Búsqueda en tiempo real
- [x] Selección/deselección de productos para comparar (máx. 3)
- [x] Barra sticky inferior con productos seleccionados
- [x] Tabla comparativa de especificaciones técnicas

### Fase 2 – Mejoras futuras
- [ ] Persistencia de la selección en `localStorage`
- [ ] Ordenación por precio, valoración o nombre
- [ ] Filtro por rango de precios (slider)
- [ ] Modo oscuro
- [ ] Backend / API real con más productos
- [ ] Página de detalle de producto
- [ ] Exportar comparativa a PDF

---

## 🛠️ Tecnologías

- **HTML5** – estructura semántica
- **CSS3** – variables, Grid, Flexbox, transiciones
- **JavaScript ES6+** – vanilla JS, sin frameworks ni dependencias

---

## 📸 Capturas

La interfaz principal muestra:
1. **Cabecera** con logo, descripción y buscador
2. **Pestañas de categoría** para filtrar productos
3. **Rejilla de tarjetas** con precio, valoración y botón "Comparar"
4. **Barra inferior** que aparece al seleccionar productos
5. **Tabla comparativa** con todas las especificaciones lado a lado

---

## 🤝 Contribuir

1. Haz un fork del repositorio
2. Crea tu rama: `git checkout -b feature/nueva-funcionalidad`
3. Añade tus cambios y haz commit: `git commit -m 'Añadir nueva funcionalidad'`
4. Haz push y abre un Pull Request

