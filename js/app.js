const longDisplay = document.getElementById('longDisplay')
const latDisplay = document.getElementById('latDisplay')
const statusDisplay = document.getElementById('tracking')
const trackingBox = document.getElementById('tracking-message-box')
const sheets = document.getElementById('sheets')

const toggle = document.getElementById('tracking-toggle')
const onIndicator = document.getElementById('on')
const offIndicator = document.getElementById('off')
const leftArrow = document.querySelector('.arrow')
const mainHeaderImage = document.getElementById('main-header')

const stopBtn = document.getElementById('stop-sound')
const resumeBtn = document.getElementById('resume-sound')
stopBtn.style.display = 'none'
resumeBtn.style.display = 'none'


const MASTER_URL = 'https://docs.google.com/spreadsheets/d/15WHrKYdLhyepMQPdWtqZQAeHonpC-ntF1PIldJz_hjQ/gviz/tq?tqx=out:json'
const SOUND_DRIVE_URL = 'https://docs.google.com/uc?export=download&id='

//Constants for establishing an equal perimeter. Can be adjusted to fit the bounding area
const LAT_RADIUS = 0.000240
const LON_RADIUS = 0.000240 // 70 ft radius .000024 = 7ft ~.00000343 = 1ft
// position tracking
let geoWatch;
let lonCoordCheck;
let latCoordCheck;

// if port is needed
let port = window.location.port

// identifying poem location
let poem;
let identifier;

// Log the currently launched external url
const openTab = []
let tabHasLaunched = false;

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


// let sound1 = new Sound('../sound/poem1.mp3')
// let sound1 = new Sound('https://docs.google.com/uc?export=download&id=1PhqYAw8-INVo6-QWHVPZJADOsmwXtzem')

// register service worker for caching assets
if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
  .then((reg) => console.log('service worker registered', reg))
  .catch((err) => console.log('service worker not registered', err))
}

// begin listening for coordinates and track changes
function startWatch() {
  console.log('startWatch starting')
  if(!geoWatch) {
    if('geolocation' in navigator && 'watchPosition' in navigator.geolocation) {
      console.log('gps support')
      geoWatch = navigator.geolocation.watchPosition( setCurrentPosition, positionError, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      })
      statusDisplay.innerText = 'Tracking'
    } 
  }
}

//========FUNCTIONS========\\

// Play and Stop Sounds
function playSound(soundUrl, timer) {
  let soundFile = new Sound(soundUrl)
  soundComp = soundFile;
  stopBtn.addEventListener('click', () => {
    soundFile.stop()
    stopBtn.style.boxShadow = '0 0 8px 8px #ffffff'
    resumeBtn.style.boxShadow = 'none'
    // paused = true;
    // const timeCounter = () => {
    //   addTime += 1;
    //   console.log(addTime)
    // }
    // let timeCountInitial = setInterval(timeCounter, 1000)

    
    // stopBtn.style.display = 'none'
    console.log("Sound Stopped")
  })
  resumeBtn.addEventListener('click', () => {
    soundFile.play()
    resumeBtn.style.boxShadow = '0 0 8px 8px #ffffff'
    stopBtn.style.boxShadow = 'none'
    // paused = false;
    // clearInterval(timeCountInitial)
    
  })
  stopBtn.style.display = 'flex'
  stopBtn.style.position = 'absolute'
  stopBtn.style.bottom = '40%'
  stopBtn.style.left = '5%'
  stopBtn.style.border = 'none'
  stopBtn.style.borderRadius = '12px'
  stopBtn.style.padding = '1em'
  stopBtn.style.fontSize = '1.5em'
  stopBtn.style.backgroundColor = 'hsla(0, 0%, 5%, .8'
  stopBtn.style.color = 'hsl(0, 0%, 100%)'
  resumeBtn.style.display = 'flex'
  resumeBtn.style.position = 'absolute'
  resumeBtn.style.bottom = '40%'
  resumeBtn.style.right = '5%'
  resumeBtn.style.border = 'none'
  resumeBtn.style.borderRadius = '12px'
  resumeBtn.style.padding = '1em'
  resumeBtn.style.fontSize = '1.5em'
  resumeBtn.style.backgroundColor = 'hsla(0, 0%, 5%, .8'
  resumeBtn.style.boxShadow = '0 0 8px 8px #ffffff'
  resumeBtn.style.color = 'hsl(0, 0%, 100%)'
  soundFile.stop()
  soundFile.play()
  console.log("sound playing")
  setTimeout(() => {
    soundFile.stop()
    stopBtn.style.display = 'none'
    resumeBtn.style.display = 'none'
    console.log("sound stopped")

  }, timer)
}


// Close previously opened tabs
function closeTab() {
  openTab.shift()
  console.log("tabs closed")
}

// Create variables 
// Variables needed:
// lat, lon, image, soundFile, artist, min, sec
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
const createImage = (obj, objLen) => {
  for(let i = 0; i < objLen; i++){
    this[`image${i + 1}`] = `${obj[i].c[2].v}`            // COLUMN C
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
// const createName = (obj, objLen) => {
//   for(let i = 0; i < objLen; i++){
//     this[`name${i + 1}`] = `${obj[i].c[7].v}`       // COLUMN H
//   }
// }
// const createLocation = (obj, objLen) => {
//   for(let i = 0; i < objLen; i++){
//     this[`loc${i + 1}`] = `${obj[i].c[8].v}`       // COLUMN I
//   }
// }

// begin to fetch coordinates and set the geolocation
function setCurrentPosition( position ) {
    
  // Fetch coords from google sheet
  const fetchedGoogleSheetData = fetch(MASTER_URL)
    .then(response => response.text())
    .then(data => {

      // Need to find the start of the json info becuase sheets updates the sig parameter
      let colStart = data.indexOf("cols") -2

      // Get only the part of the google sheet response that is in json format, parse as json
      const result = (JSON.parse(data.slice(colStart, data.length - 3))).rows

      console.log("RESULT", result)

    // -- there should be a more dynamic way to set the variables --DONE
    // -- Add functionality that assigns variables to each group of variable types --DONE
      let resultLength = Object.keys(result).length // set length for dynamic variable rendering

      // Calling functions to dynamically render variables
      createLat(result, resultLength)
      createLon(result, resultLength)
      createImage(result, resultLength)
      createSoundLink(result, resultLength)
      createMin(result, resultLength)
      createSec(result, resultLength)
      createName(result, resultLength)
      createLocation(result, resultLength)
    
    

    console.log('fetched')
    
    //  for displaying the coordinates - testing purposes
    latDisplay.innerHTML = position.coords.latitude
    longDisplay.innerHTML = position.coords.longitude
    latCoordCheck = position.coords.latitude
    lonCoordCheck = position.coords.longitude

    //testing truthiness of condition
    // console.log("poem 1", latCoordCheck >= (lat1 - LAT_RADIUS) , latCoordCheck <= (lat1 + LAT_RADIUS) ,lonCoordCheck >= (lon1 - LON_RADIUS) ,lonCoordCheck <= (lon1 + LON_RADIUS))
    // console.log(lonCoordCheck, lon1, LON_RADIUS, typeof (lon1 + LON_RADIUS))


    // Conditionally checking and functionality of launching external sites

    // if the coordinate bounding box is entered
    // Use classes to render these? --
    
    // POEM 1 ////////
    if(!tabHasLaunched) {
      if(latCoordCheck >= (lat1 - LAT_RADIUS) && latCoordCheck <= (lat1 + LAT_RADIUS) && lonCoordCheck >= (lon1 - LON_RADIUS) && lonCoordCheck <= (lon1 + LON_RADIUS)) {
        poem = name1.replace(/\s+/g, '')
        url1 = youtubeUrl1
        mainHeaderImage.style.backgroundImage = `url(/image/${poem}.jpg)`
        let timer = (((min1*60) + sec1) * 1000)
        let soundFile = SOUND_DRIVE_URL + url1
        
        // if the window has not previously been opened
        // if(openTab[0] !== `${url1}` && openTab !== `${url1}` && identifier !== url1) {
          if(!openTab.includes(url1)) {
            
          playSound(soundFile, timer)
          
          // Set identifier to current poem
          identifier = url1
          
          // launch the new window with the poems page and push the location of the open tab to openTab
          openTab.push(url1)

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
      sheets.style.fontWeight = 'bold'  
      sheets.innerText = loc1 // Output the name of the current poem or location
      }
    }

    // there will be the same code block for each location
    // maybe these can be modularized
    // console.log("poem 2", latCoordCheck >= (lat2 - LAT_RADIUS) , latCoordCheck <= (lat2 + LAT_RADIUS) ,lonCoordCheck >= (lon2 - LON_RADIUS) ,lonCoordCheck <= (lon2 + LON_RADIUS))
    // POEM 2 ///////
    if(!tabHasLaunched) {
      if(latCoordCheck >= (lat2 - LAT_RADIUS) && latCoordCheck <= (lat2 + LAT_RADIUS) && lonCoordCheck >= (lon2 - LON_RADIUS) && lonCoordCheck <= (lon2 + LON_RADIUS)) {
        poem = name2.replace(/\s+/g, '')
        url2 = youtubeUrl2
        mainHeaderImage.style.backgroundImage = `url(/image/${poem}.jpg)`
        let timer = (((min2*60) + sec2) * 1000)
        let soundFile = SOUND_DRIVE_URL + url2

        if(!openTab.includes(url2)) {
          playSound(soundFile, timer)
          identifier = url2
          openTab.push(url2)
          tabHasLaunched = true;
          if(openTab[1]) {
            closeTab()
          }
          setTimeout(() => {
            tabHasLaunched = false;
          }, timer)
        }
        sheets.style.fontWeight = 'bold'  
        sheets.innerText = loc2
  
      }
    }

    // POEM 3 ////////
    if(!tabHasLaunched) {
      if(latCoordCheck >= (lat3 - LAT_RADIUS) && latCoordCheck <= (lat3 + LAT_RADIUS) && lonCoordCheck >= (lon3 - LON_RADIUS) && lonCoordCheck <= (lon3 + LON_RADIUS)) {
        poem = name3.replace(/\s+/g, '')
        url3 = youtubeUrl3
        mainHeaderImage.style.backgroundImage = `url(/image/${poem}.jpg)`
        let timer = (((min3*60) + sec3) * 1000)
        let soundFile = SOUND_DRIVE_URL + url3
        if(!openTab.includes(url3)) {
          
          playSound(soundFile, timer)
          identifier = url3
          openTab.push(url3)
          tabHasLaunched = true;
          if(openTab[1]) {
            closeTab()
          }
          setTimeout(() => {
            tabHasLaunched = false;
          }, timer)
        }
        sheets.style.fontWeight = 'bold'
        sheets.innerText = loc3
  
      }
    }

    // POEM 4 //////
    if(!tabHasLaunched) {
      if(latCoordCheck >= (lat4 - LAT_RADIUS) && latCoordCheck <= (lat4 + LAT_RADIUS) && lonCoordCheck >= (lon4 - LON_RADIUS) && lonCoordCheck <= (lon4 + LON_RADIUS)) {
        poem = name4.replace(/\s+/g, '')
        url4 = youtubeUrl4
        mainHeaderImage.style.backgroundImage = `url(/image/${poem}.jpg)`
        let timer = (((min4*60) + sec4) * 1000)
        let soundFile = SOUND_DRIVE_URL + url4

        if(!openTab.includes(url4)) {
          playSound(soundFile, timer)
          identifier = url4
          openTab.push(url4)
          tabHasLaunched = true;
          if(openTab[1]) {
            closeTab()
          }
          setTimeout(() => {
            tabHasLaunched = false;
          }, timer)
        }
        sheets.style.fontWeight = 'bold'
        sheets.innerText = loc4
  
      }
    }

    // POEM 5 //////
    if(!tabHasLaunched) {
      if(latCoordCheck >= (lat5 - LAT_RADIUS) && latCoordCheck <= (lat5 + LAT_RADIUS) && lonCoordCheck >= (lon5 - LON_RADIUS) && lonCoordCheck <= (lon5 + LON_RADIUS)) {
        poem = name5.replace(/\s+/g, '')
        url5 = youtubeUrl5
        mainHeaderImage.style.backgroundImage = `url(/image/${poem}.jpg)`

        let timer = (((min5*60) + sec5) * 1000)
        let soundFile = SOUND_DRIVE_URL + url5

        if(!openTab.includes(url5)){
          playSound(soundFile, timer)
          identifier = url5
          openTab.push(url5)
          tabHasLaunched = true;
          if(openTab[1]) {
            closeTab()
          }
          setTimeout(() => {
            tabHasLaunched = false;
          }, timer)
        }
        sheets.style.fontWeight = 'bold'
        sheets.innerText = loc5
  
      }
    }

    // POEM 6 //////
    if(!tabHasLaunched) {
      if(latCoordCheck >= (lat6 - LAT_RADIUS) && latCoordCheck <= (lat6 + LAT_RADIUS) && lonCoordCheck >= (lon6 - LON_RADIUS) && lonCoordCheck <= (lon6 + LON_RADIUS)) {
        poem = name6.replace(/\s+/g, '')
        url6 = youtubeUrl6
        mainHeaderImage.style.backgroundImage = `url(/image/${poem}.jpg)`

        let timer = (((min6*60) + sec6) * 1000)
        let soundFile = SOUND_DRIVE_URL + url6

        if(!openTab.includes(url6)) {
          playSound(soundFile, timer)
          identifier = url6
          openTab.push(url6)
          tabHasLaunched = true;
          if(openTab[1]) {
            closeTab()
          }
          setTimeout(() => {
            tabHasLaunched = false;
          }, timer)
        }
        sheets.style.fontWeight = 'bold'
        sheets.innerText = loc6
  
      }
    }

    // POEM 7 //////
    if(!tabHasLaunched) {
      if(latCoordCheck >= (lat7 - LAT_RADIUS) && latCoordCheck <= (lat7 + LAT_RADIUS) && lonCoordCheck >= (lon7 - LON_RADIUS) && lonCoordCheck <= (lon7 + LON_RADIUS)) {
        poem = name7.replace(/\s+/g, '')
        url7 = youtubeUrl7
        mainHeaderImage.style.backgroundImage = `"url(/image/${poem}.jpg)"`

        let timer = (((min7*60) + sec7) * 1000)
        let soundFile = SOUND_DRIVE_URL + url7

        if(!openTab.includes(url7)){
          playSound(soundFile, timer)
          identifier = url7
          openTab.push(url7)
          tabHasLaunched = true;
          if(openTab[1]) {
            closeTab()
          }
          setTimeout(() => {
            tabHasLaunched = false;
          }, timer)
        }
        sheets.style.fontWeight = 'bold'
        sheets.innerText = loc7
  
      }
    }

    // POEM 8 //////
    if(!tabHasLaunched) {
      if(latCoordCheck >= (lat8 - LAT_RADIUS) && latCoordCheck <= (lat8 + LAT_RADIUS) && lonCoordCheck >= (lon8 - LON_RADIUS) && lonCoordCheck <= (lon8 + LON_RADIUS)) {
        poem = name8.replace(/\s+/g, '')
        url8 = youtubeUrl8
        mainHeaderImage.style.backgroundImage = `url(/image/${poem}.jpg)`
        let timer = (((min8*60) + sec8) * 1000)
        let soundFile = SOUND_DRIVE_URL + url8

        if(!openTab.includes(url8)){
          playSound(soundFile, timer)
          identifier = url8
          openTab.push(url8)
          tabHasLaunched = true;
          if(openTab[1]) {
            closeTab()
          }
          setTimeout(() => {
            tabHasLaunched = false;
          }, timer)
        }
        sheets.style.fontWeight = 'bold'
        sheets.innerText = loc8
  
      }
    }

    // POEM 9 //////
    if(!tabHasLaunched) {
      if(latCoordCheck >= (lat9 - LAT_RADIUS) && latCoordCheck <= (lat9 + LAT_RADIUS) && lonCoordCheck >= (lon9 - LON_RADIUS) && lonCoordCheck <= (lon9 + LON_RADIUS)) {
        poem = name9.replace(/\s+/g, '')
        url9 = youtubeUrl9
        mainHeaderImage.style.backgroundImage = `url(/image/${poem}.jpg)`
        let timer = (((min9*60) + sec9) * 1000)
        let soundFile = SOUND_DRIVE_URL + url9

        if(!openTab.includes(url9)){
          playSound(soundFile, timer)
          identifier = url9
          openTab.push(url9)
          tabHasLaunched = true;
          if(openTab[1]) {
            closeTab()
          }
          setTimeout(() => {
            tabHasLaunched = false;
          }, timer)
        }
        sheets.style.fontWeight = 'bold'
        sheets.innerText = loc9
  
      }
    }

    // POEM 10 //////
    if(!tabHasLaunched) {
      if(latCoordCheck >= (lat10 - LAT_RADIUS) && latCoordCheck <= (lat10 + LAT_RADIUS) && lonCoordCheck >= (lon10 - LON_RADIUS) && lonCoordCheck <= (lon10 + LON_RADIUS)) {
        poem = name10.replace(/\s+/g, '')
        url10 = youtubeUrl10
        mainHeaderImage.style.backgroundImage = `url(/image/${poem}.jpg)`
        console.log("header image", mainHeaderImage.style.backgroundImage)
        let timer = (((min10*60) + sec10) * 1000)
        let soundFile = SOUND_DRIVE_URL + url10

        if(!openTab.includes(url10)){
          playSound(soundFile, timer)
          identifier = url10
          openTab.push(url10)
          tabHasLaunched = true;
          if(openTab[1]) {
            closeTab()
          }
          setTimeout(() => {
            tabHasLaunched = false;
          }, timer)
        }
        sheets.style.fontWeight = 'bold'
        sheets.innerText = loc10
  
      }

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

    case error.UNKOWN_ERROR:

      console.error("An unkown error occured")
      break;
  }
}

// function to stop the active tracking
function stopWatch() {
  navigator.geolocation.clearWatch( geoWatch)
  geoWatch = undefined;
  longDisplay.innerHTML = 'Not Tracking'
  latDisplay.innerHTML = 'Not Tracking'
  statusDisplay.innerHTML = 'Off'
  soundComp.stop()
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