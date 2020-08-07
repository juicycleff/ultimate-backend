const keywords = 'FOR FILTER LET LIMIT INSERT UPSERT COLLECT REMOVE UPDATE RETURN'.split(
  ' ',
);
const regexPhrase = new RegExp('\\b(' + keywords.join('|') + ')\\b', 'g');
const TAB = '   ';
const NEWLINE = '\n';

let pad = '';

function clear() {
  pad = '';
}

function indent() {
  pad += TAB;
}

function outdent() {
  pad = pad.substr(TAB.length * 2);
}

export function formatAQL(aql) {
  let prettyAQL = '';
  const phrases = aql.trim().replace(regexPhrase, '\n$1').split('\n');

  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < phrases.length; i++) {
    const phrase = phrases[i].trim();
    if (phrase.match(/\bFOR\b/g)) {
      prettyAQL += NEWLINE + pad + phrase;
      indent();
    } else if (phrase.match(/\bLET\b/g)) {
      const isMatch = phrase.match(/\($/i);
      if (isMatch) {
        prettyAQL += NEWLINE;
      }
      prettyAQL += NEWLINE + pad + phrase;
      if (isMatch) {
        indent();
      }
    } else if (phrase.match(/\bRETURN\b/g)) {
      outdent();
      prettyAQL += NEWLINE + pad + phrase;
    } else if (phrase.match(/\bINSERT|UPSERT|UPDATE|REMOVE|COLLECT\b/g)) {
      prettyAQL += NEWLINE + pad + phrase;
      indent();
    } else {
      prettyAQL += NEWLINE + pad + phrase;
    }
    if (prettyAQL.substr(-1) === ')') {
      outdent();
      prettyAQL += NEWLINE;
    }
  }
  clear();
  return prettyAQL.trim();
}
