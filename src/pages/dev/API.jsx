
import React from 'react';

import './index.css';

const { ApiDef } = window;
function API() {
    return (
        <div className="page-content">
            <h2>API列表</h2>
            {ApiDef.map(api => (
                <div className="api-card" key={api.name}>
                    <h3 className="title">{api.name}</h3>
                    <div className="desc">{api.desc}</div>
                    <div className="question">{api.question || ''}</div>
                    <pre>{JSON.stringify(api.mata, null, 4).replaceAll('\\"', '"')}</pre>
                </div>
            ))}
        </div>
    );
}

export default API;
