const shieldsLess = require('shields-less')

var svgBadge = shieldsLess.svg({
  leftText: 'downloads',
  rightText: '0.2k/weekly'
})

console.log(svgBadge);

const fs = require('fs')

fs.writeFile('download.svg', svgBadge, 'utf8', (err, res)=>{
  if(err) throw err;
  console.log('SVG generated successful！');
});