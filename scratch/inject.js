const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard/DesktopView.jsx', 'utf8');

// The Recent Transactions starts at `<tbody className="divide-y-0 font-numeric-table">`
// and ends at `</tbody>`
const txReplacement = `
                                    {transactions.slice(0, 6).map(tx => (
                                        <tr key={tx.id} className="hover:bg-surface-container-low transition-colors">
                                            <td className="py-2 px-3 text-outline text-label-sm whitespace-nowrap">{tx.date} {tx.time && ', ' + tx.time}</td>
                                            <td className="py-2 px-3 font-medium text-on-surface font-body-sm flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                                                <div className="flex flex-col leading-tight">
                                                    <span>{tx.purpose || 'Unknown'}</span>
                                                    {tx.description && <span className="text-[10px] text-outline font-normal">{tx.description}</span>}
                                                </div>
                                            </td>
                                            <td className="py-2 px-3">
                                                <span className="px-1.5 py-0.5 bg-surface-container rounded text-[10px] text-on-surface-variant">{tx.category || 'General'}</span>
                                            </td>
                                            <td className="py-2 px-3 text-on-surface-variant text-label-sm">{tx.payment_method || 'Bank'}</td>
                                            <td className="py-2 px-3 text-center">
                                                <span className={\`px-1 py-0.2 rounded text-[10px] font-semibold \${tx.type === 'credit' ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-error-container text-on-error-container'}\`}>
                                                    {tx.type === 'credit' ? 'CR' : 'DR'}
                                                </span>
                                            </td>
                                            <td className={\`py-2 px-3 text-right font-semibold \${tx.type === 'credit' ? 'text-on-tertiary-container' : 'text-error'}\`}>
                                                {tx.type === 'credit' ? '+' : '-'}₹{Number(tx.amount || 0).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                    {transactions.length === 0 && (
                                        <tr><td colSpan="6" className="text-center py-8 text-on-surface-variant text-body-sm">No recent transactions</td></tr>
                                    )}
`;

let tbodyStartStr = '<tbody className="divide-y-0 font-numeric-table">';
let tbodyStart = code.indexOf(tbodyStartStr);
let tbodyEnd = code.indexOf('</tbody>', tbodyStart);
let beforeTbody = code.substring(0, tbodyStart + tbodyStartStr.length);
let afterTbody = code.substring(tbodyEnd);
code = beforeTbody + txReplacement + afterTbody;

// For Category Spending
const catReplacement = `
                            {sortedCategories.slice(0, 5).map(([cat, amt]) => {
                                const pct = outflowNum > 0 ? ((amt / outflowNum) * 100).toFixed(1) : 0;
                                return (
                                    <div key={cat} className="flex items-center justify-between text-body-sm font-body-sm mb-2">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <span className="w-2 h-2 rounded-full bg-primary-container"></span>
                                            <span className="text-on-surface truncate">{cat}</span>
                                        </div>
                                        <div className="flex items-center gap-2 font-numeric-table text-label-sm">
                                            <span className="text-on-surface font-medium">₹{amt.toLocaleString()}</span>
                                            <span className="text-outline w-8">{pct}%</span>
                                        </div>
                                    </div>
                                );
                            })}
                            {sortedCategories.length === 0 && (
                                <div className="text-center py-4 text-on-surface-variant text-body-sm">No spending data available.</div>
                            )}
`;

let catSectionStartStr = '<div className="space-y-space-xs">';
let catSectionStart = code.indexOf(catSectionStartStr);
let catSectionEndStr = '<div className="pt-space-sm mt-space-sm border-t-0';
let catSectionEnd = code.indexOf(catSectionEndStr);
// The closing </div> is just before this
let closingDivIndex = code.lastIndexOf('</div>', catSectionEnd);
let beforeCat = code.substring(0, catSectionStart + catSectionStartStr.length);
let afterCat = code.substring(closingDivIndex);
code = beforeCat + catReplacement + afterCat;

fs.writeFileSync('src/components/Dashboard/DesktopView.jsx', code);
console.log('Replacements done!');
