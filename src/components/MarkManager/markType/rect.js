
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

function RectRender({id, x, y, width, height, drawing, removeMark}) {
    const [visible, setVisible ] = useState(true);
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

function create(p1, { coordin, saveMark }) {
    const P1 = coordin.transCanvasPort(p1);
    const mark = {
        type: 'rect',
        x: P1.x,
        y: P1.y,
        width: 0,
        height: 0,
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

            // 设置div的left为左边的点
            mark.width = Math.abs(P2.x - P1.x);
            mark.x = Math.min(P2.x, P1.x);

            // 设置div的top为上边的点
            mark.height = Math.abs(P2.y - P1.y);
            mark.y = Math.min(P2.y, P1.y);
        },

        // 取消时删除生成的DOM
        cancel,

        // 结束时保存当前的标记
        end: function _end() {
            if (mark.width < MIN_LENGTH || mark.height < MIN_LENGTH) {
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
    render: (props) => <RectRender key={props.id} {...props}/>,
};

export default TypeDef;
