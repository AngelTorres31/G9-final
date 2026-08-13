// Shared nav/footer HTML injector
// Call: injectNav('active-link-id'), injectFooter()

function injectNav(activeId) {
  const isRoot = !window.location.pathname.includes('/pages/');
  const base = isRoot ? '' : '../';

  const html = `
  <nav class="navbar-custom">
    <div class="navbar-inner">
      <a class="navbar-brand" href="${base}index.html">
        G9 Imports
      </a>
      <ul class="nav-links">
        <li><a href="${base}index.html" ${activeId === 'home' ? 'class="active"' : ''}>Inicio</a></li>
        <li><a href="${base}productos.html" ${activeId === 'products' ? 'class="active"' : ''}>Productos</a></li>
        <li class="nav-dropdown">
          <a href="#" ${activeId === 'categories' ? 'class="active"' : ''}>Categorías ▾</a>
          <ul class="dropdown-menu-custom" id="categories-dropdown"></ul>
        </li>
        <li><a href="${base}index.html#contacto" ${activeId === 'contact' ? 'class="active"' : ''}>Contacto</a></li>
      </ul>
      <div class="navbar-actions">
        <button class="theme-toggle" id="themeToggle" aria-label="Cambiar tema">
          <i class="fas fa-moon" id="themeIcon"></i>
        </button>
        <a href="${base}carrito.html" class="cart-btn">
          <i class="fas fa-shopping-cart"></i>
          <span class="cart-badge">0</span>
        </a>
        <a href="${base}admin/index.html" class="btn btn-primary btn-sm" style="display:flex;align-items:center;gap:.4rem;padding:.5rem 1.1rem;font-size:.82rem;border-radius:50px;background:var(--gradient);color:white;border:none;cursor:pointer;">
          <i class="fas fa-lock"></i> Admin
        </a>
      </div>
      <button class="hamburger" id="hamburger" aria-label="Menu">
        <i class="fas fa-bars"></i>
      </button>
    </div>
  </nav>
  <div class="mobile-nav" id="mobileNav">
    <a href="${base}index.html">Inicio</a>
    <a href="${base}productos.html">Productos</a>
    <a href="${base}carrito.html">🛒 Carrito</a>
    <a href="${base}admin/index.html">⚙️ Admin</a>
  </div>`;

  const el = document.createElement('div');
  el.innerHTML = html;
  document.body.insertBefore(el, document.body.firstChild);

  // Hamburger toggle
  setTimeout(() => {
    document.getElementById('hamburger')?.addEventListener('click', () => {
      document.getElementById('mobileNav')?.classList.toggle('open');
    });
  }, 100);
}

function injectFooter() {
  const isRoot = !window.location.pathname.includes('/pages/');
  const base = isRoot ? '' : '../';

  const html = `
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-brand">G9 Imports</div>
          <p class="footer-desc">Tu destino para productos importados de calidad con un servicio excepcional. Calidad garantizada, precios competitivos.</p>
          <div class="footer-social">
            <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
            <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
            <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
            <a href="#" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
          </div>
        </div>
        <div>
          <h4 class="footer-heading">Navegación</h4>
          <ul class="footer-links">
            <li><a href="${base}index.html">Inicio</a></li>
            <li><a href="${base}productos.html">Productos</a></li>
            <li><a href="${base}carrito.html">Carrito</a></li>
            <li><a href="${base}index.html#contacto">Contacto</a></li>
          </ul>
        </div>
        <div>
          <h4 class="footer-heading">Soporte</h4>
          <ul class="footer-links">
            <li><a href="#">Política de Devoluciones</a></li>
            <li><a href="#">Seguimiento de Pedidos</a></li>
            <li><a href="#">Preguntas Frecuentes</a></li>
            <li><a href="#">Términos y Condiciones</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; ${new Date().getFullYear()} G9 Imports. Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>`;

  document.body.insertAdjacentHTML('beforeend', html);
}
