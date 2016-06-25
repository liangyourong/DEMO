/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
	var oCity=document.getElementById('aqi-city-input');
	var oValue=document.getElementById('aqi-value-input');
	var city=oCity.value.trim();
	var value=oValue.value.trim();
	oCity.value=" ";
	oValue.value=" ";
	if(!(/^[\u4e00-\u9fa5_a-zA-Z]+$/).test(city)){
		alert('输入的城市名必须为中英文字符');
		return ;
	}
	if(!(/^\d+$/).test(value)){
		alert('空气质量指数必须为整数');
		return ;
	}
	aqiData[city]=value;
}

function isEmptyObject(e) {  
    var t;  
    for (t in e)  
        return !1;  
    return !0  
} 
/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
	var table=document.getElementById('aqi-table');
	table.innerHTML="";
	if(!isEmptyObject(aqiData)){
		var tr=document.createElement('tr');
		tr.innerHTML='<td>城市</td><td>空气质量</td><td>操作</td>';
		table.appendChild(tr);
		for(var i in aqiData){
			var tr=document.createElement('tr');
			tr.innerHTML='<td>'+i+'</td><td>'+aqiData[i]+'</td><td><button data-city="'+i+'">删除</button></td>';
			table.appendChild(tr);
		}
	}
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
  addAqiData();
  renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(event) {
  // do sth.
  var event=event||window.event;
  var target=event.target||event.srcElement;
  var city=target.dataset.city;
  delete aqiData[city];

  renderAqiList();
}

function init() {

  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
  var addBtn=document.getElementById('add-btn');
  addBtn.addEventListener('click',function(){
  	addBtnHandle();
  },false);

  // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
  var table=document.getElementById('aqi-table');
  table.addEventListener('click',function(event){
  	if(event.target.nodeName.toLowerCase() === 'button') 
  		delBtnHandle(event);
  },false);
}
window.onload=function(){
	init();
}

