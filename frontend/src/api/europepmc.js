import axios from 'axios';

const searchReferences = async (queryIds) => {
  const { data } = await axios.get(
    `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${queryIds}&resultType=core&format=json`
  );

  const refs = {};

  data.resultList.result.forEach((details) => {
    try {
      const refDetails = {};
      if (!details.fullTextUrlList) {
        refDetails.link = null;
      } else {
        refDetails.link = details.fullTextUrlList.fullTextUrl.filter(
          (e) => e.documentStyle === 'html' && e.site === 'Europe_PMC'
        );
        if (refDetails.link.length === 0) {
          refDetails.link = details.fullTextUrlList.fullTextUrl.filter(
            (e) => e.documentStyle === 'doi' || e.documentStyle === 'abs'
          )[0].url;
        } else {
          refDetails.link = refDetails.link[0].url;
        }
      }
      if (details.pubYear) {
        refDetails.year = details.pubYear;
      }
      refDetails.authors = details.authorList.author.map((e) => e.fullName);
      refDetails.journal = details.journalInfo.journal.title;
      refDetails.title = details.title;
      refDetails.formattedString = `${refDetails.authors.join(', ')}, ${refDetails.year}. <i>${
        refDetails.title
      }</i> ${refDetails.journal}`;
      refs[details.id] = refDetails;
    } catch {
      // TODO: handle exception
    }
  });

  return refs;
};

export default { searchReferences };
