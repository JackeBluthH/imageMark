
function create(p1, { draw, viewPort }) {
    function move(offsetX, offsetY) {
        draw({
            ...viewPort,
            x: viewPort.x + offsetX,
            y: viewPort.y + offsetY,
        });
    }

    return {
        moveTo: function _moveto(p2) {
            move(p2.x - p1.x, p2.y - p1.y);
        },

        // 取消时恢复到原来的位置
        cancel: function _cancel() {
            move(0, 0);
        },

        // 结束时保存当前的标记
        end: function _end() {
        },
    }
}

const TypeDef = {
    name: 'move',
    description: '移动图片',
    create,
};

export default TypeDef;
