const fs = require('fs');
const file = 'src/pages/Transactions.jsx';
let content = fs.readFileSync(file, 'utf8');

const startMarker = '<tbody className="divide-y divide-transparent font-body-md text-body-md">';
const endMarker = '</tbody>';
const startIdx = content.indexOf(startMarker);
const endIdx = content.indexOf(endMarker, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    const newBody = startMarker + `
                        {transactions.length === 0 ? (
                            <tr><td colSpan="9" className="text-center py-4">No transactions found.</td></tr>
                        ) : (
                            transactions.map((tx, idx) => (
                                <tr key={tx.id} className={\`h-10 transition-colors group \${idx % 2 === 1 ? 'bg-surface-container-lowest' : ''} hover:bg-surface-container-low/60\`}>
                                    <td className="px-space-md text-center"><input className="rounded w-3.5 h-3.5" type="checkbox"/></td>
                                    <td className="px-space-sm whitespace-nowrap font-numeric-table text-label-sm text-on-surface-variant">
                                        {tx.date} {tx.time && \`, \${tx.time}\`}
                                    </td>
                                    <td className="px-space-md whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded bg-surface-container-high text-on-surface flex items-center justify-center font-bold text-[10px] tracking-tight">
                                                {tx.purpose ? tx.purpose.substring(0, 2).toUpperCase() : 'TX'}
                                            </div>
                                            <div className="flex flex-col leading-none">
                                                <span className="font-medium text-on-surface">{tx.purpose || 'Unknown'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-space-sm whitespace-nowrap">
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-surface-container rounded text-label-sm font-label-sm text-on-surface">
                                            {tx.category || 'General'}
                                        </span>
                                    </td>
                                    <td className="px-space-sm whitespace-nowrap">
                                        <span className="px-1.5 py-0.5 rounded bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm font-medium">
                                            {tx.payment_method || 'Bank'}
                                        </span>
                                    </td>
                                    <td className="px-space-sm whitespace-nowrap font-label-sm text-label-sm text-on-surface-variant">-</td>
                                    <td className="px-space-sm whitespace-nowrap">
                                        <span className="px-2 py-0.5 rounded bg-surface-variant text-on-tertiary-container font-label-sm text-label-sm font-medium">Cleared</span>
                                    </td>
                                    <td className={\`px-space-md whitespace-nowrap text-right font-numeric-table text-body-md font-semibold \${tx.type === 'credit' ? 'text-on-tertiary-container' : 'text-error'}\`}>
                                        {tx.type === 'credit' ? '+' : '-'}₹ {Number(tx.amount || 0).toLocaleString()}
                                    </td>
                                    <td className="px-space-sm whitespace-nowrap text-center">
                                        <div className="flex items-center justify-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1 text-outline hover:text-on-surface rounded"><span className="material-symbols-outlined text-[16px]">edit</span></button>
                                            <button className="p-1 text-outline hover:text-on-surface rounded"><span className="material-symbols-outlined text-[16px]">delete</span></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    ` + endMarker;

    content = content.substring(0, startIdx) + newBody + content.substring(endIdx + endMarker.length);
    fs.writeFileSync(file, content);
    console.log("Replaced table body.");
} else {
    console.log("Markers not found");
    console.log("startIdx:", startIdx, "endIdx:", endIdx);
}
