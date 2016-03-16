/* Author     : hyc
 * Create time: 2016.03.12
 * Last modify: 2016.03.14
*/
(function($){
	$.fn.hycSlide = function(options) {
		var defaultPara = {
			delay: 					3,								//维持不动时间，单位为秒
			duration:				0.8,							//动画持续时间，单位为秒
			startIndex:			0,								//初始图片下标
			animationType:	"fade",						//动画效果
			autoPlay:				true,							//是否自动播放			
			isClickHidden:	false,						//是否隐藏左右点击箭头
			isCircleHidden:	false,						//是否隐藏底部圆点					
			width:					0,								//用户自定义轮播图片宽度
			height:					0,								//用户自定义轮播图片高度			
			mainCell:				"#sliderSwap ul"	//默认容器名称
		};
		
		var paras					= $.extend({}, defaultPara, options || {});		
		var $slider_swap	= null;
		var $slider_list 	= null;
		var $slider_item 	= null;		
		var item_num     	= 0;
		var width					= 0;
		var height				= 0;		
		var prefix_name   = "";
		
		//设置当前圆点
		var setCircle = function(index){
			var $circle_item = $("#"+prefix_name+"_circleSwap li.circle");
			$circle_item.eq(index).addClass("current").siblings().removeClass("current");
		}
		
		//显示指定索引的图片
		var showAtIndex = function(index){		
			if(!paras.isCircleHidden){
				setCircle(index);
			}
			//根据不同动画效果显示下一张图片
			if (paras.animationType == "slide"){	
				$slider_list.stop().animate({"left" : (-1)*width*index+"px"}, paras.duration*1000, function(){				
					$slider_item.eq(index).addClass("active").siblings().removeClass("active");								
				});
			}else if (paras.animationType == "fade"){
				//先隐藏其他的图片
				$slider_item.each(function(){
					if($(this).index() != index)
						$(this).css("display","none");
				});
				//为要显示的图片添加动画效果
				$slider_list.children().eq(index).fadeIn(paras.duration*1000, function(){
					$(this).addClass("active").siblings().removeClass("active");					
				});
			}
		}
		
		//根据方向获得下一张显示图片的索引
		var startAnimation = function(direction, index){			
			if(direction == "l"){
				var nextIndex = index+1;
				if (nextIndex == item_num){
					nextIndex = 0;
				}
			}else{
				var nextIndex = index-1;
				if (nextIndex < 0){
					nextIndex = item_num-1;
				}
			}
			//在当前动画结束之后执行显示下一张图片的操作
			if( !$slider_list.is(":animated") ){
				showAtIndex(nextIndex);
			}
		};
		
		//显示下一张图片
		var showNext = function(){
			startAnimation("l", $slider_list.find(".active").index());
		};
		
		//显示上一张图片
		var showPrev = function(){
			startAnimation('r', $slider_list.find(".active").index());
		};		
		
		//自动轮播
		var autoSlider = function(){
			$(this).data("timeId"+prefix_name, window.setInterval(showNext, (paras.delay+paras.duration)*1000));
		};
		
		//停止自动轮播
		var stopAuto = function(){
			window.clearInterval($(this).data("timeId"+prefix_name));
		};
		
		//显示底部小圆圈
		var showCircle = function(){
			var $circle = $('<ul class="circleSwap" id="'+prefix_name+'_circleSwap"></ul>');
			for(var i = 0; i < item_num; i++){
				$('<li class="circle">'+(i+1)+'</li>').appendTo($circle);
			}
			$slider_swap.append($circle);
			var left = (width - $circle.width())/2;
			$circle.css({"left":left+"px"});
		};
		
		//点击小圆圈就跳转到相应的图片
		var setCircleClick = function(){
			$("#"+prefix_name+"_circleSwap li.circle").each(function(index,element){		
				$(element).click(function(){
					if(paras.autoPlay){
						stopAuto();
					}
					//在当前动画结束之后执行显示下一张图片的操作
					if( !$slider_list.is(":animated") ){
						showAtIndex(index);
					}
				});
			});
		};
		
		//显示左右箭头
		var showClick = function(){
			var $click = $('<div class="clickBtnSwap" id="'+prefix_name+'_clickBtnSwap"></div>')
									.append('<a id="prev" class="click_icon"></a>').append('<a id="next" class="click_icon"></a>');
			$slider_swap.append($click);
			var top = (height - $click.find("#prev").height()) / 2.5;
			$click.find("a").css({"top":top+"px"});
		};
		
		//左右箭头点击分别移动到前一张或后一张
		var clickSlider = function(){
			var $slider_btn  	= $("#"+prefix_name+"_clickBtnSwap");
			$slider_btn.find("#next").click(function(){
				showNext();				
			});
			$slider_btn.find("#prev").click(function(){
				showPrev();
			});
		};
		
		//初始化函数
		var init = function(){
			//设定轮播容器
			var array = paras.mainCell.split(' ');
			if(array.length != 2){
				alert("图片容器设置有误");
				return;
			}
			$slider_swap	= $(array[0]);
			prefix_name		= array[0].slice(1);			
			$slider_list 	= $slider_swap.find(array[1]);
			$slider_item  = $slider_list.children();
			item_num     	= $slider_item.size();			
			
			//设置图片的宽度和高度，若用户未设置则为图片应有的宽度和高度
			var img_width 	= $slider_list.find("img").width();
			var img_height	= $slider_list.find("img").height();
			var img_pro			= img_height / img_width;			
			if(paras.width == 0){
				width 	= img_width;
				height	= img_height;
			}else{
				width		= paras.width;
				height	= width * img_pro;
			}
			$slider_swap.css({"width":width+"px", "height":height+"px"});
			$slider_list.find("img").css({"width":width+"px", "height":height+"px"});
			
			//若设置的起始位置大于图片总数，则默认从起始位置开始
			if(paras.startIndex >= item_num){
				paras.startIndex = defaultPara.startIndex;
			}
			
			//设定当前默认显示图片
			$slider_item.eq(paras.startIndex).addClass("active");
			if(paras.animationType == "slide"){		
				$slider_list.css({"width":item_num*width+"px","left":(-1)*width*paras.startIndex + "px"});
			}else if (paras.animationType == "fade"){
				showAtIndex(paras.startIndex);
			}
			
			if(item_num > 1){
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
				
				//开始自动轮播
				if(paras.autoPlay){
					autoSlider();
					//鼠标悬停时停止自动轮播，否则继续自动轮播
					$slider_swap.hover(function(){
							stopAuto();
						},function(){
							autoSlider();
						}
					);
				}
			}
		}();	
	}
})(jQuery);