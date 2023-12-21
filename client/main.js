async function search() {
  let pathToPdfFiles = "/pdfs";
  let pathToMusicFiles = "/music";
  let pathToPowerpointFiles = "/powerpoints";
  let pathToPictureFiles = "/pictures";

  let searchTerm = document.forms.searchForm.term.value;

  let selectRadio = getSelectedValue();

  document.forms.searchForm.term.value = "";

  if (selectRadio == "PDF") {
    let rawData = await fetch("/api/pdfs/" + searchTerm);

    let results = await rawData.json();

    let html = `
            <p>You searched for "${searchTerm}"...</p>
            <p>Found ${results.length} results.</p>
            `;

    html += `
            <table>
                <tr>
                    <th>Filename</th>
                    <th>Title</th>
                    <th>Author</th>
                </tr>
            `;

    for (let result of results) {
      html += `
                    <tr>
                        <td><a href="${pathToPdfFiles}/${result.fileName}">${result.fileName}</a></td>
                        <td>${result.metadata.info.Title}</td>
                            <td>${result.metadata.info.Author}</td>
                        </tr>
                `;
    }

    html += "</table>";

    let searchResultsElement = document.querySelector(".searchResults");

    searchResultsElement.innerHTML = html;
  }





  if (selectRadio == "JPG") {
    let rawData = await fetch("/api/pictures/" + searchTerm);

    let results = await rawData.json();

    let html = `
            <p>You searched for "${searchTerm}"...</p>
            <p>Found ${results.length} results.</p>
            `;

    html += `
            <table>
                <tr>
                    <th>Filename</th>
                    <th>Make</th>
                    <th>Flash</th>
                    <th>Contrast</th>
                    <th>Sharpness</th>
                    <th>File Source</th>
                    <th>Saturation</th> 
                </tr>
            `;

    for (let result of results) {
      html += `
                    <tr>
                        <td><a href="https://maps.google.com/?q=${result.metadata.latitude},${result.metadata.longitude}" target="_blank"><img class="imageInList" src="${pathToPictureFiles}/${result.fileName}"></a></td>
                        <td>${result.metadata.Make}</td>
                            <td>${result.metadata.Flash}</td>
                            <td>${result.metadata.Contrast}</td>
                            <td>${result.metadata.Sharpness}</td>
                            <td>${result.metadata.FileSource}</td>
                            <td>${result.metadata.Saturation}</td>
                        </tr>
                `;
    }

    html += "</table>";

    let searchResultsElement = document.querySelector(".searchResults");

    searchResultsElement.innerHTML = html;
  }



  if (selectRadio == "PPT") {
    let rawData = await fetch("/api/powerpoints/" + searchTerm);

    let results = await rawData.json();

    let html = `
            <p>You searched for "${searchTerm}"...</p>
            <p>Found ${results.length} results.</p>
            `;

    html += `
            <table>
                <tr>
                    <th>Filename</th>
                    <th>Title</th>
                    <th>Company</th>
                    <th>File size</th>
                    <th>Slide count</th>
                </tr>
            `;

    for (let result of results) {
      html += `
                    <tr>
                        <td><a href="${pathToPowerpointFiles}/${result.fileName}">${result.fileName}</a></td>
                        <td>${result.metadata.title}</td>
                            <td>${result.metadata.company}</td>
                            <td>${result.metadata.file_size}</td>
                            <td>${result.metadata.slide_count}</td>
                        </tr>
                `;
    }

    html += "</table>";

    let searchResultsElement = document.querySelector(".searchResults");

    searchResultsElement.innerHTML = html;
  }
}



function getSelectedValue() {
  var selectedType = document.getElementsByName("radio");

  for (var i = 0; i < selectedType.length; i++) {
    if (selectedType[i].checked) {
      var selectedValue = selectedType[i].value;
      console.log("Selected value: " + selectedValue);
      return selectedValue;
    }
  }
}