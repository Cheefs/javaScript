// * Некая сеть фастфуда предлагает несколько видов гамбургеров:
//      Маленький (50 рублей, 20 калорий).
//      Большой (100 рублей, 40 калорий).
//      Гамбургер может быть с одним из нескольких видов начинок (обязательно):
//          С сыром (+10 рублей, +20 калорий).
//          С салатом (+20 рублей, +5 калорий).
//          С картофелем (+15 рублей, +10 калорий).
//      Дополнительно гамбургер можно посыпать приправой (+15 рублей, +0 калорий) и полить майонезом (+20 рублей, +5 калорий). 
//      Напишите программу, рассчитывающую стоимость и калорийность гамбургера. Можно использовать примерную архитектуру класса со следующей страницы, 
//      но можно использовать и свою.

const SIZE_SMALL = 'small'; // Маленький (50 рублей, 20 калорий).
const SIZE_BIG = 'big'; //Большой (100 рублей, 40 калорий).

const SUFFING_CHEASE = 'chease'; // С сыром (+10 рублей, +20 калорий).
const SUFFING_SALAD = 'salad'; //С салатом (+20 рублей, +5 калорий).
const SUFFING_POTATO = 'potato'; //  С картофелем (+15 рублей, +10 калорий).

const TOPPING_TRIMMINGS = 'trimmings'; // посыпать приправой (+15 рублей, +0 калорий)
const TOPPING_MAYO= 'mayo'; // полить майонезом (+20 рублей, +5 калорий). 

class Hamburger {
  constructor(size, stuffing) {
    this.size = size;
    this.stuffing = stuffing;
    this.calories = 0;
    this.price = 0;
    this.listToppings = [];

    if (this.size === SIZE_SMALL) {
      this.price += 50;
      this.calories += 20;
    } else {
      this.price += 100;
      this.calories += 40;
    }

    if (this.stuffing === SUFFING_CHEASE) {
      this.price += 10;
      this.calories += 20;
    }  else if (this.stuffing === SUFFING_SALAD) {
      this.price += 20;
      this.calories += 5;
    } else {
      this.price += 15;
      this.calories += 10;
    }
  }

  addTopping(topping = null) {
    if (topping !== null ) {
      if (topping === TOPPING_TRIMMINGS) {
        this.price += 15;
      } else {
        this.price += 20;
        this.calories += 5;
      }
      this.listToppings.push(topping);
    }
  }  

  removeTopping(topping) {
    if (this.listToppings.length > 0 ) {
      for (var i = 0; i<this.listToppings.length; i++) {
        if (listToppings[i] === topping ) {
          if (listToppings[i] === TOPPING_TRIMMINGS) {
            this.price -= 15;
          } else {
            this.price -= 20;
            this.calories -= 5;
          }
          listToppings.splice(i, 1);
          break;
        }
      }
    } 
  }

  getToppings() { 
    return this.listToppings;
  }

  getPrice() {
    return this.price;
  }     

  getCalories() { 
    return this.calories;
  } 
}

const hamburger = new Hamburger(SIZE_SMALL, SUFFING_CHEASE);
const listToppings = hamburger.getToppings();
  hamburger.addTopping(TOPPING_TRIMMINGS);
  hamburger.addTopping(TOPPING_MAYO);
  hamburger.addTopping(TOPPING_MAYO);
  hamburger.removeTopping(TOPPING_MAYO);
console.log(hamburger.getPrice());
console.log(hamburger.getCalories());