/*
    1. Дан большой текст, в котором для оформления прямой речи используются одинарные кавычки. Придумать шаблон, который заменяет одинарные кавычки на двойные.
    2. Улучшить шаблон так, чтобы в конструкциях типа aren't одинарная кавычка не заменялась на двойную.
    
    3*. Создать форму обратной связи с полями: Имя, Телефон, E-mail, текст, кнопка Отправить. При нажатии на кнопку Отправить произвести валидацию полей следующим образом:
        a.  Имя содержит только буквы.
        b.  Телефон имеет вид +7(000)000-0000.
        c.  E-mail имеет вид mymail@mail.ru, или my.mail@mail.ru, или my-mail@mail.ru.
        d.  Текст произвольный.
        e.  Если одно из полей не прошло валидацию, необходимо выделить это поле красной рамкой и сообщить пользователю об ошибке. 
*/

const str = `Lorem, ipsum dolor sit 'amet consectetur' adipisicing elit. Iure velit accusantium quas. 
            Magni laboriosam 'aliquid' eligendi iure id labore 'fugit', modi officiis autem eum corrupti, maiores beatae veritatis at, 
            in soluta? Sequi don't explicabo 'voluptates nam fuga animi'. N'isi num'quam fugiat recusandae minima, repudiandae iusto odio voluptates. 
            Laboriosam aren't 'quaerat' repudiandae ipsa?`;
const regExp1 = /'/g;  // регулярка для первого задания
const regExp2 = /\B'|'\B/g; // регулярка для второго задания задания (такая регульяка тоже подходила, для данного текста /\W'|'\W/g )
const result1 =  str.replace(regExp1,'"')
const result2 =  str.replace(regExp2, (item) => {
    return item.replace('\'','"')
});
  
console.log(result2);

/// Task 3
const NAME_REGEX = /\d|\s|[^a-zA-Zа-яА-Я]/; 
const PHONE_REGEX = /^\+\d\(\d{3}\)\d{3}-\d{4}$/;
const EMAIL_REGEX = /^[a-zA-Zа-яА-Я0-9]+?.[a-zA-Zа-яА-Я0-9]+\@[a-zA-Zа-яА-Я0-9]+\.[a-zA-Zа-яА-Я]{2,3}$/;
const TEXT_REGEX = /[a-zA-Zа-яА-Я0-9]+/;

const $btn = document.getElementById('btnSubmit');

$btn.addEventListener('click', () => {
    const $name = document.getElementById('inputName');
    const $phone = document.getElementById('inputPhone');
    const $email = document.getElementById('inputEmail');
    const $text = document.getElementById('inputText');

    validate($name, ($name.value.match(NAME_REGEX) === null), 'Имя должно содержать только буквы');
    validate($phone, PHONE_REGEX.test($phone.value), 'Телефон должен быть в формате +9(999)999-9999');
    validate($email, EMAIL_REGEX.test($email.value), 'Email должен быть в формате example@example.com');
    validate($text, TEXT_REGEX.test($text.value));
});

function validate($node, isValid, message = null) {
    if ($node.value.trim() !== '') {
        if (!isValid) {
            addError($node);
            $node.nextElementSibling.textContent = message;
        } else {
            removeError($node);
        }
    } else {
        addError($node);
        $node.nextElementSibling.textContent = 'Поле не может быть пустым';
    }
}

function removeError($node) {
    $node.parentElement.classList.remove('has_error');
    $node.parentElement.classList.add('has_success');
    $node.nextElementSibling.classList.add('hide');
}

function addError($node) {
    $node.parentElement.classList.remove('has_success');
    $node.parentElement.classList.add('has_error');
    $node.nextElementSibling.classList.remove('hide');
}