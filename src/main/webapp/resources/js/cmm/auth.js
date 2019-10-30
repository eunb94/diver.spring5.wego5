"use strict";
var auth = auth || {}
auth = (()=>{
	const WHEN_ERR = '호출하는 JS 파일을 찾지 못했습니다.'
	    let _, js, css, img, auth_vue_js, brd_js, router_js, cookie_js
	    let init = ()=>{
	         _= $.ctx()
	         js = $.js()
	         css = $.css()
	         img = $.img()
	        auth_vue_js = js+'/vue/auth_vue.js'
	        brd_js = js+'/brd/brd.js'
	        router_js = js + '/cmm/router.js'
	        cookie_js = js + '/cmm/cookie.js'
	    }

	    let onCreate =()=>{
	        init()
	        $.when(
				$.getScript(auth_vue_js),
				$.getScript(router_js),
				$.getScript(brd_js),
				$.getScript(cookie_js)
			)		
	        .done(()=>{
	        	setContentView()
	    		$('#a_go_join').click(e=>{
	         		e.preventDefault()
	         		$('head').html(auth_vue.join_head())
			        $('body').html(auth_vue.join_body())
			        $('#uid').keyup(()=>{
			        	if($('#uid').val().length > 2){
			        		$.ajax({
			        			url : _+'/users/'+$('#uid').val()+'/exist',
			        	    	contentType : 'application/json',
			        	    	success : d => {
			        	    		alert('AJAX 성공 : '+d.msg)
			        	    		if(d.msg === 'SUCCESS')
			        	    			$('#dupl_check')
			        	    			.val('사용가능한 ID 입니다')
			        	    			.css('color','blue')
			            			else
			            				$('#dupl_check')
			        	    			.val('이미 사용한 ID 입니다')
			        	    			.css('color','red')
			        	    		
			        	    	},
			        	    	error : e => {
			        	    		alert('AJAX 실패')
			        	    	}
			        		})
			        	}
			        });
			        $('<button>',{
			            text : '회원가입',
			            href : '#',
			            click : e=>{
			            	e.preventDefault()
			            	join()
			            }
			        })
			        .addClass('btn btn-primary btn-lg btn-block')
			        .appendTo('#btn_join')
	    		})
	        }).fail(()=>{alert(WHEN_ERR)})
	    }
    let setContentView =()=>{
    	$('head').html(auth_vue.login_head({css: $.css(), img: $.img()}))
        $('body').addClass('text-center')
        .html(auth_vue.login_body({css: $.css(), img: $.img()}))
        $('#uid').val('aa'),
        $('#pwd').val('aa')
    	 login()
    }

    let join =()=>{
    	 let data = {uid:$('#uid').val(),pwd:$('#pwd').val(),uname:$('#uname').val()}
        $.ajax({
	    	url : _+'/users/',
	    	type : 'POST',
	    	dataType : 'json',
	    	data : JSON.stringify(data),
	    	contentType : 'application/json',
	    	success : d => {
	    		alert('AJAX 성공 아이디: '+ $('#uid').val())
	    			if(d.msg === 'SUCCESS'){
	    				$('head').html(auth_vue.login_head({css: $.css(), img: $.img()}))
	    		        $('body').addClass('text-center')
	    		        .html(auth_vue.login_body({css: $.css(), img: $.img()}))
	    				login()
	    			}else
	    				alert('회원가입 실패')
	    	},
	    	error : e => {

	    		alert('AJAX 실패');
	    	}
    	})
    }

    let login =()=>{
        $('<button>',{
            text : "로그인",
            click : e => {
                e.preventDefault()
                 $.ajax({
                   url : _+'/users/'+$('#uid').val(),
                   type : 'POST',
                   data : JSON.stringify({uid : $('#uid').val(), pwd : $('#pwd').val()}),
                   dataType : 'json',
                   contentType : 'application/json',
                   success: d =>{
                       //$.extend(new User(d))
                        //brd.onCreate({_:_, js:js, css:css, img:img})
                	   setCookie("USERID", d.uid)
                	   alert('저장된 쿠키 : '+getCookie("USERID"))
                	   brd.onCreate()
                  },
                   error : e => {
                     alert('Loign AJAX 실패');
                   }
                 })    
            }
        })
        .addClass("btn btn-lg btn-primary btn-block")
        .appendTo('#btn_login')
    }
    let mypage =(d)=>{
    	let x = {
    			uid : d.uid,
                pwd : d.pwd,
                uname : d.uname,              
    	}
    	$('head').html(auth_vue.mypage_head(x))
        $('body').html(auth_vue.mypage_body(x))
    }

    let existId = x=>{
    	$.ajax({
    		url : _+'/users/'+x+'/exist',
	    	type : 'GET',
	    	contentType : 'application/json',
	    	success : d => {
	    			if(d.msg === 'SUCCESS'){
	    				alert('가입 가능 아이디 입니다.')
	    				join()
	    			}else{
	    				alert('이미 존재하는 아이디 입니다.')
    				}
	    	}
    	})
    }

    let brd_home = ()=>{
    	$.getScript(brd_vue_js).done(()=>{
    		$('head').html(brd_vue.brd_head())
        	$('body')
        	.addClass('text-center')
        	.html(brd_vue.brd_body())	
    	})
    }
    return {onCreate, join, login, brd_home}

})();