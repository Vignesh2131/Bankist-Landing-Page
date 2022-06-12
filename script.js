'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll
  ('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
///////////////////////////////////////////////////////
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener
  ('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
//////////////////////////////
///BUTTON SCROLLING///

btnScrollTo.addEventListener('click', function (e) {
  // const s1cords = section1.getBoundingClientRect();
  // console.log(s1cords);

  // console.log(e.target.getBoundingClientRect());

  // console.log(window.pageXOffset, window.pageYOffset);

  // console.log('Height and width of view port', document.documentElement.clientHeight,
  //   document.documentElement.clientWidth);
  
  //Scrolling
  //window.scrollTo(s1cords.left + window.pageXOffset, s1cords.top + window.pageYOffset);
  // window.scrollTo({
  //   left:s1cords.left + window.pageXOffset,
  //   top: s1cords.top + window.pageYOffset,
  //   behavior: 'smooth'
  // });
  
  //Modern method
  section1.scrollIntoView({ behavior: 'smooth' });
});
/////////////////////////
//Page Navigation//(EVENT DELEGATIONS)-Add the event handler on the parent child rather than the target

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   })
// })

//1.Add event listener to common parent element
//2.Determine what element originated the event

document.querySelector('.nav__links').addEventListener
  ('click', function (e) {
    console.log(e.target);
    
    //Matching strategy
    if (e.target.classList.contains('nav__link')) {
      e.preventDefault();
         const id = e.target.getAttribute('href');
      document.querySelector(id).scrollIntoView
        ({ behavior: 'smooth' });
    }
})


/////TABBED COMPONENT/////
  
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  //Guard class
  if (!clicked) return;
  
  //Removing active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  
  //Active tab
  clicked.classList.add('operations__tab--active');
  
  //Activate content area
  document.querySelector
    (`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
})

//Menu fade animation (Passing arguments to event handlers)

const handleFade = function (e,/*opacity*/) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const sibilings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    sibilings.forEach(el => {
      if (el !== link)
        el.style.opacity = this;//el.style.opacity=opactiy
    });
    logo.style.opacity = this;//el.style.opacity=opacity

  }
}

nav.addEventListener('mouseover', handleFade.bind(0.5));
//nav.addEventListener('mouseover',function(e){handleFade(e,0.5)});

nav.addEventListener('mouseout', handleFade.bind(1))

/*
///Sticky Navigation(Scroll Event)
const intialCords = section1.getBoundingClientRect();

window.addEventListener('scroll', function (e) {
  if (this.window.scrollY > intialCords.top)
    nav.classList.add('sticky');
  else
    nav.classList.remove('sticky');
})
*/
/*
///Intersection Observer API///
//when section1 is intersecting the viewport at 10% , then obsCallback function will be called
const obsCallback = function (entries,observer) {
  //entires are array of threshold values.
  entries.forEach(entry => console.log(entry));
};

const observerOpts = {
  root: null,
  threshold: [0,0.2],//percentage of intersection at which the obscallback will be called
  
}
const observer = new IntersectionObserver(obsCallback,observerOpts);
observer.observe(section1);
*/
///////////STICKY NAVIGATION////////////////
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting)
    nav.classList.add('sticky');
  else 
    nav.classList.remove('sticky');
    
}
const headerObserver = new IntersectionObserver(
  stickyNav, {
    root: null,
    threshold: 0,
    rootMargin:`-${navHeight}px`,
  }
);
headerObserver.observe(header);

//////////REVEALING ELEMENTS ON SCROLL/////////////

const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  
}

const sectionObserver = new IntersectionObserver(
  revealSection, {
    root: null,
    threshold: 0.15,
  }
);
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  //section.classList.add('section--hidden');
});

////////////LAZY LOADING IMAGES////////////
const imageTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  //replace src with data src
  entry.target.src = entry.target.dataset.src;


  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);

};

const imageObserver = new IntersectionObserver(loadImg,
  {
    root: null,
    threshold: 0,
    rootMargin: '-200px'
  });

imageTargets.forEach(img => imageObserver.observe(img));

// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();


/////////////////
/////////////////
/*
////Selecting, Creating, and Deleting elements.

//Selecting elements
console.log(document.documentElement);
console.log(document.body);
console.log(document.head);

const header=document.querySelector('.header');
const allSections = document.querySelectorAll('.section');//return NodeList and it will not be updated
console.log(allSections);

document.getElementById('section--1');
const allBtns = document.getElementsByTagName('button');//returns HTML collections and it will get updated
console.log(allBtns);

console.log(document.getElementsByClassName('btn'));

///Creating and inserting elements///
// .insertAdjacentHTML

const message = document.createElement('div');
message.classList.add('cookie-message');
//message.textContent = 'We use cookies for improved analytics and functionality';
message.innerHTML = 'We use cookied for improved functionality and analytics <button class="btn btn--close-cookie">Got it</button>';

//header.prepend(message);//It adds the element as first child
header.append(message);
//header.append(message.cloneNode(true));

//header.before(message)
//header.after(message)

///Deleting elements///
document.querySelector('.btn--close-cookie').addEventListener('click', function () {
  message.remove();
  //message.parentElement.removeChild(message);
})

///Styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%';


console.log(message.style.backgroundColor);//gets the styles from inline
console.log(getComputedStyle(message).color);//gets the styles from external sheets'
console.log(getComputedStyle(message).height);

message.style.height = Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';


document.documentElement.style.setProperty
  ('--color-primary', 'orangered');

///Attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src);
console.log(logo.className);

logo.alt='Beautiful minimalist logo'

//Non-standard
console.log(logo.designer);
console.log(logo.getAttribute('designer'));
logo.setAttribute('company', 'Bankist');
console.log(logo.getAttribute('src'));


const link = document.querySelector('.twitter-link');
console.log(link.href);
console.log(link.getAttribute('href'));

//Data Attributes
console.log(logo.dataset.versionNumber);

//Classes
logo.classList.add();
logo.classList.remove();
logo.classList.toggle();
logo.classList.contains();
//Don't use because overrides the existing classes
logo.className='jonas';
*/


/////--TYPE OF EVENT AND EVENT HANDLERS--/////
/*

const h1 = document.querySelector('h1');

const alert1 = function (e) {
  alert('addEventListener:Great!');

  h1.removeEventListener('mouseenter', alert1);
};


h1.addEventListener('mouseenter', alert1);

// h1.onmouseenter = function (e) {
//   alert('addEventListener:Great!');
// };
*/

///---EVENT PROPAGATION---///
/*
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomCol=() => `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click',
  function (e) {
    this.style.backgroundColor = randomCol();
    console.log('LINK', e.target, e.currentTarget);
    console.log(e.currentTarget === this);

    //Stop propagation
    //e.stopPropagation();
  });

document.querySelector('.nav__links').addEventListener('click',
  function (e) {
    this.style.backgroundColor = randomCol();
    console.log('CONTAINER', e.target,e.currentTarget);
    
  });

document.querySelector('.nav').addEventListener('click',
  function (e) {
    this.style.backgroundColor = randomCol();
    console.log('NAv', e.target,e.currentTarget)
  };
  */


////////////////////////////////
///-DOM TRAVERSING-///
/*
const h1 = document.querySelector('h1');

//Going downwards:child
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);//Nodes can be anything.
console.log(h1.children);
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color='orangered'

//Going upwards
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest('.header').style.background='var(--gradient-secondary)'

//Sideways:sibilings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);
console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function (e) {
  if (e !== h1)
    e.style.transform='scale(0.5)'
})
*/
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML Parsed and DOM tree built', e);
});

document.addEventListener('load', function (e) {
  console.log('Complete page has been loaded', e)
});

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// })