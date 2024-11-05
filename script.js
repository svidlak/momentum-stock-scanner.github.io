const titanScannerWsUrl = "wss://ws.stocktitan.net:9021/null"

const lightGreenClass = 'bg-green-300';
const mediumGreenClass = 'bg-green-500';
const darkGreenClass = 'bg-green-700';
const darkestGreenClass = 'bg-green-900';

const greenTextColor = 'text-green-500'
const redTextColor = 'text-red-500';

const maxTableRows = 10;

const thresholds = {
    volume: [
        { max: 100_000, class: lightGreenClass },
        { max: 250_000, class: mediumGreenClass },
        { max: 500_000, class: darkGreenClass },
        { max: Infinity, class: darkestGreenClass }
    ],
    marketCap: [
        { max: 100_000_000, class: darkestGreenClass },
        { max: 200_000_000, class: darkGreenClass },
        { max: 1_000_000_000, class: mediumGreenClass },
        { max: Infinity, class: lightGreenClass }
    ],
    sharesFloat: [
        { max: 10_000_000, class: darkestGreenClass },
        { max: 50_000_000, class: darkGreenClass },
        { max: 100_000_000, class: mediumGreenClass },
        { max: Infinity, class: lightGreenClass }
    ]
};

function insertNewTableRow(data) {
    const tableBody = document.querySelector('#dataTable tbody');
    const row = createTableRow(data);

    if (tableBody.rows.length >= maxTableRows) {
        tableBody.deleteRow(tableBody.rows.length - 1);
    }

    tableBody.insertBefore(row, tableBody.firstChild);
}

function createTableRow(data) {
    const formattedData = {
        volume: formatNumber(data.volume),
        marketCap: formatNumber(data.market_cap),
        sharesFloat: formatNumber(data.shares_float),
        priceChangeRatio: formatPercentage(data.price_change_ratio),
        hasNews: data.news.length > 0,
        volumeBgClass: getBackgroundClass(data.volume, 'volume'),
        marketCapBgClass: getBackgroundClass(data.market_cap, 'marketCap'),
        sharesFloatBgClass: getBackgroundClass(data.shares_float, 'sharesFloat'),
        timestamp: createNewDate(),
    };

    const row = document.createElement('tr');
    row.classList.add('hover:bg-gray-600', 'fade-in-row');

    row.innerHTML = `
        <td class="py-2 px-4">${data.symbol}</td>
        <td class="py-2 px-4">${data.price}</td>
        <td class="py-2 px-4 ${greenTextColor}">${formattedData.priceChangeRatio}</td>
        <td class="py-2 px-4 ${formattedData.hasNews ? greenTextColor : redTextColor}">${formattedData.hasNews ? 'Yes' : 'No'}</td>
        <td class="py-2 px-4 ${formattedData.volumeBgClass}">${formattedData.volume}</td>
        <td class="py-2 px-4 ${formattedData.marketCapBgClass}">${formattedData.marketCap}</td>
        <td class="py-2 px-4 ${formattedData.sharesFloatBgClass}">${formattedData.sharesFloat}</td>
        <td class="py-2 px-4">${data.alert_count}</td>
        <td class="py-2 px-4">${formattedData.timestamp}</td>
    `;
    return row;
}

function createNewDate() {
    const date = new Date();
    return date.toLocaleTimeString('en-GB', { hour12: false }) + ' ' + date.toLocaleDateString('en-GB');
}

function formatPercentage(value) {
    return (value * 100).toFixed(2) + '%';
}

function formatNumber(value) {
    return value.toLocaleString();
}

function getBackgroundClass(value, type) {
    const ranges = thresholds[type];

    for (let i = 0; i < ranges.length; i++) {
        if (value < ranges[i].max) {
            return ranges[i].class;
        }
    }
}

function insertHasntSeenBeforeStock(stockName, changePercentage) {
    const indicator = document.getElementById('new-stock-indicator');
    const stockInfo = document.getElementById('stock-info');
    const stockNameElement = document.getElementById('stock-name');
    const stockChangeElement = document.getElementById('stock-change');
    const timestampElement = document.getElementById('stock-timestamp');

    indicator.classList.remove('hidden');
    stockInfo.classList.add('pulse-animation');

    stockNameElement.innerText = stockName;
    stockChangeElement.innerText = changePercentage;
    timestampElement.innerText = createNewDate();
}

function notifyAboutNewStock(stockName, changePercentage) {
    if (Notification.permission === "granted") {
        new Notification(`New Stock Added: ${stockName}`, {
            body: `${stockName} has been added with a ${changePercentage} change.`
        });
    }
}

function requestNotificationPermission() {
    if (Notification.permission === "default") {
        Notification.requestPermission();
    }
}

(function () {
    requestNotificationPermission();
    const ws = new WebSocket(titanScannerWsUrl);

    ws.onmessage = msg => {
        const { data: dataStringified } = msg;
        const { header: { type }, payload } = JSON.parse(dataStringified);

        if (type !== "journal") return;

        if (payload.price_change_ratio > 0) {
            if (payload.alert_count === 1 && payload.news.length > 0) {
                insertHasntSeenBeforeStock(payload.symbol, formatPercentage(payload.price_change_ratio));
                notifyAboutNewStock(payload.symbol, formatPercentage(payload.price_change_ratio));
            }

            insertNewTableRow(payload);
        }
    }
})();