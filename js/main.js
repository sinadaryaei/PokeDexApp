const pokeContainer = document.getElementById('poke-container');
const suggestionsContainer = document.getElementById('suggestions-container');
const searchBar = document.getElementById('search-bar');
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

  const imgContainer = document.createElement('div');
  imgContainer.classList.add('img-container');
  const img = document.createElement('img');
  img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
  img.alt = name;
  imgContainer.appendChild(img);

  const info = document.createElement('div');
  info.classList.add('info');
  const number = document.createElement('span');
  number.classList.add('number');
  number.textContent = `#${id}`;
  const h3 = document.createElement('h3');
  h3.classList.add('name');
  h3.textContent = name;
  const small = document.createElement('small');
  small.classList.add('type');
  const span = document.createElement('span');
  span.textContent = type;
  small.appendChild(span);
  info.append(number, h3, small);

  pokemonEl.append(imgContainer, info);

  pokeContainer.appendChild(pokemonEl);
};

fetchPokemons();

// Function to filter Pokemon based on the search input and return the results
function filterPokemon(searchText) {
  const pokemons = pokeContainer.getElementsByClassName('pokemon');
  return Array.from(pokemons).filter(pokemon => {
    const name = pokemon.querySelector('.name').innerText.toLowerCase();
    const number = pokemon.querySelector('.number').innerText.slice(1); // remove '#'
    return name.includes(searchText.toLowerCase()) || number.startsWith(searchText);
  });
}

// Function to display suggestions in the suggestions container
function displaySuggestions(filteredPokemons) {
  suggestionsContainer.innerHTML = ''; // Clear previous suggestions
  filteredPokemons.forEach(pokemon => {
    const name = pokemon.querySelector('.name').innerText;
    const number = pokemon.querySelector('.number').innerText;
    suggestionsContainer.innerHTML += `<div class="suggestion">${name} ${number}</div>`;
  });
  suggestionsContainer.style.display = filteredPokemons.length > 0 ? 'block' : 'none';
}

// Event listener for the search bar input
searchBar.addEventListener('input', e => {
  const searchText = e.target.value;
  if (searchText.length === 0) {
    // Hide suggestions when there is no input
    suggestionsContainer.style.display = 'none';
    // Show all pokemon cards when there is no input
    Array.from(pokeContainer.getElementsByClassName('pokemon')).forEach(pokemon => {
      pokemon.style.display = 'block';
    });
  } else {
    // Filter and display suggestions based on input
    const filteredPokemons = filterPokemon(searchText);
    displaySuggestions(filteredPokemons);
    // Hide all pokemon cards
    Array.from(pokeContainer.getElementsByClassName('pokemon')).forEach(pokemon => {
      pokemon.style.display = 'none';
    });
    // Show only filtered pokemon cards
    filteredPokemons.forEach(pokemon => {
      pokemon.style.display = 'block';
    });
  }
});

// Event listener for clicking on a suggestion
suggestionsContainer.addEventListener('click', e => {
  if (e.target && e.target.matches('.suggestion')) {
    const text = e.target.innerText;
    searchBar.value = text.split(' ')[0]; // Assuming the name is the first part before the space
    suggestionsContainer.style.display = 'none';
    // Trigger the input event to filter based on the selected suggestion
    searchBar.dispatchEvent(new Event('input'));
  }
});
