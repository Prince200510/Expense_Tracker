const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard/DesktopView.jsx', 'utf8');

const dynamicGraphCode = `
    // Process last 6 months for the graph
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const currentMonthIndex = today.getMonth();
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
        let d = new Date(today.getFullYear(), currentMonthIndex - i, 1);
        last6Months.push({
            label: monthNames[d.getMonth()],
            year: d.getFullYear(),
            month: d.getMonth(),
            inflow: 0,
            outflow: 0
        });
    }

    transactions.forEach(tx => {
        if (!tx.date) return;
        const txDate = new Date(tx.date);
        const txMonth = txDate.getMonth();
        const txYear = txDate.getFullYear();
        
        const monthData = last6Months.find(m => m.month === txMonth && m.year === txYear);
        if (monthData) {
            if (tx.type === 'credit') monthData.inflow += Number(tx.amount || 0);
            if (tx.type === 'debit') monthData.outflow += Number(tx.amount || 0);
        }
    });

    // Calculate max value for dynamic scaling
    const maxVal = Math.max(...last6Months.map(m => Math.max(m.inflow, m.outflow)), 10000); // minimum 10k scale
    // We want the highest grid line to be somewhat above maxVal.
    const gridMax = Math.ceil(maxVal / 10000) * 12000; 
    
    // Y pixel range: 30 to 200 (170px total span for gridMax)
    const getY = (amount) => 200 - (amount / gridMax) * 170;
    const formatScale = (amt) => amt >= 100000 ? '₹' + (amt/100000).toFixed(1) + 'L' : '₹' + (amt/1000).toFixed(0) + 'k';

    // X positions for the 6 months
    const xPositions = [95, 215, 335, 455, 575, 695];
`;

code = code.replace(/const categorySpending = \{\};/, dynamicGraphCode + '\n    const categorySpending = {};');

const svgReplacement = `
<div className="relative w-full h-64 mt-2">
<svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 760 220">
<defs>
<linearGradient id="surplusGradient" x1="0" x2="0" y1="0" y2="1">
<stop offset="0%" stopColor="#0051d5" stopOpacity="0.18"/>
<stop offset="100%" stopColor="#0051d5" stopOpacity="0.0"/>
</linearGradient>
</defs>

<line stroke="#c6c6cd" strokeDasharray="3 3" strokeOpacity="0.3" x1="40" x2="750" y1="30" y2="30"/>
<text fill="#76777d" fontFamily="JetBrains Mono" fontSize="10" textAnchor="end" x="32" y="34">{formatScale(gridMax)}</text>
<line stroke="#c6c6cd" strokeDasharray="3 3" strokeOpacity="0.3" x1="40" x2="750" y1="86" y2="86"/>
<text fill="#76777d" fontFamily="JetBrains Mono" fontSize="10" textAnchor=\"end\" x=\"32\" y=\"90\">{formatScale(gridMax * 0.66)}</text>
<line stroke=\"#c6c6cd\" strokeDasharray=\"3 3\" strokeOpacity=\"0.3\" x1=\"40\" x2=\"750\" y1=\"143\" y2=\"143\"/>
<text fill=\"#76777d\" fontFamily=\"JetBrains Mono\" fontSize=\"10\" textAnchor=\"end\" x=\"32\" y=\"147\">{formatScale(gridMax * 0.33)}</text>
<line stroke=\"#c6c6cd\" strokeOpacity=\"0.5\" x1=\"40\" x2=\"750\" y1=\"200\" y2=\"200\"/>
<text fill=\"#76777d\" fontFamily=\"JetBrains Mono\" fontSize=\"10\" textAnchor=\"end\" x=\"32\" y=\"204\">₹0</text>

{/* Net Surplus Trendline */}
<path d={\`M \${last6Months.map((m, i) => \`\${xPositions[i]},\${getY(m.inflow - m.outflow)}\`).join(' L ')}\`} fill=\"none\" stroke=\"#0051d5\" strokeLinecap=\"round\" strokeWidth=\"2.5\"/>
<path d={\`M \${xPositions[0]},\${getY(last6Months[0].inflow - last6Months[0].outflow)} \${last6Months.map((m, i) => \`L \${xPositions[i]},\${getY(m.inflow - m.outflow)}\`).join(' ')} L \${xPositions[5]},200 L \${xPositions[0]},200 Z\`} fill=\"url(#surplusGradient)\"/>

{last6Months.map((m, i) => {
    const xCenter = xPositions[i];
    const yIn = getY(m.inflow);
    const yOut = getY(m.outflow);
    const hIn = 200 - yIn;
    const hOut = 200 - yOut;
    const isCurrent = i === 5;
    return (
        <g key={i}>
            <rect className=\"hover:opacity-85 transition-opacity\" fill=\"#069669\" x={xCenter - 20} y={yIn} width=\"18\" height={Math.max(hIn, 0)} rx=\"2\"/>
            <rect className=\"hover:opacity-85 transition-opacity\" fill=\"#ba1a1a\" fillOpacity=\"0.85\" x={xCenter + 2} y={yOut} width=\"18\" height={Math.max(hOut, 0)} rx=\"2\"/>
            
            {isCurrent && <circle cx={xCenter} cy={getY(m.inflow - m.outflow)} r=\"4\" fill=\"#0051d5\" stroke=\"#ffffff\" strokeWidth=\"2\"/>}
            <text fill={isCurrent ? \"#0b1c30\" : \"#45464d\"} fontFamily=\"Inter\" fontSize=\"11\" fontWeight={isCurrent ? \"600\" : \"500\"} textAnchor=\"middle\" x={xCenter} y=\"218\">
                {m.label} {isCurrent && '(CUR)'}
            </text>
        </g>
    );
})}
</svg>
</div>
`;

const svgStart = '<div className="relative w-full h-64 mt-2">';
const svgEnd = '</svg>\n</div>';
let startIdx = code.indexOf(svgStart);
let endIdx = code.indexOf(svgEnd) + svgEnd.length;

if(startIdx !== -1 && endIdx !== -1) {
    code = code.substring(0, startIdx) + svgReplacement + code.substring(endIdx);
    fs.writeFileSync('src/components/Dashboard/DesktopView.jsx', code);
    console.log('Graph replaced dynamically!');
} else {
    console.log('Could not find SVG block!');
}
