document.addEventListener('DOMContentLoaded', function () {
    const searchBySelect = document.getElementById('searchBy');
    const searchInputContainer = document.getElementById('searchInputContainer');
    const searchButton = document.getElementById('searchButton');
    const searchResult = document.getElementById('searchResult');
    const formDataDisplay = document.getElementById('formDataDisplay');

    const storedData = JSON.parse(localStorage.getItem('formData')) || [];
    if (storedData.length > 0) {
        let displayHTML = '<table class="table table-striped"><thead><tr>';
        Object.keys(storedData[0]).forEach(key => {
            if (key !== 'password'&& key !== 'fileName' && key !== 'fileSize') { 
                displayHTML += `<th>${key}</th>`;
            }
        });
        displayHTML += '</tr></thead><tbody>';
        storedData.forEach(item => {
            displayHTML += '<tr>';
            Object.entries(item).forEach(([key, value]) => {
                if (key !== 'password' && key !== 'fileName' && key !== 'fileSize') {
                    if (key === 'profile') {
                        displayHTML += `<td><img src="${value}" alt="Profile Image" style="width: 50px; height: 50px;"></td>`;
                    } else {
                        displayHTML += `<td>${value}</td>`;
                    }
                }
            });
            displayHTML += '</tr>';
        });
        displayHTML += '</tbody></table>';
        formDataDisplay.innerHTML = `<h3>Stored Data:</h3>${displayHTML}`;
    } else {
        formDataDisplay.innerHTML = '<h3>Stored Data:</h3><p>No data found in local storage.</p>';
    }

    searchBySelect.addEventListener('change', function () {
        const selectedAttribute = searchBySelect.value;
        searchInputContainer.innerHTML = '';

        if (selectedAttribute === 'fileSize') {
            searchInputContainer.innerHTML = `
                <label for="searchInput" class="form-label">File Size (less than)</label>
                <input type="number" id="searchInput" class="form-control" placeholder="Enter size in bytes">
            `;
        } else if (selectedAttribute === 'daysLived') {
            searchInputContainer.innerHTML = `
                <label for="searchInput" class="form-label">Number of Days Lived</label>
                <input type="number" id="searchInput" class="form-control" placeholder="Enter number of days">
            `;
        } else {
            searchInputContainer.innerHTML = `
                <label for="searchInput" class="form-label">Search Value</label>
                <input type="text" id="searchInput" class="form-control" placeholder="Enter value">
            `;
        }
    });

    searchButton.addEventListener('click', function () {
        const selectedAttribute = searchBySelect.value;
        const searchValue = document.getElementById('searchInput').value.trim();
        if (!selectedAttribute || !searchValue) {
            alert('Please select a search attribute and enter a value.');
            return;
        }

        const storedData = JSON.parse(localStorage.getItem('formData')) || [];
        const results = storedData.filter(item => {
            if (selectedAttribute === 'fileSize') {
                return item.fileSize < parseInt(searchValue);
            } else if (selectedAttribute === 'daysLived') {
                const dob = new Date(item.dob);
                const today = new Date();
                const ageInDays = Math.floor((today - dob) / (1000 * 60 * 60 * 24));
                return ageInDays < parseInt(searchValue);
            } else {
                return item[selectedAttribute] && item[selectedAttribute].toLowerCase().includes(searchValue.toLowerCase());
            }
        });

        if (results.length > 0) {
            let resultHTML = '<table class="table table-striped"><thead><tr>';
            Object.keys(results[0]).forEach(key => {
                if (key !== 'password') { 
                    resultHTML += `<th>${key}</th>`;
                }
            });
            resultHTML += '</tr></thead><tbody>';
            results.forEach(result => {
                resultHTML += '<tr>';
                Object.entries(result).forEach(([key, value]) => {
                    if (key !== 'password') { 
                        if (key === 'profile') {
                            resultHTML += `<td><img src="${value}" alt="Profile Image" style="width: 50px; height: 50px;"></td>`;
                        } else {
                            resultHTML += `<td>${value}</td>`;
                        }
                    }
                });
                resultHTML += '</tr>';
            });
            resultHTML += '</tbody></table>';
            searchResult.innerHTML = resultHTML;
        } else {
            searchResult.innerHTML = '<p>No matching data found.</p>';
        }
    });
});

function redirectToSubmit() {
    window.location.href = "index2.html";
}
