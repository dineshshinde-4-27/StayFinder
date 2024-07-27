module.exports.toCapitalize = (string) => {
  // Split the string into sentences based on periods.
  let sentences = string.split(".").map((sentence) => sentence.trim());

  // Capitalize the first letter of each sentence.
  let capitalizedSentences = sentences.map((sentence) => {
    if (sentence.length === 0) return "";
    return sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase();
  });

  // Join the sentences back together with a period and space.
  return capitalizedSentences.join(". ") + (string.endsWith(".") ? "." : "");
};
