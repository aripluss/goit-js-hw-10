import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('input#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function clearAll() {
  countryListEl.innerHTML = '';
  countryInfoEl.innerHTML = '';
}

function onInput(event) {
  const countryToFind = event.target.value.trim();

  if (countryToFind.length === 0) {
    clearAll();
    return;
  }

  fetchCountries(countryToFind)
    .then(data => {
      if (data.length > 10) {
        clearAll();
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }

      if (data.length >= 2 && data.length <= 10) {
        countryInfoEl.innerHTML = '';
        countryListEl.innerHTML = createListOfCountries(data);
      }

      if (data.length === 1) {
        countryListEl.innerHTML = '';
        countryInfoEl.innerHTML = createCountryCard(data);
      }
    })
    .catch(err => {
      switch (err.message) {
        case '404': {
          clearAll();
          Notiflix.Notify.failure('Oops, there is no country with that name');
          break;
        }
      }
    });
}

function createListOfCountries(countries) {
  return countries
    .map(
      country =>
        `<li class="item">
        <img alt="flag" src="${country.flags.svg}" width="25" height="15" />
        <span class="official-name">${country.name.official}</span>
        </li>`
    )
    .join('');
}

function createCountryCard(country) {
  return `
    <div class="country-name-with-flag">
      <img alt="flag" src="${country[0].flags.svg}" width="30" height="20" />
      <p class="official-name">
        ${country[0].name.official}
      </p>
    </div>
    <p class="capital">Capital: 
      <span>${country[0].capital}</span>
    </p>
    <p class="population">Population: 
      <span>${country[0].population}</span>
    </p>
    <p class="languages">Languages: 
      <span>${Object.values(country[0].languages).join(', ')}</span>
    </p>`;
}
