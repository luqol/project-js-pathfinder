import { className, select, settings, templates } from '../settings.js';
import { utils } from '../utils.js';

class Finder {
  constructor(wrapper) {
    const thisFinder = this;
    thisFinder.map = [];
    thisFinder.startEnd = [];
    thisFinder.paths = [];
    thisFinder.correctPaths = [];
    thisFinder.bestRoute = [];


    thisFinder.getElements(wrapper);
    thisFinder.render();
    thisFinder.initActions();

  }
  getElements(wrapper) {
    const thisFinder = this;

    thisFinder.dom = {};

    thisFinder.dom.wrapper = wrapper;
    thisFinder.dom.map = thisFinder.dom.wrapper.querySelector(select.containerOf.map);
    thisFinder.dom.btn = thisFinder.dom.wrapper.querySelector(select.finder.btn);
    thisFinder.dom.title = thisFinder.dom.wrapper.querySelector(select.finder.title);

    thisFinder.dom.mainWrapper = document.querySelector(select.containerOf.mainWrapper);

  }

  render(){
    const thisFinder = this;

    for(let i = 0; i<10; i++){
      for(let j = 0; j<10; j++){
        const div = document.createElement('div');
        const coord = i.toString() + j.toString();
        div.classList.add(coord, className.map.box);
        if(j == 9){
          div.classList.add('box-right');
        }
        if(i == 9){
          div.classList.add('box-bottom');
        }

        thisFinder.dom.map.appendChild(div);
      }
    }
    thisFinder.dom.boxes = thisFinder.dom.wrapper.querySelectorAll(select.finder.boxes);
  }

  initActions() {
    const thisFinder = this;

    thisFinder.dom.map.addEventListener('click', function (event) {
      const clickedElement = event.target;

      if (clickedElement.classList.contains(className.map.box)
        && thisFinder.dom.title.innerHTML == settings.finderPhase.first.info) {
        thisFinder.drawRoutes(clickedElement);
      } else if (clickedElement.classList.contains(className.map.box)
        && clickedElement.classList.contains(className.map.active)
        && thisFinder.dom.title.innerHTML == settings.finderPhase.secound.info) {
        thisFinder.startFinish(clickedElement);
      }
    });

    thisFinder.dom.btn.addEventListener('click', function (event) {
      event.preventDefault();
      thisFinder.changePhase(event.target.innerHTML);
    });

  }

  startFinish(clickedElement) {
    const thisFinder = this;
    const coord = clickedElement.classList[0];

    if (thisFinder.startEnd[0] == undefined) {
      clickedElement.classList.add(className.map.start);
      thisFinder.startEnd.push(coord);
    } else if (thisFinder.startEnd[0] == coord && thisFinder.startEnd[1] == undefined) {
      clickedElement.classList.remove(className.map.start);
      thisFinder.startEnd.splice(0, 1);
    } else if (thisFinder.startEnd[1] == undefined) {
      clickedElement.classList.add(className.map.end);
      thisFinder.startEnd.push(coord);
    } else if (thisFinder.startEnd[1] == coord) {
      clickedElement.classList.remove(className.map.end);
      thisFinder.startEnd.splice(1, 1);
    }

  }

  drawRoutes(clickedElement) {
    const thisFinder = this;
    const coord = clickedElement.classList[0];

    /* mark start box */
    if (thisFinder.map.length == 0) {
      clickedElement.classList.add(className.map.active);
      thisFinder.map.push(coord);
    } /* remove box if exist in map arr */
    else if (thisFinder.map.includes(coord)) {
      /* check if will be hole in path*/
      if(thisFinder.checkHole(coord)){
        clickedElement.classList.remove(className.map.active);
        thisFinder.removePath(thisFinder.map, coord);
      }
    }/* check if box is adjected to the other box */
    else if (thisFinder.addPath(coord)) {
      clickedElement.classList.add(className.map.active);
      thisFinder.map.push(coord);
    } else {

      utils.alert(thisFinder.dom.mainWrapper,'path must be adjacent to path');
    }
    thisFinder.drawSelected();
    //console.log(thisFinder.map);
  }

  checkHole(coord){
    const thisFinder = this;
    const adjectedPoints = thisFinder.adjectedPoint(coord);
    const adjectedMapPoints = [];

    for(const point of adjectedPoints){
      if(thisFinder.map.includes(point)){
        adjectedMapPoints.push(point);
      }
    }
    
    if (adjectedMapPoints.length == 1 || adjectedMapPoints.length == 0){
      return true;
    } 
    if (adjectedMapPoints.length == 2){
      let checkPaths = [];
      checkPaths.push([adjectedMapPoints[0]]);
      let newMap = thisFinder.map.slice();
      thisFinder.removePath(newMap,coord);

      //console.log('start', adjectedMapPoints[0]);
      //console.log('end', adjectedMapPoints[1]);
      //console.log('sciezki', checkPaths);
      //console.log('nowaMapa', newMap);

      thisFinder.checkPath(newMap, checkPaths, adjectedMapPoints[0], adjectedMapPoints[1]);

      //console.log('sciezki', checkPaths);
      for (const path of checkPaths){
        if(path[0] == adjectedMapPoints[0] && path[path.length-1] == adjectedMapPoints[1]){
          return true;
        }
      }
    }
    if (adjectedMapPoints.length == 3){
      let checkPaths = [];
      checkPaths.push([adjectedMapPoints[0]]);
      let newMap = thisFinder.map.slice();
      thisFinder.removePath(newMap,coord);
      let connectPoints = false;

      /* check if adjectedMapPoints[0] have connect to adjectedMapPoints[1]*/
      thisFinder.checkPath(newMap, checkPaths, adjectedMapPoints[0], adjectedMapPoints[1]);
      for (const path of checkPaths){
        if(path[0] == adjectedMapPoints[0] && path[path.length-1] == adjectedMapPoints[1]){
          connectPoints = true; 
        }
      }
      /* check if adjectedMapPoints[0] have connect to adjectedMapPoints[2]*/
      if (connectPoints == true){
        connectPoints = false;
        checkPaths = [];
        checkPaths.push([adjectedMapPoints[0]]);
        thisFinder.checkPath(newMap, checkPaths, adjectedMapPoints[0], adjectedMapPoints[2]);
        for (const path of checkPaths){
          if(path[0] == adjectedMapPoints[0] && path[path.length-1] == adjectedMapPoints[2]){
            connectPoints = true; 
          }
        }
      } 

      if(connectPoints == true){
        return true;
      } else{
        utils.alert(thisFinder.dom.mainWrapper,'there will be a hole in the path');
        return false;
      }

    }
    if (adjectedMapPoints.length == 4){
      let checkPaths = [];
      checkPaths.push([adjectedMapPoints[0]]);
      let newMap = thisFinder.map.slice();
      thisFinder.removePath(newMap,coord);
      let connectPoints = false;

      /* check if adjectedMapPoints[0] have connect to adjectedMapPoints[1]*/

      thisFinder.checkPath(newMap, checkPaths, adjectedMapPoints[0], adjectedMapPoints[1]);
      for (const path of checkPaths){
        if(path[0] == adjectedMapPoints[0] && path[path.length-1] == adjectedMapPoints[1]){
          connectPoints = true; 
        }
      }

      /* check if adjectedMapPoints[0] have connect to adjectedMapPoints[2]*/

      if (connectPoints == true){
        connectPoints = false;
        checkPaths = [];
        checkPaths.push([adjectedMapPoints[0]]);
        thisFinder.checkPath(newMap, checkPaths, adjectedMapPoints[0], adjectedMapPoints[2]);
        for (const path of checkPaths){
          if(path[0] == adjectedMapPoints[0] && path[path.length-1] == adjectedMapPoints[2]){
            connectPoints = true; 
          }
        }
      } 

      /* check if adjectedMapPoints[0] have connect to adjectedMapPoints[3]*/

      if (connectPoints == true){
        connectPoints = false;
        checkPaths = [];
        checkPaths.push([adjectedMapPoints[0]]);
        thisFinder.checkPath(newMap, checkPaths, adjectedMapPoints[0], adjectedMapPoints[3]);
        for (const path of checkPaths){
          if(path[0] == adjectedMapPoints[0] && path[path.length-1] == adjectedMapPoints[3]){
            connectPoints = true; 
          }
        }
      }

      if(connectPoints == true){
        return true;
      } else{
        utils.alert(thisFinder.dom.mainWrapper,'there will be a hole in the path');
        return false;
      }

    }
    utils.alert(thisFinder.dom.mainWrapper,'there will be a hole in the path');
    return false;
  }

  removePath(map, coord) {
    const index = map.indexOf(coord);
    map.splice(index, 1);
  }

  addPath(coord) {
    const thisFinder = this;
    const adjectedPoints = thisFinder.adjectedPoint(coord);

    for (let points of thisFinder.map) {
      for (let adjectedPoint of adjectedPoints) {
        if (points == adjectedPoint) {
          return true;
        }
      }
    }
    return false;
  }

  adjectedPoint(coord) {
    const adjectedPoints = [
      (parseInt(coord[0]) - 1).toString() + coord[1], //up
      (parseInt(coord[0]) + 1).toString() + coord[1], //down
      coord[0] + (parseInt(coord[1]) + 1).toString(), //right
      coord[0] + (parseInt(coord[1]) - 1).toString(), //left
    ];
    return adjectedPoints;
  }

  changePhase(phase) {
    const thisFinder = this;
    if (phase == settings.finderPhase.first.btn && thisFinder.map.length > 1) {
      thisFinder.dom.title.innerHTML = settings.finderPhase.secound.info;
      thisFinder.dom.btn.innerHTML = settings.finderPhase.secound.btn;

    } else if (phase == settings.finderPhase.secound.btn && thisFinder.startEnd[0] != undefined && thisFinder.startEnd[1] != undefined) {
      thisFinder.dom.title.innerHTML = settings.finderPhase.third.info;
      thisFinder.dom.btn.innerHTML = settings.finderPhase.third.btn;
      thisFinder.bestPath();
      thisFinder.showSummary();
    } else if (phase == settings.finderPhase.third.btn) {
      thisFinder.dom.title.innerHTML = settings.finderPhase.first.info;
      thisFinder.dom.btn.innerHTML = settings.finderPhase.first.btn;
      thisFinder.map = [];
      thisFinder.startEnd = [];
      thisFinder.paths = [];
      thisFinder.correctPaths = [];
      thisFinder.bestRoute =[];
      thisFinder.drawSelected();
      for (let box of thisFinder.dom.boxes) {
        if (box.classList.contains(className.map.active)) {
          box.classList.remove(className.map.active);
          box.classList.remove(className.map.start);
          box.classList.remove(className.map.end);
        }
      }
    }

    if(phase == settings.finderPhase.first.btn && thisFinder.map.length <= 1){
      utils.alert(thisFinder.dom.mainWrapper,'path must contain at least 2 elements');
    }
    if(phase == settings.finderPhase.secound.btn && (thisFinder.startEnd[0] == undefined || thisFinder.startEnd[1] == undefined)){
      utils.alert(thisFinder.dom.mainWrapper,'please mark the beginning and end of the path');
    }

  }

  bestPath() {
    const thisFinder = this;

    thisFinder.paths.push([thisFinder.startEnd[0]]);

    thisFinder.checkPath(thisFinder.map, thisFinder.paths, thisFinder.startEnd[0], thisFinder.startEnd[1]);

    thisFinder.choosePath();

    thisFinder.drawBestRoute();

    //console.log('map', thisFinder.map);
    //console.log('startEnd', thisFinder.startEnd);
    //console.log('paths', thisFinder.paths);
    //console.log('correctPaths', thisFinder.correctPaths);
    //console.log('bestRoute', thisFinder.bestRoute);
  }

  checkPath(map, paths, start, end) {
    const thisFinder = this;

    for (let path of paths) {
      //console.log(' ');
      //console.log('Nowa sciezka ', paths.indexOf(path));
      //console.log('index: ', paths.indexOf(path), 'sciezka: ', path);

      for(let i = 0; i < path.length; i++){
        //console.log(' ');
        //console.log('iteracja nr ', i);
        const lastPoint = path[path.length - 1];
        //console.log('last point', lastPoint);
        const adjectedPoints = thisFinder.adjectedPoint(lastPoint);
        let newPath = false;
        if(lastPoint != end){
          for (const adPoint of adjectedPoints) {
            for (const coord of map) {
              if (adPoint == coord && !path.includes(adPoint)) {
                //console.log('wspolne pkt', adPoint);
                if (newPath == false && adPoint != lastPoint && adPoint != start) {
                  //console.log('dodanie pkt', adPoint);
                  path.push(adPoint);
                  //console.log('akutalna scieska', path);
                  newPath = true;
                } else if (adPoint != lastPoint && adPoint != start) {
                  //console.log('dodanie nowej sciezki');
                  paths.push(path.slice(0, -1));
                  paths[paths.length - 1].push(adPoint);
                  //console.log('nowa sciezka', paths.length - 1, 'sciezka: ', paths[paths.length - 1]);
                }
              }
            }
          }
        } else{
          i= path.length;
        }
      }
    }

    
  }

  choosePath(){
    const thisFinder = this;

    for(const path of thisFinder.paths){
      if(path[0] == thisFinder.startEnd[0] && path[path.length-1] == thisFinder.startEnd[1]){
        thisFinder.correctPaths.push(path);
      }
    }
    thisFinder.bestRoute = thisFinder.correctPaths[0];
    for( const path of thisFinder.correctPaths){
      if(thisFinder.bestRoute.length > path.length){
        thisFinder.bestRoute = path;
      }
    }

  }

  drawBestRoute(){
    const thisFinder = this;
    for(const id of thisFinder.bestRoute){
      for( const box of thisFinder.dom.boxes){
        if(box.classList.contains(id)){
          if(box.classList.contains(className.map.end)){
            box.classList.remove(className.map.end);
          }
          box.classList.add(className.map.start);
        }
      }
    }
  }

  drawSelected(){
    const thisFinder = this;

    /* remove selected from boxes */
    for (const box of thisFinder.dom.boxes){
      box.classList.remove(className.map.selected);
    }

    /* add selected to boxes*/
    for(const path of thisFinder.map){
      const adjectedPath = thisFinder.adjectedPoint(path);
      for(const coord of adjectedPath){
        let coordBox;
        for(const box of thisFinder.dom.boxes){
          if(box.classList[0] == coord){
            coordBox = box;
          }
        }

        if(!coordBox.classList.contains(className.map.active)){
          coordBox.classList.add(className.map.selected);
        }
      }

    }
  }

  showSummary(){
    const thisFinder = this;

    const sumamrySettings = {
      full: thisFinder.map.length,
      longest: thisFinder.longestPath(),
      shortest: thisFinder.bestRoute.length,
    };


    /* generat HMTL basen on template */
    const generatedHTML = templates.summary(sumamrySettings);
    /* create element using utilis.createElementFromHTML */
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    /* find body*/
    const mainContainer = document.querySelector('body');
    /* add summary to body */
    mainContainer.appendChild(generatedDOM);

    const summary = document.querySelector(select.containerOf.summary);
    const btnSummary = document.querySelector(select.summary.btn);

    btnSummary.addEventListener('click', function(event){
      event.preventDefault(); 
      summary.classList.remove(className.summary.active);
      generatedDOM.remove();
    });

  }

  longestPath(){
    const thisFinder = this;
    let longestRoute = thisFinder.correctPaths[0];

    for (const path of thisFinder.correctPaths){
      if(longestRoute.length < path.length){
        longestRoute = path;
      }
    }

    return longestRoute.length;
  }

}

export default Finder;