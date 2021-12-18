"use strict";
// all the images and videos are widgets
// const images = document.querySelectorAll(".widgit-img");
const images = document.querySelectorAll("img");
const videos = document.querySelectorAll("video");
const otherWidgets = document.querySelectorAll(".other-widgets");
const steve = document.querySelector(".steve");
// document.querySelectorAll('*').style.boxSizing = "border-box";

// It is up to the developer to how they want to let the client know an element is "widgetable". In thie case we will lower the
// opacity of the elements on hover, and change the background color to #ddd. Please do this with classes only.
images.forEach((image) => {
  // call createWidget(element) to turn that element into a widget
  let imageWidget = createWidget(image);
  imageWidget.setIdentifier("widgit-widget");
});

videos.forEach((video) => {
  let videoWidget = createWidget(video);
  videoWidget.setIdentifier("widgit-widget");
});

otherWidgets.forEach((otherWidget) => {
  let otherWidgetObj = createWidget(otherWidget);
  otherWidgetObj.setIdentifier("widgit-widget");
});

// set hold down time (in ms) default is .5s
// setHoldDownTime(2000)

// set open and close animation speed of the menu (default is 1s)
setMenuOpenAnimationSpeed(2)
setMenuCloseAnimationSpeed(2)