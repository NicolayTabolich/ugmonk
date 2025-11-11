// product.js - Функционал для страницы карточки товара

class ProductPage {
   constructor() {
      this.productId = this.getProductIdFromURL();
      this.product = null;
      this.quantity = 1;
      this.init();
   }

   init() {
      if (this.productId) {
         this.loadProduct();
         this.setupEventListeners();
      } else {
         this.showError('Товар не найден');
      }
   }

   getProductIdFromURL() {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('id');
   }

   async loadProduct() {
      try {
         // В реальном приложении здесь был бы fetch запрос к API
         // Сейчас используем данные из catalog.js
         const product = await this.fetchProductData(this.productId);

         if (product) {
            this.product = product;
            this.renderProduct();
            this.loadRelatedProducts();
         } else {
            this.showError('Товар не найден');
         }
      } catch (error) {
         console.error('Ошибка загрузки товара:', error);
         this.showError('Произошла ошибка при загрузке товара');
      }
   }

   async fetchProductData(productId) {
      // Имитация загрузки данных
      return new Promise((resolve) => {
         setTimeout(() => {
            // Используем данные из catalog.js или локальную базу
            const products = this.getProductsData();
            const product = products.find(p => p.id == productId);
            resolve(product);
         }, 500);
      });
   }

   getProductsData() {
      // Локальная база товаров (можно импортировать из catalog.js)
      return [
         {
            id: 1,
            name: '3D Ваза "Геометрия"',
            price: 45,
            image: 'https://images.unsplash.com/photo-1581784368655-0f72a6b3d0c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            images: [
               'https://images.unsplash.com/photo-1581784368655-0f72a6b3d0c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
               'https://images.unsplash.com/photo-1581784368348-9c0e23c255bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
               'https://images.unsplash.com/photo-1581784368510-606eff00c67d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            category: 'decor',
            description: 'Уникальная декоративная ваза с геометрическим узором. Идеально подходит для современного интерьера. Изготовлена из высококачественного PLA пластика, который безопасен для окружающей среды.',
            features: [
               'Высота: 25 см',
               'Диаметр: 12 см',
               'Материал: PLA пластик',
               'Вес: 350 г',
               'Цвет: белый матовый'
            ],
            rating: 4.8,
            reviews: 24,
            inStock: true,
            slug: '3d-vaza-geometriya',
            popular: true
         },
         {
            id: 2,
            name: 'Держатель для наушников',
            price: 28,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            images: [
               'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            category: 'organizers',
            description: 'Стильный органайзер для ваших наушников. Больше никогда не теряйте свои наушники! Компактный дизайн позволяет разместить его на столе или прикрепить к стене.',
            features: [
               'Размер: 10x8x4 см',
               'Материал: ABS пластик',
               'Крепление: двусторонний скотч',
               'Цвет: черный матовый',
               'Подходит для всех типов наушников'
            ],
            rating: 4.6,
            reviews: 18,
            inStock: true,
            slug: 'derzhatel-dlya-naushnikov',
            popular: true
         },
         // Добавьте остальные товары по аналогии...
         {
            id: 3,
            name: 'Кастомные фигурки',
            price: 60,
            image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            images: [
               'https://images.unsplash.com/photo-1596464716127-f2a82984de30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            category: 'toys',
            description: 'Персонализированные 3D-фигурки по вашему дизайну. Создайте свой уникальный сувенир! Идеально для подарков и коллекционирования.',
            features: [
               'Высота: до 15 см',
               'Материал: PLA/ABS пластик',
               'Срок изготовления: 3-5 дней',
               'Поддержка файлов: STL, OBJ',
               'Возможность покраски'
            ],
            rating: 4.9,
            reviews: 32,
            inStock: true,
            slug: 'kastomnye-figurki',
            popular: false
         }
      ];
   }

   renderProduct() {
      if (!this.product) return;

      const container = document.getElementById('product-container');
      const breadcrumbs = document.getElementById('breadcrumbs');

      // Обновляем хлебные крошки
      breadcrumbs.querySelector('.breadcrumb-current').textContent = this.product.name;

      // Обновляем title страницы
      document.title = `${this.product.name} - 3d-hub.by`;

      // Создаем HTML для товара
      container.innerHTML = this.createProductHTML();

      // Добавляем обработчики событий
      this.setupProductEventListeners();
   }

   createProductHTML() {
      const stars = this.generateStarRating(this.product.rating);
      const featuresHTML = this.product.features.map(feature =>
         `<li class="feature-item">${feature}</li>`
      ).join('');

      return `
            <div class="product-gallery">
                <div class="product-main-image">
                    <img src="${this.product.image}" alt="${this.product.name}" id="main-product-image">
                </div>
                ${this.product.images.length > 1 ? `
                <div class="product-thumbnails">
                    ${this.product.images.map((img, index) => `
                        <div class="product-thumbnail ${index === 0 ? 'active' : ''}" 
                             data-image="${img}" 
                             onclick="productPage.changeImage('${img}', this)">
                            <img src="${img}" alt="${this.product.name} - вид ${index + 1}">
                        </div>
                    `).join('')}
                </div>
                ` : ''}
            </div>
            
            <div class="product-info">
                <div class="product-category">${this.getCategoryName(this.product.category)}</div>
                <h1 class="product-title">${this.product.name}</h1>
                
                <div class="product-rating">
                    <div class="rating-stars">
                        ${stars}
                    </div>
                    <span class="rating-text">${this.product.rating} (${this.product.reviews} отзывов)</span>
                </div>
                
                <div class="product-price">${this.product.price} руб.</div>
                
                <div class="product-description">
                    ${this.product.description}
                </div>
                
                <div class="product-features">
                    <h3>Характеристики</h3>
                    <ul class="features-list">
                        ${featuresHTML}
                    </ul>
                </div>
                
                <div class="product-actions">
                    <div class="quantity-selector">
                        <button class="quantity-btn" onclick="productPage.decreaseQuantity()">-</button>
                        <input type="number" class="quantity-input" value="${this.quantity}" min="1" max="10" 
                               onchange="productPage.updateQuantity(this.value)" id="quantity-input">
                        <button class="quantity-btn" onclick="productPage.increaseQuantity()">+</button>
                    </div>
                    
                    <button class="add-to-cart-btn" onclick="productPage.addToCart()" 
                            ${!this.product.inStock ? 'disabled' : ''}>
                        <svg viewBox="0 0 24 24">
                            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0 0 20 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                        </svg>
                        ${this.product.inStock ? 'Добавить в корзину' : 'Нет в наличии'}
                    </button>
                </div>
                
                <div class="product-meta">
                    <div class="meta-item">
                        <strong>В наличии:</strong> 
                        <span>${this.product.inStock ? 'Да' : 'Нет'}</span>
                    </div>
                    <div class="meta-item">
                        <strong>Доставка:</strong> 
                        <span>1-3 дня</span>
                    </div>
                    <div class="meta-item">
                        <strong>Гарантия:</strong> 
                        <span>30 дней</span>
                    </div>
                </div>
            </div>
        `;
   }

   generateStarRating(rating) {
      const fullStars = Math.floor(rating);
      const hasHalfStar = rating % 1 >= 0.5;
      let starsHTML = '';

      for (let i = 1; i <= 5; i++) {
         if (i <= fullStars) {
            starsHTML += '<span class="rating-star">★</span>';
         } else if (i === fullStars + 1 && hasHalfStar) {
            starsHTML += '<span class="rating-star">★</span>';
         } else {
            starsHTML += '<span class="rating-star" style="opacity: 0.3">★</span>';
         }
      }

      return starsHTML;
   }

   getCategoryName(category) {
      const categories = {
         'all': 'Все товары',
         'toys': 'Детские игрушки',
         'newyear': 'Новый год 2026',
         'pots': 'Кашпо и горшки',
         'decor': 'Декор',
         'keychains': 'Брелки',
         'organizers': 'Органайзеры',
         'other': 'Другое'
      };
      return categories[category] || category;
   }

   setupEventListeners() {
      // Базовые обработчики уже в HTML через onclick
   }

   setupProductEventListeners() {
      // Дополнительные обработчики если нужны
   }

   changeImage(imageUrl, thumbnail) {
      document.getElementById('main-product-image').src = imageUrl;

      // Обновляем активную миниатюру
      document.querySelectorAll('.product-thumbnail').forEach(thumb => {
         thumb.classList.remove('active');
      });
      thumbnail.classList.add('active');
   }

   increaseQuantity() {
      if (this.quantity < 10) {
         this.quantity++;
         this.updateQuantityInput();
      }
   }

   decreaseQuantity() {
      if (this.quantity > 1) {
         this.quantity--;
         this.updateQuantityInput();
      }
   }

   updateQuantity(value) {
      const quantity = parseInt(value);
      if (quantity >= 1 && quantity <= 10) {
         this.quantity = quantity;
         this.updateQuantityInput();
      } else {
         this.updateQuantityInput(); // Сброс к предыдущему значению
      }
   }

   updateQuantityInput() {
      const input = document.getElementById('quantity-input');
      if (input) {
         input.value = this.quantity;
      }
   }

   addToCart() {
      if (!this.product || !this.product.inStock) return;

      if (window.cart) {
         // Добавляем товар quantity раз
         for (let i = 0; i < this.quantity; i++) {
            window.cart.addItem(this.product);
         }

         // Показываем уведомление
         this.showNotification();

         // Анимация кнопки
         const button = document.querySelector('.add-to-cart-btn');
         const originalText = button.innerHTML;
         button.innerHTML = '✓ Добавлено!';
         button.style.background = '#059669';

         setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
         }, 2000);
      }
   }

   showNotification() {
      const notification = document.querySelector('.cart-notification');
      if (notification) {
         notification.classList.add('show');
         setTimeout(() => {
            notification.classList.remove('show');
         }, 3000);
      }
   }

   loadRelatedProducts() {
      if (!this.product) return;

      const relatedProducts = this.getRelatedProducts(this.product.id, this.product.category);
      this.renderRelatedProducts(relatedProducts);
   }

   getRelatedProducts(currentProductId, category) {
      const allProducts = this.getProductsData();
      return allProducts
         .filter(product => product.id != currentProductId && product.category === category)
         .slice(0, 4); // Максимум 4 похожих товара
   }

   renderRelatedProducts(products) {
      const container = document.getElementById('related-products-grid');

      if (products.length === 0) {
         document.getElementById('related-products').style.display = 'none';
         return;
      }

      let productsHTML = '';
      products.forEach(product => {
         productsHTML += this.createRelatedProductHTML(product);
      });

      container.innerHTML = productsHTML;

      // Добавляем обработчики для кнопок добавления в корзину
      this.setupRelatedProductsEventListeners();
   }

   createRelatedProductHTML(product) {
      return `
            <div class="product-card" data-id="${product.id}">
                <a href="product.html?id=${product.id}&slug=${product.slug}" class="product-link">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="product-info">
                        <div class="product-category">${this.getCategoryName(product.category)}</div>
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-description">${product.description.substring(0, 100)}...</p>
                    </div>
                </a>
                <div class="product-footer">
                    <div class="product-price">${product.price} руб.</div>
                    <button class="add-to-cart" data-product='${JSON.stringify(product).replace(/'/g, "&#39;")}'>
                        <svg viewBox="0 0 24 24">
                            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0 0 20 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                        </svg>
                        В корзину
                    </button>
                </div>
            </div>
        `;
   }

   setupRelatedProductsEventListeners() {
      document.querySelectorAll('#related-products-grid .add-to-cart').forEach(btn => {
         btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productData = JSON.parse(e.currentTarget.dataset.product.replace(/&#39;/g, "'"));

            if (window.cart) {
               window.cart.addItem(productData);

               // Анимация добавления
               const button = e.currentTarget;
               const originalText = button.innerHTML;
               button.innerHTML = '✓ Добавлено!';
               button.style.background = '#059669';

               setTimeout(() => {
                  button.innerHTML = originalText;
                  button.style.background = '';
               }, 2000);
            }
         });
      });
   }

   showError(message) {
      const container = document.getElementById('product-container');
      container.innerHTML = `
            <div class="product-error">
                <h2>${message}</h2>
                <p>Попробуйте выбрать другой товар из нашего каталога</p>
                <a href="catalog.html" class="add-to-cart-btn" style="display: inline-flex; width: auto;">
                    Перейти в каталог
                </a>
            </div>
        `;

      document.getElementById('related-products').style.display = 'none';
   }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
   window.productPage = new ProductPage();
});