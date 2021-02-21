import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import request from '@/utils/request';

function Sidebar(props) {
    const [menuData, setMenuData] = useState([]);

    useEffect(() => {
        request.get('getinfo').success((datas) => {
            setMenuData(datas.pictures.map(pic => (
                { key: pic.path, path: pic.path, label: pic.path }
            )));
        })
        // setMenuData(window.imageList.map(name => (
        //     { key: name, path: name, label: name }
        // )));
    }, []);

    return (
        <div>
            <div>请选择图片</div>
            <ul>
                {menuData.map(item => <li key={item.key}><Link to={`/mark/${item.path}`}>{item.label}</Link></li>)}
            </ul>
            <div>开发事项</div>
            <ul>
                <li><Link to="/dev/task">跟踪事项</Link></li>
                <li><Link to="/dev/api">API文档</Link></li>
            </ul>

        </div>
    )
}

export default Sidebar;
