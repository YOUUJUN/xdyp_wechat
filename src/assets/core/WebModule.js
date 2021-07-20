import axios from 'axios';

const baseURL = "http://erp.yuchengchina.com:15280/";

/**
 * 创建axios实例
 *
 * @type {AxiosInstance}
 */
const instance = axios.create({
    baseURL,
    method : 'POST',
    timeout : 120000,
    withCredentials: false,
});


/**
 * merge 默认配置；调用实例，返回promise;
 *
 * @param options
 * @returns {AxiosPromise}
 */
const myAxios =  (options = {}) => {
    options = Object.assign({},{
        responseType: 'json',
        responseEncoding: 'utf8'
    },options);

    return instance(options);

};


export default myAxios;



















