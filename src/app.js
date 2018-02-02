/* Code goes here */
import './styles/app.scss';

class Mashed {
  constructor(element) {
    this.root = element;

      var searchButton = document.getElementById('searchBtn');

      searchButton.addEventListener('click', () => {
        var searchWord = document.getElementById('searchInput').value
        this.fetchFlickrPhotos(searchWord)
        this.fetchWordlabWords(searchWord)
      });
  }
  

  flickrImg(data) {
    let flickr = "";
    data.photos.photo.map((photo) => {
      flickr += `<li class="result"><p><img src="${photo.url_m}"></p></li>`;
    });

    document.querySelector('.results ul').innerHTML = flickr;
  }

  fetchFlickrPhotos(query) {
    let resourceUrl ='https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key='
    let flickrAPIkey = process.env.FLICKR_KEY;

    let flickrQueryParams =
      '&text=' + query +
      '&extras=url_m&format=json&nojsoncallback=1'
    let flickrUrl = resourceUrl + flickrAPIkey + flickrQueryParams

    fetch(flickrUrl)
      .then(res => res.json())
      .then((data) => {
        this.flickrImg(data)
         console.log(data)
      })
      .catch(err => console.error(err))
  }

  wordLabWords(data) {
    let wordLab = "";
    data.verb.syn.map((n) => {
      wordLab += `<li><a>${n}</a></li>`;
    });

    document.querySelector('.wordList').innerHTML = wordLab;

    document.querySelectorAll('.wordList li a').forEach((element) => {
      element.addEventListener('click', (event) => {
        this.fetchFlickrPhotos(event.target.text);
        this.fetchWordlabWords(event.target.text);
        
      })
    });
  }

  fetchWordlabWords(query) {
    let wordLabAPIkey = process.env.WORDLAB_KEY;
    let wordLabUrl = `http://words.bighugelabs.com/api/2/${wordLabAPIkey}/${query}/json`

    fetch(wordLabUrl)
      .then(res => res.json())
      .then(data => {
        this.wordLabWords(data)
        console.log(data.verb.syn)
      })
      .catch(err => console.error(err))
  }
}

(function() {
  new Mashed(document.querySelector('#mashed'))
})();