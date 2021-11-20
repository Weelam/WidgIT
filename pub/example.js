'use strict';
// all the images and videos are widgets
const images = document.querySelectorAll("img");
const videos = document.querySelectorAll("video")
const otherWidgets = document.querySelectorAll(".other-widgets")

// It is up to the developer to how they want to let the client know an element is "widgetable". In thie case we will lower the 
// opacity of the elements on hover, and change the background color to #ddd. Please do this with classes only. 
images.forEach(image => {
    // call createWidget(element) to turn that element into a widget
    createWidget(image)
    // setWidgetIdentity(element, className) to set an class that will notify user which element is a widget
    setWidgetIdentity(image, "widgit-widget")
})

videos.forEach(video => {
    createWidget(video)
    setWidgetIdentity(video, "widgit-widget")
})

otherWidgets.forEach(otherWidget => {
    createWidget(otherWidget)    
    setWidgetIdentity(otherWidget, "widgit-widget")
})

// limitations
// resizing only works on the widget itself
// In order for the childrens to work as well, users must specify the height relative to the widget container 
// But, this is more of a general rule I'm going to enforce

