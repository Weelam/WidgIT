"use strict";
// inline styles, since they have higher priority
(function (global, document, $) {
  const widgetStyleDragging = `
	animation: popAnimation 0.8s ease forwards, jiggle .1s ease-in-out infinite alternate; 
	opacity: 0.5;
  box-sizing: border-box;
	`;

  const wrapperStyleDragging = `
  animation: popAnimation-wrapper 0.8s ease forwards; 
  box-sizing: border-box;
`;

  const widgetStyle = `
  background-color: #F8F5F2;
  border-radius: 10px;
  z-index: 10;
  box-shadow: 0 0 3px black;
  margin: 0;
  overflow-y: scroll;
  
`;
  const resizerStyle = `
	position: absolute;
	background-color: transparent;
	z-index: 999999999999999;
	width: 1.4rem;
	height: 1.4rem;
`;

  const resizerStyle_nw = `
	cursor: nw-resize;
	top: 0px;
	left: 0px;
`;

  const resizerStyle_ne = `
	cursor: ne-resize;
	top: 0px;
	right: 0px;
`;

  const resizerStyle_sw = `
	cursor: sw-resize;
	bottom: 0px;
	left: 0px;

`;

  const resizerStyle_se = `
	cursor: se-resize;
	bottom: 0px;
	right: 0px;

`;
  const taskbarStylePositioner = `
	position: absolute;
	height: 100%;
	width: 100%;
	z-index: 99999999999;
`;

  const taskbarStyle = `
  height: auto;
  position: absolute;
  width: 100px;
  z-index: 1;
  top: 0px;
  right: -110px;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  overflow: hidden;
  background: #b3a9e2;
  animation: slideIn 1s forwards;
`;

  const taskBarButtonStyle = `
  background: none;
  border-style: none;
  color: white;
  padding: .5rem .5rem;
`;

  const removeTaskBarStyle = `
  animation: slideOut 1s forwards;
`;

  const removeWidgetStyle = ` 
  animation: popAnimation-remove 0.3s ease forwards; 

`;

  const expandButtonStyle = ` 
  height: 10%;
  width: 15px;
  position: absolute;
  right: -15px;
  top: 5px;
  padding: 0;
  margin: 0;
  border: none;
	padding: 0;
	font: inherit;
	outline: inherit;
`;

  // actual code -----------------------------------------------------------------------------------------------

  // object
  class Widget {
    constructor(widget) {
      this.original = widget;
      this.widgetIdentifierClass = "";
      this.clones = [];
    }

    setIdentifier(className) {
      this.original.classList.add(className);
      this.widgetIdentifierClass = className;
    }

    getClones() {
      return this.clones;
    }

    addClone(clone) {
      this.clones.push(clone);
    }

    removeClone(clone) {
      let index = this.clones.indexOf(clone);
      if (index > -1) {
        this.clones.splice(index, 1);
      }
    }
  }

  // [Widget...] -> stores widget objects
  let widgetObjects = [];
  let timeout_id;
  let resizing = false;
  let holdDownTime;
  let slideInDuration = 1;
  let slideOutDuration = 1;

  const resizes = ["widgit-se", "widgit-sw", "widgit-ne", "widgit-nw"];

  // instantiate the widget object and add it to widgetObjects array
  const createWidget = (widget) => {
    let newObj = new Widget(widget);
    widgetObjects.push(newObj);

    // add event listeners
    setupWidget(newObj);
    // return the object to the dev so they can access the methods

    return newObj;
  };

  // set up widget
  const setupWidget = (widgetObject) => {
    const widget = widgetObject.original;
    // when mouse is down
    widget.addEventListener("mousedown", (e) =>
      handleMouseDown(e, widget, widgetObject)
    );

    // reset widget timeout
    widget.addEventListener("mouseup", () => resetTimeout(timeout_id));
    widget.addEventListener("mouseleave", () => resetTimeout(timeout_id));
  };

  // set hold down time for a widget (default is .5s)
  const setHoldDownTime = (duration) => {
    holdDownTime = duration;
  };

  // change slide in animation duration
  const setMenuOpenAnimationSpeed = (duration) => {
    slideInDuration = duration;
  };

  // change slide in animation duration
  const setMenuCloseAnimationSpeed = (duration) => {
    slideOutDuration = duration;
  };

  const handleMouseDown = (e, widget, widgetObject) => {
    if (!resizing) {
      timeout_id = setTimeout(() => {
        
        const isClone = widget.getAttribute("clone");
        // note: we don't know if "widget" is a clone or not
        if (!isClone) {
          
          widget = cloneWidget(widget, widgetObject);
          console.log(widget.clientHeight, widget.clientWidth)

          addResizer(widget);
          
        }
        const wrapper = widget.parentNode;

        // add widget styles
        widget.style.cssText += widgetStyle + widgetStyleDragging;
        widget.classList.add("widgit-hideScroll");
        // widget.add.classList("widget-widgitStyle")
        wrapper.style.cssText += wrapperStyleDragging;
        widget.setAttribute("draggable", false);
        wrapper.setAttribute("draggable", false)
        widget.style.cursor = "move";
        // add wrapper styles
        console.log(widget.clientHeight, widget.clientWidth)
        wrapper.style.height = widget.clientHeight + "px";
        wrapper.style.width = widget.clientWidth + "px";
        // this only happens when we mouse down
        let x1 = e.clientX;
        let y1 = e.clientY;

        const handleMouseMove = (e) => {
          let x2 = e.clientX - x1;
          let y2 = e.clientY - y1;

          // we must change the positioning of the widget relative to the wrapper's positioning
          // this is because the widget itself will mess with the positioning when dragging for some unknown reason
          const bounding = wrapper.getBoundingClientRect();

          // rather than reassigning the position to your cursor location, we are updating the position properties instead
          // through adding an subtracting x2 and y2. By doing so, the element doesn't teleporate to your cursor position
          // when you start dragging.
          widget.style.left = bounding.left + x2 + "px";
          widget.style.top = bounding.top + y2 + "px";
          // must also update the wrapper's location in the same why since we're taking the boundClientRect of the wrpaper
          wrapper.style.left = bounding.left + x2 + "px";
          wrapper.style.top = bounding.top + y2 + "px";

          // need to reassign since clientX and clientY is always changing whenever we move
          x1 = e.clientX;
          y1 = e.clientY;
        };

        const handleMouseUp = () => {
          window.removeEventListener("mousemove", handleMouseMove);
          window.removeEventListener("mouseup", handleMouseUp);
          widget.classList.remove("widgit-dragging");
          widget.style.opacity = null;
          widget.style.animation = null;
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
      }, holdDownTime || 500);
    }
  };

  // helper functions
  const handleRemoveWidget = (wrapper, widget, widgetObject, taskbar) => {
    // applay the animation and then remove
    wrapper.style.animation = null;
    widget.style.cssText += removeWidgetStyle;
    taskbar.style.cssText += removeWidgetStyle;
    wrapper.addEventListener("animationend", () => {
      // remove widget
      widgetObject.removeClone(widget);
      wrapper.remove();
    });
  };

  const openTaskBar = (wrapper, widget, widgetObject, setOpen) => {
    if (setOpen) {
      // create taskbar
      const originalWidget = widgetObject.original;
      const taskbar = document.createElement("div");
      taskbar.classList.add("widgit-taskbar");
      taskbar.setAttribute("taskbar", true);
      wrapper.append(taskbar);
      taskbar.style.cssText += taskbarStylePositioner + taskbarStyle;
      taskbar.style.animation = `slideIn ${slideInDuration}s forwards`;

      // remove button
      const removeWidget = document.createElement("button");
      removeWidget.innerHTML = "Remove widget";
      removeWidget.onclick = () => {
        handleRemoveWidget(wrapper, widget, widgetObject, taskbar);
      };
      removeWidget.style.cssText += taskBarButtonStyle;
      removeWidget.setAttribute("taskbar", true);
      taskbar.append(removeWidget);

      // scroll back button
      const scrollBack = document.createElement("button");
      scrollBack.innerHTML = "Scroll to widget";
      scrollBack.onclick = () => {
        originalWidget.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
      };
      scrollBack.setAttribute("taskbar", true);
      scrollBack.style.cssText += taskBarButtonStyle;
      taskbar.append(scrollBack);
      // close button
      const closeButton = document.createElement("button");
      closeButton.innerHTML = "Close menu";
      closeButton.onclick = () => {
        taskbar.style.cssText += removeTaskBarStyle;
        taskbar.style.animation = `slideOut ${slideOutDuration}s forwards`;
      };
      closeButton.style.cssText += taskBarButtonStyle;
      closeButton.setAttribute("taskbar", true);
      taskbar.append(closeButton);
    } else {
      let taskbarElement;
      let wrapperArray = [...wrapper.children];
      wrapperArray.forEach((element) => {
        if (element.getAttribute("taskbar")) {
          taskbarElement = element;
        }
      });
      taskbarElement.style.display = "flex";
    }
    addBorderBox();
  };

  const cloneWidget = (widget, widgetObject) => {
    const bodyNode = document.getElementsByTagName("body")[0];
    // clone node
    let widgetClone = widget.cloneNode(true);
    widgetClone.setAttribute("clone", true);
    
    widgetClone.classList.remove(widgetObject.widgetIdentifierClass); // this is to remove the identifier class for the original element
    
    bodyNode.append(widgetClone);
    // set widgetclone height because it gets messed up after we append it to the body
    widgetClone.style.height = widget.clientHeight + "px";
    widgetClone.style.width = widget.clientWidth + "px";
    // wrap clone inside div
    const wrapper = document.createElement("div");
    wrapper.appendChild(widgetClone);
    bodyNode.appendChild(wrapper);

    widgetClone.addEventListener("mousedown", (e) =>
      handleMouseDown(e, widgetClone, widgetObject)
    );

    widgetObject.addClone(widgetClone);
    
    // reset widget timeout
    widgetClone.addEventListener("mouseup", () => resetTimeout(timeout_id));
    widgetClone.addEventListener("mouseleave", () => resetTimeout(timeout_id));
    // widgetClone.addEventListener("click", () => widgetClone.remove())
    const bounding = widget.getBoundingClientRect();

    // must change wrapper's position in the same way since we'll be moving the element relative to the wrapper
    // and not the widget itself
    widgetClone.style.position = "fixed";
    wrapper.style.position = "fixed";
    addBorderBox();
    widgetClone.style.top = bounding.top + "px";
    widgetClone.style.left = bounding.left + "px";
    wrapper.style.top = bounding.top + "px";
    wrapper.style.left = bounding.left + "px";

    // add expand button
    const expandButton = document.createElement("button");
    expandButton.style.cssText += expandButtonStyle;
    expandButton.classList.add("widget-expandButtonClass");
    expandButton.setAttribute("expand", true);
    expandButton.innerHTML = ">";
    expandButton.onclick = () => {
      openTaskBar(wrapper, widgetClone, widgetObject, true);
    };
    wrapper.append(expandButton);
    console.log(widgetClone.clientHeight, widgetClone.clientWidth)

    return widgetClone;
  };

  const handleResizer = (widget, resizeNodes) => {
    const wrapper = widget.parentNode;
    // wrapper.style.border = "solid 1px black";
    resizeNodes.forEach((node) => {
      const handleResizeMouseDown = (e) => {
        let currentResizer = e.target;
        resizing = true;
        let x1 = e.clientX;
        let y1 = e.clientY;
        // loop through every single descendent and apply the style
        let descendents = Array.from(wrapper.getElementsByTagName("*"));
        descendents = descendents.filter(
          (descendent) => !descendent.getAttribute("taskbar")
        );
        const handleResizeMouseMove = (e) => {
          descendents.forEach((descendent) => {
            if (descendent === widget) {
              resize(descendent, currentResizer, x1, y1, e, wrapper);
            } else {
              resize(descendent, currentResizer, x1, y1, e, wrapper);
            }
          });
          x1 = e.clientX;
          y1 = e.clientY;
        };

        const handleResizeMouseUp = () => {
          window.removeEventListener("mousemove", handleResizeMouseMove);
          window.removeEventListener("mouseup", handleResizeMouseUp);
          resizing = false;
        };

        window.addEventListener("mousemove", handleResizeMouseMove);
        window.addEventListener("mouseup", handleResizeMouseUp);
      };
      node.addEventListener("mousedown", handleResizeMouseDown);
    });
  };

  const addWrapper = (elements) => {
    // wraps all elements in a div wrapper (used for all descendents except for the widget itself)
    elements.forEach((element) => {
      const wrapper = element.parentNode;
      const div = document.createElement("div");
      div.appendChild(element);
      wrapper.appendChild(div);
      div.setAttribute("wrapper", true);
    });
  };

  const addBorderBox = () => {
    // adds border box to all elements
    const allNodes = document.querySelectorAll("*");
    allNodes.forEach((node) => {
      node.style.boxSizing = "border-box";
    });
  };

  const resize = (element, currentResizer, x1, y1, e, wrapper) => {
    const bounding = wrapper.getBoundingClientRect();
    const x2 = e.clientX - x1;
    const y2 = e.clientY - y1;
    if (
      element.getAttribute("se") ||
      element.getAttribute("sw") ||
      element.getAttribute("ne") ||
      element.getAttribute("nw") ||
      element.getAttribute("expand")
    ) {
      return;
    }
    // before we introduced the idea of positioning relative to a wrapper, resizing was weird
    // now that we have a wrapper, it's good (must also update the width and height of the wrapper the same way as widget too)
    if (currentResizer.getAttribute("se")) {
      element.style.width = bounding.width + x2 + "px";
      element.style.height = bounding.height + y2 + "px";

      wrapper.style.width = bounding.width + x2 + "px";
      wrapper.style.height = bounding.height + y2 + "px";
    } else if (currentResizer.getAttribute("sw")) {
      element.style.width = bounding.width - x2 + "px";
      element.style.height = bounding.height + y2 + "px";
      element.style.left = bounding.left + x2 + "px";

      wrapper.style.width = bounding.width - x2 + "px";
      wrapper.style.height = bounding.height + y2 + "px";
      wrapper.style.left = bounding.left + x2 + "px";
    } else if (currentResizer.getAttribute("ne")) {
      element.style.width = bounding.width + x2 + "px";
      element.style.height = bounding.height - y2 + "px";
      element.style.top = bounding.top + y2 + "px";

      wrapper.style.width = bounding.width + x2 + "px";
      wrapper.style.height = bounding.height - y2 + "px";
      wrapper.style.top = bounding.top + y2 + "px";
    } else {
      element.style.width = bounding.width - x2 + "px";
      element.style.height = bounding.height - y2 + "px";
      element.style.top = bounding.top + y2 + "px";
      element.style.left = bounding.left + x2 + "px";

      wrapper.style.width = bounding.width - x2 + "px";
      wrapper.style.height = bounding.height - y2 + "px";
      wrapper.style.top = bounding.top + y2 + "px";
      wrapper.style.left = bounding.left + x2 + "px";
    }
  };

  const addResizer = (widget) => {
    const wrapper = widget.parentNode;
    const nw = document.createElement("div");
    const ne = document.createElement("div");
    const sw = document.createElement("div");
    const se = document.createElement("div");

    nw.setAttribute("nw", true);
    ne.setAttribute("ne", true);
    sw.setAttribute("sw", true);
    se.setAttribute("se", true);

    nw.style.cssText += resizerStyle_nw + resizerStyle;
    ne.style.cssText += resizerStyle_ne + resizerStyle;
    sw.style.cssText += resizerStyle_sw + resizerStyle;
    se.style.cssText += resizerStyle_se + resizerStyle;

    wrapper.append(nw, ne, sw, se);
    handleResizer(widget, [nw, ne, sw, se]);
    addBorderBox();
    // addWrapper([nw, ne, sw, se]);
  };

  const resetTimeout = (timeout_id) => {
    clearTimeout(timeout_id);
  };

  // global stuff
  global.createWidget = createWidget;
  global.setHoldDownTime = setHoldDownTime;
  global.setMenuOpenAnimationSpeed = setMenuOpenAnimationSpeed;
  global.setMenuCloseAnimationSpeed = setMenuCloseAnimationSpeed;
})(window, window.document, $); // pass the global window object and jquery to the anonymous function. They will now be locally scoped inside of the function.
