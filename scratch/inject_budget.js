const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard/DesktopView.jsx', 'utf8');

const dynamicBudget = `
                            {sortedCategories.slice(0, 4).map(([cat, amt]) => {
                                // Dynamic budget caps - assuming each category cap is amt + some arbitrary buffer for display purposes
                                // Normally this would be pulled from a real Budget schema
                                const fakeCap = Math.max(amt, 10000) * 1.5; 
                                const pct = Math.min((amt / fakeCap) * 100, 100).toFixed(1);
                                const isWarning = pct > 85;
                                return (
                                    <div key={cat} className="p-space-sm bg-surface-container-low rounded-lg">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="font-body-sm font-semibold text-on-surface">{cat}</span>
                                            <span className={\`px-1.5 py-0.2 rounded font-label-sm text-[10px] uppercase font-semibold \${isWarning ? 'bg-error-container text-on-error-container' : 'bg-surface-container text-on-surface-variant'}\`}>
                                                {pct}% {isWarning ? 'Warning' : 'Locked'}
                                            </span>
                                        </div>
                                        <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                                            <div className={\`h-full rounded-full \${isWarning ? 'bg-error' : 'bg-primary-container'}\`} style={{width: \`\${pct}%\`}}></div>
                                        </div>
                                        <div className="flex items-center justify-between mt-1 text-label-sm font-numeric-table text-outline">
                                            <span className={isWarning ? 'text-error font-medium' : ''}>{isWarning ? 'Spent: ' : 'Disbursed: '}₹{amt.toLocaleString()}</span>
                                            <span>Cap: ₹{fakeCap.toLocaleString()}</span>
                                        </div>
                                    </div>
                                );
                            })}
                            {sortedCategories.length === 0 && (
                                <div className="text-center py-4 text-on-surface-variant text-body-sm">No active budgets.</div>
                            )}
`;

let budgetStartStr = '<div className="space-y-space-md mt-space-xs">';
let budgetStart = code.lastIndexOf(budgetStartStr);
let budgetEndStr = '<div className="pt-space-sm mt-space-sm border-t-0 flex items-center justify-between text-outline font-label-sm text-[11px]">';
let budgetEnd = code.indexOf(budgetEndStr, budgetStart);

// find closing div of space-y-space-md before budgetEnd
let closingDivIndex = code.lastIndexOf('</div>', budgetEnd);

let beforeBudget = code.substring(0, budgetStart + budgetStartStr.length);
let afterBudget = code.substring(closingDivIndex);

code = beforeBudget + dynamicBudget + afterBudget;
code = code.replace(/Active Cap: ₹2\.10L/g, 'Active Cap: ₹{budgetCap.toLocaleString()}');

fs.writeFileSync('src/components/Dashboard/DesktopView.jsx', code);
console.log('Budget block replaced');
