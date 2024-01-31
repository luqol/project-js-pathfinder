import { className, select, settings } from '../settings.js';
import { utils } from '../utils.js';

class Finder {
  constructor(wrapper) {
    const thisFinder = this;
    thisFinder.map = [];
    thisFinder.startEnd = [];
    thisFinder.paths = [];
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
      clickedElement.classList.remove(className.map.active);
      thisFinder.removePath(coord);
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

  removePath(coord) {
    const thisFinder = this;
    const index = thisFinder.map.indexOf(coord);
    thisFinder.map.splice(index, 1);
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
    } else if (phase == settings.finderPhase.third.btn) {
      thisFinder.dom.title.innerHTML = settings.finderPhase.first.info;
      thisFinder.dom.btn.innerHTML = settings.finderPhase.first.btn;
      thisFinder.map = [];
      thisFinder.startEnd = [];
      thisFinder.paths = [];
      thisFinder.correctPaths = [];
      thisFinder.bestRoute =[];
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

    thisFinder.checkPath();

    thisFinder.choosePath();

    thisFinder.drawBestRoute();

    console.log('map', thisFinder.map);
    console.log('startEnd', thisFinder.startEnd);
    console.log('paths', thisFinder.paths);
    console.log('correctPaths', thisFinder.correctPaths);
    console.log('bestRoute', thisFinder.bestRoute);
  }

  checkPath() {
    const thisFinder = this;

    for (let path of thisFinder.paths) {
      //console.log(' ');
      //console.log('Nowa sciezka ', thisFinder.paths.indexOf(path));
      //console.log('insex: ', thisFinder.paths.indexOf(path), 'sciezka: ', path);

      for(let i = 0; i < path.length; i++){
        //console.log(' ');
        //console.log('iteracja nr ', i);
        const lastPoint = path[path.length - 1];
        //console.log('last point', lastPoint);
        const adjectedPoints = thisFinder.adjectedPoint(lastPoint);
        let newPath = false;
        if(lastPoint != thisFinder.startEnd[1]){
          for (const adPoint of adjectedPoints) {
            for (const coord of thisFinder.map) {
              if (adPoint == coord && !path.includes(adPoint)) {
                //console.log('wspolne pkt', adPoint);
                if (newPath == false && adPoint != lastPoint && adPoint != thisFinder.startEnd[0]) {
                  //console.log('dodanie pkt', adPoint);
                  path.push(adPoint);
                  //console.log('akutalna scieska', path);
                  newPath = true;
                } else if (adPoint != lastPoint && adPoint != thisFinder.startEnd[0]) {
                  //console.log('dodanie nowej sciezki');
                  thisFinder.paths.push(path.slice(0, -1));
                  thisFinder.paths[thisFinder.paths.length - 1].push(adPoint);
                  //console.log('nowa sciezka', thisFinder.paths.length - 1, 'sciezka: ', thisFinder.paths[thisFinder.paths.length - 1]);
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
    thisFinder.correctPaths = [];

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

}

export default Finder;