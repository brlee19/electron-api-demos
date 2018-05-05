const {ipcRenderer} = require('electron')
const activeWin = require('active-win');
const moment = require('moment');


const appInfoBtn = document.getElementById('app-info')

let activities = [];
let errors = []; //NOT SURE IF ERROR IS DETECTED WHEN SCREEN JUST GOES BLANK

const timestamp = () => { //can change moment format for ease of manipulation
  return moment().format('MMMM Do YYYY, h:mm:ss a');
};

let counter = 0; //closure variable for monitor
const monitor = async () => {
  try {
    let activity = await activeWin();
    activity.time = timestamp();
    //document.getElementById('got-app-info').innerHTML = JSON.stringify(activity);
    activities.unshift(activity);
    // document.getElementById('got-app-info').innerHTML = JSON.stringify(activities);
    counter++;
    if (counter % 1000 === 0) { //control how often this prints to your console
      console.log('just assuring you that monitor is still running', activities);
    }
  } catch(e) {
    counter++;
    e.time = timestamp();
    console.log('error is', e);
    console.log('error message is', e.message);
    errors.push(JSON.stringify(e)); //TODO: this loses some info but full error objects apparently can't be stored in an array
    if (counter % 1000 === 0) {
      console.log('just assuring you that monitor is still running', errors);
    }
  }
};

setInterval(monitor, 1000);

appInfoBtn.addEventListener('click', () => {
  ipcRenderer.send('get-app-path')
})

ipcRenderer.on('got-app-path', (event, path) => {
  monitor()
  const message = `This app is located at: ${path}`
  document.getElementById('got-app-info').innerHTML = JSON.stringify(activities);
})
