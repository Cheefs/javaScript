//  1 - Переделайте sendRequest() так, чтобы она использовала промисы.
//  2 -  Добавьте в соответствующие классы методы добавления товара в корзину, удаления товара из корзины и получения списка товаров корзины.
//  3* - Переделайте GoodsList так, чтобы fetchGoods() возвращал промис, а render() вызывался в обработчике этого промиса.

const API_URL = 'http://localhost:3000';

function sendRequest(url) {
    const promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url); // настройка запроса
        xhr.send();
        xhr.onreadystatechange = () => { 
            if(xhr.readyState === XMLHttpRequest.DONE) {
                resolve(JSON.parse(xhr.responseText)) 
            }
        }
   });
    return promise;
}

class Cart {
    constructor(currency = "$") {
        this.currency = currency;
        this.products = [];
    }

    fetchItems() {
        const promise = sendRequest(`${API_URL}/cart.json`);
        promise.then((value) => {
            this.products = value.map(product => new CartItem( product.id, product.name, product.price, product.photo, product.count, product.currency));
            this.totalCart = this.products;
            return this.products;
        }).then(() => document.querySelector('.cart__container').innerHTML = this.render());

        return promise;
    }

    render() {
        const itemsHtmls = this.products.map(product => product.render());
        this.getCartPrice();
        this.getCartCount();
        return itemsHtmls.join('');
    }

    addProduct(product) {
        const promice = new Promise((resolve, reject) => {
            let isExists = false;
            for (var i = 0; i < this.products.length; i++) {
                if (+this.products[i].id === +product.id) {
                    this.products[i].count++;
                    isExists = true;
                    break;
                } 
            }
            if (!isExists) {
                this.products.push(product);
            }
            resolve(this.products);
        });
        promice.then(() => this.reload());
    }

    removeItem(id) {
        let $items = document.getElementsByClassName('in-cart-item');
        for (var i = 0; i < $items.length; i++) {
            let isLastProduct = true;
            if ( +this.products[i].id === +id) {
               if (this.products[i].count > 1) {
                    this.products[i].count --;
                    isLastProduct = false;
               } else {
                    this.products.splice(i, 1);
               }
            }
            if (+$items[i].getAttribute('data-id') === +id) {
                if( isLastProduct ) {
                    $items[i].remove();
                } 
            } 
        }
        this.reload();
    }

    reload() {
        document.querySelector('.cart__container').innerHTML = this.render();
    }
    
    getCartCount() {
        const $cartCount = document.querySelector('.cart-items-total');
        let total = 0;
        this.products.forEach(e => {
            total += +e.count;
        });

        $cartCount.textContent = total;
        // return total;
    }

    getCartPrice() {
        let price = 0;
        const $priceBlock = document.querySelector('.cart-total__price');
        this.products.forEach(e => {
            if (!isNaN(+e.price)) {
                price += +e.price * e.count;
            }
        });
       $priceBlock.textContent = this.currency + price;
    }
}

class CartItem {
    constructor (id, name, price, photo = 'no-photo', count = 1, currency = '$') {
        this.id = id;
        this.name = name;
        this.price = price;
        this.photo = photo;
        this.count = count;
        this.currency = currency;
    }

    render () {
        return  `<a href="single-page.html" class="in-cart-item" data-id ="${this.id}">
                    <div class="cart__photo"> 
                        <img class="item-photo" src="${this.photo}">
                    </div>
                
                </div>
                <div class="item-container">
                    <div class="item-info">
                        <h2>${this.name}</h2>
                        <span>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star-half-alt"></i>
                        </span>
                        <h3>${this.count} x ${this.currency}${this.price}</h3>
                    </div>
                    <div class="btn-remove-item">
                        <i class="fas fa-times-circle btn_remove" data-id ="${this.id}"></i>
                    </div>
                </div>
            </a>`;
    }
}

class Product {
    constructor(id, name = 'EXCLUSIVE', price = 'SOLD', photo = 'no-photo', currency = '$') {
        this.id = id;
        this.name = name;
        this.price = price;
        this.photo = photo;
        this.currency = currency;
    }

    render() {
        return `<div class="product" data-id="${this.id}">
                    <a href="single-page.html" class="photo-link">
                        <div class="photo" style="background:url(${this.photo}) no-repeat;"></div>
                    </a>
                    <div class="buttons">
                        <a href="#" class="product-btn add-to-cart">
                            <img class="cart" src="images/cart-item.svg" alt="cart"> 
                            <span>Add to Cart</span>
                        </a>
                        <a href="#" class="product-btn small-btn">
                            <img src="images/compare.svg" alt="compare">
                        </a>
                        <a href="#" class="product-btn small-btn">
                            <img src="images/like.svg" alt="like">
                        </a>
                    </div>
                    <div class="text">
                        <div class="name">${this.name}</div>
                        <div class="price">
                            <span class="currency">${this.currency}</span> 
                            <span class="price_value">${this.price}</span>
                        </div>
                    </div>
                </div>`;
    }
}

class ProductsList {
    constructor() {
        this.products = [];
    }

    fetchItems() {
        const promise = sendRequest(`${API_URL}/products.json`);
        promise.then((value) => {
           return this.products = value.map(product => new Product(product.id, product.name, product.price, product.photo, product.currency));
        }).then(() => document.querySelector('.product-block').innerHTML = this.render());
    }

    totalPrice() {
        let price = 0;  
        this.products.forEach(e => {
            if (!isNaN(+e.price)) {
                price += +e.price;
            }
        });
        return price;
    }
    render() {
        const itemsHtmls = this.products.map(product => product.render());
        return itemsHtmls.join('');
    }
}

const products = new ProductsList();
products.fetchItems();

const cart = new Cart();
cart.fetchItems();

const $btnRemove = document.querySelector('.cart__container');
$btnRemove.addEventListener('click', e => {
    e.preventDefault();
    if (e.target.classList.contains('btn_remove')) {
        cart.removeItem(e.target.getAttribute('data-id'));
    }
});

const $cart = document.querySelector('.cart__button');
$cart.addEventListener('click', e => {
    const $cartItems = document.querySelector('.cart-items');
    e.preventDefault();
    $cartItems.classList.toggle('active');
});

const $products = document.querySelector('.product-block');
$products.addEventListener('click', (e) => {
    e.preventDefault();
    if (e.target.parentElement.classList.contains('add-to-cart') || e.target.classList.contains('add-to-cart')) {
        let $productData = e.target.parentElement.parentElement;
        if (e.target.parentElement.classList.contains('add-to-cart')) {
            $productData = $productData.parentElement;
        }
        const id = $productData.getAttribute('data-id');
        const name = $productData.querySelector('.name').textContent;
        const price = $productData.querySelector('.price_value').textContent;
        const photo = $productData.querySelector('.photo').style.backgroundImage.replace('url("','').replace('")','');
        const product = new CartItem(id, name, price, photo);

        cart.addProduct(product);
    }
});
