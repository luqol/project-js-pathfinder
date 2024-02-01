export const className ={
  pages: {
    active: 'active',
  },
  map: {
    box: 'box',
    active: 'active',
    start: 'start',
    end: 'end',
    selected: 'selected',
  },
  alert: 'alert',
  summary: {
    active: 'active',
    
  }
};

export const select = {
  templateOf: {
    summary: '#template-summary',
  },
  pageID: {
    about: 'about',
    finder: 'finder',
  },
  containerOf: {
    pages: '#pages',
    finder: '.finder_body',
    map: '.map',
    mainWrapper: '.finder-wrapper',
    summary: '.summary',
  },
  nav: {
    links: '.main_nav a',
  },
  finder: {
    title: '.finder_title',
    btn: '.btn',
    boxes: '.box',
    path: '.box.active',
  },
  summary:{
    btn: '.btn-summary',
  },
};

export const settings = {
  finderPhase: {
    first: {
      info: 'Draw routes',
      btn: 'Finish drawing',
    },
    secound:{
      info: 'Pick start and finish',
      btn: 'Compute',
    },
    third:{
      info: 'The best route is...',
      btn: 'Start again',
    },
  },
  db: {
    url: '//' + window.location.hostname + (window.location.hostname=='localhost' ? ':3131' : ''),
    templates: 'templates',
  }
};

export const templates = {
  summary: Handlebars.compile(document.querySelector(select.templateOf.summary).innerHTML),
};