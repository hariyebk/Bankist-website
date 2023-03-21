
const slides = document.querySelectorAll('.slide')
const slider = document.querySelector('.slider')
const btnright = document.querySelector('.slider__btn--right')
const btnleft = document.querySelector('.slider__btn--left')
// current slide
let curslide = 0
// maximum slide
let maxslide = slides.length
// mouse event handlers
const moveslide = function(current){
  slides.forEach((slide , i) => {
    (slide.style.transform = `translateX(${100 * (i-current)}%)`)
  })
}
moveslide(0)
const dotcontainer = document.querySelector('.dots')
// a function to create dot for each slide
const createdot = function(){
  slides.forEach((_,i) => {
    dotcontainer.insertAdjacentHTML('beforeend',
    `<button class="dots__dot" data-slide="${i}"></button>`) })
}
createdot()
// a function to activate the bc of the active dot
const activatedot = function(slide){
  // removing the active sign from all dots
  document.querySelectorAll('.dots__dot').forEach(dot =>{
    dot.classList.remove('dots__dot--active')
  })
  // adding the active sign to the active dot
  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active')
  
}
activatedot(0)
const nextslide = function(){
  if(curslide === maxslide -1) curslide = 0
  else curslide++
  moveslide(curslide)
  activatedot(curslide)
}
const preslide = function(){
  if(curslide === 0) curslide = maxslide - 1
  else curslide--
  moveslide(curslide)
  activatedot(curslide)
}
btnright.addEventListener('click', nextslide)
btnleft.addEventListener('click', preslide)

// keyboard event handlers
document.addEventListener('keydown', function(e){
  if(e.key === 'ArrowRight') nextslide()
  if(e.key === 'ArrowLeft')  preslide()
})
// dots event handler
dotcontainer.addEventListener('click', function(e){
  if(e.target.classList.contains('dots__dot')){
    const {slide} = e.target.dataset
    moveslide(slide)    
    activatedot(slide)
  }
})