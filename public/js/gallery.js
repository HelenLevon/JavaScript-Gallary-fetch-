let btn = document.getElementById('add'),
	countImages = document.getElementById('count'),
	spaceForGalary = document.getElementById('gallary'),
	lineSelector = document.getElementById('line-selector'),
	visibleGalary = [],
	countRestImages = document.getElementById('count-rest');



class BaseGallery {
	constructor() {
		this.newData = [];
		this.newDataCopy = [];
		this.visibleGalary = [];
		this._btnHandler = () => {
			this.run();
		};
		this._galleryContainerHandler = (event) => {
			this.removeElement(event);
		};
		this.boxesUrl = "http://localhost:3000/wooden_boxes";

	}
	showAlert() {
		this.currentButtonStyle();
		this.showModalWindow();
	};
	currentButtonStyle() {
		if (this.newData.length) {
			btn.classList.remove("btn-danger");
		} else {
			btn.classList.add("btn-danger");
		}
	};
	showModalWindow() {
		$(".myModal").modal("show");
	};
	sortGalary(visibleGalary) {
		console.log(lineSelector.value);
		if (lineSelector.value == "0") {
			return visibleGalary
		};
		let cases = {
			'1': "name",
			'2': "-name",
			'3': "-dateMSec",
			'4': "dateMSec",
		};
		return visibleGalary.sort(dynamicSort(cases[lineSelector.value]));

		function dynamicSort(property) {
			let sortOrder = 1;
			if (property[0] === "-") {
				sortOrder = -1;
				property = property.substr(1);
			}
			return function (a, b) {
				let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
				return result * sortOrder;
			}
		}
	};
	changeQuantity(visibleGalary) {
		countImages.innerHTML = visibleGalary.length;
		countRestImages.innerHTML = this.newDataCopy.length;
	};
	showGalary(visibleGalary) {
		let galary = [];
		visibleGalary.forEach(item => {
			galary.push(newElement(item));
		});

		function newElement(item) {
			return `\
				<div class="col-sm-3 col-xs-6 imgContainer">\
				<img src="${item.url}" alt="${item.name}" class="img-thumbnail img-height">\
				<div class="info-wrapper">\
					<div class="text-muted">${item.name}</div>\
					<div class="text-muted top-padding">${item.description}</div>\
					<div class="text-muted">${item.date}</div>\
					<div class="text-muted">${item.id}</div>\
					
					<button class="btn btn-danger removeElement" data-id = "${item.id}">Delete</button>
				</div>\
				</div>
				`;
		}
		spaceForGalary.innerHTML = galary.join(" ");
	};
	letSortGalary() {

		this.visibleGalary = this.sortGalary(this.visibleGalary);
		this.showGalary(this.visibleGalary);
		this.setLocalStorage();
	};
	getDataFromLocalStorage() {
		lineSelector.value = (localStorage.getItem("sort")) ?
			localStorage.getItem("sort") :
			"1";
	};
	setLocalStorage() {
		localStorage.setItem("sort", lineSelector.value);
	};
	initComponentGallary() {
		this.initListeners();
		this.getDataFromLocalStorage();

		fetch(this.boxesUrl).then(responce => responce.json())
			.then(data => {
				this.newData = utils.fetchData(data);
				this.newDataCopy = this.newData.slice();
				this.visibleGalary = this.newDataCopy.slice();
				this.newDataCopy = [];
				this.changeQuantity(this.visibleGalary);
				this.showGalary(this.visibleGalary);
			});


	};
	initListeners() {
		lineSelector.addEventListener('change', () => {
			this.letSortGalary();
		});
	}
}

class ExtendedGallery extends BaseGallery {
	constructor() {
		super();
	}
	initComponentListener() {
		btn.addEventListener("click", this._btnHandler);
		galleryContainer.addEventListener('click', this._galleryContainerHandler);
	};
	run() {
		if (!this.newDataCopy.length) {
			this.showAlert();
			return;
		}
		this.visibleGalary.push(this.newDataCopy.shift());
		this.visibleGalary = this.sortGalary(this.visibleGalary);
		this.changeQuantity(this.visibleGalary);
		this.showGalary(this.visibleGalary);
		this.currentButtonStyle()
	};
	removeElement(event) {
		if (!event.target.getAttribute("data-id")) {
			return;
		}
		let idOfDel = +event.target.getAttribute("data-id");
		let currentIdForDel = this.visibleGalary.find((elem) => {
			return (elem.id == idOfDel);
		});
		this.newDataCopy.push(currentIdForDel);
		this.visibleGalary = this.visibleGalary.filter(el => {
			if (el.id === idOfDel) return false;
			return true;
		});
		this.changeQuantity(this.visibleGalary);
		this.sortGalary(this.visibleGalary);
		this.showGalary(this.visibleGalary);
		this.currentButtonStyle();

	}
}