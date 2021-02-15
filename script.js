let toggleValue = false;
window.onload = function () {
    preProcess();
}

function preProcess() {
    var a = new Date().toLocaleDateString().split('/');
    currDate = a[2] + "-" + a[0] + "-" + a[1];
    document.getElementById("dateDiv").innerHTML += '<input type="date" id="start" name="trip-start" value="' + currDate + '" min="2020-02-11" max="2090-12-31">';


    //Fetching reminder and notes from cached location
    let keys = [];
    document.getElementById("reminderList").innerHTML = '';
    document.getElementById("notesList").innerHTML = '';
    document.getElementById("completedList").innerHTML = '';

    keys = Object.keys(localStorage);
    if (keys.length > 0) {
        keys.forEach(key => {
            let savedAsset = localStorage.getItem(key);
            if (savedAsset.toString().includes("Reminder")) {
                document.getElementById("reminderList").innerHTML += savedAsset;
            } else if (savedAsset.toString().includes("Notes")) {
                document.getElementById("notesList").innerHTML += savedAsset;

            } else {
                document.getElementById("completedList").innerHTML += savedAsset;
                let childNodes = document.getElementById('completedList').querySelectorAll('.delete-btn');
                let individualTasks = document.getElementById('completedList').childNodes;
                Array.from(childNodes).forEach(node => node.style.display = "none");
                Array.from(individualTasks).forEach(task => task.style.cssText += "border-right:6px solid green;border-left:none;");


            }

        })
        Array.from(document.getElementsByTagName("label")).forEach(labl => {
            labl.style.cssText = "display: inline;";
        });
    }

    //Adding event listenrs to key elements
    inputElement = document.getElementById("taskCreator");
    plusElement = document.getElementById('plus');
    addElement = document.getElementById("add");
    descriptionElement = document.getElementById("taskCreatorDesc");
    priorityElement = document.getElementById("taskCreatorPriority");
    categoryElement = document.getElementById("taskCreatorCategory");
    colorElement = document.getElementById("colorDiv");

    inputElement.addEventListener('focus', myFocusFunction);
    inputElement.addEventListener('blur', myBlurFunction);
    inputElement.addEventListener('keydown', saveIt);
    plusElement.addEventListener('click', plusToggle);
    addElement.addEventListener('click', saveItBtn);
    addClickEventToDeleteButton();
}

function addClickEventToDeleteButton() {
    deleteElements = document.getElementsByClassName("delete-btn");
    Array.from(deleteElements).forEach(elem => {
        elem.addEventListener('click', deleteTask)
    });
}

function hexToRgb(hexCode) {

    let r = g = b = 0;
    r = "0x" + hexCode[1] + hexCode[2];
    g = "0x" + hexCode[3] + hexCode[4];
    b = "0x" + hexCode[5] + hexCode[6];

    return "rgba(" + +r + "," + +g + "," + +b + ",0.3);"
}

function plusToggle() {

    let elem = document.getElementsByClassName("settings")[0];
    if (toggleValue) {
        elem.style.opacity = 0;
        plusElement.style.transform = "rotate(0deg)";
    } else {
        elem.style.opacity = 1;
        plusElement.style.transform = "rotate(90deg)";
    }
    toggleValue = !toggleValue;
}

function myFocusFunction(e) {
    e.target.style.cssText = "transition: 0.5s ease 0s;transform: scale(1.02);";
}

function myBlurFunction(e) {
    e.target.style.cssText = "transition: 0.5s ease 0s;transform: scale(1);";
}

function deleteTask(e) {

    console.log("inside");
    let opacityValue = 1;
    let targetElement = e.target.parentElement.parentElement;
    targetElement.style.cssText += "text-decoration: line-through; opacity:0.9";

    let timerID = setInterval(function () {
        console.log("inside 2");
        targetElement.style.cssText += "opacity:" + opacityValue + "";
        opacityValue -= 0.20;
        if (opacityValue <= 0) {
            clearInterval(timerID);
        }
    }, 80);

    let targetElementString = targetElement.outerHTML;
    let index = targetElementString.indexOf('data-id="');
    let taskId = targetElementString.substring(index + 9, index + 22);
    let cachedTask = localStorage.getItem(taskId);

    if (cachedTask.includes("Reminder")) {
        var res = cachedTask.replace('data-category="Reminder"', 'data-category="Completed"');
        localStorage.setItem(taskId, res);
    } else {
        var res = cachedTask.replace('data-category="Notes"', 'data-category="Completed"');
        localStorage.setItem(taskId, res);
    }

    preProcess();
}

function saveIt(e) {
    if (e.code == 'Enter') {
        saveItBtn(e);
    }

}


function saveItBtn(e) {

    let data = inputElement.value;
    if (data.length > 0) {

        let descData = descriptionElement.value;
        let taskId = Date.now();
        let priorityValue = priorityElement.options[priorityElement.selectedIndex].text;
        let categoryValue = categoryElement.options[categoryElement.selectedIndex].text;
        dateValue = new Date(document.getElementById("start").value).toLocaleDateString();
        colorValue = colorElement.value;

        if (dateValue == "Invalid Date") {
            dateValue = new Date().toLocaleDateString();
        }

        let insertTask = '<div class="saved-item-label" data-category="' + categoryValue + '" data-id="' + taskId + '" style="display: flex;flex-flow: row; border-left: 4px solid ' + colorValue + ';background-color:' + hexToRgb(colorValue) + ';"><div class="item pr-date-msg"><p>' + priorityValue + '</p><p>' + dateValue + '</p></div><div class="item action-msg"><p class="title-msg">' + data + '</p><p class="description-msg">' + descData + '</p></div><div class="item delete-btn"><i class="fas fa-check-circle fa-2x"></i></div></div>';

        if (categoryValue == "Reminder") {
            document.getElementById("reminderList").innerHTML += insertTask;
        } else {
            document.getElementById("notesList").innerHTML += insertTask;
        }

        localStorage.setItem(taskId, insertTask);
        inputElement.value = descriptionElement.value = "";
        inputElement.style.cssText = "border: none";
        document.getElementById("successMsg").style.display = "flex";
        document.getElementById("errorMsg").style.display = "none";
        addClickEventToDeleteButton();

    } else {
        inputElement.style.cssText = "border: 2px solid red";
        document.getElementById("errorMsg").style.display = "flex";
        document.getElementById("successMsg").style.display = "none";

    }
}