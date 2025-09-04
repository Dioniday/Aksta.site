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
        <button class="btn-card-primary" onclick="addProductToCart(${product.id})">Добавить в корзину</button>
        <button class="btn-card-secondary" onclick="showProductDetails(${product.id})">
          ${product.detailedSpecs ? 'Подробные характеристики' : 'Подробнее'}
        </button>
      </div>
    </div>
  `;
  
  return card;
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

// Initialize catalog on catalog page
if (window.location.pathname.endsWith('catalog.html')) {
  document.addEventListener('DOMContentLoaded', initCatalog);
}
