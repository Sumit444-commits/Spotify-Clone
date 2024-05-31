let currentSong = new Audio;
let songs;
let currFolder;


// returns the list of songs
async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/${folder}/`);
    // a = "https://cors.iamnd.eu.org/?url="+a;
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
   
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
          
        }
    }
  
    

    let songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songUl.innerHTML = ""
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li>
                        <img class="invert" src="imgs/music.svg" alt="music">
                        <div class="info">
                            <div>${song.replaceAll("%20", " ")}</div>
                            <div>song Artist</div>
                        </div>
                        <div class="playnow">
                            <span>Play Now</span>
                        <img class="invert" src="imgs/play.svg" alt="playnow">
                    </div></li>`;
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            
            playMusic( e.querySelector(".info").firstElementChild.innerHTML.trim())


        })
    });
    return songs
}



const playMusic = ( track, pause = false) => {
    
    currentSong.src =  `/${currFolder}/` + track;
    if (!pause) {
        currentSong.play();
        play.src = "imgs/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

function convertSecondsToMinutes(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    // Calculate the minutes and the remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Pad single-digit minutes and seconds with leading zeros
    const paddedMinutes = minutes.toString().padStart(2, '0');
    const paddedSeconds = remainingSeconds.toString().padStart(2, '0');

    // Format the result as MM:SS
    return `${paddedMinutes}:${paddedSeconds}`;
}

async function displayAlbums() {
    try {
        let a = await fetch(`/songs/`);
        // a = "https://cors.iamnd.eu.org/?url="+a;
        let response = await a.text();
        let div = document.createElement("div");
        div.innerHTML = response;
        let anchors = div.getElementsByTagName("a");
        let cardContainer = document.querySelector(".cardContainer");
        
        let array = Array.from(anchors);
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            if (e.href.includes("/songs")) {
                let folder = e.href.split("/").slice(-2)[0];
                let infoFetch = await fetch(`/songs/${folder}/info.json`);
                // infoFetch = "https://cors.iamnd.eu.org/?url="+infoFetch;
                // Error handling for JSON parsing
                let response;
                try {
                    response = await infoFetch.json();
                } catch (jsonError) {
                    console.error(`Error parsing JSON for folder ${folder}:`, jsonError);
                    continue; // Skip to the next iteration if JSON parsing fails
                }

                cardContainer.innerHTML += `
                <div data-folder="${folder}" class="card">
                    <div class="play">
                        <div style="width: 50px; height: 50px; background-color: rgb(30, 215, 96); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="black">
                                <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="black" stroke-width="1.5" stroke-linejoin="miter" />
                            </svg>
                        </div>
                    </div>
                    <img src="/songs/${folder}/cover.jpg" alt="">
                    <h2>${response.title}</h2>
                    <p>${response.description}</p>
                </div>`;
            }
        }

        // Load the playlist whenever a card is clicked
        Array.from(document.getElementsByClassName("card")).forEach(e => {
            e.addEventListener("click", async item => {
             songs =  await getSongs(`songs/${item.currentTarget.dataset.folder}`);
                playMusic(songs[0])


            });
        });

      
    } catch (error) {
        console.error("Error fetching albums:", error);
    }
}



async function main() {

    // lists of songs
    await getSongs("songs/Arjit");

    playMusic( songs[0], true)

    // Display all the albums on the page
    displayAlbums()


    // attach an event listner to play, pause;
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "imgs/pause.svg"
        } else {
            currentSong.pause()
            play.src = "imgs/play.svg"
        }
    }
    )

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${convertSecondsToMinutes(currentSong.currentTime)}/${convertSecondsToMinutes(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", e => {

        let persent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = persent + "%"
        currentSong.currentTime = (currentSong.duration * persent) / 100
    })


    // adding event listner to hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";

    })
    // adding event listner to close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";

    })

    // adding event listener to previous 
    previous.addEventListener("click", () => {

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if (index - 1 >= 0) {
            playMusic( songs[index - 1])
        }

    })

    // adding event listener to  next
    next.addEventListener("click", () => {
 
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    // adding event listener to  range
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
        if (currentSong.volume>0) {
            document.querySelector(".volume>img").src=  document.querySelector(".volume>img").src.replace("imgs/mute.svg","imgs/volume.svg")
        }
        if(currentSong.volume==0){
            document.querySelector(".volume>img").src=  document.querySelector(".volume>img").src.replace("imgs/volume.svg","imgs/mute.svg")
        }

    })

    // adding event to volume
    document.querySelector(".volume>img").addEventListener("click",e=>{
        if(e.target.src.includes( "imgs/volume.svg")){
            e.target.src=  e.target.src.replace("imgs/volume.svg","imgs/mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }else{
            e.target.src=   e.target.src.replace("imgs/mute.svg","imgs/volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10
            
        }
    })   



}
main()