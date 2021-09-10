$ = function (first, second = null) {
    if (second != null) {
        if (first != null) {
            return first.querySelector(second);
        }
    } else if (first != null) {
        return document.querySelector(first);
    }
    console.log("error with parameters function");
    return null;
}
// Salvage  Field   (20)
// Component Field  (21)
// Sulfur Field     (23)
// Salvage Mine     (38)
// Component Mine   (40)
// Sulfur Mine      (32)
// Oil Well         (41)
// Rocket Site      (37)

let regionsName = []; //https://war-service-dev.foxholeservices.com/api/worldconquest/maps
regionsDynamicData = []; // [{regionName : https://war-service-dev.foxholeservices.com/api/worldconquest/maps/' + regionName + '/dynamic/public}, ...]
regionsWithWardenStorage = []; // [{regionName : {storage : [cityName1, cityName2, ...]}, ...] 

const mapIconsIndexes = ['20', '21', '23', '38', '40', '32', '41', '37'];
const nodesTableBody = $("#nodesTables tbody");
fetch('https://war-service-dev.foxholeservices.com/api/worldconquest/maps')
    .then(function (response) {
        return response.json();
    })
    .then(function (hexArray) {
        for (let i = 0; i < hexArray.length; i++) {
            const hex = hexArray[i];
            if (hex.startsWith("Home")) { continue; }

            const hexRowElt = document.createElement("tr");
            const thCell = document.createElement("td");
            thCell.innerText = hex.replace("Hex", "").replace(/([A-Z])/g, ' $1').trim();
            thCell.scope = "row";
            hexRowElt.appendChild(thCell);
            for (let j = 0; j < mapIconsIndexes.length + 1; j++) {
                const tdCell = document.createElement("td");
                tdCell.innerText = 0;
                hexRowElt.appendChild(tdCell);
            }

            nodesTableBody.appendChild(hexRowElt);
            fetch('https://war-service-dev.foxholeservices.com/api/worldconquest/maps/' + hex + '/dynamic/public')
                .then(function (response) {
                    return response.json();
                })
                .then(function (hexData) {
                    const mapItems = hexData['mapItems'];
                    if (mapItems == null) { console.log("no mapItems ? ", hexData); return; }
                    let containWardenItem = false;
                    let containColiItem = false;
                    for (key in mapItems) {
                        const item = mapItems[key];
                        const iconType = item['iconType'] + "";
                        if (item['teamId'] === 'WARDENS') containWardenItem = true;
                        if (item['teamId'] === 'COLONIALS') containColiItem = true;
                        if (mapIconsIndexes.includes(iconType)) {
                            let itemCell = hexRowElt.children[mapIconsIndexes.indexOf(iconType) + 1];
                            itemCell.innerText = parseInt(itemCell.innerText) + 1;
                        }

                    }
                    if (containWardenItem && containColiItem) {
                        let itemCell = hexRowElt.children[hexRowElt.children.length - 1];
                        itemCell.innerText = "Mixte";
                    } else if (containWardenItem) {
                        let itemCell = hexRowElt.children[hexRowElt.children.length - 1];
                        itemCell.innerText = "Warden";
                        hexRowElt.classList.add('warden');
                    } else if (containColiItem) {
                        let itemCell = hexRowElt.children[hexRowElt.children.length - 1];
                        itemCell.innerText = "Colonial";
                        hexRowElt.classList.add('colonial');
                    }
                })
                .catch(function (error) {
                    console.log(error.message);
                })

        }
    });

function sortTableByColumn(thCellElt) {
    const table = document.getElementById('nodesTables');
    const columnId = Array.prototype.indexOf.call(thCellElt.parentNode.children, thCellElt);
    console.log("columnId : ", columnId);
    let i;
    let switching = true;

    while (switching) {
        switching = false;
        let rows = table.rows;
        console.log(rows);
        let shouldSwitch = false;
        // we don't take first row because it's the th header
        for (i = 1; i < (rows.length - 1); i++) {
            let x = rows[i].getElementsByTagName('td')[columnId];
            let y = rows[i + 1].getElementsByTagName('td')[columnId];

            if(x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()){
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
          rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
          switching = true;
        }
    }
}