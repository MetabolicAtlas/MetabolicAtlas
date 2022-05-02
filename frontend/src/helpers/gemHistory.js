import * as d3 from 'd3';

const d3Curve = d3.line().curve(d3.curveNatural);
const WIDTH = 1200;
let HEIGHT, GEM_POSITIONS, BRANCH_POINTS, TIME_SCALE;

const createTimelineChart = () => {
  HEIGHT = getHeight();
  GEM_POSITIONS = getGemPositions();
  BRANCH_POINTS = getBranchPoints();
  TIME_SCALE = createTimeScale();

  let svg = d3.create('svg').attr('width', WIDTH).attr('height', HEIGHT);

  svg = addTimeAxis(svg);
  svg = addGemsAxis(svg);
  svg = addBranchPoints(svg);
  svg = addGemVersions(svg);

  return svg.node();
};

const getHeight = () => GEMS.length * 50 + 100;

const getModelFromId = id => id.split('-')[0];

const getGemPositions = () =>
  GEMS.reduce(
    (acc, [v], i) => ({
      ...acc,
      [getModelFromId(v.id)]: HEIGHT - (i + 1) * 50,
    }),
    {}
  );

const getBranchPoints = () => {
  BRANCH_POINTS = {};

  Array.from(GEMS).forEach(([v]) => {
    if (v.externalParentId.length > 0) {
      BRANCH_POINTS[v.id] = v.externalParentId;
    }
  });

  return BRANCH_POINTS;
};

const createTimeScale = () => {
  const allFirstVersionDates = GEMS.map(([v]) => new Date(v.releaseDate));
  const earliestDate = allFirstVersionDates.sort((a, b) => a - b)[0];
  const timePadding = 60 * 60 * 24 * 30 * 3 * 1000;
  const startDate = new Date(earliestDate - timePadding);
  const currentDate = new Date();
  return d3
    .scaleTime()
    .domain([startDate, currentDate])
    .range([0, WIDTH - 100]);
};

const addTimeAxis = svg => {
  const xAxis = d3.axisTop().scale(TIME_SCALE);
  svg.append('g').attr('transform', `translate(0, ${HEIGHT})`).call(xAxis);
  return svg;
};

const addGemsAxis = svg => {
  const kvFlippedGemPositions = Object.fromEntries(
    Object.entries(GEM_POSITIONS).map(([k, v]) => [v, k])
  );

  const yScale = d3.scaleLinear().domain([0, HEIGHT]).range([HEIGHT, 0]);
  const yAxis = d3
    .axisRight(yScale)
    .tickValues(Object.keys(kvFlippedGemPositions))
    .tickFormat(x => kvFlippedGemPositions[x]);
  svg.append('g').call(yAxis);

  return svg;
};

const addBranchPoints = svg => {
  const allGemVersions = GEMS.flat();

  Object.entries(BRANCH_POINTS).forEach(([childId, parentIds]) => {
    const childVersion = allGemVersions.find(v => v.id === childId);
    const childModel = getModelFromId(childVersion.id);

    parentIds.forEach(({ id, citLink }) => {
      const parentVersion = allGemVersions.find(v => v.id === id);
      const parentModel = getModelFromId(parentVersion.id);

      const curveOffset =
        (TIME_SCALE(new Date(childVersion.releaseDate)) -
          TIME_SCALE(new Date(parentVersion.releaseDate))) /
        5;

      const heightDiff = GEM_POSITIONS[parentModel] - GEM_POSITIONS[childModel] + 50;
      const curve = [
        [TIME_SCALE(new Date(parentVersion.releaseDate)), 50],
        [
          TIME_SCALE(new Date(parentVersion.releaseDate)) + curveOffset,
          heightDiff - (heightDiff - 50) / 5,
        ],
        [TIME_SCALE(new Date(childVersion.releaseDate)), heightDiff],
      ];

      svg.append('path').attr('d', d3Curve(curve)).attr('stroke', 'lightgray').attr('fill', 'none');
    });
  });

  return svg;
};

const addGemVersions = svg => {
  GEMS.forEach(versions => {
    const model = getModelFromId(versions[0].id);
    const y = HEIGHT - GEM_POSITIONS[model];

    // add connecting lines
    svg
      .append('g')
      .selectAll('line')
      .data(versions.slice(0, -1).map(v => new Date(v.releaseDate)))
      .enter()
      .append('line')
      .style('stroke', 'lightgray')
      .attr('x1', d => TIME_SCALE(d))
      .attr('y1', y)
      .attr('x2', (_d, i) => {
        const nextD = new Date(versions[i + 1].releaseDate);
        return TIME_SCALE(nextD);
      })
      .attr('y2', y);

    //  add circles
    svg
      .append('g')
      .selectAll('circle')
      .data(versions.map(v => new Date(v.releaseDate)))
      .join('circle')
      .classed('circle', true)
      .attr('r', (_d, i) => {
        const idParts = versions[i].id.split('.');
        const isMajor = idParts[1] === '0' && idParts[2] === '0';
        return isMajor ? 24 : 18;
      })
      .attr('cy', y)
      .attr('cx', d => TIME_SCALE(d))
      .attr('data-model', (_d, i) => versions[i].id.match(/\w+-\w+/)[0])
      .attr('data-version', (_d, i) => versions[i].id.split('-')[2])
      .attr('data-release-date', (_d, i) => versions[i].releaseDate)
      .attr('data-release-link', (_d, i) => versions[i].releaseLink)
      .attr('data-pmid', (_d, i) => versions[i].PMID);

    svg
      .append('g')
      .selectAll('text')
      .data(versions.map(v => new Date(v.releaseDate)))
      .join('text')
      .classed('label', true)
      .style('fill', 'white')
      .style('font-size', '10px')
      .style('font-weight', 'bold')
      .attr('y', y + 3)
      .attr('x', (d, i) => TIME_SCALE(d) - (versions[i].id.split('.')[1] > 9 ? 5 : 2))
      .attr('transform', 'translate(-10, 0)')
      .text((_d, i) => versions[i].id.split('-')[2]);
  });

  return svg;
};

const GEMS = [
  [
    {
      id: 'Human-GEM-1.0.0',
      externalParentId: [],
      releaseDate: '2019-03-12',
      releaseLink: 'https://github.com/SysBioChalmers/Human-GEM/releases/tag/v1.0.0',
      PMID: 32209698,
    },
    {
      id: 'Human-GEM-1.1.0',
      externalParentId: [],
      releaseDate: '2019-05-12',
      releaseLink: 'https://github.com/SysBioChalmers/Human-GEM/releases/tag/v1.1.0',
      PMID: 32209698,
    },
    {
      id: 'Human-GEM-1.2.0',
      externalParentId: [],
      releaseDate: '2019-07-12',
      releaseLink: 'https://github.com/SysBioChalmers/Human-GEM/releases/tag/v1.2.0',
      PMID: 32209698,
    },
    {
      id: 'Human-GEM-1.3.0',
      externalParentId: [],
      releaseDate: '2019-09-12',
      releaseLink: 'https://github.com/SysBioChalmers/Human-GEM/releases/tag/v1.3.0',
      PMID: 32209698,
    },
    {
      id: 'Human-GEM-1.4.0',
      externalParentId: [],
      releaseDate: '2020-03-22',
      releaseLink: 'https://github.com/SysBioChalmers/Human-GEM/releases/tag/v1.4.0',
      PMID: 32209698,
    },
    {
      id: 'Human-GEM-1.5.0',
      externalParentId: [],
      releaseDate: '2020-05-03',
      releaseLink: 'https://github.com/SysBioChalmers/Human-GEM/releases/tag/v1.5.0',
      PMID: 32209698,
    },
    {
      id: 'Human-GEM-1.6.0',
      externalParentId: [],
      releaseDate: '2021-02-02',
      releaseLink: 'https://github.com/SysBioChalmers/Human-GEM/releases/tag/v1.6.0',
      PMID: 32209698,
    },
    {
      id: 'Human-GEM-1.10.0',
      externalParentId: [],
      releaseDate: '2021-09-15',
      releaseLink: 'https://github.com/SysBioChalmers/Human-GEM/releases/tag/v1.10.0',
      PMID: 32209698,
    },
  ],
  [
    {
      id: 'Mouse-GEM-1.0.0',
      externalParentId: [
        { id: 'Human-GEM-1.5.0', citLink: 'somePublicationHightlightedSentenceLink' },
      ],
      releaseDate: '2020-10-24',
      releaseLink: 'https://github.com/SysBioChalmers/Mouse-GEM/releases/tag/v1.0.0',
      PMID: 34282017,
    },
    {
      id: 'Mouse-GEM-1.1.0',
      externalParentId: [],
      releaseDate: '2021-01-15',
      releaseLink: 'https://github.com/SysBioChalmers/Mouse-GEM/releases/tag/v1.1.0',
      PMID: 34282017,
    },
  ],
  [
    {
      id: 'Rat-GEM-1.0.0',
      externalParentId: [
        { id: 'Human-GEM-1.5.0', citLink: 'somePublicationHightlightedSentenceLink' },
      ],
      releaseDate: '2020-10-24',
      releaseLink: 'https://github.com/SysBioChalmers/Rat-GEM/releases/tag/v1.0.0',
      PMID: 34282017,
    },
    {
      id: 'Rat-GEM-1.1.0',
      externalParentId: [],
      releaseDate: '2021-01-15',
      releaseLink: 'https://github.com/SysBioChalmers/Rat-GEM/releases/tag/v1.1.0',
      PMID: 34282017,
    },
  ],
  [
    {
      id: 'Yeast-GEM-1.0.0',
      externalParentId: [],
      releaseDate: '2019-05-05',
      releaseLink: 'https://github.com/SysBioChalmers/Yeast-GEM/releases/tag/v1.0.0',
      PMID: 32209698,
    },
    {
      id: 'Yeast-GEM-1.1.0',
      externalParentId: [],
      releaseDate: '2019-08-12',
      releaseLink: 'https://github.com/SysBioChalmers/Yeast-GEM/releases/tag/v1.1.0',
      PMID: 32209698,
    },
    {
      id: 'Yeast-GEM-1.2.0',
      externalParentId: [],
      releaseDate: '2019-11-12',
      releaseLink: 'https://github.com/SysBioChalmers/Yeast-GEM/releases/tag/v1.2.0',
      PMID: 32209698,
    },
    {
      id: 'Yeast-GEM-1.3.0',
      externalParentId: [],
      releaseDate: '2020-02-21',
      releaseLink: 'https://github.com/SysBioChalmers/Yeast-GEM/releases/tag/v1.3.0',
      PMID: 32209698,
    },
    {
      id: 'Yeast-GEM-1.4.0',
      externalParentId: [],
      releaseDate: '2020-07-12',
      releaseLink: 'https://github.com/SysBioChalmers/Yeast-GEM/releases/tag/v1.4.0',
      PMID: 32209698,
    },
    {
      id: 'Yeast-GEM-1.5.0',
      externalParentId: [],
      releaseDate: '2021-08-03',
      releaseLink: 'https://github.com/SysBioChalmers/Yeast-GEM/releases/tag/v1.5.0',
      PMID: 32209698,
    },
  ],
];

export { createTimelineChart };
