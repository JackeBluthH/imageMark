import React from 'react';

import ButtonGroup from '@/components/ButtonGroup';
import MarkManager from '@/components/MarkManager';

import testImg from './test.jpg';

// import styles from './index.less';
import './index.less';

// const testImg = '/assets/test.jpg';

class ImageMark extends React.Component {
    componentDidMount() {
        const { match = { params: {} } } = this.props;
        this.marker = MarkManager(this.canvasId);

        if (match.params.id) {
            // this.marker.load(match.params.id);
            console.log(match.params.id);
            this.imgId = match.params.id;
            this.marker.load(testImg);
        }

        
    }

    state = {
        endPort: null,
        markType: '',
        markInfo: [],
    }

    imgId = null
    startPort = null
    canvasId = `canval${Math.random()}`.replace('.', '');
    moveObj = null;

    setImgType = (sType) => {
        // this.markType = sType;
        console.log('setImgType', sType);
        this.setState({ markType: sType });
    }

    end = () => {
        this.moveObj.end();
        this.moveObj = null;
        this.setState({ markInfo: this.marker.getAllMark() });
    }
    // action of click
    doImgMark = (e) => {
        const curPoint = { x: e.pageX, y: e.pageY };
        const fn = ({
            'zoomout': () => {
                if (this.mouseDown === true) {
                    this.mouseDown = false;
                    this.marker.zoomOut(curPoint);
                    return;
                }
                this.mouseDown = true;
            },
            'zoomin': () => {
                if (this.mouseDown === true) {
                    this.mouseDown = false;
                    this.marker.zoomIn(curPoint)
                    return;
                }
                this.mouseDown = true;
            },
            'move': () => {
                if (this.moveObj) {
                    // move end
                    this.end();
                    return;
                }

                this.moveObj = this.marker.pluginMove(curPoint);
            },
            'rect': () => {
                if (this.moveObj) {
                    // move end
                    this.end();
                    return;
                }

                this.moveObj = this.marker.pluginRect(curPoint);
            },
            'circle': () => {
                if (this.moveObj) {
                    // move end
                    this.end();
                    return;
                }

                this.moveObj = this.marker.pluginCircle(curPoint);
            },
        })[this.state.markType] || (() => { });
        fn();
    }

    markMove = (e) => {
        if (this.moveObj) {
            this.moveObj.moveTo({ x: e.pageX, y: e.pageY });
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
            { name: 'rect', text: 'Rect' },
        ];
        const actionBtn = [
            { name: 'load', text: 'Load' },
            { name: 'save', text: 'Save' },
            { name: 'reset', text: 'Reset' },
        ];
        const renderPoint = (p) => {
            return `(${parseInt(p.x)} x ${parseInt(p.y)})`;
        }

        // 切换了图片
        if (match.params.id !== this.imgId && this.imgId) {
            this.imgId = match.params.id;
            this.marker.load(testImg);
        }

        return (
            <div>
                <div className="page-title">Mark: {this.state.markType}</div>
                <div>
                    <ButtonGroup className="action-group" onClick={this.setImgType} buttons={toolBtn} type="radio" />
                    <ButtonGroup className="action-group" onClick={this.btnAction} buttons={actionBtn} />
                </div>
                <div className="image-container" onMouseDown={this.doImgMark} onMouseUp={this.doImgMark} onMouseMove={this.markMove} id={this.canvasId}></div>
                <div>
                    {this.state.markInfo.map(mark => (
                        <div key={mark.id}>{mark.id}. {mark.type} {renderPoint(mark.P1)} {renderPoint(mark.P2)}</div>
                    ))}
                </div>
            </div>
        )
    }
}

export default ImageMark;
