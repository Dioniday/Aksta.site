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
document.addEventListener('DOMContentLoaded', () => {
  initMobileNavigation();
  // Инициализация счётчика корзины на всех страницах
  try { updateCartCounter(); } catch {}
  try { initCircularText(); } catch {}
  try { initExpertiseCloudLazy(); } catch {}
});

function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  // Меняем иконку кнопки (если она есть на странице)
  if (themeToggle) {
    themeToggle.innerHTML = theme === 'dark' ? '🌙' : '☀️';
  }
}

// Инициализация темы при загрузке
(function() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    // По умолчанию теперь тёмная тема
    setTheme('dark');
  }
})();

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
}

// ================= CONTACTS PAGE: Circular Text =================
function initCircularText() {
  const wrapper = document.querySelector('.circular-wrapper');
  if (!wrapper) return; // Not on contacts page
  const ring = wrapper.querySelector('.circular-text');
  if (!ring) return;
  const sourceSpan = ring.querySelector('span');
  if (!sourceSpan) return;

  const text = sourceSpan.textContent.trim();
  // Clear old content
  ring.innerHTML = '';
  const characters = [...text];
  const total = characters.length;
  const radius = (wrapper.offsetWidth / 2) - 20; // inner padding offset

  characters.forEach((ch, i) => {
    const angle = (360 / total) * i; // degrees
    const letter = document.createElement('span');
    letter.className = 'circular-letter';
    letter.textContent = ch;
    letter.style.setProperty('--char-rotate', angle + 'deg');
    letter.style.transform = `rotate(${angle}deg) translateY(-${radius}px)`;
    ring.appendChild(letter);
  });

  ring.classList.add('circular-built');

  // Handle resize for responsiveness (debounced)
  let resizeTO;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTO);
    resizeTO = setTimeout(() => rebuildCircular(ring, wrapper, characters), 180);
  });
}

function rebuildCircular(ring, wrapper, characters) {
  const letters = ring.querySelectorAll('.circular-letter');
  const radius = (wrapper.offsetWidth / 2) - 20;
  const total = characters.length;
  letters.forEach((letter, i) => {
    const angle = (360 / total) * i;
    letter.style.transform = `rotate(${angle}deg) translateY(-${radius}px)`;
  });
}

// ================= Expertise Cloud (lazy animation) =================
function initExpertiseCloudLazy() {
  const cloud = document.querySelector('.expertise-cloud');
  if (!cloud) return;
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        requestAnimationFrame(() => cloud.classList.add('animate'));
        obs.disconnect();
      }
    });
  }, { threshold: 0.25 });
  observer.observe(cloud);
}

// Respect user motion preference
const mediaReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
if (mediaReduce.matches) {
  document.documentElement.classList.add('reduce-motion');
}
mediaReduce.addEventListener('change', (e) => {
  document.documentElement.classList.toggle('reduce-motion', e.matches);
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
  // Existing generic equipment
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
  
  // Esuntek EDM Series - Detailed products
  {
    id: 8,
    name: 'EFH43S/I',
    brand: 'Esuntek',
    category: 'erosion',
    subcategory: 'wire-cut',
    description: 'Проволочно-вырезной электроэрозионный станок с серводвигателем интегрированного типа',
    specifications: ['Ход X,Y: 400×350 мм', 'Толщина реза: до 300 мм', 'Точность: ±0.005 мм', 'Шероховатость: Ra ≤0.6μm'],
    badge: 'EDM',
    featured: true,
    detailedSpecs: {
      'Перемещение по осям X,Y': '400×350 мм',
      'Перемещение по оси Z': '250 мм',
      'Перемещение по осям U,V': '60×60 мм',
      'Размер стола': '660×505 мм',
      'Максимальная толщина реза': '300 мм (опция 400,500)',
      'Максимальный угол наклона': '±10°/80mm (опция 15°,30°,45°)',
      'Максимальный вес заготовки': '500 кг',
      'Размер станка': '1100×1700×2100 мм',
      'Вес станка': '2100 кг',
      'Электропитание': '380В±10% 50-60 Гц',
      'Энергопотребление': '<3.0 кВт',
      'Точность обработки': '≤ ±0.005 мм',
      'Шероховатость': 'Ra ≤0.6μm',
      'Скорость обработки': '0-250 мм²/мин',
      'Диаметр проволоки': 'Φ0.13-φ0.2mm (Молибден)',
      'Тип двигателя': 'Серводвигатель Panasonic (Япония)',
      'Числовое управление': '4 оси: X-Y-U-V'
    }
  },
  {
    id: 9,
    name: 'EFH54S/I',
    brand: 'Esuntek',
    category: 'erosion',
    subcategory: 'wire-cut',
    description: 'Средний проволочно-вырезной станок серии SI с увеличенным рабочим столом',
    specifications: ['Ход X,Y: 500×400 мм', 'Толщина реза: до 300 мм', 'Точность: ±0.005 мм', 'Вес заготовки: до 700 кг'],
    badge: 'EDM',
    featured: true,
    detailedSpecs: {
      'Перемещение по осям X,Y': '500×400 мм',
      'Перемещение по оси Z': '250 мм',
      'Размер стола': '780×555 мм',
      'Максимальный размер заготовки': '880×610 мм',
      'Максимальный вес заготовки': '700 кг',
      'Размер станка': '1400×1800×2100 мм',
      'Вес станка': '2600 кг',
      'Энергопотребление': '<3.5 кВт'
    }
  },
  {
    id: 10,
    name: 'EFH65S/I',
    brand: 'Esuntek',
    category: 'erosion',
    subcategory: 'wire-cut',
    description: 'Крупный проволочно-вырезной станок для серийного производства',
    specifications: ['Ход X,Y: 600×500 мм', 'Толщина реза: до 300 мм', 'Вес заготовки: до 900 кг', 'Высокая производительность'],
    badge: 'EDM',
    featured: true,
    detailedSpecs: {
      'Перемещение по осям X,Y': '600×500 мм',
      'Размер стола': '880×680 мм',
      'Максимальный размер заготовки': '980×720 мм',
      'Максимальный вес заготовки': '900 кг',
      'Размер станка': '1750×2150×2100 мм',
      'Вес станка': '3000 кг'
    }
  },
  {
    id: 11,
    name: 'EFH86S/I',
    brand: 'Esuntek',
    category: 'erosion',
    subcategory: 'wire-cut',
    description: 'Промышленный проволочно-вырезной станок для крупногабаритных деталей',
    specifications: ['Ход X,Y: 800×600 мм', 'Толщина реза: до 300 мм', 'Вес заготовки: до 1200 кг', 'Промышленное производство'],
    badge: 'EDM',
    featured: true,
    detailedSpecs: {
      'Перемещение по осям X,Y': '800×600 мм',
      'Размер стола': '990×775 мм',
      'Максимальный размер заготовки': '1100×840 мм',
      'Максимальный вес заготовки': '1200 кг',
      'Размер станка': '2100×2300×2200 мм',
      'Вес станка': '3600 кг'
    }
  },
  {
    id: 12,
    name: 'EH43-B/C Супердрель',
    brand: 'Esuntek',
    category: 'erosion',
    subcategory: 'drill',
    description: 'Электроэрозионный сверлильный станок для точного сверления отверстий',
    specifications: ['Ход осей: 400×300×380 мм', 'Диаметр электрода: φ0.2-φ3.0 мм', 'Глубина/диаметр: до 300:1', 'Высокая точность'],
    badge: 'Супердрель',
    featured: true,
    detailedSpecs: {
      'Перемещение по осям': '400×300×380(W300) мм',
      'Ход рабочего стола': '500×380 мм',
      'Диаметр электрода': 'φ0.2-φ3.0 мм',
      'Максимальная толщина реза': '300 мм',
      'Разрешение': '0.005 мм',
      'Скорость обработки': '30-60 мм/мин',
      'Максимальное соотношение глубины к диаметру': '300:1',
      'Максимальный вес заготовки': '200 кг',
      'Макс. рабочий ток': '35 А',
      'Электропитание': 'AC3~380V/50-60HZ',
      'Энергопотребление': '3.5 кВт',
      'Размер машины': '1200×1100×1900 мм',
      'Вес машины': '550 кг'
    }
  },
  {
    id: 13,
    name: 'VG400 Погружной',
    brand: 'Esuntek',
    category: 'erosion',
    subcategory: 'wire-cut',
    description: 'Погружной проволочно-вырезной станок с автоматической заправкой проволоки',
    specifications: ['Размеры заготовки: 750×550×215 мм', 'Масса заготовки: 500 кг', 'Ход X/Y: 400×300 мм', 'Автозаправка проволоки'],
    badge: 'VG Series',
    featured: true,
    detailedSpecs: {
      'Макс. размеры заготовки': '750×550×215 мм',
      'Макс. масса заготовки': '500 кг',
      'Ход по осям X/Y': '400×300 мм',
      'Ход по осям U/V': '80×80 мм',
      'Ход по оси Z': '220 мм',
      'Диаметр проволоки-электрода': '0.15~0.3 мм',
      'Число осей управления': '5 осей, серводвигатели переменного тока',
      'Макс. угол конусного резания': '±22°/80 мм',
      'Размеры станка': '2100×2300×2200 мм',
      'Масса станка': '2700 кг',
      'Емкость водяного бака': '600 л'
    }
  }
];

let currentView = 'grid';
let filteredData = [...catalogData];

// Initialize catalog functionality
function initCatalog() {
  if (!document.getElementById('catalog-grid')) return;
  
  // Set initial filtered data
  filteredData = [...catalogData];
  
  renderCatalog();
  initSearch();
  initFilters();
  initViewToggle();
  updateResultsCount();
  
  console.log('Catalog initialized with', catalogData.length, 'products');
}

// Render catalog products
function renderCatalog() {
  const grid = document.getElementById('catalog-grid');
  if (!grid) {
    console.warn('Catalog grid not found!');
    return;
  }
  
  grid.innerHTML = '';
  
  if (filteredData.length === 0) {
    grid.innerHTML = `
      <div class="no-products" style="
        grid-column: 1 / -1;
        text-align: center;
        padding: 3rem;
        color: var(--text-secondary);
      ">
        <h3>🔍 Ничего не найдено</h3>
        <p>Попробуйте изменить параметры поиска или фильтры</p>
        <button class="btn-secondary" onclick="resetFilters()">Очистить фильтры</button>
      </div>
    `;
    return;
  }
  
  filteredData.forEach((product, index) => {
    const card = createProductCard(product);
    grid.appendChild(card);
  });
  
  console.log('Rendered', filteredData.length, 'product cards');
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
      ${getProductIcon(product.category, product.subcategory)}
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
        <button class="btn-card-primary" onclick="handleAddToCartClick(this, ${product.id})">Добавить в корзину</button>
        <button class="btn-card-secondary" onclick="showProductDetails(${product.id})">
          ${product.detailedSpecs ? 'Характеристики' : 'Подробнее'}
        </button>
      </div>
    </div>
  `;
  
  return card;
}

// UX-обработчик клика по кнопке добавления в корзину
function handleAddToCartClick(btn, productId) {
  if (!btn) return addProductToCart(productId);
  btn.disabled = true;
  const prevText = btn.textContent;
  btn.textContent = '✅ Добавлено';
  addProductToCart(productId);
  setTimeout(() => {
    btn.disabled = false;
    btn.textContent = prevText;
  }, 1200);
}

// Get product icon based on category
function getProductIcon(category, subcategory) {
  if (category === 'erosion') {
    if (subcategory === 'wire-cut') return '⚡';
    if (subcategory === 'drill') return '🔩';
    return '⚡';
  }
  if (category === 'milling') return '⚙️';
  if (category === 'grinding') return '🔧';
  if (category === 'laser') return '🔥';
  return '🏭';
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


// Filter catalog based on current selections
function filterCatalog() {
  const searchTerm = document.getElementById('catalog-search')?.value.toLowerCase() || '';
  const selectedCategory = document.querySelector('input[name="category"]:checked')?.value || 'all';
  const selectedBrands = Array.from(document.querySelectorAll('.filter-group input[type="checkbox"]:checked'))
    .map(input => input.value.toLowerCase());
  
  filteredData = catalogData.filter(product => {
    // Search matching
    const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                         product.brand.toLowerCase().includes(searchTerm) ||
                         product.description.toLowerCase().includes(searchTerm);
    
    // Category matching
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    // Brand matching - improved logic
    let matchesBrand = selectedBrands.length === 0;
    if (selectedBrands.length > 0) {
      const productBrand = product.brand.toLowerCase();
      matchesBrand = selectedBrands.some(selectedBrand => {
        // Direct match
        if (productBrand === selectedBrand) return true;
        // Handle special cases
        if (selectedBrand === 'esuntek' && productBrand === 'esuntek') return true;
        if (selectedBrand === 'dongs' && productBrand === 'dongs') return true;
        return false;
      });
    }
    
    return matchesSearch && matchesCategory && matchesBrand;
  });
  
  console.log('Filtered products:', filteredData.length); // Для отладки
  renderCatalog();
  updateResultsCount();
}

// Reset all filters
function resetFilters() {
  const searchInput = document.getElementById('catalog-search');
  if (searchInput) searchInput.value = '';
  
  const allCategoryRadio = document.querySelector('input[name="category"][value="all"]');
  if (allCategoryRadio) allCategoryRadio.checked = true;
  
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
  
  // Update pagination info if needed
  const paginationInfo = document.querySelector('.pagination-info');
  if (paginationInfo && filteredData.length > 0) {
    paginationInfo.textContent = `Страница 1 из 1`;
  }
}

// Product Details Modal Functionality
function showProductDetails(productId) {
  const product = catalogData.find(p => p.id === productId);
  if (!product || !product.detailedSpecs) {
    showToast('Детальные характеристики не доступны', 'info');
    return;
  }
  
  // Create modal if it doesn't exist
  let modal = document.getElementById('product-details-modal');
  if (!modal) {
    modal = createProductModal();
    document.body.appendChild(modal);
  }
  
  // Populate modal with product details
  const modalTitle = modal.querySelector('.modal-title');
  const modalBody = modal.querySelector('.modal-body');
  
  modalTitle.textContent = `${product.brand} ${product.name}`;
  
  modalBody.innerHTML = `
    <div class="product-modal-info">
      <div class="product-modal-header">
        <div class="product-badge">${product.badge || ''}</div>
        <p class="product-description">${product.description}</p>
      </div>
      <div class="specs-section">
        <h3>Технические характеристики</h3>
        <div class="specs-grid">
          ${Object.entries(product.detailedSpecs)
            .map(([key, value]) => `
              <div class="spec-row">
                <div class="spec-label">${key}:</div>
                <div class="spec-value">${value}</div>
              </div>
            `).join('')}
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn-card-primary" onclick="addProductToCart(${product.id}); closeModal()">
          Добавить в корзину
        </button>
      </div>
    </div>
  `;
  
  // Show modal
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function createProductModal() {
  const modal = document.createElement('div');
  modal.id = 'product-details-modal';
  modal.className = 'modal';
  
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title"></h2>
        <button class="modal-close" onclick="closeModal()" aria-label="Закрыть">×</button>
      </div>
      <div class="modal-body"></div>
    </div>
  `;
  
  // Close modal on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // Close modal on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
      closeModal();
    }
  });
  
  return modal;
}

function closeModal() {
  const modal = document.getElementById('product-details-modal');
  if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }
}

// Initialize filter functionality
function initFilters() {
  // Add Esuntek to brand filters dynamically
  addEsuntekFilter();
  
  // Category filters
  const categoryInputs = document.querySelectorAll('input[name="category"]');
  categoryInputs.forEach(input => {
    input.addEventListener('change', filterCatalog);
  });
  
  // Brand filters - get all checkboxes after adding Esuntek
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

// Add Esuntek filter option
function addEsuntekFilter() {
  const brandSections = document.querySelectorAll('.filter-section');
  let brandSection = null;
  
  // Find the brands section
  brandSections.forEach(section => {
    const heading = section.querySelector('h3');
    if (heading && heading.textContent.trim() === 'Бренды') {
      brandSection = section.querySelector('.filter-group');
    }
  });
  
  if (brandSection && !brandSection.querySelector('input[value="esuntek"]')) {
    const esuntekOption = document.createElement('label');
    esuntekOption.className = 'filter-option';
    esuntekOption.innerHTML = `
      <input type="checkbox" value="esuntek">
      <span>Esuntek</span>
    `;
    
    // Add event listener immediately
    const checkbox = esuntekOption.querySelector('input');
    checkbox.addEventListener('change', filterCatalog);
    
    brandSection.appendChild(esuntekOption);
  }
}

// New Cart Functions
function showQuestionsModal() {
  const modal = document.getElementById('questions-modal');
  if (modal) {
    modal.classList.add('show');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closeQuestionsModal() {
  const modal = document.getElementById('questions-modal');
  if (modal) {
    modal.classList.remove('show');
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

function clearCartWithConfirm() {
  if (confirm('Вы уверены, что хотите очистить корзину?')) {
    clearCart();
    updateCartCounter();
    renderCart();
    updateCartTotalCount();
    showToast('Корзина очищена', 'success');
  }
}

// Update cart total count in new cart design
function updateCartTotalCount() {
  const cart = getCart();
  const totalCountElement = document.getElementById('cart-total-count');
  
  if (totalCountElement) {
    totalCountElement.textContent = cart.length;
  }
}

// Enhanced cart rendering for new design
function renderCart() {
  const cartItemsDiv = document.getElementById('cart-items');
  if (!cartItemsDiv) return;
  
  const cart = getCart();
  
  if (cart.length === 0) {
    cartItemsDiv.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <h3>Ваша корзина пуста</h3>
        <p>Добавьте оборудование из каталога, чтобы оформить запрос</p>
        <a href="catalog.html" class="btn-main">Перейти в каталог</a>
      </div>
    `;
    return;
  }
  
  let html = '<div class="cart-items-list">';
  cart.forEach((item, index) => {
    html += `
      <div class="cart-item modern-card" data-index="${index}">
        <div class="cart-item-image">
          <div class="cart-item-placeholder">🏭</div>
        </div>
        <div class="cart-item-content">
          <div class="cart-item-header">
            <h4 class="cart-item-name">${item.name}</h4>
            <button class="cart-item-remove" onclick="removeCartItem(${index})" aria-label="Удалить товар">✕</button>
          </div>
          <div class="cart-item-details">
            <span class="cart-item-brand">🏢 ${item.brand || ''}</span>
            <span class="cart-item-category">📍 ${item.type || ''}</span>
          </div>
          <div class="cart-item-description">${item.comment || ''}</div>
          <div class="cart-item-meta">
            <span class="cart-item-date">📅 ${formatDate(item.dateAdded)}</span>
            <span class="cart-item-priority priority-${item.priority || 'normal'}">${getPriorityText(item.priority)}</span>
          </div>
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
  
  // Update total count
  updateCartTotalCount();
}

// Get priority text
function getPriorityText(priority) {
  switch(priority) {
    case 'high': return '⚡ Высокий';
    case 'low': return '🔽 Низкий';
    default: return '🔸 Обычный';
  }
}

// Enhanced remove cart item with animation
function removeCartItem(index) {
  const cart = getCart();
  const item = cart[index];
  
  if (confirm(`Удалить "${item.name}" из корзины?`)) {
    // Add remove animation
    const cartItemElement = document.querySelector(`[data-index="${index}"]`);
    if (cartItemElement) {
      cartItemElement.style.animation = 'fadeOutRight 0.3s ease-out';
      setTimeout(() => {
        cart.splice(index, 1);
        setCart(cart);
        updateCartCounter();
        renderCart();
        showToast('Товар удалён из корзины', 'success');
      }, 300);
    }
  }
}

// Initialize cart page
function initCartPage() {
  renderCart();
  updateCartCounter();
  updateCartTotalCount();
}

// Quick Request Modal Functions
function showQuickRequestModal() {
  const cart = getCart();
  
  if (cart.length === 0) {
    showToast('Корзина пуста! Добавьте товары для отправки запроса.', 'error');
    return;
  }
  
  const modal = document.getElementById('quick-request-modal');
  if (modal) {
    // Обновляем список товаров
    updateQuickRequestItems();
    
    modal.classList.add('show');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closeQuickRequestModal() {
  const modal = document.getElementById('quick-request-modal');
  if (modal) {
    modal.classList.remove('show');
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

function updateQuickRequestItems() {
  const cart = getCart();
  const itemsContainer = document.getElementById('quick-request-items');
  
  if (!itemsContainer) return;
  
  let html = '';
  
  if (cart.length === 0) {
    html = '<p class="no-items">🙁 Корзина пуста</p>';
  } else {
    cart.forEach((item, index) => {
      html += `
        <div class="request-item">
          <div class="item-info">
            <div class="item-icon">🏭</div>
            <div class="item-details">
              <strong>${item.name}</strong>
              <small>🏢 ${item.brand || 'Не указан'} | 📍 ${item.type || 'Не указан'}</small>
              ${item.comment ? `<p class="item-comment">${item.comment}</p>` : ''}
            </div>
          </div>
        </div>
      `;
    });
  }
  
  itemsContainer.innerHTML = html;
}

// Handle quick request form submission
function initQuickRequestForm() {
  const form = document.getElementById('quick-request-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(form);
      const cart = getCart();
      
      // Собираем данные для отправки
      const requestData = {
        company: formData.get('company'),
        contact: formData.get('contact'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        comment: formData.get('comment'),
        items: cart,
        timestamp: new Date().toISOString(),
        type: 'quick_request'
      };
      
      // Отправляем запрос
      sendQuickRequest(requestData);
    });
  }
}

function sendQuickRequest(data) {
  // Формируем письмо через mailto на указанный ящик
  try {
    const subject = encodeURIComponent(`Быстрый запрос КП — ${data.company || ''}`);
    const bodyLines = [
      `Компания: ${data.company || ''}`,
      `Контактное лицо: ${data.contact || ''}`,
      `Телефон: ${data.phone || ''}`,
      `Email: ${data.email || ''}`,
      `Комментарий: ${data.comment || ''}`,
      '',
      'Товары:',
      ...(data.items || []).map((it, i) => `${i + 1}. ${it.name} | ${it.brand} | ${it.type}`),
      '',
      `Отправлено: ${new Date().toLocaleString('ru-RU')}`
    ];
    const body = encodeURIComponent(bodyLines.join('\n'));
    const mailto = `mailto:aksta.llc@gmail.com?subject=${subject}&body=${body}`;
    window.location.href = mailto;
  } catch (e) {
    console.warn('Не удалось открыть почтовый клиент:', e);
  }
  
  // Показываем сообщение об отправке
  showToast(`Запрос отправлен! Мы свяжемся с вами в течение 24 часов.`, 'success');
  
  // Закрываем модальное окно
  closeQuickRequestModal();
  
  // Очищаем корзину после отправки
  setTimeout(() => {
    clearCart();
    updateCartCounter();
    renderCart();
    updateCartTotalCount();
  }, 1000);
  
  // Здесь будет реальная отправка на сервер
  // sendEmailRequest(data);
}

// Initialize cart on cart page
if (window.location.pathname.endsWith('cart.html')) {
  document.addEventListener('DOMContentLoaded', () => {
    initCartPage();
    initQuickRequestForm();
  });
}

// Anketa Form Handler
function initAnketaForm() {
  const form = document.getElementById('anketa-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(form);
      
      const anketaData = {
        company: formData.get('company'),
        contact: formData.get('contact'),
        contactMethod: formData.get('contact-method'),
        q1: formData.get('q1'),
        q2: formData.get('q2'),
        q3: formData.get('q3'),
        q4: formData.get('q4'),
        q5: formData.get('q5'),
        q6: formData.get('q6'),
        timestamp: new Date().toISOString(),
        type: 'full_anketa'
      };
      
      sendAnketa(anketaData);
    });
  }
}

function sendAnketa(data) {
  // Отправка через mailto
  try {
    const subject = encodeURIComponent(`Анкета — ${data.company || ''}`);
    const bodyLines = [
      `Компания: ${data.company || ''}`,
      `Контактное лицо: ${data.contact || ''}`,
      `Способ связи: ${data.contactMethod || ''}`,
      '',
      `1) ${data.q1 || ''}`,
      `2) ${data.q2 || ''}`,
      `3) ${data.q3 || ''}`,
      `4) ${data.q4 || ''}`,
      `5) ${data.q5 || ''}`,
      `6) ${data.q6 || ''}`,
      '',
      `Отправлено: ${new Date().toLocaleString('ru-RU')}`
    ];
    const body = encodeURIComponent(bodyLines.join('\n'));
    const mailto = `mailto:aksta.llc@gmail.com?subject=${subject}&body=${body}`;
    window.location.href = mailto;
  } catch (e) {
    console.warn('Не удалось открыть почтовый клиент:', e);
  }
  
  // Показываем сообщение об отправке
  showToast('Анкета отправлена! Мы свяжемся с вами в течение 24 часов.', 'success');
  
  // Очищаем форму
  const form = document.getElementById('anketa-form');
  if (form) {
    form.reset();
  }
  
  // Здесь будет реальная отправка на сервер
  /*
  // Пример отправки на сервер
  fetch('/send-anketa', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(result => {
    showToast('Анкета отправлена!', 'success');
  })
  .catch(error => {
    showToast('Ошибка отправки. Попробуйте позже.', 'error');
  });
  */
}

// Initialize anketa form on anketa page
if (window.location.pathname.endsWith('anketa.html')) {
  document.addEventListener('DOMContentLoaded', initAnketaForm);
}

// Initialize catalog on catalog page
if (window.location.pathname.endsWith('catalog.html')) {
  document.addEventListener('DOMContentLoaded', initCatalog);
}

// ================= Dynamic Catalogs (All files) =================
function initDynamicCatalogs(){
  const grid = document.getElementById('allCatalogsGrid');
  if(!grid) return; // not on page

  const searchInput = document.getElementById('catalogSearch');
  const typeSelect = document.getElementById('catalogTypeFilter');
  const statsEl = document.querySelector('.catalogs-stats');

  const groups = [
    {
      group: 'Новые 2025',
      highlight: true,
      files: [
        'Новые каталоги 2025_[2025] Сверление.pdf',
        'Новые каталоги 2025_[2025] Фрезерование.pdf',
        'Новые каталоги 2_[2025] Inserts.pdf',
        'Новые каталоги 2_[2025]Threading.pdf',
        'Отрезка и обработка канавок NEW 2025.pdf',
        'Фрезерные корпуса NEW 2025.pdf'
      ]
    },
    {
      group: 'Esuntek EDM',
      files: [ 'Esuntek EDM Machine J.pdf' ]
    },
    {
      group: 'DONGS',
      files: [ 'DONGS.xlsx','DONGS Vertical .xlsx' ]
    },
    {
      group: 'HDCNC (华东数控)',
      files: [ 'HDCNC华东数控产品综合样本.pdf' ]
    },
    {
      group: 'Bright Tools',
      files: [ '2025Bright Tools金杰样册.pdf' ]
    },
    {
      group: 'KTA Tools',
      files: [ 'KTA-Product-Catalouge.pdf' ]
    },
    {
      group: 'US Wheeler',
      files: [ 'US Wheeler-Catalog.pdf' ]
    },
    {
      group: 'Российский рынок',
      files: [ 'Инструмент для российского рынка.pdf','Инструмент_оснастка.pdf' ]
    }
  ];

  // Flatten for search & size fetch
  const data = groups.flatMap(g => g.files.map(name => {
    const lower = name.toLowerCase();
    const ext = lower.endsWith('.pdf') ? 'pdf' : (lower.endsWith('.xlsx') ? 'xlsx' : 'file');
    const is2025 = /2025|new 2025|\[2025]/i.test(name);
    const cleanTitle = name.replace(/_/g,' ').replace(/\s{2,}/g,' ').trim();
    return { group: g.group, highlight: !!g.highlight, name, title: cleanTitle, ext, path: `../catalogs/${name}`, tags: [is2025 ? '2025' : null].filter(Boolean), size: null };
  }));

  function render(){
    const q = (searchInput?.value || '').toLowerCase().trim();
    const t = (typeSelect?.value || '').toLowerCase();
    grid.innerHTML='';
    let shownGroups = 0;
    groups.forEach(g => {
      // Collect filtered files inside group
      const filesInGroup = data.filter(f => f.group === g.group).filter(f => {
        if(q && !f.title.toLowerCase().includes(q) && !f.group.toLowerCase().includes(q)) return false;
        if(t && f.ext !== t) return false;
        return true;
      });
      if(filesInGroup.length === 0) return;
      shownGroups++;
      grid.appendChild(buildGroupCard(g, filesInGroup));
    });
    if(shownGroups===0){
      const empty = document.createElement('div');
      empty.className='catalog-empty';
      empty.textContent='Ничего не найдено по текущему фильтру.';
      grid.appendChild(empty);
    }
    if(statsEl) statsEl.textContent = `Групп: ${shownGroups} / ${groups.length}`;
  }

  function buildGroupCard(groupMeta, files){
    const card = document.createElement('article');
    card.className='catalog-card';
    if(groupMeta.highlight) card.classList.add('catalog-card--highlight');
    card.setAttribute('role','group');
    card.tabIndex=0;
    const primaryFile = files[0];
    const iconMap = { pdf: '📄', xlsx: '📊', file: '📁' };
    const ico = iconMap[primaryFile.ext] || '📁';
    const uniqueExts = Array.from(new Set(files.map(f=>f.ext.toUpperCase()))).join('/');
    const tags = new Set(); files.forEach(f => f.tags.forEach(t => tags.add(t)));
    card.innerHTML = `
      <div class="catalog-card-header">
        <div class="catalog-card-ico" aria-hidden="true">${ico}</div>
        <div class="catalog-card-head-text">
          <div class="catalog-card-title">${escapeHtml(groupMeta.group)}</div>
          <div class="catalog-card-meta">${uniqueExts} • ${files.length} файл${files.length>1?'ов':''}</div>
          <div class="catalog-card-tags">${[...tags].map(t=>`<span class="catalog-tag accent">${t}</span>`).join('')}</div>
        </div>
      </div>
      <button class="catalog-card-pin" type="button" aria-label="Закрепить группу ${escapeHtml(groupMeta.group)}" aria-pressed="false" data-pin-btn>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17v5"/><path d="m8 21 4-4 4 4"/><path d="M7 11l5 5 5-5V6a5 5 0 1 0-10 0v5Z"/></svg>
      </button>
      <div class="catalog-group-files">
        ${files.map(f=>{
          const sizeStr = f.size ? formatSize(f.size) : '…';
          return `<div class="catalog-group-file" data-name="${escapeHtml(f.title)}" data-path="${encodeURI(f.path)}" data-ext="${f.ext}" role="button" tabindex="0" aria-label="Открыть ${escapeHtml(f.title)} (предпросмотр). Нажмите Ctrl+Enter чтобы скачать." aria-keyshortcuts="Enter Ctrl+Enter Space">
            <span class="cgf-icon" aria-hidden="true">${iconMap[f.ext] || '📁'}</span>
            <span class="cgf-name">${escapeHtml(f.title)}</span>
            <span class="cgf-size catalog-file-size">${sizeStr}</span>
            <div class="catalog-action-card card" role="group" aria-label="Действия с файлом ${escapeHtml(f.title)}">
              <p data-action="open" role="button" tabindex="0" aria-label="Открыть файл ${escapeHtml(f.title)}"><span>Открыть</span></p>
              <p data-action="download" role="button" tabindex="0" aria-label="Скачать файл ${escapeHtml(f.title)}"><span>Скачать</span></p>
            </div>
          </div>`;}).join('')}
      </div>`;
    return card;
  }

  function formatSize(bytes){
    if(bytes < 1024) return bytes + ' B';
    const kb = bytes/1024; if(kb < 1024) return kb.toFixed(kb>100?0:1)+' KB';
    const mb = kb/1024; return mb.toFixed(mb>100?0:1)+' MB';
  }

  function fetchSizes(){
    data.forEach(f => {
      fetch(encodeURI(f.path), { method:'HEAD' }).then(r => {
        const len = r.headers.get('Content-Length');
        if(len){
          f.size = parseInt(len,10);
          // update all occurrences of this file size
          const fileRows = grid.querySelectorAll('.catalog-group-file');
          fileRows.forEach(row => {
            const nameEl = row.querySelector('.cgf-name');
            if(nameEl && nameEl.textContent === f.title){
              const sizeEl = row.querySelector('.cgf-size');
              if(sizeEl) sizeEl.textContent = formatSize(f.size);
            }
          });
        }
      }).catch(()=>{});
    });
  }

  function escapeHtml(str){
    return str.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
  }

  function debounce(fn,delay){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a),delay); }; }

  searchInput?.addEventListener('input', debounce(render,140));
  typeSelect?.addEventListener('change', render);

  render();
  fetchSizes();
  
  // Delegated events for open/download
  grid.addEventListener('click', e => {
    const row = e.target.closest('.catalog-group-file');
    if(!row) return;
    const path = row.getAttribute('data-path');
    const seg = e.target.closest('.catalog-action-card.card p[data-action]');
    if(seg){
      const act = seg.getAttribute('data-action');
      if(act === 'download') triggerDownload(path); else window.open(path, '_blank', 'noopener');
      e.stopPropagation();
      return;
    }
    window.open(path, '_blank', 'noopener');
  });

  grid.addEventListener('keydown', e => {
    const row = e.target.closest('.catalog-group-file');
    if(!row) return;
    const path = row.getAttribute('data-path');
    const seg = e.target.closest('.catalog-action-card.card p[data-action]');
    if(seg && (e.key === 'Enter' || e.key === ' ')){
      e.preventDefault();
      const act = seg.getAttribute('data-action');
      if(e.ctrlKey){
        // Ctrl = обратное действие
        if(act === 'open') triggerDownload(path); else window.open(path, '_blank', 'noopener');
      } else {
        if(act === 'download') triggerDownload(path); else window.open(path, '_blank', 'noopener');
      }
      return;
    }
    if(!seg && (e.key === 'Enter' || e.key === ' ')){
      e.preventDefault();
      if(e.ctrlKey) triggerDownload(path); else window.open(path, '_blank', 'noopener');
    }
  });

  function triggerDownload(path){
    const a = document.createElement('a');
    a.href = path; a.download = '';
    document.body.appendChild(a);
    a.click();
    requestAnimationFrame(() => a.remove());
  }
}

// Запуск динамического списка одновременно с каталогом
if (window.location.pathname.endsWith('catalog.html')) {
  document.addEventListener('DOMContentLoaded', initDynamicCatalogs);
}

// Init tools/service request forms (standalone pages)
document.addEventListener('DOMContentLoaded', () => {
  // Prefill tools category from CTA buttons
  document.querySelectorAll('a[href="#tool-request"]').forEach(link => {
    link.addEventListener('click', () => {
      const val = link.getAttribute('data-category');
      const select = document.getElementById('tr-category');
      if (val && select) select.value = val;
    });
  });

  // Prefill service type from CTA buttons
  document.querySelectorAll('a[href="#service-request"]').forEach(link => {
    link.addEventListener('click', () => {
      const val = link.getAttribute('data-service');
      const select = document.getElementById('sr-type');
      if (val && select) select.value = val;
    });
  });
  // Tools request form
  const toolForm = document.getElementById('tool-request-form');
  if (toolForm) {
    toolForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(toolForm);
      const payload = {
        page: 'tools',
        category: fd.get('category'),
        company: fd.get('company'),
        contact: fd.get('contact'),
        email: fd.get('email'),
        comment: fd.get('comment')
      };
      const subject = encodeURIComponent(`Запрос инструмента — ${payload.category || ''} — ${payload.company || ''}`);
      const body = encodeURIComponent([
        `Категория: ${payload.category || ''}`,
        `Компания: ${payload.company || ''}`,
        `Контактное лицо: ${payload.contact || ''}`,
        `Email: ${payload.email || ''}`,
        `Комментарий: ${payload.comment || ''}`,
        `Отправлено: ${new Date().toLocaleString('ru-RU')}`
      ].join('\n'));
      window.location.href = `mailto:aksta.llc@gmail.com?subject=${subject}&body=${body}`;
      showToast('Запрос отправлен! Мы свяжемся с вами в течение 24 часов.', 'success');
      toolForm.reset();
    });
  }

  // Service request form
  const serviceForm = document.getElementById('service-request-form');
  if (serviceForm) {
    serviceForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(serviceForm);
      const payload = {
        page: 'service',
        service: fd.get('service'),
        company: fd.get('company'),
        contact: fd.get('contact'),
        email: fd.get('email'),
        comment: fd.get('comment')
      };
      const subject = encodeURIComponent(`Запрос сервиса — ${payload.service || ''} — ${payload.company || ''}`);
      const body = encodeURIComponent([
        `Услуга: ${payload.service || ''}`,
        `Компания: ${payload.company || ''}`,
        `Контактное лицо: ${payload.contact || ''}`,
        `Email: ${payload.email || ''}`,
        `Комментарий: ${payload.comment || ''}`,
        `Отправлено: ${new Date().toLocaleString('ru-RU')}`
      ].join('\n'));
      window.location.href = `mailto:aksta.llc@gmail.com?subject=${subject}&body=${body}`;
      showToast('Запрос отправлен! Мы свяжемся с вами в течение 24 часов.', 'success');
      serviceForm.reset();
    });
  }

  // Обновляем счётчик корзины после инициализации форм/страницы
  try { updateCartCounter(); } catch {}
});
