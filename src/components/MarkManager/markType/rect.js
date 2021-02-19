
import React, { useState } from 'react';
import MyEvent from '@/utils/MyEvent';
import logger from '@/utils/log';
import showProperties from '../form';

const MIN_LENGTH = 10;
const log = logger('rect');

// function createMark(container) {
//     const div = document.createElement('div');
//     div.className = 'mark-rect';
//     container.appendChild(div);
//     return div;
// }

// function getDomId(markId) {
//     return 'mark_div_' + markId;
// }

// // 生成关闭按钮，放在标注框div的右上角
// function createClose(div) {
//     const divClose = document.createElement('div');
//     divClose.className = 'icon icon-close';
//     div.appendChild(divClose);
// }

function showPropertyPanel({ id }) {
    const RectForm = [
        { name: 'type', label: 'type', type: 'text', value: 'rect' },
        { name: 'name', label: 'name', type: 'input', value: id },
        { name: 'others', label: 'others', type: 'input' },
    ];
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
// function RectRender({ id, x, y, width, height, drawing, removeMark }) {
//     const [visible, setVisible] = useState(true);
// const style = {
//     width: `${width}px`,
//     height: `${height}px`,
//     left: `${x}px`,
//     top: `${y}px`,
// }

//     const onClick = (e) => {
//         if (e.isDefaultPrevented()) {
//             return;
//         }
//         e.preventDefault();
//     }
//     const onMouseDown = (e) => {
//         e.preventDefault();
//     }
//     const onMouseUp = (e) => {
//         e.preventDefault();
//     }

//     function onRemoveMark(e) {
//         e.preventDefault();
//         removeMark(id);
//         setTimeout(() => setVisible(false), 10);
//     }

//     if (!visible) {
//         return null;
//     }
//     return (
//         <div onClick={onClick} onMouseDown={onMouseDown} onMouseUp={onMouseUp} className="mark-rect" key={id} style={style}>
//             {!drawing && <div onClick={onRemoveMark} className="icon icon-close" />}
//         </div>
//     )
// }

function getCloseBox(p1, p2) {
    return {
        left: p2.x - 25,
        top: p1.y + 5,
        right: p2.x - 5,
        bottom: p1.y + 25,
    };
}

function factor({ coordin, saveMark, removeMark, updateMark }) {
    const RenderSvg = function ({ points, drawing }) {
        const [p1, p2] = points;
        if (!p2) {
            return null;
        }

        const rectProps = { ...p1, width: p2.x - p1.x, height: p2.y - p1.y };
        const closeBox = getCloseBox(p1, p2);
        return (
            <g style={{ cursor: 'pointer' }}>
                <rect {...rectProps} stroke="red" fill="transparent"></rect>
                <rect {...rectProps} fill="rgb(0,0,0,0.5)"></rect>

                {/* close button */}
                {!drawing && <rect
                    x={closeBox.left}
                    y={closeBox.top}
                    width={closeBox.right - closeBox.left}
                    height="20"
                    // rx="5"
                    fill="#2995ff"
                ></rect>}
                {!drawing && <text
                    x={closeBox.left + 10}
                    y={closeBox.top + 13}
                    textAnchor="middle"
                    fill="white"
                >x</text>}
            </g>
        );

        // svg(div)
        //     .line(100, 100, 390, 200, 'red')
        //     .line(100, 100, 390, 200, 'transparent', 10)
        //     .rect(235, 140, 255, 160, '#2995ff', 5)
        //     .text(245, 155, '?', 'white')
    }

    function create(p1) {
        const P1 = coordin.transCanvasPort(p1);
        const mark = {
            type: 'rect',
            points: [P1],
        };

        function cancel() {
            // container.removeChild(div);
        }

        return {
            getMark: () => ({ ...mark }),
            moveTo: function _moveto(p2) {
                const P2 = coordin.transCanvasPort(p2);
                const width = Math.abs(P2.x - P1.x);
                const height = Math.abs(P2.y - P1.y);

                // 设置div的left为左边的点
                const x1 = Math.min(P2.x, P1.x);
                const y1 = Math.min(P2.y, P1.y);

                mark.points = [
                    { x: x1, y: y1 },
                    { x: x1 + width, y: y1 + height },
                ]
            },

            // 取消时删除生成的DOM
            cancel,

            // 结束时保存当前的标记
            end: function _end() {
                const [p1, p2] = mark.points;
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

    function inBox(p, box) {
        if (p.x < box.left || p.x > box.right || p.y < box.top || p.y > box.bottom) {
            return false;
        }

        return true;
    }

    const myEvent = MyEvent();
    myEvent.on('closeBtnMousedown', (mark) => {
        // remove the mark
        log.debug('close:', mark);
        removeMark(mark.id);
    }).on('bodyMouseup', (mark) => {
        showPropertyPanel(mark);
        return false;
    });

    // 根据一个点捕获对应的标注对象，并返回具体的标注位置名称，可用于绑定处理事件
    // 标注对象子类为：body, title, closeBtn
    function attach(point, mark,) {
        // const [p1, p2] = mark.points;
        const p1 = coordin.image2Canvas(mark.points[0]);
        const p2 = coordin.image2Canvas(mark.points[1]);
        if (!inBox(point, { left: p1.x, right: p2.x, top: p1.y, bottom: p2.y })) {
            // 在标注框的外面
            return null;
        }

        let sAttachName = 'body';
        log.debug('render closeBox:', p1, p2, point);
        if (inBox(point, getCloseBox(p1, p2))) {
            sAttachName = 'closeBtn';
        }
        return { name: sAttachName };
    }

    return {
        create,
        attach,
        trigger: (sName, mark) => myEvent.trigger(sName, mark),
        zoom,
        render: (props) => <RenderSvg key={props.id} {...props} />,
    }
}

const TypeDef = {
    name: 'rect',
    description: '矩形框标注',
    factor,
};

export default TypeDef;
