import icons from 'url:../../img/icons.svg';
export default class view {
  _data;
  _parentElement;
  /**
   * Render the receive object to the DOM
   * @param { Object | Object[]} data The data to be render (e.g recipe)
   * @returns {undefined}
   */
  render(data) {
    this._data = data;
    const markup = this._generateMarkup();
    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML(`afterbegin`, markup);
  }

  renderSpinner() {
    const markup = `
        <div class="spinner">
                <svg>
                  <use href="${icons}#icon-loader"></use>
                </svg>
              </div>
        `;
    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message) {
    const markup = `
        <div class="error">
                <div>
                  <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                  </svg>
                </div>
                <p>${message}</p>
              </div>
        `;
    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll(`*`));

    newElements.forEach((newEl, index) => {
      const curEl = curElements[index];

      //update change text.
      if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim())
        curEl.textContent = newEl.textContent;

      //update change attribute.
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }
}
