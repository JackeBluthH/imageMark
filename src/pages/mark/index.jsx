import React from 'react';

import ButtonGroup from '@/components/ButtonGroup';
import MarkManager from '@/components/MarkManager';
import logger from '@/utils/log';

// import styles from './index.less';
import './index.less';

// const testImg = '/assets/test.jpg';
const log = logger('markPage');

class ImageMark extends React.Component {
    componentDidMount() {
        const { match = { params: {} } } = this.props;
        this.marker = MarkManager(this.canvasId);

        if (match.params.id) {
            this.imgId = match.params.id;
            this.marker.load(`/images/${this.imgId}.jpg`);
        }

        // createSVG(document.getElementById(this.canvasId));
    }

    state = {
        endPort: null,
        markType: '',

        curMark: null,
    }

    imgId = null
    startPort = null
    canvasId = `canval${Math.random()}`.replace('.', '')
    moveObj = null
    marks = [{
        id: 1,
        type: 'rect',
        x: 1,
        y: 1,
        width: 50,
        height: 50,
    }]

    setImgType = (sType) => {
        // this.markType = sType;
        log.debug('setImgType', sType);
        this.setState({ markType: sType });
    }

    end = () => {
        if (!this.moveObj) {
            return;
        }
        this.moveObj.end();
        this.moveObj = null;
        this.setState({curMark: null});
    }

    // action of click
    onMouseDown = (e) => {
        if (e.isDefaultPrevented()) {
            return;
        }

        const curPoint = { x: e.pageX, y: e.pageY };
        const { marker } = this;

        if (marker.trigger('mousedown', curPoint)) {
            log.debug('attached mousedown');
            return;
        }

        const actions = {
            move: () => {
                this.moveObj = this.marker.pluginMove(curPoint);
            },
            rect: () => {
                this.moveObj = this.marker.pluginRect(curPoint);
                // this.setState({ curMark: this.moveObj.getMark() });
            },
            circle: () => {
                this.moveObj = this.marker.pluginCircle(curPoint);
            },
            markDrag: () => {
                
                // dragObj.map(obj => log.debug(obj.attach))
            },
            markResize: () => {
                // 
                // const dragObj = marker.attachMarks(curPoint);
            },
            _: () => (0),
        };
        const fn = actions[this.state.markType] || actions._;
        fn();
    }

    onMouseUp = (e) => {
        if (e.isDefaultPrevented()) {
            return;
        }

        const curPoint = { x: e.pageX, y: e.pageY };
        const { marker } = this;

        if (marker.trigger('mouseup', curPoint)) {
            log.debug('attached mouseup');
            return;
        }

        const fnAction = ({
            zoomout: () => marker.zoomOut(curPoint),
            zoomin: () => marker.zoomIn(curPoint),
            zoomOrigin: () => marker.zoomOrigin(curPoint),
            move: () => this.end(),
            rect: () => this.end(),
            circle: () => this.end(),
            marks: () => {

            }
        })[this.state.markType];
        if (fnAction) {
            fnAction();
            this.setState({});
        }
    }

    markMove = (e) => {
        if (e.isDefaultPrevented()) {
            return;
        }
        if (this.moveObj) {
            this.moveObj.moveTo({ x: e.pageX, y: e.pageY });
            this.setState({ curMark: this.moveObj.getMark() });
        }
    }

    btnAction = (sType) => {
        const fn = ({
            'save': () => {
                // send all mark to server
                this.marker.getAllMark();
            },
        })[sType] || (() => { });
        fn();
    }

    render() {
        const { match = { params: {} } } = this.props;

        const toolBtn = [
            { name: 'move', text: 'Move' },
            { name: 'zoomin', text: 'ZoomIn' },
            { name: 'zoomout', text: 'ZoomOut' },
            { name: 'zoomOrigin', text: '1:1' },
            { name: 'rect', text: 'Rect' },
        ];
        const actionBtn = [
            { name: 'load', text: 'Load', disabled: true },
            { name: 'save', text: 'Save', disabled: true },
            { name: 'reset', text: 'Reset', disabled: true },
        ];

        // 切换了图片
        if (match.params.id !== this.imgId && this.imgId) {
            this.imgId = match.params.id;
            this.marker.load(testImg);
        }

        const markRender = (oItem) => {
            if (!oItem) {
                return null;
            }
            return this.marker.render(oItem);
        };

        let markData = [];
        let markInfo = [];
        if (this.marker) {
            markData = this.marker.getAllMark('save');
            markInfo = this.marker.getAllMark();
        }
        return (
            <div>
                <div className="page-title">Mark: {this.state.markType}</div>
                <div>
                    <ButtonGroup className="action-group" onClick={this.setImgType} buttons={toolBtn} type="radio" />
                    <ButtonGroup className="action-group" onClick={this.btnAction} buttons={actionBtn} />
                </div>
                <div className="image-container" onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp} onMouseMove={this.markMove} id={this.canvasId}>
                    <svg xmlns="svgNS" width="100%" height="100%" className="mark-rect">
                        {markInfo.map(markRender)}
                        {this.state.curMark && markRender({ ...this.state.curMark, drawing: true })}
                    </svg>
                </div>
                <div>
                    {markData.map(mark => (
                        <div key={mark.id}>{mark.id}. {mark.type} {mark.points.map(p => <span key={p.x + p.y}>({p.x}x{p.y}), </span>)}</div>
                    ))}
                </div>
            </div>
        )
    }
}

export default ImageMark;
