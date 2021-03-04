
import logger from '@/utils/log';

import pluginMove from './markType/move';
import markRect from './markType/rect';
import markCircle from './markType/circle';

import './index.css';

const MarkTypes = [
    pluginMove,
    markRect,
    markCircle,
];

const log = logger('MarkManager');

function loadImage(src, onReady) {
    let oImg = new Image();
    // 在线图片设置crossOrigin跨域
    // if (src.indexOf(src) === 0) {
    //     oImg.crossOrigin = '*';
    // }
    oImg.src = src;
    oImg.onload = () => {
        onReady(oImg)
    };
    oImg.onerror = () => {
        throw (new Error('图片解析失败'))
    }
}

function firstCapital(str) {
    return str.charAt(0).toUpperCase() + str.substring(1);
}

/**
 * 坐标系管理
 * 坐标系分为三种：
 * 屏幕坐标系：screenCoordin， 对应UI中的鼠标位置，原点在DIV的左上角
 * 画布坐标西：cavasCoordin, 对应画布中的位置，原点在画布的左上角
 * 图片坐标系：imageCoordin, 对应图片中的位置，原点在图片的左上角
 * 标注框在图片坐标系中的坐标值不随图片的缩放移动而改变，但在画布坐标系中会改变
 * @param {Point} originPoint 画布坐标系原点位置
 */
function Coordin(originPoint) {
    let UserOirgin = { x: 0, y: 0 };
    let nCurZoom = 1;

    function getNumber(n) {
        return parseInt(n * 100) / 100;
    }
    return {
        // 获取缩放比例
        getZoom() {
            return nCurZoom;
        },

        // 设置缩放比例
        setZoom: function (nZoom) {
            nCurZoom = getNumber(nZoom);
            log.debug('setZoom:', nCurZoom);
        },

        setUserOrigin: function (p) {
            log.debug('setUserOrigin:', p);
            UserOirgin = { ...UserOirgin, ...p };
        },

        // 转换长度数据
        transLengh: function (n) {
            return getNumber(n * nCurZoom);
        },

        // 转换计算机坐标为画布坐标
        screen2Cavas: function (screenPoint) {
            return {
                x: screenPoint.x - originPoint.x,
                y: screenPoint.y - originPoint.y,
            };
        },

        // 转化画布坐标为图片坐标。图片坐标的原点在图片的左上角
        canvas2Image: function (canvasPort) {
            // console.log('canvas2Image:', canvasPort);
            return {
                x: (canvasPort.x - UserOirgin.x) / nCurZoom,
                y: (canvasPort.y - UserOirgin.y) / nCurZoom,
            }
        },

        // 转化图片坐标为画布坐标。
        image2Canvas: function (userPort) {
            // console.log('image2Canvas:', userPort);
            return {
                x: (userPort.x * nCurZoom + UserOirgin.x),
                y: (userPort.y * nCurZoom + UserOirgin.y),
            }
        },
    }
}

function ImageManager(containerId) {
    const container = document.getElementById(containerId);
    const Config = {
        zoomStep: 1.2, // 缩放速度
    };

    // 画布大小
    const canvasW = container.offsetWidth;
    const canvasH = container.offsetHeight;

    // 图片对象
    let oCurImg = null;
    let ViewPort = { // 当前窗口在画布中的位置和大小
        x: 0, y: 0, // 左上角位置
        width: 0, height: 0, // 窗口宽度和高度
    }

    // 基础画布
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext("2d");
    canvas.width = canvasW;
    canvas.height = canvasH;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    container.appendChild(canvas);
    log.debug('canvas info: ', canvasW, canvasH)

    const canvasOffset = {
        x: container.offsetLeft,
        y: container.offsetTop,
    };
    const coordin = Coordin(canvasOffset);
    log.debug('canvas info: ', canvasW, canvasH, canvasOffset);

    let markId = 0;
    let allMark = [];
    function saveMark(sType, mark) {
        mark.id = markId++;
        mark.type = sType;

        // 使用图片坐标值保存标注点
        mark.points = mark.points.map(p => coordin.canvas2Image(p));

        allMark.push(mark);
        return mark.id;
    }

    function line(p1, p2) {
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
    }

    function drawRuler(x, y, lineWidth) {
        while (x < canvasW) {
            line({ x, y }, { x, y: 10 });
            ctx.lineWidth = lineWidth;
            x += 100;
        }
    }

    function drawHRuler() {
        ctx.beginPath();

        // top line
        line({ x: 0, y: 5 }, { x: canvasW, y: 5 });

        // middle H line
        line({ x: 10, y: canvasH / 2 }, { x: canvasW - 10, y: canvasH / 2 });
        line({ x: canvasW / 2, y: 10 }, { x: canvasW / 2, y: canvasH - 10 });

        drawRuler(55, 5, 1);
        ctx.stroke();

        ctx.beginPath();
        drawRuler(5, 0, 2);
        ctx.stroke();
    }
    function draw(viewPort) {
        // 绘制图片
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // draw image
        if (viewPort) {
            ViewPort = { ...ViewPort, ...viewPort };
        }

        // draw image
        log.debug('draw:', ViewPort);
        ctx.drawImage(oCurImg, ViewPort.x, ViewPort.y, ViewPort.width, ViewPort.height);
        coordin.setUserOrigin({ x: ViewPort.x, y: ViewPort.y });

        drawHRuler();
    }

    function move2Center(canvasP) {
        ViewPort.x -= canvasP.x - canvasW / 2;
        ViewPort.y -= canvasP.y - canvasH / 2;
    }

    function autoMove() {
        // 图片宽度比画布宽度小的时候，显示在中间
        if (ViewPort.width <= canvasW) {
            ViewPort.x = (canvasW - ViewPort.width) / 2;
        } else if (ViewPort.x > 0) {
            // 画布左边有空白
            ViewPort.x = 0;
        } else if ((ViewPort.width + ViewPort.x) < canvasW) {
            // 画布右边有空白
            const imageWidth = ViewPort.width + ViewPort.x; // 图片在画布中的宽度
            ViewPort.x += canvasW - imageWidth;
            // log('right space:', imageRightWidth);
        }

        // 图片高度比画布高度小的时候，显示在中间
        if (ViewPort.height <= canvasH) {
            ViewPort.y = (canvasH - ViewPort.height) / 2;
        } else if (ViewPort.y > 0) {
            // 画布上边有空白，修正到从最上面开始显示
            ViewPort.y = 0;
        } else if ((ViewPort.height + ViewPort.y) < canvasH) {
            // 画布下边有空白，把图片下移
            const imageHeight = ViewPort.height + ViewPort.y; // 图片在画布中的高度
            ViewPort.y += canvasH - imageHeight;
        }
    }

    // 更新缩放比例后需要重绘所有的标注框
    function setZoom(nZoom, centerPoint) {
        const canvasP0 = coordin.screen2Cavas(centerPoint);
        const userP = coordin.canvas2Image(canvasP0);
        log.debug('before zoom: ', canvasP0);
        log.debug('user point: ', userP);

        // move to center
        // move2Center(centerPoint);

        // zoom, 缩放前后userP在图片坐标系中的坐标不会改变
        coordin.setZoom(nZoom);
        const canvasP1 = coordin.image2Canvas(userP);
        move2Center(canvasP1);

        ViewPort.width = coordin.transLengh(oCurImg.naturalWidth);
        ViewPort.height = coordin.transLengh(oCurImg.naturalHeight);
        log.debug('after zoom: ', canvasP1, ViewPort);

        // 自动调整位置，避免出现空白
        autoMove();
    }

    // 缩小
    function zoomIn(centerPoint) {
        setZoom(coordin.getZoom() / Config.zoomStep, centerPoint);
        draw();
    }

    // 放大
    function zoomOut(centerPoint) {
        setZoom(coordin.getZoom() * Config.zoomStep, centerPoint);
        draw();
    }

    // 设置为原始大小
    function zoomOrigin(centerPoint) {
        setZoom(1, centerPoint);
        draw();
    }

    // 创建图片
    // const src = 'http://pblesaqy5.bkt.clouddn.com/18-7-27/52991435.jpg';
    function load(sImg) {
        ctx.fillText(`Loading ${sImg}`, 300, 100);

        // reset
        markId = 0;
        allMark = [];

        loadImage(sImg, (oImg) => {
            const nZoom = Math.min(canvasW / oImg.naturalWidth, canvasH / oImg.naturalHeight);

            oCurImg = oImg;
            // setZoom(nZoom);
            coordin.setZoom(nZoom);

            // 自动调整图片位置
            ViewPort = {
                ...ViewPort,
                x: Math.max(0, (canvasW - coordin.transLengh(oCurImg.naturalWidth)) / 2),
                y: Math.max(0, (canvasH - coordin.transLengh(oCurImg.naturalHeight)) / 2),
                width: coordin.transLengh(oCurImg.naturalWidth),
                height: coordin.transLengh(oCurImg.naturalHeight),
            }
            draw();
        });
    }

    function getAllMark(type = 'render') {
        const TransType = {
            render: p => coordin.image2Canvas(p),
            save: p => p,
        };
        const fnTrans = TransType[type];

        return allMark.map(({ points, ...mark }) => ({
            ...mark,
            points: points.map(fnTrans),
        }));
    }

    function updateMark(id, oInfo) {
        const curMark = allMark.find(item => item.id === id);
        if (!curMark) {
            return 0;
        }

        // id不支持修改
        const { id: oldId, ...attrs } = oInfo;
        Object.assign(curMark, attrs);
        return 1;
    }

    // 根据屏幕上的一个点获取包含该点的所有标注对象
    function attachMarks(screenPoint) {
        const canvasPoint = coordin.screen2Cavas(screenPoint);
        // const imagePoint = coordin.canvas2Image(canvasPoint);
        return allMark.map((mark) => {
            const markType = MarkTypes.find(mt => mt.name === mark.type);
            if (!markType) {
                // exception
                return null;
            }

            const attach = markType.attach(canvasPoint, mark, coordin);
            if (!attach) {
                return null;
            }

            return { mark, attach };
        }).filter(item => !!item);
        // console.log('attachMarks: ', marks);
    }

    // 从所有mark中找到鼠标点击的那个
    // 如果有重叠，则找到最上面的
    function trigger(sName, screenPoint) {
        let markInst = null;
        const canvasPoint = coordin.screen2Cavas(screenPoint);
        allMark.some((mark) => {
            const markType = markTypes.find(mt => mt.name === mark.type);
            if (!markType) {
                // exception
                log.error('unkown type:', mark.type);
                return false;
            }

            if (!markType.trigger) {
                log.debug('no trigger:', mark.type);
                return false;
            }

            markInst = markType.attach(canvasPoint, mark);
            if (!markInst) {
                log.debug('no attached');
                return false;
            }

            log.debug('attached:', markInst.name);
            return !markType.trigger([markInst.name, firstCapital(sName)].join(''), mark);
        });
        return markInst;
    }

    function removeMark(id) {
        allMark = allMark.filter(item => item.id !== id);
    }

    const markTypes = MarkTypes.map(({ factor, ...markType }) => ({
        ...markType,
        ...factor({
            container,
            coordin,
            draw,
            saveMark: info => saveMark(markType.name, info),
            removeMark,
            updateMark,
        }),
    }));
    return {
        load,
        zoomIn,
        zoomOut,
        zoomOrigin,
        getAllMark,
        // attachMarks,
        trigger,
        render: (oItem) => {
            const markType = markTypes.find(item => item.name === oItem.type);
            return markType ? markType.render({ ...oItem }) : null;
        },
        ...markTypes.reduce((result, markType) => {
            const sMethod = 'plugin' + firstCapital(markType.name);
            result[sMethod] = (...params) => markType.create(...params, { viewPort: { ...ViewPort } });
            return result;
        }, {}),
    };
}

export default ImageManager;
