import view from './view.js';
import icons from 'url:../../img/icons.svg';

class paginationView extends view {
  _parentElement = document.querySelector('.pagination');

  _render(data) {
    this._data = data;
    const markup = this._generateMarkup();
    console.log(markup);
    this._parentElement.insertAdjacentHTML(`afterbegin`, markup);
  }
  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1, and there are other pages
    if (numPages > 1 && this._data.page === 1)
      return `<button data-goto = "${
        this._data.page + 1
      }" class="btn--inline pagination__btn--next">
    <span>Page ${this._data.page + 1}</span>
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
    </svg>
  </button>`;
    // Last page
    if (this._data.page === numPages && numPages > 1)
      return `<button data-goto = "${
        this._data.page - 1
      }" class="btn--inline pagination__btn--prev">
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
    </svg>
    <span>Page ${this._data.page - 1}</span>
  </button>`;
    // Other page
    if (this._data.page < numPages && numPages > 1)
      return `<button data-goto = "${
        this._data.page + 1
      }" class="btn--inline pagination__btn--next">
    <span>Page ${this._data.page + 1}</span>
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
    </svg>
  </button> <button data-goto = "${
    this._data.page - 1
  }" class="btn--inline pagination__btn--prev">
  <svg class="search__icon">
    <use href="${icons}#icon-arrow-left"></use>
  </svg>
  <span>Page ${this._data.page - 1}</span>
</button>`;
    // Page 1, and there are No other page
    return ``;
  }
  addHandlerPaginationBtn(handler) {
    this._parentElement.addEventListener(`click`, function (e) {
      e.preventDefault;
      const btn = e.target.closest(`.btn--inline`);
      if (!btn) return;
      const page = +btn.dataset.goto;
      handler(page);
    });
  }
}

export default new paginationView();
