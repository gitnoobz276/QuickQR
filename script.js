/* =========================
   VARIABLES
========================= */

let currentColor = "#000000";
let currentQRImage = "";
let currentURL = "";

let qrCoins =
parseInt(localStorage.getItem("qrCoins")) || 0;

let usedColours =
JSON.parse(localStorage.getItem("usedColours")) || [];

let ownedThemes =
JSON.parse(localStorage.getItem("ownedThemes")) || [];

let enabledTheme =
localStorage.getItem("enabledTheme") || "default";

/* =========================
   QUEST SYSTEM
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

/* =========================
   GENERATE DAILY QUESTS
========================= */

function generateDailyQuests(){

const today =
new Date().toDateString();

const savedDate =
localStorage.getItem("questDate");

if(savedDate === today) return;

dailyQuests = [];

for(let i = 0; i < 3; i++){

const randomQuest =
possibleQuests[
Math.floor(
Math.random() *
possibleQuests.length
)
];

dailyQuests.push(randomQuest);

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

/* =========================
   LOAD QUESTS
========================= */

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

/* =========================
   UPDATE QUEST
========================= */

function updateQuest(type){

dailyQuests.forEach((quest,index)=>{

if(quest.type === type){

if(
(questProgress[index] || 0)
< quest.goal
){

questProgress[index] =
(questProgress[index] || 0)
+ 1;

}

}

});

localStorage.setItem(
"questProgress",
JSON.stringify(questProgress)
);

loadQuests();

}

/* =========================
   CLAIM QUEST
========================= */

function claimQuest(index){

const quest =
dailyQuests[index];

if(claimedQuests[index]){

alert("Already claimed.");
return;

}

if(
(questProgress[index] || 0)
< quest.goal
){

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

/* =========================
   QUEST BAR
========================= */

function updateQuestBar(){

let completed = 0;

dailyQuests.forEach((quest,index)=>{

if(claimedQuests[index]){
completed++;
}

});

const percent =
(completed / dailyQuests.length)
* 100;

const fill =
document.getElementById("progressFill");

if(fill){
fill.style.width =
percent + "%";
}

const text =
document.getElementById("progressText");

if(text){

text.innerText =
`${completed}/${dailyQuests.length} Complete`;

}

}

/* =========================
   QUEST TIMER
========================= */

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

const el =
document.getElementById(id);

if(el){
el.classList.add("hidden");
}

});

const target =
document.getElementById(
page + "Page"
);

if(target){
target.classList.remove("hidden");
}

if(page === "faq"){
updateQuest("faq");
}

/* close mobile menu */

const nav =
document.getElementById("navLinks");

if(window.innerWidth <= 700){

if(nav){
nav.classList.remove("show");
}

}

}

/* =========================
   MOBILE MENU
========================= */

function toggleMenu(){

const nav =
document.getElementById("navLinks");

if(nav){

nav.classList.toggle("show");

}

}

/* =========================
   QR COLOR
========================= */

function setQRColor(color){

currentColor = color;

if(!usedColours.includes(color)){

usedColours.push(color);

localStorage.setItem(
"usedColours",
JSON.stringify(usedColours)
);

}

if(usedColours.length >= 3){

updateQuest("colour");

}

}

/* =========================
   GENERATE QR
========================= */

function generateQR(){

const url =
document.getElementById("urlInput")
.value;

if(url.trim() === ""){

alert("Enter a URL.");
return;

}

currentURL = url;

const qr =
document.getElementById("qrcode");

qr.innerHTML = "";

new QRCode(qr,{

text:url,
width:220,
height:220,
colorDark:currentColor,
colorLight:"#ffffff"

});

setTimeout(()=>{

const canvas =
qr.querySelector("canvas");

if(!canvas) return;

currentQRImage =
canvas.toDataURL("image/png");

document.getElementById(
"afterGenerate"
).classList.remove("hidden");

updateQuest("generate");

},500);

}

/* =========================
   SAVE QR
========================= */

function saveQR(){

const name =
document.getElementById("qrName")
.value;

if(name.trim() === ""){

alert("Enter a QR name.");
return;

}

const creations =
JSON.parse(
localStorage.getItem("qrCreations")
) || [];

creations.push({

name:name,
image:currentQRImage,
url:currentURL,
color:currentColor,
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

const container =
document.getElementById("creations");

if(!container) return;

container.innerHTML = "";

const creations =
JSON.parse(
localStorage.getItem("qrCreations")
) || [];

creations.forEach(item=>{

const card =
document.createElement("div");

card.className =
"creation-card";

card.innerHTML = `

<img src="${item.image}">

<div class="creation-name">
${item.name}
</div>

`;

card.onclick = ()=>{

openInfo(item);

};

container.appendChild(card);

});

}

/* =========================
   OPEN INFO
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

const amount =
document.getElementById("coinAmount");

if(amount){

amount.innerText = qrCoins;

}

}

/* =========================
   SETTINGS
========================= */

function changeTheme(mode){

if(mode === "light"){

document.body.style.background =
"linear-gradient(135deg,#f1f5f9,#cbd5e1)";

document.body.style.color =
"black";

}else{

document.body.style.background =
"linear-gradient(135deg,#0f172a,#1e293b)";

document.body.style.color =
"white";

}

}

function changeAccent(color){

document.querySelectorAll("button")
.forEach(btn=>{

btn.style.background = color;

});

}

function clearQRData(){

if(confirm("Delete all QR codes?")){

localStorage.removeItem(
"qrCreations"
);

loadCreations();

}

}

/* =========================
   THEME SHOP
========================= */

function buyTheme(theme,cost){

if(ownedThemes.includes(theme)){

alert("Already owned.");
return;

}

if(qrCoins < cost){

alert("Not enough QR Tokens.");
return;

}

qrCoins -= cost;

ownedThemes.push(theme);

localStorage.setItem(
"ownedThemes",
JSON.stringify(ownedThemes)
);

updateCoins();

alert("Theme purchased!");

loadThemeShop();

}

function enableTheme(theme){

if(!ownedThemes.includes(theme)){

alert("Buy it first.");
return;

}

enabledTheme = theme;

localStorage.setItem(
"enabledTheme",
theme
);

applyTheme();

loadThemeShop();

}

function disableTheme(){

enabledTheme = "default";

localStorage.setItem(
"enabledTheme",
"default"
);

applyTheme();

loadThemeShop();

}

function applyTheme(){

if(enabledTheme === "neon"){

document.body.style.background =
"linear-gradient(135deg,#00ffff,#0f172a)";

}

else if(enabledTheme === "sunset"){

document.body.style.background =
"linear-gradient(135deg,#ff512f,#dd2476)";

}

else if(enabledTheme === "forest"){

document.body.style.background =
"linear-gradient(135deg,#134e5e,#71b280)";

}

else{

document.body.style.background =
"linear-gradient(135deg,#0f172a,#1e293b)";

}

}

function loadThemeShop(){

const container =
document.getElementById("shopContainer");

if(!container) return;

container.innerHTML = "";

const themes = [

{
name:"neon",
cost:30
},

{
name:"sunset",
cost:30
},

{
name:"forest",
cost:30
},

{
name:"galaxy",
cost:30
}

];

themes.forEach(theme=>{

const owned =
ownedThemes.includes(theme.name);

const active =
enabledTheme === theme.name;

const div =
document.createElement("div");

div.className = "shop-item";

div.innerHTML = `

<h3>${theme.name}</h3>

<p>
${theme.cost} QR Tokens
</p>

${
owned ?

active ?

`<button onclick="disableTheme()">
Disable
</button>`

:

`<button onclick="enableTheme('${theme.name}')">
Enable
</button>`

:

`<button onclick="buyTheme('${theme.name}',${theme.cost})">
Buy
</button>`

}

`;

container.appendChild(div);

});

}

/* =========================
   EXPORT / IMPORT
========================= */

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

const sendBtn =
document.getElementById("sendBtn");

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

function generateQuickQRAnswer(question){

question =
question.toLowerCase();

if(
question.includes("generate")
){

return
"Paste a URL into the textbox and press Generate QR Code.";

}

if(
question.includes("save")
){

return
"After generating your QR code, type a name and press Save QR Code.";

}

if(
question.includes("quest")
){

return
"Complete quests to earn QR Tokens.";

}

if(
question.includes("theme")
){

return
"Open the Theme Shop to buy and enable themes.";

}

if(
question.includes("faq")
){

return
"FAQ contains answers to common QuickQR questions.";

}

if(
question.includes("tutorial")
){

return
"Open Tutorial in the navbar to watch the QuickQR guide video.";

}

if(
question.includes("token")
||
question.includes("coin")
){

return
"You earn QR Tokens by completing quests.";

}

if(
question.includes("colour")
||
question.includes("color")
){

return
"Click one of the colour circles before generating a QR code.";

}

if(
question.includes("download")
){

return
"Open a saved QR code and screenshot it or save it.";

}

if(
question.includes("settings")
){

return
"You can change themes, accent colours, import/export QR data and clear saved QR codes.";

}

return
"I can only answer questions related to QuickQR features.";

}

function handleAI(){

const text =
aiInput.value.trim();

if(text === "") return;

addMessage(text,"user");

aiInput.value = "";

setTimeout(()=>{

const answer =
generateQuickQRAnswer(text);

addMessage(answer,"bot");

},700);

}

if(sendBtn){

sendBtn.onclick = handleAI;

}

if(aiInput){

aiInput.addEventListener(
"keypress",
function(e){

if(e.key === "Enter"){

handleAI();

}

}
);

}

/* =========================
   STARTUP
========================= */

generateDailyQuests();

loadQuests();

loadCreations();

loadThemeShop();

updateCoins();

startQuestTimer();

applyTheme();
