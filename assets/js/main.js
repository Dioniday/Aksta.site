// Enhanced theme toggle and header functionality
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;
const header = document.querySelector('.header');

// Sticky header functionality
function handleScroll() {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleScroll);

// Mobile navigation functionality
function initMobileNavigation() {
  const nav = document.querySelector('.nav');
  const navLinks = nav.querySelectorAll('a');
  
  // Create mobile menu toggle button
  const mobileToggle = document.createElement('button');
  mobileToggle.className = 'mobile-menu-toggle';
  mobileToggle.innerHTML = '☰';
  mobileToggle.setAttribute('aria-label', 'Toggle mobile menu');
  
  // Insert toggle button before nav
  nav.parentNode.insertBefore(mobileToggle, nav);
  
  // Toggle mobile menu
  mobileToggle.addEventListener('click', () => {
    nav.classList.toggle('mobile-open');
    mobileToggle.innerHTML = nav.classList.contains('mobile-open') ? '✕' : '☰';
  });
  
  // Close mobile menu when clicking on links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('mobile-open');
      mobileToggle.innerHTML = '☰';
    });
  });
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !mobileToggle.contains(e.target)) {
      nav.classList.remove('mobile-open');
      mobileToggle.innerHTML = '☰';
    }
  });
}

// Initialize mobile navigation on load
document.addEventListener('DOMContentLoaded', initMobileNavigation);

function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  // Меняем иконку кнопки
  if (theme === 'dark') {
    themeToggle.innerHTML = '🌙';
  } else {
    themeToggle.innerHTML = '☀️';
  }
}

// Инициализация темы при загрузке
(function() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    // По умолчанию светлая
    setTheme('light');
  }
})();

themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

// Enhanced cart functionality with visual feedback
const CART_KEY = 'aksta_cart';

// Update cart counter display
function updateCartCounter() {
  const cart = getCart();
  const counter = document.querySelector('.cart-counter');
  
  if (counter) {
    const itemCount = cart.length;
    if (itemCount > 0) {
      counter.textContent = itemCount;
      counter.classList.add('has-items');
    } else {
      counter.textContent = '';
      counter.classList.remove('has-items');
    }
  }
}

// Show toast notification
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast-notification');
  if (toast) {
    toast.textContent = message;
    toast.className = `toast-notification ${type}`;
    toast.style.display = 'block';
    
    setTimeout(() => {
      toast.style.display = 'none';
    }, 3000);
  }
}

// Получить корзину из localStorage
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

// Сохранить корзину
function setCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Enhanced add to cart function with visual feedback
window.addToCart = function(item) {
  const cart = getCart();
  
  // Enhanced item structure
  const cartItem = {
    id: Date.now().toString(),
    name: item.name || 'Неизвестный товар',
    brand: item.brand || '',
    category: item.category || '',
    type: item.type || '',
    comment: item.comment || '',
    image: item.image || '',
    specifications: item.specifications || {},
    dateAdded: new Date().toISOString(),
    priority: item.priority || 'normal'
  };
  
  cart.push(cartItem);
  setCart(cart);
  updateCartCounter();
  showToast(`${cartItem.name} добавлен в корзину!`, 'success');
};

// Enhanced cart rendering with improved UI
function renderCart() {
  const cartItemsDiv = document.getElementById('cart-items');
  if (!cartItemsDiv) return;
  
  const cart = getCart();
  
  if (cart.length === 0) {
    cartItemsDiv.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <h3>Ваша корзина пуста</h3>
        <p>Добавьте оборудование из каталога, чтобы оформить заявку</p>
        <a href="catalog.html" class="btn-main">Перейти в каталог</a>
      </div>
    `;
    return;
  }
  
  let html = '<div class="cart-items-list">';
  cart.forEach((item, index) => {
    html += `
      <div class="cart-item" data-index="${index}">
        <div class="cart-item-image">
          <div class="cart-item-placeholder">🏭</div>
        </div>
        <div class="cart-item-content">
          <div class="cart-item-header">
            <h4 class="cart-item-name">${item.name}</h4>
            <button class="cart-item-remove" onclick="removeCartItem(${index})" aria-label="Удалить товар">✕</button>
          </div>
          <div class="cart-item-details">
            <span class="cart-item-brand">${item.brand || ''}</span>
            <span class="cart-item-category">${item.type || ''}</span>
          </div>
          <div class="cart-item-description">${item.comment || ''}</div>
          <div class="cart-item-date">Добавлен: ${formatDate(item.dateAdded)}</div>
        </div>
      </div>
    `;
  });
  html += '</div>';
  
  cartItemsDiv.innerHTML = html;
  
  // Add animation to cart items
  const cartItems = cartItemsDiv.querySelectorAll('.cart-item');
  cartItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`;
    item.classList.add('fade-in');
  });
}

// Remove item from cart
function removeCartItem(index) {
  const cart = getCart();
  const item = cart[index];
  
  if (confirm(`Удалить "${item.name}" из корзины?`)) {
    cart.splice(index, 1);
    setCart(cart);
    updateCartCounter();
    renderCart();
    showToast('Товар удалён из корзины', 'success');
  }
}

// Format date for display
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Enhanced cart counter with animation
function updateCartCounter() {
  const cart = getCart();
  const counter = document.querySelector('.cart-counter');
  
  if (counter) {
    const itemCount = cart.length;
    const previousCount = parseInt(counter.textContent) || 0;
    
    if (itemCount > 0) {
      counter.textContent = itemCount;
      counter.classList.add('has-items');
      
      // Add bounce animation for new items
      if (itemCount > previousCount) {
        counter.classList.add('bounce');
        setTimeout(() => counter.classList.remove('bounce'), 300);
      }
    } else {
      counter.textContent = '';
      counter.classList.remove('has-items');
    }
  }
}

// Очистить корзину
function clearCart() {
  setCart([]);
}

// Обработка отправки формы корзины
const cartForm = document.getElementById('cart-form');
if (cartForm) {
  cartForm.addEventListener('submit', function(e) {
    e.preventDefault();
    // Здесь можно добавить отправку данных на сервер или по email
    alert('Заявка отправлена!');
    clearCart();
    renderCart();
    cartForm.reset();
  });
}

// Enhanced Catalog Functionality
const catalogData = [
  {
    id: 1,
    name: 'Фрезерные станки CNC',
    brand: 'Lushong',
    category: 'milling',
    description: 'Высокопроизводительные фрезерные станки с ЧПУ для прецизионной обработки металла.',
    specifications: ['CNC управление', 'Высокая точность', 'Мощный шпиндель'],
    badge: 'Новинка',
    featured: true
  },
  {
    id: 2,
    name: 'Шлифовальные станки',
    brand: 'HDCNC',
    category: 'grinding',
    description: 'Прецизионные шлифовальные станки для чистовой обработки поверхностей.',
    specifications: ['Высокая чистота', 'Автоматическая подача', 'Устойчивая конструкция'],
    badge: '',
    featured: false
  },
  {
    id: 3,
    name: 'Универсальные станки',
    brand: 'HNC',
    category: 'milling',
    description: 'Многофункциональные станки для различных видов обработки.',
    specifications: ['Многооперационность', 'Универсальность', 'Экономичность'],
    badge: '',
    featured: true
  },
  {
    id: 4,
    name: 'Лазерные станки',
    brand: 'LASER',
    category: 'laser',
    description: 'Современные лазерные системы для резки и маркировки металла.',
    specifications: ['Лазерная резка', 'Высокая скорость', 'Минимальные отходы'],
    badge: 'TOP',
    featured: true
  },
  {
    id: 5,
    name: 'Оборудование Willer',
    brand: 'Willer',
    category: 'milling',
    description: 'Надёжное оборудование для промышленного производства.',
    specifications: ['Надёжность', 'Простота обслуживания', 'Долговечность'],
    badge: '',
    featured: false
  },
  {
    id: 6,
    name: 'Оборудование Dongs',
    brand: 'Dongs',
    category: 'grinding',
    description: 'Качественное оборудование по конкурентным ценам.',
    specifications: ['Оптимальная цена', 'Хорошее качество', 'Быстрая поставка'],
    badge: '',
    featured: false
  },
  {
    id: 7,
    name: 'Эрозионные станки',
    brand: 'Эрозия',
    category: 'erosion',
    description: 'Специализированные эрозионные станки для сложных операций.',
    specifications: ['Электроэрозия', 'Высокая точность', 'Комплексные формы'],
    badge: '',
    featured: false
  }
];

let currentView = 'grid';
let filteredData = [...catalogData];

// Initialize catalog functionality
function initCatalog() {
  if (!document.getElementById('catalog-grid')) return;
  
  renderCatalog();
  initSearch();
  initFilters();
  initViewToggle();
  updateResultsCount();
}

// Render catalog products
function renderCatalog() {
  const grid = document.getElementById('catalog-grid');
  if (!grid) return;
  
  grid.innerHTML = '';
  
  filteredData.forEach(product => {
    const card = createProductCard(product);
    grid.appendChild(card);
  });
}

// Create product card HTML
function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.setAttribute('data-category', product.category);
  card.setAttribute('data-brand', product.brand.toLowerCase());
  
  card.innerHTML = `
    <div class="product-card-image">
      ${product.badge ? `<div class="product-card-badge">${product.badge}</div>` : ''}
    </div>
    <div class="product-card-content">
      <div class="product-card-header">
        <div class="product-card-brand">${product.brand}</div>
        <h3 class="product-card-title">${product.name}</h3>
        <div class="product-card-category">${getCategoryName(product.category)}</div>
      </div>
      <div class="product-card-description">${product.description}</div>
      <div class="product-card-specs">
        <h4>Основные характеристики:</h4>
        <div class="product-specs-list">
          ${product.specifications.map(spec => `<span class="spec-item">${spec}</span>`).join('')}
        </div>
      </div>
      <div class="product-card-actions">
        <button class="btn-card-primary" onclick="addProductToCart(${product.id})">Добавить в корзину</button>
        <button class="btn-card-secondary">Подробнее</button>
      </div>
    </div>
  `;
  
  return card;
}

// Get category display name
function getCategoryName(category) {
  const categoryNames = {
    'milling': 'Фрезерные станки',
    'grinding': 'Шлифовальные станки',
    'laser': 'Лазерное оборудование',
    'erosion': 'Эрозионные станки'
  };
  return categoryNames[category] || category;
}

// Add product to cart
function addProductToCart(productId) {
  const product = catalogData.find(p => p.id === productId);
  if (product) {
    addToCart({
      name: product.name,
      brand: product.brand,
      category: product.category,
      type: getCategoryName(product.category),
      comment: product.description
    });
  }
}

// Initialize search functionality
function initSearch() {
  const searchInput = document.getElementById('catalog-search');
  if (!searchInput) return;
  
  let debounceTimer;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      filterCatalog();
    }, 300);
  });
}

// Initialize filter functionality
function initFilters() {
  // Category filters
  const categoryInputs = document.querySelectorAll('input[name="category"]');
  categoryInputs.forEach(input => {
    input.addEventListener('change', filterCatalog);
  });
  
  // Brand filters
  const brandInputs = document.querySelectorAll('.filter-group input[type="checkbox"]');
  brandInputs.forEach(input => {
    input.addEventListener('change', filterCatalog);
  });
  
  // Reset filters
  const resetButton = document.querySelector('.filter-reset');
  if (resetButton) {
    resetButton.addEventListener('click', resetFilters);
  }
}

// Filter catalog based on current selections
function filterCatalog() {
  const searchTerm = document.getElementById('catalog-search')?.value.toLowerCase() || '';
  const selectedCategory = document.querySelector('input[name="category"]:checked')?.value || 'all';
  const selectedBrands = Array.from(document.querySelectorAll('.filter-group input[type="checkbox"]:checked'))
    .map(input => input.value);
  
  filteredData = catalogData.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                         product.brand.toLowerCase().includes(searchTerm) ||
                         product.description.toLowerCase().includes(searchTerm);
    
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    const matchesBrand = selectedBrands.length === 0 || 
                        selectedBrands.includes(product.brand.toLowerCase());
    
    return matchesSearch && matchesCategory && matchesBrand;
  });
  
  renderCatalog();
  updateResultsCount();
}

// Reset all filters
function resetFilters() {
  document.getElementById('catalog-search').value = '';
  document.querySelector('input[name="category"][value="all"]').checked = true;
  document.querySelectorAll('.filter-group input[type="checkbox"]').forEach(input => {
    input.checked = false;
  });
  filterCatalog();
}

// Initialize view toggle
function initViewToggle() {
  const toggleButtons = document.querySelectorAll('.view-toggle');
  toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
      const view = button.dataset.view;
      switchView(view);
    });
  });
}

// Switch between grid and list view
function switchView(view) {
  currentView = view;
  const grid = document.getElementById('catalog-grid');
  const toggleButtons = document.querySelectorAll('.view-toggle');
  
  // Update active button
  toggleButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === view);
  });
  
  // Update grid class
  grid.className = view === 'list' ? 'catalog-grid list-view' : 'catalog-grid';
}

// Update results count
function updateResultsCount() {
  const countElement = document.getElementById('results-count');
  if (countElement) {
    countElement.textContent = filteredData.length;
  }
}

// Initialize catalog on catalog page
if (window.location.pathname.endsWith('catalog.html')) {
  document.addEventListener('DOMContentLoaded', initCatalog);
} 