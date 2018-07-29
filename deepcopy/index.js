function deepCopy(obj) {
    const toStr = Object.prototype.toString;
    // 获取obj的数据类型
    if (typeof obj !== 'object') return obj;
    const objType = toStr.call(obj);
    // 初始化copyObj，主要判断类型是数组还是对象
    const copyObj = objType === '[object Array]' ? [] : {};
    for(const key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object') {
                copyObj[key] = deepCopy(obj[key]);
            } else {
                copyObj[key] = obj[key];
            }
        }
    }
    return copyObj;
}
obj1 = [1, 2, 3, {a: 1, b: [123, 132, 453, 'qwe', {asd: 'asd'}]}];
copyObj1 = deepCopy(obj1);
obj1[3].b[4].asd = 'test';
console.log(obj1);
console.log(copyObj1);

obj2 = {a: 12, b: 'qwe', c: [1, 2, 34, {d: [123], c: {asd: 'asd', test: 'test'}}]};
copyObj2 = deepCopy(obj2);
obj2.c[3].c.asd = 'hiahia';
console.log(obj2);
console.log(copyObj2);


obj3 = {
    a: [123,123],
    b: {c: 123, d: '123'},
    c() {
        console.log('test');
    }
}
copyObj3 = deepCopy(obj3);
obj3.c = function () {
    console.log('haha');
}
copyObj3.c();

// 同样可以达到深复制的目的，但是无法复制函数！
const jsonMethodObj1 = JSON.parse(JSON.stringify(obj1));
console.dir(jsonMethodObj1);

const jsonMethodObj3 = JSON.parse(JSON.stringify(obj3));
console.dir(jsonMethodObj3);



