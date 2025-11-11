// catalog.js - Функционал для страницы каталога с пагинацией

// Данные товаров (увеличим количество для демонстрации пагинации)
const productsData = [
   {
      id: 1,
      name: '3D Ваза "Геометрия"',
      price: 45,
      image: 'https://images.unsplash.com/photo-1581784368655-0f72a6b3d0c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      category: 'decor',
      description: 'Уникальная декоративная ваза с геометрическим узором. Идеально подходит для современного интерьера.',
      popular: true,
      slug: '3d-vaza-geometriya'
   },
   {
      id: 2,
      name: 'Держатель для наушников',
      price: 28,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      category: 'organizers',
      description: 'Стильный органайзер для ваших наушников. Больше никогда не теряйте свои наушники!',
      popular: true,
      slug: 'derzhatel-dlya-naushnikov'
   },
   {
      id: 3,
      name: 'Кастомные фигурки',
      price: 60,
      image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      category: 'toys',
      description: 'Персонализированные 3D-фигурки по вашему дизайну. Создайте свой уникальный сувенир!',
      popular: false,
      slug: 'kastomnye-figurki'
   },
   {
      id: 4,
      name: 'Органайзер для рабочего стола',
      price: 52,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      category: 'organizers',
      description: 'Порядок на столе - порядок в мыслях! Многофункциональный органайзер для канцелярии.',
      popular: true,
      slug: 'organajzer-dlya-rabochego-stola'
   },
   {
      id: 5,
      name: 'Подставка для смартфона',
      price: 25,
      image: 'https://images.unsplash.com/photo-1601784551446-66c9e1e44a0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      category: 'organizers',
      description: 'Удобная подставка с регулируемым углом наклона. Смотрите видео с комфортом!',
      popular: false,
      slug: 'podstavka-dlya-smartfona'
   },
   {
      id: 6,
      name: '3D Светильник "Луна"',
      price: 89,
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      category: 'decor',
      description: 'Мягкий рассеянный свет создает уютную атмосферу. Работает от USB.',
      popular: true,
      slug: '3d-svetilnik-luna'
   },
   {
      id: 7,
      name: 'Кашпо для растений',
      price: 38,
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      category: 'pots',
      description: 'Стильные горшки с системой автополива. Ваши растения будут благодарны!',
      popular: false,
      slug: 'kashpo-dlya-rastenij'
   },
   {
      id: 8,
      name: 'Шахматы "Футуризм"',
      price: 150,
      image: 'https://images.unsplash.com/photo-1583160247711-2191776b4b91?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      category: 'toys',
      description: 'Эксклюзивный набор шахмат в футуристическом стиле. Для настоящих ценителей.',
      popular: true,
      slug: 'shahmaty-futurizm'
   },
   {
      id: 9,
      name: 'Новогодний шар 2026',
      price: 35,
      image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      category: 'newyear',
      description: 'Элегантный новогодний шар с гравировкой "2026". Создайте праздничное настроение!',
      popular: false,
      slug: 'novogodnij-shar-2026'
   },
   {
      id: 10,
      name: 'Брелок "Котик"',
      price: 18,
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      category: 'keychains',
      description: 'Милый брелок в виде котика. Отличный подарок для друзей и близких.',
      popular: false,
      slug: 'brelok-kotik'
   },
   {
      id: 11,
      name: '3D Пазл "Динозавр"',
      price: 42,
      image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      category: 'toys',
      description: 'Развивающий 3D пазл для детей. Развивает моторику и пространственное мышление.',
      popular: true,
      slug: '3d-pazl-dinozavr'
   },
   {
      id: 12,
      name: 'Подставка для украшений',
      price: 31,
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      category: 'organizers',
      description: 'Элегантная подставка для хранения колец, сережек и других украшений.',
      popular: false,
      slug: 'podstavka-dlya-ukrashenij'
   },
   {
      id: 13,
      name: 'Елочная игрушка "Снеговик"',
      price: 22,
      image: 'https://images.unsplash.com/photo-1574359411659-619743e166e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      category: 'newyear',
      description: 'Милая елочная игрушка в виде снеговика. Создаст новогоднее настроение!',
      popular: false,
      slug: 'elochnaya-igrushka-snegovik'
   },
   {
      id: 14,
      name: 'Горшок для суккулентов',
      price: 29,
      image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      category: 'pots',
      description: 'Стильный горшок для суккулентов с дренажной системой.',
      popular: true,
      slug: 'gorshok-dlya-sukkulentov'
   },
   {
      id: 15,
      name: 'Настенная полка "Волна"',
      price: 67,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      category: 'decor',
      description: 'Стильная настенная полка в виде волны для книг и декора.',
      popular: false,
      slug: 'nastennaya-polka-volna'
   },
   {
      id: 16,
      name: 'Брелок "Сердце"',
      price: 16,
      image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      category: 'keychains',
      description: 'Романтичный брелок в форме сердца. Идеальный подарок для второй половинки.',
      popular: false,
      slug: 'brelok-serdce'
   },
   {
      id: 17,
      name: 'Органайзер для инструментов',
      price: 74,
      image: 'https://images.unsplash.com/photo-1572981779307-38f8b0456222?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      category: 'organizers',
      description: 'Прочный органайзер для хранения инструментов в гараже или мастерской.',
      popular: true,
      slug: 'organajzer-dlya-instrumentov'
   },
   {
      id: 18,
      name: '3D Конструктор "Замок"',
      price: 85,
      image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      category: 'toys',
      description: 'Увлекательный 3D конструктор для сборки средневекового замка.',
      popular: false,
      slug: '3d-konstruktor-zamok'
   },
   {
      id: 19,
      name: 'Новогодняя гирлянда',
      price: 41,
      image: 'https://images.unsplash.com/photo-1513159446166-3bbc3d8b18eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      category: 'newyear',
      description: 'Яркая новогодняя гирлянда для украшения елки и интерьера.',
      popular: true,
      slug: 'novogodnyaya-girlyanda'
   },
   {
      id: 20,
      name: 'Подвесное кашпо "Шар"',
      price: 33,
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      category: 'pots',
      description: 'Элегантное подвесное кашпо в форме шара для ампельных растений.',
      popular: false,
      slug: 'podvesnoe-kashpo-shar'
   },
   {
      id: 21,
      name: 'Настольная лампа "Модерн"',
      price: 78,
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      category: 'decor',
      description: 'Стильная настольная лампа в современном дизайне с регулируемой яркостью.',
      popular: true,
      slug: 'nastolnaya-lampa-modern'
   },
   {
      id: 22,
      name: 'Брелок "Автомобиль"',
      price: 19,
      image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      category: 'keychains',
      description: 'Стильный брелок в виде автомобиля для автолюбителей.',
      popular: false,
      slug: 'brelok-avtomobil'
   },
   {
      id: 23,
      name: 'Органайзер для косметики',
      price: 46,
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      category: 'organizers',
      description: 'Компактный органайзер для хранения косметики и аксессуаров.',
      popular: false,
      slug: 'organajzer-dlya-kosmetiki'
   },
   {
      id: 24,
      name: '3D Головоломка "Куб"',
      price: 37,
      image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      category: 'toys',
      description: 'Сложная 3D головоломка для развития логического мышления.',
      popular: true,
      slug: '3d-golovolomka-kub'
   }
];

// Категории товаров
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

class Catalog {
   constructor() {
      this.products = productsData;
      this.filteredProducts = [...this.products];
      this.currentView = 'grid';
      this.currentPage = 1;
      this.itemsPerPage = 18; // 18 товаров на страницу
      this.init();
   }

   init() {
      this.renderProducts();
      this.setupEventListeners();
      this.updateProductsCount();
      this.renderPagination();
   }

   setupEventListeners() {
      // Кнопки вида отображения
      document.querySelectorAll('.view-btn').forEach(btn => {
         btn.addEventListener('click', (e) => {
            this.setView(e.currentTarget.dataset.view);
         });
      });

      // Применение фильтров
      document.getElementById('apply-filters').addEventListener('click', () => {
         this.applyFilters();
      });

      // Сброс фильтров
      document.getElementById('reset-filters').addEventListener('click', () => {
         this.resetFilters();
      });

      // Сортировка
      document.getElementById('sort-select').addEventListener('change', (e) => {
         this.sortProducts(e.target.value);
      });

      // Enter в полях цены
      document.getElementById('price-min').addEventListener('keypress', (e) => {
         if (e.key === 'Enter') this.applyFilters();
      });
      document.getElementById('price-max').addEventListener('keypress', (e) => {
         if (e.key === 'Enter') this.applyFilters();
      });
   }

   setView(view) {
      this.currentView = view;

      // Обновляем активные кнопки
      document.querySelectorAll('.view-btn').forEach(btn => {
         btn.classList.remove('active');
      });
      document.querySelector(`[data-view="${view}"]`).classList.add('active');

      // Обновляем класс контейнера
      const grid = document.getElementById('products-grid');
      grid.className = `products-grid ${view}-view`;

      this.renderProducts();
   }

   applyFilters() {
      const selectedCategories = this.getSelectedCategories();
      const minPrice = document.getElementById('price-min').value;
      const maxPrice = document.getElementById('price-max').value;

      this.filteredProducts = this.products.filter(product => {
         // Фильтр по категориям
         const categoryMatch = selectedCategories.length === 0 ||
            selectedCategories.includes('all') ||
            selectedCategories.includes(product.category);

         // Фильтр по цене
         let priceMatch = true;
         if (minPrice) priceMatch = priceMatch && product.price >= parseInt(minPrice);
         if (maxPrice) priceMatch = priceMatch && product.price <= parseInt(maxPrice);

         return categoryMatch && priceMatch;
      });

      // Сбрасываем на первую страницу при применении фильтров
      this.currentPage = 1;

      // Применяем текущую сортировку
      const sortValue = document.getElementById('sort-select').value;
      this.sortProducts(sortValue);

      this.renderProducts();
      this.updateProductsCount();
      this.renderPagination();
   }

   resetFilters() {
      // Сбрасываем чекбоксы
      document.querySelectorAll('input[name="category"]').forEach(checkbox => {
         checkbox.checked = checkbox.value === 'all';
      });

      // Сбрасываем цену
      document.getElementById('price-min').value = '';
      document.getElementById('price-max').value = '';

      // Сбрасываем сортировка
      document.getElementById('sort-select').value = 'default';

      // Применяем сброс
      this.filteredProducts = [...this.products];
      this.currentPage = 1;
      this.renderProducts();
      this.updateProductsCount();
      this.renderPagination();
   }

   getSelectedCategories() {
      const selected = [];
      document.querySelectorAll('input[name="category"]:checked').forEach(checkbox => {
         selected.push(checkbox.value);
      });
      return selected;
   }

   sortProducts(sortType) {
      switch (sortType) {
         case 'price-asc':
            this.filteredProducts.sort((a, b) => a.price - b.price);
            break;
         case 'price-desc':
            this.filteredProducts.sort((a, b) => b.price - a.price);
            break;
         case 'name-asc':
            this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
         case 'name-desc':
            this.filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
         case 'popular':
            this.filteredProducts.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
            break;
         default:
            // По умолчанию - порядок как в массиве
            break;
      }
      this.renderProducts();
      this.renderPagination();
   }

   getCurrentPageProducts() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.filteredProducts.slice(startIndex, endIndex);
   }

   getTotalPages() {
      return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
   }

   setPage(page) {
      if (page < 1 || page > this.getTotalPages()) return;

      this.currentPage = page;
      this.renderProducts();
      this.renderPagination();
      this.scrollToTop();
   }

   scrollToTop() {
      window.scrollTo({
         top: 0,
         behavior: 'smooth'
      });
   }

   renderPagination() {
      const pagination = document.getElementById('pagination');
      const totalPages = this.getTotalPages();

      if (totalPages <= 1) {
         pagination.innerHTML = '';
         return;
      }

      let paginationHTML = '';

      // Кнопка "Назад"
      paginationHTML += `
            <button class="pagination-btn ${this.currentPage === 1 ? 'disabled' : ''}" 
                    onclick="catalog.setPage(${this.currentPage - 1})" 
                    ${this.currentPage === 1 ? 'disabled' : ''}>
                ← Назад
            </button>
        `;

      // Первая страница
      if (this.currentPage > 3) {
         paginationHTML += `<button class="pagination-btn" onclick="catalog.setPage(1)">1</button>`;
         if (this.currentPage > 4) {
            paginationHTML += `<span class="pagination-dots">...</span>`;
         }
      }

      // Страницы вокруг текущей
      for (let i = Math.max(1, this.currentPage - 2); i <= Math.min(totalPages, this.currentPage + 2); i++) {
         paginationHTML += `
                <button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" 
                        onclick="catalog.setPage(${i})">
                    ${i}
                </button>
            `;
      }

      // Последняя страница
      if (this.currentPage < totalPages - 2) {
         if (this.currentPage < totalPages - 3) {
            paginationHTML += `<span class="pagination-dots">...</span>`;
         }
         paginationHTML += `<button class="pagination-btn" onclick="catalog.setPage(${totalPages})">${totalPages}</button>`;
      }

      // Кнопка "Вперед"
      paginationHTML += `
            <button class="pagination-btn ${this.currentPage === totalPages ? 'disabled' : ''}" 
                    onclick="catalog.setPage(${this.currentPage + 1})" 
                    ${this.currentPage === totalPages ? 'disabled' : ''}>
                Вперед →
            </button>
        `;

      // Информация о странице
      paginationHTML += `
            <div class="pagination-info">
                Страница ${this.currentPage} из ${totalPages}
            </div>
        `;

      pagination.innerHTML = paginationHTML;
   }

   renderProducts() {
      const grid = document.getElementById('products-grid');
      const loading = document.getElementById('catalog-loading');
      const noProducts = document.getElementById('no-products');

      // Показываем загрузку
      loading.style.display = 'block';
      noProducts.style.display = 'none';

      setTimeout(() => {
         const currentProducts = this.getCurrentPageProducts();

         if (currentProducts.length === 0) {
            grid.innerHTML = '';
            loading.style.display = 'none';
            noProducts.style.display = 'block';
            return;
         }

         let productsHTML = '';
         currentProducts.forEach(product => {
            productsHTML += this.createProductHTML(product);
         });

         grid.innerHTML = productsHTML;
         loading.style.display = 'none';

         // Добавляем обработчики для кнопок добавления в корзину
         this.addCartEventListeners();
      }, 500);
   }

   createProductHTML(product) {
      const isListView = this.currentView === 'list';

      if (isListView) {
         return `
            <div class="product-card list-view" data-id="${product.id}">
                <a href="product.html?id=${product.id}&slug=${product.slug}" class="product-link">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                </a>
                <div class="product-info">
                    <div class="product-category">${categories[product.category]}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
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
            </div>
        `;
      } else {
         return `
            <div class="product-card" data-id="${product.id}">
                <a href="product.html?id=${product.id}&slug=${product.slug}" class="product-link">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="product-info">
                        <div class="product-category">${categories[product.category]}</div>
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-description">${product.description}</p>
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
   }

   addCartEventListeners() {
      document.querySelectorAll('.add-to-cart').forEach(btn => {
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

   updateProductsCount() {
      const countElement = document.getElementById('products-count');
      const totalCount = this.filteredProducts.length;
      const currentCount = this.getCurrentPageProducts().length;
      const totalPages = this.getTotalPages();

      let text = `Показано ${currentCount} из ${totalCount} товаров`;
      if (totalCount === 1) text = `Показан 1 товар из 1`;
      if (totalCount > 1 && totalCount < 5) text = `Показано ${currentCount} из ${totalCount} товара`;

      if (totalPages > 1) {
         text += ` (Страница ${this.currentPage} из ${totalPages})`;
      }

      countElement.textContent = text;
   }
}

// Инициализация каталога при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
   window.catalog = new Catalog();
});