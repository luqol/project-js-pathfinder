import {select, className} from './settings.js';

const app = {
  initPages: function(){
    const thisApp = this;
    
    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);
    
    const idFromHash = window.location.hash.replace('#/', '');

    let pageMatchingHash = thisApp.pages[0].id;

    for (let page of thisApp.pages){
      if(page.id == idFromHash){
        pageMatchingHash = page.id;
        break;
      }
    }

    thisApp.activatePage(pageMatchingHash);

    for(let link of thisApp.navLinks){
      link.addEventListener('click', function(event){
        event.preventDefault();
        const clickedElement = this;

        const id = clickedElement.getAttribute('href').replace('#', '');

        thisApp.activatePage(id);

        window.location.hash = '#/' + id;
      });
    }

  },

  activatePage: function(pageID){
    const thisApp = this;

    for(let page of thisApp.pages){
      page.classList.toggle(className.pages.active, page.id == pageID);
    }
    
  },

  init: function(){
    const thisApp = this;
    
    thisApp.initPages();
  },
  
};

app.init();