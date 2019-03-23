const CURRENCY = '$';

const products = [
    { photo: 'images/Layer_43.jpg', name: 'Mango T-shirt', price: CURRENCY + '52.00'},
    { photo: 'images/Layer_4.jpg', name: 'People T-shirt', price: CURRENCY + '142.00'},
    { photo: 'images/Layer_44.jpg', name: 'T-shirt'},
    { photo: 'images/Layer_45.jpg', name: 'Mango T-shirt', price: CURRENCY + '52.00'},
    { photo: 'images/Layer_46.jpg', name: 'People T-shirt', price: CURRENCY + '252.00'},
    { photo: 'images/Layer_47.jpg', name: 'Mango People', price: CURRENCY + '52.00'},
    { photo: 'images/Layer_48.jpg', name: 'T-shirt', price: CURRENCY + '152.00'},
    { photo: 'images/Layer_49.jpg', name: 'Mango T-shirt', price: CURRENCY + '252.00'},
    { photo: 'images/Layer_50.jpg', name: 'Mango People'}
];

const renderGoodsItem = (photo ='no photo', name = 'no title', price = 'sold') => {
    return `<div class="product">
               <a href="single-page.html" class="photo-link">
                   <div class="photo" style="background:url(${photo}) no-repeat;"></div>
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
                   <div class="name">${name}</div>
                   <div class="price">${price}</div>
               </div>
          </div>`;
};

const renderGoodsList = (list) => {
    const goodsList = list.map(item => renderGoodsItem(item.photo, item.name, item.price));
    // Проблема была в данной строке, мы передавали в Inner Html массив в котором лежат наши Div элементы,
    // Поэтому все содержимое массива вывелось как одна большая строка, и вывелось на экран  товар1,товар2 
    document.querySelector('.product-block').innerHTML = goodsList.join('');
};

renderGoodsList(products);

let $cart = document.querySelector('.cart__button');

$cart.addEventListener('click', e => {
    const $cartItems = document.querySelector('.cart-items');
    e.preventDefault();
    $cartItems.classList.toggle('active');
});
