/**
 * We provide two helper class to quickly switch the block show/hide
 * in the dd page: `is-hidden-at-dd-page-only`, `is-shown-at-dd-page-only`
 *
 * This function use the current url to distinguish the dd page.
 * The dd page should have url like this: xxx?utm_source=dd
 */
(() => {
	if (window.location.href.indexOf("utm_source=dd") >= 0) {
		let style = document.createElement('style');
		style.innerHTML =
			`.is-hidden-at-dd-page-only {
				display: none !important;
			}
			.is-shown-at-dd-page-only {
				display: block !important;
			}`
		;
		document.head.appendChild(style);		        	
	} else { // not in the dd page
		let style = document.createElement('style');
		style.innerHTML =
			`
			.is-shown-at-dd-page-only {
				display: none !important;
			}`
		;
		document.head.appendChild(style);
	}
})();

export const phone_required = (elementId) => {
	if (window.location.href.indexOf("utm_source=dd") >= 0) {
		let line_block_id = elementId;
		if (line_block_id.indexOf('#') < 0) {
			line_block_id = '#' + line_block_id;
		}
		document.querySelector(line_block_id).removeAttribute("required"); // remove required Attr from MobilePhone field
	}
}

export const line_QR_code = (elementId) => {		
	console.log('line_QR_code');
	if (window.location.href.indexOf("utm_source=dd") >= 0) {		
		let line_block_id = elementId;
		console.log(elementId);
		if (line_block_id.indexOf('#') < 0) {
			line_block_id = '#' + line_block_id;
		}		

		document.querySelector(line_block_id).innerHTML =
			`<div class="line-div is-show-at-dd-page-only" style="text-align: center; margin: 1.5rem 0;">				
				<div class="line-tp">
					<a href='http://act.gp/GPLINE_tp' target='_blank' style='color: #00c300; text-decoration: none;'>加入我們的 LINE 好友<br>
					<img src="https://change.greenpeace.org.tw/2021/petition/example/images/act.gp_GPLINE_tp.png" style="width:100%; max-width:256px;" /></a>
				</div>
				<div class="line-tc">
					<a href='http://act.gp/GPLINE_tc' target='_blank' style='color: #00c300; text-decoration: none;'>加入我們的 LINE 好友<br>
					<img src="https://change.greenpeace.org.tw/2021/petition/example/images/act.gp_GPLINE_tc.png" style="width:100%; max-width:256px;" /></a>
				</div>
				<div class="line-ks">
					<a href='http://act.gp/GPLINE_ks' target='_blank' style='color: #00c300; text-decoration: none;'>加入我們的 LINE 好友<br>
					<img src="https://change.greenpeace.org.tw/2021/petition/example/images/act.gp_GPLINE_ks.png" style="width:100%; max-width:256px;" /></a>
				</div>
			</div>`;
		
		if (window.location.href.indexOf("utm_content=tp") >= 0) {
			document.querySelector('.line-tp').style.display = "block";
			document.querySelector('.line-tc').style.display = "none";
			document.querySelector('.line-ks').style.display = "none";
		} else if (window.location.href.indexOf("utm_content=tc")) {
			document.querySelector('.line-tp').style.display = "none";
			document.querySelector('.line-tc').style.display = "block";
			document.querySelector('.line-ks').style.display = "none";		
		} else {
			document.querySelector('.line-tp').style.display = "none";
			document.querySelector('.line-tc').style.display = "none";
			document.querySelector('.line-ks').style.display = "block";
		}
	}
}