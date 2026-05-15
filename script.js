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

let equippedTheme =
localStorage.getItem("equippedTheme") || "default";

let equippedGradient =
localStorage.getItem("equippedGradient") || "off";


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

const target =
document.getElementById(page + "Page");

if(target){
target.classList.remove("hidden");
}

if(page === "faq"){
updateQuest("faq");
}

}


/* =========================
   QR SYSTEM
========================= */

function setQRColor(color){

currentColor = color;

updateQuest("colour");

}

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

if(canvas){

currentQRImage =
canvas.toDataURL("image/png");

document.getElementById("afterGenerate")
.classList.remove("hidden");

}

},300);

updateQuest("generate");

}

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
date:new Date().toLocaleString()
});

localStorage.setItem(
"qrCreations",
JSON.stringify(creations)
);

loadCreations();

updateQuest("save");

alert("QR Code Saved!");

}

function loadCreations(){

const container =
document.getElementById("creations");

if(!container) return;

container.innerHTML = "";

const creations =
JSON.parse(localStorage.getItem("qrCreations")) || [];

creations.forEach(item=>{

const div =
document.createElement("div");

div.className = "creation-card";

div.innerHTML = `

<img src="${item.image}">

<div class="creation-name">
${item.name}
</div>

`;

div.onclick = ()=>openInfo(item);

container.appendChild(div);

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

<img src="${item.image}" style="width:220px;border-radius:15px;">

<h2 style="margin-top:15px;">
${item.name}
</h2>

<p style="margin-top:15px;">
<b>URL:</b> ${item.url}
</p>

<p style="margin-top:10px;">
<b>Created:</b> ${item.date}
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

const amount =
document.getElementById("coinAmount");

if(amount){
amount.innerText = qrCoins;
}

}


/* =========================
   QUESTS
========================= */

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

const fill =
document.getElementById("progressFill");

if(fill){
fill.style.width = percent + "%";
}

const text =
document.getElementById("progressText");

if(text){
text.innerText =
`${completed}/${dailyQuests.length} Complete`;
}

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

const timer =
document.getElementById("questTimer");

if(timer){

timer.innerText =

`NEW QUESTS IN:
${hours}:${minutes}:${seconds}`;

}

},1000);

}


/* =========================
   SHOP
========================= */

function buyItem(item,cost){

if(ownedItems.includes(item)){
alert("Already owned.");
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

loadShop();

alert("Purchased!");

}

function toggleGradient(){

if(!ownedItems.includes("gradient")){
return;
}

if(equippedGradient === "on"){
equippedGradient = "off";
}else{
equippedGradient = "on";
}

localStorage.setItem(
"equippedGradient",
equippedGradient
);

applyTheme();

loadShop();

}

function applyTheme(){

if(equippedGradient === "on"){

document.body.style.background =
"linear-gradient(135deg,#3b82f6,#9333ea)";

}else{

document.body.style.background =
"linear-gradient(135deg,#0f172a,#1e293b)";

}

}

function loadShop(){

const shop =
document.getElementById("shopContainer");

if(!shop) return;

shop.innerHTML = `

<div class="shop-item">

<h2>Gradient</h2>

<p>10 QR Tokens</p>

${
ownedItems.includes("gradient")

?

`<button onclick="toggleGradient()">
${equippedGradient === "on" ? "Disable" : "Enable"}
</button>`

:

`<button onclick="buyItem('gradient',10)">
Buy
</button>`

}

</div>

<div class="shop-item">

<h2>Neon Theme</h2>

<p>30 QR Tokens</p>

${
ownedItems.includes("neon")

?

`<button disabled>
Owned
</button>`

:

`<button onclick="buyItem('neon',30)">
Buy
</button>`

}

</div>

`;

}


/* =========================
   SETTINGS
========================= */

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

function handleAI(){

const text =
aiInput.value.trim();

if(text === "") return;

addMessage(text,"user");

aiInput.value = "";

setTimeout(()=>{

addMessage(
"I am your QuickQR assistant.",
"bot"
);

},500);

}

const sendBtn =
document.getElementById("sendBtn");

if(sendBtn){
sendBtn.onclick = handleAI;
}


/* =========================
   MOBILE MENU FUNCTION
========================= */

function toggleMenu(){

document.getElementById("navLinks")
.classList.toggle("show");

}


/* =========================
   IMPORTANT
========================= */

window.onclick = function(event){

const modal =
document.getElementById("modal");

if(event.target === modal){
closeModal();
}

};


/* =========================
   STARTUP
========================= */

generateDailyQuests();

loadQuests();

startQuestTimer();

loadCreations();

updateCoins();

loadShop();

applyTheme();
