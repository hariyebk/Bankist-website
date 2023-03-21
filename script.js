'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnscroll = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabscontainer = document.querySelector('.operations__tab-container');
const tabscontent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
// a node list can also have foreach loop
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// scroll

btnscroll.addEventListener('click', function (e) {
  // getting location coordinates and dimensions of elements (DomRect)
  // console.log(e.target.getBoundingClientRect())
  // console.log('height/width of view port', document.documentElement.clientHeight, document.documentElement.clientWidth)
  // scrolling to scetion1 when a button is clicked.
  // for old browsers
  // window.scrollTo(section.getBoundingClientRect())
  // for new browsers
  section1.scrollIntoView({ behavior: 'smooth' });
});

// page navigation

// this method creates multiple callback fucntions for same event and that affects the performance
// document.querySelectorAll('.nav__link').forEach(ln => {
//   ln.addEventListener('click', function (e) {
//     e.preventDefault();
//     // getting the id of scroll destination
//     const id = ln.getAttribute('href')
//     document.querySelector(`${id}`).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// handling events in an efficient and organized way. event delegation

// Event delegation is a technique where instead of attaching an event listener to each individual element, you attach it to a common ancestor element. This way, you can handle events that occur on child elements without having to attach a separate listener to each one.
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // to select only the links and not the space between them
  if (e.target.classList.contains('nav__link')) {
    // getting the id of scroll destination
    const id = e.target.getAttribute('href');
    document.querySelector(`${id}`).scrollIntoView({ behavior: 'smooth' });
  }
});

// tabbed components
// event delegation on tabs
tabscontainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;
  // removing the active tab and it's content.
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabscontent.forEach(content =>
    content.classList.remove('operations__content--active')
  );
  // adding the active tab and it's content
  clicked.classList.add('operations__tab--active');
  const activecontent = document.querySelector(
    `.operations__content--${clicked.getAttribute('data-tab')}`
  );
  activecontent.classList.add('operations__content--active');
});

// Menu fade animation

// code rafctor
const blur = function (e) {
  const hovered = e.target;
  const otherlinks = hovered.closest('nav').querySelectorAll('.nav__link');
  const logo = hovered.closest('nav').querySelector('.nav__logo');
  if (hovered.classList.contains('nav__link')) {
    otherlinks.forEach(el => {
      if (el !== hovered) {
        el.style.opacity = this;
        logo.style.opacity = this;
      }
    });
  } else {
    return;
  }
};
nav.addEventListener('mouseover', blur.bind(0.5));
nav.addEventListener('mouseout', blur.bind(1));

// stciky navigation
// const sec1initialcoo = section1.getBoundingClientRect().top
// window.addEventListener('scroll',function(e){
//   if(this.scrollY > sec1initialcoo)
//   nav.classList.add('stickynav')
//   else nav.classList.remove('stickynav')
// })

// // how intersection api works
//     // detecting the visibility of our target based the threshold value
// const callback = function(entries,observer){
//   entries.forEach(entry => {
//     console.log(entry)
//   })

// }
// const option = {
//   root: null, // the viewport when set to null it observes the entire page
//   threshold: 0.1 // the percentage of visibility of our target
// }

// const observer = new IntersectionObserver(callback,option)
// observer.observe(section1) //
const stickynav = function (entries) {
  // entries parameter is an array of the threshold by default.
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('stickynav');
  else nav.classList.remove('stickynav');
};
const headerobserver = new IntersectionObserver(stickynav, {
  root: null,
  threshold: 0,
  rootMargin: `-${nav.getBoundingClientRect().height}px`, // navigation bar height
});
headerobserver.observe(header);

// section reveal
const allsections = document.querySelectorAll('.section');
const revealsection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionobserver = new IntersectionObserver(revealsection, {
  root: null,
  threshold: 0.15,
});
allsections.forEach(sec => {
  sec.classList.add('section--hidden');
  sectionobserver.observe(sec);
});

// Lazy Loading
const allimages = document.querySelectorAll('img[data-src]');

const view = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
    observer.unobserve(entry.target);
  });
};
const imageobserver = new IntersectionObserver(view, {
  root: null,
  threshold: 0,
  rootMargin: '20px',
});
allimages.forEach(img => {
  img.classList.add('lazy-img')
  imageobserver.observe(img);
});

// slider

const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const btnright = document.querySelector('.slider__btn--right');
const btnleft = document.querySelector('.slider__btn--left');
let curslide = 0;
let maxslide = slides.length - 1;

// a function to move the slides across the x axsis
const moveslide = function (current) {
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${100 * (i - current)}%)`;
  });
};
moveslide(0);
// button event handlers
const next = function () {
  if (curslide === maxslide) curslide = 0;
  else curslide++;
  moveslide(curslide);
  activedot(curslide)
};
const pre = function () {
  if (curslide === 0) curslide = maxslide;
  else curslide--;
  moveslide(curslide);
  activedot(curslide)
};
btnright.addEventListener('click', next);
btnleft.addEventListener('click', pre);
// keyboard event handler
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') next();
  if (e.key === 'ArrowLeft') pre();
});
//dots
const dotcontainer = document.querySelector('.dots');
// a function to create the dots
const createdots = function () {
  slides.forEach((_, i) => {
    dotcontainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};
createdots();
// a function to activate the dot color
const activedot = function (slide) {
  // remove the active class from all
  document.querySelectorAll('.dots__dot').forEach(dot => {
    dot.classList.remove('dots__dot--active');
  });
  // adding the active class to the current slide
  document
      .querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active')
};
activedot(0);
// event delegation
dotcontainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    moveslide(slide);
    activedot(slide);
  }
});

// lifecycle dom events
  // Domcontentloaded
document.addEventListener('DOMContentLoaded', function(e){
  console.log(' Html file downloaded' , e)
})
  // load
window.addEventListener('load', function(e){
  console.log('all source files are downloaded', e)
})

// unload
window.addEventListener('unload', function(e){
  e.preventDefault()
  console.log(e)
})

/// lectures

//**** selectiong elements */
// document.documentElement;
// document.head;
// const header = document.querySelector('.header');
// //*** return a nodelist */
// document.querySelectorAll('.operation');
// // *** return live html collections ///
// document.getElementById('logo');
// document.getElementsByTagName('section');
// document.getElementsByClassName('icon');

// // creat element in the dom
// const message = document.createElement('div');
// // giving a class name for the new element
// message.classList.add('cookie-message');
// // adding contents in the element
// message.innerHTML = ` we are using cookies for a better functionality and performance.<button class ='btn btn--close-cooki'> Got it </button>'`;
// // Inserting element in the dom
// // prepend -> 1st child in the header element
// // header.prepend(message)
// // append -> last child in the header element
// // if we want the element to be on both.
// // header.append(message.cloneNode(true))

// // header.before(message) // sibling element
// // header.after(message.cloneNode(true)) // sibling

// header.append(message);

// deleting the element
// document.querySelector('.btn--close-cooki').addEventListener('click', function(){
//   message.remove()
//   // message.parentNode.removeChild(message)
//   // message.parentNode selects the parent element of message
// })

// adding css styles
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';
// // for propeties inside a class
// // console.log(message.style.color) // returns nothing so we use getcomputedstyle method
// // console.log(getComputedStyle(message).height)
// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height) + 40 + 'px';
// // setproperty method for custom variables in css

// message.style.setProperty('font-size', '2.5rem');

// // console.log(message.style.getPropertyValue('font-size'))
// document.documentElement.style.setProperty('--color-primary', 'cyan');

// // getting and setting attributes
// const logo = document.querySelector('.nav__logo');
// // console.log(logo.alt)
// // console.log(logo.src) // returns the absolute position
// // console.log(logo.getAttribute('src')) // returns relative position
// logo.setAttribute('designer', 'harun');
// // to display non standard attributes ( custom defined) we use getattribute
// // console.log(logo.getAttribute('designer'))
// // special data attributes
// logo.setAttribute('data-version-number', '2.0');
// // to display the data version attribute
// // console.log(logo.dataset.versionNumber)
// // class methos
// logo.classList.add('c');
// logo.classList.remove('c');
// logo.classList.toggle('c');
// logo.classList.contains('c');
// // console.log(logo)

// // implementing the scroll when lern more is clicked

// const btncookie = document.querySelector('.btn--close-cooki');
// const section2 = document.querySelector('#section--2');
// btncookie.addEventListener('click', function (e) {
//   section2.scrollIntoView({ behavior: 'smooth' });
// });
// handling event litsners
// const heading1 = document.querySelector('h1');
// const alert = function () {
//   // console.log('You are now reading the heading');
// };
// heading1.addEventListener('mouseover', alert);
// setTimeout(() => {
//   heading1.removeEventListener('mouseover', alert);
//   // console.log('eventlistener removed')
// }, 5000);
// old school
// btnscroll.onmouseenter = function(){
//   console.log('click it !!')
// }

// event propagation
// capturing phase
// target phase
// bubbling phase
// a function that generates a random number between two numbers
// const randomnum = (num1, num2) => {
//   return Math.floor(Math.random() * (num2 - num1) + num1);
// };
// // random color generator
// const randomcolor = () =>
//   `rgb(${randomnum(0, 255)}, ${randomnum(0, 255)}, ${randomnum(0, 255)})`;
// event propagation practical
// if the parent node and the child node handle the same type of event, event propagation occurs. each parent node handles it's own event plus the propagated event from the child node.
// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomcolor();
//   console.log('Link:', e.target) // the element(target) where the event happend.
//   //propagates up with bubbling
// });
// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomcolor();
//   console.log('Container:', e.target)
//   // To stop propagation
//   e.stopPropagation()
// });
// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomcolor();
//   console.log('Nav:', e.target)

// });

// what I learned yesterday
// event propagation/bubbling
// event delegation for smooth scrolling beahviour

// DOM Transversing

// const h1 = document.querySelector('h1');

// // moving downward childs
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children); // child elements
// h1.firstElementChild.style.color = 'orangered';
// h1.lastElementChild.style.fontSize = '9rem';

// // moving upward parents
// console.log(h1.closest('header'));
// console.log(h1.parentNode);
// console.log(h1.parentElement);
// h1.closest('.header').style.background = 'var(--gradient-secondary)';

// // moving sideways siblings
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);
// console.log(h1.previousSibling);

// console.log(h1.nextSibling)
