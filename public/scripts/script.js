// 1. Вынести поиск в отдельный компонент.
// 2. Вынести корзину в отдельный компонент.
// 3. * Создать компонент с сообщением об ошибке. Компонент должен отображаться, когда не удаётся выполнить запрос к серверу.

const API_URL = 'http://localhost:3000';

Vue.component('search',{
    props: ['query'],
    methods: {
        handleSearchClick (query) {
            this.$emit('onsearch', query);
        },
    },
    template: `<div class="search__block"> 
                    <input type="text" id='searchInput' v-model="query" placeholder="Search for Item...">
                    <a href="#" @click.prevent="handleSearchClick(query)" class="find-btn">
                        <i class="fas fa-search"></i>
                    </a>
                </div>`,
});

Vue.component('cart-item', {
    props: ['item'],
    methods: {
        handleDeleteClick(item) {
            this.$emit('onDelete', item);
        },
    },
    template:  
        `<a  href="single-page.html" class="in-cart-item">
            <div class="cart__photo"> 
                <img class="item-photo" :src="item.photo">
            </div>
            <div class="item-container">
                <div class="item-info">
                    <h2>{{ item.name }}</h2>
                    <span>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star-half-alt"></i>
                    </span>
                    <h3>{{ item.count }} x {{ item.currency }} {{ item.price }} </h3>
                </div>
                <div @click.prevent="handleDeleteClick(item)" class="btn-remove-item">
                    <i class="fas fa-times-circle btn_remove" :data-id="item.id"></i>
                </div>
            </div>
        </a>`,
});

Vue.component('cart', {
    props: ['items'],
    data() {
        return {
            visible: false,
            items: [],
        };
    },

    methods: {
        handleDeleteClick(item) {
            if (item.count > 1) {
                fetch(`${API_URL}/cart/${item.id}`, {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ count: item.count - 1 }),
                }).then((response) => response.json())
                  .then((item) => {
                    const findItem = this.items.findIndex((e) => e.id === item.id);
                    Vue.set(this.items, findItem, item);
                  });
              } else {
                fetch(`${API_URL}/cart/${item.id}`, {
                  method: 'DELETE',
                }).then(() => {
                   const findItem = this.items.findIndex((e) => e.id !== item.id);
                   this.items = this.items.splice(findItem,1);
                });
            }
        },

        handlerCartClick() {
            this.visible =  this.visible? false : true;
        },
    },
 
    computed: {
        cartPrice() {
            return this.items.reduce((acc, item) => acc + item.price * item.count, 0);
        },
        cartItemsCount() {
            return this.items.reduce((acc, item) => acc + item.count, 0);
        },
    },

    template: `
        <div class="cart-btn-block">
            <a @click.prevent="handlerCartClick" href="cart.html">
                <img class="cart-image" src="images/cart.svg" alt="cart">
                <span class="cart-items-total">{{ cartItemsCount }}</span>
            </a>
            <div v-if="visible" class="cart-items">
                <div class="top-block">
                    <cart-item v-for="item in items" :item="item" @onDelete="handleDeleteClick(item)"></cart-item>
                </div>
                <div class="bottom-block">
                    <div class="cart-total-price">	       
                        <div>TOTAL </div>
                        <div> {{ cartPrice }} </div>
                    </div>
                    <a href="checkout.html" class="cart-btn btn-check-out">Checkout</a>
                    <a href="cart.html" class="cart-btn btn-to-cart">Go to cart</a>
                </div>
            </div>
        </div>
    `,

});

Vue.component('product', {
    props: ['item'],
    template: `
        <div class="product" :data-id="item.id">
            <a href="single-page.html" class="photo-link">
                <div class="photo">
                    <img class="item_photo" :src="item.photo" alt="">
                </div>
            </a>
            <div class="buttons">
                <a @click.prevent="handlerBuyClick(item)" href="#" class="product-btn add-to-cart" :data-id="item.id">
                    <img class="cart" src="images/cart-item.svg" alt="cart"> 
                    <span >Add to Cart</span>
                </a>
                <a href="#" class="product-btn small-btn">
                    <img src="images/compare.svg" alt="compare">
                </a>
                <a href="#" class="product-btn small-btn">
                    <img src="images/like.svg" alt="like">
                </a>
            </div>
            <div class="text">
                <div class="name">{{ item.name }}</div>
                <div class="price">
                    <span class="currency">{{ item.currency }}</span> 
                    <span class="price_value">{{ item.price }}</span>
                </div>
            </div>
        </div>`,
    methods: {
            handlerBuyClick(item) {
            this.$emit('onBuy', item);
        }
    }
});
  
Vue.component('products', {
    props: ['query'],
    methods: {
        handlerBuyClick(item) {
        this.$emit('onbuy', item);
      },
    },
    data() {
      return {
        items: [],
      };
    },
    computed: {
      filteredItems() {
        if (this.query) {
            const regexp = new RegExp(this.query, 'i');
            return this.items.filter((item) => regexp.test(item.name));
        } else {
            return this.items;
        }
      }
    },
    mounted() {
      fetch(`${API_URL}/products`)
        .then(response => {
            if (response.ok) {
                response.json().then((items) => {
                    this.items = items;
                });
            } else {
                this.$root.hasError = true;
            }
        });
        
    },
    template: `<div class="product-block">
                    <product v-for="item in items" :item="item" @onBuy="handlerBuyClick"></product>
               </div>`,
});

Vue.component('error',{
    props: ['error'],
    template: `<div class="error__block">
                    <h1 v-if="error">Ошибка получения данных с сервера </h1>
                </div>`,

})

const app = new Vue({
    el: '#app',
    data: {       
       cartItems: [],
       filterValue: '',
       hasError: false,
    },
    mounted() {
        fetch(`${API_URL}/cart`)
        .then(response => {
            if (response.ok) {
                response.json().then((cartItem) => {
                   this.cartItems = cartItem;
                });
            } else {
                this.hasError = true;
            }
        });
    },
    methods: {
        handleSearchClick(query) {
            this.filterValue = query;
        },
        handlerBuyClick(item) {
            const cartItem = this.cartItems.find((entry) => entry.id === item.id);
            if (cartItem) {
                fetch(`${API_URL}/cart/${item.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ count: cartItem.count + 1 }),
                }).then((response) => response.json())
                  .then((item) => {
                    const itemFind = this.cartItems.findIndex((e) => e.id === item.id);
                    Vue.set(this.cartItems, itemFind, item);
                });
            } else {
                fetch(`${API_URL}/cart`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ...item, count: 1 }),
                    }).then((response) => response.json())
                    .then((item) => {
                      this.cartItems.push(item);
                });
            }
        },
    }
});
