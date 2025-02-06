const fs = require('fs');
const path = require('path');

const counterFilePath = path.join(__dirname, 'clientCounter.json');

const readCounter = () => {
    if (fs.existsSync(counterFilePath)) {
        const data = fs.readFileSync(counterFilePath);
        return JSON.parse(data).currentClientNumber || 0;
    }
    return 0;
};

const writeCounter = (value) => {
    fs.writeFileSync(counterFilePath, JSON.stringify({ currentClientNumber: value }));
};

const generateClientNumber = () => {
    let currentClientNumber = readCounter();
    currentClientNumber += 1;
    writeCounter(currentClientNumber);
    return `DBCNO${String(currentClientNumber).padStart(3, '0')}`;
};

module.exports = generateClientNumber;
