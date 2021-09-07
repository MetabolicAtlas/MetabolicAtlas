import fs from 'fs';
const sharp = require('sharp');

const w_thumb = 400;
const getSvgThumbnail = async (svgName, model) => {
  const sharp = require('sharp');
  const svgFile = `/project/svg/${model}/${svgName}.svg`;
  const svgThumbnail = await sharp(svgFile)
    .resize(w_thumb)
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .png()
    .toBuffer()
    .then(function(info) {
      return info
    })
    .catch(function(err) {
    });
  return svgThumbnail;
};

export default getSvgThumbnail;
