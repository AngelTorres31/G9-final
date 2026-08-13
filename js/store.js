// ========================
// G9 Imports - Store Engine
// ========================

const G9Store = (() => {
  // ---- Data Cache ----
  let _products = [];
  let _categories = [];

  // ---- Cart (LocalStorage) ----
  const Cart = {
    get() {
      return JSON.parse(localStorage.getItem('g9_cart') || '[]');
    },
    save(cart) {
      localStorage.setItem('g9_cart', JSON.stringify(cart));
      Cart.updateBadge();
      document.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
    },
    add(productId, quantity = 1, variantId = null) {
      const cart = Cart.get();
      const product = _products.find(p => p.id === productId);
      if (!product) return false;

      const variant = variantId ? product.variants.find(v => v.id === variantId) : null;
      const key = `${productId}_${variantId || 'none'}`;

      const existing = cart.find(i => i.key === key);
      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.push({
          key,
          product_id: productId,
          variant_id: variantId,
          name: product.name,
          price: product.price + (variant ? variant.price_adjustment : 0),
          quantity,
          image: product.images[0] || '',
          variant_info: variant ? `${variant.name}: ${variant.value}` : null
        });
      }
      Cart.save(cart);
      return true;
    },
    remove(key) {
      const cart = Cart.get().filter(i => i.key !== key);
      Cart.save(cart);
    },
    updateQuantity(key, qty) {
      const cart = Cart.get();
      const item = cart.find(i => i.key === key);
      if (item) {
        item.quantity = Math.max(1, qty);
        Cart.save(cart);
      }
    },
    clear() {
      localStorage.removeItem('g9_cart');
      Cart.updateBadge();
    },
    total() {
      return Cart.get().reduce((s, i) => s + i.price * i.quantity, 0);
    },
    count() {
      return Cart.get().reduce((s, i) => s + i.quantity, 0);
    },
    updateBadge() {
      document.querySelectorAll('.cart-badge').forEach(el => {
        el.textContent = Cart.count();
      });
    }
  };

  // ---- Orders (LocalStorage) ----
  const Orders = {
    get() {
      return JSON.parse(localStorage.getItem('g9_orders') || '[]');
    },
    save(order) {
      const orders = Orders.get();
      order.id = Date.now();
      order.created_at = new Date().toISOString();
      order.status = 'pendiente';
      orders.unshift(order);
      localStorage.setItem('g9_orders', JSON.stringify(orders));
      return order;
    }
  };

  // ---- Load data from JSON files ----
  async function loadData() {
    const base = getBasePath();
    try {
      const [pRes, cRes] = await Promise.all([
        fetch(`${base}data/products.json`),
        fetch(`${base}data/categories.json`)
      ]);
      _products = await pRes.json();
      _categories = await cRes.json();
    } catch (e) {
      console.warn('Could not load data files, using embedded data');
    }
  }

  function getBasePath() {
    // Works for both local dev and GitHub Pages subfolders
    const scripts = document.querySelectorAll('script[src*="store.js"]');
    if (scripts.length > 0) {
      const src = scripts[0].src;
      return src.replace('js/store.js', '');
    }
    return '/';
  }

  // ---- Public API ----
  return {
    init: loadData,
    cart: Cart,
    orders: Orders,
    getProducts(filters = {}) {
      let list = [..._products];
      if (filters.category_id) list = list.filter(p => p.category_id === filters.category_id);
      if (filters.featured) list = list.filter(p => p.featured);
      if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(p => p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q));
      }
      return list;
    },
    getProduct(id) { return _products.find(p => p.id === id) || null; },
    getCategories() { return _categories; },
    getCategory(id) { return _categories.find(c => c.id === id) || null; }
  };
})();

// ========================
// UI Utilities
// ========================

function showToast(msg, type = 'success') {
  const t = document.createElement('div');
  t.className = `g9-toast g9-toast-${type}`;
  t.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${msg}`;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 3000);
}

function formatPrice(n) {
  return '$' + Number(n).toFixed(2);
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('es-HN', { year: 'numeric', month: 'long', day: 'numeric' });
}

function productCardHTML(product) {
  const img = product.images[0] || 'https://via.placeholder.com/400x300?text=Sin+Imagen';
  const inStock = product.stock > 0;
  return `
    <div class="product-card" data-id="${product.id}">
      <a href="pages/producto.html?id=${product.id}" class="card-link">
        <div class="card-img-wrap">
          <img src="${img}" alt="${product.name}" loading="lazy">
          ${product.featured ? '<span class="badge-featured"><i class="fas fa-star"></i> Destacado</span>' : ''}
        </div>
        <div class="card-body">
          <h3 class="card-name">${product.name}</h3>
          <p class="card-price">${formatPrice(product.price)}</p>
          <span class="stock-pill ${inStock ? 'in' : 'out'}">${inStock ? `${product.stock} en stock` : 'Agotado'}</span>
        </div>
      </a>
      <button class="btn-add-cart" onclick="quickAdd(${product.id})" ${!inStock ? 'disabled' : ''}>
        <i class="fas fa-shopping-cart"></i> Agregar
      </button>
    </div>`;
}

function quickAdd(productId) {
  const ok = G9Store.cart.add(productId, 1, null);
  if (ok) showToast('¡Producto agregado al carrito!');
  else showToast('Error al agregar', 'error');
}

// Initialize on every page
document.addEventListener('DOMContentLoaded', async () => {
  await G9Store.init();
  G9Store.cart.updateBadge();

  // Render navbar categories dropdown
  const catDrop = document.getElementById('categories-dropdown');
  if (catDrop) {
    G9Store.getCategories().forEach(c => {
      const li = document.createElement('li');
      li.innerHTML = `<a class="dropdown-item" href="productos.html?category=${c.id}">${c.name}</a>`;
      catDrop.appendChild(li);
    });
  }

  // Dark mode
  const saved = localStorage.getItem('g9_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  const icon = document.getElementById('themeIcon');
  if (icon) icon.className = saved === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme');
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('g9_theme', next);
      document.getElementById('themeIcon').className = next === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    });
  }

  // Scroll navbar effect
  const navbar = document.querySelector('.navbar-custom');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // Run page-specific init
  if (typeof pageInit === 'function') pageInit();
});
