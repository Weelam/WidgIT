// e1.tml
'use strict';
// all the images and videos are widgets
const images = document.querySelectorAll("img");
const videos = document.querySelectorAll("video")
const otherWidgets = document.querySelectorAll(".other-widgets")

console.log(images, videos)

// assign a the class name widgit-widget to whatever element you desire
images.forEach(images => {
    images.classList.add("widgit-widget");
})

videos.forEach(video => {
    video.classList.add("widgit-widget");
})

otherWidgets.forEach(otherWidget => {
    otherWidget.classList.add("widgit-widget");
})

// limitations
// resizing only works on the widget itself
// In order for the childrens to work as well, users must specify the height relative to the widget container 
// But, this is more of a general rule I'm going to enforce

