const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard/DesktopView.jsx', 'utf8');

code = code.replace(/\/><\/stop>/g, '/>');
code = code.replace(/\/><\/line>/g, '/>');
code = code.replace(/\/><\/path>/g, '/>');
code = code.replace(/\/><\/rect>/g, '/>');
code = code.replace(/\/><\/circle>/g, '/>');
code = code.replace(/\/><\/img>/g, '/>');
code = code.replace(/\/><\/input>/g, '/>');

// Also need to camelCase SVG attributes properly.
code = code.replace(/stop-color/g, 'stopColor');
code = code.replace(/stop-opacity/g, 'stopOpacity');
code = code.replace(/stroke-dasharray/g, 'strokeDasharray');
code = code.replace(/stroke-dashoffset/g, 'strokeDashoffset');
code = code.replace(/stroke-linecap/g, 'strokeLinecap');
code = code.replace(/stroke-width/g, 'strokeWidth');
code = code.replace(/stroke-opacity/g, 'strokeOpacity');
code = code.replace(/fill-opacity/g, 'fillOpacity');
code = code.replace(/stroke-color/g, 'strokeColor');

fs.writeFileSync('src/components/Dashboard/DesktopView.jsx', code);
console.log('Fixed syntax errors');
