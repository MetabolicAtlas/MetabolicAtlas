const sharp = require('sharp');

const getSvgThumbnail = async (svgName, size, model) => {
  const sharp = require('sharp');
  const svgFile = `/project/svg/${model}/${svgName}.svg`;
  const svgThumbnail = await sharp(svgFile, { limitInputPixels: false })
    .resize(size)
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
