һ. ��������
    ��jQuery��JSʵ�ֻ�����ͼƬ�Զ��ֲ����ܣ������û��ܹ������ֲ��������û��ܹ�ʵ�ֵ�Ч������������
    1. ͼƬ������������һ�ź���һ�ŵİ�ť��
    2. ͼƬ�·��б�ʶ��ǰ�ڵڼ��ŵ�ԲȦ�����ԲȦ��ֱ����ʾ��ͼƬ��
    3. �����ͣʱ����ͣ�Զ��ֲ�Ч����

    �û��ܹ����õĲ������£�
    1. ����Ч�������󻬶��͵���Ч����
    2. ��������ʱ�䣬�Զ����ŵļ��ʱ�䣻
    3. ������ͼ��ʼ�ֲ���
    4. �Ƿ��Զ��ֲ����Ƿ���ʾ���Ұ�ť���Ƿ���ʾ�·�ԲȦ��
    5. �û��Զ���ͼƬ�Ŀ�ȣ�
    6. �������ͼƬ���������ơ�


��. ʹ��˵��
1. jQuery�汾
    ��HTMLҳ������Ӷ�jQuery��hycSlider-jquery.js�����ã�jQuery�汾Ϊ1.11.1������������¸�ʽ��js���룺
    jQuery(function($){
      $('.sliderContainer').hycSlide({	
	animationType:"slide",
	autoPlay:	true,
      });
    });

2. js�汾
    ��HTMLҳ������Ӷ�hycSlider-js.js�����ã���������¸�ʽjs���룺
    hycSlide({
      startIndex    :  1,
      animationType :  "fade"
    });

3. �������˵��
�����汾ͨ�ò�����
    delay		ά�ֲ���ʱ�䣬��λΪ��
    duration		��������ʱ�䣬��λΪ��
    startIndex		��ʼͼƬ�±�
    animationType	����Ч��(slide��fade)
    autoPlay		�Ƿ��Զ�����			
    isClickHidden	�Ƿ��������ҵ����ͷ
    isCircleHidden	�Ƿ����صײ�Բ��					
    width		�û��Զ����ֲ�ͼƬ���
    height		�û��Զ����ֲ�ͼƬ�߶�(��ǰֻ��ͨ����ȼ���)		
jQuery������
    mainCell		�������� 

js������
    swapCell		��������ID
    listCell  		�б���������

4. ���ڰ���������˵��
    ʹ��ʱӦע��ͼƬ�İ����������������㣬���磺
    <div id="mainCellId">
      <div>
        <img ... />
        <img ... />
      </div>
    </div>
    ��ʹ��jQuery���ʱ��mainCell����Ӧ��Ϊ"#mainCellId div",��ʹ��js���ʱ��swapCell����Ϊ"mainCellId"��listCell����Ϊ"div"�������������Ҫ����Ψһ��id�����������ҪΪԪ�����͡�

5. ������������Ѳ��ԣ�
IE7�����ϣ�FireFox��Chrome