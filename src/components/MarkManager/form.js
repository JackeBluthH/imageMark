import React from 'react';
import ReactDOM from 'react-dom';

const FormItem = {
    text: item => (
        <input name={item.name} readOnly value={item.value} />
    ),
    input: item => (
        <input name={item.name} defaultValue={item.value} />
    ),
    select: item => {
        <select name={item.name} value={item.value}>
            {item.options.map(opt => <option key={opt.value} value={opt.value}>{opt.text}</option>)}
        </select>
    }
};

function CustomForm({ name, title, items, ...params }) {
    function getFormValue() {
        const values = {};
        const form = document.forms[name];
        for (let i = 0; i < form.length; i++) {
            const ele = form[i];
            if (ele.name) {
                values[ele.name] = ele.value;
            }
        }
        return values;
    }

    function onApply() {
        const allValues = getFormValue();
        if (params.onOK) {
            params.onOK(allValues);
        }
        params.close(allValues);
    }
    function onCancel() {
        params.close();
    }
    return (
        <form className={`custom-form`} name={name}>
            <div className="form-header">
                <span className="title">{title}</span>
                <span className="icon icon-close" onClick={onCancel} />
            </div>
            <div className="form-body">
                {items.map(item => (
                    <div key={item.label} className="form-row">
                        <div className="form-label">{item.label}</div>
                        <div className="form-item">{FormItem[item.type](item)}</div>
                    </div>
                ))}
            </div>
            <div className="form-footer">
                <input type="submit" onClick={onApply} value="Apply" />
                <input type="button" onClick={onCancel} value="Cancel" />
            </div>
        </form>
    )
}

function $(selector) {
    const ele = document.querySelector(selector);
    if (!ele) {
        return null;
    }

    return {
        attr: (sName, val) => {
            if (undefined === val) {
                return ele.getAttribute(sName);
            }
            ele.setAttribute(sName, val);
            return this;
        },
        appendChild: (child) => {
            ele.appendChild(child);
            return this;
        },
        removeChild: (child) => {
            ele.removeChild(child);
            return this;
        },
        addClass: (classes) => {
            ele.className = [ele.className, classes].join(' ');
            return this;
        },
        removeClass: (classes) => {
            const aRemoved = classes.split(' ').filter(s => !!s);
            const aCurCls = (ele.className || '').split(' ').filter(s => !!s);
            ele.className = aCurCls.filter(s => !aRemoved.some(rs => rs === s)).join(' ');
            return this;
        }
    }
}
let FormInstance = null;
function showProperties(params) {
    let panel = $('.layout-helper');
    if (!panel) {
        console.log(`helper panel can't be found`);
        return false;
    }

    if (FormInstance) {
        if (FormInstance.name === params.name) {
            // 多次进入
            return;
        }
        FormInstance.close();
    }

    const div = document.createElement('div');
    panel.appendChild(div);
    panel.addClass('show');

    let oProps = {
        title: '属性框',
        close: (oUserParam) => {
            ReactDOM.unmountComponentAtNode(div);
            if (params.onClose) {
                params.onClose(oUserParam);
            }
            panel.removeChild(div);
            panel.removeClass('show');
            FormInstance = null;
        },
        ...params
    };

    FormInstance = oProps;
    ReactDOM.render(<CustomForm {...oProps} />, div);
}

export default showProperties;
