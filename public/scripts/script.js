// 1. Добавить методы и обработчики событий для поля поиска. 
//      Создать в объекте данных поле searchLine и привязать к нему содержимое поля ввода. 
//      На кнопку Искать добавить обработчик клика, вызывающий метод FilterGoods.

// 2.  Добавить корзину. В html-шаблон добавить разметку корзины. 
//     Добавить в объект данных поле isVisibleCart, управляющее видимостью корзины.

// 3 * Добавлять в .goods-list заглушку с текстом «Нет данных» в случае, если список товаров пуст.


const API_URL = 'http://localhost:3000';

const app = new Vue({
    el: '#app',
    data: {
      products: [],
      cartItems: [],
      cartPrice: 0,
      cartTotal: 0,
      isVisibleCart: false,
      filteredItems: [],
      searchQuery: '',
    },
    mounted() {
        fetch(API_URL+'/cart')
        .then(response => response.json())
        .then((cartItem) => {
           this.cartItems = cartItem;
           this.getCartInfo();
        });

      fetch(API_URL+'/products')
        .then(response => response.json())
        .then((product) => {
           this.products = product;
           this.filteredItems = product;
        });
    },
    methods: {
        fetchCartItems() {
            fetch(API_URL+'/cart')
            .then(response => response.json())
            .then((cartItem) => {
               this.cartItems = cartItem;
               this.getCartInfo();
            });
        },
        getCartInfo() {
            const array = this.cartItems;
            let total = 0;
            let price = 0
            array.forEach(e => {
                total += e.count;
                 price += e.count * e.price;
            });
           this.cartPrice = price;
           this.cartTotal = total;
        },
        hendlerAddToCartClick(e) {
            e.preventDefault();
            const array = this.cartItems;
            const $productBlock = e.target.parentElement.parentElement.parentElement;
            const id = +$productBlock.dataset.id;
            const photo = $productBlock.querySelector('.item_photo').getAttribute('src');
            const name = $productBlock.querySelector('.name').textContent;
            const price = $productBlock.querySelector('.price').textContent;

            let exists = false;
            array.forEach(e => {
                if (+e.id === id) {
                    e.count++;
                    fetch(`/cart/${id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ count: e.count }),
                    });
                    exists = true;
                } 
            });

            if (!exists) {
                fetch('/cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({id: id, name: name, photo: photo, price: price, count: 1 }),
                    }).then(() => this.fetchCartItems());
            } 
        },
        hendlerRemoveFromCartClick(e) {
           e.preventDefault();
           const id = +e.target.dataset.id;
           const array = this.cartItems;
           array.forEach(e => {
                if (+e.id === id) {
                    if (e.count > 1) {
                        e.count --;
                        fetch(`/cart/${id}`, { method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ count: e.count }),
                        });
                    } else {
                        fetch(`/cart/${id}`, { method: 'DELETE' });
                        this.fetchCartItems();
                    }
                }
           });
        },
        handleSearchClick() {
            const regexp = new RegExp(this.searchQuery, 'i');
            this.filteredItems = this.products.filter((product) => regexp.test(product.name));
        },
        handlerCartClick(e) {
            e.preventDefault();
            this.isVisibleCart =  this.isVisibleCart? false : true;
        }
    }
});
