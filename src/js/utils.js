import { className } from './settings.js';

export const utils = {};

utils.alert = function(wrapper, msg){
  const div = document.createElement('div');
  
  div.innerHTML = msg;
  div.classList.add(className.alert);

  wrapper.appendChild(div);

  setTimeout(function(){
    wrapper.removeChild(div);
  }, 1000);

};

