/**
* jquery.quickPagerExt.ext.js v1.2
* Based on Quick Pager jquery plugin 1.1 by Dan Drayne & John V
* v1.2 Copyright (c) 2014 Tony Chung
*      https://github.com/codemaestro/simplepager
* After (c) 2011 Daniel Drayne and John V
*      https://github.com/dan0/simplepager
* jQuery lightweight plugin boilerplate by Adam J. Sontag, from Addy Osmani article 
*      http://www.smashingmagazine.com/2011/10/11/essential-jquery-plugin-patterns/
*
* Released under the MIT License (MIT)
*
**/

;(function ( $, window, document, undefined ) {
// usage: $('[item list selector]').covPager({pageSize: 10,pagerLocation: 'both'});

	var pluginName = 'quickPagerExt';
		var defaults = {
			pageSize: 5,
			currentPage: 1,
			pagerLocation: 'above',
			_top: 'above',
			_bottom: 'below',
			_both: 'both',
			holder: null,
			pageSelector: true,
			_selectorlabel: 'Paginate results',
			_selectoroptions: '5|10|20|30',
			_selectorall: 'Show all',
			prev: 'Previous',
			next: 'Next',
			_prev: 'prev',
			_next: 'next',
			_container: 'pageContainer',
			_pageselector: 'pageSelector',
			_pageoption: 'pageOption',
			_pagelist: 'pageList',
			_pagenumb: 'pageNumb',
			_pagecurr: 'pageCurr',
			_hidden: 'hidden'
		};

	// The actual plugin constructor
	function Plugin( element, options ) {
		this.element = element;
		this.options = $.extend( {}, defaults, options );
		// fix potential value issues
		if( this.options.pageSelector === 'yes' || this.options.pageSelector === 1 || this.options.pageSelector === true ) {
		// allows for boolean true, string yes, and integer 1
			this.options.pageSelector = true;
		}
		if(this.options.pageSize < 1) {
		// avoids issues with 0 items per page
			this.options.pageSize = 5;
		}
		this._defaults = defaults;
		this._name = pluginName;

		this.init();
	}

	Plugin.prototype = {
		init: function () {
			var $this = this,
				$opt = this.options,
				selector = $(this.element);
			selector.wrap('<div class="' + $opt._container + '"></div>');

			return this.paginate();
		},
		
		paginate: function() {
			var $this = this,
				$opt = this.options,
				selector = $(this.element),
				regex = eval('/' + $opt._pagenumb + '[\\d]+/g'),
				pageNav = null,
				pageSelect = null;
			
			// allow for 'Show all' as an option
			if(isNaN($opt.pageSize)){
				$opt.pageSize = selector.children().length;
			}
			
			// remove existing pagination
			selector.parents('.' + $opt._container).find('ul.' + $opt._pagelist).remove();
			selector.children().attr( 'class', function () {
				if(typeof($(this).attr('class')) !== 'undefined') {
					return $(this).attr('class').replace(regex,'');
				}
			});
			
			// paginate items
			var pageCounter = 1;
			selector.children().each( function(i) {
				if(i < pageCounter*$opt.pageSize && i >= (pageCounter-1)*$opt.pageSize) {
					$(this).addClass($opt._pagenumb + pageCounter);
				} else {
					$(this).addClass($opt._pagenumb + (pageCounter+1));
					pageCounter++;
				}
			});

			// show/hide appropriate regions
			selector.children().hide();
			selector.children('.' + $opt._pagenumb + $opt.currentPage).show();

			if(pageCounter > 1 ) {
				pageNav = $this.pageNavigation(selector, pageCounter);
			}

			if($opt.pageSelector === true) {
				pageSelect = $this.paginateSelect(selector);
			}

			var pageNavBar = $('<div>').append(pageSelect).append(pageNav);
			
			// test if this instance has a holder
			var $h = '';
			if($opt.holder) {
				$h = selector.parent('.'+$opt._container).siblings().children($opt.holder);
			}
			if($h.length > 0) {
				// clear pagination dropdown
				if(! $h.hasClass($opt._container) ) {
					$h.addClass($opt._container);
				}
				$h.empty().append(pageNavBar.children());
			} else {
				// clear pagination dropdown
				selector.parents('.'+$opt._container).find('.'+$opt._pageselector).remove();
			
				// add pagination
				switch($opt.pagerLocation)
				{
				// move default to where you want invalid assignments to go
				case $opt._top:
				default:
					selector.before(pageNavBar.children());
					break;
				case $opt._bottom:
					selector.after(pageNavBar.children());
					break;
				case $opt._both:
					pageNavBar2 = pageNavBar.clone(true);
					selector.before(pageNavBar.children());
					selector.after(pageNavBar2.children());
					break;
				}
			}
		},

		nextPrev: function(navlist) {
			var $opt = this.options,
				nav = [$opt._prev, $opt._next],
				rx = eval('/' + $opt._pagenumb + '\\d+/'),
				current = navlist.find('.' + $opt._pagecurr).attr('class').match(rx).toString();
			for( var i = 0; i<nav.length; i++ ) {
				// hide Prev is first, hide Next if last
				var test = navlist.find( '.' + nav[i]).attr('class').match(rx).toString();
				if( test === current ) {
					navlist.find('.' + nav[i]).addClass($opt._hidden)
				} else {
					navlist.find('.' + nav[i]).removeClass($opt._hidden);
				}
			}
			return false;
		},

		pageNavigation: function(items, pageCounter) {
			// pager navigation
			var $this = this,
				$opt = this.options,
				retObj = '<ul class="' + $opt._pagelist + '">';
				
			for (i=1;i<=pageCounter;i++){
				if (i === 1 ) {
					retObj += '<li class="' + $opt._prev + ' ' + $opt._pagenumb + i +'"><a rel="' + $opt._prev + '" href="#">' + $opt.prev + '</a></li>';
				}
				if (i==$opt.currentPage) {
					retObj += '<li class="' + $opt._pagecurr + ' ' + $opt._pagenumb + i + '"><a rel="'+i+'" href="#">' + i + '</a></li>';
				}
				else {
					retObj += '<li class="' + $opt._pagenumb + i + '"><a rel="' + i + '" href="#">' + i + '</a></li>';
				}
				if (i === pageCounter ) {
					retObj += '<li class="' + $opt._next + ' ' + $opt._pagenumb + i + '"><a rel="' + $opt._next + '" href="#">' + $opt.next + '</a></li>';
				}
			}
			retObj += "</ul>";
			retObj = $(retObj);
			$this.nextPrev(retObj);
		
			//pager navigation behaviour
			retObj.find('a').click(function(e) {
				e.preventDefault();
				var $n = $(this).parents('.' + $opt._container),
					$p;
				if( $(this).attr( 'rel' ) === $opt._next ) {
					$p = $n.find('.' + $opt._pagecurr).next().find('a');
					
				} else if ( $(this).attr( 'rel' ) === $opt._prev ) {
					$p = $n.find('.' + $opt._pagecurr).prev().find('a');
				} else {
					$p = $(this);
				}
				
				if( $p.attr('rel') === $opt._next || $p.attr('rel') === $opt._prev ) {
					$p = $n.find('.' + $opt._pagecurr).find('a');
				}
				
				//grab the REL attribute
				var clickedLink = $p.attr("rel");
				$opt.currentPage = clickedLink;

				$n.find('li.' + $opt._pagecurr).removeClass($opt._pagecurr);
				$n.find('a[rel="' + clickedLink + '"]').parent('li').addClass($opt._pagecurr);

				//hide and show relevant links
				items.children().hide();
				items.find('.'+$opt._pagenumb+clickedLink).show();
				$this.nextPrev($n);

				return false;
			});

			return retObj;			
		},

		paginateSelect: function(items) {
			// create dropdown page navigation selector
			var $opt = this.options;
			var pgOpt = $opt._selectoroptions.split('|'),
				pgDef = $opt.pageSize,
				retObj = $('<select name="'+$opt._pageoption+'">'),
				wrkObj = null,
				iSel = false;
			pgOpt.push($opt._selectorall);

			for(i=0; i<pgOpt.length; i++) {
				if(pgOpt[i]===$opt._selectorall || parseInt(pgOpt[i]) < items.children().length ) {
					wrkObj = $('<option>').attr('value',pgOpt[i]).text(pgOpt[i]);
					if(pgOpt[i].toString() === pgDef.toString() || (iSel === false && pgOpt[i] === $opt._selectorall)) {
						wrkObj.attr('selected','selected');
						iSel = true;
					}
					retObj.append(wrkObj);
				}
			}

			var $this = this; // store current context
			retObj.change(function(){
				// paginate items on change
				$opt.pageSize = this.value;
				$opt.currentPage = 1;
				$this.paginate($opt);
			});
			
			if(retObj.children().length > 1) {
				retObj = $('\r\n<div class="' + $opt._pageselector + '"><label>' + $opt._selectorlabel + ':</label></div>').append(retObj);
			} else {
				retObj = '';
			}

			return retObj;
		}
	}

	$.fn[pluginName] = function ( options ) {
		return this.each(function () {
			if (!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName,
				new Plugin( this, options ));
			}
		});
	}
})( jQuery, window, document );