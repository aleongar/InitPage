const initialText = "StartPage";

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function writtingEffect(){
    let text = "<span class='blinking-text'>_</span>";
    let title = document.getElementById("title");
    title.innerHTML += text;
    for (const char of initialText) {
        console.log(char)
        title.innerText = title.innerText.replace("_", char);
        title.innerText += "_";
        await sleep(200);
    }
    title.innerText = title.innerText.replace("_","");
    title.innerHTML += "<span class='blinking-text'>_</span>"
}

function openModal() {
    document.getElementById("myModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("myModal").style.display = "none";
}

function startup(){
    writtingEffect();
}