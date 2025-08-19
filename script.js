document
  .getElementById("dictionary-form")
  .addEventListener("submit", async function (element) {
    element.preventDefault();
    const word = document.getElementById("word-input").value.trim();
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";
    if (!word) return;
    resultDiv.innerHTML = "<p>Loading...</p>";
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      if (!response.ok) {
        throw new Error("Word not found");
      }
      const data = await response.json();
      renderResult(data, resultDiv);
    } catch (error) {
      resultDiv.innerHTML = `<div class="error">${
        error.message || "An error occurred. Please try again."
      }</div>`;
    }
  });

function renderResult(data, resultDiv) {
  resultDiv.innerHTML = "";
  data.forEach((entry) => {
    const wordTitle = `<div class="word-title">${entry.word} ${
      entry.phonetic ? `<span class='phonetic'>/${entry.phonetic}/</span>` : ""
    }</div>`;
    let meaningsHtml = "";
    entry.meanings.forEach((meaning) => {
      let definitionsHtml = "";
      meaning.definitions.forEach((def, idx) => {
        definitionsHtml += `<div class="definition"><b>Definition ${
          idx + 1
        }:</b> ${def.definition}`;
        if (def.example) {
          definitionsHtml += `<div class="example"><i>Example: ${def.example}</i></div>`;
        }
        if (def.synonyms && def.synonyms.length) {
          definitionsHtml += `<div class="synonyms">Synonyms: ${def.synonyms.join(
            ", "
          )}</div>`;
        }
        if (def.antonyms && def.antonyms.length) {
          definitionsHtml += `<div class="antonyms">Antonyms: ${def.antonyms.join(
            ", "
          )}</div>`;
        }
        definitionsHtml += "</div>";
      });
      meaningsHtml += `<div class="meaning">
                <div class="part-of-speech">${meaning.partOfSpeech}</div>
                ${definitionsHtml}
            </div>`;
    });
    resultDiv.innerHTML += wordTitle + meaningsHtml;
  });
}
