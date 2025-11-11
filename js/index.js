// app.js

// Функционал корзины
class Cart {
   constructor() {
      this.items = this.loadCart();
      this.updateCartDisplay();
   }

   // Загрузка корзины из localStorage
   loadCart() {
      const savedCart = localStorage.getItem('3d-hub-cart');
      return savedCart ? JSON.parse(savedCart) : [];
   }

   // Сохранение корзины в localStorage
   saveCart() {
      localStorage.setItem('3d-hub-cart', JSON.stringify(this.items));
      this.updateHeaderCartCount();

      // Обновляем отображение на странице корзины, если она существует
      if (document.getElementById('cart-items')) {
         this.updateOrderSummary();
         this.renderCartItems();
      }
   }

   // Обновление счетчика в шапке
   updateHeaderCartCount() {
      const cartCount = document.querySelector('.cart-count');
      if (cartCount) {
         cartCount.textContent = this.getTotalCount();
      }
   }

   // Обновление отображения корзины
   updateCartDisplay() {
      this.updateHeaderCartCount();

      // Обновляем только если находимся на странице корзины
      if (document.getElementById('cart-items')) {
         this.updateOrderSummary();
         this.renderCartItems();
      }
   }

   // Получение общего количества товаров
   getTotalCount() {
      return this.items.reduce((total, item) => total + item.quantity, 0);
   }

   // Получение общей стоимости товаров
   getItemsTotal() {
      return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
   }

   // Получение стоимости доставки
   getShippingCost() {
      const total = this.getItemsTotal();
      return total > 0 ? (total > 100 ? 0 : 10) : 0;
   }

   // Получение итоговой суммы
   getOrderTotal() {
      return this.getItemsTotal() + this.getShippingCost();
   }

   // Добавление товара в корзину
   addItem(product) {
      const existingItem = this.items.find(item => item.id === product.id);

      if (existingItem) {
         existingItem.quantity += 1;
      } else {
         this.items.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
         });
      }

      this.saveCart();
      this.showNotification();
   }

   // Обновление сводки заказа
   updateOrderSummary() {
      const itemsTotalEl = document.getElementById('items-total');
      const shippingCostEl = document.getElementById('shipping-cost');
      const orderTotalEl = document.getElementById('order-total');
      const checkoutBtn = document.getElementById('checkout-btn');

      const itemsTotal = this.getItemsTotal();
      const shippingCost = this.getShippingCost();
      const orderTotal = this.getOrderTotal();

      if (itemsTotalEl) itemsTotalEl.textContent = `${itemsTotal} руб.`;
      if (shippingCostEl) shippingCostEl.textContent = `${shippingCost} руб.`;
      if (orderTotalEl) orderTotalEl.textContent = `${orderTotal} руб.`;

      // Обновление текста в сводке заказа
      const summaryRow = document.querySelector('.summary-row:first-child span:first-child');
      if (summaryRow) {
         summaryRow.textContent = `Товары (${this.getTotalCount()}):`;
      }

      // Блокировка кнопки оформления заказа, если корзина пуста
      if (checkoutBtn) {
         if (this.items.length === 0) {
            checkoutBtn.disabled = true;
            checkoutBtn.textContent = 'Корзина пуста';
            checkoutBtn.style.opacity = '0.7';
            checkoutBtn.style.cursor = 'not-allowed';
         } else {
            checkoutBtn.disabled = false;
            checkoutBtn.textContent = 'Оформить заказ';
            checkoutBtn.style.opacity = '1';
            checkoutBtn.style.cursor = 'pointer';
         }
      }
   }

   // Отображение товаров в корзине
   renderCartItems() {
      const cartItemsEl = document.getElementById('cart-items');
      if (!cartItemsEl) return;

      if (this.items.length === 0) {
         cartItemsEl.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">🛒</div>
                    <h2>Ваша корзина пуста</h2>
                    <p>Добавьте товары из каталога, чтобы сделать заказ</p>
                    <a href="index.html" class="checkout-btn" style="display: inline-block; width: auto; padding: 12px 30px;">Перейти к покупкам</a>
                </div>
            `;
         return;
      }

      let itemsHTML = '';

      this.items.forEach(item => {
         itemsHTML += `
                <div class="cart-item" data-id="${item.id}">
                    <div class="item-image">
                        <img src="${item.image || 'https://images.unsplash.com/photo-1581784368655-0f72a6b3d0c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'}" alt="${item.name}">
                    </div>
                    <div class="item-details">
                        <div class="item-name">${item.name}</div>
                        <div class="item-controls">
                            <div class="quantity-controls">
                                <button class="quantity-btn minus" data-id="${item.id}">-</button>
                                <span class="quantity">${item.quantity}</span>
                                <button class="quantity-btn plus" data-id="${item.id}">+</button>
                            </div>
                            <div class="item-price">${item.price * item.quantity} руб.</div>
                            <button class="remove-btn" data-id="${item.id}">Удалить</button>
                        </div>
                    </div>
                </div>
            `;
      });

      cartItemsEl.innerHTML = itemsHTML;

      // Добавление обработчиков для кнопок
      this.addEventListeners();
   }

   // Добавление обработчиков событий
   addEventListeners() {
      // Кнопки увеличения количества
      document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
         btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            this.increaseQuantity(id);
         });
      });

      // Кнопки уменьшения количества
      document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
         btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            this.decreaseQuantity(id);
         });
      });

      // Кнопки удаления
      document.querySelectorAll('.remove-btn').forEach(btn => {
         btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            this.removeItem(id);
         });
      });
   }

   // Увеличение количества товара
   increaseQuantity(id) {
      const item = this.items.find(item => item.id === id);
      if (item) {
         item.quantity += 1;
         this.saveCart();
      }
   }

   // Уменьшение количества товара
   decreaseQuantity(id) {
      const item = this.items.find(item => item.id === id);
      if (item) {
         if (item.quantity > 1) {
            item.quantity -= 1;
         } else {
            this.removeItem(id);
            return;
         }
         this.saveCart();
      }
   }

   // Удаление товара из корзины
   removeItem(id) {
      this.items = this.items.filter(item => item.id !== id);
      this.saveCart();
   }

   // Показать уведомление о добавлении в корзину
   showNotification() {
      const notification = document.querySelector('.cart-notification');
      if (notification) {
         notification.classList.add('show');

         setTimeout(() => {
            notification.classList.remove('show');
         }, 3000);
      }
   }

   // Оформление заказа
   checkout() {
      if (this.items.length === 0) {
         alert('Корзина пуста!');
         return;
      }

      // Открываем модальное окно оформления заказа
      openOrderModal();
   }

   // Очистка корзины после успешного заказа
   clear() {
      this.items = [];
      this.saveCart();
   }
}

// Инициализация слайдера на главной странице
function initSlider() {
   const swiperContainer = document.querySelector('.swiper-container');
   if (!swiperContainer) return;

   const swiper = new Swiper('.swiper-container', {
      direction: 'horizontal',
      loop: true,
      speed: 800,
      autoplay: {
         delay: 8000,
         disableOnInteraction: false,
      },
      pagination: {
         el: '.swiper-pagination',
         clickable: true,
      },
      simulateTouch: true,
      allowTouchMove: true,
      grabCursor: true,
   });
}

// Функционал бургер-меню
function initBurgerMenu() {
   const burger = document.querySelector('.burger');
   const navMenu = document.querySelector('.nav-menu');

   if (!burger || !navMenu) return;

   burger.addEventListener('click', function () {
      burger.classList.toggle('active');
      navMenu.classList.toggle('active');

      // Блокировка прокрутки тела при открытом меню
      if (navMenu.classList.contains('active')) {
         document.body.style.overflow = 'hidden';
      } else {
         document.body.style.overflow = 'auto';
      }
   });

   // Закрытие меню при клике на ссылку
   const navLinks = document.querySelectorAll('.nav-menu a');
   navLinks.forEach(link => {
      link.addEventListener('click', function () {
         burger.classList.remove('active');
         navMenu.classList.remove('active');
         document.body.style.overflow = 'auto';
      });
   });

   // Закрытие меню при клике вне его области
   document.addEventListener('click', function (event) {
      const isClickInsideNav = navMenu.contains(event.target);
      const isClickOnBurger = burger.contains(event.target);

      if (!isClickInsideNav && !isClickOnBurger && navMenu.classList.contains('active')) {
         burger.classList.remove('active');
         navMenu.classList.remove('active');
         document.body.style.overflow = 'auto';
      }
   });
}

// Функционал модального окна оформления заказа
function initOrderModal() {
   const orderModal = document.getElementById('order-modal');
   if (!orderModal) return;

   const modalClose = document.getElementById('modal-close');
   const cancelOrder = document.getElementById('cancel-order');
   const submitOrder = document.getElementById('submit-order');
   const orderForm = document.getElementById('order-form');
   const orderSuccess = document.getElementById('order-success');
   const successClose = document.getElementById('success-close');

   // Открытие модального окна
   window.openOrderModal = function () {
      orderModal.classList.add('active');
      document.body.style.overflow = 'hidden';
   }

   // Закрытие модального окна
   function closeOrderModal() {
      orderModal.classList.remove('active');
      document.body.style.overflow = 'auto';
      resetForm();
   }

   // Сброс формы
   function resetForm() {
      orderForm.reset();
      document.querySelectorAll('.error-message').forEach(el => {
         el.classList.remove('show');
      });
      document.querySelectorAll('.form-input').forEach(el => {
         el.classList.remove('error');
      });
      document.querySelectorAll('.delivery-option').forEach(el => {
         el.classList.remove('selected');
      });
   }

   // Показать сообщение об ошибке
   function showError(inputId, errorId) {
      document.getElementById(inputId).classList.add('error');
      document.getElementById(errorId).classList.add('show');
   }

   // Скрыть сообщение об ошибке
   function hideError(inputId, errorId) {
      document.getElementById(inputId).classList.remove('error');
      document.getElementById(errorId).classList.remove('show');
   }

   // Валидация формы
   function validateForm() {
      let isValid = true;

      // Проверка ФИО
      const fullName = document.getElementById('full-name').value.trim();
      if (fullName === '') {
         showError('full-name', 'name-error');
         isValid = false;
      } else {
         hideError('full-name', 'name-error');
      }

      // Проверка телефона
      const phone = document.getElementById('phone').value.trim();
      // Проверяем формат +375XXXXXXXXX
      const phoneRegex = /^\+375\d{9}$/;
      if (phone === '' || !phoneRegex.test(phone)) {
         showError('phone', 'phone-error');
         isValid = false;
      } else {
         hideError('phone', 'phone-error');
      }

      // Проверка адреса
      const address = document.getElementById('address').value.trim();
      if (address === '') {
         showError('address', 'address-error');
         isValid = false;
      } else {
         hideError('address', 'address-error');
      }

      // Проверка способа доставки
      const deliverySelected = document.querySelector('input[name="delivery"]:checked');
      if (!deliverySelected) {
         document.getElementById('delivery-error').classList.add('show');
         isValid = false;
      } else {
         document.getElementById('delivery-error').classList.remove('show');
      }

      return isValid;
   }

   // Обработчики для выбора способа доставки
   document.querySelectorAll('.delivery-option').forEach(option => {
      option.addEventListener('click', function () {
         document.querySelectorAll('.delivery-option').forEach(el => {
            el.classList.remove('selected');
         });
         this.classList.add('selected');
         const radio = this.querySelector('input[type="radio"]');
         radio.checked = true;

         // Скрываем ошибку при выборе способа доставки
         document.getElementById('delivery-error').classList.remove('show');
      });
   });

   // Закрытие модального окна
   modalClose.addEventListener('click', closeOrderModal);
   cancelOrder.addEventListener('click', closeOrderModal);

   // Обработка отправки формы
   submitOrder.addEventListener('click', function () {
      if (validateForm()) {
         // В реальном приложении здесь будет отправка данных на сервер

         // Показываем уведомление об успешном заказе
         orderModal.classList.remove('active');
         orderSuccess.classList.add('active');

         // Очищаем корзину
         if (window.cart) {
            window.cart.clear();
         }
      }
   });

   // Закрытие уведомления об успешном заказе
   successClose.addEventListener('click', function () {
      orderSuccess.classList.remove('active');
      document.body.style.overflow = 'auto';
   });

   // Обработчик для предотвращения закрытия модального окна при клике вне его
   orderModal.addEventListener('click', function (e) {
      // Предотвращаем закрытие при клике вне модального окна
      e.stopPropagation();
   });

   // Валидация полей в реальном времени
   document.getElementById('full-name').addEventListener('input', function () {
      if (this.value.trim() !== '') {
         hideError('full-name', 'name-error');
      }
   });

   document.getElementById('phone').addEventListener('input', function () {
      // Автоматически добавляем +375 если пользователь начинает вводить номер
      if (this.value.trim() === '') {
         hideError('phone', 'phone-error');
      } else if (!this.value.startsWith('+375')) {
         // Если пользователь начал вводить номер без +375, предлагаем добавить
         if (this.value.length <= 4 && !this.value.includes('+')) {
            this.value = '+375' + this.value;
         }
      }

      // Проверяем формат после ввода
      const phoneRegex = /^\+375\d{9}$/;
      if (phoneRegex.test(this.value)) {
         hideError('phone', 'phone-error');
      }
   });

   document.getElementById('address').addEventListener('input', function () {
      if (this.value.trim() !== '') {
         hideError('address', 'address-error');
      }
   });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
   // Инициализация корзины
   window.cart = new Cart();

   // Инициализация бургер-меню
   initBurgerMenu();

   // Инициализация слайдера (только на главной странице)
   initSlider();

   // Инициализация модального окна оформления заказа (только на странице корзины)
   initOrderModal();

   // Обработчики для кнопок "В корзину" на главной странице
   const buyButtons = document.querySelectorAll('.buy-btn');
   buyButtons.forEach(button => {
      button.addEventListener('click', function () {
         const product = {
            id: this.getAttribute('data-id'),
            name: this.getAttribute('data-name'),
            price: parseFloat(this.getAttribute('data-price')),
            image: this.getAttribute('data-image')
         };

         window.cart.addItem(product);
      });
   });

   // Обработчик для кнопки оформления заказа на странице корзины
   const checkoutBtn = document.getElementById('checkout-btn');
   if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
         window.cart.checkout();
      });
   }

   // Эффект для шапки при скролле
   window.addEventListener('scroll', function () {
      const header = document.querySelector('.header');
      if (window.scrollY > 100) {
         header.classList.add('scrolled');
      } else {
         header.classList.remove('scrolled');
      }
   });
});


// Функция для отправки уведомления в Telegram
async function sendTelegramNotification(orderData) {
   // ЗАМЕНИТЕ ЭТИ ДАННЫЕ НА СВОИ
   const botToken = '8549791407:AAEG9-19c_LgTe9xtdqCjftSV97JIDHy5cM';
   const chatId = 753234022;    // УБРАТЬ КАВЫЧКИ - chatId должно быть числом!

   // Форматируем текст сообщения
   const messageText = `
🛒 НОВЫЙ ЗАКАЗ в 3d-hub.by!

№ Заказа: ${orderData.orderNumber}
👤 Клиент: ${orderData.customer.fullName}
📞 Телефон: ${orderData.customer.phone}
📍 Адрес: ${orderData.customer.address}
🚚 Доставка: ${orderData.customer.delivery === 'belpost' ? 'Белпочта' : 'Европочта'}

Состав заказа:
${orderData.items.map(item => `➠ ${item.name} × ${item.quantity} = ${item.price * item.quantity} руб.`).join('\n')}

💵 ИТОГО К ОПЛАТЕ: ${orderData.total} руб.
    `.trim();

   // Отправляем запрос к Telegram API
   try {
      console.log('Отправляю сообщение в Telegram...');

      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({
            chat_id: chatId,  // Теперь это число, а не строка
            text: messageText
         })
      });

      const result = await response.json();
      console.log('Ответ от Telegram:', result);

      if (!result.ok) {
         console.error('Ошибка Telegram API:', result);
         return false;
      }
      return true;
   } catch (error) {
      console.error('Ошибка отправки в Telegram:', error);
      return false;
   }
}