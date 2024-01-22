const baseUrl = "https://www.omdbapi.com/";
const apiKey = "258a2345";

export async function getMovieMetadata(title, year, type) {
  const titleFormatted = title.replace(/ /g, "+");
  let fullUrl = baseUrl + "?s=" + titleFormatted;
  
  if (year.trim().length > 0)
    fullUrl += "&y=" + year;
  
  if (type.trim().length > 0)
    fullUrl += "&type=" + type;

  fullUrl += "&apikey=" + apiKey
  
  // Debug
  console.log("URL: " + fullUrl);
  
  const response = await fetch(fullUrl.toString());

  // Debug
 // console.log("Response: ", response);

  const result = {
    success: false,
    message: "",
    data: null
  };

  if (response.ok) {
    const data = await response.json();

    // Debug
    //console.log("Data: ", data);

    if (data.Response.toLowerCase() === "false") {
      result.success = false;
      result.message = data.Error;
    }
    else {
      result.success = true;
      result.data = data.Search;
    }
  }
  else {
    result.success = false;
    result.message = "Failed to retrieve data from source.";
  }

  return result;
}
// ====================================