
import React, { useState } from 'react';
import showProperties from '../form';

const MIN_LENGTH = 10;


function createMark(container) {
    const div = document.createElement('div');
    div.className = 'mark-rect';
    container.appendChild(div);
    return div;
}

function getDomId(markId) {
    return 'mark_div_' + markId;
}

// 生成关闭按钮，放在标注框div的右上角
function createClose(div) {
    const divClose = document.createElement('div');
    divClose.className = 'icon icon-close';
    div.appendChild(divClose);
}

function RectRender({ id, x, y, width, height, drawing, removeMark }) {
    const [visible, setVisible] = useState(true);
    const style = {
        width: `${width}px`,
        height: `${height}px`,
        left: `${x}px`,
        top: `${y}px`,
    }

    const RectForm = [
        { name: 'type', label: 'type', type: 'text', value: 'rect' },
        { name: 'name', label: 'name', type: 'input', value: id },
        { name: 'others', label: 'others', type: 'input' },
    ];

    const onClick = (e) => {
        if (e.isDefaultPrevented()) {
            return;
        }
        e.preventDefault();
        showProperties({
            name: id,
            title: '矩形框标注属性',
            items: RectForm,
            onOK: function (values) {
                // updateMark
                console.log(values);
            }
        });
    }
    const onMouseDown = (e) => {
        e.preventDefault();
    }
    const onMouseUp = (e) => {
        e.preventDefault();
    }

    function onRemoveMark(e) {
        e.preventDefault();
        removeMark(id);
        setTimeout(() => setVisible(false), 10);
    }

    if (!visible) {
        return null;
    }
    return (
        <div onClick={onClick} onMouseDown={onMouseDown} onMouseUp={onMouseUp} className="mark-rect" key={id} style={style}>
            {!drawing && <div onClick={onRemoveMark} className="icon icon-close" />}
        </div>
    )
}

const RenderSvg = function ({ id, points, drawing, removeMark }) {
    const [ p1, p2 ] = points;
    if (!p2) {
        return null;
    }
    
    const rectProps = { ...p1, width: p2.x -p1.x, height: p2.y - p1.y };
    return (
        <svg xmlns="svgNS" width="100%" height="100%" className="mark-rect">
            <g style={{cursor:'pointer'}}>
                <rect {...rectProps} stroke="red" fill="transparent"></rect>
                <rect {...rectProps} fill="rgb(0,0,0,0.5)"></rect>
                {/* <line x1="100" y1="100" x2="390" y2="200" stroke="red"></line>
                <line x1="100" y1="100" x2="390" y2="200" stroke="transparent" stroke-width="10"></line> */}
                {!drawing && <rect x={p2.x - 25} y={p1.y + 5} width="20" height="20" rx="5" fill="#2995ff"></rect>}
                {!drawing && <text x={p2.x - 15} y={p1.y + 18} textAnchor="middle" fill="white">x</text>}
            </g>
        </svg>
    );

    // svg(div)
    //     .line(100, 100, 390, 200, 'red')
    //     .line(100, 100, 390, 200, 'transparent', 10)
    //     .rect(235, 140, 255, 160, '#2995ff', 5)
    //     .text(245, 155, '?', 'white')
}

function create(p1, { container, coordin, saveMark }) {
    const P1 = coordin.transCanvasPort(p1);
    const mark = {
        type: 'rect',
        points: [P1],
    };

    function cancel() {
        // container.removeChild(div);
    }

    return {
        getMark: function () {
            return { ...mark };
        },
        moveTo: function _moveto(p2) {
            const P2 = coordin.transCanvasPort(p2);
            const width = Math.abs(P2.x - P1.x);
            const height = Math.abs(P2.y - P1.y);

            // 设置div的left为左边的点
            const x1 = Math.min(P2.x, P1.x);
            const y1 = Math.min(P2.y, P1.y);

            mark.points = [
                {x: x1, y: y1},
                {x: x1 + width, y: y1 + height},
            ]
        },

        // 取消时删除生成的DOM
        cancel,

        // 结束时保存当前的标记
        end: function _end() {
            const [ p1, p2 ] = mark.points;
            const width = p2.x - p1.x;
            const height = p2.y - p1.y;
            if (width < MIN_LENGTH || height < MIN_LENGTH) {
                cancel();
                return;
            }

            // mark.P1 = coordin.canvas2User(mark.P1);
            saveMark(mark);
        },
    }
}

function zoom() {

}

const TypeDef = {
    name: 'rect',
    description: '矩形框标注',
    create,
    zoom,
    render: (props) => <RenderSvg key={props.id} {...props} />,
};

export default TypeDef;
