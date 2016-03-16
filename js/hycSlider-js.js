/* Author     : hyc
 * Create time: 2016.03.14
 * Last modify: 2016.03.16
*/
var hycSlide = function(options){
	var defaultPara = {
		delay: 					3,						//ά�ֲ���ʱ�䣬��λΪ��
		duration:				0.8,					//��������ʱ�䣬��λΪ��
		startIndex:			0,						//��ʼͼƬ�±�
		animationType:	"slide",   		//����Ч��
		autoPlay:				true,					//�Ƿ��Զ�����			
		isClickHidden:	false,				//�Ƿ��������ҵ����ͷ
		isCircleHidden:	false,				//�Ƿ����صײ�Բ��					
		width:					0,						//�û��Զ����ֲ�ͼƬ���
		height:					0,						//�û��Զ����ֲ�ͼƬ�߶�			
		swapCell:				"sliderSwap",	//��������ID
		listCell:				"ul"					//�б���������
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
	
	//���ò���	
	var Operations = {
		//Ϊָ��Ԫ���������
		addClass 		: 	function(element, className){
			var oriClass = element.className;
			element.className = oriClass+" "+className;
		},
		
		//Ϊָ��Ԫ��ɾ������
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
		
		//���ݲ�������Ԫ�أ�������ӵ����ڵ��У����ظýڵ�
		createMyElement:	function(parent,type,id,className,text){
			var element = document.createElement(type);
			if(id)				{element.id = id;}
			if(className)	{element.className = className;}
			if(text)			{element.text = text;}
			parent.appendChild(element);
			return element;
		},
		
		//�ڸ��ڵ���Ѱ�ҵ�index������ΪclassName�Ľڵ㣬���ظýڵ������ֵ
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
		
		//Ϊlist�е�index��Ԫ�������className�����Ƴ����ֵܽڵ����className
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
	
	//����
	var Animation = {	
		//�ƶ�SwapCellʹ�õ�targetIndex��ͼƬ������ҳ����
		move				:	function(element, targetIndex){
			//��õ�ǰλ��
			var str = element.style.left;
			var pos = parseInt(str.slice(0, str.length-2),10);
			
			//����Ŀ��λ��
			var target = (-1)*targetIndex*width;
			var distance = target - pos;
			
			//�ж������ƶ��ķ���
			var ismoveleft = distance > 0 ? true : false;
			if (!ismoveleft)
				distance = -distance;
			
			//����ÿ���ƶ��ľ���
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
		
		//����index��ͼƬ������ʾ������͸������0��100
		fadeIn				:	function(index){
			var timer = null;
			var changeTime = 10;
			var opacityTarget = 100;
			var curOpacity = 0;
			
			//����Ԫ��͸����
			var setOpacity = function(element, opacity){
				if(document.all){	//�ж��Ƿ���IE�����
					element.style.filter = "alpha(opacity:"+opacity+")";
				}else{
					element.style.opacity = opacity/100;
				}
			};
			
			//��ʼ��Ҫ��ʾ��ͼƬ��͸���ȣ��������޸�Ϊ�ɼ�
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
	
	//���õ�ǰԲ��
	var setCircle = function(index){
		var circleItem = document.getElementById(prefixName+"_circleSwap").getElementsByTagName("li");
		Operations.setClassNameByIndex(circleItem, index, "current");
	};
	
	//��ʾ��index��ͼƬ
	var showAtIndex = function(index){		
		isAnimation = true;
		
		if(!paras.isCircleHidden){
			setCircle(index);
		}
		//ִ�ж���
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
	
	//���ݷ�������һ����ʾͼƬ������
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
		//�ڵ�ǰ��������֮����ʾ��һ��ͼƬ
		if(!isAnimation){
			showAtIndex(nextIndex);
		}
	};
	
	//��ʾ��һ��ͼƬ
	var showNext = function(){
		var pos = Operations.getChildIndexByClass(sList, "active", 1);
		if(pos != -1){
			startAnimation("l", pos);			
		}		
	};
	
	//��ʾ��һ��ͼƬ
	var showPrev = function(){
		var pos = Operations.getChildIndexByClass(sList, "active", 1);
		if(pos != -1){
			startAnimation("r", pos);			
		}
	};
	
	//�Զ��ֲ�
	var autoSlider = function(){
		data[prefixName] = setInterval(showNext, (paras.delay+paras.duration)*1000);
	};
	
	//ֹͣ�Զ��ֲ�
	var stopAuto = function(){
		window.clearInterval(data[prefixName]);
	};
	
	//��ʾ�ײ�СԲȦ
	var showCircle = function(){
		var circle = Operations.createMyElement(sContainer,"ul",prefixName+"_circleSwap","circleSwap","");
		for(var i = 0; i < imgNum; i++){
			Operations.createMyElement(circle,"li","","circle",i+1);
		}
		var left = (width - circle.clientWidth)/2;		
		circle.style.left = left+"px";
	};
	
	//���СԲȦ����ת����Ӧ��ͼƬ
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
	
	//��ʾ���Ҽ�ͷ
	var showClick = function(){
		var click = Operations.createMyElement(sContainer,"div","","clickBtnSwap","");
		var prev	= Operations.createMyElement(click,"a",prefixName+"_prev","click_icon prev","");
		var next	= Operations.createMyElement(click,"a",prefixName+"_next","click_icon next","");		
		var top = (height - prev.clientHeight) / 2.5;
		prev.style.top = top+"px";
		next.style.top = top+"px";
	};
	
	//���Ҽ�ͷ����ֱ��ƶ���ǰһ�Ż��һ��
	var clickSlider = function(){
		document.getElementById(prefixName+"_prev").onclick = function(){
			showPrev();
		};
		document.getElementById(prefixName+"_next").onclick =function(){
			showNext();
		};
	};	
	
	//���г�ʼ��
	var init = function(){
		//����û����ã����û�δ������ΪĬ�ϲ���
		var getUserParas = function(){
			var paraLength = defaultPara.length;
			options = options || [];
			for(var key in defaultPara){
				paras[key] = options[key] ? options[key] : defaultPara[key];
			}
		}();
		
		//�������������ֲ�����
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
		
		//����ͼƬ�ĸ߶ȺͿ��
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

		//�����õ���ʼλ���������Ĭ����ʼλ�ÿ�ʼ
		if(paras.startIndex >= imgNum){
			paras.startIndex = defaultPara.startIndex;
		}
				
		if(imgNum > 1){	
			//��ʾ�ײ�СԲ��
			if(!paras.isCircleHidden){
				showCircle();
				setCircle(paras.startIndex);
				setCircleClick();
			}			
			//Ϊ���Ҽ�ͷ���ӵ���¼�
			if(!paras.isClickHidden){
				showClick();
				clickSlider();
			}
			//��ʾĬ��ͼƬ
			Operations.addClass(sItem[paras.startIndex], "active");
			if(paras.animationType == "slide"){
				sList.style.width = imgNum*width+"px";
				sList.style.left 	= (-1)*width*paras.startIndex + "px";
			}else{
				showAtIndex(paras.startIndex);
			}
			//��ʼ�Զ��ֲ�
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