console.log("Lets write java script");

// document.querySelector("hamburger").addEventListener("click",()=>{
//     document.querySelector(".left").style.left="0";
// })


let currentSongs=new Audio();
let sn;
let currfolder;
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });
    
});


async function getSongs(folder) {
    currfolder=folder;
    let a=await fetch(`/${folder}/`);
    let responce=await a.text();
    let div=document.createElement("div");
    div.innerHTML=responce;
    let as=div.getElementsByTagName("a");
    sn=[];
    for(let i=0;i<as.length;i++)
    {
        const element=as[i];
        if(element.href.endsWith(".mp3"))
        {
            sn.push(element.href.split(`/${folder}/`)[1]);
        }
    }

    let songUl=document.querySelector(".songslist").getElementsByTagName("ul")[0];
    songUl.innerHTML="";
    for (const song of sn) {
        songUl.innerHTML=songUl.innerHTML+`
        <li><img class="invert" src="/img/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20"," ")}</div>
                                <div>Meet</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="/img/play.svg" alt="">
                                </div>
                        </li>
        `;
    }
    Array.from(document.querySelector(".songslist").getElementsByTagName("li")).forEach(e => {
        e.addEventListner("click",element=>{
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
        
    });
    return sn;

}

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}



const playMusic=(track,pause=false)=>{
    // let audio=new Audio(`/songs/`+track);
    currentSongs.src=`/${currfolder}/`+track;
    if(!pause)
    {
        currentSongs.play();
        play.src="/img/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML=decodeURI(track);
    document.querySelector(".songtime").innerHTML="00:00 / 00:00";



}

// async function displayAlbums()
// {
//     let a=await fetch(`/${"songs"}/`);
//     let responce=await a.text();
//     // console.log(responce);
//     let div=document.createElement("div");
//     div.innerHTML=responce;

//     let anchors = div.getElementsByTagName("a");
//     let cardContainer = document.querySelector(".cardContainer");
//     let array = Array.from(anchors);
//     for (let index = 0; index < array.length; index++) {
//         const e = array[index]; 
//         if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
//             let folder = e.href.split("/").slice(-2)[0]
//             // Get the metadata of the folder
//             console.log(folder);
//             let a = await fetch(`/songs/${folder}/info.json`)
//             let responce=await a.json();
//             cardContainer.innerHTML=cardContainer.innerHTML+`
//             <div data-folder="${folder}" class="card ">
//                         <div class="play"><img src="/img/play.svg" alt=""></div>
//                         <img src="/songs/${folder}/cover.jpg" alt="">
//                         <h2>${responce.title}</h2>
//                         <p>${responce.description}</p>

//                     </div>
//             `

//         }

//     }
    
//     Array.from(document.getElementsByClassName("card")).forEach(e=>{
//     e.addEventListener("click",async item=>{
//         sn= await getSongs(`songs/${item.currentTarget.dataset.folder}`);
        
//     })
// })

//     // let anchors=div.getElementsByTagName("a");
//     // Array.from(anchors).forEach(async e=>{
//     //     // console.log(e.href.split("/").slice(-2)[0]);
//     //     let f=decodeURIComponent(e.href.split("/").filter(Boolean).pop());
        
//     //     console.log(f);
//     //     let a=await fetch(`${f}/info.json`);
//     //     let responce=await a.json();
        
//     // })
    
// }

async function displayAlbums() {
    console.log("displaying albums")
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index]; 
        // console.log(e.href.split("/").slice(-2)[0]);
        // console.log(decodeURIComponent(e.href).replace(/\/$/, "").split(/[\\/]/).pop());
        if (!e.href.includes(".htaccess")) {
            let folder =decodeURIComponent(e.href).replace(/\/$/, "").split(/[\\/]/).pop()
            // Get the metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`);
            let response =  a.json();
            cardContainer.innerHTML = cardContainer.innerHTML + `
            <div data-folder="${folder}" class="card ">
                        <div class="play"><img src="/img/play.svg" alt=""></div>
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>

                    </div>
            `
        }
    }

    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => { 
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            sn = await getSongs(`songs/${item.currentTarget.dataset.folder}`)  
            playMusic(sn[0]);

        })
    })
}


async function main()
{
    await getSongs("songs/ncs");
    console.log(sn);
    playMusic(sn[0],true)
    
    //Display all the album on the page

    await displayAlbums();
    
    // Get the play button by its id
    const play = document.getElementById("play");
    play.addEventListener("click",()=>{
        if(currentSongs.paused)
        {
            currentSongs.play();
            play.src="/img/pause.svg";
        }
        else{
            currentSongs.pause();
            play.src="/img/play.svg";
        }
    })

    currentSongs.addEventListener("timeupdate",()=>{
        document.querySelector("songtime").innerHTML=`${secondsToMinutesSeconds(currentSongs.currentTime)} / ${secondsToMinutesSeconds(currentSongs.duration)}`;
        document.querySelector(".circle").style.left=(currentSongs.currentTime/currentSongs.duration)*100+"%";

    })

    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent=(e.offsetX/e.target.getBoundingClientReact().width)*100;
        document.querySelector(".circle").style.left=percent+"%";
        currentSongs.currentTime=(currentSongs.duration)*percent/100;
    })
    
    previous.addEventListener("click",()=>{
        currentSongs.pause();
        let index=sn.indexOf(currentSongs.src.split("/").slice(-1)[0]);
        if(index-1>=0)
        {
            playMusic(sn[index-1])
        }
    })
    next.addEventListener("click",()=>{
        currentSongs.pause();
        let index=sn.indexOf(currentSongs.src.split("/").slice(-1)[0]);
        if(index+1<sn.length)
        {
            playMusic(sn[index+1])
        }
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        currentSongs.valume=parseInt(e.target.value)/100;
        if(currentSongs.volume>0)
        {
            // document.querySelector(".volume >img").src=`/img/volume.svg`;
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
    })

    document.querySelector(".volume >img").addEventListener("click",e=>{
        if(e.target.src.includes("volume.svg"))
        {
            e.target.src=`/img/mute.svg`;
            currentSongs.volume=0;
            document.querySelector(".range").getElementsByTagName("input")[0].value=0;
        }
        else {
            currentSongs.volume=0.1;
            e.target.src=`/img/volume.svg`;
            document.querySelector(".range").getElementsByTagName("input")[0].value=10;

        }
    })



}

main();













