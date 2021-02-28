const APIKEY = "dc3bc4fba7a9584a6c7b1b7a1f3eeefe";
// const url2 = ;
const imageUrl = "https://image.tmdb.org/t/p/w500/ ";

document.getElementById("startGame").addEventListener("click", event => {
    event.preventDefault();

    const movie = document.getElementById("startingMovie").value;
    const actor = document.getElementById("startingActor").value;
    if (actor === "" || movie === "") {
        document.getElementById("startError").style.visibility = "visible";
        document.getElementById("startError").innerHTML = "You must select an actor and movie to begin.</br> The actor and the movie need not be related.";
        return;
    }
    document.getElementById("startMenu").style.display = "none";
    document.getElementById("game").style.visibility = "visible";
    getActorCard(actor, "column1");
});

const getActorCard = (actorName, id) => {
    const searchActorUrl = `https://api.themoviedb.org/3/search/person?api_key=${APIKEY}&language=en-US&query=${actorName}&page=1&include_adult=false`;
    let answer = "";
    fetch(searchActorUrl)
        .then(response => response.json())
        .then(json => {
            answer += json.results[0].id;
            document.getElementById(id).innerHTML = answer;
        })
        .catch(error => `There was an error: ${error}`)
}