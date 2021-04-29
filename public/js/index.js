let transactions = [];
let myChart;
let subscription;
const publicVapidKey = 'BIuAfUWTEuGR2EVFpq-ewJ4DZTve4VzPanG-annHUgdwMH3CAkb2X5H0ka96HbqaESJ2erYZegRTb8bQHZuC34I'
if ("serviceWorker" in navigator) {
    testone().catch(error =>
        console.log("Service Worker registration failed:", error)
    );
}

async function testone() {
    const register = await navigator.serviceWorker.register('./service-worker.js', {
        scope: '/'
    })
    subscription = await register.pushManager
        .subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUnitArray(publicVapidKey)
        });
}

async function send(value) {

    let obj
    if (value > 0) {
        obj = {
            value: value,
            transName: "deposit",
        }
    } else {
        obj = {
            value: value,
            transName: "expense",

        }
    }
   //Send push notification
    await fetch('/subscribe', {
        method: 'POST',
        body: JSON.stringify({
            subscription: subscription,
            obj: obj
        }),
        headers: {
            'Content-type': 'application/json'
        }
    })
}
// 
function urlBase64ToUnitArray(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/ _/g, '/');

    const rawdata = window.atob(base64);
    const outputArray = new Uint8Array(rawdata.length)
    for (let i = 0; i < rawdata.length; i++) {
        outputArray[i] = rawdata.charCodeAt(i);

    }
    return outputArray
}



fetch("/api/transaction")
    .then(response => {
        return response.json();
    })
    .then(data => {
        // save db data on global variable
        transactions = data;

        populateTotal();
        populateTable();
        populateChart();
    });

function populateTotal() {
    // reduce transaction amounts to a single total value
    let total = transactions.reduce((total, t) => {
        return total + parseInt(t.value);
    }, 0);

    let totalEl = document.querySelector("#total");
    totalEl.textContent = total;
}

function populateTable() {
    let tbody = document.querySelector("#tbody");
    tbody.innerHTML = "";

    transactions.forEach(transaction => {
        // create and populate a table row
        let tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${transaction.name}</td>
      <td>${transaction.value}</td>
    `;

        tbody.appendChild(tr);
    });
}

function populateChart() {
    // copy array and reverse it
    let reversed = transactions.slice().reverse();
    let sum = 0;

    // create date labels for chart
    let labels = reversed.map(t => {
        let date = new Date(t.date);
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    });

    // create incremental values for chart
    let data = reversed.map(t => {
        sum += parseInt(t.value);
        return sum;
    });

    // remove old chart if it exists
    if (myChart) {
        myChart.destroy();
    }

    let ctx = document.getElementById("myChart").getContext("2d");

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: "Total Over Time",
                fill: true,
                backgroundColor: "#6666ff",
                data
            }]
        }
    });
}

function sendTransaction(isAdding) {
    let nameEl = document.querySelector("#t-name");
    let amountEl = document.querySelector("#t-amount");
    let errorEl = document.querySelector(".form .error");

    // validate form
    if (nameEl.value === "" || amountEl.value === "") {
        errorEl.textContent = "Missing Information";
        return;
    } else {
        errorEl.textContent = "";
    }

    // create record
    let transaction = {
        name: nameEl.value,
        value: amountEl.value,
        date: new Date().toISOString()
    };

    // if subtracting funds, convert amount to negative number
    if (!isAdding) {
        transaction.value *= -1;
    }

    // add to beginning of current array of data
    transactions.unshift(transaction);

    // re-run logic to populate ui with new record
    populateChart();
    populateTable();
    populateTotal();

    // also send to server
    fetch("/api/transaction", {
            method: "POST",
            body: JSON.stringify(transaction),
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            send(transaction.value)
            return response.json();
        })
        .then(data => {
            if (data.errors) {
                errorEl.textContent = "Missing Information";
            } else {
                // clear form
                nameEl.value = "";
                amountEl.value = "";
            }
        })
        .catch(err => {
            // fetch failed, so save in indexed db
            saveRecord(transaction);

            // clear form
            nameEl.value = "";
            amountEl.value = "";
        });
}




document.querySelector("#add-btn").onclick = function() {
    sendTransaction(true);
};

document.querySelector("#sub-btn").onclick = function() {
    sendTransaction(false);
};