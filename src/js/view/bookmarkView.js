import icons from 'url:../../img/icons.svg';
import view from './view.js';
import previewView from './previewView.js';

class bookmarkView extends view {
  _parentElement = document.querySelector(`.bookmarks__list`);
  _errorMessage = `No bookmarks found!`;
  _message = ``;

  _generateMarkup() {
    return this._data.map(rep => previewView._generateMarkup(rep)).join('');
  }

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
}

export default new bookmarkView();
