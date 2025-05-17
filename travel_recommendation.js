console.log("Script loaded");

async function fetchData() {
  try {
    const res = await fetch("travel_recommendation_api.json");
    return await res.json();
  } catch (e) {
    console.error("Error fetching data:", e);
    return { countries: [], beaches: [], temples: [] };
  }
}

function normalizeInput(input) {
  return input.trim().toLowerCase();
}

function renderResults(results) {
  const container = document.getElementById("results");
  container.innerHTML = "";

  if (!results.length) {
    container.innerHTML = "<p>No results found.</p>";
    return;
  }

  results.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.name}" />
      <h3>${item.name}</h3>
      <p>${item.description}</p>
    `;
    container.appendChild(card);
  });
}

// Initial load: show everything
async function init() {
  const data = await fetchData();
  let allResults = [...data.beaches, ...data.temples];
  data.countries.forEach(country => {
    allResults.push(...country.cities);
  });
  renderResults(allResults);
}

document.addEventListener("DOMContentLoaded", () => {
  init();
});

// Search logic
document.getElementById("search-button").addEventListener("click", async () => {
  const input = normalizeInput(document.getElementById("search-input").value);
  const data = await fetchData();
  let matchedResults = [];

  const beachKeywords = ["beach", "beaches"];
  const templeKeywords = ["temple", "temples"];

  if (beachKeywords.includes(input)) {
    matchedResults = data.beaches;
  } else if (templeKeywords.includes(input)) {
    matchedResults = data.temples;
  } else {
    data.countries.forEach(country => {
      if (normalizeInput(country.name).includes(input)) {
        matchedResults.push(...country.cities);
      } else {
        country.cities.forEach(city => {
          if (normalizeInput(city.name).includes(input)) matchedResults.push(city);
        });
      }
    });
  }

  renderResults(matchedResults);
});

// Reset button
document.getElementById("reset-button").addEventListener("click", () => {
  document.getElementById("search-input").value = "";
  init();
});