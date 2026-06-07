// const countriesContainer = document.getElementById("countries");
// const searchInput = document.getElementById("search");
// const spinner = document.getElementById("spinner");
// const errorMessage = document.getElementById("error-message");

// let allCountries = [];
// let asianCountries = []; //  store only Asia

// // Fetch countries from API
// async function fetchCountries() {
//     spinner.style.display = "block";
//     errorMessage.textContent = "";

//     try {
//         const response = await fetch(
//             "https://restcountries.com/v3.1/all?fields=name,flags,population,region"
//         );

//         if (!response.ok) {
//             throw new Error("Failed to fetch countries");
//         }

//         const data = await response.json();

//         // Sort countries
//         allCountries = data.sort((a, b) =>
//             a.name.common.localeCompare(b.name.common)
//         );

//         // KEEP ONLY ASIAN COUNTRIES
//         asianCountries = allCountries.filter(
//             country => country.region === "Asia"
//         );

//         // Show first 10 Asian countries
//         displayCountries(asianCountries.slice(0, 10));

//     } catch (error) {
//         console.error(error);
//         errorMessage.textContent =
//             "Unable to load countries. Please try again later.";
//     } finally {
//         spinner.style.display = "none";
//     }
// }

// // Display countries
// function displayCountries(countries) {
//     countriesContainer.innerHTML = "";

//     countries.forEach(country => {
//         const card = document.createElement("div");
//         card.classList.add("country-card");

//         card.innerHTML = `
//             <img 
//     src="${country.flags?.svg || country.flags?.png || 'https://via.placeholder.com/150'}" 
//     alt="${country.name.common}"
// >
//             <div class="country-info">
//                 <h3>${country.name.common}</h3>
//                 <p>Population: ${country.population.toLocaleString()}</p>
//             </div>
//         `;

//         countriesContainer.appendChild(card);
//     });
// }

// // Search countries (ONLY ASIA)
// searchInput.addEventListener("input", function () {
//     const searchText = searchInput.value.toLowerCase().trim();

//     // If search is empty → show only Asian countries
//     if (searchText === "") {
//         displayCountries(asianCountries.slice(0, 10));
//         return;
//     }

//     // Filter ONLY Asian countries
//     const filteredCountries = asianCountries.filter(country =>
//         country.name.common.toLowerCase().includes(searchText)
//     );

//     displayCountries(filteredCountries);
// });

// // Run when page loads
// fetchCountries();

const countriesContainer = document.getElementById("countries");
const searchInput = document.getElementById("search");
const regionFilter = document.getElementById("regionFilter");
const spinner = document.getElementById("spinner");
const errorMessage = document.getElementById("error-message");

let allCountries = [];
let baseCountries = [];

// FETCH DATA
async function fetchCountries() {
    spinner.style.display = "block";

    try {
        const res = await fetch(
            "https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital,currencies,languages"
        );

        const data = await res.json();

        allCountries = data.sort((a, b) =>
            a.name.common.localeCompare(b.name.common)
        );

        baseCountries = allCountries;

        displayCountries(baseCountries.slice(0, 20));

    } catch (error) {
        errorMessage.textContent = "Failed to load countries!";
    } finally {
        spinner.style.display = "none";
    }
}

// DISPLAY COUNTRIES
function displayCountries(countries) {
    countriesContainer.innerHTML = "";

    countries.forEach(country => {
        const card = document.createElement("div");
        card.classList.add("country-card");

        card.innerHTML = `
        <img 
    src="${country.flags?.svg || country.flags?.png || 'https://via.placeholder.com/150'}" 
    alt="${country.name.common}"
>
            <div class="country-info">
                <h3>${country.name.common}</h3>
                <p>Population: ${country.population.toLocaleString()}</p>
                <button>View Details</button>
            </div>
        `;

        card.querySelector("button").addEventListener("click", () => {
            showDetails(country);
        });

        countriesContainer.appendChild(card);
    });
}

// POPUP
function showDetails(country) {
    const capital = country.capital ? country.capital[0] : "N/A";

    const currency = country.currencies
        ? Object.values(country.currencies)[0].name
        : "N/A";

    const languages = country.languages
        ? Object.values(country.languages).join(", ")
        : "N/A";

    const modal = document.createElement("div");
    modal.classList.add("modal");

    modal.innerHTML = `
        <div class="modal-content">
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${capital}</p>
            <p><strong>Currency:</strong> ${currency}</p>
            <p><strong>Languages:</strong> ${languages}</p>
            <button id="closeBtn">Close</button>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById("closeBtn").addEventListener("click", () => {
        modal.remove();
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.remove();
    });
}

// FILTER FUNCTION
function applyFilters() {
    const searchText = searchInput.value.toLowerCase();
    const region = regionFilter.value;

    let filtered = allCountries;

    if (region !== "All") {
        filtered = filtered.filter(c => c.region === region);
    }

    if (searchText !== "") {
        filtered = filtered.filter(c =>
            c.name.common.toLowerCase().includes(searchText)
        );
    }

    displayCountries(filtered.slice(0, 20));
}

// EVENTS
searchInput.addEventListener("input", applyFilters);
regionFilter.addEventListener("change", applyFilters);

// INIT
fetchCountries();