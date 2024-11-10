const initialText = "StartPage";
let db;
async function startup(){
    writtingEffect();
    db = await dbConnection();
    getWebpages();
}

async function dbConnection() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("InitWebpages", 1);

        request.onsuccess = function(event) {
            const db = event.target.result;
            console.log("Base de datos abierta con éxito");
            resolve(db);
        };

        request.onerror = function(event) {
            console.error("Error al abrir la base de datos", event);
            reject(event);
        };

        // Crear almacén de objetos si es necesario (primera apertura o cambio de versión)
        request.onupgradeneeded = function(event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("webpages")) {
                const objectStore = db.createObjectStore("webpages", { keyPath: "id", autoIncrement: true });
                objectStore.createIndex("webname", "webname", { unique: false });
                objectStore.createIndex("icon", "icon", { unique: false });
                objectStore.createIndex("url", "url", { unique: false });
            }
        };
    });
}

async function dbConnection2(){
    const request = await indexedDB.open("InitialWebpages", 1);
    request.onsuccess = function(event) {
        db = event.target.result;
        console.log("Base de datos abierta con éxito");
    };
    
    request.onerror = function(event) {
        console.error("Error al abrir la base de datos", event);
    };

    request.onupgradeneeded = function(event) {
        db = event.target.result;
        // Crea un almacén de objetos (tabla) si no existe ya
        const objectStore = db.createObjectStore("webpages", { keyPath: "id", autoIncrement: true });
        objectStore.createIndex("webname", "webname", { unique: false });
        objectStore.createIndex("icon", "icon", { unique: true });
        objectStore.createIndex("url", "url", { unique: true });
    };
}

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

function addWebpage(){
    let form = document.getElementById("modalForm");
    let data = new FormData(form);
    let newWeb = {webname: "", icon: "", url: ""};
    for(let pair of data.entries()){
        newWeb[pair[0]] = pair[1];
    }
    console.log(newWeb);
    addToDatabase(newWeb);

    closeModal();
}

function addToDatabase(webpage){
    const transaction = db.transaction(['webpages'], 'readwrite');
    const objectStore = transaction.objectStore("webpages");

    const request = objectStore.add(webpage);
    request.onsuccess = function() {
        console.log("Pagina añadida", webpage);
        addToChart(webpage)
    };

    request.onerror = function(event) {
        console.error("Error al añadir la pagina", event);
    };
}

function getWebpages(){
    const transaction = db.transaction(['webpages'], 'readwrite');
    const objectStore = transaction.objectStore("webpages");

    const request = objectStore.getAll();
    request.onsuccess = function(event) {
        console.log("Webs obtenidas", event.target.result);
        if(event.target.result.length == 0){
            document.getElementById("otherChart").innerText("Click on \"Add page\" button to add a web");
        }
        event.target.result.forEach(element => {
            addToChart(element)
        });
    };
}

function addToChart(data){
    chart = document.getElementById("otherChart");
    if(chart.innerText == "Click on \"Add page\" button to add a web"){
        chart.innerHTML = "";
    }
    chart.innerHTML += `
        <a href="${data.url}" aria-label="${data.id}" class="dflex bordered flexcol">
            <div>${data.icon}</div>
            <div class="">
                ${data.webname}
            </div>
        </a>
    `;
}