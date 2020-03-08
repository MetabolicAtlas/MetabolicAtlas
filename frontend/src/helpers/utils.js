export function capitalize(value) {
  return `${value[0].toUpperCase()}${value.slice(1)}`;
}

export function idfy(value) {
  if (!value) {
    return '';
  }
  let s = value.toLowerCase().replace(/[^0-9a-z_]/g, '_');
  s = s.replace(/_{2,}/g, '_');
  return s.replace(/^_|_$/, '');
}

export function replaceUnderscores(value) {
  return `${value.replace('_', ' ')}`;
}

export function reformatTableKey(value) {
  return replaceUnderscores(capitalize(value));
}

export function reformatStringToLink(value, link) {
  if (link) {
    return `<a href="${link}" target="_blank">${value}</a>`;
  }
  return `<a href="${value}" target="_blank">${value}</a>`;
}

export function reformatCompEqString(value, reversible) {
  if (value === null) {
    return '';
  }
  const eqArr = value.split(' => ');
  let reactants = '';
  let products = '';
  if (eqArr[0]) {
    reactants = eqArr[0].split(' + ').map(
      e => `<a class="cmp">${e}</a>`).join(' + ');
  }
  if (eqArr[1]) {
    products = eqArr[1].split(' + ').map(
      e => `<a class="cmp">${e}</a>`).join(' + ');
  }
  if (products) {
    if (reversible) {
      return `${reactants} &#8660; ${products}`;
    }
    return `${reactants} &#8658; ${products}`;
  }
  return reactants;
}

export function reformatEqSign(equation, reversible) {
  if (reversible) {
    return equation.replace(' => ', ' &#8660; ');
  }
  return equation.replace(' => ', ' &#8658; ');
}

export function addMassUnit(value) {
  return `${value} g/mol`;
}

export function joinListElements(list) {
  let output = '';
  if (list.length) {
    output = list.join('; ');
  }
  return output;
}

export function replaceEmpty(value) {
  if (!value || value === null) {
    return '-';
  }
  return value;
}

export function reformatSBOLink(sboID, link) {
  if (link) {
    return reformatStringToLink(sboID, link);
  }
  return `<a href="http://www.ebi.ac.uk/sbo/main/${sboID}" target="_blank">${sboID}</a>`;
}

export function getChemicalReaction(reaction) {
  if (reaction === null) {
    return '';
  }
  const reactants = reaction.reactionreactant_set.map(
    x => `${x.stoichiometry !== 1 ? `${x.stoichiometry} ` : ''}${x.full_name}`
  ).join(' + ');
  const products = reaction.reactionproduct_set.map(
    x => `${x.stoichiometry !== 1 ? `${x.stoichiometry} ` : ''}${x.full_name}`
  ).join(' + ');

  if (reaction.is_reversible) {
    return `${reactants} <=> ${products}`;
  }
  return `${reactants} => ${products}`;
}

export function reformatChemicalReactionHTML(reaction, noMtag = false) {
  if (reaction === null) {
    return '';
  }
  const addComp = reaction.is_transport || reaction.compartment_str.includes('=>');
  const reactants = reaction.reactionreactant_set.map(
    (x) => {
      if (!addComp) {
        return `${x.stoichiometry !== 1 ? x.stoichiometry : ''} ${noMtag ? x.name : `<m class="${x.id}">${x.name}</m>`}`;
      }
      const regex = /.+\[([a-z]{1,3})\]$/;
      const match = regex.exec(x.full_name);
      return `${x.stoichiometry !== 1 ? x.stoichiometry : ''} ${noMtag ? x.name : `<m class="${x.id}">${x.name}</m>`}<span class="sc" title="${x.compartment}">${match[1]}</span>`;
    }
  ).join(' + ');

  const products = reaction.reactionproduct_set.map(
    (x) => {
      if (!addComp) {
        return `${x.stoichiometry !== 1 ? x.stoichiometry : ''} ${noMtag ? x.name : `<m class="${x.id}">${x.name}</m>`}`;
      }
      const regex = /.+\[([a-z]{1,3})\]$/;
      const match = regex.exec(x.full_name);
      return `${x.stoichiometry !== 1 ? x.stoichiometry : ''} ${noMtag ? x.name : `<m class="${x.id}">${x.name}</m>`}<span class="sc" title="${x.compartment}">${match[1]}</span>`;
    }
  ).join(' + ');

  if (reaction.is_reversible) {
    return `${reactants} &#8660; ${products}`;
  }
  return `${reactants} &#8658; ${products}`;
}

export function sortResults(a, b, searchTermString) {
  let matchSizeDiffA = 100;
  let matchedStringA = '';
  Object.values(a).forEach((v) => {
    if (v && (typeof v === 'string' || v instanceof String)
        && v.toLowerCase().includes(searchTermString.toLowerCase())) {
      const diff = v.length - searchTermString.length;
      if (diff < matchSizeDiffA) {
        matchSizeDiffA = diff;
        matchedStringA = v;
      }
    }
  });

  let matchSizeDiffB = 100;
  let matchedStringB = '';

  Object.values(b).forEach((v) => {
    if (v && (typeof v === 'string' || v instanceof String)
        && v.toLowerCase().includes(searchTermString.toLowerCase())) {
      const diff = v.length - searchTermString.length;
      if (diff < matchSizeDiffB) {
        matchSizeDiffB = diff;
        matchedStringB = v;
      }
    }
  });
  if (matchSizeDiffA === matchSizeDiffB) {
    return matchedStringA.localeCompare(matchedStringB);
  }
  return matchSizeDiffA < matchSizeDiffB ? -1 : 1;
}

export function parseEuropePMC(results) {
  const newFormattedRefs = {};
  results.forEach((details) => {
    try {
      const refDetails = {};
      if (!details.fullTextUrlList) {
        refDetails.link = null;
      } else {
        refDetails.link = details.fullTextUrlList.fullTextUrl
          .filter(e => e.documentStyle === 'html' && e.site === 'Europe_PMC');
        if (refDetails.link.length === 0) {
          refDetails.link = details.fullTextUrlList.fullTextUrl.filter(
            e => e.documentStyle === 'doi' || e.documentStyle === 'abs')[0].url;
        } else {
          refDetails.link = refDetails.link[0].url;
        }
      }
      if (details.pubYear) {
        refDetails.year = details.pubYear;
      }
      refDetails.authors = details.authorList.author.map(e => e.fullName);
      refDetails.journal = details.journalInfo.journal.title;
      refDetails.title = details.title;
      refDetails.formattedString = `${refDetails.authors.join(', ')}, ${refDetails.year}. <i>${refDetails.title}</i> ${refDetails.journal}`;
      newFormattedRefs[details.id] = refDetails;
    } catch (e) {
      // pass
    }
  });
  return newFormattedRefs;
}
