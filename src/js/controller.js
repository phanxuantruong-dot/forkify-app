// import { func } from 'assert-plus';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as models from './Models.js';
import recipeView from './view/recipeView.js';
import searchView from './view/searchView.js';
import resultsView from './view/resultsView.js';
import paginationView from './view/paginationView.js';
import bookmarkView from './view/bookmarkView.js';
import addRecipeView from './view/addRecipeView.js';
import { async } from 'regenerator-runtime/runtime';
import view from './view/view.js';

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    //re-update bookmarked view

    // controlPagination();
    resultsView.update(models.searchResultsPage());

    //loading repice
    await models.loadRecipe(id);
    const recipe = models.state.recipe;

    // rendering repice
    recipeView.render(recipe);
    controlServing();
  } catch (err) {
    recipeView.renderError(err);
  }
};

const controlSearchResults = async function () {
  try {
    const searchTerm = searchView.getQuery();
    if (!searchTerm) return;

    resultsView.renderSpinner();
    await models.loadSearchResult(searchTerm);

    controlPagination();
  } catch (err) {
    console.log(`Something went wrong: ${err}`);
    resultsView.renderError('Cant find the recipe!!');
  }
};

const controlPagination = function (page = models.state.search.page) {
  resultsView.render(models.searchResultsPage(page));
  paginationView.render(models.state.search);
};

const controlServing = function (newServing = models.state.recipe.servings) {
  // update the recipe serving (in state)
  models.updateServing(newServing);
  // render the recipe view
  recipeView.update(models.state.recipe);
};

const controlAddBookmark = function () {
  if (!models.state.recipe.isBookmarked) {
    models.addBookmark(models.state.recipe);
  } else {
    models.deleteBookmark(models.state.recipe.id);
  }

  // update recipe view
  recipeView.update(models.state.recipe);
  // update bookmark view
  controlBookmarkViewUpdate();
};

const controlAddRecipe = async function (newRecipe) {
  try {
    await models.uploadRecipe(newRecipe);
    //render recipe view
    recipeView.render(models.state.recipe);

    //re-render bookmark view
    controlBookmarkViewUpdate();

    // change ID in url
    window.history.pushState(null, '', `#${models.state.recipe.id}`);
  } catch (err) {
    console.error(err);
  }
};

const controlBookmarkViewUpdate = function () {
  if (models.state.bookmark.length === 0)
    bookmarkView.renderError(`No bookmarks yet!`);
  else bookmarkView.render(models.state.bookmark);
};

const init = async function () {
  await models.init();
  controlBookmarkViewUpdate();

  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearchButton(controlSearchResults);
  searchView.addHandlerSearchSubmit(controlSearchResults);
  paginationView.addHandlerPaginationBtn(controlPagination);
  recipeView.addHandlerServingSize(controlServing);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
