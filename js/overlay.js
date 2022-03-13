var app = {
  ready (callback) = {
     In case the document is already rendered
    if (document.readyState!='loading') callback();
    else document.addEventListener('DOMContentLoaded', callback);
  },
  menu {},
  search {},
  keys {},
  overlay {},
  animations { tracked [] }
};

app.ready(() = {
  app.search.init();
  app.menu.init();
  app.keys.init();
  app.overlay.init();

   Listen to keys, close menu if visible
  document.addEventListener(keyup, (e) = { if (e.keyCode == app.keys.ESC) app.keys.handleESC() });
    
  document.addEventListener(keydown, (e) = {
    if (e.keyCode == app.keys.arrowUp) app.keys.handleArrowUp(e);
    else if (e.keyCode == app.keys.arrowDown) app.keys.handleArrowDown(e);
    else if (e.keyCode == app.keys.enter) app.keys.handleEnter(e);
  });

  window.addEventListener(scroll, app.animations.onlyPlayVisible);
});

app.search.init = () = {
   Exit if there's no search function on the page
  app.search.visible = false;
  app.search.storageKey = globalSearchData;
  var searchIcon = document.querySelector(.js-search);
  if (!searchIcon) return;

  app.search.searchIcon = searchIcon;
  app.search.loadData();

   React to menu events
  document.addEventListener(appmenuDidHide, app.search.showIcon);
  document.addEventListener(appmenuWillShow, app.search.hideIcon);
   Click handlers
  document.querySelector(.js-search).addEventListener(click, (e) = {
    e.preventDefault();
    !app.search.visible  app.search.reveal(e)  app.search.hide();
  });
   When searching
  document.querySelector(.js-search-input).addEventListener(input, (e) = {
    app.search.updateResultsForQuery(e.target.value);
  });
}

app.search.loadData = () = {
   Check if data already exists, if so load it instead
  var cachedData = localStorage.getItem(app.search.storageKey);
  if (cachedData) {
    var data = JSON.parse(cachedData);
    app.search.data = data[items];
    return;
  }

   If not, cache this with local storage and don't fetch on every page load
  fetch(jssearchable.json).then(response = {
    return response.json();
  }).then((data) = {
    localStorage.setItem(app.search.storageKey, JSON.stringify(data));
    app.search.data = data[items];
  }).catch((err) = {
     Handle error
  });
}

app.search.updateResultsForQuery = (query) = {
  query = query.toLowerCase();
  var hits = [];
   Look through all items
  for (var i = 0; i  app.search.data.length; i++) {
     For every item, look for hits
    var entryValues = Object.values(app.search.data[i]);
    var searchString = entryValues.join( ).toLowerCase();
    var hit = searchString.indexOf(query);
     Store new hit
    if (hit == -1) continue;
    hits.push(app.search.data[i]);
  }
  
  app.search.renderResults(hits, query);
}

app.search.renderResults = (results, query) = {
  var searchElements = document.createElement(div);
  searchElements.classList.add(site-search-content-results-list);

  for (var i = 0; i  results.length; i++) {
     Create link
    var newResult = document.createElement(a);
     Add active if first row
    var rowClass = site-search-results-item js-site-search-results-item;
    if (i == 0) rowClass +=  site-search-results-item-active;
    newResult.classList = rowClass;
    newResult.href = results[i][url];
    newResult.textContent = results[i][title];

     Create span and append to link
    var linkSpan = document.createElement(span);
    linkSpan.classList = site-search-results-item-description;
    linkSpan.textContent = results[i][description];
    newResult.appendChild(linkSpan);
     Append row to results
    searchElements.appendChild(newResult);
  }
   If length is 0, add a placeholder saying you found nothing
  if (results.length == 0) {
    var noResult = document.createElement(span);
    noResult.classList = site-search-results-item site-search-results-item-message;
    noResult.textContent = 'No hits for ' + query + '';
    searchElements.appendChild(noResult);
  }
   Update HTML
  var results = document.querySelector(.js-site-search-content-results);
  results.innerHTML = ;
  results.appendChild(searchElements);

   Update mouseenter event to move focus to hovered item
  for (let resultsItem of document.querySelectorAll(.js-site-search-results-item)) {
    resultsItem.addEventListener(mouseenter, (e) = app.search.focusItem(e.target));
  }
}

app.menu.init = () = {
  app.menu.visible = false;
  app.menu.icon = document.querySelector(.menu);
   Top menu
  app.menu.icon.addEventListener(click, (e) = {
    e.preventDefault();
    !app.menu.visible  app.menu.reveal(e)  app.menu.hide();
  });
}

app.menu.toggleStates = () = {
  document.querySelector('body').classList.toggle('no-scroll');
  app.menu.icon.classList.toggle('menu-active');
  document.querySelector('.js-nav').classList.toggle('site-nav-active');
}

app.search.toggleStates = () = {
  document.querySelector('body').classList.toggle('no-scroll');
  document.querySelector('.js-search-overlay').classList.toggle('site-nav-active');
}

app.menu.reveal = (e) = {
  app.menu.visible = true;
  app.menu.toggleStates();
  document.dispatchEvent(new Event(appmenuWillShow));

  app.overlay.show({
    position app.clickPosition(e),
    fill #1f4954
  });

  var containerDelay = 200;
  anime({
    targets'.js-nav',
    opacity [0, 1],
    delay containerDelay,
    easing easeInOutExpo,
    duration 200
  });

  var menuItemDelay = 90;
  containerDelay += 75;
  document.querySelector(.js-nav-header).style.opacity = 0;
  anime({
    targets .js-nav-header,
    opacity [0,1],
    delay containerDelay,
    easing easeInOutExpo,
    duration 200
  });
  document.querySelector(.js-nav-header-line).style.transform.replace(scale([0-9.]), 'scale(0.2)');
  anime({
    targets'.js-nav-header-line',
    scaleX [0.28, 1],
    delay containerDelay,
    easing easeInOutExpo,
    duration 600
  });
  containerDelay += 350;

  for (let animated of document.querySelectorAll(.js-nav-animate)) {
    animated.style.opacity = 0;
    animated.style.transform.replace(scale([0-9.]), 'scale(0.9)');
  }

  anime({
    targets '.js-nav-animate',
    translateY [-7px, 0],
    scale [0.9, 1],
    opacity [0, 1],
    delay (el, i) = containerDelay + menuItemDelay  (i+1),
    duration 1100,
    easing easeOutExpo,
    complete () = { document.dispatchEvent(new Event('appmenuDidReveal')) }
  });
}

app.search.reveal = (e, ) = {
  app.search.toggleStates();
  app.search.visible = true;
  app.menu.hideMenuIcon();

  app.overlay.show({
    position app.clickPosition(e),
    fill #1f4954
  });

   Hide search icon and show X
  var searchIconDuration = 400;
  var searchIconDelay = 200;
   Hide Search icon
  anime({
    targets '.site-search-icon',
    translateY -5px,
    rotate 90,
    duration searchIconDuration,
    scale 0,
    easing 'easeOutExpo',
    delay searchIconDelay
  });
   Show close icon
  anime({
    targets '.site-search-close-icon',
    opacity 1,
    scale [0,1],
    duration searchIconDuration,
    easing 'easeOutExpo',
    delay searchIconDelay
  });

  anime({
    targets '.site-search-close-icon-line-1',
    rotateZ [45, 225],
    duration searchIconDuration,
    easing 'easeOutExpo',
    delay searchIconDelay
  });

  anime({
    targets '.site-search-close-icon-line-2',
    rotateZ [45, 135],
    duration searchIconDuration,
    easing 'easeOutExpo',
    delay searchIconDelay
  });

  document.querySelector(.js-search-input).style.opacity = 0;
  anime.timeline().add({
    targets'.js-search-overlay',
    opacity [0, 1],
    delay 200,
    easing easeInOutExpo,
    duration 200
  }).add({
    targets '.js-search-input',
    opacity [0,1],
    easing easeOutExpo,
    translateX [25px, 0],
    duration 700
  });
   Focus on input field
  document.querySelector(.js-search-input).focus();
}

app.search.moveSelectionInDirection = (options) = {
   Find index of current focus
  var activeSelection = document.querySelector(.site-search-results-item-active);
  if (!activeSelection) return;
  var newSelection = options.direction === up  activeSelection.previousElementSibling  activeSelection.nextElementSibling;
   Select next item (if any)
  if (newSelection == null) return;
  activeSelection.classList.remove(site-search-results-item-active);
  newSelection.classList.add(site-search-results-item-active);
}

app.search.moveSelectionUp = () = app.search.moveSelectionInDirection({direction up});
app.search.moveSelectionDown = () = app.search.moveSelectionInDirection({direction down});

app.search.focusItem = (item) = {
  document.querySelector(.site-search-results-item-active).classList.remove(site-search-results-item-active);
  item.classList.add(site-search-results-item-active);
}

app.search.goToSelectedItem = () = {
  var activeItem = document.querySelector(.site-search-results-item-active);
  if (!activeItem) return;
  window.location.href = activeItem.getAttribute(href);
}

app.search.hide = () = {
  app.search.toggleStates();
  app.search.visible = false;
  var searchIconDuration = 400;
  var searchIconDelay = 200;

  app.overlay.hide({
    position app.overlay.lastStartingPoint,
    fill #1f4954,
    complete () = app.menu.showMenuIcon()
  });

  anime({
    targets '.js-search-input',
    opacity [1,0],
    easing easeInExpo,
    duration 400,
    translateX [0, 25px]
  });

  anime({
    targets'.js-search-overlay',
    opacity [1, 0],
    delay 200,
    easing easeInOutExpo,
    duration 200
  });

   Animate the cross
  anime({
    targets '.site-search-close-icon',
    opacity [1,0],
    scale 0,
    duration searchIconDuration,
    easing 'easeOutExpo',
    delay searchIconDelay
  });

  anime({
    targets '.site-search-close-icon-line-1',
    rotateZ [225, 45],
    duration searchIconDuration,
    easing 'easeOutExpo',
    delay searchIconDelay
  });

  anime({
    targets '.site-search-close-icon-line-2',
    rotateZ [135, 45],
    duration searchIconDuration,
    easing 'easeOutExpo',
    delay searchIconDelay
  });

  anime({
    targets '.site-search-icon',
    translateY [-5px, 0px],
    rotate [90,0],
    duration searchIconDuration,
    opacity [0,1],
    scale [0,1],
    easing 'easeOutExpo',
    delay searchIconDelay
  });
}

app.menu.hide = () = {
  app.menu.visible = false;
  app.menu.toggleStates();
  document.dispatchEvent(new Event(appmenuWillHide));

  app.overlay.hide({
    position app.overlay.lastStartingPoint,
    fill #1f4954,
    complete () = document.dispatchEvent(new Event(appmenuDidHide))
  });

  anime({
    targets'.js-nav',
    opacity [1, 0],
    easing easeInOutExpo,
    duration 200
  });

  anime({
    targets'.js-nav-header-line',
    scale [1, 0.5],
    easing easeInExpo,
    duration 300
  });

  anime({
    targets '.js-nav-animate',
    translateY 10px,
    scale [1, 0.9],
    opacity [1, 0],
    easing easeInExpo,
    duration 200
  });
}

app.menu.hideMenuIcon = () = {
  app.menu.icon.style.display = none;
}

app.menu.showMenuIcon = () = {
  app.menu.icon.style.opacity = 0;
  app.menu.icon.style.display = ;
  anime({
    targets '.menu',
    opacity 1,
    duration 500,
    easing 'easeOutQuart'
  });
}

app.search.hideIcon = () = {
  if (!app.search.searchIcon) return;
  app.search.searchIcon.style.display = none;
}

app.search.showIcon = () = {
  if (!app.search.searchIcon) return;
  app.search.searchIcon.style.opacity = 0;
  app.search.searchIcon.style.display = ;
  anime({
    targets .js-search,
    opacity 1,
    duration 500,
    easing 'easeOutQuart'
  });
}

app.keys.handleESC = () = {
  document.dispatchEvent(new Event(pressedESC));
  if (app.menu.visible) {
    app.menu.hide();
    return;
  }
  if (app.search.visible) {
    app.search.hide();
    return;
  }
}

 Keyboard Key handling
app.keys.init = () = {
  app.keys.ESC = 27;
  app.keys.arrowUp = 38;
  app.keys.arrowDown = 40;
  app.keys.enter = 13;
}

app.keys.handleArrowUp = (e) = {
  if (app.search.visible) {
    e.preventDefault();
    app.search.moveSelectionUp();
  }
}

app.keys.handleArrowDown = (e) = {
  if (app.search.visible) {
    e.preventDefault();
    app.search.moveSelectionDown();
  }
}

app.keys.handleEnter = (e) = {
  if (app.search.visible) {
    e.preventDefault();
    app.search.goToSelectedItem();
  }
}

 Management of animations
app.animations.track = (animeTimeline, el) = {
   Add object to list of tracked animations
  app.animations.tracked.push({
    timeline animeTimeline, 
    element el
  });
}

app.animations.onlyPlayVisible = () = {
  app.animations.tracked.forEach((animation) = {
    app.animations.shouldPlay(animation)  animation.timeline.play()  animation.timeline.pause();
  });
}

app.animations.shouldPlay = (animation) = {
  var winHeight = window.innerHeight;
  var bounds = animation.element.getBoundingClientRect();
  var offset = 5;  Greater offset - animations will play less often

   Check if bottom of animation is above view or if top of animation is below view
  if (bounds.bottom  0+offset  bounds.top  winHeight-offset) return false;
   Default to true
  return true;
}

app.overlay.init = () = {
  app.overlay.c = document.querySelector(.site-nav-canvas);
  app.overlay.ctx = app.overlay.c.getContext(2d);
  app.overlay.cH;
  app.overlay.cW;
  app.overlay.bgColor = transparent;
  app.overlay.resizeCanvas();
  app.overlay.lastStartingPoint = {x 0, y 0};

  window.addEventListener(resize, app.overlay.resizeCanvas);
}

app.overlay.resizeCanvas = function() {
  app.overlay.cW = window.innerWidth;
  app.overlay.cH = window.innerHeight;
  app.overlay.c.width = app.overlay.cW  window.devicePixelRatio;
  app.overlay.c.height = app.overlay.cH  window.devicePixelRatio;
  app.overlay.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  app.overlay.ctx.fillStyle = app.overlay.bgColor;
  app.overlay.ctx.fillRect(0, 0, app.overlay.cW, app.overlay.cH);
}

app.overlay.show = function(options) {
  app.overlay.c.style.display = block;
  app.overlay.lastStartingPoint = options.position;

  options.targetRadius = app.overlay.calcPageFillRadius(options.position.x, options.position.y);
  options.startRadius = 0;
  options.easing = easeOutQuart;
  app.overlay.animate(options);
}

 Hide the overlay. Args
 fill color to animate with
 position position to target as the circle shrinks
 complete completion callback
app.overlay.hide = (options) = {
  options.targetRadius = 0;
  options.easing = easeInOutQuart;

  var callback = options.complete;
  options.complete = () = { 
    app.overlay.c.style.display = none;
    app.overlay.bgColor = transparent;
    if (callback) callback();
  };

  options.startRadius = app.overlay.calcPageFillRadius(options.position.x, options.position.y);
  app.overlay.animate(options);
}

 Animate from one size to another. Args
 position {x, y}
 fill color 
 startRadius number
 targetRadius number
 complete callback method
app.overlay.animate = (options) = {
  var minCoverDuration = 750;
  app.overlay.bgColor = options.fill;
  
  app.overlay.circle.x = options.position.x;
  app.overlay.circle.y = options.position.y;
  app.overlay.circle.r = options.startRadius;
  app.overlay.circle.fill = options.fill;

  anime({
    targets app.overlay.circle,
    r options.targetRadius,
    duration  Math.max(options.targetRadius2, minCoverDuration),
    easing options.easing,
    complete options.complete  options.complete  null,
    update () = app.overlay.circle.draw({
      startRadius options.startRadius,
      targetRadius options.targetRadius
    })
  });
}

app.overlay.calcPageFillRadius = function(x, y) {
  var l = Math.max(x - 0, app.overlay.cW - x);
  var h = Math.max(y - 0, app.overlay.cH - y);
  return Math.sqrt(Math.pow(l, 2) + Math.pow(h, 2));
}

app.clickPosition = (e) = {
  if (e.touches) e = e.touches[0];

  if (e.clientX && e.clientY) return {
    x e.clientX, 
    y e.clientY
  }

   If there was no clientX and Y set, use the center position of
   the target as a backup
  var rect = e.target.getBoundingClientRect();
  return {
    x rect.top + (rect.bottom - rect.top)2,
    y rect.left + (rect.right - rect.left)2
  }
}

app.overlay.circle = {};

app.overlay.circle.draw = function(options) {
  if (options.targetRadius  options.startRadius) {
    app.overlay.ctx.clearRect(0,0, app.overlay.cW, app.overlay.cH);
  }

  app.overlay.ctx.beginPath();
  app.overlay.ctx.arc(this.x, this.y, this.r, 0, 2  Math.PI, false);
  app.overlay.ctx.fillStyle = this.fill;
  app.overlay.ctx.fill();
  app.overlay.ctx.closePath();
}