var adders = [
{ "Sword Defence": [2, 4, 6, 10, 15] },
{ "Dagger Defence": [2, 4, 6, 10, 15] },
{ "Two-Handed Defence": [2, 4, 6, 10, 15] },
{ "Arrow Resistance": [2, 4, 6, 10, 15] },
{ "Bell Defence": [2, 4, 6, 10, 15] },
{ "Fan Defence": [2, 4, 6, 10, 15] },
{ "Magic Resistance": [2, 4, 6, 10, 15] },
{ "Lightning Resistance": [2, 4, 6, 10, 15] },
{ "Wind Resistance": [2, 4, 6, 10, 15] },
{ "Fire Resistance": [2, 4, 6, 10, 15] },
{ "The Damage absorbed by HP": [2, 4, 6, 10, 15] },
{ "The Damage absorbed by SP": [2, 4, 6, 10, 15] },
{ "Max HP": [500, 1000, 1500, 2000] },
{ "Max SP": [10, 20, 30, 50, 80] },
{ "Attack Value": [10, 15, 30, 50] },
{ "Chance to Reflect direct body hit": [2, 4, 6, 10, 15] },
{ "Spell Speed": [4, 6, 10, 20] },
{ "Strong against Demi-Human": [1, 2, 3, 5, 10] },
{ "Strong against Esoteric": [2, 4, 6, 10, 20] },
{ "Strong against Orcs": [2, 4, 6, 10, 20] },
{ "Strong against Undead": [2, 4, 6, 10, 20] },
{ "Strong against Devil": [2, 4, 6, 10, 20] },
{ "Strong against Animals": [2, 4, 6, 10, 20] },
{ "Strength": [2, 4, 6, 8, 12] },
{ "Agility": [2, 4, 6, 8, 12] },
{ "Intelligence": [2, 4, 6, 8, 12] },
{ "Life Energy": [2, 4, 6, 8, 12] },
{ "Chance of critical hit": [1, 2, 3, 5, 10] },
{ "Chance for Pierce Attack": [1, 2, 3, 5, 10] },
{ "Slowing Chance": [1, 2, 3, 5, 8] },
{ "Chance of Faint": [1, 2, 3, 5, 8] },
{ "Chance to drop double Gold": [4, 6, 8, 10, 20] },
{ "Chance to drop double the Items": [4, 6, 8, 10, 20] },
{ "Chance for EXP Bonus": [4, 6, 8, 10, 20] },
{ "Chance to dodge Arrows": [4, 6, 10, 15] },
{ "Attack Speed": [1, 2, 3, 5, 8] },
{ "Moving Speed": [4, 6, 10, 20] },
{ "HP Regeneration": [8, 12, 20, 30] },
{ "SP Regeneration": [8, 12, 20, 30] },
{ "Poisoning Chance": [1, 2, 3, 5, 8] },
{ "Poisoning Resistance": [1, 2, 3, 5] },
{ "Immune against Faint": [90] },
{ "Immune against Slow": [90] },
{ "Block Chance": [1, 3, 6, 10, 15] },
{ "Chance to Reflect direct body hit": [1, 2, 3, 5, 10] }
];

var ArmoursBonus = [0,1,2,3,4,5,6,7,8,9,10,11,12,14,15,16];
var HelmetsBonus = [6, 7, 8, 9, 38, 21, 22, 23, 24, 25, 26, 41, 42, 11, 39, 43];
var ShieldsBonus = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 35, 37, 45, 46, 47, 48];
var BraceletsBonus = [6, 7, 8, 9, 21, 22, 23, 24, 25, 26, 32, 36, 10, 11, 12, 13];
var EarringsBonus = [0, 1, 2, 3, 4, 5, 21, 22, 23, 24, 25, 26, 40, 44, 11, 36];
var NecklacesBonus = [0, 1, 2, 3, 4, 5, 31, 32, 41, 42, 35, 37, 11, 12, 13, 34];
var weaponBonus = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 43, 16]; //NEED TO CONFIRM VALUES
var BeltsBonus = [];
var ShoesBonus = [0, 1, 2, 3, 4, 5, 31, 35, 37, 38, 12, 13, 33, 34, 39];




var rarities = [{"Max HP":[200,500,800]},
{"Strength":[2,3,5]},
{"Life Energy":[2,3,5]},
{"Intelligence":[2,3,5]},
{"Agility":[2,3,5]},
{"Strong against Monster":[2,3,5]},
{"Strong Against Demi-Human":[2,3,5]},
{"Resistance to Demi-Human":[1,3,5]},
{"Resistance to Pierce":[2,3,5]},
{"Resistance to critical":[2,3,5]},
{"Block Chance":[2,3,5]},
{"Chance to dodge Arrows":[2,3,5]},
{"Restore HP":[3,5,8]},
{"Restore SP":[3,5,8]},
{"Attack Value":[5,10,20]},
{"Magical Attack Value":[5,10,20]},
{"Average Damage":[3,5,8]},
{"Skill Damage":[2,3,5]},
{"Average Damage Resistance":[3,5,8]},
{"Skill Resistance":[2,3,5]},
{"Attack Speed":[1,3,5]},
{"Moving Speed":[2,5,8]},
{"Chance of Faint":[1,3,5]},
{"Resistance to Dark":[3,5,10]},
{"Resistance to Fire":[3,5,10]},
{"Resistance to Thunder":[3,5,10]},
{"Resistance to Wind":[3,5,10]},
{"Resistance to Earth":[3,5,10]},
{"Resistance to Ice":[3,5,10]}
];

var ArmoursRarity = [0,10,11,12,13,18,19,23,27,28];
var HelmetsRarity = [5,6,11,20,24,25,26];
var ShieldsRarity = [1,2,3,4,10,18,19];
var BraceletsRarity = [8,9,12,13,14,15];
var EarringsRarity = [7,8,9,16,17,21];
var NecklacesRarity = [0,7,23,24,25,26,27,28];
var weaponRarity = [1,2,3,4,5,6,14,15,16,17];
var BeltsRarity = [];
var ShoesRarity = [0,18,19,20,21,22];