/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
// import { notification } from 'antd';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网络错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网络超时。',
};
/**
 * 异常处理程序
 */

const errorHandler = (error) => {
  const { response } = error;

  const showError = (message, description) => {
    // notification.error({ message, description });
    console.warn(message, description);
    throw new Error(message);
  };

  if (!response) {
    showError('网络异常', '您的网络发生异常，无法连接服务器');
  } else if (response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    showError(errorText, `请求错误 ${status}: ${url}`);
  }

  return response;
};

export function MyPromise(cb) {
  let success = null;
  let error = null;
  const userRet = cb(
    (...params) => (success ? success(...params) : params[0]),
    (...params) => (error ? error(...params) : params[0])
  );
  const inst = Object.assign(userRet, {
    success: (onSuccess) => {
      success = onSuccess;
      return inst;
    },
    error: (onError) => {
      error = onError;
      return inst;
    },
  });
  return inst;
}

/**
 * 配置request请求时的默认参数
 * 请求只支持get, port
 */
function request(prefix = '/api/', suffix = '.json') {
  const umiRequest = extend({
    prefix,
    // suffix,
    errorHandler,
    // 默认错误处理
    credentials: 'include', // 默认请求是否带上cookie
  });

  const sendRequest = (sender) => (url, params) =>
    MyPromise((success, failed) =>
      sender(url, params)
        .then((resp) => {
          if (resp.code === 200) {
            return success(resp.data);
          }
          throw resp;
        })
        .catch((e) => failed(e))
    );

  return {
    get: sendRequest((url, params) => umiRequest.get(url, { params })),
    post: sendRequest((url, data) => umiRequest.post(url, { data })),
  };
}

export default request();
