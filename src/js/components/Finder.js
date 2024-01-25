import { className, select, settings } from '../settings.js';

class Finder{
  constructor(wrapper){
    const thisFinder = this;
    thisFinder.map = [];
    thisFinder.startEnd = [];
    thisFinder.path = [];

    thisFinder.getElements(wrapper);
    thisFinder.initActions();

  }
  getElements(wrapper){
    const thisFinder = this;

    thisFinder.dom = {};

    thisFinder.dom.wrapper = wrapper;
    thisFinder.dom.map = thisFinder.dom.wrapper.querySelector(select.containerOf.map);
    thisFinder.dom.btn = thisFinder.dom.wrapper.querySelector(select.finder.btn);
    thisFinder.dom.title = thisFinder.dom.wrapper.querySelector(select.finder.title);
    thisFinder.dom.boxes = thisFinder.dom.wrapper.querySelectorAll(select.finder.boxes);
    
  }

  initActions(){
    const thisFinder = this;

    thisFinder.dom.map.addEventListener('click', function(event){
      const clickedElement = event.target;
      
      if (clickedElement.classList.contains(className.map.box) 
          && thisFinder.dom.title.innerHTML == settings.finderPhase.first.info){
        thisFinder.drawRoutes(clickedElement);
      } else if (clickedElement.classList.contains(className.map.box) 
      && clickedElement.classList.contains(className.map.active)
      && thisFinder.dom.title.innerHTML == settings.finderPhase.secound.info){
        thisFinder.startFinish(clickedElement);
      } 
    });

    thisFinder.dom.btn.addEventListener('click', function(event){
      event.preventDefault();
      thisFinder.changePhase(event.target.innerHTML);
    });
  }

  startFinish(clickedElement){
    const thisFinder = this;
    const coord = clickedElement.classList[0];
    
    if(thisFinder.startEnd[0] == undefined){
      clickedElement.classList.add(className.map.start);
      thisFinder.startEnd.push(coord);
    } else if(thisFinder.startEnd[0] == coord && thisFinder.startEnd[1] == undefined){
      clickedElement.classList.remove(className.map.start);
      thisFinder.startEnd.splice(0,1);
    }else if(thisFinder.startEnd[1] == undefined){
      clickedElement.classList.add(className.map.end);
      thisFinder.startEnd.push(coord);
    } else if(thisFinder.startEnd[1] == coord ){
      clickedElement.classList.remove(className.map.end);
      thisFinder.startEnd.splice(1,1);
    }

  }

  drawRoutes(clickedElement){
    const thisFinder = this;
    const coord = clickedElement.classList[0];

    /* mark start box */
    if (thisFinder.map.length == 0 ){
      clickedElement.classList.add(className.map.active);
      thisFinder.map.push(coord);
    } /* remove box if exist in map arr */
    else if(thisFinder.map.includes(coord)){
      clickedElement.classList.remove(className.map.active);
      thisFinder.removePath(coord);
    }/* check if box is adjected to the other box */
    else if(thisFinder.addPath(coord)){
      clickedElement.classList.add(className.map.active);
      thisFinder.map.push(coord);
    } else{
      console.log('to far from path');
    }

    //console.log(thisFinder.map);
  }

  removePath(coord){
    const thisFinder = this;
    const index = thisFinder.map.indexOf(coord);
    thisFinder.map.splice(index, 1);
  }

  addPath(coord){
    const thisFinder = this;
    const adjectedPoints = [
      (parseInt(coord[0])-1).toString() + coord[1],
      (parseInt(coord[0])+1).toString() + coord[1],
      coord[0] + (parseInt(coord[1])+1).toString(),
      coord[0] + (parseInt(coord[1])-1).toString(),
    ];

    for(let points of thisFinder.map){
      for (let adjectedPoint of adjectedPoints){
        if(points == adjectedPoint){
          return true;
        }
      }
    }
    return false;
  }

  changePhase(phase){
    const thisFinder = this;
    if(phase == settings.finderPhase.first.btn){
      thisFinder.dom.title.innerHTML = settings.finderPhase.secound.info;
      thisFinder.dom.btn.innerHTML = settings.finderPhase.secound.btn;
      thisFinder.dom.path = thisFinder.dom.wrapper.querySelectorAll(select.finder.path);
    } else if(phase == settings.finderPhase.secound.btn){
      thisFinder.dom.title.innerHTML = settings.finderPhase.third.info;
      thisFinder.dom.btn.innerHTML = settings.finderPhase.third.btn;
      thisFinder.bestRoute();
    }else if(phase == settings.finderPhase.third.btn){
      thisFinder.dom.title.innerHTML = settings.finderPhase.first.info;
      thisFinder.dom.btn.innerHTML = settings.finderPhase.first.btn;
      thisFinder.map = [];
      thisFinder.startEnd = [];
      for(let box of thisFinder.dom.boxes){
        if(box.classList.contains(className.map.active)){
          box.classList.remove(className.map.active);
          box.classList.remove(className.map.start);
          box.classList.remove(className.map.end);
        }
      }
    }

  }

  bestRoute(){

  }
}

export default Finder;