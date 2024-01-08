const pokeContainer = document.getElementById('poke-container');
const pokemonCount = 150;
const colors = {
  fire: '#FDDFDF',
  grass: '#DEFDE0',
  electric: '#FCF7DE',
  water: '#DEF3FD',
  ground: '#f4e7da',
  rock: '#d5d5d4',
  fairy: '#fceaff',
  poison: '#98d7a5',
  bug: '#f8d5a3',
  dragon: '#97b3e6',
  psychic: '#eaeda1',
  flying: '#F5F5F5',
  fighting: '#E6E0D4',
  normal: '#F5F5F5'
};

const mainTypes = Object.keys(colors);

const fetchPokemons = async () => {
  for (let i = 1; i <= pokemonCount; i++) {
    await getPokemon(i);
  }
};

const getPokemon = async id => {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  const res = await fetch(url);
  const data = await res.json();
  createPokemonCard(data);
};

const createPokemonCard = pokemon => {
  const pokemonEl = document.createElement('div');
  pokemonEl.classList.add('pokemon');

  const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
  const id = pokemon.id.toString().padStart(3, '0');

  const pokeTypes = pokemon.types.map(type => type.type.name);
  const type = mainTypes.find(type => pokeTypes.indexOf(type) > -1);
  const color = colors[type];

  pokemonEl.style.backgroundColor = color;

  const pokemonInnerHTML = `
  <div class="img-container">
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png"" alt="${name}">
  </div>
  <div class="info">
      <span class="number">#${id}</span>
      <h3 class="name">${name}</h3>
      <small class="type">Type: <span>${type}</span> </small>
  </div>
  `;

  pokemonEl.innerHTML = pokemonInnerHTML;

  pokeContainer.appendChild(pokemonEl); // Corrected here
};

fetchPokemons();

document.getElementById('search-bar').addEventListener('input', function (e) {
  var searchText = e.target.value; // Get the text from the search bar
  var pokeContainer = document.getElementById('poke-container');
  var pokemon = pokeContainer.getElementsByClassName('pokemon'); // Get all the Pokemon

  for (var i = 0; i < pokemon.length; i++) {
    var name = pokemon[i].getElementsByClassName('info')[0].getElementsByClassName('name')[0].innerText; // Get the name of the Pokemon
    var number = pokemon[i].getElementsByClassName('info')[0].getElementsByClassName('number')[0].innerText; // Get the number of the Pokemon

    // Remove the leading '#' from the number and convert it to a number
    var numberAsNumber = Number(number.replace('#', ''));

    // Convert the search text to a number
    var searchTextAsNumber = Number(searchText);

    // If the Pokemon's name includes the search text, or the number equals the search text, show it, otherwise hide it
    if (name.toLowerCase().includes(searchText.toLowerCase()) || numberAsNumber === searchTextAsNumber) {
      pokemon[i].style.display = '';
    } else {
      pokemon[i].style.display = 'none';
    }
  }
});

// ... rest of your code ...

var suggestionsContainer = document.createElement('div');
suggestionsContainer.id = 'suggestions-container';
document.body.appendChild(suggestionsContainer);

document.getElementById('search-bar').addEventListener('input', function (e) {
  var searchText = e.target.value; // Get the text from the search bar
  var pokeContainer = document.getElementById('poke-container');
  var pokemon = pokeContainer.getElementsByClassName('pokemon'); // Get all the Pokemon

  // Clear the current suggestions
  suggestionsContainer.innerHTML = '';

  for (var i = 0; i < pokemon.length; i++) {
    var name = pokemon[i].getElementsByClassName('info')[0].getElementsByClassName('name')[0].innerText; // Get the name of the Pokemon
    var number = pokemon[i].getElementsByClassName('info')[0].getElementsByClassName('number')[0].innerText; // Get the number of the Pokemon

    // Remove the leading '#' from the number and convert it to a number
    var numberAsNumber = Number(number.replace('#', ''));

    // Convert the search text to a number
    var searchTextAsNumber = Number(searchText);

    // If the Pokemon's name includes the search text, or the number equals the search text, add it to the suggestions
    if (name.toLowerCase().includes(searchText.toLowerCase()) || numberAsNumber === searchTextAsNumber) {
      var suggestion = document.createElement('div');
      suggestion.innerText = name + ' ' + number;
      suggestionsContainer.appendChild(suggestion);

      suggestion.addEventListener('click', function () {
        document.getElementById('search-bar').value = this.innerText;
        suggestionsContainer.style.display = 'none';
      });
    }
  }

  // If the search bar is cleared, hide the suggestions container
  if (searchText === '') {
    suggestionsContainer.style.display = 'none';
  } else {
    suggestionsContainer.style.display = 'block';
  }
});
