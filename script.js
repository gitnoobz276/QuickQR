/* =========================
   VARIABLES
========================= */

let currentColor = "#000000";
let currentQRImage = "";
let currentURL = "";

let qrCoins =
parseInt(localStorage.getItem("qrCoins")) || 0;

/* =========================
   PAGE SYSTEM
========================= */

function showPage(page){

const pages = [
"homePage",
"faqPage",
"tutorialPage",
"settingsPage"
];

pages.forEach(id=>{

const el = document.getElementById(id);

if(el){
el.classList.add("hidden");
}

});

const target =
document.getElementById(page + "Page");

if(target){
target.classList.remove("hidden");
}

}

/* =========================
   QR COLOUR
========================= */

function setQRColor(color){

currentColor = color;

document.querySelectorAll(".color")
.forEach(c=>{

c.style.transform = "scale(1)";

});

event.target.style.transform = "scale(1.2)";

}

/* =========================
   QR GENERATOR
========================= */

function generateQR(){

const url =
document.getElementById("urlInput").value.trim();

if(url === ""){
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

animateQR();

},300);

}

/* =========================
   QR ANIMATION
========================= */

function animateQR(){

const qr =
document.querySelector("#qrcode canvas");

if(!qr) return;

qr.style.opacity = "0";
qr.style.transform = "scale(0.7)";

setTimeout(()=>{

qr.style.transition = "0.5s";
qr.style.opacity = "1";
qr.style.transform = "scale(1)";

},50);

}

/* =========================
   SAVE QR
========================= */

function saveQR(){

const name =
document.getElementById("qrName").value.trim();

if(name === ""){
alert("Please enter a QR name.");
return;
}

const creations =
JSON.parse(localStorage.getItem("qrCreations")) || [];

creations.unshift({
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

showToast("QR Code Saved!");

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
JSON.parse(localStorage.getItem("qrCreations")) || [];

if(creations.length === 0){

container.innerHTML = `
<p style="opacity:0.7;">
No QR codes created yet.
</p>
`;

return;

}

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

container.appendChild(card);

});

updateStats();

}

/* =========================
   INFO MODAL
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
<b>Colour:</b> ${item.color}
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
   SETTINGS
========================= */

function changeTheme(mode){

if(mode === "light"){

document.body.style.background =
"linear-gradient(135deg,#e2e8f0,#cbd5e1)";

document.body.style.color = "black";

}else{

document.body.style.background =
"linear-gradient(135deg,#0f172a,#1e293b)";

document.body.style.color = "white";

}

}

function changeAccent(color){

document.querySelectorAll("button")
.forEach(btn=>{

btn.style.background = color;

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

showToast("QR Data Imported!");

};

reader.readAsText(file);

}

function clearQRData(){

if(confirm("Delete all QR codes?")){

localStorage.removeItem("qrCreations");

loadCreations();

showToast("QR Codes Cleared");

}

}

/* =========================
   STATS
========================= */

function updateStats(){

const creations =
JSON.parse(localStorage.getItem("qrCreations")) || [];

let stats =
document.getElementById("stats");

if(!stats){

stats =
document.createElement("div");

stats.id = "stats";

stats.style.marginTop = "20px";

stats.style.opacity = "0.8";

document.querySelector("#homePage .card")
.appendChild(stats);

}

stats.innerHTML = `
<b>Total QR Codes:</b> ${creations.length}
`;

}

/* =========================
   TOAST
========================= */

function showToast(text){

const toast =
document.createElement("div");

toast.innerText = text;

toast.style.position = "fixed";
toast.style.bottom = "30px";
toast.style.left = "50%";
toast.style.transform = "translateX(-50%)";
toast.style.background = "#3b82f6";
toast.style.padding = "14px 22px";
toast.style.borderRadius = "14px";
toast.style.zIndex = "99999";
toast.style.fontWeight = "bold";

document.body.appendChild(toast);

setTimeout(()=>{

toast.style.transition = "0.5s";
toast.style.opacity = "0";

},1800);

setTimeout(()=>{

toast.remove();

},2400);

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

function generateAIResponse(question){

question =
question.toLowerCase();

if(question.includes("hello") ||
question.includes("hi")){

return "Hello! Need help using QuickQR?";
}

if(question.includes("save")){

return "Generate a QR code first, then press Save QR Code.";
}

if(question.includes("colour")){

return "Use the colour palette before generating the QR.";
}

if(question.includes("tutorial")){

return "Open the Tutorial page from the navbar.";
}

if(question.includes("settings")){

return "The Settings page lets you export, import, and customise QuickQR.";
}

if(question.includes("who made you")){

return "I am the QuickQR Assistant.";
}

return "I understand your message. Try asking about QR codes, colours, saving, settings, or tutorials.";

}

function handleAI(){

const text =
aiInput.value.trim();

if(text === "") return;

addMessage(text,"user");

aiInput.value = "";

setTimeout(()=>{

const response =
generateAIResponse(text);

addMessage(response,"bot");

},700);

}

const sendBtn =
document.getElementById("sendBtn");

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

});

}

/* =========================
   STARTUP
========================= */

loadCreations();

updateStats();

showToast("Welcome to QuickQR!");
