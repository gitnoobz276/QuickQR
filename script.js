/* =========================
   VARIABLES
========================= */

let currentColor = "black";
let currentQRImage = "";
let currentURL = "";

let qrCoins =
parseInt(localStorage.getItem("qrCoins")) || 0;

let ownedItems =
JSON.parse(localStorage.getItem("ownedItems")) || [];

const possibleQuests = [

{
text:"Make 4 QR Codes",
goal:4,
reward:3,
type:"generate"
},

{
text:"Save 2 QR Codes",
goal:2,
reward:3,
type:"save"
},

{
text:"Use 3 Colours",
goal:3,
reward:3,
type:"colour"
},

{
text:"Open FAQ Page",
goal:1,
reward:3,
type:"faq"
}

];

let dailyQuests =
JSON.parse(localStorage.getItem("dailyQuests")) || [];

let questProgress =
JSON.parse(localStorage.getItem("questProgress")) || {};

let claimedQuests =
JSON.parse(localStorage.getItem("claimedQuests")) || {};

/* =========================
   MOBILE MENU
========================= */

function toggleMenu(){

document.querySelector(".nav-links")
.classList.toggle("active");

}

/* =========================
   PAGE SYSTEM
========================= */

function showPage(page){

const pages = [

"homePage",
"faqPage",
"tutorialPage",
"settingsPage",
"questsPage",
"shopPage"

];

pages.forEach(id=>{

const pageEl =
document.getElementById(id);

if(pageEl){
pageEl.classList.add("hidden");
}

});

if(page === "home"){
document.getElementById("homePage")
.classList.remove("hidden");
}

if(page === "faq"){

document.getElementById("faqPage")
.classList.remove("hidden");

updateQuest("faq");

}

if(page === "tutorial"){
document.getElementById("tutorialPage")
.classList.remove("hidden");
}

if(page === "settings"){
document.getElementById("settingsPage")
.classList.remove("hidden");
}

if(page === "quests"){
document.getElementById("questsPage")
.classList.remove("hidden");
}

if(page === "shop"){
document.getElementById("shopPage")
.classList.remove("hidden");
}

}

/* =========================
   QR COLOUR
========================= */

function setQRColor(color){

currentColor = color;

updateQuest("colour");

}

/* =========================
   GENERATE QR
========================= */

function generateQR(){

const url =
document.getElementById("urlInput").value;

if(url.trim() === ""){
alert("Please enter a URL.");
return;
}

currentURL = url;

const qrContainer =
document.getElementById("qrcode");

qrContainer.innerHTML = "";

new QRCode(qrContainer,{

text:url,
width:220,
height:220,
colorDark:currentColor,
colorLight:"#ffffff"

});

setTimeout(()=>{

const canvas =
qrContainer.querySelector("canvas");

if(!canvas) return;

currentQRImage =
canvas.toDataURL("image/png");

document.getElementById("afterGenerate")
.classList.remove("hidden");

updateQuest("generate");

},500);

}

/* =========================
   SAVE QR
========================= */

function saveQR(){

const name =
document.getElementById("qrName").value;

if(name.trim() === ""){
alert("Enter a QR name.");
return;
}

const creations =
JSON.parse(localStorage.getItem("qrCreations")) || [];

creations.push({

name:name,
image:currentQRImage,
url:currentURL,
created:new Date().toLocaleString()

});

localStorage.setItem(
"qrCreations",
JSON.stringify(creations)
);

loadCreations();

updateQuest("save");

alert("QR Code Saved!");

}

/* =========================
   LOAD CREATIONS
========================= */

function loadCreations(){

const creationsDiv =
document.getElementById("creations");

if(!creationsDiv) return;

creationsDiv.innerHTML = "";

const creations =
JSON.parse(localStorage.getItem("qrCreations")) || [];

creations.forEach(item=>{

const card =
document.createElement("div");

card.className = "creation-card";

card.innerHTML = `

<img src="${item.image}">

<div class="creation-name">
${item.name}
</div>

`;

card.onclick = ()=>openInfo(item);

creationsDiv.appendChild(card);

});

}

/* =========================
   MODAL
========================= */

function openInfo(item){

document.getElementById("modal")
.style.display = "flex";

document.getElementById("modalBody")
.innerHTML = `

<img src="${item.image}">

<h2>${item.name}</h2>

<p style="margin-top:15px;">
<b>URL:</b> ${item.url}
</p>

<p style="margin-top:15px;">
<b>Created:</b> ${item.created}
</p>

`;

}

function closeModal(){

document.getElementById("modal")
.style.display = "none";

}

/* =========================
   COINS
========================= */

function updateCoins(){

localStorage.setItem(
"qrCoins",
qrCoins
);

const counter =
document.getElementById("coinAmount");

if(counter){
counter.innerText = qrCoins;
}

}

/* =========================
   QUESTS
========================= */

function generateDailyQuests(){

const today =
new Date().toDateString();

const savedDate =
localStorage.getItem("questDate");

if(savedDate === today) return;

dailyQuests = [];

for(let i=0;i<3;i++){

const random =
possibleQuests[
Math.floor(Math.random()*possibleQuests.length)
];

dailyQuests.push(random);

}

questProgress = {};
claimedQuests = {};

localStorage.setItem(
"dailyQuests",
JSON.stringify(dailyQuests)
);

localStorage.setItem(
"questProgress",
JSON.stringify(questProgress)
);

localStorage.setItem(
"claimedQuests",
JSON.stringify(claimedQuests)
);

localStorage.setItem(
"questDate",
today
);

}

function loadQuests(){

const container =
document.getElementById("questsContainer");

if(!container) return;

container.innerHTML = "";

dailyQuests.forEach((quest,index)=>{

const progress =
questProgress[index] || 0;

const claimed =
claimedQuests[index];

const div =
document.createElement("div");

div.className = "quest-item";

div.innerHTML = `

<h3>${quest.text}</h3>

<p>
${progress}/${quest.goal}
</p>

<p>
Reward: +${quest.reward} QR Tokens
</p>

<button
${claimed ? "disabled" : ""}
onclick="claimQuest(${index})">

${claimed ? "Claimed" : "Claim"}

</button>

`;

container.appendChild(div);

});

updateQuestBar();

}

function updateQuest(type){

dailyQuests.forEach((quest,index)=>{

if(quest.type === type){

if((questProgress[index] || 0) < quest.goal){

questProgress[index] =
(questProgress[index] || 0) + 1;

}

}

});

localStorage.setItem(
"questProgress",
JSON.stringify(questProgress)
);

loadQuests();

}

function claimQuest(index){

const quest =
dailyQuests[index];

if(claimedQuests[index]) return;

if((questProgress[index] || 0) < quest.goal){

alert("Quest not complete.");
return;

}

claimedQuests[index] = true;

qrCoins += quest.reward;

updateCoins();

localStorage.setItem(
"claimedQuests",
JSON.stringify(claimedQuests)
);

loadQuests();

}

function updateQuestBar(){

let completed = 0;

dailyQuests.forEach((quest,index)=>{

if(claimedQuests[index]){
completed++;
}

});

const percent =
(completed / dailyQuests.length) * 100;

document.getElementById("progressFill")
.style.width = percent + "%";

document.getElementById("progressText")
.innerText =
`${completed}/${dailyQuests.length} Complete`;

}

function startQuestTimer(){

setInterval(()=>{

const now = new Date();

const tomorrow = new Date();

tomorrow.setHours(24,0,0,0);

const diff = tomorrow - now;

const hours =
Math.floor(diff / 1000 / 60 / 60);

const minutes =
Math.floor(diff / 1000 / 60 % 60);

const seconds =
Math.floor(diff / 1000 % 60);

document.getElementById("questTimer")
.innerText =

`NEW QUESTS IN:
${hours}:${minutes}:${seconds}`;

},1000);

}

/* =========================
   SHOP
========================= */

function buyItem(item,cost){

if(ownedItems.includes(item)){
alert("Already purchased.");
return;
}

if(qrCoins < cost){
alert("Not enough QR Tokens.");
return;
}

qrCoins -= cost;

ownedItems.push(item);

localStorage.setItem(
"ownedItems",
JSON.stringify(ownedItems)
);

updateCoins();

alert("Purchased!");

}

/* =========================
   SETTINGS
========================= */

function changeTheme(mode){

const cards =
document.querySelectorAll(".card");

if(mode === "light"){

document.body.style.background =
"linear-gradient(135deg,#f1f5f9,#cbd5e1)";

document.body.style.color = "black";

cards.forEach(card=>{

card.style.background = "white";
card.style.color = "black";

});

}else{

document.body.style.background =
"linear-gradient(135deg,#0f172a,#1e293b)";

document.body.style.color = "white";

cards.forEach(card=>{

card.style.background =
"rgba(255,255,255,0.08)";

card.style.color = "white";

});

}

}

function changeAccent(color){

document.querySelectorAll("button")
.forEach(btn=>{

btn.style.background = color;

});

document.getElementById("progressFill")
.style.background = color;

}

function clearQRData(){

if(confirm("Delete all QR codes?")){

localStorage.removeItem("qrCreations");

loadCreations();

}

}

function exportQRData(){

const data =
localStorage.getItem("qrCreations");

const blob =
new Blob([data],{
type:"application/json"
});

const a =
document.createElement("a");

a.href =
URL.createObjectURL(blob);

a.download =
"quickqr-data.json";

a.click();

}

function importQRData(event){

const file =
event.target.files[0];

if(!file) return;

const reader =
new FileReader();

reader.onload = function(e){

localStorage.setItem(
"qrCreations",
e.target.result
);

loadCreations();

};

reader.readAsText(file);

}

/* =========================
   AI ASSISTANT
========================= */

const aiButton =
document.getElementById("aiButton");

const aiChat =
document.getElementById("aiChat");

const aiMessages =
document.getElementById("aiMessages");

const aiInput =
document.getElementById("aiInput");

if(aiButton){

aiButton.onclick = ()=>{

if(aiChat.style.display === "flex"){
aiChat.style.display = "none";
}else{
aiChat.style.display = "flex";
}

};

}

function addMessage(text,type){

const div =
document.createElement("div");

div.className =
`aiMsg ${type}`;

div.innerText = text;

aiMessages.appendChild(div);

aiMessages.scrollTop =
aiMessages.scrollHeight;

}

async function generateQuickQRAnswer(question){

question = question.toLowerCase();

if(question.includes("generate")){

return `
To generate a QR code:

1. Enter a URL
2. Pick a colour
3. Press Generate QR Code
`;

}

if(question.includes("save")){

return `
Generate a QR first, then enter a QR name and press Save QR Code.
`;

}

if(question.includes("quest")){

return `
Complete daily quests to earn QR Tokens.
`;

}

if(question.includes("theme")){

return `
Themes can be bought in the Theme Shop using QR Tokens.
`;

}

if(question.includes("settings")){

return `
Settings let you change themes, colours, export data, and clear QR codes.
`;

}

return `
I can help with:

• QR generation
• Saving QR codes
• Themes
• Quests
• Tokens
• Settings
`;

}

function handleAI(){

const text =
aiInput.value.trim();

if(text === "") return;

addMessage(text,"user");

aiInput.value = "";

setTimeout(async()=>{

const answer =
await generateQuickQRAnswer(text);

addMessage(answer,"bot");

},500);

}

const sendBtn =
document.getElementById("sendBtn");

if(sendBtn){
sendBtn.onclick = handleAI;
}

/* =========================
   STARTUP
========================= */

loadCreations();

generateDailyQuests();

loadQuests();

startQuestTimer();

updateCoins();
