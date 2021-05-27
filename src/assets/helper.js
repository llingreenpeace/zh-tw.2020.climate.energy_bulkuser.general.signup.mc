import { line_QR_code } from './utm_source_dd.js';
import AOS from "aos";
var $ = require("jquery");
import 'slick-carousel';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

/**
 * Send the tracking event to the ga
 * @param  {string} eventLabel The ga trakcing name, normally it will be the short campaign name. ex 2019-plastic_retailer
 * @param  {[type]} eventValue Could be empty
 * @return {[type]}            [description]
 */
export const sendPetitionTracking = (eventLabel, eventValue) => {
	window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
        'event': 'gaEvent',
        'eventCategory': 'petitions',
        'eventAction': 'signup',
        'eventLabel': eventLabel,
        'eventValue' : eventValue
    });

    window.dataLayer.push({
        'event': 'fbqEvent',
        'contentName': eventLabel,
        'contentCategory': 'Petition Signup'
    });
}

/**
 * Retrieve the form POST URL
 * @return {string} URL
 */
export const getPostURL = () => {
	return document.querySelector("#mc-form").action
}

/**
 * Display the full loading screen
 *
 * Remember to add the following style to your page:
 */
export const showFullPageLoading = () => {
	if ( !document.querySelector("#page-loading")) {
		document.querySelector("body").insertAdjacentHTML('beforeend', `
			<div id="page-loading" class="hide">
			  <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
			</div>`);
	}

	setTimeout(() => { // to enable the transition
		document.querySelector("#page-loading").classList.remove("hide")
	}, 0)
}

/**
 * Hide the full page loading
 */
export const hideFullPageLoading = () => {
	document.querySelector("#page-loading").classList.add("hide")

	setTimeout(() => {
		document.querySelector("#page-loading").remove()
	}, 1100)
}

function initSwiper() {
    if (document.body.clientWidth <= 800) {    
        
        $(".swiper-wrapper").slick({        
            dots: false,
            autoplay: true,
            arrows: false,
            centerMode: true,
            mobileFirst: true,
            infinite: false,
        });  
        
        $(".process-carousel").slick({        
            dots: true,
            autoplay: false,
            arrows: false,
            centerMode: true,
            mobileFirst: true,
            infinite: false,
        });
    }
    else {
        $(".swiper-wrapper").slick({
            dots: true,
            autoplay: true,
            arrows: false,            
        });    
    }
}

function initProgressBar() {
    var numSignupTarget = document.querySelector('input[name="numSignupTarget"]') ? parseInt(document.querySelector('input[name="numSignupTarget"]').value, 10) : 0;
	var numResponses = document.querySelector('input[name="numResponses"]') ? parseInt(document.querySelector('input[name="numResponses"]').value, 10) : 0;
	//console.log('numSignupTarget1:',numSignupTarget);
	if (numResponses < 2498)
		numResponses = 2499;
	if (isNaN(numSignupTarget) || numSignupTarget < 20000)
		numSignupTarget = 20000;
    if (numResponses > numSignupTarget)
		numSignupTarget = Math.ceil(numResponses / 10000) * 10000;		

	$(".progress-target").text(numSignupTarget.toLocaleString())
    $(".progress-number").text(numResponses.toLocaleString())
    
    const ProgressBar = require('progressbar.js');
    let percent = numResponses / numSignupTarget;
    let bar = new ProgressBar.Line('#progress-bar', {
        strokeWidth: 3,
        easing: 'easeInOut',
        duration: 1000,
        color: '#b5ddac',
        trailColor: '#eee',
        trailWidth: 1,
        svgStyle: {width: '100%', height: '100%'}
    });
    // console.log(percent)
    bar.animate(percent);
}

function initForm() {
    // create birthYear options
    let currYear = new Date().getFullYear()
    $("#birthYear").append(`<option value="">選擇年份</option>`);
    for (var i = 0; i < 100; i++) {
        let option = `<option value="${currYear-i}-01-01">${currYear-i}</option>`;
        $("#birthYear").append(option);
    }

    // validation
    require('jquery-validation');
    $.validator.messages.required = "必填欄位";

    $.validator.addMethod('validate-name',
        (value) => {
            return new RegExp(/^[\u4e00-\u9fa5_a-zA-Z_ ]{1,40}$/i).test(value);
        },
        '請不要輸入數字或符號'
    );

    //override email with django email validator regex - fringe cases: "user@admin.state.in..us" or "name@website.a"
    $.validator.addMethod('email',
        (value) => {
            if (value) {
                return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/i.test(value);
            }

            return true
        },
        'Email 格式錯誤'
    );

    $.validator.addMethod( "taiwan-phone",
        (value) => {
            const phoneReg6 = new RegExp(/^(0|886|\+886)?(9\d{8})$/).test(value);
            const phoneReg7 = new RegExp(/^(0|886|\+886){1}[3-8]-?\d{6,8}$/).test(value);
            const phoneReg8 = new RegExp(/^(0|886|\+886){1}[2]-?\d{8}$/).test(value);

            if (value) {
                return (phoneReg6 || phoneReg7 || phoneReg8)
            }
            return true
        },
        "電話格式不正確，請只輸入數字 0912345678 或 02-23456789"
    )

    $.validator.addClassRules({ // connect it to a css class
        "email": {email: true},
        "taiwan-phone" : { "taiwan-phone" : true }
    });

    $("#view-form").validate({
		submitHandler: function() {
            showFullPageLoading();

            // mc forms
            $('#mc-form [name="FirstName"]').val($('#firstName').val());
            $('#mc-form [name="LastName"]').val($('#lastName').val());
            $('#mc-form [name="Email"]').val($('#email').val());

            if (!$('#phone').prop('required') && !$('#phone').val()) {
                $('#mc-form [name="MobilePhone"]').val('0900000000');
            } else {
                $('#mc-form [name="MobilePhone"]').val($('#phone').val());
            }
            $('#mc-form [name="Birthdate"]').val($('#birthYear').val());			
            $('#mc-form [name="OptIn"]').eq(0).prop("checked", $('#optin').prop('checked')); 
            
            // collect values in the mc form
            let formData = new FormData();
            $("#mc-form input").each(function (idx, el) {
                let v = null
                if (el.type==="checkbox") {
                    v = el.checked
                } else {
                    v = el.value
                }

                formData.append(el.name, v)
                //console.log("Use", el.name, v)
            });
            /*
            //假裝送出成功
            $("#landing-page").hide();
            $("#thank-you-page").css("display","flex");
            $("header").hide();
            $('html, body').scrollTop(0);
            hideFullPageLoading();
            */
            
            // send the request			
            let postUrl = getPostURL(); //$("#mc-form").prop("action");
            
            fetch(postUrl, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(response => {				
                if (response) {					
                    if (response.Supporter) { // ok, go to next page
                        sendPetitionTracking("2020-climate_energy_bulkuser");
                    }
                    $("#landing-page").hide();
                    $("#thank-you-page").css("display","flex");
                    $("header").hide();
                    $('html, body').scrollTop(0);
                } else {
                    //showSubmittedError();
                    console.error('error');
                }
                hideFullPageLoading();
            })
            .catch(error => {
                hideFullPageLoading();
                //showSubmittedError();
                console.error(error);
            });
        }
    });
}

/**
 * email suggestion / email correction
 */
function checkEmail() {    
	let domains = [
		"me.com",
		"outlook.com",
		"netvigator.com",
		"cloud.com",
		"live.hk",
		"msn.com",
		"gmail.com",
		"hotmail.com",
		"ymail.com",
		"yahoo.com",
		"yahoo.com.tw",
		"yahoo.com.hk"
	];
	let topLevelDomains = ["com", "net", "org"];

	var Mailcheck = require('mailcheck');
	$("#email").on('blur', function() {
		Mailcheck.run({
			email: $("#email").val(),
			domains: domains, // optional
			topLevelDomains: topLevelDomains, // optional
			suggested: (suggestion) => {                
                $('#email-div .error').remove();
                $('#email-div .email-suggestion').remove();
                $(`<div class="email-suggestion">您想輸入的是 <strong id="emailSuggestion">${suggestion.full}</strong> 嗎？</div>`).insertAfter("#email");
                
                $(".email-suggestion").click(function() {
                    $("#email").val($('#emailSuggestion').html());
                    $('.email-suggestion').remove();
                });
			},
			empty: () => {
				this.emailSuggestion = null
			}
		});
	});
}

$( document ).ready(function() {        
    initProgressBar();
    initForm();
    checkEmail();
    initSwiper();
    AOS.init();
    line_QR_code('line_block');

    $('.mobile-arrow').on( "click", function() {
        //console.log(this.parentNode.getAttribute('data-target'));         
        $('html, body').animate({
            scrollTop: $("#section-" + this.parentNode.getAttribute('data-target')).offset().top
        }, 1000);
    });    
    
    $('.sign-up-btn').on( "click", function() {     
        $('html, body').animate({
            scrollTop: $("#section-2").offset().top
        }, 1000);
    });

    $('.donate-btn').on( "click", function() {     
        window.open('https://supporter.ea.greenpeace.org/tw/s/donate?campaign=climate&ref=2020-climate_energy_bulkuser_thankyoupage_donation_btn', '_blank');
    });
});