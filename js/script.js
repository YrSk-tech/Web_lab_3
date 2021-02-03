const mList = document.getElementById('m-list');
const searchList = document.getElementById('find-office-tool');
const clearButton = document.getElementById('clear-search');
const name__input = document.getElementById('name');
const producer__input = document.getElementById('producer');
const price__input = document.getElementById('price');
var keys;
var listChemical = [];
var mesList = [];


function setup() {

    var firebaseConfig = {
        apiKey: "AIzaSyB06j96sTKzyHe0tJZ5aESQWhQ8mnFdjjo",
        authDomain: "web-labs-26dc7.firebaseapp.com",
        databaseURL: "https://web-labs-26dc7.firebaseio.com",
        projectId: "web-labs-26dc7",
        storageBucket: "web-labs-26dc7.appspot.com",
        messagingSenderId: "959643053929",
        appId: "1:959643053929:web:1853f02d93930b218017f8",
        measurementId: "G-S95Y92ZTV2"
    };
    firebase.initializeApp(firebaseConfig);
    database = firebase.database();
    console.log("gkdg");
    loadFirebase();
}

function loadFirebase() {
    var ref = database.ref("chemicals");
    ref.on("value", getData, errData);
    ref.orderByChild("name").once('value', function(snapshot) {
        console.log(snapshot.val());
    });
}

function cleanInputs() {
    document.getElementById('name').value = '';
    document.getElementById('producer').value = '';
    document.getElementById('price').value = '';
}

function sendToFirebase() {
    var data = {

        name: name__input.value,
        producer: producer__input.value,
        price: price__input.value
    }
    if (validation() === false) {
        medecineManager = database.ref('chemicals').push(data, finished);
        console.log("Firebase generated key: " + medecineManager.key);
    } else {
        alert("F!")
    }

    cleanInputs();

    function finished(err) {
        if (err) {
            console.log("ooops, something went wrong.");
            console.log(err);
        } else {
            console.log('Data saved successfully');
        }
    }
}

function errData(error) {
    console.log("Something went wrong.");
    console.log(error);
}



setup();
let chemicalsTest = mesList;
searchList.addEventListener('keyup', (searchedString) => {
    const filterString = searchedString.target.value.toLowerCase();
    const findMByName = mesList.filter(tool => {
        return tool.name.toLowerCase().includes(filterString);
    });
    chemicalsTest = findMByName;
    console.log(chemicalsTest)
    displaySearch();
})



clearButton.addEventListener('click', () => {
    searchList.value = '';
    chemicalsTest = mesList;

    showMListSorted();
})

function validation() {
    if (name__input.value == "") {

        return true;
    } else if (producer__input.value == "") {

        return true;
    } else if (price__input.value == "") {

        return true;
    } else {
        return false;
    }
}

function displaySearch() {
    cleanPage();
    displayChemicals(chemicalsTest);
}

function showMListSorted() {
    let sortItem = document.getElementById('sort-select').value;
    console.log(sortItem);
    if (sortItem == 'none') {
        cleanPage();
        displayChemicals(mesList);

    } else if (sortItem == 'name') {
        listChemical = [];
        loadFirebaseToSort();
        cleanPage();
        listChemical.sort(sortByName);
        displayChemicals(listChemical);

    } else if (sortItem == 'price') {
        listChemical = [];
        loadFirebaseToSort();
        cleanPage();
        listChemical.sort(sortByPrice);
        displayChemicals(listChemical);

    }

}

function countPriceOfМ() {
    let priceSum = 0;
    let totalPrice = document.getElementById('total-price');
    mesList.forEach(tool => priceSum += parseInt(tool.price));
    totalPrice.textContent = 'Total price: ' + priceSum + ' ' + 'UAH';
}


function cleanPage() {
    let innerItem = ``;
    mList.innerHTML = innerItem;


}

function sortByName(itemF, itemS) {
    let toolNameF = itemF.name.toLowerCase();
    let toolNameS = itemS.name.toLowerCase();
    if (toolNameF < toolNameS) {
        return -1;
    }
    if (toolNameF > toolNameF) {
        return 1;
    }
    return 0;
}

function sortByPrice(priceF, priceS) {
    return priceF.price - priceS.price;
}

const displayChemicals = (chemicalDisplay) => {
    const displayItems = chemicalDisplay.map((tool) => {
        return `
        <li class="office-tool-item">
            <h2> ${tool.name}</h2>
            <h3> Producer: ${tool.producer}</h3>
            <h3> Price: ${tool.price} UAH </h3>
            <div class="section-contr-button">
                <button class="edit-btn" id="edit-btn"> Edit </button>
                <button class="delete-btn" id="delete-btn"> Delete </button>
            </div>
        </li>
    `
    }).join('');
    mList.innerHTML = displayItems;
}

//displayChemicals(chemicals)
function getData(data) {
    var mes = data.val();
    let innerItem = ` `;

    keys = Object.keys(data.val());
    keys.forEach((medicine, index) => {
        key = keys[index];
        medicine = mes[key];
        mesList.push(medicine);
        innerItem += `
        <li class="medicine-item">
            <h2> ${medicine.name}</h2>
            <h3> Producer: ${medicine.producer}</h3>
            <h3> Price: ${medicine.price} UAH </h3>
            <div class="section-contr-button">
                <button class="edit-btn" id="edit-btn" onclick="editButton(${index})"> Edit </button>
                <button class="delete-btn" id="delete-btn" onclick="deleteButton(${index})"> Delete </button>
            </div>
        </li>
        `;
    });

    mList.innerHTML = innerItem;
}

function editButton(index) {
    key = keys[index];
    if (validation() === false) {
        firebase.database().ref("chemicals/" + key).set({
            name: name__input.value,
            producer: producer__input.value,
            price: price__input.value
        });
    } else {
        alert("!")
    }

    cleanInputs();
}

function deleteButton(index) {

    key = keys[index]
    database.ref("chemicals/" + key).remove();

}

function readData(data) {
    var mes = data.val();
    keys = Object.keys(data.val());
    keys.forEach((medicine, index) => {
        key = keys[index];
        medicine = mes[key];
        console.log(medicine.price);
        listChemical.push(medicine);
    });

}

function loadFirebaseToSort() {
    var ref = database.ref("chemicals");
    ref.on("value", readData, errData);

}