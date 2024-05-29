const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());

//const RESULTS_DIR = '/media/adam/3268e159-c01d-4551-8089-f31f5ad8a3c7/ReconEnhance/results';
const RESULTS_DIR = '/home/adam/Downloads/results/results';
const findFiles = (dir) => {
    let files = [];
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            files = files.concat(findFiles(filePath));
        } else if (['.txt', '.log', '.xml'].includes(path.extname(file))) {
            files.push(filePath);
        }
    });
    return files;
};

const findTcpDirectories = (dir) => {
    return fs.readdirSync(dir).filter(item => fs.statSync(path.join(dir, item)).isDirectory() && item.startsWith('tcp'));
};

const parseQuickTcpNmapTxt = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        const lines = data.split('\n');
        let startingTime = null;
        let result = [];
        let currentPort = null;
        lines.forEach(line => {
            if (!startingTime && line.startsWith("# Nmap")) {
                const startIndex = line.indexOf('scan initiated');
                if (startIndex !== -1) {
                    startingTime = line.substring(startIndex + 15, startIndex + 38).trim();
                }
            } else if (line.startsWith("Nmap scan report for ")) {
                currentPort = { ip: line.substring(21), ports: [] };
                result.push(currentPort);
            } else if (currentPort && line.match(/^\d+\/tcp\s+\w+\s+/)) {
                const [port, state, service, reason, ...versionParts] = line.split(/\s+/).filter(Boolean);
                let version = versionParts.join(' ');
                if (reason === 'no-response') {
                    version = '';
                }
                currentPort.ports.push({ port, state, service, reason, version });
            }
        });
        return { startingTime, result };
    } catch (error) {
        console.error('Error parsing _quick_tcp_nmap.txt:', error);
        return { startingTime: null, result: [] };
    }
};

const parseFullTcpNmapTxt = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        const lines = data.split('\n');
        let startingTime = null;
        let result = [];
        let currentPort = null;
        lines.forEach(line => {
            if (!startingTime && line.startsWith("# Nmap")) {
                const startIndex = line.indexOf('scan initiated');
                if (startIndex !== -1) {
                    startingTime = line.substring(startIndex + 15, startIndex + 38).trim();
                }
            } else if (line.startsWith("Nmap scan report for ")) {
                currentPort = { ip: line.substring(21), ports: [] };
                result.push(currentPort);
            } else if (currentPort && line.match(/^\d+\/tcp\s+\w+\s+/)) {
                const [port, state, service, reason, ...versionParts] = line.split(/\s+/).filter(Boolean);
                let version = versionParts.join(' ');
                if (reason === 'no-response') {
                    version = '';
                }
                currentPort.ports.push({ port, state, service, reason, version });
            }
        });
        return { startingTime, result };
    } catch (error) {
        console.error('Error parsing _full_tcp_nmap.txt:', error);
        return { startingTime: null, result: [] };
    }
};

app.get('/api/scans', (req, res) => {
    const ipDirectories = fs.readdirSync(RESULTS_DIR);
    let scansData = [];
    ipDirectories.forEach(ipDir => {
        const ipDirPath = path.join(RESULTS_DIR, ipDir);
        const files = findFiles(ipDirPath);
        const tcpDirectories = findTcpDirectories(path.join(ipDirPath, 'scans'));
        files.forEach(filePath => {
            const fileData = fs.readFileSync(filePath, 'utf-8');
            scansData.push({
                ip: ipDir,
                fileName: path.relative(ipDirPath, filePath),
                content: fileData,
                tcpDirectories
            });
        });
    });
    res.json(scansData);
});

app.get('/api/scans/:ip', (req, res) => {
    const ip = req.params.ip;
    const ipDirPath = path.join(RESULTS_DIR, ip);
    const tcpDirPath = path.join(ipDirPath, 'scans');

    const quickTcpFilePath = path.join(tcpDirPath, '_quick_tcp_nmap.txt');
    const fullTcpFilePath = path.join(tcpDirPath, '_full_tcp_nmap.txt');

    const quickTcpData = parseQuickTcpNmapTxt(quickTcpFilePath);
    const fullTcpData = parseFullTcpNmapTxt(fullTcpFilePath);

    const responseData = {
        quickTcp: quickTcpData.result,
        fullTcp: fullTcpData.result,
        startingTimeQuick: quickTcpData.startingTime,
        startingTimeFull: fullTcpData.startingTime,
    };

    res.json(responseData);
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

	
