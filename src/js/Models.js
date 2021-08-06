import * as config from './config.js';
import { async } from 'regenerator-runtime';
import { getJSON, sendJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    keyWords: '',
    results: [],
    resultsPerPage: config.RESULTS_PER_PAGE,
    page: 1,
  },
  bookmark: [],
};

const createRecipeObject = function (data) {
  let { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    //loading repice
    const data = await getJSON(`${config.API_URL}/${id}?key=${config.KEY}`);

    state.recipe = createRecipeObject(data);
    console.log(state.recipe);

    if (state.bookmark.some(b => b.id === state.recipe.id))
      state.recipe.isBookmarked = true;
    else state.recipe.isBookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResult = async function (query) {
  try {
    const data = await getJSON(
      `${config.API_URL}?search=${query}&key=${config.KEY}`
    );
    if (data.results === 0) throw new Error(`There's no recipe found!!!`);
    state.search.page = 1;
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
  } catch (err) {
    console.log(`Something went wrong: ${err}`);
    throw err;
  }
};

export const searchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServing = function (newServing) {
  state.recipe.ingredients.forEach(ingredient => {
    ingredient.quantity =
      (ingredient.quantity / state.recipe.servings) * newServing;
  });
  state.recipe.servings = newServing;
};

const persistBookmarks = function () {
  localStorage.setItem(`bookmarks`, JSON.stringify(state.bookmark));
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmark.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.isBookmarked = true;
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  const index = state.bookmark.findIndex(el => el.id === id);
  state.bookmark.splice(index, 1);
  if (id === state.recipe.id) state.recipe.isBookmarked = false;
  persistBookmarks();
};

export const init = async function () {
  const storage = await localStorage.getItem(`bookmarks`);
  if (storage) state.bookmark = JSON.parse(storage);
};

const clearBookmark = function () {
  localStorage.clear(`bookmarks`);
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].includes('ingredient') && entry[1] !== '')
      .map(ingredient => {
        const ingArr = ingredient[1].replaceAll(' ', '').split(',');

        if (ingArr.length < 3)
          throw new Error('Please enter the right format!!!');

        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await sendJSON(`${config.API_URL}?key=${config.KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

// clearBookmark();
