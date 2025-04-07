const randomCommands = [
    "/sbin/init ",
    "/init ",
    "plan9 --control-socket 7 --log-level 4 --server-fd 8 --pipe-fd 10 --log-truncate ",
    "/usr/lib/systemd/systemd-journald ",
    "/usr/lib/systemd/systemd-udevd ",
    "/usr/lib/systemd/systemd-resolved ",
    "/usr/lib/systemd/systemd-timesyncd ",
    "/usr/sbin/cron -f -P ",
    "@dbus-daemon --system --address=systemd: --nofork --nopidfile --systemd-activation --syslog-only ",
    "/usr/lib/systemd/systemd-logind ",
    "/usr/libexec/wsl-pro-service -vv ",
    "/usr/sbin/rsyslogd -n -iNONE ",
    "/sbin/agetty -o -p -- \\u --noclear --keep-baud - 115200,38400,9600 vt220 ",
    "/sbin/agetty -o -p -- \\u --noclear - linux ",
    "/usr/bin/python3 /usr/share/unattended-upgrades/unattended-upgrade-shutdown --wait-for-signal ",
    "/bin/login -f       ",
    "/init ",
    "/init ",
    'sh -c "$VSCODE_WSL_EXT_LOCATION/scripts/wslServer.sh" 4437686ffebaf200fa4a6e6e67f735f3edf24ada stable code-server .vscode-server --host=127.0.0.1 --port=0 --connection-token=3304983379-3473149471-2919823208-1958754915 --use-host-proxy --without-browser-env-var --disable-websocket-compression --accept-server-license-terms --telemetry-level=all ',
    "sh /mnt/c/Users/Nauka/.vscode/extensions/ms-vscode-remote.remote-wsl-0.88.5/scripts/wslServer.sh 4437686ffebaf200fa4a6e6e67f735f3edf24ada stable code-server .vscode-server --host=127.0.0.1 --port=0 --connection-token=3304983379-3473149471-2919823208-1958754915 --use-host-proxy --without-browser-env-var --disable-websocket-compression --accept-server-license-terms --telemetry-level=all ",
    "sh /home/piotr/.vscode-server/bin/4437686ffebaf200fa4a6e6e67f735f3edf24ada/bin/code-server --host=127.0.0.1 --port=0 --connection-token=3304983379-3473149471-2919823208-1958754915 --use-host-proxy --without-browser-env-var --disable-websocket-compression --accept-server-license-terms --telemetry-level=all ",
    "/home/piotr/.vscode-server/bin/4437686ffebaf200fa4a6e6e67f735f3edf24ada/node /home/piotr/.vscode-server/bin/4437686ffebaf200fa4a6e6e67f735f3edf24ada/out/server-main.js --host=127.0.0.1 --port=0 --connection-token=3304983379-3473149471-2919823208-1958754915 --use-host-proxy --without-browser-env-var --disable-websocket-compression --accept-server-license-terms --telemetry-level=all ",
    "/usr/lib/systemd/systemd --user ",
    "(sd-pam) ",
    "-bash ",
    "/init ",
    "/init ",
    "/home/piotr/.vscode-server/bin/4437686ffebaf200fa4a6e6e67f735f3edf24ada/node -e const net = require('net'); process.stdin.pause(); const client = net.createConnection({ host: '127.0.0.1', port: 41823 }, () => { client.pipe(process.stdout); process.stdin.pipe(client); }); client.on('close', function (hadError) { console.error(hadError ? 'Remote close with error' : 'Remote close'); process.exit(hadError ? 1 : 0); }); client.on('error', function (err) { process.stderr.write(err && (err.stack || err.message) || String(err)); }); ",
    "/home/piotr/.vscode-server/bin/4437686ffebaf200fa4a6e6e67f735f3edf24ada/node /home/piotr/.vscode-server/bin/4437686ffebaf200fa4a6e6e67f735f3edf24ada/out/bootstrap-fork --type=ptyHost --logsPath /home/piotr/.vscode-server/data/logs/20250405T131738 ",
    "/init ",
    "/init ",
];

let uptime = 4500.0;
const processes = [];

const getRandom = (min, max, floor = 0) => {
    const divider = Math.pow(10, floor);
    return Math.floor((Math.random() * (max - min) + min) * divider) / divider;
};

for (let i = 0; i < 31; i++) {
    processes.push({
        pid: i,
        owner: "root",
        pri: 20,
        ni: 0,
        virt: getRandom(2842624, 12142714880),
        res: getRandom(1068, 158420),
        shr: getRandom(80, 12916),
        status: "S",
        pid_cpu_usage: 0,
        mem_usage: 0,
        time_plus: getRandom(0, 64.36, 2),
        command: randomCommands[i],
    });
}

const getMemory = () => {
    const memoryInfo = {
        total_mem: 8096944,
        used_mem: getRandom(1800000, 1900000),
        swap_mem: 2097152,
        swap_used: 0,
    };
    return memoryInfo;
};

const getCoresUsage = () => {
    const coresUsage = { cpu: getRandom(0, 3, 1).toFixed(1) };

    for (let i = 1; i <= 12; i++) {
        coresUsage[`cpu${i}`] = getRandom(0, 3, 1).toFixed(1);
    }
    return coresUsage;
};

const getLoadAverage = () => {
    const loadAverage = [getRandom(0.08, 0.13, 2).toFixed(2), getRandom(0.08, 0.13, 2).toFixed(2), getRandom(0.08, 0.13, 2).toFixed(2)];
    return loadAverage;
};

const update = () => {
    processes.forEach((proces) => {
        proces["pid_cpu_usage"] = getRandom(0, 2, 1);
        proces["mem_usage"] = getRandom(0, 0.5, 1);
    });
    uptime += 1.02;
};

const getFakeData = () => {
    update();
    const data = JSON.stringify({
        memory_info: getMemory(),
        cores_usage: getCoresUsage(),
        load_average: getLoadAverage(),
        processes: processes,
        uptime: uptime,
    });
    return data;
};

const delProces = (id) => {
    const proces = processes.filter((proces) => proces["pid"] === id)[0];
    const index = processes.indexOf(proces);
    processes.splice(index, 1);
};

export { getFakeData, delProces };
