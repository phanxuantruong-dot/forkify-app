import icons from 'url:../../img/icons.svg';
import view from './view.js';

class addRecipeView extends view {
  _parentElement = document.querySelector(`.upload`);
  _overlay = document.querySelector(`.overlay`);
  _window = document.querySelector(`.add-recipe-window`);
  _btnOpen = document.querySelector(`.nav__btn--add-recipe`);
  _btnClose = document.querySelector(`.btn--close-modal`);

  constructor() {
    super();
    this.addHandlerShowWindow();
    this.addHandlerCloseWindow();
  }

  addHandlerShowWindow() {
    this._btnOpen.addEventListener(`click`, this._toggleWindow.bind(this));
  }

  addHandlerCloseWindow() {
    this._btnClose.addEventListener(`click`, this._toggleWindow.bind(this));
    this._overlay.addEventListener(`click`, this._toggleWindow.bind(this));
  }

  _toggleWindow(e) {
    e.preventDefault();
    // const btn = e.target.closest(`.nav__btn`);
    // if (!btn) return;
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener(`submit`, function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });

    this._parentElement.addEventListener(
      `submit`,
      this._toggleWindow.bind(this)
    );
  }

  _generateMarkup() {}
}

export default new addRecipeView();
