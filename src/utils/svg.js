
// SVG命名空间
const svgNS = "http://www.w3.org/2000/svg";

//svg通过命名空间创建标签
function createTag(tag, obj) {
    const oTag = document.createElementNS(svgNS, tag);
    Object.keys(obj).filter(attr => obj[attr] !== undefined).forEach(attr => oTag.setAttribute(attr, obj[attr]));
    return oTag;
}

export default function svg(div) {
    const oSvg = createTag('svg', { 'xmlns': 'svgNS', 'width': '100%', 'height': '100%' })
    const oG = createTag('g', { 'style': 'cursor:pointer' });

    const inst = {
        rect,
        line,
        text,
    };

    // append to DOM
    oSvg.appendChild(oG);
    div.appendChild(oSvg);

    function appendChild(oNode) {
        oG.appendChild(oNode);
        return inst;
    }
    function line(x1, y1, x2, y2, color, nLineWidth) {
        const oLine = createTag('line', { x1, y1, x2, y2, 'stroke': color, 'stroke-width': nLineWidth });
        return appendChild(oLine);
    }

    function rect(x1, y1, x2, y2, color = 'transparent', rx = 0) {
        const x = Math.min(x1, x2);
        const y = Math.min(y1, y2);
        const width = Math.abs(x2 - x1);
        const height = Math.abs(y2 - y1);
        const oRect = createTag('rect', { x, y, width, height, rx, 'fill': color })
        return appendChild(oRect);
    }

    function text(x, y, sText, sColor = 'black') {
        const oText = createTag('text', { x, y, 'text-anchor': 'middle', 'fill': sColor });
        oText.innerHTML = sText;
        return appendChild(oText);
    }

    return inst;
}
