/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: "西安",
  nowGraTime: "day"
}

/**
 * 渲染宽度
 */
function getWidth(){
  switch (pageState.nowGraTime) {
        case "day":
            return 10;
        case "week":
            return 30;
        case "month":
            return 60;
    }
}

/**
 * 渲染图表
 */
function renderChart() {
  var wrap=document.getElementById('wrap');
  wrap.innerHTML="";
  var data=chartData[pageState.nowGraTime][pageState.nowSelectCity];
  var width=getWidth();
  var html=" ";
  for(var i in data){
    html+="<div style='margin-left:"+1.5*parseInt(width)+"px'> <a style='height:"+data[i]+"px;width:"+width+"px;' title='"+i+":"+data[i]+"'></a></div>";
  } 
  wrap.innerHTML=html;
}


/**
 * addEventHandler方法
 * 跨浏览器实现事件绑定
 */
function addEventHandler(ele, event, hanlder) {
    if (ele.addEventListener) {
        ele.addEventListener(event, hanlder, false);
    } else if (ele.attachEvent) {
        ele.attachEvent("on"+event, hanlder);
    } else  {
        ele["on" + event] = hanlder;
    }
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange(radio) {
  // 确定是否选项发生了变化 
  var timeType=radio.value;
  if(timeType!== pageState.nowGraTime){
  // 设置对应数据
  pageState.nowGraTime=timeType;
  // 调用图表渲染函数
  renderChart();
  }
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化 
  var select=document.getElementById('city-select');
  var city=select.value;
  if(pageState.nowSelectCity!=city){
  // 设置对应数据
  pageState.nowSelectCity=city;
  // 调用图表渲染函数
  renderChart();
  }
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var radio=document.getElementsByName('gra-time');
  for(var i=0,l=radio.length;i<l;i++){
    (function(m){
      addEventHandler(radio[m],'click',function(){
        graTimeChange(radio[m])
      })
    })(i);
  }
  
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var select=document.getElementById('city-select');
  var citys=Object.getOwnPropertyNames(aqiSourceData);
  var htmlArr=citys.map(function(item){
    return '<option>'+item+'</option>';
  });
  pageState.nowSelectCity=citys[0];
  select.innerHTML=htmlArr.join("");
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  addEventHandler(select,'change',citySelectChange);
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  var weekData={},singleWeek={},wcount=0;
  var monthData={},singleMonth={},mcount=0;
  var daycount=0;

  for(var city in aqiSourceData){
      var cityData=aqiSourceData[city];
      var initDate=5;
      var days=[];
      for(var day in cityData){
        days.push(day);
      }
      for(var i=0,len=days.length;i<len;i++){
        var today=days[i];
        var tomorrow=days[i+1];
        var nowMonth=today.slice(5,7);
        var nextMonth;
        if(tomorrow!=undefined)
        nextMonth=tomorrow.slice(5,7);

        wcount+=cityData[today];
        daycount++;

        mcount+=cityData[today];

        if(initDate%7==0||nowMonth!=nextMonth||i==len-1){      //每个星期天或者每个月最后一天或者数据的最后一条
          var key=nowMonth+'月第'+(Math.floor((initDate-1)/7)+1)+'周';
          singleWeek[key]=Math.floor(wcount/daycount);      //每周平均空气质量
          daycount=0;
          wcount=0;

          if(nowMonth!=nextMonth||i==len-1){
            initDate%=7;
            var mDayCount=today.slice(-2);
            singleMonth[nowMonth]=Math.floor(mcount/mDayCount);     //每个月平均空气质量
            mcount=0;
          }

        }
        initDate++;
      }
      weekData[city]=singleWeek;
      monthData[city]=singleMonth;
      
      singleWeek={};
      singleMonth={};
    }

    chartData.day=aqiSourceData;
    chartData.week=weekData;
    chartData.month=monthData;

    renderChart();
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
}

window.onload=function(){
  init();
}
