一. 功能描述
    用jQuery和JS实现基本的图片自动轮播功能，并且用户能够配置轮播参数。用户能够实现的效果如下描述：
    1. 图片左右两侧有上一张和下一张的按钮；
    2. 图片下方有标识当前在第几张的圆圈，点击圆圈可直接显示该图片；
    3. 鼠标悬停时会暂停自动轮播效果。

    用户能够配置的参数如下：
    1. 动画效果：向左滑动和淡出效果；
    2. 动画播放时间，自动播放的间隔时间；
    3. 从那张图开始轮播；
    4. 是否自动轮播，是否显示左右按钮，是否显示下方圆圈；
    5. 用户自定义图片的宽度；
    6. 定义包裹图片的容器名称。


二. 使用说明
1. jQuery版本
    在HTML页面中添加对jQuery和hycSlider-jquery.js的引用（jQuery版本为1.11.1），并添加如下格式的js代码：
    jQuery(function($){
      $('.sliderContainer').hycSlide({	
	animationType:"slide",
	autoPlay:	true,
      });
    });

2. js版本
    在HTML页面中添加对hycSlider-js.js的引用，并添加如下格式js代码：
    hycSlide({
      startIndex    :  1,
      animationType :  "fade"
    });

3. 具体参数说明
两个版本通用参数：
    delay		维持不动时间，单位为秒
    duration		动画持续时间，单位为秒
    startIndex		初始图片下标
    animationType	动画效果(slide和fade)
    autoPlay		是否自动播放			
    isClickHidden	是否隐藏左右点击箭头
    isCircleHidden	是否隐藏底部圆点					
    width		用户自定义轮播图片宽度
    height		用户自定义轮播图片高度(当前只能通过宽度计算)		
jQuery参数：
    mainCell		容器名称 

js参数：
    swapCell		包裹容器ID
    listCell  		列表容器类型

4. 关于包裹容器的说明
    使用时应注意图片的包裹容器至少有两层，例如：
    <div id="mainCellId">
      <div>
        <img ... />
        <img ... />
      </div>
    </div>
    在使用jQuery插件时，mainCell参数应该为"#mainCellId div",而使用js插件时，swapCell参数为"mainCellId"，listCell参数为"div"，即最外层容器要定义唯一的id，次外层容器要为元素类型。

5. 适用浏览器（已测试）
IE7及以上，FireFox，Chrome