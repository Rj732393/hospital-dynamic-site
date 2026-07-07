// Gopal Hospital And Nature Care — Shared JS

document.addEventListener("DOMContentLoaded",()=>{

const header=document.getElementById("mainHeader");

function onScroll(){
if(!header)return;
window.scrollY>10?header.classList.add("scrolled"):header.classList.remove("scrolled");
}

window.addEventListener("scroll",onScroll);
onScroll();


// MOBILE MENU

const hamburgerBtn=document.getElementById("hamburgerBtn");
const hamburgerIcon=document.getElementById("hamburgerIcon");
const mobileMenu=document.getElementById("mobileMenu");

if(hamburgerBtn&&mobileMenu){

hamburgerBtn.onclick=()=>{

mobileMenu.classList.toggle("open");

if(hamburgerIcon)
hamburgerIcon.textContent=mobileMenu.classList.contains("open")?"close":"menu";

};


mobileMenu.querySelectorAll("a").forEach(a=>{

a.onclick=()=>{

mobileMenu.classList.remove("open");

if(hamburgerIcon)
hamburgerIcon.textContent="menu";

};

});

}



// SCROLL REVEAL

const revealEls=document.querySelectorAll(".reveal,.reveal-group");

if("IntersectionObserver" in window){

const io=new IntersectionObserver(entries=>{

entries.forEach(e=>{

if(e.isIntersecting){

e.target.classList.add("active");
io.unobserve(e.target);

}

});

},{threshold:.12});


revealEls.forEach(el=>io.observe(el));

}



// TABS

document.querySelectorAll(".tab-btn").forEach(btn=>{

btn.onclick=()=>{

let tab=btn.dataset.tab;


document.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("active"));

btn.classList.add("active");


document.querySelectorAll(".tab-content").forEach(c=>c.classList.remove("active"));


let target=document.getElementById("tab-"+tab);

if(target)target.classList.add("active");

};

});



// TOAST

window.showToast=function(msg){

let toast=document.getElementById("toast");
let toastMsg=document.getElementById("toastMsg");

if(!toast)return;

if(toastMsg)
toastMsg.innerText=msg||"Done!";

toast.classList.add("show");


setTimeout(()=>{
toast.classList.remove("show");
},3000);

};



// APPOINTMENT

let appt=document.getElementById("appointmentForm");

if(appt){

appt.onsubmit=e=>{

e.preventDefault();

showToast("Appointment request received! We will call you shortly.");

appt.reset();

};

}



// CONTACT FORM

let contact=document.getElementById("contactForm");

if(contact){

contact.onsubmit=async e=>{

e.preventDefault();


let data={

cName:cName.value,
cPhone:cPhone.value,
cEmail:cEmail.value,
cSubject:cSubject.value,
cMessage:cMessage.value

};


try{

let res=await fetch("http://localhost:5000/api/contacts",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(data)

});


let result=await res.json();


if(res.ok){

showToast("Message sent! We will get back to you soon.");
contact.reset();

}
else{

showToast(result.message);

}


}
catch(err){

console.log(err);
showToast("Server error. Please try again.");

}

};

}


// HOME PROGRAM LOAD

loadHomePrograms();

});




// LOAD HOME PROGRAMS

async function loadHomePrograms(){

try{


let res=await fetch("http://localhost:5000/api/programs");

let result=await res.json();

let programs=result.data || result;



let ongoing=document.getElementById("home-ongoing-programs");
let previous=document.getElementById("home-previous-programs");


if(!ongoing||!previous)return;


let ongoingHTML="";
let previousHTML="";


programs.forEach(program=>{


let image=program.ImageUrl
?`http://localhost:5000${program.ImageUrl}`
:program.image||"";


let title=program.Title||program.title;
let desc=program.ShortDescription||program.Description||program.description;


let card=`

<div class="bg-white rounded-2xl border border-gray-200 shadow hover:shadow-xl transition overflow-hidden">

${image?
`<img src="${image}" class="w-full h-48 object-cover">`
:""}

<div class="p-6">

<h3 class="text-xl font-bold text-primary mb-3">
${title}
</h3>

<p class="text-gray-600 mb-4">
${desc}
</p>


<a href="program-details.html?id=${program.Id||program._id}"
class="text-primary font-bold">
Read More →
</a>

</div>

</div>

`;


if((program.Status||program.status||"").toLowerCase()=="ongoing" ||
(program.type||"").toLowerCase()=="ongoing"){

ongoingHTML+=card;

}
else{

previousHTML+=card;

}


});


ongoing.innerHTML=ongoingHTML;

previous.innerHTML=previousHTML;


}
catch(err){

console.log("Programs Loading Error:",err);

}

}




// PROGRAM POPUP

function openProgram(id){

fetch(`http://localhost:5000/api/programs/${id}`)
.then(r=>r.json())
.then(data=>{


let box=`

<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

<div class="bg-white rounded-3xl p-8 max-w-xl w-full">

<h2 class="text-2xl font-bold text-primary mb-4">
${data.title||data.Title}
</h2>


<img src="${data.image||data.ImageUrl}" class="rounded-xl mb-4">


<p class="text-gray-600">
${data.description||data.Description}
</p>


<button onclick="this.closest('.fixed').remove()"
class="mt-5 bg-primary text-white px-6 py-3 rounded-xl">
Close
</button>


</div>

</div>`;


document.body.insertAdjacentHTML("beforeend",box);


});

}