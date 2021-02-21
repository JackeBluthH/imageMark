
import React from 'react';

function MyTask() {
    return (
        <div className="page-content">
            <h3>启动跟踪事项服务</h3>
            <ol>
                <li>cd /opt/nodeServer</li>
                <li>node note.js</li>
                <li>启动后请访问： <a href="http://180.76.166.102:88" target="_blank">跟踪事项</a></li>
            </ol>
        </div>
    );
}

export default MyTask;
