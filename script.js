import { getMovieMetadata as callMovieAPI } from "./movie-api.js";
// ====================================
const movieNameElement = document.getElementById("movie-name");
const movieYearElement = document.getElementById("movie-year");
const movieTypeElement = document.getElementById("movie-type");

const movieTable = document.getElementById("list-table");

const infoText = document.getElementById("info");
const warningText = document.getElementById("warning");

const movieNameIdentifier = "Movie Name";
const movieYearIdentifier = "Movie Year";
// ====================================
function getMovieMetadata() {
  hideInfo();
  hideWarning();
  clearTableDataRows();
  hideTable();

  const invalidFields = [];
  const requiredFields = [];
  // ================
  const movieName = movieNameElement.value;
  if (movieName.trim().length === 0)
    requiredFields.push(movieNameIdentifier);

  const movieYear = (movieYearElement.value.trim().length > 0 ? parseInt(movieYearElement.value) : "");
  if (isNaN(movieYear))
      invalidFields.push(movieYearIdentifier);
  // ================
  if (requiredFields.length > 0) {
    showWarning(`Missing required field(s). [${requiredFields.join(", ")}]`);
    return;
  }

  if (invalidFields.length > 0) {
    showWarning(`Invalid Format for the following field(s). [${invalidFields.join(", ")}]`);
    return;
  }
  // ================
  const movieType = movieTypeElement.value;
  // ================
  showInfo("Loading...");
  displayMovieResults(movieName, movieYear.toString(), movieType)
  // ================
}

function displayMovieResults(movieName, movieYear, movieType) {
  callMovieAPI(movieName, movieYear, movieType)
  .then((result) => {
    // Debug
    //console.log("Result: ", result);
    
    if (result.success) {
      result.data.forEach((movieInfo) => {
        // Debug
        //console.log("Movie Info: ", movieInfo);
        
        const newRow = movieTable.insertRow();
        let newCell = newRow.insertCell();
        if (movieInfo.Poster !== "N/A") {
          newCell.innerHTML = `
          <a href="${movieInfo.Poster}" target="_blank">${movieInfo.Title}</a>
          `;
        }
        else
          newCell.textContent = movieInfo.Title;
        newCell.classList.add("list-table-cell");
        newCell.classList.add("list-table-odd-cell");
        newCell.classList.add("list-table-border");
        
        newCell = newRow.insertCell();
        let year = movieInfo.Year;
        const yearSplit = year.split("–");
        // Special case handling for year outputs like:-
        // 1. The Office, 2019–
        // 2. The King's Avatar, 2017–
        // 3. Teen Titans Go!, 2013–
        // Note: The hyphen is special, denoted by the negative symbol (–), not a typical hyphen (-).
        year = (yearSplit.length === 2 && yearSplit[1].trim().length > 0) ? year : yearSplit[0];
        
        newCell.textContent = year;
        newCell.classList.add("list-table-cell");
        newCell.classList.add("list-table-even-cell");
        newCell.classList.add("list-table-border");

        newCell = newRow.insertCell();
        newCell.textContent = movieInfo.Type.substring(0, 1).toUpperCase() + movieInfo.Type.substring(1);
        newCell.classList.add("list-table-cell");
        newCell.classList.add("list-table-odd-cell");
        newCell.classList.add("list-table-border");
      });

      const dateNow = new Date();
      showInfo(`Movie List last updated at ${dateNow}.`);
      showTable();
    }
    else {
      showWarning(`${result.message}`);
      return;
    }
  });
}
// ====================================
function showWarning(str) {
  warningText.innerHTML = str;

  if (warningText.classList.contains("hidden"))
    warningText.classList.remove("hidden");

  hideInfo();
}

function hideWarning() {
  if (!warningText.classList.contains("hidden"))
    warningText.classList.add("hidden");
}

function showInfo(str) {
  infoText.innerHTML = str;

  if (infoText.classList.contains("hidden"))
    infoText.classList.remove("hidden");
}

function hideInfo() {
  if (!infoText.classList.contains("hidden"))
    infoText.classList.add("hidden");
}

function showTable() {
  if (movieTable.classList.contains("hidden"))
    movieTable.classList.remove("hidden");
}

function hideTable() {
  if (!movieTable.classList.contains("hidden"))
    movieTable.classList.add("hidden");
}

function clearTableDataRows() {
  for (let i = 1; i < movieTable.rows.length;)
    movieTable.deleteRow(i);
}
// ====================================
window.getMovieMetadata = getMovieMetadata;