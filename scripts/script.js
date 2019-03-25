// 1. Добавьте пустые классы для Корзины товаров и Элемента корзины товаров. 
// Продумайте, какие методы понадобятся для работы с этими сущностями.

class Cart {
    constructor( currency = "$") {
        this.currency = currency;
        this.products = [];
    }
    
    fetchItems() {
        this.products = [
            { id: 0, photo: 'images/kart-item1.jpg', name: 'Rebox Zane', price: '250' },
            { id: 1, photo: 'images/kart-item2.jpg', name: 'Zane Rebox', price: '350', count: 2 },
        ];
        this.products = this.products.map(product => new CartItem( product.id, product.name, product.price, product.currency, product.photo, product.count));
    }

    render() {
        const itemsHtmls = this.products.map(product => product.render());
        return itemsHtmls.join('');
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
            this.reload();
        }
    }

    reload() {
        this.getCartPrice();
        document.querySelector('.cart__container').innerHTML = this.render();
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
    constructor (id, name, price, currency = '$' ,photo = 'no-photo', count = 1) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.photo = photo;
        this.count = count;
        this.currency = currency;
    }

    render () {
        return  `<a href="single-page.html" class="in-cart-item" data-id ="${this.id}">
                <div class="item-photo" style="background:url('${this.photo}')">
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
const $btnRemove = document.querySelector('.cart__container');

const cart = new Cart();
cart.fetchItems();
cart.getCartPrice();
document.querySelector('.cart__container').innerHTML = cart.render();

$btnRemove.addEventListener('click', e => {
    e.preventDefault();
    if (e.target.classList.contains('btn_remove')) {
        cart.removeItem(e.target.getAttribute('data-id'));
    }
});


class Product {
    constructor(name = 'EXCLUSIVE', price = 'SOLD', photo = 'no-photo', currency = '$') {
        this.name = name;
        this.price = price;
        this.photo = photo;
        this.currency = currency;
    }

    render() {
        return `<div class="product">
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
                        <div class="price">${this.currency} ${this.price}</div>
                    </div>
                </div>`;
    }
}

class ProductsList {
    constructor() {
        this.products = [];
    }

    fetchItems() {
        this.products = [
            { photo: 'images/Layer_43.jpg', name: 'Mango T-shirt', price: '52.00'},
            { photo: 'images/Layer_4.jpg', name: 'People T-shirt', price: '142.00'},
            { photo: 'images/Layer_44.jpg', name: 'T-shirt'},
            { photo: 'images/Layer_45.jpg', name: 'Mango T-shirt', price: '52.00'},
            { photo: 'images/Layer_46.jpg'},
            { photo: 'images/Layer_47.jpg', name: 'Mango People', price:'52.00'},
            { photo: 'images/Layer_48.jpg', name: 'T-shirt', price: '152.00'},
            { photo: 'images/Layer_49.jpg', price:'252.00', currency: 'P'},
            { photo: 'images/Layer_50.jpg', name: 'Mango People'}
        ];
        this.products = this.products.map(product => new Product(product.name, product.price, product.photo, product.currency));
    }

    // 2. Добавьте для GoodsList метод, определяющий суммарную стоимость всех товаров.
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
document.querySelector('.product-block').innerHTML = products.render();
products.totalPrice()

const $cart = document.querySelector('.cart__button');

$cart.addEventListener('click', e => {
    const $cartItems = document.querySelector('.cart-items');
    e.preventDefault();
    $cartItems.classList.toggle('active');
});
