module.exports = function simpleParser(raw) {
  const text = raw.toString();

  const subjectMatch = text.match(/Subject:(.*)/i);
  const fromMatch = text.match(/From:(.*)/i);
  const toMatch = text.match(/To:(.*)/i);
  const dateMatch = text.match(/Date:(.*)/i);

  return {
    subject: subjectMatch ? subjectMatch[1].trim() : "",
    from: fromMatch ? fromMatch[1].trim() : "",
    to: toMatch ? toMatch[1].trim() : "",
    date: dateMatch ? new Date(dateMatch[1].trim()) : new Date(),
    text: text
  };
};
