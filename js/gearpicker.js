//https://softchamp.s3.amazonaws.com/icon/1624353283.png
var selectedSlot;
var selectedMain;
var statusLabel;
var weapon, head, armour, shield, bracelet, earring, necklace, belt, shoes;
function init() {
	statusLabel = document.getElementById('status');
	statusLabel.innerHTML = "Select your main to start";
	initModal();
}

function selectSlot(elem){
	if (selectedMain) {
		statusLabel.innerHTML = "Selected: " + elem.id;
		if (selectedSlot){
			selectedSlot.classList.remove('selected');
		}
		elem.classList.add('selected');
		selectedSlot = elem;
		ShowModal();
		DisplayItems();
	} else {
		statusLabel.innerHTML ="Please select your main";
	}
}

function selectMain(elem) {
	selectedMain = elem.value;
	statusLabel.innerHTML = "Selected: " + selectedMain;
	clearMainItems();
}

function DisplayItems() {
	plusSlider.value = 0;
	ChangePlus(plusSlider.value);
}

function fetchMiscData(data){
	var text ="";
	var keys = Object.keys(data);
	for (var i = 0,l=keys.length; i < l; i++) {
		if (keys[i] != "icon") {
			text += '<p class="item-data">' + keys[i] + ": " + data[keys[i]] + '<p>';
		}
	}
	return text;
}

function fetchMiscDataByPlus(data, plus){
	var text ="";
	var keys = Object.keys(data);
	var keyName;
	for (var i = 0,l=keys.length; i < l; i++) {
		keyName = keys[i];
		if (keyName != "icon") {
			if (keyName == "Level") {
				text += '<p class="item-data">' + keyName + ": " + data[keys[i]] + '<p>';	
			} else {
				text += '<p class="item-data">' + keyName + ": " + data[keys[i]][plus] + '<p>';
			}
		}
	}
	return text;
}

function getSelectedName() {
	if (selectedSlot.id == "Helmets" || selectedSlot.id == "Armours"){
		return  selectedMain + " " + selectedSlot.id;
	} else if (selectedSlot.id == "weapon") {
		console.log("grabSelectedData: weapons in development");
		statusLabel.innerHTML = "grabSelectedData: weapons in development";
	} else {
		return selectedSlot.id;
	}
}

function grabSelectedData() {
	return  gamedata[getSelectedName()];
}

function selectItem(itemName){
	statusLabel.innerHTML = "Selected item: " + itemName;
	HideModal();
	data = grabSelectedData();
	var item;
	switch(selectedSlot.id) {
		case "Armours":
		item = armour = data[itemName];
		break;
		case "Helmets":
		item = head = data[itemName];
		break;
		case "Shields":
		item = shield = data[itemName];
		break;
		case "Bracelets":
		item = bracelet = data[itemName];
		break;
		case "Earrings":
		item = earring = data[itemName];
		break;
		case "Necklaces":
		item = necklace = data[itemName];
		break;
		case "Belts":
		item = belt = data[itemName];
		break;
		case "Shoes":
		item = shoes = data[itemName];
		break;
		case "weapon":
		console.log("selectItem: weapons in development");
		statusLabel.innerHTML = "selectItem: weapons in development";
		break;
	}
	document.getElementById(selectedSlot.id).innerHTML = '<img src="'+ item.icon + '" />'
	CalculateData();
}

function clearMainItems() {
	weapon = null;
	armour = null;
	head = null;
	document.getElementById("Helmets").innerHTML = "";
	document.getElementById("weapon").innerHTML = "";
	document.getElementById("Armours").innerHTML = "";
}

function ChangePlus(plus) {
	modalbody.innerHTML = "";
	var data = grabSelectedData();
	var keys = Object.keys(data);
	var entry, keyName;
	for (var i = 0,l=keys.length; i < l; i++) {
		keyName = keys[i];
		entry = data[keyName];
		modalbody.innerHTML +=
		'<div class="item" onclick="selectItem(\'' + keyName + '\')">' +
		'<section>' +
		'<div class="leftdiv height' + (Object.keys(entry).length) + '">' + //LEFT
		'<img src="'+ entry.icon + '" />'+
		'</div>' +
		'<div class="rightdiv">'+ // RIGHT
		'<p class="item-name">' + keyName + '<p>' +
		fetchMiscDataByPlus(entry, plus) +
		'</div>' +
		'</section>'+
		'</div>';
	}
	equipmentPiece.innerHTML = getSelectedName() + " +" + plus;
}

function CalculateData() {

}