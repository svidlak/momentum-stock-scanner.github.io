/**
 * @typedef {Object} StockData
 * @property {string} symbol - The stock symbol.
 * @property {number} price - The stock price.
 * @property {number} price_change_ratio - The price change ratio.
 * @property {Array} news - An array of news articles related to the stock.
 * @property {number} volume - The volume of the stock.
 * @property {number} market_cap - The market capitalization of the stock.
 * @property {number} shares_float - The number of shares available for trading.
 * @property {number} alert_count - The number of active alerts for the stock.
 * @property {string} internal_url - The internal URL of the stock's news page.
 */

/**
 * WebSocket URL for the Titan scanner service.
 * @constant {string}
 */
//const titanScannerWsUrl = "wss://ws.stocktitan.net:9021/null";
const titanScannerWsUrl = "wss://ws.stocktitan.net:9021/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjExNjY4NCwidXNlcm5hbWUiOiJzdmlkbGFrayIsInByZW1pdW0iOjAsInByZW1pdW1FeHBpcmF0aW9uIjpmYWxzZSwiZXhwIjoxNzMyMzAwMzU2LCJpYXQiOjE3MzE2OTU1NTZ9.4WZs5LWCt2cKTCJJBbIU1JIY7P7UMoo2Mnq8Na9axNM";

/**
 * CSS class for light green background color.
 * @constant {string}
 */
const lightGreenClass = 'bg-green-300';

/**
 * CSS class for medium green background color.
 * @constant {string}
 */
const mediumGreenClass = 'bg-green-500';

/**
 * CSS class for dark green background color.
 * @constant {string}
 */
const darkGreenClass = 'bg-green-700';

/**
 * CSS class for darkest green background color.
 * @constant {string}
 */
const darkestGreenClass = 'bg-green-900';

/**
 * CSS class for green text color.
 * @constant {string}
 */
const greenTextColor = 'text-green-500';

/**
 * CSS class for red text color.
 * @constant {string}
 */
const redTextColor = 'text-red-500';

/**
 * Maximum number of rows to display in the data table.
 * @constant {number}
 */
const maxTableRows = 10;

/**
 * Thresholds for different stock data types, which determine background color classes.
 * @constant {Object} thresholds
 * @property {Array} volume - Thresholds for volume data.
 * @property {Array} marketCap - Thresholds for market capitalization.
 * @property {Array} sharesFloat - Thresholds for shares float.
 */
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

/**
 * Inserts a new row into the data table.
 * @param {StockData} data - The stock data.
 */
function insertNewTableRow(data) {
    const tableBody = document.querySelector('#dataTable tbody');
    const row = createTableRow(data);

    if (tableBody.rows.length >= maxTableRows) {
        tableBody.deleteRow(tableBody.rows.length - 1);
    }

    tableBody.insertBefore(row, tableBody.firstChild);
}

/**
 * Creates a table row element for displaying stock data.
 * @param {StockData} data - The stock data.
 * @returns {HTMLTableRowElement} The created table row element.
 */
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
        redirectUrl: generateNewsRedirecURL(data.symbol, data.internal_url),
    };

    const row = document.createElement('tr');
    row.classList.add('hover:bg-gray-600', 'fade-in-row');

    row.innerHTML = `
        <td class="py-2 px-4">${data.symbol}</td>
        <td class="py-2 px-4">${data.price}</td>
        <td class="py-2 px-4 ${greenTextColor}">${formattedData.priceChangeRatio}</td>
        <td class="py-2 px-4 ${formattedData.hasNews ? greenTextColor + " underline" : redTextColor}">${formattedData.hasNews ? `<a href="${formattedData.redirectUrl}" target="_blank">Yes</a>` : 'No'}</td>
        <td class="py-2 px-4 ${formattedData.volumeBgClass}">${formattedData.volume}</td>
        <td class="py-2 px-4 ${formattedData.marketCapBgClass}">${formattedData.marketCap}</td>
        <td class="py-2 px-4 ${formattedData.sharesFloatBgClass}">${formattedData.sharesFloat}</td>
        <td class="py-2 px-4">${data.alert_count}</td>
        <td class="py-2 px-4">${formattedData.timestamp}</td>
    `;
    return row;
}

/**
 * Generates the URL for stock news redirection.
 * @param {string} stockName - The stock symbol.
 * @param {string} internalUrl - The internal URL for the stock news.
 * @returns {string} The full URL for the stock news.
 */
function generateNewsRedirecURL(stockName, internalUrl) {
    return `https://www.stocktitan.net/news/${stockName}/${internalUrl}.html`;
}

/**
 * Creates a new date string formatted as HH:MM:SS DD/MM/YYYY.
 * @returns {string} The formatted current date and time.
 */
function createNewDate() {
    const date = new Date();
    return date.toLocaleTimeString('en-GB', { hour12: false }) + ' ' + date.toLocaleDateString('en-GB');
}

/**
 * Formats a number as a percentage (to 2 decimal places).
 * @param {number} value - The decimal value to format.
 * @returns {string} The formatted percentage string.
 */
function formatPercentage(value) {
    return (value * 100).toFixed(2) + '%';
}

/**
 * Formats a number with commas as thousands separators.
 * @param {number} value - The number to format.
 * @returns {string} The formatted number.
 */
function formatNumber(value) {
    return value.toLocaleString();
}

/**
 * Determines the appropriate background color class based on the value and the data type.
 * @param {number} value - The value to evaluate.
 * @param {string} type - The type of the value (e.g., "volume", "marketCap", "sharesFloat").
 * @returns {string} The CSS class for the background color.
 */
function getBackgroundClass(value, type) {
    const ranges = thresholds[type];

    for (let i = 0; i < ranges.length; i++) {
        if (value < ranges[i].max) {
            return ranges[i].class;
        }
    }
}

/**
 * Displays a notification and visual indicator for a new stock.
 * @param {string} stockName - The stock symbol.
 * @param {string} changePercentage - The change percentage of the stock.
 */
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

/**
 * Sends a notification to the user about a new stock being added.
 * @param {string} stockName - The stock symbol.
 * @param {string} changePercentage - The change percentage of the stock.
 */
function notifyAboutNewStock(stockName, changePercentage) {
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        new Notification(`New Stock Added: ${stockName}`, {
            body: `${stockName} has been added with a ${changePercentage} change.`
        });
    }
}

/**
 * Requests permission for desktop notifications if not already granted.
 */
function requestNotificationPermission() {
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
        Notification.requestPermission();
    }
}

/**
 * Helper function to compare a stock value against user-defined thresholds.
 * 
 * @param {number} stockValue - The value of the stock (e.g., price, volume).
 * @param {string} filterType - The type of filter, either 'above' or 'below'.
 * @param {number} threshold - The threshold value to compare against.
 * @returns {boolean} - Returns true if the stock value doesn't meet the threshold.
 */
function doesNotMeetThreshold(stockValue, filterType, threshold) {
    if (filterType === "above") {
        return stockValue <= threshold;
    } else if (filterType === "below") {
        return stockValue >= threshold;
    }
    return false;
}

/**
 * Determines if a stock should be filtered out based on user settings stored in localStorage.
 * 
 * @param {StockData} data - The stock data.
 * @returns {boolean} - Returns true if the stock should be filtered out; otherwise false.
 */
function isStockFilteredOutByUserSettings(data) {
    const storage = localStorage.getItem("formData");
    if (!storage || !storage.length) return false;

    const formData = JSON.parse(storage);

    if (
        doesNotMeetThreshold(data.price, formData.price, formData.priceInput) ||
        doesNotMeetThreshold(data.volume, formData.volumeSelect, formData.volume) ||
        doesNotMeetThreshold(data.market_cap, formData.marketCapSelect, formData.marketCap) ||
        doesNotMeetThreshold(data.shares_float, formData.sharesFloatSelect, formData.sharesFloat) ||
        doesNotMeetThreshold(data.alert_count, formData.alertsNumberSelect, formData.alertsNumber)
    ) {
        return true;
    }

    if (formData.hasNewsTrue && data.news.length == 0) {
        return true;
    }

    return false;
}

/**
 * Sends an email with error details and payload to a specified recipient.
 * This function uses the Brevo (formerly Sendinblue) API to send the email.
 * 
 * @param {Error} error - The error object that contains information about the error (e.g., message).
 * @param {StockData} payload - The stock data.
 * 
 * @returns {void} - This function does not return anything. It performs an action of sending an email.
 */
function sendErrorEmail(error, payload) {
    const errorInfo = JSON.stringify({
        userAgent: navigator.userAgent,
        message: error.message,
        stack: error.stack,
        name: error.name,
    }, null, 2);

    const emailContent = `
        <h3>Error in Stock Processing</h3>
        <p><strong>Error Details:</strong></p>
        <pre>${errorInfo}</pre>
        <h4>Payload:</h4>
        <pre>${JSON.stringify(payload, null, 2)}</pre>
    `;

    fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'api-key': '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',
        },
        body: JSON.stringify({
            sender: { email: 'svid320@gmail.com' },
            to: [{ email: 'svid320@gmail.com' }],
            subject: '[momentum-scanner] Error Occurred in Stock Processing',
            htmlContent: emailContent,
        }),
    }).catch(() => { });
};


/**
 * Initializes the WebSocket connection and handles incoming messages.
 */
(function () {
    requestNotificationPermission();

    const ws = new WebSocket(titanScannerWsUrl);

    ws.onerror = (msg, ev) => {
        console.log({ msg, ev });
    }

    ws.onclose = (msg, ev) => {
        console.log({ msg, ev });
    }

    ws.onmessage = msg => {
        const { data: dataStringified } = msg;
        const { header: { type }, payload } = JSON.parse(dataStringified);

        if (type !== "journal") return;

        if (payload.price_change_ratio > 0) {
            try {
                if (isStockFilteredOutByUserSettings(payload)) return;

                insertNewTableRow(payload);

                if (payload.alert_count === 1 && payload.news.length > 0) {
                    insertHasntSeenBeforeStock(payload.symbol, formatPercentage(payload.price_change_ratio));
                    notifyAboutNewStock(payload.symbol, formatPercentage(payload.price_change_ratio));
                }
            } catch (e) {
                console.log({ e });
                console.log({ payload });
                sendErrorEmail(e, payload);
            }

        }
    }
})();
