export const convertUnit = (value, n = 0, i = 5, prefix = "") => {
    const units = ["", prefix, "M", "G"];
    value = parseFloat(value);
    if ((Math.ceil(value).toString() + units[n]).length > i) {
        return convertUnit(value / Math.pow(2, 10), n + 1, i, prefix);
    } else {
        let rounding = units[n] == "G" ? 10 : 1;
        rounding = units.includes("K") ? 100 : rounding;
        return Math.floor(value * rounding) / rounding + units[n];
    }
};

export const convertTime = (uptime, secondsType) => {
    uptime = Math.ceil(uptime);

    let hours = Math.floor((uptime / 60 / 60) % 24);
    hours = hours.toString().padStart(2, "0");
    let minutes = Math.floor((uptime / 60) % 60);
    minutes = minutes.toString().padStart(2, "0");
    let seconds = uptime % secondsType;
    seconds = seconds.toString().padStart(2, "0");

    return ` ${hours}:${minutes}:${seconds}`;
};

export const convertWidthToChars = (div) => {
    const testChar = "|";
    const testSpan = document.createElement("span");
    testSpan.style.visibility = "hidden";
    testSpan.style.whiteSpace = "nowrap";
    testSpan.textContent = testChar;
    div.appendChild(testSpan);

    const charWidth = testSpan.getBoundingClientRect().width;
    const divWidth = div.clientWidth;

    div.removeChild(testSpan);
    return Math.floor(divWidth / charWidth);
};
