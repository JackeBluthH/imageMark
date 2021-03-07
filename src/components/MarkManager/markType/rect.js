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
import React from 'react';
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
    {
      name: 'catagory',
      label: '类别',
      type: 'select',
      options: [
        { value: 'dog', text: '狗' },
        { value: 'cat', text: '猫' },
        { value: 'flower', text: '花' },
        { value: 'plant', text: '植物' },
      ],
    },
    { name: 'name', label: 'name', type: 'input', value: id },
    { name: 'others', label: 'others', type: 'input' },
  ];
  showProperties({
    name: id,
    title: '矩形框标注属性',
    items: RectForm,
    onOK(values) {
      // updateMark
      log.debug(values);
    },
  });
}

// 获取热点区域

function getCloseBox(p1, p2) {
  return {
    left: p2.x - 25,
    top: p1.y + 5,
    right: p2.x - 5,
    bottom: p1.y + 25,
  };
}
function getWsBox(p1, p2) {
  return {
    left: p1.x - 10,
    top: p2.y - 10,
    right: p1.x + 10,
    bottom: p2.y + 10,
  };
}
function getEsBox(p1, p2) {
  return {
    left: p2.x - 10,
    top: p2.y - 10,
    right: p2.x + 10,
    bottom: p2.y + 10,
  };
}
function getWnBox(p1) {
  return {
    left: p1.x - 10,
    top: p1.y - 10,
    right: p1.x + 10,
    bottom: p1.y + 10,
  };
}
function getEnBox(p1, p2) {
  return {
    left: p2.x - 10,
    top: p1.y - 10,
    right: p2.x + 10,
    bottom: p1.y + 10,
  };
}
function getEBox(p1, p2) {
  return {
    left: p2.x - 10,
    top: p1.y,
    right: p2.x + 10,
    bottom: p2.y,
  };
}
function getWBox(p1, p2) {
  return {
    left: p1.x - 10,
    top: p1.y,
    right: p1.x + 10,
    bottom: p2.y,
  };
}
function getSBox(p1, p2) {
  return {
    left: p1.x,
    top: p2.y - 10,
    right: p2.x,
    bottom: p2.y + 10,
  };
}
function getNBox(p1, p2) {
  return {
    left: p1.x,
    top: p1.y - 10,
    right: p2.x,
    bottom: p1.y + 10,
  };
}

function factor({ coordin, saveMark, removeMark }) {
  function RenderSvg({ id, points, drawing }) {
    const [p1, p2] = points;
    if (!p2) {
      return null;
    }

    const rectProps = { ...p1, width: p2.x - p1.x, height: p2.y - p1.y };
    if (drawing) {
      // 拖动过程只画外框
      return (
        <g style={{ cursor: 'pointer' }}>
          <rect {...rectProps} stroke="red" fill="transparent" />
          <rect {...rectProps} fill="rgb(0,0,0,0.5)" />
        </g>
      );
    }

    const closeBox = getCloseBox(p1, p2);
    return (
      <g>
        <rect {...rectProps} stroke="red" fill="transparent" />
        <rect {...rectProps} fill="rgb(0,0,0,0.5)" style={{ cursor: 'move' }} />

        {/* title */}
        <text
          x={rectProps.x + 10}
          y={rectProps.y + 20}
          textAnchor="middle"
          fill="white"
          style={{ cursor: 'pointer' }}
        >
          {id}
        </text>

        {/* close button */}
        <rect
          x={closeBox.left}
          y={closeBox.top}
          width={closeBox.right - closeBox.left}
          height="20"
          rx="5"
          fill="#transparent"
          style={{ cursor: 'pointer' }}
        />
        <text
          x={closeBox.left + 10}
          y={closeBox.top + 13}
          textAnchor="middle"
          fill="white"
          style={{ cursor: 'pointer' }}
        >
          x
        </text>

        {/* resise */}
        <rect
          x={rectProps.x - 2}
          y={rectProps.y - 2}
          width="10"
          height="10"
          fill="#transparent"
          stroke="white"
          style={{ cursor: 'nwse-resize' }}
        />
        <rect
          x={rectProps.x - 4}
          y={rectProps.y + rectProps.height / 2 - 8}
          width="10"
          height="10"
          fill="#transparent"
          stroke="white"
          style={{ cursor: 'ew-resize' }}
        />
        <rect
          x={rectProps.x - 2}
          y={rectProps.y + rectProps.height - 8}
          width="10"
          height="10"
          fill="#transparent"
          stroke="white"
          style={{ cursor: 'nesw-resize' }}
        />
        <rect
          x={rectProps.x + rectProps.width / 2 - 2}
          y={rectProps.y + rectProps.height - 8}
          width="10"
          height="10"
          fill="#transparent"
          stroke="white"
          style={{ cursor: 'ns-resize' }}
        />
        <rect
          x={rectProps.x + rectProps.width - 8}
          y={rectProps.y + rectProps.height - 8}
          width="10"
          height="10"
          fill="#transparent"
          stroke="white"
          style={{ cursor: 'nwse-resize' }}
        />
        <rect
          x={rectProps.x + rectProps.width - 8}
          y={rectProps.y + rectProps.height / 2 - 8}
          width="10"
          height="10"
          fill="#transparent"
          stroke="white"
          style={{ cursor: 'ew-resize' }}
        />
        <rect
          x={rectProps.x + rectProps.width - 8}
          y={rectProps.y - 2}
          width="10"
          height="10"
          fill="#transparent"
          stroke="white"
          style={{ cursor: 'nesw-resize' }}
        />
        <rect
          x={rectProps.x + rectProps.width / 2 - 8}
          y={rectProps.y - 2}
          width="10"
          height="10"
          fill="#transparent"
          stroke="white"
          style={{ cursor: 'ns-resize' }}
        />
      </g>
    );

    // svg(div)
    //     .line(100, 100, 390, 200, 'red')
    //     .line(100, 100, 390, 200, 'transparent', 10)
    //     .rect(235, 140, 255, 160, '#2995ff', 5)
    //     .text(245, 155, '?', 'white')
  }

  function create(startPoint) {
    const P1 = coordin.screen2Cavas(startPoint);
    const mark = {
      type: 'rect',
      points: [P1, P1],
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
    };
  }

  function zoom() {}

  function inBox(p, box) {
    if (p.x < box.left || p.x > box.right || p.y < box.top || p.y > box.bottom) {
      return false;
    }

    return true;
  }

  const myEvent = MyEvent();
  myEvent
    .on('closeBtnMousedown', (mark) => {
      // remove the mark
      log.debug('close:', mark.id);
      removeMark(mark.id);
    })
    .on('bodyMousedown', (mark) => {
      log.debug('show panel:', mark.id);
      showPropertyPanel(mark);
    });

  const Resize = [
    {
      // west-south, 左下角
      name: 'ws',
      inBox: (point, p1, p2) => inBox(point, getWsBox(p1, p2)),
      move: ({ imageP1, imageP2, curPort }) => {
        // 左下角resize，右边和上边不变
        const newP1 = { x: Math.min(imageP2.x, curPort.x), y: Math.min(imageP1.y, curPort.y) };
        const newP2 = { x: Math.max(imageP2.x, curPort.x), y: Math.max(imageP1.y, curPort.y) };
        return [newP1, newP2];
      },
    },
    {
      // east-sourth， 右下角
      name: 'es',
      inBox: (point, p1, p2) => inBox(point, getEsBox(p1, p2)),
      move: ({ imageP1, curPort }) => {
        // 右下角resize，左边和上边不变
        const newP1 = { x: Math.min(imageP1.x, curPort.x), y: Math.min(imageP1.y, curPort.y) };
        const newP2 = { x: Math.max(imageP1.x, curPort.x), y: Math.max(imageP1.y, curPort.y) };
        return [newP1, newP2];
      },
    },
    {
      // west-north， 左上角
      name: 'wn',
      inBox: (point, p1, p2) => inBox(point, getWnBox(p1, p2)),
      move: ({ imageP2, curPort }) => {
        // 左上角resize，右边和下边不变
        const newP1 = { x: Math.min(imageP2.x, curPort.x), y: Math.min(imageP2.y, curPort.y) };
        const newP2 = { x: Math.max(imageP2.x, curPort.x), y: Math.max(imageP2.y, curPort.y) };
        return [newP1, newP2];
      },
    },
    {
      // east-north， 右上角
      name: 'en',
      inBox: (point, p1, p2) => inBox(point, getEnBox(p1, p2)),
      move: ({ imageP1, imageP2, curPort }) => {
        // 右上角resize，左边和下边不变
        const newP1 = { x: Math.min(imageP1.x, curPort.x), y: Math.min(imageP2.y, curPort.y) };
        const newP2 = { x: Math.max(imageP1.x, curPort.x), y: Math.max(imageP2.y, curPort.y) };
        return [newP1, newP2];
      },
    },
    {
      // east， 东 右边
      name: 'e',
      inBox: (point, p1, p2) => inBox(point, getEBox(p1, p2)),
      move: ({ imageP1, imageP2, curPort }) => {
        // 右边resize，
        const newP1 = { x: Math.min(imageP1.x, curPort.x), y: Math.min(imageP1.y, curPort.y) };
        const newP2 = { x: Math.max(imageP1.x, curPort.x), y: Math.max(imageP2.y, curPort.y) };
        return [newP1, newP2];
      },
    },
    {
      // west 西 左边
      name: 'w',
      inBox: (point, p1, p2) => inBox(point, getWBox(p1, p2)),
      move: ({ imageP1, imageP2, curPort }) => {
        // 左边resize，
        const newP1 = { x: Math.min(imageP2.x, curPort.x), y: Math.min(imageP1.y, curPort.y) };
        const newP2 = { x: Math.max(imageP2.x, curPort.x), y: Math.max(imageP2.y, curPort.y) };
        return [newP1, newP2];
      },
    },
    {
      // sourth 南 下边
      name: 's',
      inBox: (point, p1, p2) => inBox(point, getSBox(p1, p2)),
      move: ({ imageP1, imageP2, curPort }) => {
        // 下边resize，
        const newP1 = { x: Math.min(imageP1.x, curPort.x), y: Math.min(imageP1.y, curPort.y) };
        const newP2 = { x: Math.max(imageP2.x, curPort.x), y: Math.max(imageP1.y, curPort.y) };
        return [newP1, newP2];
      },
    },
    {
      // north 北 上边
      name: 'n',
      inBox: (point, p1, p2) => inBox(point, getNBox(p1, p2)),
      move: ({ imageP1, imageP2, curPort }) => {
        // 上边resize，
        const newP1 = { x: Math.min(imageP1.x, curPort.x), y: Math.min(imageP2.y, curPort.y) };
        const newP2 = { x: Math.max(imageP2.x, curPort.x), y: Math.max(imageP2.y, curPort.y) };
        return [newP1, newP2];
      },
    },
    {
      // 关闭按钮
      name: 'closeBtn',
      inBox: (point, p1, p2) => inBox(point, getCloseBox(p1, p2)),
    },
    {
      // body: 不在其他位置时都算是body
      name: 'body',
      inBox: () => true,
      move: ({ imageP1, imageP2, startPort, curPort }) => {
        // 点击body时移动标记
        const offsetX = curPort.x - startPort.x;
        const offsetY = curPort.y - startPort.y;
        const newP1 = { x: imageP1.x + offsetX, y: imageP1.y + offsetY };
        const newP2 = { x: imageP2.x + offsetX, y: imageP2.y + offsetY };
        return [newP1, newP2];
      },
    },
  ];

  // 根据一个点捕获对应的标注对象，并返回具体的标注位置名称，可用于绑定处理事件
  // 鼠标拖动时直接修改原有坐标，因此getMark不需要返回新的实例
  function attach(point, oMark) {
    const mark = oMark; // 直接使用oMark会有lint告警，因此使用新变量转接一下
    const imageP1 = { ...mark.points[0] };
    const imageP2 = { ...mark.points[1] };

    const startUserPoint = coordin.canvas2Image(point);
    const p1 = coordin.image2Canvas(imageP1);
    const p2 = coordin.image2Canvas(imageP2);
    if (!inBox(point, { left: p1.x, right: p2.x, top: p1.y, bottom: p2.y })) {
      // 在标注框的外面
      return null;
    }

    const oItem = Resize.find((item) => item.inBox(point, p1, p2)) || { name: 'body' };
    const sAttachName = oItem.name;
    log.debug('attached', sAttachName, p1, p2, point);
    mark.drawing = true;
    return {
      name: sAttachName,
      moveTo: (screenPoint) => {
        // 4个角的resize
        const curPoint = coordin.screen2Cavas(screenPoint);
        const userPoint = coordin.canvas2Image(curPoint);

        if (oItem.move) {
          mark.points = oItem.move({
            imageP1,
            imageP2,
            startPort: startUserPoint,
            curPort: userPoint,
          });
        }
      },
      getMark: () => null,
      end: () => {
        // const curPoint = coordin.screen2Cavas(screenPoint);
        delete mark.drawing;
      },
    };
  }

  return {
    create,
    attach,
    trigger: (sName, mark) => myEvent.trigger(sName, mark),
    zoom,
    render: (props) => <RenderSvg key={props.id} {...props} />,
  };
}

const TypeDef = {
  name: 'rect',
  description: '矩形框标注',
  factor,
};

export default TypeDef;
