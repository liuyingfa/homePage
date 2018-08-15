/**
 * 如何去书写你的js
 * 1.js的分层(功能)：jquery(tools),组件（ui） 应用（app）,mvc(backbone)
 * 2.js的规划(管理	):避免全局变量和方法（命名空间，闭包，面向对象），模块化（seaJs,requireJs）
 */
window.onload = function() {
	mv.app.toTip();
	mv.app.toBanner();
	mv.app.toSel();
	mv.app.run();
}
var mv = {}; //命名空间 
mv.tools = {};
//ie6没有getclass方法
mv.tools.getByClass = function(oParent, sClass) {
	var aEle = oParent.getElementsByTagName('*');
	var arr = [];
	for(var i = 0; i < aEle.length; i++) {
		if(aEle[i].className == sClass) {
			arr.push(aEle[i]);
		}
	}
	return arr;
}

mv.tools.getStyle=function(obj,attr){
	if(obj.currentStyle){
		return obj.currentStyle[attr];
	}else{
		return getComputedStyle(obj,false)[attr];
	}
}

mv.ui = {};
//文本框移入移出效果公用方法
mv.ui.textChange = function(obj, val) {
	obj.value = val;
	obj.onblur = function() {
		if(this.value == '') {
			obj.value = val
		}
	}
	obj.onfocus = function() {
		if(this.value == val) {
			obj.value = '';
		}
	}

}
/**
 * 
 * @param {Object} obj 当前操作元素
 * @param {Object} old 当前的值
 * @param {Object} now 运动到的值
 */
mv.ui.moveLeft=function(obj,old,now){
	clearInterval(obj.timer);
	obj.timer=setInterval(function(){
		var iSpeed=(now-old)/10;
		//取整值 当为正数向上取整，当为负数向下取整
		iSpeed=iSpeed>0 ? Math.ceil(iSpeed):Math.floor(iSpeed);
		if(now==old){
			clearInterval(obj.timer);
		}else{
			old+=iSpeed;
			obj.style.left=old+'px';
		}
		 
	},30);
}

mv.ui.fadeIn = function(obj) {
	var cur= mv.tools.getStyle(obj,'opacity');
	if(cur == 1){ return false; }
	var val = 0;
	clearInterval(obj.timer);
	obj.timer = setInterval(function() {
		var iSpeed = 5;
		if(val == 100) {
			clearInterval(obj.timer)
		} else {
			val += iSpeed;
			obj.style.opacity = val / 100;
			obj.style.filter = 'alpha(opacity=' + val + ')';
		}
	}, 30)
}
mv.ui.fadeOut = function(obj) {
	var cur= mv.tools.getStyle(obj,'opacity');
	if(cur == 0){ return false; }
	
	var val = 100;
	clearInterval(obj.timer);
	obj.timer = setInterval(function() {
		var iSpeed = -5;
		if(val == 0) {
			clearInterval(obj.timer)
		} else {
			val += iSpeed;
			obj.style.opacity = val / 100;
			obj.style.filter = 'alpha(opacity=' + val + ')';
		}
	}, 30)
}

mv.app = {};

//显示隐藏下拉列表
mv.app.toSel=function(){
	var oSel=document.getElementById('sel1');
	var aDd= oSel.getElementsByTagName('dd');
	var aUl= oSel.getElementsByTagName('ul');
	var aH= oSel.getElementsByTagName('h2');
	
	for(var i=0;i<aDd.length;i++){
		aDd[i].index=i;
		aDd[i].onclick=function(ev){
			var ev=ev||window.event;
			var This=this;
			for(var i=0;i<aUl.length;i++){
				aUl[i].style.display='none';
			}
			aUl[this.index].style.display='block';
			document.onclick=function(){
				aUl[This.index].style.display='none';
			}
			ev.cancelBubble = true;
		}
	}
	
	//设置下拉列表点击事件
	for(var i=0;i<aUl.length;i++){
		aUl[i].index=i;
		(function(oUl){
		  var aLi = oUl.getElementsByTagName('li');
		  for (var i=0;i<aLi.length;i++) {
		  	aLi[i].onmousemove=function(){
		  		this.className='active';
		  	}
		  	aLi[i].onmouseout=function(){
		  		this.className='';
		  	}
		  	aLi[i].onclick=function(ev){
		  		var ev = ev || window.event;
		  		aH[this.parentNode.index].innerText= this.innerText;
		  		ev.cancelBubble = true;
		  		this.parentNode.style.display='none';
		  	}
		  }
		})(aUl[i]);
		
	}
	
}

//底部滚动页


//文本框移入移出效果
mv.app.toTip = function() {
	var oTx1 = document.getElementById("text1");
	var oTx2 = document.getElementById("text2");

	mv.ui.textChange(oTx1, 'web Search1');
	mv.ui.textChange(oTx2, 'web Search2');
}
//广告切换
mv.app.toBanner = function() {
	var oAd = document.getElementById('ad');
	var aLi = oAd.getElementsByTagName('li');
	
	var oPrevBg = mv.tools.getByClass(oAd,'prev_bg')[0];
	var oNextBg = mv.tools.getByClass(oAd,'next_bg')[0];
	 
	var oPrev = mv.tools.getByClass(oAd,'prev')[0];
	var oNext = mv.tools.getByClass(oAd,'next')[0];
	
	var iNow = 0;
	var timer= setInterval(auto, 3000);
	function auto() {
		if(iNow == aLi.length - 1) {
			iNow = 0;
		} else {
			iNow++;
		}
		for(var i = 0; i < aLi.length; i++) {
			mv.ui.fadeOut(aLi[i]);
		}
		mv.ui.fadeIn(aLi[iNow]);
	}
	function autoPrev(){
		console.log('in'+iNow);
		if(iNow == 0){
			iNow=aLi.length-1;
		}else{
			iNow--;
		}
		for(var i=0;i<aLi.length;i++){
			mv.ui.fadeOut(aLi[i]);
		}
		mv.ui.fadeIn(aLi[iNow]);
	}
	
	oPrevBg.onmouseover=oPrev.onmouseover=function(){
		oPrev.style.display='block';
		clearInterval(timer);
		
	}
	oNextBg.onmouseover=oNext.onmouseover=function(){
		oNext.style.display='block';
		clearInterval(timer);
		
	}
	oPrevBg.onmouseout=oPrev.onmouseout=function(){
		oPrev.style.display='none';
		timer= setInterval(auto, 3000);
		
	}
	oNextBg.onmouseout=oNext.onmouseout=function(){
		oNext.style.display='none';
	    timer= setInterval(auto, 3000);
	}
	oPrev.onclick=function(){
		autoPrev();
	}
	oNext.onclick=function(){
		auto();
	}
}
//无缝切换
mv.app.run=function(){
	
	var oRun= document.getElementById('run1');
	var oUl=oRun.getElementsByTagName('ul')[0];
	var aLi=oRun.getElementsByTagName('li');
	
	var prev=mv.tools.getByClass(oRun,'prev')[0];
	var next=mv.tools.getByClass(oRun,'next')[0];
	
	var iNow=0;
	oUl.innerHTML+=oUl.innerHTML;
	oUl.style.width=aLi.length*aLi[0].offsetWidth+'px';
	
	prev.onclick=function(){
		if(iNow==0){
			iNow=aLi.length/2;
			oUl.style.left=-oUl.offsetWidth/2+'px';
		}
		mv.ui.moveLeft(oUl,-iNow*aLi[0].offsetWidth,
		-(iNow-1)*aLi[0].offsetWidth);
		iNow--;
	}
	
	next.onclick=function(){
		if(iNow==aLi.length/2){
			iNow=0;
			oUl.style.left=0;
		}
		mv.ui.moveLeft(oUl,-iNow*aLi[0].offsetWidth,
			-(iNow+1)*aLi[0].offsetWidth);
	 	iNow++;
	}
}
