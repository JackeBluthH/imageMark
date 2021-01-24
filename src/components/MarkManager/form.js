import React from 'react';
import ReactDOM from 'react-dom';

const FormItem = {
    text: item => <input readOnly value={item.value}/>,
    input: item => (
        <input value={item.value}/>
    ),
    select: item => {
        <select value={item.value}>
            {item.options.map(opt => <option key={opt.value} value={opt.value}>{opt.text}</option>)}
        </select>
    }
};

function CustomForm({items}) {
    return (
        <form className={`custom-form`}>
            {items.map(item => (
                <div className="form-row">
                <div className="form-label">{item.label}</div>
                <div className="form-item">{FormItem[item.type](item)}</div>
            </div>
            ))}
        </form>
    )
}

function showProperties(params) {
    let panel = document.querySelector('.layout-helper');
    if (!panel) {
        console.log(`helper panel can't be found`);
        return false;
    }

    const div = document.createElement('div');
    div.style.padding = '10px';
    panel.appendChild(div);

    let oProps = {
        onOK: () => {

        },
        onClose: () => {

        },
        close: (oUserParam) => {
            ReactDOM.unmountComponentAtNode(div);
            if (params.onClose) {
                params.onClose(oUserParam);
            }
        },
        ...params
    };
    delete oProps.onClose;

    ReactDOM.render(<CustomForm {...oProps}/>, div);
}

export default showProperties;
