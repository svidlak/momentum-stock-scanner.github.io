/**
 * Initializes the form fields with data stored in localStorage.
 * If no data is available, default values are applied.
 * 
 * @function
 */
function initializeFormFromCookie() {
    const storage = localStorage.getItem("formData");
    const formData = JSON.parse(storage);

    document.getElementById('price').value = formData.price || 'above';
    document.getElementById('priceInput').value = formData.priceInput || 0;
    document.getElementById('hasNewsTrue').checked = formData.hasNewsTrue || false;
    document.getElementById('volumeSelect').value = formData.volumeSelect || 'above';
    document.getElementById('volume').value = formData.volume || 0;
    document.getElementById('marketCapSelect').value = formData.marketCapSelect || 'above';
    document.getElementById('marketCap').value = formData.marketCap || 0;
    document.getElementById('sharesFloatSelect').value = formData.sharesFloatSelect || 'above';
    document.getElementById('sharesFloat').value = formData.sharesFloat || 0;
}

/**
 * Collects the form data and saves it to localStorage.
 * 
 * @function
 */
function handleSaveForm() {
    const formData = {
        price: document.getElementById('price').value,
        priceInput: parseInt(document.getElementById('priceInput').value),
        hasNewsTrue: document.getElementById('hasNewsTrue').checked,
        volumeSelect: document.getElementById('volumeSelect').value,
        volume: parseInt(document.getElementById('volume').value),
        marketCapSelect: document.getElementById('marketCapSelect').value,
        marketCap: parseInt(document.getElementById('marketCap').value),
        sharesFloatSelect: document.getElementById('sharesFloatSelect').value,
        sharesFloat: parseInt(document.getElementById('sharesFloat').value)
    };

    localStorage.setItem("formData", JSON.stringify(formData));
    document.getElementById('modal').classList.add('hidden');
}

/**
 * Sets a default form data in localStorage if no data exists.
 * This function ensures that the form will have some default values if the user hasn't set any yet.
 * 
 * @function
 */
function setDefaultCookie() {
    const formData = localStorage.getItem("formData");
    if (!formData) {
        const defaultData = {
            price: 'above',
            priceInput: 0,
            hasNewsTrue: false,
            volumeSelect: 'above',
            volume: 0,
            marketCapSelect: 'above',
            marketCap: 0,
            sharesFloatSelect: 'above',
            sharesFloat: 0
        };

        localStorage.setItem("formData", JSON.stringify(defaultData));
    }
}

/**
 * Resets the user settings in localStorage to default values.
 * 
 * This function sets the `formData` in `localStorage` to a predefined default set of values for stock filters. 
 * It is useful for restoring the user preferences to their original state.
 * 
 * @returns {void} - This function does not return anything.
 */
function resetDefaultCookieValues() {
    const defaultData = {
        price: 'above',
        priceInput: 0,
        hasNewsTrue: false,
        volumeSelect: 'above',
        volume: 0,
        marketCapSelect: 'above',
        marketCap: 0,
        sharesFloatSelect: 'above',
        sharesFloat: 0
    };

    // Save the default data in localStorage
    localStorage.setItem("formData", JSON.stringify(defaultData));
}
/**
 * Immediately invoked function that sets up the modal functionality, including event listeners for:
 * - Opening the modal and initializing the form data.
 * - Closing the modal.
 * - Saving the form data to localStorage when the save button is clicked.
 * 
 * @function
 */
(function () {
    setDefaultCookie();

    const modal = document.getElementById('modal');
    const openModalButton = document.getElementById('openModalButton');
    const closeModalButton = document.getElementById('closeModalButton');
    const saveButton = document.getElementById('saveButton');
    const defeaultSettingsButton = document.getElementById('defeaultSettingsButton');

    openModalButton.addEventListener('click', function () {
        initializeFormFromCookie();
        modal.classList.remove('hidden');
    });

    closeModalButton.addEventListener('click', function () {
        modal.classList.add('hidden');
    });

    defeaultSettingsButton.addEventListener('click', function () {
        resetDefaultCookieValues();
        modal.classList.add('hidden');
    });

    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.classList.add('hidden');
        }
    });

    saveButton.addEventListener('click', handleSaveForm);
})();
