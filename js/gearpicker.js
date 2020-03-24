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
	MobileScaling();
	LoadQueryString();
}

function MobileScaling() {
	//mobile scaling
	var siteWidth = 400;
	var scale = screen.width / siteWidth;

	document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=' + siteWidth + ', initial-scale=' + scale + '');
}

function selectSlot(elem) {
	if (selectedMain) {
		statusLabel.innerHTML = "Selected: " + elem.id;
		if (selectedSlot) {
			selectedSlot.classList.remove('selected');
		}
		elem.classList.add('selected');
		selectedSlot = elem;
		ShowModal();
		DisplayItems();
	} else {
		statusLabel.innerHTML = "Please select your main";
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

function fetchMiscData(data) {
	var text = "";
	var keys = Object.keys(data);
	for (var i = 0, l = keys.length; i < l; i++) {
		if (keys[i] !== "icon") {
			text += '<p class="item-data">' + keys[i] + ": " + data[keys[i]] + '<p>';
		}
	}
	return text;
}

function fetchMiscDataByPlus(data, plus) {
	var text = "";
	var keys = Object.keys(data);
	var keyName;
	for (var i = 0, l = keys.length; i < l; i++) {
		keyName = keys[i];
		if (keyName !== "icon") {
			if (keyName === "Level" || keyName === "Name") {
				text += '<p class="item-data">' + keyName + ": " + data[keys[i]] + '<p>';
			} else {
				text += '<p class="item-data">' + keyName + ": " + data[keys[i]][plus] + '<p>';
			}
		}
	}
	return text;
}

function getSelectedName() {
	if (selectedSlot.id === "Helmets" || selectedSlot.id === "Armours") {
		return selectedMain + " " + selectedSlot.id;
	} else if (selectedSlot.id === "weapon") {
		console.log("grabSelectedData: weapons in development");
		statusLabel.innerHTML = "grabSelectedData: weapons in development";
	} else {
		return selectedSlot.id;
	}
}

function grabSelectedData() {
	return gameData[getSelectedName()];
}

function selectItem(itemName) {
	statusLabel.innerHTML = "Selected item: " + itemName;
	HideModal();
	data = grabSelectedData();
	var item;
	item = bodyPart[selectedSlot.id] = jsonCopy(data[itemName]);
	document.getElementById(selectedSlot.id).innerHTML = '<img src="' + item.icon + '" />';
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
	modalBody.innerHTML = "";
	var data = grabSelectedData();
	var keys = Object.keys(data);
	var entry, keyName;
	for (var i = 0, l = keys.length; i < l; i++) {
		keyName = keys[i];
		entry = data[keyName];
		modalBody.innerHTML +=
			'<div class="item" onclick="selectItem(\'' + keyName + '\')">' +
			'<section>' +
			'<div class="leftdiv height' + Object.keys(entry).length + '">' + //LEFT
			'<img src="' + entry.icon + '" />' +
			'</div>' +
			'<div class="rightdiv">' + // RIGHT
			fetchMiscDataByPlus(entry, plus) +
			'</div>' +
			'</section>' +
			'</div>';
	}
	equipmentPiece.innerHTML = getSelectedName() + " +" + plus;
	if (plusSlider.classList.contains("hidden"))
		plusSlider.classList.remove("hidden");
}

function populateSelectedItems() {
	CalculateData(); //always update before the new population
	var data = "";
	var keys = Object.keys(bodyPart);
	var part;
	for (var i = 0, j = keys.length; i < j; i++) {
		part = bodyPart[keys[i]];

		data += '<div class="selectedItemContainer">' +
			'<span class="selectedItemName" onclick="ShowBonuses(this)">' + part.Name + " +" + part.plus + '</span><br />' +
			'<div class="selectedItemBonuses">' +
			DisplayBonuses(part.bonus, part, keys[i]) +
			DisplayRarity(part.rarity, part, keys[i]);
		if (part.hasOwnProperty("bonus") && Object.keys(part.bonus).length < 5 || !part.hasOwnProperty("bonus")) {
			data += '<span class="addBonus" onclick="AddBonus(' + keys[i] + ')">Add Bonus</span><br>';
		}
		if (part.hasOwnProperty("rarity") && Object.keys(part.rarity).length < 2 || !part.hasOwnProperty("rarity")) {
			data += '<span class="addRarity" onclick="AddRarity(' + keys[i] + ')">Add Rarity</span>';
		}
		data += '</div></div>';
	}
	selectedItemNames.innerHTML = data;
}

/*Start Bonus*/
function ShowBonuses(elem){
	var child = elem.parentElement.childNodes[2];
	if (child.classList.contains("hidden"))
		child.classList.remove("hidden");
	else 
		child.classList.add("hidden");				
}

function DisplayBonuses(bonus, item, part) {
	var data = "";
	var keys = bonus !== undefined ? Object.keys(bonus) : {};

	for (var i = 0; i < keys.length; i++) {
		data += '<span class="bonus"' +
			' onclick="RemoveBonus(\'' + keys[i] + '\',\'' + part + '\')">' + keys[i] + ": " +
			bonus[keys[i]] + "</span><br>";
	}

	return data;
}

function AddBonus(part) {
	ShowModal();
	var str = "";

	var bonus = window[part.id + "Bonus"];
	var bonusData;
	var bonusName;
	for (var i = 0; i < bonus.length; i++) {
		bonusData = adders[bonus[i]];
		bonusName = Object.keys(bonusData)[0];
		str +=
			'<div class="itemBonus">' + bonusName;
		bonusData = bonusData[bonusName];
		for (var j = 0; j < bonusData.length; j++) {
			str += ' [<span class="bonusLink" onclick="SetBonus(' + part.id + ',' + i + ',' + j + ')">' +
				bonusData[j] + '</span>]';
		}
		str += '</div>';
	}
	modalBody.innerHTML = str;
	plusSlider.classList.add("hidden");
	equipmentPiece.innerHTML = "Adding " + part.id + " Bonuses";
}

function SetBonus(part, index, jndex) {
	if (!bodyPart[part.id].hasOwnProperty("bonus")) {
		bodyPart[part.id].bonus = {};
	}

	if (Object.keys(bodyPart[part.id].bonus).length < 5) {
		var bonus = window[part.id + "Bonus"]; //part bonuses
		var bonusValue = bonus[index];
		var bonusName = Object.keys(adders[bonusValue]);

		bodyPart[part.id].bonus[bonusName] =
			adders[bonusValue][bonusName][jndex];

		populateSelectedItems();
	} else {
		statusLabel.innerHTML = "Maximum of 5 bonuses allowed.";
	}
	HideModal();
	modalBody.innerHTML = "";
}

function RemoveBonus(bonus, part) {
	delete bodyPart[part].bonus[bonus];
	populateSelectedItems();
}

/*End Bonus*/

/*Start Rarity*/
function DisplayRarity(rarity, item, part) {
	var data = "";
	var keys = rarity !== undefined ? Object.keys(rarity) : {};

	for (var i = 0; i < keys.length; i++) {
		data += '<span class="rarity"' +
			' onclick="RemoveRarity(\'' + keys[i] + '\',\'' + part + '\')">' + keys[i] + ": " +
			rarity[keys[i]] + "</span><br>";
	}

	return data;
}

function AddRarity(part) {
	ShowModal();
	var str = "";

	var rarity = window[part.id + "Rarity"];
	var rarityData;
	var rarityName;
	for (var i = 0; i < rarity.length; i++) {
		rarityData = rarities[rarity[i]];
		rarityName = Object.keys(rarityData)[0];
		str +=
			'<div class="itemBonus">' + rarityName;
		rarityData = rarityData[rarityName];
		for (var j = 0; j < rarityData.length; j++) {
			str += ' [<span class="bonusLink" onclick="SetRarity(' + part.id + ',' + i + ',' + j + ')">' +
				rarityData[j] + '</span>]';
		}
		str += '</div>';
	}
	modalBody.innerHTML = str;
	plusSlider.classList.add("hidden");
	equipmentPiece.innerHTML = "Adding " + part.id + " Rarities";
}

function SetRarity(part, index, jndex) {
	if (!bodyPart[part.id].hasOwnProperty("rarity")) {
		bodyPart[part.id].rarity = {};
	}

	if (Object.keys(bodyPart[part.id].rarity).length < 2) {
		var rarity = window[part.id + "Rarity"]; //part rarities
		var rarityValue = rarity[index];
		var rarityName = Object.keys(rarities[rarityValue]);

		bodyPart[part.id].rarity[rarityName] =
			rarities[rarityValue][rarityName][jndex];

		populateSelectedItems();
	} else {
		statusLabel.innerHTML = "Maximum of 2 rarities allowed.";
	}
	HideModal();
	modalBody.innerHTML = "";
}

function RemoveRarity(rarity, part) {
	delete bodyPart[part].rarity[rarity];
	populateSelectedItems();
}
/*End Rarity*/
function CalculateData() {
	stats.innerHTML = "";
	var obj = {};
	var item;
	//fetch all data
	for (key in bodyPart) { //loop through each body part
		item = bodyPart[key];
		for (k in item) { //loop each property
			switch (k) {
				case "bonus":
					var bonus = item[k];
					for (b in bonus) {
						if (obj.hasOwnProperty(b)) {
							obj[b] += bonus[b]; //if already exists, sum it
						} else {
							obj[b] = bonus[b]; //else add
						}
					}
					break;
				case "rarity":
					var rarity = item[k];
					for (b in rarity) {
						if (obj.hasOwnProperty(b)) {
							obj[b] += rarity[b]; //if already exists, sum it
						} else {
							obj[b] = rarity[b]; //else add
						}
					}
					break;
				case "plus":
				case "Name":
				case "icon":
				case "Level":
					break;
				default:
					if (obj.hasOwnProperty(k)) {
						obj[k] += item[k][item.plus]; //if already exists, sum it
					} else {
						obj[k] = item[k][item.plus]; //else add
					}
			}
		}
	}

	//display data
	for (key in obj) {
		stats.innerHTML += "<span>" + key + ": " + obj[key] + "</span><br />";
	}
}

function FindID(type) {
	if (bodyPart.hasOwnProperty(type)) {
		var name = bodyPart[type].Name;
		if (type === "Armours" || type === "Helmets") {
			type = selectedMain + " " + type;
		}
		var data = gameData[type];
		for (var i = 0, l = data.length; i < l; i++) {
			if (data[i].Name === name) {
				return i;
			}
		}
	} else {
		return -1;
	}
}

function jsonCopy(src) {
	return src ? JSON.parse(JSON.stringify(src)) : undefined;
}

function copyStringToClipboard(str) {
	// Create new element
	var el = document.createElement('textarea');
	// Set value (string to be copied)
	el.value = str;
	// Set non-editable to avoid focus and move outside of view
	el.setAttribute('readonly', '');
	el.style = {
		position: 'absolute',
		left: '-9999px'
	};
	document.body.appendChild(el);
	// Select text inside element
	el.select();
	// Copy text to clipboard
	document.execCommand('copy');
	// Remove temporary element
	document.body.removeChild(el);
}

var linkSequencer = ["Armours", "Helmets", "Shields", "Bracelets",
	"Earrings", "Necklaces", "weapon", "Belts", "Shoes"
];

function GenerateLink() {
	var link = window.location.href.split('?')[0] + "?";

	link += selectedMain + "=";
	var part;
	var item;
	var itemID;
	for (var i = 0; i < linkSequencer.length; i++) {
		part = linkSequencer[i];
		itemID = FindID(part) + 1;
		link += ToLinkChar(itemID);
		if (itemID > 0) {
			item = bodyPart[part];
			//plus
			link += item.plus;
			//bonuses
			link += FetchBonusQS(item, "bonus", adders);
			//rarities
			link += "," + FetchBonusQS(item, "rarity", rarities);
		}
		link += "_";
	}

	link = link.slice(0, -1);
	copyStringToClipboard(link);
}

function FetchBonusQS(item, target, data) {
	if (item.hasOwnProperty(target)) {
		var keys = Object.keys(item[target]);
		var link = "";
		var helper;
		for (key in keys) {
			key = keys[key];
			for (var i = 0, l = data.length; i < l; i++) {
				helper = data[i];
				if (Object.keys(helper)[0] === key) {
					link += ToLinkChar(i);
					helper = helper[key];
					for (var j = 0; j < helper.length; j++) {
						if (item[target][key] === helper[j]) {
							link += j;
						}
					}
				}
			}
		}
	} else {
		link = 0;
	}
	return link;
}

function LoadQueryString() {
	//decode string
	var match,
		pl = /\+/g, // Regex for replacing addition symbol with a space
		search = /([^&=]+)=?([^&]*)/g,
		decode = function (s) {
			return decodeURIComponent(s.replace(pl, " "));
		},
		query = window.location.search.substring(1);

	var urlParams = {};
	while (match = search.exec(query))
		urlParams[decode(match[1])] = decode(match[2]);
	//deal with the data
	//first, select the main class
	if (Object.keys(urlParams).length === 0) {
		return;
	}
	document.getElementById(Object.keys(urlParams)[0] + "Radio").click();
	//split the data on a body part basis "_" delimits each part
	var arr = urlParams[Object.keys(urlParams)[0]].split('_');

	//loop through each part
	var type;
	var itemID;
	var partData;
	for (var i = 0; i < linkSequencer.length; i++) {
		type = linkSequencer[i];
		if (type === "Armours" || type === "Helmets") {
			type = selectedMain + " " + type;
		}
		partData = arr[i];
		if (partData !== 0) {
			itemID = FromLinkChar(partData[0]);
			if (--itemID === -1)
				continue;
			bodyPart[linkSequencer[i]] = gameData[type][itemID]; //grab the item
			var item;
			item = bodyPart[linkSequencer[i]] = jsonCopy(gameData[type][itemID]); //deep copy
			//display item image
			document.getElementById(linkSequencer[i]).innerHTML = '<img src="' + item.icon + '" />';
			item.plus = partData[1]; //fetch the plus
			//deal with bonuses
			ObtainBonusQS(item, partData.substring(2), "bonus", adders);
			//deal with  rarity
			ObtainBonusQS(item, partData.split(',')[1], "rarity", rarities);
			populateSelectedItems();
		}
	}
}

function ObtainBonusQS(item, data, target, targetVar) {
	if (data != 0) {
		var b;
		var key;
		item[target] = {};
		for (var i = 0; i < data.length; i += 2) {
			b = FromLinkChar(data[i]);
			if (b >= 0) {
				key = Object.keys(targetVar[b])[0];
				for (var j = 0; j < targetVar.length; j++) {
					if (Object.keys(targetVar[j])[0] === key) {
						item[target][key] = targetVar[j][key][data[i + 1]];
					}
				}
			} else {
				break;
			}
		}
	}
}

function ToLinkChar(int) {
	int += 65;
	if (int >= 91) {
		int += 6;
	}
	return String.fromCharCode(int);
}

function FromLinkChar(char) {
	char = char.charCodeAt(0); //fetch the ID
	if (char >= 91) {
		char -= 6;
	}
	return char - 65;
}