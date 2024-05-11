// console.log('Lets write javascript');
let songs;
let currFolder;
let currentSong = new Audio();
let previous = document.getElementById("previous");
let play = document.getElementById("play");
let next = document.getElementById("next");
let cardContainer = document.querySelector(".cardContainer");


function changeSec(totalSeconds) {
    totalSeconds = parseInt(totalSeconds);
    var minutes = Math.floor(totalSeconds / 60);
    var remainingSeconds = totalSeconds % 60;
    var formattedTime = minutes + ":" + (remainingSeconds < 10 ? "0" : "") + remainingSeconds;
    return formattedTime;
}

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/songs/${currFolder}/`)
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    // console.log(as);

    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/songs/${currFolder}/`)[1]);

        }
    }

    //Show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
        <img class="invert" src="img/music.svg" alt="">
        <div class="info">
            <div>${song.replaceAll("%20", " ")}</div>
        </div>
        <div class="playNow">
            <span>Play Now</span>
        <img class="invert" src="img/play.svg" alt="">
        </div>
         </li>`;

    }

    //Add an eventlistener to each songs
    Array.from(document.getElementsByClassName("songList")[0].getElementsByTagName("li")).forEach((e) => {
        e.addEventListener("click", (element) => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML);
            // if (e.querySelector(".playNow").querySelector("img").src = "play.svg") {
            //     e.querySelector(".playNow").querySelector("img").src = "pause.svg";
            // }
            // else {
            //     e.querySelector(".playNow").querySelector("img").src = "play.svg";
            // }


        })
    })

}

const playMusic = (track) => {
    currentSong.src = (`/songs/${currFolder}/` + track);
    currentSong.play();
    play.src = "img/pause.svg";
    document.querySelector(".songinfo").innerHTML = track;
}



async function displayAlbums() {
    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text()
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs/")) {
            let folder = e.href.split("/").slice(-1);
            // console.log(folder);

            let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
            let response = await a.json();
            // console.log(response.title);
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder=${folder} class="card ">
            <img src="http://127.0.0.1:5500/songs/${folder}/cover.jpg" alt="cardImg">
            <div class="playContainer">
            <img class="invert" width="50" src="img/cardPlay.svg" alt=""></div>
            <h3>${response.title}</h3>
            <p>${response.description}</p>
        </div>`

        }
    }

    //Load the playlist whenever the card is clicked
    Array.from(document.querySelectorAll(".card")).forEach((e) => {
        e.addEventListener("click", async (element) => {
            // console.log(element.currentTarget.dataset.folder);

            await getSongs(element.currentTarget.dataset.folder);

        })
    })
}

async function main() {

    //Get the list of all songs
    await getSongs("90s");
    // console.log(songs);

    //Display all the albums in the page
    displayAlbums();

    //Attach an eventListener to previous,play and next

    previous.addEventListener("click", () => {

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if (index > 0) {
            currentSong.pause();
            index--;
            playMusic(decodeURIComponent(songs[index]));
        }
    })


    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "img/pause.svg";
        }
        else {
            currentSong.pause();
            play.src = "img/play.svg"
        }

    })

    next.addEventListener("click", () => {

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if (index < songs.length - 1) {
            currentSong.pause();
            index++;
            playMusic(decodeURIComponent(songs[index]));

        }
    })

    //Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime,currentSong.duration);
        document.querySelector(".songDuration").innerHTML = `${changeSec(currentSong.currentTime)} / ${changeSec(currentSong.duration)}`;
        document.querySelector(".circle").style.left = currentSong.currentTime / currentSong.duration * 100 + "%";

    })

    //add an eventListener to volume
    document.querySelector(".range").querySelector("input").addEventListener("change", (e) => {
        currentSong.volume = parseFloat(e.target.value / 100);
        if(currentSong.volume>0){
            document.querySelector(".volume>img").src = e.target.src.replace = ("img/mute.svg", "img/volume.svg")
        }
    })

    //add an eventListener to seekBar
    document.querySelector(".seekBar").addEventListener("click", (e) => {
        let seekParsent = (e.offsetX / e.target.getBoundingClientRect().width)
        document.querySelector(".circle").style.left = seekParsent * 100 + "%";
        currentSong.currentTime = currentSong.duration * seekParsent;

    })

    //add an eventListener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })

    //add an eventListener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-130%";
    })

    //add an eventListener to mute the track
    document.querySelector(".volume>img").addEventListener("click", (e) => {

        if (e.target.src.includes("img/volume.svg")) {
            e.target.src = e.target.src.replace = ("img/volume.svg", "img/mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range").querySelector("input").value = 0;
        }
        else {
            e.target.src = e.target.src.replace = ("img/mute.svg", "img/volume.svg");
            currentSong.volume = .3;
            document.querySelector(".range").querySelector("input").value = 30;
        }

    })







}
main();


