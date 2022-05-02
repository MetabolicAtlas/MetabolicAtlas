import * as d3 from 'd3';

const d3Curve = d3.line().curve(d3.curveNatural);
const WIDTH = 1600;
let HEIGHT, GEM_POSITIONS, BRANCH_POINTS, TIME_SCALE;

const createTimelineChart = () => {
  HEIGHT = getHeight();
  GEM_POSITIONS = getGemPositions();
  BRANCH_POINTS = getBranchPoints();
  TIME_SCALE = createTimeScale();

  let svg = d3.create('svg').attr('width', WIDTH).attr('height', HEIGHT);

  svg = addBranchPoints(svg);
  svg = addGemVersions(svg);
  svg = addTimeAxis(svg);
  svg = addGemsAxis(svg);

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

  const yScaleLeft = d3.scaleLinear().domain([0, HEIGHT]).range([HEIGHT, 0]);
  const yAxisLeft = d3
    .axisRight(yScaleLeft)
    .tickValues(Object.keys(kvFlippedGemPositions))
    .tickFormat(x => kvFlippedGemPositions[x]);
  svg.append('g').call(yAxisLeft);

  const yScaleRight = d3.scaleLinear().domain([0, HEIGHT]).range([HEIGHT, 0]);
  const yAxisRight = d3
    .axisLeft(yScaleRight)
    .tickValues(Object.keys(kvFlippedGemPositions))
    .tickFormat(x => kvFlippedGemPositions[x]);
  svg.append('g').attr('transform', `translate(${WIDTH}, 0)`).call(yAxisRight);

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

      const curve = [
        [TIME_SCALE(new Date(parentVersion.releaseDate)), HEIGHT - GEM_POSITIONS[parentModel]],
        [
          TIME_SCALE(new Date(parentVersion.releaseDate)) + curveOffset,
          HEIGHT -
            GEM_POSITIONS[childModel] -
            (HEIGHT - GEM_POSITIONS[childModel] - (HEIGHT - GEM_POSITIONS[parentModel])) / 5,
        ],
        [TIME_SCALE(new Date(childVersion.releaseDate)), HEIGHT - GEM_POSITIONS[childModel]],
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
      id: 'Fruitfly-GEM-1.0.0',
      externalParentId: [
        {
          id: 'Human-GEM-1.5.0',
          citLink:
            'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8325244/#:~:text=In%20this%20pipeline%2C%20the%20open%2Dcurated%20generic%20human%20GEM%2C%20Human1%20(11)%2C%20was%20used%20as%20a%20template',
        },
      ],
      releaseDate: '2021-01-17',
      releaseLink: 'https://github.com/SysBioChalmers/Fruitfly-GEM/releases/tag/v1.0.0',
      PMID: '34282017',
      count: {},
      validation: {},
    },
    {
      id: 'Fruitfly-GEM-1.1.0',
      externalParentId: [],
      releaseDate: '2021-07-17',
      releaseLink: 'https://github.com/SysBioChalmers/Fruitfly-GEM/releases/tag/v1.1.0',
      PMID: '34282017',
      count: {},
      validation: {},
    },
  ],
  [
    {
      id: 'Human-GEM-1.0.0',
      externalParentId: [],
      releaseDate: '2019-03-12',
      releaseLink: 'https://github.com/SysBioChalmers/Human-GEM/releases/tag/v1.0.0',
      PMID: '32209698',
      count: {},
      validation: {},
    },
    {
      id: 'Human-GEM-1.0.1',
      externalParentId: [],
      releaseDate: '2019-04-03',
      releaseLink: 'https://github.com/SysBioChalmers/Human-GEM/releases/tag/v1.0.1',
      PMID: '32209698',
      count: {},
      validation: {},
    },
    {
      id: 'Human-GEM-1.0.2',
      externalParentId: [],
      releaseDate: '2019-04-19',
      releaseLink: 'https://github.com/SysBioChalmers/Human-GEM/releases/tag/v1.0.2',
      PMID: '32209698',
      count: {},
      validation: {},
    },
    {
      id: 'Human-GEM-1.0.3',
      externalParentId: [],
      releaseDate: '2019-05-17',
      releaseLink: 'https://github.com/SysBioChalmers/Human-GEM/releases/tag/v1.0.3',
      PMID: '32209698',
      count: {},
      validation: {},
    },
    {
      id: 'Human-GEM-1.1.0',
      externalParentId: [],
      releaseDate: '2019-06-13',
      releaseLink: 'https://github.com/SysBioChalmers/Human-GEM/releases/tag/v1.1.0',
      PMID: '32209698',
      count: {},
      validation: {},
    },
    {
      id: 'Human-GEM-1.1.1',
      externalParentId: [],
      releaseDate: '2019-09-26',
      releaseLink: 'https://github.com/SysBioChalmers/Human-GEM/releases/tag/v1.1.1',
      PMID: '32209698',
      count: {},
      validation: {},
    },
    {
      id: 'Human-GEM-1.1.2',
      externalParentId: [],
      releaseDate: '2019-10-04',
      releaseLink: 'https://github.com/SysBioChalmers/Human-GEM/releases/tag/v1.1.2',
      PMID: '32209698',
      count: {},
      validation: {},
    },
    {
      id: 'Human-GEM-1.1.3',
      externalParentId: [],
      releaseDate: '2019-10-21',
      releaseLink: 'https://github.com/SysBioChalmers/Human-GEM/releases/tag/v1.1.3',
      PMID: '32209698',
      count: {},
      validation: {},
    },
    {
      id: 'Human-GEM-1.2.0',
      externalParentId: [],
      releaseDate: '2019-11-25',
      releaseLink: 'https://github.com/SysBioChalmers/Human-GEM/releases/tag/v1.2.0',
      PMID: '32209698',
      count: {},
      validation: {},
    },
    {
      id: 'Human-GEM-1.2.1',
      externalParentId: [],
      releaseDate: '2019-12-16',
      releaseLink: 'https://github.com/SysBioChalmers/Human-GEM/releases/tag/v1.2.1',
      PMID: '32209698',
      count: {},
      validation: {},
    },
    {
      id: 'Human-GEM-1.3.0',
      externalParentId: [],
      releaseDate: '2019-12-19',
      releaseLink: 'https://github.com/SysBioChalmers/Human-GEM/releases/tag/v1.3.0',
      PMID: '32209698',
      count: {},
      validation: {},
    },
    {
      id: 'Human-GEM-1.3.1',
      externalParentId: [],
      releaseDate: '2020-03-27',
      releaseLink: 'https://github.com/SysBioChalmers/Human-GEM/releases/tag/v1.3.1',
      PMID: '32209698',
      count: {},
      validation: {},
    },
    {
      id: 'Human-GEM-1.3.2',
      externalParentId: [],
      releaseDate: '2020-04-25',
      releaseLink: 'https://github.com/SysBioChalmers/Human-GEM/releases/tag/v1.3.2',
      PMID: '32209698',
      count: {},
      validation: {},
    },
    {
      id: 'Human-GEM-1.4.0',
      externalParentId: [],
      releaseDate: '2020-06-12',
      releaseLink: 'https://github.com/SysBioChalmers/Human-GEM/releases/tag/v1.4.0',
      PMID: '32209698',
      count: {},
      validation: {},
    },
    {
      id: 'Human-GEM-1.4.1',
      externalParentId: [],
      releaseDate: '2020-07-29',
      releaseLink: 'https://github.com/SysBioChalmers/Human-GEM/releases/tag/v1.4.1',
      PMID: '32209698',
      count: {},
      validation: {},
    },
    {
      id: 'Human-GEM-1.5.0',
      externalParentId: [],
      releaseDate: '2020-10-17',
      releaseLink: 'https://github.com/SysBioChalmers/Human-GEM/releases/tag/v1.5.0',
      PMID: '32209698',
      count: {},
      validation: {},
    },
    {
      id: 'Human-GEM-1.6.0',
      externalParentId: [],
      releaseDate: '2021-01-25',
      releaseLink: 'https://github.com/SysBioChalmers/Human-GEM/releases/tag/v1.6.0',
      PMID: '32209698',
      count: {},
      validation: {},
    },
    {
      id: 'Human-GEM-1.7.0',
      externalParentId: [],
      releaseDate: '2021-04-20',
      releaseLink: 'https://github.com/SysBioChalmers/Human-GEM/releases/tag/v1.7.0',
      PMID: '32209698',
      count: {},
      validation: {},
    },
    {
      id: 'Human-GEM-1.8.0',
      externalParentId: [],
      releaseDate: '2021-06-23',
      releaseLink: 'https://github.com/SysBioChalmers/Human-GEM/releases/tag/v1.8.0',
      PMID: '32209698',
      count: {},
      validation: {},
    },
    {
      id: 'Human-GEM-1.9.0',
      externalParentId: [],
      releaseDate: '2021-08-12',
      releaseLink: 'https://github.com/SysBioChalmers/Human-GEM/releases/tag/v1.9.0',
      PMID: '32209698',
      count: {},
      validation: {},
    },
    {
      id: 'Human-GEM-1.10.0',
      externalParentId: [],
      releaseDate: '2021-09-14',
      releaseLink: 'https://github.com/SysBioChalmers/Human-GEM/releases/tag/v1.10.0',
      PMID: '32209698',
      count: {},
      validation: {},
    },
    {
      id: 'Human-GEM-1.11.0',
      externalParentId: [],
      releaseDate: '2022-02-07',
      releaseLink: 'https://github.com/SysBioChalmers/Human-GEM/releases/tag/v1.11.0',
      PMID: '32209698',
      count: {},
      validation: {},
    },
  ],
  [
    {
      id: 'Mouse-GEM-1.0.0',
      externalParentId: [
        {
          id: 'Human-GEM-1.5.0',
          citLink:
            'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8325244/#:~:text=In%20this%20pipeline%2C%20the%20open%2Dcurated%20generic%20human%20GEM%2C%20Human1%20(11)%2C%20was%20used%20as%20a%20template',
        },
      ],
      releaseDate: '2020-10-24',
      releaseLink: 'https://github.com/SysBioChalmers/Mouse-GEM/releases/tag/v1.0.0',
      PMID: '34282017',
      count: {},
      validation: {},
    },
    {
      id: 'Mouse-GEM-1.1.0',
      externalParentId: [],
      releaseDate: '2021-01-15',
      releaseLink: 'https://github.com/SysBioChalmers/Mouse-GEM/releases/tag/v1.1.0',
      PMID: '34282017',
      count: {},
      validation: {},
    },
    {
      id: 'Mouse-GEM-1.2.0',
      externalParentId: [],
      releaseDate: '2021-07-17',
      releaseLink: 'https://github.com/SysBioChalmers/Mouse-GEM/releases/tag/v1.2.0',
      PMID: '34282017',
      count: {},
      validation: {},
    },
    {
      id: 'Mouse-GEM-1.3.0',
      externalParentId: [],
      releaseDate: '2022-04-05',
      releaseLink: 'https://github.com/SysBioChalmers/Mouse-GEM/releases/tag/v1.3.0',
      PMID: '34282017',
      count: {},
      validation: {},
    },
  ],
  [
    {
      id: 'Rat-GEM-1.0.0',
      externalParentId: [
        {
          id: 'Human-GEM-1.5.0',
          citLink:
            'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8325244/#:~:text=In%20this%20pipeline%2C%20the%20open%2Dcurated%20generic%20human%20GEM%2C%20Human1%20(11)%2C%20was%20used%20as%20a%20template',
        },
      ],
      releaseDate: '2020-10-24',
      releaseLink: 'https://github.com/SysBioChalmers/Rat-GEM/releases/tag/v1.0.0',
      PMID: '34282017',
      count: {},
      validation: {},
    },
    {
      id: 'Rat-GEM-1.1.0',
      externalParentId: [],
      releaseDate: '2021-01-15',
      releaseLink: 'https://github.com/SysBioChalmers/Rat-GEM/releases/tag/v1.1.0',
      PMID: '34282017',
      count: {},
      validation: {},
    },
    {
      id: 'Rat-GEM-1.2.0',
      externalParentId: [],
      releaseDate: '2021-07-17',
      releaseLink: 'https://github.com/SysBioChalmers/Rat-GEM/releases/tag/v1.2.0',
      PMID: '34282017',
      count: {},
      validation: {},
    },
  ],
  [
    {
      id: 'Worm-GEM-1.0.0',
      externalParentId: [
        {
          id: 'Human-GEM-1.5.0',
          citLink:
            'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8325244/#:~:text=In%20this%20pipeline%2C%20the%20open%2Dcurated%20generic%20human%20GEM%2C%20Human1%20(11)%2C%20was%20used%20as%20a%20template',
        },
      ],
      releaseDate: '2021-01-17',
      releaseLink: 'https://github.com/SysBioChalmers/Worm-GEM/releases/tag/v1.0.0',
      PMID: '34282017',
      count: {},
      validation: {},
    },
    {
      id: 'Worm-GEM-1.1.0',
      externalParentId: [],
      releaseDate: '2021-05-30',
      releaseLink: 'https://github.com/SysBioChalmers/Worm-GEM/releases/tag/v1.1.0',
      PMID: '34282017',
      count: {},
      validation: {},
    },
    {
      id: 'Worm-GEM-1.2.0',
      externalParentId: [],
      releaseDate: '2021-07-17',
      releaseLink: 'https://github.com/SysBioChalmers/Worm-GEM/releases/tag/v1.2.0',
      PMID: '34282017',
      count: {},
      validation: {},
    },
  ],
  [
    {
      id: 'Yeast-GEM-7.6.0',
      externalParentId: [],
      releaseDate: '2018-06-27',
      releaseLink: 'https://github.com/SysBioChalmers/yeast-GEM/releases/tag/v7.6.0',
      PMID: '31395883',
      count: {},
      validation: {},
    },
    {
      id: 'Yeast-GEM-7.7.0',
      externalParentId: [],
      releaseDate: '2018-06-27',
      releaseLink: 'https://github.com/SysBioChalmers/yeast-GEM/releases/tag/v7.7.0',
      PMID: '31395883',
      count: {},
      validation: {},
    },
    {
      id: 'Yeast-GEM-7.8.0',
      externalParentId: [],
      releaseDate: '2018-01-18',
      releaseLink: 'https://github.com/SysBioChalmers/yeast-GEM/releases/tag/v7.8.0',
      PMID: '31395883',
      count: {},
      validation: {},
    },
    {
      id: 'Yeast-GEM-7.8.1',
      externalParentId: [],
      releaseDate: '2018-01-25',
      releaseLink: 'https://github.com/SysBioChalmers/yeast-GEM/releases/tag/v7.8.1',
      PMID: '31395883',
      count: {},
      validation: {},
    },
    {
      id: 'Yeast-GEM-7.8.2',
      externalParentId: [],
      releaseDate: '2018-01-30',
      releaseLink: 'https://github.com/SysBioChalmers/yeast-GEM/releases/tag/v7.8.2',
      PMID: '31395883',
      count: {},
      validation: {},
    },
    {
      id: 'Yeast-GEM-7.8.3',
      externalParentId: [],
      releaseDate: '2018-02-28',
      releaseLink: 'https://github.com/SysBioChalmers/yeast-GEM/releases/tag/v7.8.3',
      PMID: '31395883',
      count: {},
      validation: {},
    },
    {
      id: 'Yeast-GEM-8.0.0',
      externalParentId: [],
      releaseDate: '2018-03-30',
      releaseLink: 'https://github.com/SysBioChalmers/yeast-GEM/releases/tag/v8.0.0',
      PMID: '31395883',
      count: {},
      validation: {},
    },
    {
      id: 'Yeast-GEM-8.0.1',
      externalParentId: [],
      releaseDate: '2018-04-16',
      releaseLink: 'https://github.com/SysBioChalmers/yeast-GEM/releases/tag/v8.0.1',
      PMID: '31395883',
      count: {},
      validation: {},
    },
    {
      id: 'Yeast-GEM-8.0.2',
      externalParentId: [],
      releaseDate: '2018-05-14',
      releaseLink: 'https://github.com/SysBioChalmers/yeast-GEM/releases/tag/v8.0.2',
      PMID: '31395883',
      count: {},
      validation: {},
    },
    {
      id: 'Yeast-GEM-8.1.0',
      externalParentId: [],
      releaseDate: '2018-05-30',
      releaseLink: 'https://github.com/SysBioChalmers/yeast-GEM/releases/tag/v8.1.0',
      PMID: '31395883',
      count: {},
      validation: {},
    },
    {
      id: 'Yeast-GEM-8.1.1',
      externalParentId: [],
      releaseDate: '2018-06-10',
      releaseLink: 'https://github.com/SysBioChalmers/yeast-GEM/releases/tag/v8.1.1',
      PMID: '31395883',
      count: {},
      validation: {},
    },
    {
      id: 'Yeast-GEM-8.1.2',
      externalParentId: [],
      releaseDate: '2018-06-27',
      releaseLink: 'https://github.com/SysBioChalmers/yeast-GEM/releases/tag/v8.1.2',
      PMID: '31395883',
      count: {},
      validation: {},
    },
    {
      id: 'Yeast-GEM-8.1.3',
      externalParentId: [],
      releaseDate: '2018-07-16',
      releaseLink: 'https://github.com/SysBioChalmers/yeast-GEM/releases/tag/v8.1.3',
      PMID: '31395883',
      count: {},
      validation: {},
    },
    {
      id: 'Yeast-GEM-8.2.0',
      externalParentId: [],
      releaseDate: '2018-08-08',
      releaseLink: 'https://github.com/SysBioChalmers/yeast-GEM/releases/tag/v8.2.0',
      PMID: '31395883',
      count: {},
      validation: {},
    },
    {
      id: 'Yeast-GEM-8.3.0',
      externalParentId: [],
      releaseDate: '2018-09-06',
      releaseLink: 'https://github.com/SysBioChalmers/yeast-GEM/releases/tag/v8.3.0',
      PMID: '31395883',
      count: {},
      validation: {},
    },
    {
      id: 'Yeast-GEM-8.3.1',
      externalParentId: [],
      releaseDate: '2018-09-28',
      releaseLink: 'https://github.com/SysBioChalmers/yeast-GEM/releases/tag/v8.3.1',
      PMID: '31395883',
      count: {},
      validation: {},
    },
    {
      id: 'Yeast-GEM-8.3.2',
      externalParentId: [],
      releaseDate: '2018-11-22',
      releaseLink: 'https://github.com/SysBioChalmers/yeast-GEM/releases/tag/v8.3.2',
      PMID: '31395883',
      count: {},
      validation: {},
    },
    {
      id: 'Yeast-GEM-8.3.3',
      externalParentId: [],
      releaseDate: '2018-12-06',
      releaseLink: 'https://github.com/SysBioChalmers/yeast-GEM/releases/tag/v8.3.3',
      PMID: '31395883',
      count: {},
      validation: {},
    },
    {
      id: 'Yeast-GEM-8.3.4',
      externalParentId: [],
      releaseDate: '2019-07-28',
      releaseLink: 'https://github.com/SysBioChalmers/yeast-GEM/releases/tag/v8.3.4',
      PMID: '31395883',
      count: {},
      validation: {},
    },
    {
      id: 'Yeast-GEM-8.3.5',
      externalParentId: [],
      releaseDate: '2020-04-02',
      releaseLink: 'https://github.com/SysBioChalmers/yeast-GEM/releases/tag/v8.3.5',
      PMID: '31395883',
      count: {},
      validation: {},
    },
    {
      id: 'Yeast-GEM-8.4.0',
      externalParentId: [],
      releaseDate: '2020-06-15',
      releaseLink: 'https://github.com/SysBioChalmers/yeast-GEM/releases/tag/v8.4.0',
      PMID: '31395883',
      count: {},
      validation: {},
    },
    {
      id: 'Yeast-GEM-8.4.1',
      externalParentId: [],
      releaseDate: '2020-07-20',
      releaseLink: 'https://github.com/SysBioChalmers/yeast-GEM/releases/tag/v8.4.1',
      PMID: '31395883',
      count: {},
      validation: {},
    },
    {
      id: 'Yeast-GEM-8.4.2',
      externalParentId: [],
      releaseDate: '2020-09-23',
      releaseLink: 'https://github.com/SysBioChalmers/yeast-GEM/releases/tag/v8.4.2',
      PMID: '31395883',
      count: {},
      validation: {},
    },
    {
      id: 'Yeast-GEM-8.5.0',
      externalParentId: [],
      releaseDate: '2021-07-02',
      releaseLink: 'https://github.com/SysBioChalmers/yeast-GEM/releases/tag/v8.5.0',
      PMID: '31395883',
      count: {},
      validation: {},
    },
  ],
  [
    {
      id: 'Zebrafish-GEM-1.0.0',
      externalParentId: [
        {
          id: 'Human-GEM-1.5.0',
          citLink:
            'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8325244/#:~:text=In%20this%20pipeline%2C%20the%20open%2Dcurated%20generic%20human%20GEM%2C%20Human1%20(11)%2C%20was%20used%20as%20a%20template',
        },
      ],
      releaseDate: '2021-01-17',
      releaseLink: 'https://github.com/SysBioChalmers/Zebrafish-GEM/releases/tag/v1.0.0',
      PMID: '34282017',
      count: {},
      validation: {},
    },
    {
      id: 'Zebrafish-GEM-1.1.0',
      externalParentId: [],
      releaseDate: '2021-07-17',
      releaseLink: 'https://github.com/SysBioChalmers/Zebrafish-GEM/releases/tag/v1.1.0',
      PMID: '34282017',
      count: {},
      validation: {},
    },
  ],
].map(versions => versions.filter(v => v.id.split('.')[2] === '0'));

export { createTimelineChart };
