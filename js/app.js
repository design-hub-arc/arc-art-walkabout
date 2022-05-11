const longDisplay = document.getElementById('longDisplay')
const latDisplay = document.getElementById('latDisplay')
const statusDisplay = document.getElementById('tracking')
const trackingBox = document.getElementById('tracking-message-box')
const campLoc = document.getElementById('campLoc')
const artName = document.getElementById('artName')
const minuteDisplay = document.getElementById('minuteDisplay')
const secondDisplay = document.getElementById('secondDisplay')

const toggle = document.getElementById('tracking-toggle')
const onIndicator = document.getElementById('on')
const offIndicator = document.getElementById('off')
const leftArrow = document.querySelector('.arrow')
const mainHeaderImage = document.getElementById('main-header')


// const stopBtn = document.getElementById('stop-sound')
// const resumeBtn = document.getElementById('resume-sound')
// stopBtn.style.display = 'none'
// resumeBtn.style.display = 'none'


const MASTER_URL = 'https://docs.google.com/spreadsheets/d/1b6kB5xtP_M0hMLRzxT0uDwhuM9ABvzsMUZRVsnezgXU/gviz/tq?tqx=out:json'
// const MASTER_URL = 'https://docs.google.com/spreadsheets/d/15WHrKYdLhyepMQPdWtqZQAeHonpC-ntF1PIldJz_hjQ/gviz/tq?tqx=out:json'
// const SOUND_DRIVE_URL = 'https://docs.google.com/uc?export=download&id=' // If the soundfile source is from a google drive
const CMS_IMAGE_URL = 'https://docs.google.com/uc?export=download&id='


//Constants for establishing an equal perimeter. Can be adjusted to fit the bounding area
const LAT_RADIUS = 0.00005145
const LON_RADIUS = 0.00005145 // 15 ft radius .000024 = 7ft ~.00000343 = 1ft
// position tracking
let geoWatch;
let lonCoordCheck;
let latCoordCheck;
let locationArray = []

// if port is needed
let port = window.location.port

// identifying Artist or location
let identifier;
let trimmedName;
// Log the currently launched external url
const openTab = []
let tabHasLaunched = false;
let appHasStarted = false;

// Additional time for pause
let addTime = 0
let paused = false

let soundComp;
// Initiate Sound file
class Sound {
  constructor(src) {
    this.sound = document.createElement('audio')
    this.sound.src = src
    this.sound.setAttribute('preload', 'auto')
    this.sound.setAttribute('controls', 'none')
    this.sound.style.display = 'none'
    document.body.appendChild(this.sound)
    this.play = function () {
      this.sound.play()
    }
    this.stop = function () {
      this.sound.pause()

    }
  }
}

// register service worker for caching assets
if('serviceWorker' in navigator) {
  console.log('service worker found')
  navigator.serviceWorker.register('sw.js')
  .then((reg) => console.log('service worker registered', reg))
  .catch((err) => console.log('service worker not registered', err))
}

// begin listening for coordinates and track changes
function startWatch() {
  console.log('startWatch starting')
  console.log("tab launch check", tabHasLaunched)
  if(!geoWatch) {
    if('geolocation' in navigator && 'watchPosition' in navigator.geolocation) {
      console.log('gps support')
      geoWatch = navigator.geolocation.watchPosition( setCurrentPosition, positionError, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      })
      statusDisplay.innerText = 'Tracking'
      appHasStarted = true;
    } 
  }
}

//========FUNCTIONS========\\

// Play and Stop Sounds
function playSound(soundUrl, timer) {
  let soundFile = new Sound(soundUrl)
  soundComp = soundFile;
  // stopBtn.addEventListener('click', () => {
  //   soundFile.stop()
  //   stopBtn.style.boxShadow = '0 0 8px 8px #ffffff'
  //   resumeBtn.style.boxShadow = 'none'
  //   // paused = true;
  //   // const timeCounter = () => {
  //   //   addTime += 1;
  //   //   console.log(addTime)
  //   // }
  //   // let timeCountInitial = setInterval(timeCounter, 1000)

    
  //   // stopBtn.style.display = 'none'
  //   // console.log("Sound Stopped")
  // })
  // resumeBtn.addEventListener('click', () => {
  //   soundFile.play()
  //   resumeBtn.style.boxShadow = '0 0 8px 8px #ffffff'
  //   stopBtn.style.boxShadow = 'none'
  //   // paused = false;
  //   // clearInterval(timeCountInitial)
    
  // })
  // stopBtn.style.display = 'flex'
  // stopBtn.style.position = 'absolute'
  // stopBtn.style.bottom = '40%'
  // stopBtn.style.left = '5%'
  // stopBtn.style.border = 'none'
  // stopBtn.style.borderRadius = '12px'
  // stopBtn.style.padding = '1em'
  // stopBtn.style.fontSize = '1.5em'
  // stopBtn.style.backgroundColor = 'hsla(0, 0%, 5%, .8'
  // stopBtn.style.color = 'hsl(0, 0%, 100%)'
  // resumeBtn.style.display = 'flex'
  // resumeBtn.style.position = 'absolute'
  // resumeBtn.style.bottom = '40%'
  // resumeBtn.style.right = '5%'
  // resumeBtn.style.border = 'none'
  // resumeBtn.style.borderRadius = '12px'
  // resumeBtn.style.padding = '1em'
  // resumeBtn.style.fontSize = '1.5em'
  // resumeBtn.style.backgroundColor = 'hsla(0, 0%, 5%, .8'
  // resumeBtn.style.boxShadow = '0 0 8px 8px #ffffff'
  // resumeBtn.style.color = 'hsl(0, 0%, 100%)'
  soundFile.stop()
  soundFile.play()
  console.log("sound playing")
  // setTimeout(() => {
  //   soundFile.stop()
  //   stopBtn.style.display = 'none'
  //   resumeBtn.style.display = 'none'
  //   console.log("sound stopped")

  // }, timer)
}


// Close previously opened tabs
function closeTab() {
  openTab.shift()
  console.log("tabs closed")
}

// Create variables 
// Variables needed:
// lat, lon, webpage, soundFile, NULL, min, sec, name, location, image
// Create Variables
const createObj = (obj, objLen) => {
  for(let i = 0; i < objLen; i++) {
    locationArray[i] = {
      lat : obj[i].c[0].v,
      lon: obj[i].c[1].v,
      url: obj[i].c[2].v,
      soundLink: obj[i].c[3].v,
      min: obj[i].c[5].v,
      sec: obj[i].c[6].v,
      name: obj[i].c[7].v,
      loc: obj[i].c[8].v,
      image: obj[i].c[9].v,

    }
  }
}
const createLat = (obj, objLen) => {
  for(let i = 0; i < objLen; i++){
    this[`lat${i + 1}`] = parseFloat(`${obj[i].c[0].v}`) // COLUMN A
  }
}
const createLon = (obj, objLen) => {
  for(let i = 0; i < objLen; i++){
    this[`lon${i + 1}`] = parseFloat(`${obj[i].c[1].v}`) // COLUMN B
  }
}
const createUrl = (obj, objLen) => {
  for(let i = 0; i < objLen; i++){
    this[`url${i + 1}`] = `${obj[i].c[2].v}`            // COLUMN C
  }
}
const createSoundLink = (obj, objLen) => {
  for(let i = 0; i < objLen; i++){
    this[`soundLink${i + 1}`] = `${obj[i].c[3].v}`    // COLUMN D
  }
}
const createMin = (obj, objLen) => {
  for(let i = 0; i < objLen; i++){
    this[`min${i + 1}`] = `${obj[i].c[5].v}`          // COLUMN F
  }
}
const createSec = (obj, objLen) => {
  for(let i = 0; i < objLen; i++){
    this[`sec${i + 1}`] = `${obj[i].c[6].v}`         // COLUMN G
  }
}
const createName = (obj, objLen) => {
  for(let i = 0; i < objLen; i++){
    this[`name${i + 1}`] = `${obj[i].c[7].v}`    // COLUMN H
  }
}
const createLocation = (obj, objLen) => {
  for(let i = 0; i < objLen; i++){
    this[`loc${i + 1}`] = `${obj[i].c[8].v}`    // COLUMN I
  }
}
const createImage = (obj, objLen) => {
  for(let i = 0; i < objLen; i++){
    this[`image${i + 1}`] = `${obj[i].c[9].v}`  // COLUMN J
  }
}

const countDown = (timerFuncMin, timerFuncSec) => {
  let countdownTimer = setInterval(() => {
    if((timerFuncMin === 0 && timerFuncSec === 0) || appHasStarted === false) {
      clearInterval(countdownTimer)
      minuteDisplay.innerText = "0".toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
      })
      secondDisplay.innerText = "00".toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
      })
    } else if(timerFuncMin !== 0 && timerFuncSec === 0) {
      timerFuncMin--
      timerFuncSec = 59
      minuteDisplay.innerText = timerFuncMin.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
      })
      secondDisplay.innerText = timerFuncSec.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
      })
    } else if(timerFuncMin >= 0 && timerFuncSec >= 0) {
      timerFuncSec--
      secondDisplay.innerText = timerFuncSec.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
      })
    }

  }, 1000)
}

// begin to fetch coordinates and set the geolocation
function setCurrentPosition( position ) {
    
  // Fetch coords from google sheet
  const fetchedGoogleSheetData = fetch(MASTER_URL)
    .then(response => response.text())
    .then(data => {

      // Need to find the start of the json info because sheets updates the sig parameter
      let colStart = data.indexOf("cols") -2

      // Get only the part of the google sheet response that is in json format, parse as json
      const result = (JSON.parse(data.slice(colStart, data.length - 3))).rows

      let resultLength = Object.keys(result).length // set length for dynamic variable rendering

      // Calling functions to dynamically render variables
      createObj(result, resultLength)
      createLat(result, resultLength)
      createLon(result, resultLength)
      createUrl(result, resultLength)
      createSoundLink(result, resultLength)
      createMin(result, resultLength)
      createSec(result, resultLength)
      createName(result, resultLength)
      createLocation(result, resultLength)
      createImage(result, resultLength)
    
      const createContent = (obj) => {
        trimmedName = obj.name.replace(/\s+/g, '')
          mainHeaderImage.style.backgroundImage = `url("${obj.image}")`
          let timer = (((obj.min*60) + obj.sec) * 1000)
          let soundFile = obj.soundLink
          if(!openTab.includes(obj.url)) {
              
            playSound(soundFile, timer)
            minuteDisplay.innerText = obj.min
            secondDisplay.innerText = obj.sec
            let timerFuncMin = obj.min
            let timerFuncSec = obj.sec

            countDown(timerFuncMin, timerFuncSec)
            // let countdownTimer = setInterval(() => {
            //   if(timerFuncMin === 0 && timerFuncSec === 0) {
            //     clearInterval(countdownTimer)
            //   } else if(timerFuncMin !== 0 && timerFuncSec === 0) {
            //     timerFuncMin--
            //     timerFuncSec = 59
            //     minuteDisplay.innerText = timerFuncMin.toLocaleString('en-US', {
            //       minimumIntegerDigits: 2,
            //       useGrouping: false
            //     })
            //     secondDisplay.innerText = timerFuncSec.toLocaleString('en-US', {
            //       minimumIntegerDigits: 2,
            //       useGrouping: false
            //     })
            //   } else if(timerFuncMin >= 0 && timerFuncSec >= 0) {
            //     timerFuncSec--
            //     secondDisplay.innerText = timerFuncSec.toLocaleString('en-US', {
            //       minimumIntegerDigits: 2,
            //       useGrouping: false
            //     })
            //   }

            // }, 1000)
            // Set identifier to current poem
            identifier = obj.url
            
            // launch the new window with the poems page and push the location of the open tab to openTab
            openTab.push(obj.url)
  
            // Set boolean to true for conditional testing
            tabHasLaunched = true
            
            // If a tab already exists, close it
            if(openTab[1]) {
              closeTab()
            }
    
            // Auto close the tab after the length of the current poem has passed
            setTimeout(() => {
              tabHasLaunched = false;
            }, timer)
          }
        campLoc.style.fontWeight = 'bold'  
        artName.style.fontWeight = 'bold'  
        campLoc.innerText = obj.loc // Output the name of the current poem or location
        artName.innerText = obj.name 
      }

    console.log('fetched')
    
    //  for displaying the coordinates - testing purposes
    latDisplay.innerHTML = position.coords.latitude
    longDisplay.innerHTML = position.coords.longitude
    latCoordCheck = position.coords.latitude
    lonCoordCheck = position.coords.longitude

    const findCoords = (coord) => latCoordCheck >= (coord.lat - LAT_RADIUS) && latCoordCheck <= (coord.lat + LAT_RADIUS) && lonCoordCheck >= (coord.lon - LON_RADIUS) && lonCoordCheck <= (coord.lon + LON_RADIUS) 

    let coordIndex = locationArray.findIndex(findCoords)

    if(!tabHasLaunched && coordIndex > -1) {
      createContent(locationArray[coordIndex])
      }
  })
}

function locationPermissionInstructions() {
  let main = document.querySelector('main')
  let div = document.createElement('div')
  div.innerHTML = `<h4>Location Services must be turned on for the App to work</h4>
  <ol style="padding: 1em; font-size: 1.2em">
    <li>Launch <b><em>Phone Settings</em></b> app on your device.</li>
    <li>Open the <b><em>Privacy</em></b> menu and choose the <b><em>Location Services</em></b> sub-menu</li>
    <li>Enable the <b><em>Location Services</em></b> toggle</li>
    <li>Scroll down on the <b><em>Location Services</em></b> page, and select your <em>Browser</em> from the list</li>
    <li>Choose either <b><em>Ask Next Time</em></b> or <b><em>While Using the App</em></b></li>
    <li>After tracking is allowed, please <b><em>Refresh<em></b> the App or Browser</li>
  </ol>
  <div id="button-wrapper">
    <button id="close-popup">DISMISS</button>
  </div>
  `
  div.style.position = 'absolute'
  div.style.width = '80vw'
  div.style.padding = '1em'
  div.style.margin = '1em'
  div.style.zIndex = '2'
  div.style.top = '0'
  div.style.left = '50%'
  div.style.transform = 'translate(-50%)'
  div.style.background = 'hsla(0, 0%, 30%, .7)'
  div.style.borderRadius = '12px'
  div.style.color ='#fff'
  main.appendChild(div)
  let button = document.getElementById('close-popup')
  let btnWrapper = document.getElementById('button-wrapper')
  btnWrapper.style.display = 'flex'
  btnWrapper.style.flexFlow = 'column'
  btnWrapper.style.justifyContent = 'center'
  button.style.padding = '1em'
  button.style.textAlign = 'center'
  button.addEventListener('click', ()=> {
    div.style.display = 'none'
  })
}

// error handling
function positionError( error ) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      // Check if user has geo permissions turned off and send
      // them instructions with a message on how to turn on
      console.error("User denied the request for Geolocation")
      if(/Android|Pixel|iPhone|iPad|iPod/i.test(navigator.userAgent)){
        locationPermissionInstructions()
      }
      break;

    case error.POSITION_UNAVAILABLE:

      console.error("Location information is unavailable")
      break;

    case error.TIMEOUT:

      console.error("The request has timed out")
      break;

    case error.UNKNOWN_ERROR:

      console.error("An unknown error occurred")
      break;
  }
}

// function to stop the active tracking
function stopWatch() {
  tabHasLaunched = false
  navigator.geolocation.clearWatch( geoWatch)
  geoWatch = undefined;
  longDisplay.innerHTML = 'Not Tracking'
  latDisplay.innerHTML = 'Not Tracking'
  statusDisplay.innerHTML = 'Off'
  soundComp.stop()
  appHasStarted = false
  console.log("soundFile from stopped", soundComp)
  console.log('tracking stopped')
}

// Check the state of the on/off toggle
function checkToggle () {
  if(toggle.checked) {
    onIndicator.classList.remove('dim')
    onIndicator.classList.add('lit')
    offIndicator.classList.remove('lit')
    offIndicator.classList.add('dim')
    trackingBox.style.visibility = 'visible'
    trackingBox.classList.add('bounce-animation')
    leftArrow.style.display = 'none'
    startWatch()
  } else {
    offIndicator.classList.remove('dim')
    offIndicator.classList.add('lit')
    onIndicator.classList.remove('lit')
    onIndicator.classList.add('dim')
    trackingBox.style.visibility = 'hidden'
    trackingBox.classList.remove('bounce-animation')
    leftArrow.style.display = 'flex'
    stopWatch()
  }
}

// Listen for changes to the toggle
toggle.addEventListener('change', checkToggle)