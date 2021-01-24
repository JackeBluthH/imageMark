import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Sidebar(props) {
    const [ menuData, setMenuData ] = useState([]);

    useEffect(() => {
        setMenuData([
            {key: '11', path: '11', label: '11'},
            {key: '22', path: '22', label: '22'},
            {key: '33', path: '33', label: '33'},
            {key: '44', path: '44', label: '44'},
            {key: '55', path: '55', label: '55'},
            {key: '66', path: '66', label: '66'},
        ]);
    }, []);

    return (
        <ul>
            {menuData.map(item => <li key={item.key}><Link to={`/mark/${item.path}`}>{item.label}</Link></li>)}
        </ul>
    )
}

export default Sidebar;
