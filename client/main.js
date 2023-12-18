async function search() {
  let pathToPdfFiles = "C:\\Users\\ohraz\\Desktop\\T6SearchFinal\\client\\pdfs";
  let pathToMusicFiles = "C:\\Users\\ohraz\\Desktop\\T6SearchFinal\\client\\music";
  let pathToPowerpointFiles = "C:\\Users\\ohraz\\Desktop\\T6SearchFinal\\client\\powerpoints";
  let pathToPictureFiles = "C:\\Users\\ohraz\\Desktop\\T6SearchFinal\\client\\pictures";

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
                        <td><a href="file:///${pathToPdfFiles}/${result.fileName}">${result.fileName}</a></td>
                        <td>${result.metadata.info.Title}</td>
                            <td>${result.metadata.info.Author}</td>
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
