class searchView {
  _parentEl = document.querySelector(`.search`);

  getQuery() {
    const searchTerm = this._parentEl.querySelector('.search__field').value;
    this._clearSearch();
    return searchTerm;
  }

  addHandlerSearchSubmit(handler) {
    this._parentEl.addEventListener(`submit`, function (e) {
      e.preventDefault();
      handler();
    });
  }

  addHandlerSearchButton(handler) {
    this._parentEl.addEventListener(`click`, function (e) {
      e.preventDefault();
      if (e.target.closest(`.btn`)) {
        handler();
      }
    });
  }

  _clearSearch() {
    document.querySelector('.search__field').value = '';
  }
}
export default new searchView();
