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
        console.log('setImgType', sType);
        this.setState({ markType: sType });
    }

    end = () => {
        this.moveObj.end();
        this.moveObj = null;
        this.setState({
            curMark: null,
            markInfo: this.marker.getAllMark(),
        });
    }
    
    doImgMark2 = (e) => {
        if (this.state.curMark) {
            this.marks.push(this.state.curMark);
            this.setState({ curMark: null });
            this.moveObj = null;
            return;
        }

        const curMark = {
            id: this.marks.length + 1,
            type: 'rect',
            x: e.pageX,
            y: e.pageY,
            width: 0,
            height: 0,
        };
        this.setState({ curMark });

        this.moveObj = {
            moveTo: ({ x, y }) => {
                curMark.width = Math.abs(x - curMark.x);
                curMark.height = Math.abs(y - curMark.y);
                this.setState({ curMark });
            }
        }
    }

    // action of click
    onMouseDown = (e) => {
        if (e.isDefaultPrevented()) {
            return;
        }
        console.log('doImgMark');
        const curPoint = { x: e.pageX, y: e.pageY };
        const { marker } = this;
        const fn = ({
            'move': () => {
                this.moveObj = this.marker.pluginMove(curPoint);
            },
            'rect': () => {
                this.moveObj = this.marker.pluginRect(curPoint);
                this.setState({ curMark: this.moveObj.getMark() });
            },
            'circle': () => {
                this.moveObj = this.marker.pluginCircle(curPoint);
            },
        })[this.state.markType] || (() => { });
        fn();
    }

    onMouseUp = (e) => {
        if (e.isDefaultPrevented()) {
            return;
        }
        const curPoint = { x: e.pageX, y: e.pageY };
        const { marker } = this;
        const fn = ({
            'zoomout': () => {
                marker.zoomOut(curPoint);
            },
            'zoomin': () => {
                marker.zoomIn(curPoint)
            },
            'move': () => {
                // move end
                this.end();
            },
            'rect': () => {
                // move end
                this.end();
            },
            'circle': () => {
                // move end
                this.end();
            },
        })[this.state.markType] || (() => { });
        fn();
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
            { name: 'rect', text: 'Rect' },
        ];
        const actionBtn = [
            { name: 'load', text: 'Load', disabled:true },
            { name: 'save', text: 'Save', disabled:true },
            { name: 'reset', text: 'Reset', disabled:true },
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

        return (
            <div>
                <div className="page-title">Mark: {this.state.markType}</div>
                <div>
                    <ButtonGroup className="action-group" onClick={this.setImgType} buttons={toolBtn} type="radio" />
                    <ButtonGroup className="action-group" onClick={this.btnAction} buttons={actionBtn} />
                </div>
                <div className="image-container" onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp} onMouseMove={this.markMove} id={this.canvasId}>
                    {this.state.markInfo.map(markRender)}
                    {this.state.curMark && markRender({...this.state.curMark, drawing:true})}
                </div>
                <div>
                    {this.state.markInfo.map(mark => (
                        <div key={mark.id}>{mark.id}. {mark.type} {mark.x},{mark.y}</div>
                    ))}
                </div>
            </div>
        )
    }
}

export default ImageMark;
