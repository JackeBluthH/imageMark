
function create(p1, { container, coordin, saveMark }) {
    const div = document.createElement('div');
    div.className = 'mark-rect';
    container.appendChild(div);

    const P1 = coordin.transPort(p1);
    const mark = { type: 'rect', P1 };

    return {
        moveTo: function _moveto(p2) {
            const P2 = coordin.transPort(p2);

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
        cancel: function _cancel() {
            container.removeChild(div);
        },

        // 结束时保存当前的标记
        end: function _end() {
            saveMark(mark);
        },
    }
}

const TypeDef =  {
    name: 'circle',
    description: '圆形框标注',
    create,
};

export default TypeDef;
