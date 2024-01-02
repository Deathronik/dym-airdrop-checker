import React from 'react';

const Result = ({result, index}) => {
    return (
        <tr>
            <td>{index + 1}</td>
            <td className="text-start">{result.wallet}</td>
            <td>{result.amount.toFixed(2)}</td>
            <td>{result.eligible ? "✔️" : "❌"}</td>
        </tr>
    );
};

export default Result;