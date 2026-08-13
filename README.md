# G9 Imports - Tienda Estática para GitHub Pages

Versión estática de G9 Imports, 100% compatible con GitHub Pages.

## 🚀 Cómo publicar en GitHub Pages

### Pasos rápidos:

1. **Crea un repositorio** en GitHub (ej: `g9imports`)

2. **Sube todos los archivos** de esta carpeta al repositorio:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/TU_USUARIO/g9imports.git
   git push -u origin main
   ```

3. **Activa GitHub Pages**:
   - Ve a tu repositorio en GitHub
   - Settings → Pages
   - Source: `Deploy from a branch`
   - Branch: `main` / `(root)`
   - Save

4. **Tu tienda estará en**: `https://TU_USUARIO.github.io/g9imports/`

---

## 📁 Estructura de archivos

```
g9imports/
├── index.html          ← Página principal
├── productos.html      ← Listado de productos
├── carrito.html        ← Carrito de compras
├── checkout.html       ← Finalizar compra
├── pedido-exitoso.html ← Confirmación de pedido
├── admin/
│   └── index.html      ← Panel de administración
├── pages/
│   └── producto.html   ← Detalle de producto
├── css/
│   └── main.css        ← Estilos
├── js/
│   ├── store.js        ← Lógica de la tienda (carrito, productos)
│   └── layout.js       ← Navbar y footer compartidos
└── data/
    ├── products.json   ← Base de datos de productos
    └── categories.json ← Base de datos de categorías
```

## 🛒 Funcionalidades

- ✅ Catálogo de productos con filtros y búsqueda
- ✅ Carrito de compras persistente (LocalStorage)
- ✅ Checkout con formulario completo
- ✅ Historial de pedidos guardado localmente
- ✅ Panel de administración con login
- ✅ Modo oscuro
- ✅ Diseño responsive mobile-first

## 🔧 Personalización

### Agregar/editar productos
Edita `data/products.json` — agrega objetos con esta estructura:
```json
{
  "id": 9,
  "name": "Nombre del producto",
  "description": "<p>Descripción HTML</p>",
  "price": 49.99,
  "stock": 20,
  "category_id": 1,
  "featured": true,
  "images": ["URL_DE_IMAGEN"],
  "variants": []
}
```

### Cambiar nombre de la tienda
Busca y reemplaza `G9 Imports` en todos los archivos HTML.

### Admin panel
- Usuario: `admin`
- Contraseña: `admin123`

Para cambiar las credenciales, edita estas líneas en `admin/index.html`:
```js
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123';
```

## ⚠️ Limitaciones vs versión Flask

| Función | Flask | GitHub Pages |
|---------|-------|--------------|
| Datos productos | Base de datos | JSON estático |
| Carrito | Sesión servidor | LocalStorage |
| Pedidos | Base de datos | LocalStorage |
| Notificaciones Telegram/n8n | ✅ | ❌ (requiere backend) |
| Imágenes upload | ✅ | ❌ (usa URLs externas) |
| Admin completo | ✅ | Solo lectura |

Para notificaciones de pedidos sin backend, puedes usar **Formspree**, **EmailJS** o **Make/Zapier** con webhooks desde el formulario de checkout.
