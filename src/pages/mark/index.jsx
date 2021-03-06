import React from 'react';

import ButtonGroup from '@/components/ButtonGroup';
import MarkManager from '@/components/MarkManager';
import logger from '@/utils/log';
import request from '@/utils/request';

// import styles from './index.less';
import './index.less';

// const testImg = '/assets/test.jpg';
const log = logger('markPage');

class ImageMark extends React.Component {
    componentDidMount() {
        const { match = { params: {} } } = this.props;
        this.marker = MarkManager(this.canvasId);

        if (match.params.id) {
            this.changeImage(match.params.id);
        }
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

    changeImage = (sImgId) => {
        // const sImg = `/api/getimg?path=${sImgId}`;
        const sImg = `/images/${sImgId}`;
        this.marker.load(sImg);
        this.imgId = sImgId;
    }

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

        this.moveObj = marker.trigger('mousedown', curPoint);
        if (this.moveObj) {
            log.debug('attached mousedown');
            return;
        }

        const actions = {
            move: () => this.marker.pluginMove(curPoint),
            rect: () => this.marker.pluginRect(curPoint),
            circle: () => this.marker.pluginCircle(curPoint),
            _: () => null,
        };
        const fn = actions[this.state.markType] || actions._;
        this.moveObj = fn();
    }

    onMouseUp = (e) => {
        if (e.isDefaultPrevented()) {
            return;
        }

        const curPoint = { x: e.pageX, y: e.pageY };
        const { marker } = this;

        if (this.moveObj) {
            this.end();
            this.setState({});
            return;
        }

        const fnAction = ({
            zoomout: () => marker.zoomOut(curPoint),
            zoomin: () => marker.zoomIn(curPoint),
            zoomOrigin: () => marker.zoomOrigin(curPoint)
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
            { name: 'save', text: 'Save', disabled: false },
            { name: 'reset', text: 'Reset', disabled: true },
        ];

        // 切换了图片
        if (match.params.id !== this.imgId && this.imgId) {
            this.changeImage(match.params.id);
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
            <div className="page-content">
                {/* <div className="page-title">Mark: {this.state.markType}</div> */}
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
                        <div key={mark.id}>{mark.id}. {mark.type} {mark.points.map(p => <span key={p.x + p.y}>({p.x.toFixed(2)}x{p.y.toFixed(2)}), </span>)}</div>
                    ))}
                </div>
            </div>
        )
    }
}

export default ImageMark;
