const fs = require('fs');
let html = fs.readFileSync('design/stitch_personal_finance_erp_dashboard/code.html', 'utf8');
let idx = html.indexOf('<div class="p-margin space-y-gutter">');
console.log(idx);
console.log(html.substring(idx, idx + 2000));
