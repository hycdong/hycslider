/* Author     : hyc
 * Create time: 2016.03.14
 * Last modify: 2016.03.16
*/
var hycSlide = function(options){
	var defaultPara = {
		delay: 					3,						//维持不动时间，单位为秒
		duration:				0.8,					//动画持续时间，单位为秒
		startIndex:			0,						//初始图片下标
		animationType:	"slide",   		//动画效果
		autoPlay:				true,					//是否自动播放			
		isClickHidden:	false,				//是否隐藏左右点击箭头
		isCircleHidden:	false,				//是否隐藏底部圆点					
		width:					0,						//用户自定义轮播图片宽度
		height:					0,						//用户自定义轮播图片高度			
		swapCell:				"sliderSwap",	//包裹容器ID
		listCell:				"ul"					//列表容器类型
	};
	
	var paras 			= [];
	var sContainer	= null;
	var sList				= null;
	var sItem				= [];
	var imgNum			= 0;
	var width				= 0;
	var height			= 0;
	var prefixName	= null;
	var data				= {};
	var isAnimation = false;
	
	//常用操作	
	var Operations = {
		//为指定元素添加类名
		addClass 		: 	function(element, className){
			var oriClass = element.className;
			element.className = oriClass+" "+className;
		},
		
		//为指定元素删除类名
		removeClass : 	function(element, className){
			var oriClass = element.className;
			if(oriClass){				
				var classArray = oriClass.split(" ");
				for(var i in classArray){
					if(classArray[i] == className){
						classArray[i] = "";
					}
				}
				element.className = classArray.join(" ");
			}
		},
		
		//根据参数创建元素，将其添加到父节点中，返回该节点
		createMyElement:	function(parent,type,id,className,text){
			var element = document.createElement(type);
			if(id)				{element.id = id;}
			if(className)	{element.className = className;}
			if(text)			{element.text = text;}
			parent.appendChild(element);
			return element;
		},
		
		//在父节点中寻找第index个类名为className的节点，返回该节点的索引值
		getChildIndexByClass:	function(parent, className, index){
			var cur = 0, count = 0;
			var pos = -1;
			for(var i = 0, array = parent.childNodes, len = parent.childNodes.length; i < len; i++){				
				if(array[i].nodeType == 1){
					count++;
					if(array[i].className.indexOf(className) != -1){
						cur++;
					if(cur == index){
						pos = count-1;
						break;
					}
				}}
			}
			return pos;
		},
		
		//为list中第index个元素添加类className，并移除其兄弟节点的类className
		setClassNameByIndex	: function(list, index, className){
			for(var i = 0, len = list.length; i < len; i++){
				if(i === index){
					this.addClass(list[i], className);
				}else{
					this.removeClass(list[i], className);
				}
			}
		}
	};
	
	//动画
	var Animation = {	
		//移动SwapCell使得第targetIndex张图片出现在页面上
		move				:	function(element, targetIndex){
			//获得当前位置
			var str = element.style.left;
			var pos = parseInt(str.slice(0, str.length-2),10);
			
			//计算目标位置
			var target = (-1)*targetIndex*width;
			var distance = target - pos;
			
			//判断左右移动的方向
			var ismoveleft = distance > 0 ? true : false;
			if (!ismoveleft)
				distance = -distance;
			
			//计算每次移动的距离
			var movetime = 5;
			var movedistance = distance/(paras.duration*1000.0/movetime);			
			
			var timer = null;
			var moveToTargetByStep = function(){
				if(ismoveleft){
					pos = pos + movedistance;
				}else{
					pos = pos - movedistance;
				}
				distance -= movedistance;
				sList.style.left = pos+"px";
				if(distance < movedistance){
					sList.style.left = target+"px";
					clearInterval(timer);
					isAnimation = false;
				}
			}			
			timer = setInterval(moveToTargetByStep, movetime);
		},
		
		//将第index张图片渐入显示出来，透明度由0到100
		fadeIn				:	function(index){
			var timer = null;
			var changeTime = 10;
			var opacityTarget = 100;
			var curOpacity = 0;
			
			//设置元素透明度
			var setOpacity = function(element, opacity){
				if(document.all){	//判断是否是IE浏览器
					element.style.filter = "alpha(opacity:"+opacity+")";
				}else{
					element.style.opacity = opacity/100;
				}
			};
			
			//初始化要显示的图片的透明度，并将其修改为可见
			setOpacity(sItem[index], 0);
			sItem[index].style.display = "block";
			
			var speed = opacityTarget*changeTime/(paras.duration*1000);
			var changeOpacity = function(){
				setOpacity(sItem[index], curOpacity);
				curOpacity += speed;
				
				if(curOpacity > opacityTarget){
					setOpacity(sItem[index], opacityTarget);
					clearInterval(timer);
					isAnimation = false;
				}
			};
			timer = setInterval(changeOpacity, changeTime);			
		}
	};
	
	//设置当前圆点
	var setCircle = function(index){
		var circleItem = document.getElementById(prefixName+"_circleSwap").getElementsByTagName("li");
		Operations.setClassNameByIndex(circleItem, index, "current");
	};
	
	//显示第index张图片
	var showAtIndex = function(index){		
		isAnimation = true;
		
		if(!paras.isCircleHidden){
			setCircle(index);
		}
		//执行动画
		if(paras.animationType == "slide"){
			Animation.move(sList, index);
		}else if(paras.animationType == "fade"){
			for(var i = 0; i < imgNum; i++){
				sItem[i].style.display = "none";
			}
			Animation.fadeIn(index);
		}		
		Operations.setClassNameByIndex(sItem,index,"active");
	};
	
	//根据方向获得下一张显示图片的索引
	var startAnimation = function(direction, index){			
		if(direction == "l"){
			var nextIndex = index+1;
			if (nextIndex == imgNum){
				nextIndex = 0;
			}
		}else{
			var nextIndex = index-1;
			if (nextIndex < 0){
				nextIndex = imgNum-1;
			}
		}
		//在当前动画结束之后显示下一张图片
		if(!isAnimation){
			showAtIndex(nextIndex);
		}
	};
	
	//显示下一张图片
	var showNext = function(){
		var pos = Operations.getChildIndexByClass(sList, "active", 1);
		if(pos != -1){
			startAnimation("l", pos);			
		}		
	};
	
	//显示上一张图片
	var showPrev = function(){
		var pos = Operations.getChildIndexByClass(sList, "active", 1);
		if(pos != -1){
			startAnimation("r", pos);			
		}
	};
	
	//自动轮播
	var autoSlider = function(){
		data[prefixName] = setInterval(showNext, (paras.delay+paras.duration)*1000);
	};
	
	//停止自动轮播
	var stopAuto = function(){
		window.clearInterval(data[prefixName]);
	};
	
	//显示底部小圆圈
	var showCircle = function(){
		var circle = Operations.createMyElement(sContainer,"ul",prefixName+"_circleSwap","circleSwap","");
		for(var i = 0; i < imgNum; i++){
			Operations.createMyElement(circle,"li","","circle",i+1);
		}
		var left = (width - circle.clientWidth)/2;		
		circle.style.left = left+"px";
	};
	
	//点击小圆圈就跳转到相应的图片
	var setCircleClick = function(){
		var circle = document.getElementById(prefixName+"_circleSwap").getElementsByTagName("li");
		for(var i = 0, len = circle.length; i < len; i++){
			circle[i].onclick = function(j){
				return function(){
					if(paras.autoPlay){
						stopAuto();
					}
					if(!isAnimation){
						showAtIndex(j);
					}
				};
			}(i);
		}
	};
	
	//显示左右箭头
	var showClick = function(){
		var click = Operations.createMyElement(sContainer,"div","","clickBtnSwap","");
		var prev	= Operations.createMyElement(click,"a",prefixName+"_prev","click_icon prev","");
		var next	= Operations.createMyElement(click,"a",prefixName+"_next","click_icon next","");		
		var top = (height - prev.clientHeight) / 2.5;
		prev.style.top = top+"px";
		next.style.top = top+"px";
	};
	
	//左右箭头点击分别移动到前一张或后一张
	var clickSlider = function(){
		document.getElementById(prefixName+"_prev").onclick = function(){
			showPrev();
		};
		document.getElementById(prefixName+"_next").onclick =function(){
			showNext();
		};
	};	
	
	//进行初始化
	var init = function(){
		//获得用户配置，若用户未配置则为默认参数
		var getUserParas = function(){
			var paraLength = defaultPara.length;
			options = options || [];
			for(var key in defaultPara){
				paras[key] = options[key] ? options[key] : defaultPara[key];
			}
		}();
		
		//根据配置设置轮播容器
		var setContainer = function(){
			sContainer	= document.getElementById(paras.swapCell);
			sList 			= sContainer.getElementsByTagName(paras.listCell)[0];
			for(var i = 0, len = sList.childNodes.length; i < len; i++){
				var t = sList.childNodes[i];
				if(t.nodeType == 1){
					sItem.push(t);
				}
			}
			imgNum 			= sItem.length;
			prefixName 	= paras.swapCell;
		}();
		
		//设置图片的高度和宽度
		var setWidth = function(){
			var sImg			= sList.getElementsByTagName("img");
			var imgWidth 	= sImg[0].width;
			var imgHeight = sImg[0].height;
			var imgPro		= imgHeight/imgWidth;
			if(paras.width == 0){
				width  = imgWidth;
				height = imgHeight;
			}else{
				width  = paras.width;
				height = width * imgPro;
			}
			sContainer.style.width 	= width+"px";
			sContainer.style.height = height+"px";
			
			for(var i = 0, len = sImg.length; i < len; i++){
				var t = sImg[i];
				if(t.nodeType == 1){
					t.style.width 	= width+"px";
					t.style.height 	= height+"px";
				}
			}
		}();

		//若设置的起始位置有误，则从默认起始位置开始
		if(paras.startIndex >= imgNum){
			paras.startIndex = defaultPara.startIndex;
		}
				
		if(imgNum > 1){	
			//显示底部小圆点
			if(!paras.isCircleHidden){
				showCircle();
				setCircle(paras.startIndex);
				setCircleClick();
			}			
			//为左右箭头增加点击事件
			if(!paras.isClickHidden){
				showClick();
				clickSlider();
			}
			//显示默认图片
			Operations.addClass(sItem[paras.startIndex], "active");
			if(paras.animationType == "slide"){
				sList.style.width = imgNum*width+"px";
				sList.style.left 	= (-1)*width*paras.startIndex + "px";
			}else{
				showAtIndex(paras.startIndex);
			}
			//开始自动轮播
			if(paras.autoPlay){
				autoSlider();
				sContainer.onmouseover = function(){
					stopAuto();
				};
				sContainer.onmouseout = function(){
					autoSlider();
				}
			}
		}		
	}();
};