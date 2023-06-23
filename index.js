function debounce (func, ms) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout (() => {
      func.apply(this, args)
    }, ms);
  }
};

function search() {
  const baseUrl = 'https://pixabay.com/api/';
  const apiKey = '34969259-1340cd29ea32dd0019bae9b64';
  const imagesWrapper = document.querySelector('.images-wrapper');
  const searchInput = document.getElementById("search-input");
  let pageNumber;
  let searchValue;
  let images;
  function removeMarkup () {
    imagesWrapper.replaceChildren();
    document.querySelector(`[data-search='res']`)?.remove();
  };
  searchInput.addEventListener('input', debounce (() => {
    searchValue = searchInput.value.trim().replaceAll( ' ', "+" );
    if(searchValue) {
      pageNumber = 1;
      removeMarkup();
      fetchImages();
    }
  }, 1500));
  function fetchImages() {
    const res = fetch(`${baseUrl}?key=${apiKey}&q=${searchValue}&image_type=photo&page=${pageNumber}&per_page=4`)
    .then(res => res.json())
    .then(res => images = res.hits)
    .then(() => addMarkup())
    .catch(error => showError(error));
  };
  function addMarkup () {
    if (images.length === 0 && pageNumber <= 1) {
      const error = 'Oops :(';
      showError(error)
    } else {
      images.forEach(element => {
        imagesWrapper.insertAdjacentHTML('beforeEnd',
        `<li>
          <figure class='res-img'>
            <img src="${element.webformatURL}" alt="${element.tags}">
            <figcaption class='tags-img'>${element.tags}</figcaption>
          </figure>
        </li>`
        );
      });
    };
    const target = imagesWrapper.lastChild;
    observer(target);
  };
  function showError(error) {
    imagesWrapper.insertAdjacentHTML('beforebegin', 
      `
      <h2 data-search='res' class='title-2'>
      ${error}
      </h2>
      `
    );
  };
  function observer(target) {
    const options = {
      root: null,
      threshold: 1.0
    };
    const infiniteScroll = (entries, observer) => {
      if (entries[0].isIntersecting) {
        pageNumber++;
        fetchImages();
        observer.disconnect();
      };
    };
    let observer = new IntersectionObserver(infiniteScroll, options);
    if (target) {
      observer.observe(target);
    };
  };
};
search();
