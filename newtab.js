'use strict';
var list = document.querySelector('.list');
var sites = [];
var optionsLink = document.querySelector('.options-link');

var initField = function(field){
  field.addEventListener('keydown', handleKeydown, true);
};

var handleKeydown = function(e){
  if(e.keyCode === 13){
    search(e.target);
  }
};

var search = function(field){
  var site = field.parentNode.getAttribute('data-site');
  var siteStr = '';

  if(site != 'google.com')
    siteStr = 'site:'+ site + '+'

  window.location = 'https://www.google.com/#q=' + siteStr + field.value;
};

var openOptions = function(){
  if (chrome.runtime.openOptionsPage) {
    // New way to open options pages, if supported (Chrome 42+).
    chrome.runtime.openOptionsPage();
  } else {
    // Reasonable fallback.
    window.open(chrome.runtime.getURL('options.html'));
  }
};

function restoreOptions(){
  chrome.storage.sync.get({
    sites: ['google.com']
  }, function(items) {
    sites = items.sites;
    updateSitesList();
  });
}

function updateSitesList(){
  for (var i = sites.length - 1; i >= 0; i--) {
    var site = sites[i];
    var article = document.createElement('article');
    var label = document.createElement('label');
    var img = document.createElement('img');
    var field = document.createElement('input');
    var id = 'f_' + i;
    var re = /\/$/;
    var cleanedSite = site.replace(re, '');

    article.classList.add('field-wrap');
    article.setAttribute('data-site', site);

    img.setAttribute('src', 'https://plus.google.com/_/favicon?domain=' + site);
    img.setAttribute('width', 16);
    img.setAttribute('height', 16);

    label.setAttribute('for', id);
    label.appendChild(img);
    label.appendChild(document.createTextNode(cleanedSite));

    field.id = id;
    field.classList.add('field');
    field.setAttribute('type', site);
    field.setAttribute('name', 'search');
    field.setAttribute('placeholder', 'Search...');


    article.appendChild(label);
    article.appendChild(field);

    list.appendChild(article);
    initField(article);
  };
}

document.addEventListener('DOMContentLoaded', restoreOptions);
optionsLink.addEventListener('click', openOptions, true);