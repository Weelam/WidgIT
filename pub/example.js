"use strict";

// ************************* landing page stuff ***************************
let tabs = ["0", "0", "0", "0", "0", "0", "0"];

const updateCodeDisplay = () => {
  const exampleCodes = document.querySelectorAll(".example-code");

  exampleCodes.forEach((item) => {
    const outerIndex = item.getAttribute("index");

    item.querySelectorAll("*").forEach((item2) => {
      const selectedTab = tabs[outerIndex]
      if (item2.tagName === "CODE") {
        const innerIndex = item2.getAttribute("index");

        if (selectedTab !== innerIndex) { 
          item2.style.display = "none";
        } else {
          item2.style.display = "block"
          console.log(item2)

        }
      }
    });
})}

const updateTab = () => {
  const exampleCodes = document.querySelectorAll(".example-code");

  exampleCodes.forEach((item) => {
    const outerIndex = item.getAttribute("index");

    item.querySelectorAll("*").forEach((item2) => {
      const selectedTab = tabs[outerIndex]
      if (item2.tagName === "LI") {
        if (item2.getAttribute("index") === selectedTab) {
          item2.classList.add("is-active")

        } else {
          item2.classList.remove("is-active")
        }
      }
    });
  });

  updateCodeDisplay();
};

const tabListener = (item2, outerIndex) => {
  const innerIndex = item2.getAttribute("index");
  tabs[outerIndex] = innerIndex;
  console.log(tabs)
  updateTab()
}

const addTabListener = () => {
  const exampleCodes = document.querySelectorAll(".example-code");

  exampleCodes.forEach((item) => {
    const outerIndex = item.getAttribute("index");

    item.querySelectorAll("*").forEach((item2) => {
      if (item2.tagName === "LI") {
        item2.addEventListener("mousedown", () => tabListener(item2, outerIndex))
      }
    });


  });
}

addTabListener();

// ************************* widget stuff ***************************
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
