let currentColor = "black";
let currentQRImage = "";
let currentURL = "";

let qrCoins =
parseInt(localStorage.getItem("qrCoins")) || 0;

function updateCoins(){

localStorage.setItem(
"qrCoins",
qrCoins
);

document.getElementById(
"coinAmount"
).innerText = qrCoins;

}

function showPage(page){

const pages = [
"homePage",
"faqPage",
"tutorialPage",
"settingsPage"
];

pages.forEach(id=>{

document.getElementById(id)
.classList.add("hidden");

});

document.getElementById(
page + "Page"
).classList.remove("hidden");

}

function setQRColor(color){

currentColor = color;

}

function generateQR(){

const url =
document.getElementById(
"urlInput"
).value;

if(url.trim() === ""){
alert("Please enter a URL.");
return;
}

currentURL = url;

const qr =
document.getElementById(
"qrcode"
);

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

},500);

}

function saveQR(){

const name =
document.getElementById(
"qrName"
).value;

if(name.trim() === ""){
alert("Enter a QR name.");
return;
}

const creations =
JSON.parse(
localStorage.getItem(
"qrCreations"
)
) || [];

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

alert("Saved!");

}

function loadCreations(){

const creationsDiv =
document.getElementById(
"creations"
);

creationsDiv.innerHTML = "";

const creations =
JSON.parse(
localStorage.getItem(
"qrCreations"
)
) || [];

creations.forEach(item=>{

const card =
document.createElement("div");

card.className =
"creation-card";

card.innerHTML = `
<img src="${item.image}">
<h3>${item.name}</h3>
`;

card.onclick = ()=>{

openInfo(item);

};

creationsDiv.appendChild(card);

});

}

function openInfo(item){

document.getElementById(
"modal"
).style.display = "flex";

document.getElementById(
"modalBody"
).innerHTML = `

<img src="${item.image}">

<h2>${item.name}</h2>

<p>
${item.url}
</p>

<p>
${item.created}
</p>

`;

}

function closeModal(){

document.getElementById(
"modal"
).style.display = "none";

}

function clearQRData(){

if(confirm("Delete all QR codes?")){

localStorage.removeItem(
"qrCreations"
);

loadCreations();

}

}

const aiButton =
document.getElementById(
"aiButton"
);

const aiChat =
document.getElementById(
"aiChat"
);

aiButton.onclick = ()=>{

if(aiChat.style.display === "flex"){

aiChat.style.display = "none";

}else{

aiChat.style.display = "flex";

}

};

function addMessage(text,type){

const div =
document.createElement("div");

div.className =
`aiMsg ${type}`;

div.innerText = text;

document.getElementById(
"aiMessages"
).appendChild(div);

}

function generateAnswer(question){

question =
question.toLowerCase();

if(question.includes("save")){
return "Press Save QR.";
}

if(question.includes("generate")){
return "Paste a URL and press Generate QR.";
}

return "Ask about QuickQR.";

}

function handleAI(){

const input =
document.getElementById(
"aiInput"
);

const text =
input.value.trim();

if(text === "") return;

addMessage(text,"user");

input.value = "";

setTimeout(()=>{

const answer =
generateAnswer(text);

addMessage(answer,"bot");

},500);

}

document.getElementById(
"sendBtn"
).onclick = handleAI;

updateCoins();
loadCreations();