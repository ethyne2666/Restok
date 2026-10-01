const NUMBER_WORDS = {
  a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
  eight: 8, nine: 9, ten: 10, twelve: 12, fifteen: 15, twenty: 20,
  thirty: 30, forty: 40, fifty: 50, sixty: 60,
};

const squash = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

function findMedicine(text, medicines) {
  const flat = squash(text);
  const words = text.split(/\W+/);
  return (
    medicines.find((m) => flat.includes(squash(m.name))) ??
    medicines.find((m) => words.includes(m.name.toLowerCase().split(' ')[0])) ??
    null
  );
}

function findQuantity(text) {
  const cleaned = text.replace(/\d+\s*(mg|ml|mcg|iu)\b/g, '');
  for (const word of cleaned.split(/\s+/)) {
    if (/^\d+$/.test(word)) return Number(word);
    if (NUMBER_WORDS[word]) return NUMBER_WORDS[word];
  }
  return null;
}

export function parseCommand(input, medicines) {
  const text = input.toLowerCase().trim();

  if (/^(yes|yeah|yep|confirm|correct|ok|okay|sure|do it)\b/.test(text)) return { intent: 'confirm' };
  if (/^(no|nope|cancel|stop|wrong|never mind)\b/.test(text)) return { intent: 'cancel' };

  const medicine = findMedicine(text, medicines);
  const quantity = findQuantity(text);

  if (!medicine && /\b(low|running out|reorder|shortage|need to buy)\b/.test(text)) {
    return { intent: 'query_low' };
  }
  if (/\b(how many|how much|left|remaining|in stock|stock of)\b/.test(text)) {
    return { intent: 'query_stock', medicine };
  }
  if (/\b(received|receive|got|bought|buy|purchased|added|add|refill|restock|delivered)\b/.test(text)) {
    return { intent: 'receive', medicine, quantity };
  }
  if (/\b(took|take|taken|consumed|consume|used|use|had|ate|swallowed|finished)\b/.test(text)) {
    return { intent: 'consume', medicine, quantity };
  }
  return { intent: 'unknown' };
}