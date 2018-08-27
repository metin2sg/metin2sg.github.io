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
	CalculateData(); //always update before the new population
	var data = "";
	var keys = Object.keys(bodyPart);
	var part;
	for (var i = 0, j=keys.length; i < j; i++) {
		part = bodyPart[keys[i]];

		data += '<div class="selectedItemContainer" onclick="ShowBonuses(this)">' +
			'<span class="selectedItemName">' + part.Name + " +" + part.plus + '</span><br />' +
			'<div class="selectedItemBonuses hidden">'+
			DisplayBonuses(part.bonus, part, keys[i]);
			DisplayRarity(part.rarity, part, keys[i]);
		if (part.hasOwnProperty("bonus") && Object.keys(part.bonus).length < 5 || !part.hasOwnProperty("bonus")){
			data+='<span class="addbonus" onclick="AddBonus('+keys[i]+')">Add Bonus</span><br>';
		}
		if (part.hasOwnProperty("rarity") && Object.keys(part.rarity).length < 2 || !part.hasOwnProperty("rarity")){
			data+='<span class="addrarity" onclick="AddRarity('+keys[i]+')">Add Rarity</span>';
		}
		data += '</div></div>';
	}
	selectedItemNames.innerHTML = data;
}


/*Start Bonus*/
function ShowBonuses(elem){
	var child = elem.childNodes[2];
	if (child.classList.contains("hidden"))
		child.classList.remove("hidden");
	else 
		child.classList.add("hidden");
}

function DisplayBonuses(bonus,item, part) {
	var data = "";
	var keys = (bonus != undefined)?Object.keys(bonus):{};

	for (var i = 0; i < keys.length; i++) {
		data += '<span class="bonus"' +
			' onclick="RemoveBonus(\'' + keys[i] + '\',\'' + part + '\')">'+ keys[i] + ": " +
			bonus[keys[i]] + "</span><br>";
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
		console.log(bonusData);
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
	if (!(bodyPart[part.id].hasOwnProperty("bonus"))){
		bodyPart[part.id].bonus = {};
	}

	if (Object.keys(bodyPart[part.id].bonus).length < 5){
		var bonus = window[part.id +"Bonus"];//part bonuses
		var bonusValue = bonus[index];
		var bonusName = Object.keys(adders[bonusValue]);
		
		bodyPart[part.id].bonus[bonusName] =
			adders[bonusValue][bonusName][jndex];

		populateSelectedItems();
	} else {
		statusLabel.innerHTML = "Maximum of 5 bonuses allowed.";
	}
	HideModal();
	modalbody.innerHTML = "";
}

function RemoveBonus(bonus, part){
	delete bodyPart[part].bonus[bonus];
	populateSelectedItems();
}

/*End Bonus*/

/*Start Rarity*/
function ShowRarity(elem){
	var child = elem.childNodes[2];
	if (child.classList.contains("hidden"))
		child.classList.remove("hidden");
	else 
		child.classList.add("hidden");
}

function DisplayRarity(rarity,item, part) {
	var data = "";
	var keys = (rarity != undefined)?Object.keys(rarity):{};

	for (var i = 0; i < keys.length; i++) {
		data += '<span class="rarity"' +
			' onclick="RemoveRarity(\'' + keys[i] + '\',\'' + part + '\')">'+ keys[i] + ": " +
			rarity[keys[i]] + "</span><br>";
	}

	return data;
}

function AddRarity(part){
	ShowModal();
	var str = "";

	var rarity = window[part.id +"Rarity"];
	var rarityData;
	var rarityName;
	for (var i = 0; i < rarity.length; i++) {
		rarityData = adders[rarity[i]];
		rarityName = Object.keys(rarityData)[0];
		str +=
			'<div class="itemrarity">' + rarityName;
		rarityData = rarityData[rarityName];
		for (var j = 0; j < rarityData.length; j++) {
			str += ' [<span class="raritylink" onclick="SetRarity('+part.id+','+i+','+j+')">'+
			rarityData[j]+'</span>]';
		}
		str +='</div>';
	}
	modalbody.innerHTML = str;
	equipmentPiece.innerHTML = "Adding " + part.id + " Rarities";
}

function SetRarity(part, index, jndex){
	if (!(bodyPart[part.id].hasOwnProperty("rarity"))){
		bodyPart[part.id].rarity = {};
	}

	if (Object.keys(bodyPart[part.id].rarity).length < 2){
		var rarity = window[part.id +"Rarity"];//part rarities
		var rarityValue = rarity[index];
		var rarityName = Object.keys(rarities[rarityValue]);
		
		bodyPart[part.id].rarity[rarityName] =
			rarities[rarityValue][rarityName][jndex];

		populateSelectedItems();
	} else {
		statusLabel.innerHTML = "Maximum of 2 rarities allowed.";
	}
	HideModal();
	modalbody.innerHTML = "";
}

function RemoveRarity(rarity, part){
	delete bodyPart[part].rarity[rarity];
	populateSelectedItems();
}
/*End Rarity*/
function CalculateData() {
	stats.innerHTML = "";
	var obj = {};
	var item;
	//fetch all data
	for(key in bodyPart) {//loop through each body part
		item = bodyPart[key];
		for(k in item) { //loop each property
			switch (k)  {
				case "bonus":
					var bonus = item[k];
					for(b in bonus){
						if (obj.hasOwnProperty(b)) {
							obj[b] += bonus[b]; //if already exists, sum it
						} else {
							obj[b] = bonus[b];//else add
						}
					}
					break;
				case "rarity":
					var rarity = item[k];
					for(b in rarity){
						if (obj.hasOwnProperty(b)) {
							obj[b] += rarity[b]; //if already exists, sum it
						} else {
							obj[b] = rarity[b];//else add
						}
					}
					break;
				case "plus":case "Name":case "icon":case "Level":
					break;
				default:
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