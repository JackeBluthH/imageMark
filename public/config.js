

window.imageList = [
    'test.jpg',
    '123.jpg'
];

window.ApiDef = [{
    name: 'GET getclasstype',
    desc: '获取类别信息。标注时只标注类型列表中列出来的对象',
    question: 'data中的元素应该是一个包含value,text的对象',
    mata: {
        classnum: 3,
        data: ['cat', 'dog', 'person']
    }
}, {
    name: 'GET getinfo',
    desc: '获取初始信息。get 和 post 格式内容一样，未标注的，objnum 为0',
    mata: {
        project: 'demo',
        optype: '[obj recog/face identify], 前一个是从图片里标注物体；后一个是给两张图片，判断是否是一个类别，或者一个人',
        pictures: [{
            path: 'demo/demo3.jpg',
            size_w: 1920,
            size_h: 1080
        }, {
            path: 'demo/demo4.jpg',
            size_w: 1920,
            size_h: 1080,
            obj: 'array[{pos:{xmin,xmax,ymin,ymax}, class:"标注物类别"}]'[{  // #defaut []  'obj recog'有效
                pos: { xmin: 100, xmax: 200, ymin: 150, ymax: 250 },
                class: 'face',
            }]
        }],
        objnum: 'number, #default is 0,  optype="obj recog" 有效',
        same: 'number, #default is -1, optype="face identify" 有效',
    }
}, {
    name: 'GET getimg?path=test',
    desc: '读图片接口，传入path，取出图片',
    mata: '返回图片内容'
}, {
    name: 'POST post',
    desc: '保存结果',
    mata: {
        project: 'demo',
        Optype: 'face identify',
        pictures: [{
            path: 'demo/demo3.jpg',
            size_w: 1920,
            size_h: 1080
        }, {
            path: 'demo/demo4.jpg',
            size_w: 1920,
            size_h: 1080
        }],
        obj:
            [
                {
                    pos: { xmin: 100, xmax: 200, ymin: 150, ymax: 250 },
                    class: 'face',
                },
            ],
        objnum: 3,
        same: 0
    }
}];
