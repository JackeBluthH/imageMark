
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

function create(p1, { container, coordin, saveMark, showProperties }) {
    const div = createMark(container);

    const _stop = e => e.preventDefault();
    function bindEvent() {
        div.addEventListener('mousedown', _stop);
        div.addEventListener('mouseup', _stop);
        div.addEventListener('click', function (e) {
            _stop(e);
            showProperties({
                items: [
                    { label: 'type', type: 'text', value:'rect' },
                    { label: 'name', type: 'input' },
                    { label: 'others', type: 'input' },
                ]
            });
        });
    }

    const P1 = coordin.transCanvasPort(p1);
    const mark = { type: 'rect', P1 };

    function cancel() {
        container.removeChild(div);
    }
    
    return {
        moveTo: function _moveto(p2) {
            const P2 = coordin.transCanvasPort(p2);

            // 设置div的left为左边的点
            const nWidth = Math.abs(P2.x - P1.x);
            const nLeft = (P2.x < P1.x) ? P2.x : P1.x;
            div.style.left = `${nLeft}px`;
            div.style.width = `${nWidth}px`;

            // 设置div的top为上边的点
            const nHeight = Math.abs(P2.y - P1.y);
            const nTop = (P2.y < P1.y) ? P2.y : P1.y;
            div.style.top = `${nTop}px`;
            div.style.height = `${nHeight}px`;

            // 移动过程实时记录结束点的位置
            mark.P2 = P2;
        },

        // 取消时删除生成的DOM
        cancel,

        // 结束时保存当前的标记
        end: function _end() {
            console.log('end:', Math.abs(mark.P2.x - mark.P1.x), Math.abs(mark.P2.y - mark.P1.y));
            if (Math.abs(mark.P2.x - mark.P1.x) < MIN_LENGTH || Math.abs(mark.P2.y - mark.P1.y) < MIN_LENGTH) {
                cancel();
                return;
            }

            mark.P1 = coordin.canvas2User(mark.P1);
            mark.P2 = coordin.canvas2User(mark.P2);
            const markId = saveMark(mark);
            createClose(div);
            div.id = getDomId(markId);

            setTimeout(bindEvent, 20);
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
};

export default TypeDef;
