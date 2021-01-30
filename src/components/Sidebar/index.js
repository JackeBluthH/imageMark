import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Sidebar(props) {
    const [menuData, setMenuData] = useState([]);

    useEffect(() => {
        setMenuData(window.imageList.map(name => (
            { key: name, path: name, label: name }
        )));
    }, []);

    return (
        <div>
            <div>请选择图片</div>
            <ul>
                {menuData.map(item => <li key={item.key}><Link to={`/mark/${item.path}`}>{item.label}</Link></li>)}
            </ul>
        </div>
    )
}

export default Sidebar;
