function klass(parent, obj) {
    const temp = function (...params) {
        // if (temp && temp.uper && temp.uper._constructor) {
        //     temp.uper.prototype._constructor.apply(this, params);
        //     temp.prototype._constructor.apply(this, params);
        // } else {
        //     temp.prototype._constructor.apply(this, params);
        // }
        // 先判断继承的uper(父级的原型上)中有没有_constructor方法，若有，执行，再判断目标对象的原型上有没有该方法
        if (temp.uper && temp.uper.hasOwnProperty('_constructor')) {
                temp.uper.prototype._constructor.apply(this, params);
        }
        if (temp && temp.prototype.hasOwnProperty('_constructor')) {
            temp.prototype._constructor.apply(this, params);
        }
    }

    // 临时构造函数
    parent = parent || {};
    const fn = function () {};
    fn.prototype = parent.prototype;
    temp.prototype = new fn();
    // 保存父级的原型，以备不时之需
    temp.uper = parent.prototype;
    // 修正constructor的指向
    temp.constructor = temp;

    for (let key in obj) {
        // 过滤obj原型上的属性
        if (obj.hasOwnProperty(key)) {
            temp.prototype[key] = obj[key];
        }
    }
    return temp;
}
function Parent() {
    this.name = 'Parent';
}
Parent.prototype.getName = function () {
    console.log('parent name')
}
Parent.prototype.getParentName = function () {
    console.log('Parent get name');
    return this.name;
}
const Test = klass(Parent, {
    _constructor(parmas) {
        this.data = 'test data';
        this.name = 'haha';
        console.log(parmas);
    },
    _getName() {
        return this.name;
    },
    _setName(name) {
        this.name = name;
    }
})

const newTest = new Test('parmas');
console.log(newTest.name);
console.log(newTest.data);
newTest._getName();
console.log(newTest.name);
newTest._setName('new name')
console.log(newTest.name);
console.log('newTest instanceof Test: ', newTest instanceof Test);
console.log('newTest instanceof Test: ', newTest instanceof Parent);
console.log(newTest.getParentName());;
newTest.getName();

// todo es6的类编写方式以及继承方式
