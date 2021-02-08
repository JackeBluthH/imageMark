
import logger from './log';

const log = logger('myEvent');
function myEvent() {
    const _actions = {};
    const inst = {
        on: (sName, fnAction) => {
            const action = _actions[sName] || [];
            action.push(fnAction);
            _actions[sName] = action;
            log.debug('add event', sName);
            return inst;
        },
        off: (sName, fnAction) => {
            const action = _actions[sName] || [];
            _actions[sName] = action.filter(fn => fn !== fnAction);
            log.debug('remove event', sName);
            return inst;
        },
        trigger: (sName, ...params) => {
            const action = _actions[sName] || [];
            log.debug('trigger event', sName);
            return action.some(fn => fn(...params));
        }
    };

    return inst;
}

export default myEvent;
