// app.js - Основной функционал с поддержкой цветов

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

   // Получение итоговой суммы (без доставки)
   getOrderTotal() {
      return this.getItemsTotal();
   }

   // Добавление товара в корзину с учетом цвета
   addItem(product) {
      const existingItemIndex = this.items.findIndex(item =>
         item.id === product.id &&
         this.compareColors(item.selectedColor, product.selectedColor)
      );

      if (existingItemIndex !== -1) {
         this.items[existingItemIndex].quantity += 1;
      } else {
         this.items.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.selectedColor ? product.selectedColor.image : product.image,
            quantity: 1,
            selectedColor: product.selectedColor || null
         });
      }

      this.saveCart();
      this.showNotification();
   }

   // Сравнение цветов для корректного определения одинаковых товаров
   compareColors(color1, color2) {
      if (!color1 && !color2) return true;
      if (!color1 || !color2) return false;
      return color1.name === color2.name && color1.code === color2.code;
   }

   // Обновление сводки заказа
   updateOrderSummary() {
      const itemsTotalEl = document.getElementById('items-total');
      const orderTotalEl = document.getElementById('order-total');
      const checkoutBtn = document.getElementById('checkout-btn');
      const itemsCountEl = document.getElementById('items-count');

      const itemsTotal = this.getItemsTotal();
      const orderTotal = this.getOrderTotal();

      if (itemsTotalEl) itemsTotalEl.textContent = `${itemsTotal} руб.`;
      if (orderTotalEl) orderTotalEl.textContent = `${orderTotal} руб.`;

      // Обновление текста в сводке заказа
      if (itemsCountEl) {
         itemsCountEl.textContent = `Товары (${this.getTotalCount()}):`;
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

   // Отображение товаров в корзине с цветами
   renderCartItems() {
      const cartItemsEl = document.getElementById('cart-items');
      if (!cartItemsEl) return;

      if (this.items.length === 0) {
         cartItemsEl.innerHTML = `
            <div class="empty-cart">
               <div class="empty-cart-icon">🛒</div>
               <h2>Ваша корзина пуста</h2>
               <p>Добавьте товары из каталога, чтобы сделать заказ</p>
               <a href="catalog.html" class="checkout-btn" style="display: inline-block; width: auto; padding: 12px 30px;">Перейти к покупкам</a>
            </div>
         `;
         return;
      }

      let itemsHTML = '';

      this.items.forEach((item, index) => {
         const colorInfo = item.selectedColor ? `
            <div class="item-color">
               <span class="color-label">Цвет:</span>
               <div class="color-display">
                  <div class="color-swatch-small" style="background-color: ${item.selectedColor.code}"></div>
                  <span class="color-name-small">${item.selectedColor.name}</span>
               </div>
            </div>
         ` : '';

         itemsHTML += `
            <div class="cart-item" data-id="${item.id}" data-index="${index}">
               <div class="item-image">
                  <img src="${item.image}" alt="${item.name}">
               </div>
               <div class="item-details">
                  <div class="item-name">${item.name}</div>
                  ${colorInfo}
                  <div class="item-controls">
                     <div class="quantity-controls">
                        <button class="quantity-btn minus" data-index="${index}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" data-index="${index}">+</button>
                     </div>
                     <div class="item-price">${item.price * item.quantity} руб.</div>
                     <button class="remove-btn" data-index="${index}">Удалить</button>
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
            const index = parseInt(e.target.getAttribute('data-index'));
            this.increaseQuantity(index);
         });
      });

      // Кнопки уменьшения количества
      document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
         btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            this.decreaseQuantity(index);
         });
      });

      // Кнопки удаления
      document.querySelectorAll('.remove-btn').forEach(btn => {
         btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            this.removeItem(index);
         });
      });
   }

   // Увеличение количества товара
   increaseQuantity(index) {
      if (this.items[index]) {
         this.items[index].quantity += 1;
         this.saveCart();
      }
   }

   // Уменьшение количества товара
   decreaseQuantity(index) {
      if (this.items[index]) {
         if (this.items[index].quantity > 1) {
            this.items[index].quantity -= 1;
         } else {
            this.removeItem(index);
            return;
         }
         this.saveCart();
      }
   }

   // Удаление товара из корзины
   removeItem(index) {
      this.items.splice(index, 1);
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

// Функция для отправки уведомления в Telegram
async function sendTelegramNotification(orderData) {
   // ЗАМЕНИТЕ ЭТИ ДАННЫЕ НА СВОИ
   const botToken = '8549791407:AAEG9-19c_LgTe9xtdqCjftSV97JIDHy5cM';
   const chatId = 753234022;

   // Форматируем текст сообщения
   const messageText = `
🛒 НОВЫЙ ЗАКАЗ в 3d-hub.by!

№ Заказа: ${orderData.orderNumber}
👤 Клиент: ${orderData.customer.fullName}
📞 Телефон: ${orderData.customer.phone}
📍 Адрес: ${orderData.customer.address}
🚚 Доставка: ${orderData.customer.delivery === 'belpost' ? 'Белпочта' : 'Европочта'}

Состав заказа:
${orderData.items.map(item => {
      const colorInfo = item.selectedColor ? ` (${item.selectedColor.name})` : '';
      return `➠ ${item.name}${colorInfo} × ${item.quantity} = ${item.price * item.quantity} руб.`;
   }).join('\n')}

💰 Сумма заказа: ${orderData.total} руб.
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
            chat_id: chatId,
            text: messageText,
            parse_mode: 'HTML'
         })
      });

      const result = await response.json();
      console.log('Ответ от Telegram:', result);

      if (!result.ok) {
         console.error('Ошибка Telegram API:', result);
         throw new Error(result.description || 'Unknown Telegram API error');
      }
      return true;
   } catch (error) {
      console.error('Ошибка отправки в Telegram:', error);
      throw error;
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

   // Создаем элемент для спиннера загрузки
   const loadingSpinner = document.createElement('div');
   loadingSpinner.id = 'loading-spinner';
   loadingSpinner.style.cssText = 'display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000; justify-content: center; align-items: center;';
   loadingSpinner.innerHTML = `
      <div style="background: white; padding: 20px; border-radius: 10px; text-align: center; color: black;">
         <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 10px;"></div>
         <p>Отправка заказа...</p>
      </div>
   `;
   document.body.appendChild(loadingSpinner);

   // Показать/скрыть спиннер загрузки
   function setLoading(isLoading) {
      if (loadingSpinner) {
         loadingSpinner.style.display = isLoading ? 'flex' : 'none';
      }
      if (submitOrder) {
         submitOrder.disabled = isLoading;
         submitOrder.textContent = isLoading ? 'Отправка...' : 'Подтвердить заказ';
      }
   }

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
      if (orderForm) orderForm.reset();
      document.querySelectorAll('.error-message').forEach(el => {
         el.classList.remove('show');
      });
      document.querySelectorAll('.form-input').forEach(el => {
         el.classList.remove('error');
      });
      document.querySelectorAll('.delivery-option').forEach(el => {
         el.classList.remove('selected');
      });
      setLoading(false);
   }

   // Показать сообщение об ошибке
   function showError(inputId, errorId) {
      const inputElement = document.getElementById(inputId);
      const errorElement = document.getElementById(errorId);
      if (inputElement) inputElement.classList.add('error');
      if (errorElement) errorElement.classList.add('show');
   }

   // Скрыть сообщение об ошибке
   function hideError(inputId, errorId) {
      const inputElement = document.getElementById(inputId);
      const errorElement = document.getElementById(errorId);
      if (inputElement) inputElement.classList.remove('error');
      if (errorElement) errorElement.classList.remove('show');
   }

   // Валидация формы
   function validateForm() {
      let isValid = true;

      // Проверка ФИО
      const fullName = document.getElementById('full-name')?.value.trim();
      if (!fullName) {
         showError('full-name', 'name-error');
         isValid = false;
      } else {
         hideError('full-name', 'name-error');
      }

      // Проверка телефона
      const phone = document.getElementById('phone')?.value.trim();
      const phoneRegex = /^\+375\d{9}$/;
      if (!phone || !phoneRegex.test(phone)) {
         showError('phone', 'phone-error');
         isValid = false;
      } else {
         hideError('phone', 'phone-error');
      }

      // Проверка адреса
      const address = document.getElementById('address')?.value.trim();
      if (!address) {
         showError('address', 'address-error');
         isValid = false;
      } else {
         hideError('address', 'address-error');
      }

      // Проверка способа доставки
      const deliverySelected = document.querySelector('input[name="delivery"]:checked');
      if (!deliverySelected) {
         document.getElementById('delivery-error')?.classList.add('show');
         isValid = false;
      } else {
         document.getElementById('delivery-error')?.classList.remove('show');
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
         if (radio) radio.checked = true;

         // Скрываем ошибку при выборе способа доставки
         document.getElementById('delivery-error')?.classList.remove('show');
      });
   });

   // Закрытие модального окна
   if (modalClose) modalClose.addEventListener('click', closeOrderModal);
   if (cancelOrder) cancelOrder.addEventListener('click', closeOrderModal);

   // Обработка отправки формы
   if (submitOrder) {
      submitOrder.addEventListener('click', async function () {
         if (!validateForm()) return;

         try {
            setLoading(true);

            // Собираем данные формы
            const fullName = document.getElementById('full-name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const address = document.getElementById('address').value.trim();
            const delivery = document.querySelector('input[name="delivery"]:checked').value;

            // Формируем данные заказа
            const orderData = {
               orderNumber: '3DHUB-' + Date.now(),
               customer: {
                  fullName: fullName,
                  phone: phone,
                  address: address,
                  delivery: delivery
               },
               items: window.cart.items,
               total: window.cart.getOrderTotal()
            };

            // Отправляем уведомление в Telegram
            const telegramSent = await sendTelegramNotification(orderData);

            if (telegramSent) {
               // Показываем уведомление об успешном заказе
               orderModal.classList.remove('active');
               orderSuccess.classList.add('active');

               // Очищаем корзину
               if (window.cart) {
                  window.cart.clear();
               }
            }
         } catch (error) {
            console.error('Ошибка при оформлении заказа:', error);
            alert('Произошла ошибка при отправке заказа. Пожалуйста, свяжитесь с нами по телефону.');
         } finally {
            setLoading(false);
         }
      });
   }

   // Закрытие уведомления об успешном заказе
   if (successClose) {
      successClose.addEventListener('click', function () {
         orderSuccess.classList.remove('active');
         document.body.style.overflow = 'auto';
      });
   }

   // Обработчик для предотвращения закрытия модального окна при клике вне его
   orderModal.addEventListener('click', function (e) {
      if (e.target === orderModal) {
         closeOrderModal();
      }
   });

   // Валидация полей в реальном времени
   const fullNameInput = document.getElementById('full-name');
   const phoneInput = document.getElementById('phone');
   const addressInput = document.getElementById('address');

   if (fullNameInput) {
      fullNameInput.addEventListener('input', function () {
         if (this.value.trim() !== '') {
            hideError('full-name', 'name-error');
         }
      });
   }

   if (phoneInput) {
      phoneInput.addEventListener('input', function () {
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
   }

   if (addressInput) {
      addressInput.addEventListener('input', function () {
         if (this.value.trim() !== '') {
            hideError('address', 'address-error');
         }
      });
   }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {

   // Добавляем класс home-page к body если мы на главной странице
   if (window.location.pathname === '/' || window.location.pathname === '/index.html' || window.location.pathname.endsWith('/')) {
      document.body.classList.add('home-page');
   }

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

// Добавляем стили для анимации спиннера
const style = document.createElement('style');
style.textContent = `
   @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
   }
`;
document.head.appendChild(style);