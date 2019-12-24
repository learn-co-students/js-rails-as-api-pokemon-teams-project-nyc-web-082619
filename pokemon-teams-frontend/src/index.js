//Global Constants//
const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const ALL_POKEMON_URL = `${BASE_URL}/pokemon`
const POKEMON_URL = id => ALL_POKEMON_URL + "/" + id

//Global Variables//
let trainersArray = [];
let trainerContainer;



//Fetch Trainers//
function fetchTrainers(){
    return fetch(TRAINERS_URL)
    .then(resp => resp.json())
    .then(trainers => trainersArray = [...trainers])
}

//Add trainer to a card//
function renderTrainer(trainer){
    trainerContainer.insertAdjacentHTML("beforeend", `
    <div class="card" data-trainer-id="${trainer.id}"><p>${trainer.name}</p>
  <button class="add" data-trainer-id="${trainer.id}">Add Pokemon</button>
  <ul class="pokemon-container" data-trainer-id="${trainer.id}">
  </ul>
</div>
    `)
}

//HTML builder for pokemon//
function pokemonHTMLBuilder(pokemon){
    return `<li data-pokemon-id="${pokemon.id}">${pokemon.nickname} (${pokemon.species})
        <button class="release" data-trainer-id="${pokemon.trainer_id}" data-pokemon-id="${pokemon.id}">Release</button>
        </li>`
}

//Add Pokemon to a single trainer card//
function renderTrainerPokemon(trainer){
    const pokemon_containers = [...trainerContainer.querySelectorAll("ul.pokemon-container")]
    const pokemon_container = pokemon_containers.filter(container => parseInt(container.dataset.trainerId) === trainer.id)[0]
    trainer.pokemon.forEach(pokemon => {
        pokemon_container.insertAdjacentHTML("beforeend", pokemonHTMLBuilder(pokemon))
    })
}

//get trainer by id//
function getTrainerById(id){
    return trainersArray.filter(trainer => trainer.id === id)[0]
}

//Pokemon post builder//
function postPokemon(id){
    const pokemon = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            trainerId: id
        })}
    console.log(pokemon)
    return fetch(ALL_POKEMON_URL, pokemon)
}

//add pokemon function//
function addPokemonToTrainer(button){
    const trainerId = parseInt(button.dataset.trainerId)
    const trainer = getTrainerById(trainerId)
    const pokemon_containers = [...trainerContainer.querySelectorAll("ul.pokemon-container")]
    const pokemon_container = pokemon_containers.filter(container => parseInt(container.dataset.trainerId) === trainer.id)[0]
    
    //If trainer has too many pokemon//
    if(trainer.pokemon.length > 5){
        alert("Too Many Pokemon! Trainer Already has 6!")

    }else{
    
    //post pokemon, then update html//
    postPokemon(trainerId)
    .then(resp => resp.json())
    .then(pokemon => {
        pokemon_container.insertAdjacentHTML("beforeend", pokemonHTMLBuilder(pokemon))
        fetchTrainers();
    })
}}

//pokemon delete fetch//
function deletePokemon(pokemonId){
    fetch(POKEMON_URL(pokemonId), {method: "DELETE"})
}

//release pokemon and update HTML, unless only 1 left//
function releasePokemon(button){
    fetchTrainers()
    .then(() => {
    const pokemonId = parseInt(button.dataset.pokemonId)
    const trainerId = parseInt(button.dataset.trainerId)
    const trainer = getTrainerById(trainerId)
    
    if (trainer.pokemon.length < 2){
        alert("You can't release your last pokemon!")
    } else {
    deletePokemon(pokemonId)
    const pokemonLi = trainerContainer.querySelector(`li[data-pokemon-id="${pokemonId}`)
    pokemonLi.remove()
    console.log(trainer.pokemon.length);
    }})
}



//addButtonEventListeners//
function addEventListenerToTrainerCard(trainer){
    const trainerCards = [...document.querySelectorAll("div.card")]
    const trainerCard = trainerCards.filter(card => parseInt(card.dataset.trainerId) === trainer.id)[0]
    trainerCard.addEventListener("click", event => {
        switch (event.target.className) {
            //Add Pokemon Button//
            case "add":
                addPokemonToTrainer(event.target)
                break;

            //Release Pokemon Button//
            case "release":
                releasePokemon(event.target)
                break;
        }
    })
}

//Render a single trainer card for a trainer//
function renderTrainerCard(trainer){
    renderTrainer(trainer)
    renderTrainerPokemon(trainer)
    addEventListenerToTrainerCard(trainer)
}


//Render All trainer cards//
function renderTrainerCards(){
    trainersArray.forEach(trainer => renderTrainerCard(trainer))
}



////////DOM CONTENT LOADED//////////
document.addEventListener("DOMContentLoaded", () => {
    trainerContainer = document.querySelector("div#trainer-container")
    fetchTrainers()
    .then(renderTrainerCards)
})