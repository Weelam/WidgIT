"use strict";

// ************************* landing page stuff ***************************
let topTab = 0;
let tabs = ["0", "0", "0", "0", "0", "0", "0"];

const updateTopTab = () => {
  const mainTab = document.querySelector(".home-mainTab");
  const examples = document.querySelector(".examples");
  const documentation = document.querySelector(".documentation");
  if (topTab === "0") {
    examples.style.display = "block";
    documentation.style.display = "none";
  } else {
    examples.style.display = "none";
    documentation.style.display = "block";
  }
  mainTab.querySelectorAll("*").forEach((item) => {
    if (item.tagName === "LI") {
      if (item.getAttribute("index") === topTab) {
        item.classList.add("is-active");
      } else {
        item.classList.remove("is-active");
      }
    }
  });
};

// if topTab === 0 examples shows, else documentation shows
const mainTab = document.querySelector(".home-mainTab");
mainTab.querySelectorAll("*").forEach((item) => {
  if (item.tagName === "LI") {
    item.addEventListener("click", () => {
      topTab = item.getAttribute("index");
      updateTopTab();
    });
  }
});

// updateCodeDisplay will change what's actually displayed for the code
const updateCodeDisplay = () => {
  const exampleCodes = document.querySelectorAll(".examples-code");

  exampleCodes.forEach((item) => {
    const outerIndex = item.getAttribute("index");

    item.querySelectorAll("*").forEach((item2) => {
      const selectedTab = tabs[outerIndex];
      if (item2.tagName === "PRE") {
        const innerIndex = item2.getAttribute("index");

        if (selectedTab !== innerIndex) {
          item2.style.display = "none";
        } else {
          item2.style.display = "block";
          console.log(item2);
        }
      }
    });
  });
};

// update tab will change the class display and then clal updateCodeDisplay
const updateTab = () => {
  const exampleCodes = document.querySelectorAll(".examples-code");

  exampleCodes.forEach((item) => {
    const outerIndex = item.getAttribute("index");

    item.querySelectorAll("*").forEach((item2) => {
      const selectedTab = tabs[outerIndex];
      if (item2.tagName === "LI") {
        if (item2.getAttribute("index") === selectedTab) {
          item2.classList.add("is-active");
        } else {
          item2.classList.remove("is-active");
        }
      }
    });
  });

  updateCodeDisplay();
};

// will call updateTab after updating the tabs array
const tabListener = (item2, outerIndex) => {
  const innerIndex = item2.getAttribute("index");
  tabs[outerIndex] = innerIndex;
  console.log(tabs);
  updateTab();
};

// listens for tab changes
const addTabListener = () => {
  const exampleCodes = document.querySelectorAll(".examples-code");

  exampleCodes.forEach((item) => {
    const outerIndex = item.getAttribute("index");

    item.querySelectorAll("*").forEach((item2) => {
      if (item2.tagName === "LI") {
        item2.addEventListener("click", () => tabListener(item2, outerIndex));
      }
    });
  });
};

addTabListener();

const scrollButton = document.querySelector(".home-scrollButton");
scrollButton.addEventListener("click", () => {
  const homeBottom = document.querySelector(".home-bottom");
  homeBottom.scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "nearest",
  });
});

// ************************* widget stuff ***************************
const widgits = document.querySelectorAll(".examples-widgit-1");

widgits.forEach((widgit) => {
  let widget = createWidget(widgit);
  widget.setIdentifier("widgit-widget");
});

const star = document.querySelector(".examples-widgit-star");
const green = document.querySelector(".examples-widgit-green");

let starWidget = createWidget(star);
starWidget.setIdentifier("widgit-widget");

let greenWidget = createWidget(green);
greenWidget.setIdentifier("widgit-widget2");

// all the images and videos are widgets
// const images = document.querySelectorAll(".widgit-img");
// const images = document.querySelectorAll("img");
// const videos = document.querySelectorAll("video");
// const otherWidgets = document.querySelectorAll(".other-widgets");
// const steve = document.querySelector(".steve");
// document.querySelectorAll('*').style.boxSizing = "border-box";

// It is up to the developer to how they want to let the client know an element is "widgetable". In thie case we will lower the
// opacity of the elements on hover, and change the background color to #ddd. Please do this with classes only.
// images.forEach((image) => {
//   // call createWidget(element) to turn that element into a widget
//   let imageWidget = createWidget(image);
//   imageWidget.setIdentifier("widgit-widget");
// });

// videos.forEach((video) => {
//   let videoWidget = createWidget(video);
//   videoWidget.setIdentifier("widgit-widget");
// });

// otherWidgets.forEach((otherWidget) => {
//   let otherWidgetObj = createWidget(otherWidget);
//   otherWidgetObj.setIdentifier("widgit-widget");
// });

// set hold down time (in ms) default is .5s
// setHoldDownTime(2000)

// set open and close animation speed of the menu (default is 1s)
