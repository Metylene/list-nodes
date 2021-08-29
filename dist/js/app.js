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

const mapIconsIndexes = ['20', '21', '23', '38', '40', '32', '41', '37'];
const nodesTableBody = $("#nodesTables tbody");
fetch('https://war-service-live.foxholeservices.com/api/worldconquest/maps')
    .then(function (response) {
        return response.json();
    })
    .then(function (hexArray) {
        for (let i = 0; i < hexArray.length; i++) {
            const hex = hexArray[i];
            if (hex.startsWith("Home")) { continue; }

            const hexRowElt = document.createElement("tr");
            const thCell = document.createElement("th");
            thCell.innerText = hex.replace("Hex", "").replace(/([A-Z])/g, ' $1').trim();
            thCell.scope = "row";
            hexRowElt.appendChild(thCell);
            for (let j = 0; j < mapIconsIndexes.length; j++) {
                const tdCell = document.createElement("td");
                tdCell.innerText = 0;
                hexRowElt.appendChild(tdCell);
            }

            nodesTableBody.appendChild(hexRowElt);
            fetch('https://war-service-live.foxholeservices.com/api/worldconquest/maps/' + hex + '/dynamic/public')
                .then(function (response) {
                    return response.json();
                })
                .then(function (hexData) {
                    const mapItems = hexData['mapItems'];
                    if (mapItems == null) { console.log("no mapItems ? ", hexData); return; }
                    for (key in mapItems) {
                        const item = mapItems[key];
                        const iconType = item['iconType'] + "";
                        if (mapIconsIndexes.includes(iconType)) {
                            let itemCell = hexRowElt.children[mapIconsIndexes.indexOf(iconType) + 1];
                            itemCell.innerText = parseInt(itemCell.innerText) + 1;
                        }

                    }

                })
                .catch(function (error) {
                    console.log(error.message);
                })

        }
    });