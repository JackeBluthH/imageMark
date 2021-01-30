import React from 'react';
import './index.css';

function getClasses(...names) {
    return names.filter(sName => !!sName).join(' ');
}

class RadioButton extends React.Component {
    state = {
        btnName: '',
    }

    setBtn = (e, btnName) => {
        e.preventDefault();
        const sName = btnName === this.state.btnName ? '' : btnName;
        if (this.props.onClick) {
            this.props.onClick(sName);
        }

        if ('radio' === this.props.type) {
            this.setState({ btnName: sName });
        }

        return false;
    }

    render() {
        const { type, className } = this.props;
        const getBtnClass = btn => getClasses(
            'btn', 
            this.state.btnName === btn.name ? 'active' : '',
            btn.disabled ? 'disabled' : '',
            );
        return (
            <div className={getClasses('button-group', className, type)}>
                {this.props.buttons.map(btn => (
                    <a href={btn.name} key={btn.name} className={getBtnClass(btn)} onClick={(e) => this.setBtn(e, btn.name)}>{btn.text}</a>
                ))}
            </div>
        )
    }
}

export default RadioButton;
