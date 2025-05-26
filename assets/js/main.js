// Переключатель темы inspired by https://uiverse.io/
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;

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

// --- КОРЗИНА ---
// Ключ для хранения корзины
const CART_KEY = 'aksta_cart';

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

// Добавить товар в корзину (пример функции, можно вызывать из каталога)
window.addToCart = function(item) {
  const cart = getCart();
  cart.push(item);
  setCart(cart);
  alert('Товар добавлен в корзину!');
};

// Отобразить корзину на странице cart.html
function renderCart() {
  const cartItemsDiv = document.getElementById('cart-items');
  if (!cartItemsDiv) return;
  const cart = getCart();
  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<p>Ваша корзина пуста.</p>';
    return;
  }
  let html = '<ul class="cart-list">';
  cart.forEach((item, i) => {
    html += `<li><b>${item.name}</b> (${item.type || ''})<br>Комментарий: ${item.comment || ''}</li>`;
  });
  html += '</ul>';
  cartItemsDiv.innerHTML = html;
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

// Инициализация отображения корзины
if (window.location.pathname.endsWith('cart.html')) {
  renderCart();
} 