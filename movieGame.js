const APIKEY = "dc3bc4fba7a9584a6c7b1b7a1f3eeefe";
// const url2 = ;
const imageUrl = "https://image.tmdb.org/t/p/w300";

let state = {
  leftHistory: [],
  rightHistory: []
}

document.getElementById("startGame").addEventListener("click", async event => {
  event.preventDefault();

  const movie = document.getElementById("startingMovie").value;
  const actor = document.getElementById("startingActor").value;
  if (actor === "" || movie === "") {
    setError("You must select an actor and movie to begin.</br> The actor and the movie don't need to be related.", "startError")
    return;
  }
  const movieCard = await getCard(movie, "movie", "left", "startError");
  const actorCard = await getCard(actor, "actor", "right", "startError");
  if (actorCard && movieCard) {
    clearError("invalidSelection"); // Since its clearly valid now.
    document.getElementById("startMenu").style.display = "none";
    document.getElementById("game").classList.remove("hidden");
    document.getElementById("leftCol").insertAdjacentHTML("afterbegin", movieCard);
    document.getElementById("rightCol").insertAdjacentHTML("afterbegin", actorCard);
  } 
});

document.getElementById("leftSubmit").addEventListener("click", async event => {
  addCard("left");
})

document.getElementById("rightSubmit").addEventListener("click", async event => {
  addCard("right");
})

const addCard = async (col) => {
  const guess = document.getElementById("guess").value;
  const btnType = document.getElementById(`${col}Submit`).value;
  const card = await getCard(guess, btnType, col, "invalidSelection");
  if (card) {
    let id = `${col}Col`;
    document.getElementById(id).insertAdjacentHTML("afterbegin", card);
  }
}

const setError = (errorMsg, id) => {
  document.getElementById(id).style.visibility = "visible";
  document.getElementById(id).innerHTML = errorMsg;
}

const clearError = id => document.getElementById(id).innerHTML = "";

const getCard = async (name, type, column, errId) => {
  const query = (type === "actor") ? "person" : "movie";
  const searchUrl = `https://api.themoviedb.org/3/search/${query}?api_key=${APIKEY}&language=en-US&query=${name}&page=1&include_adult=false`;
  const response = await fetch(searchUrl)
    .then(response => response.json())
    .then(json => {
      if (json.total_results === 0) {
        throw "no " + type + " results";
      }
      else {
        if (type === "actor"){
          return `<div class="p-2 flex flex-col">
                   <img src="${imageUrl}${json.results[0].profile_path}">
                   <h3>${json.results[0].name}</h3>
                 </div>`;
        } else if (type === "movie") {
          return `<div class="p-2 flex flex-col">
                   <img src="${imageUrl}${json.results[0].poster_path}">
                   <h3>${json.results[0].title}</h3>
                 </div>`;
        }
      }
    })
    .catch(error => {
      setError(error, errId); 
      return null;
    }) 
    if (response){
      let btn = document.getElementById(`${column}Submit`);
      const value = btn.value;
      const newVal = (value === "movie") ? "actor" : "movie";
      btn.value = newVal;
      btn.innerHTML = `${column[0].toUpperCase() + column.substr(1)} Column</br>Pick ${newVal}`;
    }
  // return (response) ? response : false;
  // state[`${column}History`].append(name);
  return response;
}