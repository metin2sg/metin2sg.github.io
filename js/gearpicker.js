//https://softchamp.s3.amazonaws.com/icon/1624353283.png
var selectedSlot;
var selectedMain;
var statusLabel;
var bodyPart = {};
var selectedItemNames, stats;

function init() {
	statusLabel = document.getElementById('status');
	statusLabel.innerHTML = "Select your main to start";
	selectedItemNames = document.getElementById('selectedItemNames');
	selectedItemNames.innerHTML = "No items";
	stats = document.getElementById('stats');
	stats.innerHTML = "No Data";
	initModal();

	//mobile scaling
	var siteWidth = 400;
	var scale = screen.width / siteWidth;

	document.querySelector('meta[name="viewport"]').setAttribute('content', 'width='+siteWidth+', initial-scale='+scale+'');
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
			if (keyName == "Level" || keyName == "Name") {
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
	item = bodyPart[selectedSlot.id] = jsonCopy(data[itemName]);
	document.getElementById(selectedSlot.id).innerHTML = '<img src="'+ item.icon + '" />'
	item.plus = plusSlider.value;
	populateSelectedItems();
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
		fetchMiscDataByPlus(entry, plus) +
		'</div>' +
		'</section>'+
		'</div>';
	}
	equipmentPiece.innerHTML = getSelectedName() + " +" + plus;
}

function populateSelectedItems() {
	selectedItemNames.innerHTML = "";
	var keys = Object.keys(bodyPart);
	var part;
	for (var i = 0, j=keys.length; i < j; i++) {
		part = bodyPart[keys[i]];
		selectedItemNames.innerHTML += 
		'<div class="selectedItemContainer" onclick="ShowBonuses(this)">' +
		'<span class="selectedItemName">' + part.Name + " +" + part.plus + '</span><br />' +
		'<div class="selectedItemBonuses hidden">'+
			DisplayBonuses(part.bonus) +
			'<span class="addbonus" onclick="AddBonus('+keys[i]+')">Add Bonus</span>'+
		'</div>'+
		'</div>'
		;
	}
}

function ShowBonuses(elem){
	var child = elem.childNodes[2];
	if (child.classList.contains("hidden"))
		child.classList.remove("hidden");
	else 
		child.classList.add("hidden");
}

function DisplayBonuses(bonus) {
	var data = "";
	var keys = (bonus != undefined)?Object.keys(bonus):{};

	for (var i = 0; i < keys.length; i++) {
		data += '<span class="bonus" value"'+keys[i]+
			'" onclick="RemoveBonus(this)">'+ keys[i] + ": " +
			data[keys[i]] + "</span><br>";
	}

	return data;
}

function AddBonus(part){
	ShowModal();
	var str = "";

	var bonus = window[part.id +"Bonus"];
	var bonusData;
	var bonusName;
	for (var i = 0; i < bonus.length; i++) {
		bonusData = adders[bonus[i]];
		bonusName = Object.keys(bonusData)[0];
		str +=
			'<div class="itembonus">' + bonusName;
		bonusData = bonusData[bonusName];
		for (var j = 0; j < bonusData.length; j++) {
			str += ' [<span class="bonuslink" onclick="SetBonus('+part.id+','+i+','+j+')">'+
			bonusData[j]+'</span>]';
		}
		str +='</div>';
	}
	modalbody.innerHTML = str;
	equipmentPiece.innerHTML = "Adding " + part.id + " Bonuses";
}

function SetBonus(part, index, jndex){
	var bonus = window[part.id +"Bonus"];//part bonuses
	var bonusName = Object.keys(adders[index]);
	//console.log(bonusName+" _ "+adders[index][bonusName] + " _ " + jndex);
	console.log(bodyPart[part.id]);
	console.log(adders[index][bonusName]);
	if (!bodyPart[part.id].hasOwnProperty(bonus))
		bodyPart[part.id].bonus = {};
	bodyPart[part.id].bonus[bonusName] =
		adders[index][bonusName];
	console.log(adders);
}

function RemoveBonus(elem){
	console.log(elem.value);
}


function CalculateData() {
	stats.innerHTML = "";
	var obj = {};
	var item;
	//fetch all data
	for(key in bodyPart) {//loop through each body part
		item = bodyPart[key];
		for(k in item) { //loop each property
			if (k != "plus" && k != "Name" && k != "icon" && k != "Level"){
				if (obj.hasOwnProperty(k)) {
					obj[k] += item[k][item.plus]; //if already exists, sum it
				} else {
					obj[k] = item[k][item.plus];//else add
				}
			}
		}
	}

	//display data
	for (key in obj) {
		stats.innerHTML += "<span>" + key + ": " + obj[key] + "</span><br />";
	}
}

function jsonCopy(src) {
  return JSON.parse(JSON.stringify(src));
}

function GenerateLink() {
	var link = window.location.pathname+"?";
	
	link+=selectedMain+"=";

	if(bodyPart) {
		if (bodyPart.hasOwnProperty("Earrings")) {
			link += (FindID("Earrings") + 1);
		} else
			link += 0;
	}

	console.log(link);
	copyStringToClipboard(link);
}

function FindID(type){
	var name = bodyPart["Earrings"].Name;
	var data = gamedata[type];
	console.log(data);
	for (var i = 0, l = data.length; i < l; i++) {
		if (data[i].Name == name) {
			return i;
		}
	}
}

function copyStringToClipboard (str) {
   // Create new element
   var el = document.createElement('textarea');
   // Set value (string to be copied)
   el.value = str;
   // Set non-editable to avoid focus and move outside of view
   el.setAttribute('readonly', '');
   el.style = {position: 'absolute', left: '-9999px'};
   document.body.appendChild(el);
   // Select text inside element
   el.select();
   // Copy text to clipboard
   document.execCommand('copy');
   // Remove temporary element
   document.body.removeChild(el);
}