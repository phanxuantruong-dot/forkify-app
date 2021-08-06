import view from './view.js';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView.js';

class resultsView extends view {
  _parentElement = document.querySelector('.results');

  _generateMarkup() {
    return this._data.map(rep => previewView._generateMarkup(rep)).join('');
  }
}

export default new resultsView();
