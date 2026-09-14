const fs = require('fs');
let html = fs.readFileSync('design/stitch_personal_finance_erp_dashboard/code.html', 'utf8');

let startIndex = html.indexOf('<div class="p-margin space-y-gutter">');
if (startIndex === -1) {
    startIndex = html.indexOf('<main');
}
let jsx = html.substring(startIndex, html.lastIndexOf('</main>'));

jsx = jsx.replace(/class=/g, 'className=');
jsx = jsx.replace(/<!--[\s\S]*?-->/g, ''); 

const selfClosingTags = ['rect', 'circle', 'path', 'line', 'stop', 'img', 'input', 'hr', 'br'];
selfClosingTags.forEach(tag => {
    const regex = new RegExp('<' + tag + '([^>]*?)(?<!/)>', 'g');
    jsx = jsx.replace(regex, '<' + tag + '$1/>');
});

jsx = jsx.replace(/\/\/>/g, '/>');
jsx = jsx.replace(/preserveaspectratio/g, 'preserveAspectRatio');
jsx = jsx.replace(/viewbox/g, 'viewBox');
jsx = jsx.replace(/stroke-dasharray/g, 'strokeDasharray');
jsx = jsx.replace(/stroke-dashoffset/g, 'strokeDashoffset');
jsx = jsx.replace(/stroke-linecap/g, 'strokeLinecap');
jsx = jsx.replace(/stroke-width/g, 'strokeWidth');
jsx = jsx.replace(/stroke-opacity/g, 'strokeOpacity');
jsx = jsx.replace(/fill-opacity/g, 'fillOpacity');
jsx = jsx.replace(/lineargradient/g, 'linearGradient');
jsx = jsx.replace(/<\/lineargradient>/g, '</linearGradient>');

jsx = jsx.replace(/style="([^"]+)"/g, (match, p1) => {
    const props = p1.split(';').filter(Boolean).map(s => {
        let parts = s.split(':');
        if (parts.length < 2) return '';
        let k = parts[0].trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        let v = parts.slice(1).join(':').trim();
        return k + ': "' + v + '"';
    }).filter(Boolean);
    return 'style={{' + props.join(', ') + '}}';
});

fs.writeFileSync('scratch/out.jsx', jsx);
console.log('Done converting!');
