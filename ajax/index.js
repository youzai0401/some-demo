/**
 * Created by z on 2018/7/12.
 */
// global common option
const globalOption = {
    contentType: 'application/json',
    timeout: 5000,
    responseType: 'text', // “text”、“arraybuffer”、“blob”或“document”
    async: true,
    dataType: 'json'
}
class Ajax {
    constructor(options) {
        try {
            options = options || {};
            this.options = {
                contentType: options.contentType || globalOption.contentType,
                timeout: options.timeout || globalOption.timeout,
                async: options.async || globalOption.async,
                responseType: options.responseType || globalOption.responseType,
                dataType: options.dataType || globalOption.dataType
            };
            this.XHR = new XMLHttpRequest();
        } catch (e) {
            // throw new Error(e);
            console.log(e);
        }
    }
    get(xhrParams) {
        try {
            let {url, async = this.options.async, params, timeout = this.options.timeout,
                dataType = this.options.dataType,
                responseType = this.options.responseType, successCallback, failedCallback} = xhrParams;
            // if (this.XHR.status == 4) {
            //     try {
            //         if ((this.XHR.status >= 200 && this.XHR.status < 300) || this.XHR.status == 304) {
            //             return this.XHR.responseText;
            //         } else {
            //             return 'something error';
            //         }
            //     } catch (err) {
            //         return err;
            //     }
            // }
            const ajaxObject = this;
            this.XHR.onreadystatechange = function() {
                dealXhrStatus.call(ajaxObject, successCallback, failedCallback, dataType);
            }
            url = formatterParmas({url, params})
            this.XHR.open("get", url, async)
            // 通常用于重写服务器响应的MIME类型。以欺骗浏览器避免浏览器格式化服务器返回的数据，以实现接收二进制数据。
            // xhr.overrideMimeType('text/plain; charset=x-user-defined');
            // 在发送请求前，根据您的数据需要，将 xhr.responseType 设置为“text”、“arraybuffer”、“blob”或“document”。
            // 请注意，设置（或忽略）xhr.responseType = '' 会默认将响应设为“text”。
            this.XHR.responseType = responseType;
            this.XHR.timeout = timeout;
            this.XHR.ontimeout = function () {
                console.log(`request don not return in ${timeout}ms`);
                return `request don not return in ${timeout}ms`
            }
            this.XHR.send(null);
        } catch (e){
            console.log(e);
        }
    }
    post(xhrParams) {
        try {
            let {url, async = this.options.async, params, timeout = this.options.timeout,
                responseType = this.options.responseType,
                contentType = this.options.contentType,  successCallback, failedCallback} = xhrParams;
            const ajaxObject = this;
            this.XHR.onreadystatechange = function() {
                dealXhrStatus.call(ajaxObject, successCallback, failedCallback);
            }
            this.XHR.open("post", url, async);

            // 通常用于重写服务器响应的MIME类型。以欺骗浏览器避免浏览器格式化服务器返回的数据，以实现接收二进制数据。
            // xhr.overrideMimeType('text/plain; charset=x-user-defined');
            // 在发送请求前，根据您的数据需要，将 xhr.responseType 设置为“text”、“arraybuffer”、“blob”或“document”。
            // 请注意，设置（或忽略）xhr.responseType = '' 会默认将响应设为“text”。
            this.XHR.responseType = responseType;

            this.XHR.timeout = timeout;
            this.XHR.ontimeout = function () {
                console.log(`request don not return in ${timeout}ms`);
                return `request don not return in ${timeout}ms`
            }
            this.XHR.setRequestHeader("Content-Type", contentType);
            this.XHR.send(params);
        } catch (e){
            console.log(e);
        }
    }
    getRequestHeader(name) {
        return this.XHR.getRequestHeader(name);
    }
    getResponseHeader(name) {
        return this.XHR.getResponseHeader(name);
    }
    getAllResponseHeaders() {
        return this.XHR.getAllResponseHeaders();
    }
    cancel() {
        this.XHR.abort();
    }
}
function dealXhrStatus(successCallback, failedCallback, dataType) {
    if (this.XHR.readyState == 4) {
        try {
            if ((this.XHR.status >= 200 && this.XHR.status < 300) || this.XHR.status == 304) {
                let returnValue = '';
                switch (dataType) {
                    case "xml":
                        returnValue = this.XHR.responseXML;
                        break;
                    case "json":
                        var jsonText = this.XHR.responseText;
                        if (jsonText) {
                            if(window.JSON){
                                returnValue = JSON.parse(jsonText);
                            }else{
                                returnValue = eval('(' + jsonText + ')');
                            }
                        }
                        break;
                    default:
                        returnValue = this.XHR.responseText;
                        break;
                }
                successCallback && successCallback(returnValue);
                // return returnValue;
            } else {
                failedCallback && failedCallback();
                return 'something error';
            }
        } catch (err) {
            failedCallback && failedCallback();
            return err;
        }
    }
}
function formatterParmas({url,params}) {
    let newUrl = ''
    if (url.indexOf('?') == -1) {
        newUrl = url + '?'
    }
    for (let key in params) {
        newUrl = newUrl + encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&';
    }
    newUrl = newUrl.substring(0, newUrl.length-1);
    return newUrl;
}

var fetch = new Ajax();
fetch.get({
    url: '/blog/front/tag/list',
    params: {
        a: 123,
        b: 'qwe'
    },
    successCallback: function (res) {
        console.log('success');
        console.log(res);
        console.log(fetch.getResponseHeader('Connection'));
        console.log(fetch.getAllResponseHeaders());
        console.log(fetch.getRequestHeader('Accept'));
    }
});
console.log(fetch.getResponseHeader('Connection'));
console.log(fetch.getAllResponseHeaders());
// setTimeout(() => {
//     fetch.cancel();
// }, 100)
