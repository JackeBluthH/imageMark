
/**
 * getinfo   #获取初始信息。和 post 格式内容一样，未标注的，objnum 为0。
{
'project':'demo',
'optype':'face identify'    #'obj recog','face identify', 先分两个任务，前一个是从图片里标注物体；后一个是给两张图片，判断是否是一个类别，或者一个人。
'pictures':[{'path':'demo/demo3.jpg','size_w':1920,'size_h':1080},[{'path':'demo/demo4.jpg','size_w':1920,'size_h':1080}]],
'obj':      #defaut []  'obj recog'有效
  [
    {'pos':{'xmin':100,'xmax':200,'ymin':150,'ymax':250},
     'class':'face',
    },
    {},
    {}
  ]
'objnum':3.  #default 0     'obj recog' 有效
'same':0.    #default -1    'face identify'有效
}

 */
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
        { name: 'catagory', label: '类别', type: 'select', options: [{ value: 'dog', text: '狗' }, { value: 'cat', text: '猫' }, { value: 'flower', text: '花' }, { value: 'plant', text: '植物' }] },
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
    const RenderSvg = function ({ id, points, drawing }) {
        const [p1, p2] = points;
        if (!p2) {
            return null;
        }

        const rectProps = { ...p1, width: p2.x - p1.x, height: p2.y - p1.y };
        if (drawing) {
            // 拖动过程只画外框
            return (
                <g style={{ cursor: 'pointer' }}>
                    <rect {...rectProps} stroke="red" fill="transparent"></rect>
                    <rect {...rectProps} fill="rgb(0,0,0,0.5)"></rect>
                </g>
            );
        }

        const closeBox = getCloseBox(p1, p2);
        return (
            <g>
                <rect {...rectProps} stroke="red" fill="transparent"></rect>
                <rect {...rectProps} fill="rgb(0,0,0,0.5)" style={{ cursor: 'move' }}></rect>

                {/* title */}
                <text
                    x={rectProps.x + 10}
                    y={rectProps.y + 20}
                    textAnchor="middle"
                    fill="white"
                    style={{ cursor: 'pointer' }}
                >{id}</text>

                {/* close button */}
                <rect
                    x={closeBox.left}
                    y={closeBox.top}
                    width={closeBox.right - closeBox.left}
                    height="20"
                    rx="5"
                    fill="#2995ff"
                    style={{ cursor: 'pointer' }}
                ></rect>
                <text
                    x={closeBox.left + 10}
                    y={closeBox.top + 13}
                    textAnchor="middle"
                    fill="white"
                    style={{ cursor: 'pointer' }}
                >x</text>

                {/* resise */}
                <rect
                    x={rectProps.x + rectProps.width - 10}
                    y={rectProps.y + rectProps.height - 10}
                    width="10"
                    height="10"
                    fill="#2995ff"
                    style={{ cursor: 'nwse-resize' }}
                ></rect>
                <rect
                    x={rectProps.x}
                    y={rectProps.y + rectProps.height - 10}
                    width="10"
                    height="10"
                    fill="#2995ff"
                    style={{ cursor: 'nesw-resize' }}
                ></rect>
            </g>
        );

        // svg(div)
        //     .line(100, 100, 390, 200, 'red')
        //     .line(100, 100, 390, 200, 'transparent', 10)
        //     .rect(235, 140, 255, 160, '#2995ff', 5)
        //     .text(245, 155, '?', 'white')
    }

    function create(p1) {
        const P1 = coordin.screen2Cavas(p1);
        const mark = {
            type: 'rect',
            points: [P1],
        };

        function cancel() {
            // container.removeChild(div);
        }

        function moveTo(p2) {
            const P2 = coordin.screen2Cavas(p2);
            const width = Math.abs(P2.x - P1.x);
            const height = Math.abs(P2.y - P1.y);

            // 设置div的left为左边的点
            const x1 = Math.min(P2.x, P1.x);
            const y1 = Math.min(P2.y, P1.y);

            mark.points = [
                { x: x1, y: y1 },
                { x: x1 + width, y: y1 + height },
            ];
        }

        return {
            getMark: () => ({ ...mark }),

            // moving
            moveTo,

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
        log.debug('close:', mark.id);
        removeMark(mark.id);
    }).on('bodyMouseup', (mark) => {
        log.debug('show panel:', mark.id);
        showPropertyPanel(mark);
        // return false;
    }).on('wsResize', (mark) => {
        // 西南 右下角
    }).on('esResize', (mark) => {
        // 东南 左下角
    }).on('eResize', (mark) => {
        // 东 右边
    }).on('wResize', (mark) => {
        // 西 左边
    }).on('sResize', (mark) => {
        // 南 下边
    });

    // 根据一个点捕获对应的标注对象，并返回具体的标注位置名称，可用于绑定处理事件
    // 标注对象子类为：body, title, closeBtn
    function attach(point, mark,) {
        // const [p1, p2] = mark.points;
        const imageP1 = { ...mark.points[0] };
        const imageP2 = { ...mark.points[1] };

        const p1 = coordin.image2Canvas(imageP1);
        const p2 = coordin.image2Canvas(imageP2);
        if (!inBox(point, { left: p1.x, right: p2.x, top: p1.y, bottom: p2.y })) {
            // 在标注框的外面
            return null;
        }

        let sAttachName = 'body';
        if (inBox(point, getCloseBox(p1, p2))) {
            sAttachName = 'closeBtn';
        } else {
            // sAttachName = 'e'; // w, s, ws, es
        }

        log.debug('attached', sAttachName, p1, p2, point);
        return {
            name: sAttachName,
            moveTo: (screenPoint) => {
                const curPoint = coordin.screen2Cavas(screenPoint);
                const userPoint = coordin.canvas2Image(curPoint);

                const offsetX = userPoint.x - imageP1.x;
                const offsetY = userPoint.y - imageP1.y;
                mark.points = mark.points.map(p => ({ x: p.x + offsetX, y: p.y + offsetY }));
            }
        };
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
