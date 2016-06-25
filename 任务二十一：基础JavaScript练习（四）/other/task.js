//事件绑定函数，兼容浏览器差异
function addEvent(element, event, listener) {
    try {
        element.addEventListener(event, listener, false);
    }
    catch(e){
        try{
            element.attachEvent("on" + event, listener);
        }
        catch(e) {
            element["on" + event] = listener;
        }
    }
    
}

//遍历数组的方法，针对数组中每一个元素执行fn函数，并将数组索引和元素作为参数传递，后面用
function each(arr, fn) {
    for (var cur = 0; cur < arr.length; cur++) {
        fn(arr[cur], cur);
    }
}

//将输入的内容分割为数组
function spiltInput(text) {
    var inputArray = [];
    inputArray = (text).split(/[,，;；、\s\n]+/);
    return inputArray;
}

//对textarea内的内容进行trim，否则当开头结尾有大量空格时会有bug
function trim(str) {
    var regex1 = /^\s*/;
    var regex2 = /\s*$/;
    return (str.replace(regex1, "")).replace(regex2, "");
}

function Queue(container, isDelDiv) {
    this.str = [];
    
    this.leftPush = function(obj) {
        if (obj.length) {
            this.str.unshift(obj);
            this.paint();
        }
    };
        
    this.rightPush = function(obj) {
        if (obj.length) {
            this.str.push(obj);
            this.paint();
        }
    };
        
    this.isEmpty = function() {
        return (this.str.length == 0);
    };
        
    this.leftPop = function() {
        if (!this.isEmpty()) {
            this.str.shift();
            this.paint();
        }
        else {
            alert("The queue is already empty!");
        }
    };
        
    this.rightPop = function() {
        if (!this.isEmpty()) {
            this.str.pop();
            this.paint();
        }
        else {
            alert("The queue is already empty!");
        }
    };
        
    this.paint = function() {
        var str = "";
        each(this.str, function(item){str += ("<div>" + item + "</div>")});
        container.innerHTML = str;
        if(isDelDiv) addDivDelEvent(this, container);
    };
        
    this.deleteID = function(id) {
        this.str.splice(id, 1);
        this.paint();
    }
}

//为container中的每个div绑定删除函数
function addDivDelEvent(Queue, container) {
    var temp = [];
    for (var cur = 0; cur < container.childNodes.length; cur++) {
        temp.push(container.childNodes[cur].innerHTML);
        //这里要使用闭包，否则永远绑定到指定div上的delete函数的参数永远等于跳出时的cur值(length);
        addEvent(container.childNodes[cur], "click", function(cur) {
            return function(){return Queue.deleteID(cur)};
        }(cur));
        addEvent(container.childNodes[cur], "mouseover", function(cur) {
            return function(){container.childNodes[cur].style.background = "green"; container.childNodes[cur].innerHTML = "删除" + temp[cur] + "?";};
        }(cur));
        addEvent(container.childNodes[cur], "mouseout", function(cur) {
            return function(){container.childNodes[cur].style.background = "red"; container.childNodes[cur].innerHTML = temp[cur];};
        }(cur));
    }
}

window.onload = function() {
    var tagContainer = document.getElementById("tag-container");
    var tagInput = document.getElementById("tag-input");
    var hobbyContainer = document.getElementById("hobby-container");
    var hobbyButton = document.getElementById("hobby-submit");
    var hobbyInput = document.getElementById("hobby-input");
    //定义队列的对象

    
    //实例1：Tag;
    var tagQueue = new Queue(tagContainer, true);
    
    //实例2：Hobby;不用给div增加删除事件
    var hobbyQueue = new Queue(hobbyContainer, false);
    
    
    
    //绑定事件
    addEvent(hobbyButton, "click", function() {
        var input = each(spiltInput(trim(hobbyInput.value)), function(item, index) {
           if (hobbyQueue.str.indexOf(item) === -1) {
                hobbyQueue.rightPush(item);
                if (hobbyQueue.str.length > 10) {
                    hobbyQueue.leftPop();
                }
            } 
        });
        hobbyQueue.paint();

    });
    
    addEvent(tagInput, "keyup", function(e) {
        if (/[,，;；、\s\n]+/.test(tagInput.value) || e.keyCode ===13) {
            var handledData = spiltInput(trim(tagInput.value));
            var data = handledData[0];
            if (tagQueue.str.indexOf(data) === -1) {
                tagQueue.rightPush(data);
                if (tagQueue.str.length > 10) {
                    tagQueue.leftPop();
                }
            }
            tagQueue.paint();
            tagInput.value = "";
        }
    })
    
}