$(document).ready(function (){
	/* gnb, lnb 네비게이션 */
	var $header = $('#header');
	var $gnb = $('#gnb');
	var gnbPosX;

	var dep1 = $('body').data('depth-one') - 1;
	var dep2 = $('body').data('depth-two') - 1;
	//console.log(dep1, dep2);

	//1) depth2 ul  모두 숨기고 시작
	$gnb.find('ul li ul').hide();

	$(window).on('resize',function(){
		var winWid = $(window).width();
		if(winWid < 1260-17){
			$("body").removeClass().addClass("mobile");
			if (winWid <= 560) gnbPosX = winWid - 280;
			else gnbPosX = '50%';
		} else {
			$("body").removeClass().addClass("pc");
			$gnb.removeClass('mgnb').removeAttr('style');
			$gnb.find('> ul > li.on').removeClass("on").find('ul').removeAttr('style').hide();
			if ($('.btn_all').hasClass('close')) { //모바일에서 닫기를 누르지 않고 창크기를 키우면...
				$('.btn_all, #dim').removeAttr('style');
				$('.btn_all').addClass('open').removeClass('on close').attr('aria-label', '전체메뉴 열기');
			}
		}
	});
	$(window).trigger('resize');
	
	//인덱스를 제외한 서브페이지일 경우라면
	if (dep1 >= 0) {
		var $depth1 = $gnb.find('> ul > li').eq(dep1).find('>a');
		var $depth2 = $gnb.find('> ul > li').eq(dep1).find('ul li').eq(dep2).find('a');

		var dep1Txt = $depth1.text();
		var dep1Href = $depth1.attr('href');
		var dep2Txt = $depth2.text();
		var dep2Href = $depth2.attr('href');
		var dep2Clone = $depth1.next().clone();

		//.top_visual 내부의 텍스트 출력
		$('.top_visual .tit_box .location .dep1txt').text(dep1Txt).next().text(dep2Txt).parent().next().text(dep1Txt);

		//snb 네비게이션 처리
		$('#snb .area .dep1 > a span').text(dep1Txt);	//data-depth-one="5" 텍스트 출력
		$('#snb .area .dep2 > a span').text(dep2Txt);	//data-depth-two="1"
		$('#snb .area .dep2').append(dep2Clone);
		$('#snb .area div ul').hide();			//depth2 ul 숨기기 - 동적생성후 숨기자

		$('#snb .area .dep > a').on('click', function () {
			$(this).toggleClass('rotate').next().stop().slideToggle();

			return false;
		});
		//console.log($depth1, $depth2, dep1Txt, dep1Href, dep2Txt, dep2Href);
	}

	//2)depth1 li에 마우스, 포커스 진입 - dep1 li로 처리 li.on도 필요하므로
	$gnb.find('> ul > li').on('mouseenter focusin',function  () {
		//1260초과시 PC일 경우라면
		if ($('body').hasClass('pc')) {
			$header.addClass('active');
			$gnb.find('ul li ul').show();
			$(this).addClass('on').siblings().removeClass('on');
		}
	});

	//효율적인 떠나기 : 마우스(ul에서 나갈때 한번만 체크), 포커스(첫번째와 마지막 a만 체크)
	//3-1)depth1 ul에 마우스 떠나기
	$gnb.find('> ul').on('mouseleave', function () {
		//1260초과시 PC일 경우라면
		if ($('body').hasClass('pc')) {
			gnbReturn();
		}
	});

	//3-2)첫번째와 마지막 a 에서 포커스가 떠나기
	$gnb.find('a:first, a:last').on('blur',function  () {
		if ($('body').hasClass('pc')) {
			setTimeout(function  () {
				if (!$gnb.find('a').is(':focus')) gnbReturn();
			},10);
		}
	});

	function gnbReturn () {
		//열려진 컨텐츠 초기화, li.on 제거, 열려진 depth2 ul 닫기
		$header.removeClass('active');
		$gnb.find('ul li ul').stop().delay(200).slideUp();
		$gnb.find('> ul > li.on').removeClass('on');
	}

	//모바일에서 전체 메뉴 버튼을 클릭 : 열기 or 닫기
	$header.find('.btn_all').on('click', function () {
		if ( $(this).hasClass('open') ) {		//현재 닫겨진 상태 -> 클릭하면 gnb 열린다
			$gnb.addClass('mgnb');
			$(this).addClass('on close').removeClass('open').attr('aria-label', '전체메뉴 닫기');
			$(this).next().show().stop().animate({left: gnbPosX}, 250);
			$('#dim').stop().fadeIn();
		}else if ( $(this).hasClass('close') ) {//현재 열려진 상태 -> 클릭하면 gnb 다시 닫긴다
			$gnb.removeClass('mgnb');
			$(this).addClass('open').removeClass('on close').attr('aria-label', '전체메뉴 열기');
			$(this).next().stop().animate({left: '100%'}, 250, function () {
				$(this).hide().find('> ul > li.on').removeClass('on').find('ul').hide();
				//$(this).hide();
			});
			$('#dim').stop().fadeOut();
		}
	});

	//모바일에서 depth1 a를 클릭하는 경우
	$gnb.find('> ul > li > a').on('click', function () {
		if ( $('body').hasClass('mobile') ) {
			$(this).next().stop().slideToggle();
			$(this).parent().addClass('on').siblings().removeClass('on').find('ul').stop().slideUp();
			console.log('mobile');
			return false;
		}
	});

	//모바일에서 #gnb 네비게이션이 열려진 경우 탭을 이용해 dimed 된 영역으로 포커스 이동을 제한
	$(document).on('keydown', '.close', function (e) {
		if (e.shiftKey && e.keyCode == 9) {
			e.preventDefault();   //★ 기본 기능을 먼저 제한하고 포커스 강제 이동시키기
			$('.gnb5 > a').focus();
		}
	});
	$gnb.find('[data-link="last"]').on('blur', function (e) {
		if ( $('body').hasClass('mobile') ) {
			setTimeout(function () {
				if ( !$gnb.find('a').is(':focus') ) $('.btn_all').focus();
			}, 10);
		}
	});


	/* 언어 선택 */
	$('#header .language a').hide();
	$('#header .language button').on('click', function () {
		$(this).next().show();

		$('#header .language').on('mouseleave', function () {
			$(this).find('a').hide();
		});
	});

	/* scroll시 상단 헤더 fixed - 배경색 및 텍스트 색상 변경 */
	$(window).on('scroll', function () {
		if ($(this).scrollTop() > 50) $header.addClass('scroll');
		else $header.removeClass('scroll');
	});

	/* top 이동 버튼 클릭 */
	$('.btn_top').on('click', function () {
		$('html, body').stop().animate({scrollTop: 0});
	});
});