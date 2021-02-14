const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '20264509-7631d2fa21c269f8048612398';

// show images 
const showImages = (images) => {

  if (images.length == 0) {
   return errorMassage()
  }
  else {
    imagesArea.style.display = 'block';
    gallery.innerHTML = '';
    toggleSpinner();
    // show gallery title
    galleryHeader.style.display = 'flex';
    images.forEach(image => {
      let div = document.createElement('div');
      div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2 ';
      div.innerHTML = ` <img class="img-fluid img-thumbnail hover"  onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">
                        <p class = "text-center"> Tags :<span class = "text-capitalize"> ${image.tags}</span></P>
                        <button type="button" class="btn btn-primary active ml-4" data-bs-toggle="button" autocomplete="off" aria-pressed="true"><a target ="_blank"  class = 'text-white text-decoration-none' href="${image.largeImageURL}">Download This Picture</a></button>
      `;
      gallery.appendChild(div);
      
    })
 }

}

const getImages = (query) => {
  const url = `https://pixabay.com/api/?key=${KEY}&q=${query}&image_type=photo`
  toggleSpinner()
  fetch(url)
    .then(response => response.json())
    .then(data => showImages(data.hits))
    .catch(err => apiProblem(err))
  
}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.add('added');
 
  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  } 
  
  else {
    element.classList.toggle('added');
    if (item != -1) {
      delete sliders[item];
    }
  }
}
var timer
const createSlider = () => {
 
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
 
  // hide image area
  imagesArea.style.display = 'none';
  setTimeout(function(){ slideToggleSpinner(); }, 100);
  const duration = document.getElementById('duration').value || 1000;
  if (duration > 0) {
    document.getElementById('duration').value = duration ;
    sliders.forEach(slide => {
      let item = document.createElement('div')
      item.className = "slider-item";
      item.innerHTML = `<img class="w-100"
      src="${slide}"
      alt="">`;
      sliderContainer.appendChild(item)
    })
  
      changeSlide(0)
      slideToggleSpinner()
      timer = setInterval(function () {
        slideIndex++;
        changeSlide(slideIndex);
      }, duration);
  } 
  else{
    alert('please Input Valid Duration')
    getImages(search.value)
    const spinner = document.getElementById('loading-spinner');
    spinner.classList.toggle('d-none')
    
  }

}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value)
  sliders.length = 0;
})


sliderBtn.addEventListener('click', function () {
  createSlider();
})

// keyboard response for search image
document.getElementById('search').addEventListener('keypress', function (event) {
  if (event.key == 'Enter') {
    document.getElementById('search-btn').click();
  }
})

//keyboard response for change duration
document.getElementById('duration').addEventListener('keypress', function (event) {
  if (event.key == 'Enter') {
    document.getElementById('create-slider').click();
  }
})

// spinner

const toggleSpinner = () => {
  const spinner = document.getElementById('loading-spinner');
  const galleryContainer = document.getElementById('gallery-container');
  spinner.classList.toggle('d-none')
  galleryContainer.classList.toggle('d-none')
}

// slider spinner
const slideToggleSpinner = () => {
  const spinner = document.getElementById('loading-spinner');
  spinner.classList.toggle('d-none')
  const slideSpinner = document.getElementById('slide-loader');
  slideSpinner.classList.toggle('d-none')
}

// Error massage handling

const errorMassage = () =>{
  const showingMsg = document.getElementById('error-msg');
   const div = document.createElement('div')
   div.className = 'massage-style'
   div.innerHTML = `
   <h1> Please Input Valid Image Name </h1>
   `
   showingMsg.appendChild(div)
   document.getElementById('gallery-container').innerText = ''
   toggleSpinner()
}

const apiProblem = () => {
  const fetchError = document.getElementById('fetch-error-msg');
   const h2 = document.createElement('h2')
   h2.innerHTML = `
   <h2> Something wrong, Please Try Again Letter </h2>
   `
   fetchError.appendChild(h2)
   document.getElementById('gallery-container').innerText = ''
   toggleSpinner()
}
