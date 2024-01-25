import { className, select } from '../settings.js';

class Finder{
  constructor(wrapper){
    const thisFinder = this;
    thisFinder.map = [];

    thisFinder.getElements(wrapper);
    thisFinder.initActions();

  }
  getElements(wrapper){
    const thisFinder = this;

    thisFinder.dom = {};

    thisFinder.dom.wrapper = wrapper;
    thisFinder.dom.map = thisFinder.dom.wrapper.querySelector(select.containerOf.map);
  }

  initActions(){
    const thisFinder = this;

    thisFinder.dom.map.addEventListener('click', function(event){
      const clickedElement = event.target;
      
      if (clickedElement.classList.contains(className.map.box)){
        thisFinder.drawRoutes(clickedElement);
      }
    });
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

}

export default Finder;