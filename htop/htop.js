import fakeSocket from "./modules/fakeSocket.js";
import {
    convertUnit,
    convertTime,
    convertWidthToChars,
} from "./modules/conversions.js";

const ssl = {
    rejectUnauthorized: false,
};
const address = localStorage.getItem("address");
const shouldMockData = address !== "";
const socket = shouldMockData
    ? new WebSocket(`wss://${address}:8765`, ssl)
    : fakeSocket;

let tempProcesses;
let activeProces = 0;
const connectionStatus = document.getElementById("status");
const table = document.getElementById("table");
const ramMem = document.getElementById("total-memory");
const swpMem = document.getElementById("swp-memory");
const info = document.getElementById("info");
const coreUsageContainer = document.getElementById("cores-container");
const coresContainers = [];
connectionStatus.innerHTML = "Connecting...";

const handleMouseClick = (index) => {
    activeProces = index;
    refreshProcesses();
};

const handleKillProces = () => {
    socket.send(tempProcesses[activeProces]["pid"]);
};

const getMoreInfo = (processes, loadAvg, uptime) => {
    const numberOfTasks = processes.length;
    const runningProcesses = [];
    processes.forEach(
        (proces) => proces.status === "R" && runningProcesses.push(proces)
    );
    const systemRunningTime = convertTime(uptime, 60);
    const averageLoad = loadAvg.join(", ");
    const numberOfRunningTasks = runningProcesses.length;
    return `<div class="cell">Tasks: ${numberOfTasks}, Unknown thr; ${numberOfRunningTasks} running</div>
    <div class="cell">Load average: ${averageLoad}</div>
    <div class="cell">Uptime:${systemRunningTime}</div>`;
};

const refreshProcesses = () => {
    table.innerHTML = "";
    tempProcesses.forEach((proces) => {
        const row = document.createElement("tr");
        table.appendChild(row);
        row.addEventListener("click", () => {
            handleMouseClick(proces["id"]);
        });
        row.classList.add(activeProces === proces["id"] && "active");
        row.innerHTML = `<td>${proces["pid"].toString().padStart(7, " ")}</td>
                    <td>${proces["owner"]}</td>
                    <td>${proces["pri"]}</td>
                    <td>${proces["ni"]}</td>
                    <td>${convertUnit(proces["virt"])}</td> 
                    <td>${convertUnit(proces["res"])}</td> 
                    <td>${convertUnit(proces["shr"])}</td> 
                    <td>${proces["status"]}</td>
                    <td>${proces["pid_cpu_usage"].toFixed(1)}</td>
                    <td>${proces["mem_usage"].toFixed(1)}</td>
                    <td>${convertTime(proces["time_plus"] * 60, 60)}</td>
                    <td>${proces["command"]}</td>`;
    });
};

const refreshBars = (data, suffix, prefix, container) => {
    const toFill = convertWidthToChars(container) - 5;
    let filledWithBars, word;
    if (prefix === "%") {
        filledWithBars = Math.ceil((parseFloat(data) * toFill) / 100);
        word = data + prefix;
    } else {
        filledWithBars = Math.ceil((data * toFill) / prefix);
        word =
            convertUnit(data, 1, 3, "K") + "/" + convertUnit(prefix, 1, 3, "K");
    }
    const filledWithSpaces = toFill - filledWithBars;
    const bars = "|".repeat(filledWithBars);
    const spaces = " ".repeat(filledWithSpaces);
    const loadingBar = `${suffix.padStart(3, " ")}[${bars}${spaces}]`;
    const barSplitted = loadingBar.split("");
    const maxNumberToFill = barSplitted.length - word.length;
    for (let i = maxNumberToFill; i < barSplitted.length; i++) {
        barSplitted[i - 1] = word[i + word.length - barSplitted.length];
    }
    return barSplitted.join("");
};

const createCoresContainers = (numberOfCores) => {
    for (let i = 0; i < numberOfCores; i++) {
        const coreContainer = document.createElement("div");
        coresContainers.push(coreContainer);
        coreUsageContainer.appendChild(coreContainer);
        coreContainer.classList.add("cell");
    }
};

document.body.addEventListener("keyup", (event) => {
    const key = event.key;
    switch (key) {
        case "ArrowDown":
            activeProces += 1;
            break;
        case "ArrowUp":
            if (activeProces !== 0) {
                activeProces -= 1;
            }
            break;
        case "Enter":
            handleKillProces(activeProces);
    }
    refreshProcesses();
});

socket.addEventListener("open", () => {
    connectionStatus.style.display = "none";
    document.getElementById("main").style.display = "flex";
    document.getElementById("menu").style.display = "flex";
});

socket.addEventListener("error", (event) => {
    console.log("Websocket error: ", event);
    connectionStatus.innerHTML = "Cannot connect.";
});

socket.addEventListener("close", () => {
    connectionStatus.innerHTML = "Connection closed.";
});
socket.addEventListener("message", (event) => {
    const {
        memory_info: memoryInfo,
        cores_usage: coresUsage,
        processes,
        load_average: loadAvg,
        uptime,
    } = JSON.parse(event.data);
    const {
        total_mem: totalRamMemory,
        used_mem: usedRamMemory,
        swap_mem: totalSwpMemory,
        swap_used: usedSwpMemory,
    } = memoryInfo;

    const coresUsageValues = Object.values(coresUsage).slice(1);
    !coresContainers.length && createCoresContainers(coresUsageValues.length);

    coresUsageValues.forEach((core, index) => {
        coresContainers[index].innerHTML = refreshBars(
            core,
            index.toString(),
            "%",
            coresContainers[index]
        );
    });

    ramMem.innerHTML = refreshBars(
        usedRamMemory,
        "Mem",
        totalRamMemory,
        ramMem
    );

    swpMem.innerHTML = refreshBars(
        usedSwpMemory,
        "Swp",
        totalSwpMemory,
        swpMem
    );

    info.innerHTML = getMoreInfo(processes, loadAvg, uptime);
    processes.forEach((proces, index) => (proces["id"] = index));
    tempProcesses = processes;

    refreshProcesses();
});
