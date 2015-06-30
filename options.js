var field = document.querySelector('.field');
var addButton = document.querySelector('.add-site');
var sites = [];
var list = document.querySelector('.sites-list');

// Saves options to chrome.storage.sync.
function saveSites() {
  if(sites.length){
    chrome.storage.sync.set({
      sites: sites,
    }, function(){
      field.value = '';
      updateSitesList();
    });
  } else {
    chrome.storage.sync.remove('sites');
  }
}

function addSite(){
  var domain = field.value;
  var re = /https?:\/\//;
  domain = domain.replace(re, '');
  sites.push(domain);
  saveSites();
};

function removeSite(){
  var li = this.parentNode;
  list.removeChild(li);

  var items = document.querySelectorAll('.sites-list li');
  sites = [];
  for (var i = items.length - 1; i >= 0; i--) {
    sites.push(items[i].getAttribute('data-domain'));
  };

  saveSites();
}

function moveUp(i){
  a = sites[i + 1];
  b = sites[i];

  sites[i + 1] = b;
  sites[i] = a;

  saveSites();
}

function moveDown(i){
  a = sites[i - 1];
  b = sites[i];

  sites[i - 1] = b;
  sites[i] = a;

  saveSites();
}

function restoreOptions(){
  chrome.storage.sync.get({
    sites: ['google.com']
  }, function(items) {
    sites = items.sites;
    updateSitesList();
  });
}

function updateSitesList(){
  list.innerHTML = '';

  for (var i = sites.length - 1; i >= 0; i--) {
    var site = sites[i];
    var li = document.createElement('li');
    var removeButton = document.createElement('button');

    li.textContent = site;
    li.setAttribute('data-domain', site);
    list.appendChild(li);

    removeButton.innerHTML = '&times;';
    removeButton.addEventListener('click', removeSite);
    li.appendChild(removeButton);

    if(i != 0){
      var downButton = document.createElement('button');
      downButton.innerHTML = '&darr;';
      downButton.addEventListener('click', moveDown.bind(undefined, i));
      li.appendChild(downButton);
    }

    if(i != sites.length - 1){
      var upButton = document.createElement('button');
      upButton.innerHTML = '&uarr;';
      upButton.addEventListener('click', moveUp.bind(undefined, i));
      li.appendChild(upButton);
    }
  };
}

addButton.addEventListener('click', addSite);

field.addEventListener('keydown', function(e){
  if(e.keyCode === 13)
    addSite();
});

document.addEventListener('DOMContentLoaded', restoreOptions);