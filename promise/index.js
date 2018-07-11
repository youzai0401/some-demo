/**
 * Created by z on 2018/7/10.
 */
class Promise {
    constructor(executor) {
        // init state
        this.state = 'pending';
        // init success value
        this.value = undefined;
        // init failed reason
        this.reason = undefined;
        // init onFulFilledArr
        this.onFulFilledArr = [];
        // init onRejectArr
        this.onRejectArr = [];
        // success
        let resolve = (value) => {
            this.state = 'fulfilled';
            // console.log(value);
            this.value = value;
            this.onFulFilledArr.forEach(fn => fn());
        }
        // failed
        let reject = (reason) => {
            this.state = 'rejected';
            // console.log(reason);
            this.reason = reason;
            this.onRejectArr.forEach(fn => fn());

        }
        if (this.state === 'pending') {
            try {
                executor(resolve, reject);
            } catch (err) {
                this.state = 'rejected';
                reject(err);
            }
        }
    }

    then(onFulFilled, onRejected) {
        onFulFilled = typeof onFulFilled === 'function' ? onFulFilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : err => {
            throw err
        };
        let promise2 = new Promise((resolve, reject) => {
            // when this.state is pending
            if (this.state === 'pending') {
                this.onFulFilledArr.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulFilled(this.value);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (err) {
                            reject(err);
                        }
                    }, 0)
                });
                this.onRejectArr.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (err) {
                            reject(err);
                        }
                    }, 0)
                });
            }
            if (this.state === 'fulfilled') {
                setTimeout(() => {
                    try {
                        let x = onFulFilled(this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (err) {
                        reject(err);
                    }
                }, 0)
            }
            if (this.state === 'rejected') {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (err) {
                        reject(err);
                    }
                }, 0)
            }
        });
        return promise2;
    }

    catch(onRejected) {
        return this.then(null, onRejected);
    }
}
function resolvePromise(promise2, x, resolve, reject) {
    if (x === promise2) {
        return reject(new TypeError('chaining cycle detected for promise'));
    }
    let called;
    if (x != null && (typeof x === 'object' || typeof x === 'function')) {
        try {
            let then = x.then;
            if (typeof then === 'function') {
                then.call(x, y => {
                    if (called) {
                        return;
                    }
                    called = true;
                    resolvePromise(promise2, y, resolve, reject);
                }, err => {
                    if (called) {
                        return;
                    }
                    called = true;
                    reject(err);
                });
            } else {
                resolve(x);
            }
        } catch (err) {
            if (called) {
                return;
            }
            called = true;
            reject(err);
        }
    } else {
        // console.log('grg');
        resolve(x);
    }
}
Promise.resolve = function (val) {
    return new Promise((resolve, reject) => {
        resolve(val);
    })
};
Promise.reject = function (val) {
    return new Promise((resolve, reject) => {
        reject(val);
    })
}
Promise.race = function (promises) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < promises.length; i++) {
            promises[i].then(resolve, reject);
        }
    })
}
Promise.all = function (promises) {
    let arr = [];
    let i = 0;
    function processData(index, data, resolve) {
        i++
        arr[index] = data;
        if (i === arr.length) {
            resolve(arr);
        }
    }
    return new Promise((resolve, reject) => {
        for (let i=0;i< promises.length;i++) {
            promises[i].then(function (value) {
                processData(i, value, resolve)
            }, reject);
        }
    })
}
const a = new Promise(function (resolve, reject) {
    // throw new Error('error');
    setTimeout(function () {
        if (Math.random() > 0.5) {
            resolve('success');
        } else {
            reject('failed');
        }
    }, 1000)
});
a.then(function (value) {
    console.log('then1:', value);
    return 1;
}, function (err) {
    console.log('then1:', err);
}).then(function (v) {
    return function () {
        console.log('haha');
    }();
});
var aaa = a.then(function (value) {
    console.log('then2:', value);
    return aaa;
}, function (err) {
    console.log('then2:', err);
});
setTimeout(function () {
    a.then(function (value) {
        console.log('then3:', value);
        return 3;
    }, function (err) {
        console.log('then3:', err);
    });
}, 1000)
var bb = new Promise((resolve, reject) => {
    setTimeout(function () {
        resolve('bb is success');
    }, 1000)
})

var cc = new Promise((resolve, reject) => {
    setTimeout(function () {
        resolve('cc is success');
    }, 1000)
})

var dd = new Promise((resolve, reject) => {
    setTimeout(function () {
        try {
            throw new Error('dd is error');
        } catch (err) {
            reject(err);
        }
    }, 1000)
})

var ee = Promise.all([bb,cc]).then(function (data1,data2) {
    console.log(data1);
    console.log(data2);
})
var ff = Promise.all([bb,cc,dd]).then(function (data) {
    console.log(data);
}, function (err) {
    console.log(err);
})


const someAsyncThing = function() {
    return new Promise(function(resolve, reject) {
        // 下面一行会报错，因为x没有声明
        resolve(x + 2);
    });
};

someAsyncThing()
    .catch(function(error) {
        console.log('oh no', error);
    })
    .then(function(value) {
        console.log('carry on');
    });


// async function aaa() {var aa = await new Promise((resolve, reject) => {
//     setTimeout(function() {
//
//         resolve(123);
//     }, 1000);
//
// })
//
//     console.log(aa);
// }
// aaa();

