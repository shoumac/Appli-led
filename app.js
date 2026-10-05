const progression = JSON.parse(localStorage.getItem("progression")) || {
sessions:0,
qcm:0,
examens:0
};

function updateProgress() {
const total =
progression.sessions +
progression.qcm +
progression.examens;

const pourcentage = Math.min(total,100);

const bar = document.getElementById("progress-bar");
const txt = document.getElementById("progress-text");

if(bar){
bar.style.width = pourcentage + "%";
}

if(txt){
txt.innerText = pourcentage + "%";
}

localStorage.setItem(
"progression",
JSON.stringify(progression)
);
}

function ajouterSession(){
progression.sessions += 5;
updateProgress();
}

function ajouterQCM(){
progression.qcm += 10;
updateProgress();
}

function ajouterExamen(){
progression.examens += 15;
updateProgress();
}

updateProgress();
