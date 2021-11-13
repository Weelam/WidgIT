const widgets = document.querySelectorAll(".widgit-widget");


widgets.forEach(widget => {
	// clone the node, append it to the parent with position fixed 

	//
	widget.addEventListener("mousedown", (e) => {

		let prevX = e.clientX;
		let prevY = e.clientY;

		console.log(prevX, prevY);

		const handleMouseMove = (e) => {		

			let newX = e.clientX - prevX;
			let newY = e.clientY - prevY;

			console.log(newX, newY);
			
			const bounding = widget.getBoundingClientRect();

			widget.style.left = bounding.left + newX + "px";
			widget.style.top = bounding.top + newY + "px";

			prevX = e.clientX;
			prevY = e.clientY;

			widget.style.position = "fixed";
			widget.style.cursor = "move";
		}

		const handleMouseUp = () => {
			console.log("mouse up");
			window.removeEventListener("mousemove", handleMouseMove)
			window.removeEventListener("mouseup", handleMouseUp)
		}

		window.addEventListener("mousemove", handleMouseMove)
		window.addEventListener("mouseup", handleMouseUp)


	})
})



// drag and drop
// widgets.forEach((widget) => {
//   widget.setAttribute("draggable", true);


//   widget.addEventListener("dragstart", (e) => {
// 		widget.classList.add("widgit-dragging");
// 		widget.style.position = "fixed";

// 		// hide ghost imgae
// 		// let image = new Image();
// 		// image.src =  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
// 		e.dataTransfer.setDragImage(e.target, 0, 0);


// 	});

// 	widget.addEventListener("drag", (e) => {
// 		e.preventDefault()
// 	});

// 	widget.addEventListener("dragend", (e) => {
// 		widget.classList.remove("widgit-dragging");
// 		widget.style.top = e.clientY + "px";
// 		widget.style.left = e.clientX + "px";
		
// 	});
// });

// document.addEventListener("dragover", e => {
// 	e.preventDefault()
// 	console.log("dragged over")
// })