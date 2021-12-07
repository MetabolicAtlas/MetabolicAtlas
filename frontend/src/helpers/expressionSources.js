export const notDetectedColor = 'lightgray'

// Single series colors
const slr = 255 // left red
const slg = 255 // left green
const slb = 255 // left blue
const smr = 255 // middle red
const smg = 233 // middle green
const smb = 69 // middle blue
const srr = 255 // middle red
const srg = 89 // middle green
const srb = 0 // middle blue

const singleLeftColor = `rgb(${slr},${slg},${slb})` // single left color
const singleMiddleColor = `rgb(${smr},${smg},${smb})` // single right color
const singleRightColor = `rgb(${srr},${srg},${srb})` // single right color
export const singleColors = `${singleLeftColor}, ${singleMiddleColor}, ${singleRightColor}`

const MAX = 1
const HALF = MAX / 2
export const getSingleExpressionColor = (value) => {
  if (Number.isNaN(value)) {
    return notDetectedColor
  }
  if (value > MAX) {
    return singleRightColor
  }
  if (value < HALF) {
    const ratio = value / HALF
    const r = slr + ratio * (smr - slr)
    const g = slg + ratio * (smg - slg)
    const b = slb + ratio * (smb - slb)
    return `rgb(${r},${g},${b})`
  }
  const ratio = (value - HALF) / HALF
  const g = smg - ratio * (smg - srg)
  const b = smb - ratio * smb
  return `rgb(${srr},${g},${b})`
}
