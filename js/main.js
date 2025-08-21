/* Makes jQuery accessible via $ using function escope because tray load another lib which creates conflict with jQuery $ */
(function($){

    Number.prototype.formatMoney = function(precision = 2, decimal = '.', thousands = ',', withCurrency = false) {

        const placeholderRegex = /{{\s*(\w+)\s*}}/;
        const format           = 'R$ {{amount}}';

        let number = this.toFixed(precision);

        let parts         = number.split('.');
        let dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, `$1${thousands}`);
        let centsAmount   = parts[1] ? decimal + parts[1] : '';
        let value         = dollarsAmount + centsAmount;

        return (withCurrency) ? format.replace(placeholderRegex, value) : value;
 
    };

    window.theme = {

        ...window.theme,

        settings :{
            lastScrollPosition        : 0,
            storeId                   : 0,
            lineInfo                  : null,
            productVariantsQuantities : null,
            productThumbs             : null,
            productGallery            : null
        },

        /* General */

        recoveryStoreId: function(){
            this.settings.storeId = $('html').data('store');
        },

        resets: function(){

            /* Advanced search page */
            $('.page-search #Vitrine input[type="image"]').after('<button type="submit" class="botao-commerce">BUSCAR</button>')
            $('.page-search #Vitrine input[type="image"]').remove();
            $('.advancedSearchFormBTimg').addClass('botao-commerce');

            $('.page-central_senha input[type="image"]').after('<button type="submit" class="botao-commerce">CONTINUAR</button>').remove();
            $('.caixa-cadastro #email_cadastro').attr('placeholder', 'Seu e-mail');

            $('#imagem[src*="filtrar.gif"]').after('<button type="submit" class="botao-commerce">Filtrar</button>');
            $('#imagem[src*="filtrar.gif"]').remove();

            $('input[src*="gerarordem.png"]').after('<button type="submit" class="botao-commerce">Gerar ordem de devolu&ccedil;&atilde;o</button>');
            $('input[src*="gerarordem.png"]').remove();

        },

        initMasks: function(){

            let phoneMaskBehavior = function (val) {
                return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
            };

            let phoneMaskOptions = {
                onKeyPress: function(val, e, field, options) {
                    field.mask(phoneMaskBehavior.apply({}, arguments), options);
                }
            };

            $('.phone-mask').mask(phoneMaskBehavior, phoneMaskOptions);

            $('.zip-code-mask').mask('00000-000');

        },

        initLazyload: function(selector = '.lazyload'){
            new LazyLoad({
                elements_selector: selector
            });
        },

        getLoader: function(message = null){
            return `
                <div class="loader show">
                    <div class="spinner">
                        <div class="double-bounce-one"></div>
                        <div class="double-bounce-two"></div>
                    </div>
                    ${ message ? `<div class="message">${message}</div>` : ''}
                </div>`;
        },

        scrollToElement: function (target, adjust = 0) {
            if(target && target !== "#"){

                $("html,body").animate({
                    scrollTop : Math.round($(target).offset().top) - adjust
                }, 600);

            }
        },

        overlay: function(){

            $('[data-toggle="overlay-shadow"]').on('click', function () {

                let target = $($(this).data('target'));
                target.addClass('show').attr('data-overlay-shadow-target', '');

                $('.overlay-shadow').addClass('show');
                $('body').addClass('overflowed');

            });

            $('.overlay-shadow').on('click', function(){
                $('[data-overlay-shadow-target]').removeClass('show').removeAttr('data-overlay-shadow-target');
                $('.overlay-shadow').removeClass('show');
                $('body').removeClass('overflowed');
            });

            $('.close-overlay').on('click', function(){
                $('.overlay-shadow').trigger('click');
            });

        },

        overlayIsVisible: function(){
            return $('.overlay-shadow').hasClass('show');
        },

        toggleModalTheme: function(){

            $('body').on('click', '[data-toggle="modal-theme"]', function(){
                $($(this).data('target')).addClass('show');
            });

            $('.modal-theme:not(.no-action) .modal-shadow, .modal-theme:not(.no-action) .close-icon').on('click', function(){
                $('.modal-theme').removeClass('show');
            });

        },

        shippingTracking: function(){
            $('.tracking .tracking-action input').on('keyup', function () {

                let form = $(this).parent();
                let code = $(this).val();
                let link = form.data('action');

                if(code !== ''){

                    link = link.replace('{query}', $(this).val());
                    form.attr('action', link);

                } else {
                    form.attr('action', '');
                }

            });
        },

        generateBreadcrumb: function(local = ''){

            let items;
            let breadcrumb = '';
            let pageName   = document.title.split(' - ')[0];

            if(local == 'news-page'){
                items = [
                    { text: 'Home',            link: '/'         },
                    { text: 'Not&iacute;cias', link: '/noticias' },
                    { text: pageName }
                ];
            } else {
                items = [
                    { text: 'Home',  link: '/' },
                    { text: pageName }
                ];
            }

            $.each(items, function (index, item){
                if(this.link){

                    breadcrumb += `
                        <li class="breadcrumb-item flex align-center" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                            <a itemprop="item" class="t-color" href="${ item.link }">
                                <span itemprop="name">${ item.text }</span>
                            </a>
                            <meta itemprop="position" content="${ index + 1 }" />
                        </li>   
                    `;

                } else {

                    breadcrumb += `
                        <li class="breadcrumb-item flex align-center" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                            <span itemprop="name">${ item.text }</span>
                            <meta itemprop="position" content="${ index + 1 }" />
                        </li>          
                    `;

                }
            });

            $('.page-content > .container').prepend(`
                <ol class="breadcrumb flex f-wrap" itemscope itemtype="https://schema.org/BreadcrumbList">
                    ${breadcrumb}
                </ol>
            `);

        },

        processRteElements: function(){

            $(`.col-panel .tablePage, 
               .page-extra .page-content table, 
               .page-extras .page-content table, 
               .board_htm table,
               .rte table,
               .page-noticia table
            `).wrap('<div class="table-overflow"></div>');

            $(`.page-noticia iframe[src*="youtube.com/embed"], 
               .page-noticia iframe[src*="player.vimeo"],
               .board_htm iframe[src*="youtube.com/embed"],
               .board_htm iframe[src*="player.vimeo"],
               .rte iframe[src*="youtube.com/embed"],
               .rte iframe[src*="player.vimeo"]
            `).wrap('<div class="rte-video-wrapper"></div>');

        },
 
        loadThemeVersion: function(){            

            const themeVersion = Cookies.get('theme-version');
            const localPath = $('.local-path').attr('data-path');

            if(themeVersion){
                $('html').attr('data-theme-version', themeVersion);
                return;
            }

            $.getJSON(localPath + `js/version.json?t=${Date.now()}`, function(data){
                Cookies.set('theme-version', data.version, { expires: 7 });
                $('html').attr('data-theme-version', data.version);
            });

        },

        /* Scroll behavior */

        setCorrectHeaderDesk: function(){

            let internal     = this;
            let deltaOne     = 32;
            let deltaTwo     = 152;
            let header       = $('.header');
            let nav          = $('.header .nav');
            let navbarHeight = $('.header').outerHeight() * 2;
            let position     = $(window).scrollTop();

            (position > deltaOne) ? header.addClass('hide-top-bar') : header.removeClass('hide-top-bar');
            (position > deltaTwo) ? header.addClass('fixed')        : header.removeClass('fixed');

            if(position > internal.settings.lastScrollPosition || position <= navbarHeight){
                nav.removeClass('show-nav');
            }
            else if(position > navbarHeight) {
                nav.addClass('show-nav');
            }

            internal.settings.lastScrollPosition = position;

        },

        setCorrectHeaderMobile: function(){

            let header       = $('.header');
            let headerMobile = $('.header-mobile');
            let headerHeight = $('.header').outerHeight() + 20;
            let position     = $(window).scrollTop() - 20;

            if(position > headerHeight){
                headerMobile.addClass('show');
                header.addClass('not-visible');
            } else {
                headerMobile.removeClass('show');
                header.removeClass('not-visible');
            }

        },

        scrollHeader: function () {

            let internal = this;

            if($(window).width() >= 768){
                this.setCorrectHeaderDesk();
            } else {
                this.setCorrectHeaderMobile();
            }

            $(window).on('scroll', function(){

                if($(window).width() >= 768){
                    internal.setCorrectHeaderDesk();
                } else {
                    internal.setCorrectHeaderMobile();
                }

            });

        },


        /* Main menu */

        fixSubcategoriesHeight: function(){

            let topContent   = $('.header').height();
            let windowHeight = $(window).height();
            let extraMargin  = 30;

            $('.nav .list > .first-level.sub .sub-categories-wrapper').css('max-height', windowHeight - topContent - extraMargin);

        },

        fixSubcategoriesWidth: function(){
            $('.nav .list > .first-level.sub .sub-categories-wrapper').each(function (){

                let contentWidth = $(this).outerWidth();
                $(this).css('width', contentWidth);

            });
        },

        fixSubcategoryMenuOpenTo: function(){

            let max = Math.round($('.header .nav .container').width());


            $('.nav .list > .first-level.sub .sub-categories-wrapper').each(function (){

                let elementWidth = Math.round($(this).outerWidth());

                if($(window).width() > 1230) {
                    
                    let difference = $(window).width() - $(this).parent().offset().left;

                    if (difference < elementWidth) {
                        
                        $(this).addClass('to-right');

                    } else {

                        $(this).removeClass('to-right');
                    }                    

                } else {

                    let currentPositionParent = Math.round($(this).parent().position().left);
 
                    if((max - currentPositionParent) < elementWidth){
                        $(this).addClass('to-right');
                    } else {
                        $(this).removeClass('to-right');
                    }

                }
               
            });

        },

        mainMenu: function(){

            let internal = this;

            this.fixSubcategoryMenuOpenTo();
            this.fixSubcategoriesWidth();
            this.fixSubcategoriesHeight();

            $('.nav .list > .first-level.sub .sub-categories-wrapper').each(function (){
                new SimpleBar(this);
            });

            $(window).on('resize', function(){
                internal.fixSubcategoryMenuOpenTo();
                internal.fixSubcategoriesHeight();
            });

        },

        mainMenuMobile: function(){

            $('.menu-mobile > .account > .account-header').on('click', function(){
                $(this).parent().find('.panel').addClass('show');
            });

            $('.menu-mobile .account .panel .back').on('click', function(){
                $(this).parent().removeClass('show');
            });

            $('.menu-mobile .help-block-wrapper .help-block').on('click', function(){
                $(this).parent().find('.help-info-box').addClass('show');
            });

            $('.menu-mobile .help-block-wrapper .help-info-box .block-title').on('click', function(){
                $(this).closest('.help-info-box').removeClass('show');
            });

            $('.nav-mobile li.has-sub > a').on('click', function(event){

                let item = $(this).parent();

                item.toggleClass('show');

                if(item.hasClass('show')){
                    item.children('.sub-list').slideDown();
                } else {
                    item.children('.sub-list').slideUp();
                }

                event.preventDefault();
                return false;

            });

            $(window).on('resize', function(){
                if($(window).width() >= 768){

                    $('.menu-mobile .account .panel').removeClass('show');
                    $('.overlay-shadow').trigger('click');

                }
            });

        },


        /* Index */

        bannerHome: function(){
            if($('.banner-home').length){

                let slideshow  = $('.banner-home');
                let size       = $('.swiper-slide', slideshow).length;
                let settings   = slideshow.data('settings');

                if(size > 0){

                    new Swiper('.banner-home .swiper-container', {
                        preloadImages : false,
                        loop          : true,
                        effect        : settings.fade ? 'fade' : 'slide',
                        autoplay :{
                            delay: settings.timer,
                            disableOnInteraction : false
                        },
                        lazy :{
                            loadPrevNext: true,
                        },
                        pagination: {
                            el                : '.banner-home .dots',
                            bulletClass       : 'dot',
                            bulletActiveClass : 'dot-active',
                            clickable         : true
                        },
                    });

                    if(settings.stopOnHover){

                        $('.banner-home .swiper-container').on('mouseenter', function(){
                            (this).swiper.autoplay.stop();
                        });

                        $('.banner-home .swiper-container').on('mouseleave', function(){
                            (this).swiper.autoplay.start();
                        });

                    }
                }

            }
        },

        lineInfoVerifyAndInit: function(){
            if($(window).width() < 1100 && !this.settings.lineInfo){

                this.settings.lineInfo = new Swiper('.line-info .swiper-container', {
                    slidesPerView : 4,
                    loop          : true,
                    navigation: {
                        nextEl: '.line-info .next',
                        prevEl: '.line-info .prev',
                    },
                    pagination :{
                        el                : '.line-info .dots',
                        bulletClass       : 'dot',
                        bulletActiveClass : 'dot-active',
                        clickable         : true
                    },
                    breakpoints :{
                        0 :{
                            slidesPerView: 1
                        },
                        420 :{
                            slidesPerView: 2
                        },
                        620 :{
                            slidesPerView: 3
                        },
                        950 :{
                            slidesPerView: 4
                        }

                    }
                });

            }
            else if($(window).width() >= 1100 && this.settings.lineInfo){
                this.settings.lineInfo.destroy();
                this.settings.lineInfo = null;
            }
        },

        lineInfo: function(){

            if($('.line-info').length){
                this.lineInfoVerifyAndInit();
            }

            $(window).on('resize', function () {
                theme.lineInfoVerifyAndInit();
            });

        },

        categoriesLine: function(){
            if($('.categories-line').length){
                new Swiper('.categories-line .swiper-container', {
                    slidesPerView : 'auto',
                    preloadImages : false,
                    loop          : false,
                    navigation: {
                        nextEl: '.categories-line .next',
                        prevEl: '.categories-line .prev',
                    },
                    pagination: {
                        el                : '.categories-line .dots',
                        bulletClass       : 'dot',
                        bulletActiveClass : 'dot-active',
                        clickable         : true
                    },
                    lazy :{
                        loadPrevNext: true,
                    },
                    breakpoints :{
                        0 :{
                            slidesPerView: 1
                        },
                        420 :{
                            slidesPerView: 2
                        },
                        650 :{
                            slidesPerView: 3
                        },
                        1090 :{
                            slidesPerView: 'auto'
                        },
                        1300 :{
                            slidesPerView: 'auto'
                        }
                    }
                });
            }
        },

        showcase: function(){

            $('.showcase .product').on('mouseenter', function() {
                $('.showcase').addClass('z-index');
            });

            $('.showcase product').on('mouseleave', function() {
                $('.showcase').removeClass('z-index');
            });

            new Swiper('.section-showcase .swiper-container', {
                slidesPerView : 4,
                preloadImages : false,
                loop          : false,
                lazy :{
                    loadPrevNext: true,
                },
                navigation: {
                    nextEl: '.section-showcase .next',
                    prevEl: '.section-showcase .prev',
                },
                pagination: {
                    el                : '.section-showcase .dots',
                    bulletClass       : 'dot',
                    bulletActiveClass : 'dot-active',
                    clickable         : true
                },
                breakpoints: {
                    0: {
                        slidesPerView: 2
                    },
                    780: {
                        slidesPerView: 3
                    },
                    1100: {
                        slidesPerView: 4
                    }
                }
            });

        },

        slideBrands: function(){
            new Swiper('.slide-brand', {
                slidesPerView : 6,
                lazy          : true,
                navigation: {
                    nextEl: '.slide-brand .next',
                    prevEl: '.slide-brand .prev',
                },
                pagination: {
                    el                : '.slide-brand .dots',
                    bulletClass       : 'dot',
                    bulletActiveClass : 'dot-active',
                    clickable         : true
                },
                breakpoints: {
                    0: {
                        slidesPerView: 1
                    },
                    450: {
                        slidesPerView: 2
                    },
                    600: {
                        slidesPerView: 3
                    },
                    900: {
                        slidesPerView: 4
                    },
                    1024: {
                        slidesPerView: 5
                    }
                }
            });
        },

        storeReviewsIndex: function(){
            if(!$('.section-avaliacoes .dep_lista').length){

                $('.section-avaliacoes').remove();

            } else {

                $('.dep_item').addClass('swiper-slide');
                $('.section-avaliacoes .dep_lista').addClass('swiper-wrapper').wrap('<div class="swiper-container"></div>');
                $('.section-avaliacoes .swiper-container').append(`
                    <div class="prev">
                        <i class="icon icon-arrow-left"></i>
                    </div>
                    <div class="next">
                        <i class="icon icon-arrow-right"></i>
                    </div>            
                    <div class="dots"></div>
                `);

                let swiper = new Swiper('.section-avaliacoes .swiper-container', {
                    slidesPerView: 3,
                    lazy: {
                        loadPrevNext: true,
                    },
                    navigation: {
                        nextEl: '.next',
                        prevEl: '.prev'
                    },
                    loop: false,
                    breakpoints :{
                        0 :{
                            slidesPerView : 1,
                        },
                        600 :{
                            slidesPerView : 2,
                        },
                        1000 :{
                            slidesPerView : 3,
                        }
                    },
                    pagination: {
                        el                : '.dots',
                        type              : 'bullets',
                        bulletClass       : 'dot',
                        bulletActiveClass : 'dot-active'
                    },
                    on: {
                        init: function () {
                            $('.section-avaliacoes').addClass('show');
                        },
                    }
                });

                $('.section-avaliacoes .dep_dados').wrap('<a href="/depoimentos-de-clientes"></a>');
                $('.dep_lista li:hidden').remove();

            }
        },

        loadNews: function(){
            if($('.section-news').length){

                let dataFiles = $('html').data('files');

                $.ajax({
                    url     : `/loja/busca_noticias.php?loja=${this.settings.storeId}&${dataFiles}`,
                    method  : 'get',
                    success : function(response){

                        let target;
                        let news;

                        if(!$(response).find('.noticias').length){
                            $('.section-news').remove();
                            return;
                        }

                        target = $('.section-news .news-content .swiper-wrapper');
                        news   = $($(response).find('.noticias'));

                        news.find('li:nth-child(n+4)').remove();
                        news.find('li').wrapInner('<div class="swiper-slide"><div class="box-noticia"></div></div>');
                        news.find('.swiper-slide').unwrap();
                        news = news.contents();

                        news.each(function (index, news){

                            let link = $(this).find('#noticia_imagem a').attr('href');
                            $(this).find('p').after(`<a href="${link}" class="button-show">Leia mais</a>`);

                            let image  = $(news).find('img');
                            let source = image.prop('src');
                            image.attr('data-src', source).removeAttr('src').addClass('swiper-lazy');

                        });

                        target.append(news);

                        new Swiper('.section-news .news-content', {
                            lazy : {
                                loadPrevNext: true,
                            },
                            pagination: {
                                el                : '.news-content .dots',
                                bulletClass       : 'dot',
                                bulletActiveClass : 'dot-active',
                                clickable         : true
                            },
                            breakpoints: {
                                0: {
                                    slidesPerView: 1
                                },
                                550: {
                                    slidesPerView: 2
                                },
                                768: {
                                    slidesPerView: 3,
                                    allowTouchMove: false
                                }
                            }
                        });

                    }
                });

            }
        },


        /* Category and search pages */

        slideCatalog: function(){
            if($('.slide-catalog').length){

                new Swiper('.slide-catalog', {
                    slidesPerView : 1,
                    preloadImages : false,
                    lazy :{
                        loadPrevNext: true,
                    },
                    pagination: {
                        el                : '.slide-catalog .dots',
                        bulletClass       : 'dot',
                        bulletActiveClass : 'dot-active',
                        clickable         : true
                    }
                });

            }
        },

        sidebar: function(){
            if($('.sidebar-category .smart-filter').length){

                let form     = $('.sidebar-category .smart-filter');
                let loadType = form.data('load-type');

                if(loadType === 'on_item_selection'){
                    $('.smart-filter .filter-checkbox .filter-label').on('click', function(){
                        setTimeout(function(){
                            form.trigger('submit');
                        }, 100);
                    });
                }

                $('.smart-filter .filter-title').on('click', function () {

                    let filterBlock = $(this).parent();
                    let filterItems = $('.filter-list', filterBlock);

                    filterBlock.toggleClass('closed');

                    if(filterBlock.hasClass('closed')){
                        filterItems.slideUp();
                    } else {
                        filterItems.slideDown();
                    }

                });

            }
        },

        initScrollFilterList: function(){
            $('.smart-filter .filter-list').each(function () {

                let target = $(this).get(0);
                new SimpleBar(target, { autoHide : false });

            });
        },

        sortMobile: function(){

            let options      = $();
            let selectedValue = $('#select_ordem').val();

            $('#select_ordem option').each(function(){
                options = options.add(
                    `<li ${ selectedValue === $(this).val() ? 'class="active"' : ''} data-option="${$(this).val()}">
                        ${$(this).text()}
                    </li>
                `);
            });

            $('.catalog-header .sort-mobile .sort-panel .sort-options').append(options);

            $('.catalog-header .sort-mobile .sort-panel .sort-options').on('click', 'li', function(){
                let option = $(this).data('option');
                $('#select_ordem').val(option).trigger('change');
            });

        },


        /* Product page */

        initProductGallery: function(){

            let gallerySettings = {
                slidesPerView : 1,
                lazy :{
                    loadPrevNext: true,
                },
                on: {
                    init: function () {

                        if(this.slides.length === 1){
                            this.unsetGrabCursor();
                            this.allowTouchMove = false;
                        }

                        let wrapper = $('.product-wrapper .product-gallery').find(`.image[data-index="1"] .zoom`);

                        if(!wrapper.find('img:first').next().length){
                            wrapper.zoom({
                                touch : false,
                                url   : wrapper.find('img').attr('src')
                            });
                        }

                    },
                    slideChange: function () {

                        let index = this.activeIndex + 1;
                        let wrapper = $('.product-wrapper .product-gallery').find(`.image[data-index="${index}"] .zoom`);

                        if(!wrapper.find('img:first').next().length){
                            wrapper.zoom({
                                touch : false,
                                url   : wrapper.find('img').attr('src')
                            });
                        }

                    }
                }
            };


            if($('.product-wrapper .product-gallery .product-thumbs .swiper-slide').length){

                this.settings.productThumbs = new Swiper('.product-wrapper .product-gallery .product-thumbs .thumbs-list', {
                    slidesPerView: 4,
                    updateOnWindowResize: true,
                    centerInsufficientSlides: true,
                    watchSlidesProgress   : true,
                    watchSlidesVisibility : true,
                    navigation: {
                        nextEl: '.product-wrapper .product-gallery .product-thumbs .controls .next',
                        prevEl: '.product-wrapper .product-gallery .product-thumbs .controls .prev',
                    },
                    pagination: {
                        el                : '.product-wrapper .product-gallery .product-thumbs .thumbs-list .dots',
                        bulletClass       : 'dot',
                        bulletActiveClass : 'dot-active',
                        clickable         : true
                    },
                    lazy :{
                        loadPrevNext: true,
                    },
                    breakpoints:{
                        0: {
                            slidesPerView: 3,
                        },
                        575: {
                            slidesPerView: 4,
                        },
                        768: {
                            slidesPerView: 2,
                        },
                        1000: {
                            slidesPerView: 3,
                        },
                        1201: {
                            slidesPerView: 5,
                        }
                    },
                    on: {
                        init: function () {
                            $('.product-wrapper .product-gallery .product-thumbs').addClass('show');
                        }
                    }
                });

                gallerySettings.thumbs = {
                    autoScrollOffset     : 3,
                    multipleActiveThumbs : false,
                    swiper: this.settings.productThumbs
                };

            }

            this.settings.productGallery = new Swiper('.product-wrapper .product-gallery .product-images', gallerySettings);

        },

        recreateProductGallery: function(images){

            let productName = $('.product-wrapper .product-form .product-name').text();
            let htmlThumbs  = ``;
            let htmlImages  = ``;

            $.each(images, function (index, item){

                let slideIndex = index + 1;

                htmlImages += `
                    <div class="image swiper-slide ${ slideIndex === 1 ? 'active' : '' }" data-index="${slideIndex}">
                        <div class="zoom">
                            <img class="swiper-lazy" data-src="${item.https}" alt="${productName}">
                        </div>
                    </div>
                `;

                htmlThumbs +=
                    `<li class="swiper-slide ${ slideIndex === 1 ? 'active' : '' }" data-index="${slideIndex}">
                        <div class="thumb">
                            <img src="${item.thumbs[90].https}" alt="${productName}">
                        </div>
                    </li>
                `;

            });

            if(theme.settings.productThumbs){
                theme.settings.productThumbs.destroy();
            }

            if(theme.settings.productGallery){
                theme.settings.productGallery.destroy();
            }

            $('.product-wrapper .product-gallery .product-images .image').remove();
            $('.product-wrapper .product-gallery .product-thumbs .swiper-slide').remove();
            $('.product-wrapper .product-gallery .product-images .swiper-wrapper').html(htmlImages);

            if(images.length > 1){

                $('.product-wrapper .product-gallery .product-thumbs').addClass('show');
                $('.product-wrapper .product-gallery .product-thumbs .thumbs-list .swiper-wrapper').html(htmlThumbs);

            } else {
                $('.product-wrapper .product-gallery .product-thumbs').removeClass('show');
            }

            theme.initProductGallery();

        },

        toggleProductVideo: function(){

            let internal = this;

            $('.product-wrapper .product-box .product-video').on('click', function(){

                $('.modal-video').find('iframe').attr('data-src', $(this).data('url'));
                $('.modal-video').addClass('show');

                internal.initLazyload('.iframe-lazy');

            });

            $('.modal-video, .modal-video .close-icon').on('click', function(event){
                if(!$(event.target).hasClass('modal-info')){
                    setTimeout(function () {
                        $('.modal-video .video iframe').removeAttr('src').removeClass('loaded').removeAttr('data-was-processed data-ll-status');
                    },300);
                }
            });

        },

        loadProductVariantsQuantities: function(){
            if($('.product-wrapper .product-form .product-variants').length){
                this.settings.productVariantsQuantities = JSON.parse($('#product_variants_quantities').val());
                this.observerProductVariantChange();
            }
        },

        observerProductVariantChange: function(){

            let target = $('#selectedVariant').get(0);

            let observer = new MutationObserver(function(){
                theme.setVariantQuantity();
            });

            observer.observe(target, { attributes: true });

        },

        setVariantQuantity: function(){

            let variantId = $('#selectedVariant').val();
            //let variantQuantity = theme.settings.productVariantsQuantities(`variant_id_${variantId}`);
            let variantQuantity = theme.settings.productVariantsQuantities[`variant_id_${variantId}`];

            $('.product-form .add-cart .product-quantity .input').attr('max', variantQuantity);
            $('.product-form .add-cart .product-quantity .input').val(variantQuantity > 0 ? 1 : 0);

        },

        goToProductReviews: function(){

            let internal = this;

            $('.product-wrapper .product-box .product-form .product-rating .total').on('click', function(){

                let target;
                let adjust;

                if($(window).width() < 768){
                    target = '.product-tabs .tabs-content .tab-link-mobile.comments-link-tab';
                    adjust = 60;
                } else {
                    target = '.product-tabs .tabs-nav .tab-link.comments-link-tab';
                    adjust = 120;
                }

                $(target).trigger('click');
                internal.scrollToElement(target, adjust);

            });

            setTimeout(() => {
                $("#form-comments .submit-review").on("click", function(e){

                    if(!$("#form-comments .stars .starn.star-on").length) {
                        var textError = 'Avaliação do produto obrigatória, dê sua avaliação por favor';
                        $("#div_erro .blocoAlerta").text(textError).show(); 
                        setTimeout(() => {
                            $("#div_erro .blocoAlerta").hide(); 
                        }, 5000);
                    }

                });
            }, 3000);

        },

        goToPaymentDetails: function(){

            let internal = this;

            $('.product-wrapper .product-box .product-form .details-payment-options').on('click', function(){

                let target;
                let adjust;

                if($(window).width() < 768){
                    target = '.product-tabs .tabs-content .tab-link-mobile.payment-link-tab';
                    adjust = 60;
                } else {
                    target = '.product-tabs .tabs-nav .tab-link.payment-link-tab';
                    adjust = 120;
                }

                $(target).trigger('click');
                internal.scrollToElement(target, adjust);

            });

        },

        getShippingRates: function(){

            let internal = this;

            $('.shipping-form').on('submit', function(event){

                event.preventDefault();

                let variant  = $('#form_comprar').find('input[type="hidden"][name="variacao"]');
                let url      = $('#shippingSimulatorButton').attr('data-url');
                let quantity = $('#form_comprar').find('.add-cart .product-quantity .input').val();
                let cep      = $('input', this).val().split('-');

                if(variant.length && variant.val() === ''){
                    $('.product-shipping .result').addClass('loaded').html(`<div class="error-message">Por favor, selecione as varia&ccedil;&otilde;es antes de calcular o frete.</div>`);
                    return;
                }

                variant = variant.val() || 0;

                url = url.replace('cep1=%s', `cep1=${cep[0]}`  )
                         .replace('cep2=%s', `cep2=${cep[1]}`  )
                         .replace('acao=%s', `acao=${variant}` )
                         .replace('dade=%s', `dade=${quantity}`);


                $('.product-shipping .result').removeClass('loaded').addClass('loading').html(internal.getLoader('Carregando fretes...'));

                /* Validate zip code first using viacep web service */
                $.ajax({
                    'url'      : `https://viacep.com.br/ws/${cep[0]+cep[1]}/json/`,
                    'method'   : 'get',
                    'dataType' : 'json',
                    'success'  : function (viacepResponse) {

                        if(viacepResponse.erro){

                            let message = 'Cep inv&aacute;lido. Verifique e tente novamente.'
                            $('.product-shipping .result').removeClass('loading').addClass('loaded').html(`<div class="error-message">${message}</div>`);

                            return;

                        }

                        $.ajax({
                            'url'    : url,
                            'method' : 'get',
                            'success' : function (response) {

                                if(response.includes('N&atilde;o foi poss&iacute;vel estimar o valor do frete')){

                                    let message = 'N&atilde;o foi poss&iacute;vel obter os pre&ccedil;os e prazos de entrega. Tente novamente mais tarte.'
                                    $('.product-shipping .result').removeClass('loading').addClass('loaded').html(`<div class="error-message">${message}</div>`);

                                    return;

                                }

                                let shippingRates = $(response.replace(/Prazo de entrega: /gi, ''));
                                //let local = shippingRates.find('p .color').html().replace(/  +/g, ' ').trim().replace(/ \\/g, ',').replace(/\\/g, '');
                                let local = shippingRates.find('p .color').html().replace(/\s\s\\\s/g, '').replace(/ \\/g, ',');

                                shippingRates.find('table:first-child, p, table tr td:first-child').remove();
                                shippingRates.find('table, table th, table td').removeAttr('align class width border cellpadding cellspacing height colspan');

                                shippingRates.find('table').before(`<span class="shipping-rates-info">Pre&ccedil;os e prazos para <span class="local">${local}</span></span>`);
                                shippingRates.find('table').addClass('shipping-rates-table');

                                /*shippingRates.find('table th:first-child').html('Frete');
                                shippingRates.find('table th:nth-child(2)').html('Valor');
                                shippingRates.find('table th:last-child').html('Prazo');*/

                                // Incluir esse
                                var frete = shippingRates.find('table th:first-child').text();
                                if (frete == 'Forma de Envio:'){
                                    shippingRates.find('table th:first-child').html('Frete');
                                }

                                var valor = shippingRates.find('table th:nth-child(2)').text();
                                if (valor == 'Valor:'){
                                    shippingRates.find('table th:nth-child(2)').html('Valor');
                                }

                                var prazo = shippingRates.find('table th:last-child').text();
                                if (prazo == 'Prazo de Entrega e Observações:'){
                                    shippingRates.find('table th:last-child').html('Prazo');
                                }
                                shippingRates = shippingRates.children();

                                $('.product-shipping .result').removeClass('loading').addClass('loaded').html('').append(shippingRates);

                            },
                            'error' : function (request, status, error) {

                                console.error(`[Theme] Could not recover shipping rates. Error: ${error}`);

                                if(request.responseText !== ''){
                                    console.error(`[Theme] Error Details: ${request.responseText}`);
                                }

                                let message = 'N&atilde;o foi poss&iacute;vel obter os pre&ccedil;os e prazos de entrega. Tente novamente mais tarde.'
                                $('.product-shipping .result').removeClass('loading').addClass('loaded').html(`<div class="error-message">${message}</div>`);

                            }
                        });

                    },
                    'error': function (request, status, error) {

                        console.error(`[Theme] Could not validate cep. Error: ${error}`);
                        console.error(`[Theme] Error Details: ${request.responseJSON}`);

                        let message = 'N&atilde;o foi poss&iacute;vel obter os pre&ccedil;os e prazos de entrega. Tente novamente mais tarde.'
                        $('.product-shipping .result').removeClass('loading').addClass('loaded').html(`<div class="error-message">${message}</div>`);

                    }
                });

                return false;

            });

        },

        productBuyTogether: function(){

            let internal = this;

            $('.compreJunto form .fotosCompreJunto').append('<div class="plus color to">=</div>');
            $('.compreJunto form').removeAttr('onsubmit');

            $('.compreJunto .produto img').each(function(){

                let imagUrl = $(this).attr('src').replace('/90_', '/180_');
                let link    = $(this).parent().attr('href') || '';
                let name    = $(this).attr('alt');

                $(this).addClass('lazyload-buy-together').attr('src', '').attr('data-src', imagUrl);
                internal.initLazyload('.lazyload-buy-together');

                if(link !== ''){
                    $(this).unwrap();
                    $(this).parents('span').after(`<a class="product-name" href="${link}">${name}</a>`);
                } else {
                    $(this).parents('span').after(`<span class="product-name">${name}</span>`);
                }

            });


            /* Recreates buy together validation because of tray behavior. Uses the same validation from Tray */

            $('.compreJunto form').find('.botao-compre-junto').removeAttr('data-toggle').removeAttr('data-target');

            if($('.compreJunto .precoCompreJunto .precosCompreJunto').length){

                let target = $('.compreJunto .precoCompreJunto .precosCompreJunto').get(0);

                let options = {
                    childList: true
                };

                let observer = new MutationObserver(function(){
                    $('.compreJunto form').find('.botao-compre-junto').removeAttr('data-toggle').removeAttr('data-target');
                });

                observer.observe(target, options);

            }

            $('.compreJunto form').on('click', '.botao-compre-junto', function(event){

                event.preventDefault();

                let form    = $(this).closest('form');
                let section = form.closest('.section-buy-together');

                if(parseInt($('.precoCompreJunto [type="hidden"]', form).val()) === 1){

                    let invalid = false;

                    $('.fotosCompreJunto [type="hidden"]', form).each(function () {
                        if($(this).val() === ''){

                            invalid = true;
                            return false;

                        }
                    });

                    if(invalid){
                        $('.precoCompreJunto .blocoAlerta').show();
                        return;
                    } else {
                        $('.precoCompreJunto .blocoAlerta').hide();
                    }

                }

                let terms = $(this).attr('data-title');
                if(terms && terms.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "") === 'termo de aceitacao' && !$(this).hasClass('is-terms-accepted')){
                    cart.loadProductTerms($(this).data('url'), this);
                    return false;
                } 

                $('.buy-together-loader, .buy-together-loader .loader', section).addClass('show');

                $.ajax({
                    url     : form.attr('action'),
                    method  : form.attr('method'),
                    data    : form.serialize(),
                    success : function (){

                        cart.processCartAction('success');
                        $('.buy-together-loader, .buy-together-loader .loader', section).removeClass('show');

                    },
                    error: function (request, status, error) {
                        console.log(`[Theme] An error occurred when adding buy together product to cart. Details: ${error}`)
                    }
                });

            });

        },

        observerProductPriceChange: function(){
            if($('.product-wrapper .product-form .product-price-tray').length){

                let target = $('.product-wrapper .product-form .product-price-tray').get(0);

                let options = {
                    childList: true,
                    subtree: true
                };

                let observer = new MutationObserver(function(){
                    theme.hideElementsIfProductUnavailable();
                    theme.loadProductPaymentOptionsTab();
                });

                observer.observe(target, options);

            }

        },

        hideElementsIfProductUnavailable: function(){

            let maxVariantQuantity = $('.product-form .add-cart .product-quantity .input').attr('max');

            if(maxVariantQuantity > 0){
                $('.product-form .details-payment-options, .product-form .actions, .product-form .product-shipping, .product-form .product-social-share').removeClass('hidden');
            } else {
                $('.product-form .details-payment-options, .product-form .actions, .product-form .product-shipping, .product-form .product-social-share').addClass('hidden');
            }

        },

        loadProductPaymentOptionsTab: function(){

            let productId     = $('#form_comprar').data('id');
            let price         = $('#preco_atual').val();
            let paymentTab    = $('.product-tabs .tabs-content .payment-tab');
            let previousPrice = paymentTab.attr('data-loaded-price');

            if(previousPrice !== price){

                $.ajax({
                    'url'     : `/mvc/store/product/payment_options?loja=${theme.settings.storeId}&IdProd=${productId}&preco=${price}`,
                    'method'  : 'get',
                    'success' : function (response){

                        let html = $(response);

                        html = html.find('#atualizaFormas').unwrap();
                        html = html.find('ul.Forma1').unwrap();

                        html.find('li').each(function () {
                            let image = $('img', this).remove();
                            $('a', this).prepend(image);
                        });

                        html.find('table br').remove();
                        html.find('table td:first-child').remove();

                        html.find('table').removeAttr('id class width cellpadding cellspacing border style');
                        html.find('table td, table th').removeAttr('class width style');
                        html.find('li').removeAttr('id style');
                        html.find('li a').removeAttr('id class name');
                        html.find('li a img').removeAttr('border');

                        html.removeClass().addClass('payment-options');
                        html.find('li').addClass('option');
                        html.find('li a').attr('href', 'javascript:void(0)');
                        html.find('table').wrap('<div class="option-details"></div>');
                        html.find('.option-details').css('display', 'none');

                        paymentTab.attr('data-loaded-price', price);
                        paymentTab.html('').append(html);

                    }
                });

            }

        },

        productTabsAction: function(){

            let internal = this;

            $('.tab-link-mobile[href*="AbaPersonalizada"]').each(function(){

                let target = $(this).attr('href').split('#')[1];
                target = $(`#${target}`);

                $(target).detach().insertAfter(this);

            });

            $('.product-tabs .tabs-content .tab[data-url]').each(function(){

                let tab = $(this);
                let url = tab.data('url');

                if(tab.hasClass('payment-tab')){

                    internal.loadProductPaymentOptionsTab();

                } else {
                    $.ajax({
                        'url'     : url,
                        'method'  : 'get',
                        'success' : function (response){
                            tab.html(response);
                        }
                    });
                }

            });

            $('.product-tabs .tabs-content .tab.payment-tab').on('click', '.option a', function (){

                let parent = $(this).parent();
                let table  = $(this).next();

                if (parent.hasClass('show')){
                    parent.removeClass('show');
                    table.slideUp();
                } else {
                    parent.addClass('show');
                    table.slideDown();
                }

            });

            $('.product-tabs .tabs-nav .tab-link').on('click', function (event) {

                let tabs = $(this).closest('.product-tabs');

                if(!$(this).hasClass('active')){

                    let target = $(this).attr('href').split('#')[1];
                    target = $(`#${target}`);

                    $('.tab-link', tabs).removeClass('active');
                    $(this).addClass('active');

                    $('.tabs-content .tab', tabs).fadeOut();

                    setTimeout(function (){
                        target.fadeIn();
                    }, 300);

                }

                event.preventDefault();
                event.stopPropagation();
                return false;

            });

            $('.product-tabs .tabs-content .tab-link-mobile').on('click', function (event){

                let target = $(this).attr('href').split('#')[1];
                target = $(`#${target}`);

                if($(this).hasClass('active')){

                    $(this).removeClass('active');
                    target.removeClass('active').slideUp();

                } else {

                    $('.product-tabs .tabs-content .tab-link-mobile').removeClass('active');
                    $('.product-tabs .tabs-content .tab').removeClass('active').slideUp();

                    $(this).addClass('active');
                    target.addClass('active').slideDown();

                }

                event.preventDefault();
                event.stopPropagation();
                return false;

            });

            internal.productTabActionsOnResize();

            $(window).on('resize', function () { 
                internal.productTabActionsOnResize();
            });

        },

        productTabActionsOnResize: function(){
            if($('.product-tabs .tabs-nav li').length){

                if($(window).width() < 768 && $('.product-tabs .tabs-nav .tab-link.active').length > 0){

                    $('.product-tabs .tabs-nav .tab-link').removeClass('active');
                    $('.product-tabs .tabs-content .tab-link-mobile').removeClass('active');
                    $('.product-tabs .tabs-content .tab').removeClass('active').slideUp();

                } else if($(window).width() >= 768 && $('.product-tabs .tabs-nav .tab-link.active').length == 0) {

                    let firstLink = $('.product-tabs .tabs-nav .tab-link').first();
                    let target    = firstLink.attr('href').split('#')[1];

                    $('.product-tabs .tabs-content .tab-link-mobile').removeClass('active');
                    firstLink.addClass('active');

                    $(`#${target}`).show();

                }

            }
        },

        productReviews: function(){
            
            let commentsBlock = $(`<div class="product-comments">${window.commentsBlock}</div>`);
        
            commentsBlock.find('.hreview-comentarios + .tray-hide').remove();
        
            $.ajax({
                url: '/mvc/store/greeting', 
                method: 'get',
                dataType: 'json',
                success: function(response){
                    
                    if(!Array.isArray(response.data)){
                           
                        commentsBlock.find('#comentario_cliente form.tray-hide').removeClass("tray-hide");
                        
                        commentsBlock.find('#form-comments #nome_coment').val(response.data.name);
                        commentsBlock.find('#form-comments #email_coment').val(response.data.email);

                        commentsBlock.find('#form-comments [name="ProductComment[customer_id]"]').val(response.data.id);

                        
                    } else {
                        
                        commentsBlock.find('#comentario_cliente a.tray-hide').removeClass("tray-hide");
                    }
                    
                    $('#tray-comment-block').before(commentsBlock);
                    
                    $('#form-comments #bt-submit-comments').before('<button type="submit" class="submit-review">Enviar</button>').remove();
        
                    $('.ranking .rating').each(function() {
        
                        let review = Number($(this).attr('class').replace(/[^0-9]/g,''));
        
                        for (i = 1; i <= 5; i++){
                            if(i <= review){
                                $(this).append('<div class="icon active"></div>');
                            } else {
                                $(this).append('<div class="icon"></div>');
                            }
                        }
        
                    });
                    
                    $('#tray-comment-block').remove();

                    theme.chooseProductRating();
                    theme.sendProductReview();

                }
            })
        },

        chooseProductRating: function() {
            $('#form-comments .rateBlock .starn').on('click', function(){

                let message = $(this).data('message');
                let rating = $(this).data('id');

                $(this).parent().find('#rate').html(message);
                $(this).closest('form').find('#nota_comentario').val(rating);

                $(this).parent().find('.starn').removeClass('star-on');

                $(this).prevAll().addClass('star-on');

                $(this).addClass('star-on');

            });
        },

        sendProductReview: function() {
            $('#form-comments').on('submit', function(event){

                let form = $(this);

                $.ajax({
                    url: form.attr('action'),
                    method: 'post',
                    dataType: 'json',
                    data: form.serialize(),
                    success: function(response) {

                        form.closest('.product-comments').find('.blocoAlerta').hide();
                        form.closest('.product-comments').find('.blocoSucesso').show();

                        setTimeout(function(){

                            form.closest('.product-comments').find('.blocoSucesso').hide();
                            $('#form-comments #mensagem_coment').val('');

                            form.find('#nota_comentario').val('');
                            form.find('#rate').html('');

                            form.find('.starn').removeClass('star-on');

                        }, 8000);
                    },
                    error: function(response){

                        form.closest('.product-comments').find('.blocoSucesso').hide();
                        form.closest('.product-comments').find('.blocoAlerta').html(response.responseText).show();
                    }
 
                })

                event.preventDefault();
            })
        },

        productRelatedCarousel: function(){

            $('.section-product-related .product').on('mouseenter', function() {
                $('.showcase').addClass('z-index');
            });

            $('.section-product-related product').on('mouseleave', function() {
                $('.showcase').removeClass('z-index');
            });

            new Swiper('.section-product-related .swiper-container', {
                slidesPerView : 4,
                preloadImages : false,
                loop          : false,
                lazy :{
                    loadPrevNext: true,
                },
                navigation: {
                    nextEl: '.section-product-related .next',
                    prevEl: '.section-product-related .prev',
                },
                pagination: {
                    el                : '.section-product-related .dots',
                    bulletClass       : 'dot',
                    bulletActiveClass : 'dot-active',
                    clickable         : true
                },
                breakpoints: {
                    0: {
                        slidesPerView: 2
                    },
                    620: {
                        slidesPerView: 3
                    },
                    1200: {
                        slidesPerView: 4
                    },
                }
            });

        },

        organizeProductHistory: function(){

            let target = $('.products-history .container').get(0);

            if(!target){
                return;
            }

            let observer = new MutationObserver(function(mutationsList, observer){
                $.each(mutationsList, function(){
                    if(this.type == "childList" && $(this.target).prop('id') == "produtos"){

                        $('.products-history .container img[src*="sobconsulta"]').after('<div class="botao-commerce">Sob consulta</div>');

                        setTimeout(function () {
                            $('.products-history .history-loader').removeClass('show');
                        }, 200);

                        return false;

                    }
                });
            });

            observer.observe(target, { childList: true, subtree: true });

            $('.products-history').on('click', '#linksPag a', function (){
                $('.products-history #produtos').html('');
                $('.products-history .history-loader').addClass('show');
            });

        },

        loadProductVariantImage : function(id){
            $.ajax({
                url    : `/web_api/variants/${id}`,
                method : 'get',
                success: function (response){

                    let images = response.Variant.VariantImage;

                    if(images.length){
                        theme.recreateProductGallery(images);
                    }

                },
                error: function (request, status, error) {
                    console.log(`[Theme] An error occurred while retrieving product variant image. Details: ${error}`);
                }
            });
        },

        detectProductVariantChanges: function(){

            let internal = this;

            $('.product-variants').on('click', '.lista_cor_variacao li[data-id]', function(){
                internal.loadProductVariantImage($(this).data('id'));
            });

            $('.product-not-sale').on('click', '.lista_cor_variacao li[data-id]', function(){
                internal.loadProductVariantImage($(this).data('id'));
            });

            $('.product-variants').on('click', '.lista-radios-input', function(){
                internal.loadProductVariantImage($(this).find('input').val());
            });

            $('.product-variants').on('change', 'select', function(){
                internal.loadProductVariantImage($(this).val());
            });

        },


        /* Store reviews page */

        organizeStoreReviewsPage: function(){

            if($('.page-content .container .btns-paginator').length){
                $('.page-content .container .btns-paginator').parent().addClass('store-review-paginator');
            }

            $('.page-content .container').append('<div class="botao-commerce show-modal-store-review" data-toggle="modal-theme" data-target=".modal-store-reviews">Deixe seu depoimento</div>');
            $('#depoimento #aviso_depoimento').after('<button type="button" class="botao-commerce send-store-review">Enviar</button>');

            $('.page-content h2:first').appendTo('.modal-store-reviews .modal-info');
            $('#depoimento').appendTo('.modal-store-reviews .modal-info');

            $('#comentario_cliente').remove();
            $('.modal-store-reviews #depoimento a').remove();

        },

        validateStoreReviewForm: function(){

            $('.modal-store-reviews #depoimento').validate({
                rules: {
                    nome_depoimento :{
                        required: true
                    },
                    email_depoimento :{
                        required: true,
                        email: true
                    },
                    msg_depoimento: {
                        required: true
                    },
                    input_captcha: {
                        required: true
                    }
                },
                messages: {
                    nome_depoimento :{
                        required: "Por favor, informe seu nome completo",
                    },
                    email_depoimento:{
                        required : "Por favor, informe seu e-mail",
                        email    : "Por favor, preencha com um e-mail v&aacute;lido",
                    },
                    msg_depoimento: {
                        required: "Por favor, escreva uma mensagem no seu depoimento",
                    },
                    input_captcha: {
                        required: "Por favor, preencha com o c&oacute;digo da imagem de verifica&ccedil;&atilde;o"
                    }
                },
                errorElement : 'span',
                errorClass   : 'error-block',
                errorPlacement: function(error, element){

                    if(element.prop('type') === 'radio'){
                        error.insertAfter(element.parent('.nota_dep'));
                    }

                    else if(element.is('textarea')){
                        error.insertAfter(element.parent().find('h5'));
                    }

                    else {
                        error.insertAfter(element);
                    }
                }
            } );

            $('.modal-store-reviews #depoimento .send-store-review').on('click', function() {

                let form = $('.modal-store-reviews #depoimento');
                let button = $(this);

                if (form.valid()) {

                    button.html('Enviando...').attr('disabled', true);
                    enviaDepoimentoLoja();

                }

            });

            /* Create observer to detect Tray return */

            let target = $('#aviso_depoimento').get(0);
            let config = { attributes: true };

            let observerReviewMessage = new MutationObserver(function(mutationsList, observer){
                $('.depoimentos-modal #depoimento .send-store-review').html('Enviar').removeAttr('disabled');
            });

            observerReviewMessage.observe(target, config);

        },


        /* News page */
        organizeNewsPage: function(){

            if(!window.location.href.includes('busca_noticias')){
                $('#listagemCategorias').parent().before('<h1>Not&iacute;cias</h1>')
            }
            $('.noticias').find('li').wrapInner('<div class="box-noticia"></div>');

            $('.page-busca_noticias .box-noticia').each(function(){
                let link = $(this).find('#noticia_imagem a').attr('href');
                $(this).find('p').after(`<a href="${link}" class="button-show">Leia mais</a>`);
            });

            $('.page-busca_noticias .page-content').addClass('show');

        },


        /* Contact page */
        organizeContactPage: function(){

            $('.page-contact .page-content > .container').prepend(`
                <h1>Fale conosco</h1>
                <p class="description">Precisa falar com a gente? Utilize uma das op&ccedil;&otilde;es abaixo para entrar em contato conosco.</p>
                <div class="cols">
                    <div class="box-form">                        
                    </div>
                    <div class="info-form"></div>
                </div>
            `);

            $($('.page-content .container3').eq(1)).appendTo('.info-form');
            $($('.page-content .container3 .container2 .container2').eq(0)).appendTo('.box-form');

            if($('.info-form h3:contains(Empresa)').length){
                $('.info-form h3:contains(Empresa)').parent().insertBefore($('.info-form h3:contains(Endere)').parent());
            }

            $('.info-form h3:contains(Endere)').parent().after($('.map-iframe'));
            //$('.page-contact form input[type="image"]').after('<div class="flex justify-end"><button type="submit" class="botao-commerce">Enviar</button></div>').remove();
            $('.page-contact form img.image').after('<div class="flex justify-end"><span class="botao-commerce flex align-center justify-center">Enviar</span></div>').remove();
            $('.page-contact #telefone_contato').removeAttr('onkeypress maxlength').addClass('phone-mask');


            if($('.page-contact .contato-telefones .block:nth-child(1)').length){

                let phoneNumberFormatted = $('.page-contact .contato-telefones .block:nth-child(1)').text();
                let phoneNumber = phoneNumberFormatted.replace(/\D/g, '');

                $('.page-contact .contato-telefones .block:nth-child(1)').html(`<a href="tel:${phoneNumber}" title="Ligue para n&oacute;s">${phoneNumberFormatted}</a>`);

            }

            if($('.page-contact .contato-telefones .block:nth-child(2)').length){

                let phoneNumberFormatted = $('.page-contact .contato-telefones .block:nth-child(2)').text();
                let phoneNumber = phoneNumberFormatted.replace(/\D/g, '');

                $('.page-contact .contato-telefones .block:nth-child(2)').html(`<a target="_blank" rel="noopener noreferrer" href="https://api.whatsapp.com/send?l=pt&phone=55${phoneNumber}" title="Fale conosco no WhatsApp">${phoneNumberFormatted}</a>`);

            }

            $('.page-contact .page-content').addClass('active');

        },


        /* Gifts page */
        gifts: function(){
            $('#form_presentes input[type="image"]').prev().html('<div class="botao-commerce">Continuar Comprando</div>');
            $('#form_presentes input[type="image"]').wrap('<div class="relative-button"></div>').after('<button class="botao-commerce">Avan&ccedil;ar</button>').remove();
        },


        /* Newsletter page */
        organizeNewsletterPage: function(){

            if($('.page-newsletter .formulario-newsletter').length){

                $('.page-newsletter .formulario-newsletter .box-captcha input, .page-newsletter .formulario-newsletter .box-captcha-newsletter input').attr('placeholder', 'Digite o c&oacute;digo ao lado').trigger('focus');
                $('.formulario-newsletter .newsletterBTimg').html('Enviar').removeClass().addClass('botao-commerce');

            } else {

                $('.page-newsletter .page-content').addClass('success-message-newsletter');
                $('.page-newsletter .page-content.success-message-newsletter .board p:first-child a').addClass('botao-commerce').html('Voltar para p&aacute;gina inicial');

            }

            setTimeout(function () {
                $('.page-newsletter .page-content').addClass('show');
            }, 200);

        },

        newsletter: function() {

            var checkCookie = Cookies.get('modal-news'); 
            var modal = jQuery('.email-modal');

            if(modal.hasClass('exit-window') && !checkCookie){
                jQuery('html').on('mouseleave',function () {
                    if(!modal.hasClass('loaded')){                    
                        var interval = setInterval(function() {
                            modal.addClass('show');
                            Cookies.set('modal-news', 'true', { expires: 5 });
                            clearInterval(interval);
                        },200);
                    }
                });
            }

            if(modal.hasClass('last-time') && !checkCookie){
                setInterval(function() {
                    modal.addClass('show');
                    Cookies.set('modal-news', 'true', { expires: 5 });
                },20000);
            }

            if(modal.hasClass('init-start') && !checkCookie){
                modal.addClass('show');
                Cookies.set('modal-news', 'true', { expires: 5 });
            }
        
            jQuery('.email-modal .close-icon, .email-modal .modal-shadow').on('click', function() {
                Cookies.set('modal-news', 'true', { expires: 5 });
                modal.addClass('loaded');
            });

        }, 


        /* Footer */

        footerShowMoreLinks: function () {

            let links  = $('.footer .footer-links .more-links');
            let toggle = $('.footer .footer-links .more-links-toggle');

            $('.footer .footer-links .more-links-toggle').on('click', function () {

                $(this).toggleClass('show');

                let links = $('.footer .footer-links .more-links');
                links.toggleClass('show');

                if(links.hasClass('show')){
                    links.slideDown();
                } else {
                    links.slideUp();
                }

            });

            $(window).on('resize', function() {
                if($(this).width() < 768){
                    links.removeClass('show').show();
                    toggle.removeClass('show');
                } else if(!links.hasClass('show')){
                    links.hide();
                }
            });

        },

        showFooterLinks: function () {

            let links = $('.footer .footer-links .collapse-mobile');
            let toggle = $('.footer .footer-links .toggle-footer-links-mobile');

            toggle.on('click', function () {

                $(this).toggleClass('open');
                links.toggleClass('open');

                if(links.hasClass('open')){
                    links.slideDown();
                } else {
                    links.slideUp();
                }

            });

            $(window).on('resize', function() {
                if($(this).width() < 768){
                    if(!links.hasClass('open')){
                        links.hide();
                    }
                } else {
                    links.removeClass('open').show();
                    toggle.removeClass('open');
                }
            });

        }        

    };

    window.cart = {

        /* Definitions */

        sessionId       : null,
        storeId         : null,
        showAfterAdding : false,
        isProductPage   : false,
        apiLink         : '',
        customerId      : null,

        selectors: {
            cartToggle                   : '.cart-toggle',
            cartQuantity                 : '.cart-toggle .cart-quantity',

            cart                         : '.sidecart',
            sidecartLoader               : '.sidecart .cart-loader',
            cartHeader                   : '.sidecart .cart-header',
            cartProductWrapper           : '.sidecart .cart-products-wrapper',
            cartProducts                 : '.sidecart .cart-products',
            cartProductItem              : '.sidecart .cart-products .item',
            cartFooter                   : '.sidecart .cart-footer',
            cartTotal                    : '.sidecart .cart-footer .subtotal .price',
            removeProduct                : '.sidecart .cart-products .remove',
            checkoutButton               : '.sidecart .cart-footer .action-button',

            plusButton                   : '.add-cart .product-quantity .button-plus-quantity',
            minusButton                  : '.add-cart .product-quantity .button-minus-quantity',
            inputField                   : '.add-cart .product-quantity .input',
            addProduct                   : '.add-cart .add-to-cart',

            variantAlertWrapper          : '.product-wrapper .product-form .variant-error',
            additionalFieldAlertWrapper  : '.product-wrapper .product-form .additional-field-required',
            cartLoader                   : '.product-wrapper .product-form .product-loader',
            validateVariantSelectedClass : 'validate-variant-selected',

            modalMessage                 : '.modal-theme.modal-cart-message',
            modalMessageContainer        : '.modal-theme.modal-cart-message .message'
        },

        texts:{
            productAlreadyOnCart : 'Verificamos que esse produto j&aacute; est&aacute; no carrinho. A quantidade j&aacute; adicionada pode ser a total dispon&iacute;vel.',
            errorOnAdd           : 'Desculpe, mas n&atilde;o conseguimos adicionar o produto no carrinho. Recarregue a p&aacute;gina e tente novamente. Se o problema persistir, entre em contato conosco.',
            errorOnRemove        : 'Desculpe, mas n&atilde;o conseguimos remover o produto do carrinho. Recarregue a p&aacute;gina e tente novamente. Se o problema persistir, entre em contato conosco.',
            errorOnClean         : 'Desculpe, mas n&atilde;o conseguimos limpar o carrinho. Recarregue a p&aacute;gina e tente novamente. Se o problema persistir, entre em contato conosco.'
        },


        /* User interactions functions */

        loadCustomerId: function(){
            if(!cart.customerId){
                const customerInfo = dataLayer.find(element => ('customerId' in element));
                cart.customerId = customerInfo ? customerInfo.customerId : null;  
            }        
        },

        plusProductQuantity: function(){
            $(this.selectors.plusButton).on('click', function(){

                let field    = $(this).closest('.product-quantity').find('.input');
                let quantity = parseInt(field.val()) + 1;
                let max      = parseInt(field.attr('max'));

                if(quantity <= max){
                    field.val(quantity);
                }

            });
        },

        minusProductQuantity: function(){
            $(this.selectors.minusButton).on('click', function(){

                let field    = $(this).closest('.product-quantity').find('.input');
                let quantity = parseInt(field.val()) - 1;

                if(quantity >= 1){
                    field.val(quantity);
                }

            });
        },

        changeProductQuantity: function(){
            $(this.selectors.inputField).on('change', function(){

                let field    = $(this);
                let max      = parseInt(field.attr('max'));
                let quantity = parseInt(field.val());

                if(quantity >= 1 && quantity <= max){
                    field.val(quantity);
                } else {
                    field.val(1);
                }

            });
        },

        addProduct: function(){

            $('body').on('click', cart.selectors.addProduct, function(event){

                let form      = $(this).closest('form');
                let productId = form.data('id');
                let quantity  = $('.input', form).val();
                let validaApi = $(this).closest('form').data('api-cart');

                if($(this).hasClass('has-terms') && !$(this).hasClass('is-terms-accepted')) {
                    cart.loadProductTerms(`/loja/termo_aceite.php?loja=${cart.storeId}&idProduto=${productId}&store=1`, this);
                    return false;
                }

                if(form.hasClass('is-kit')){

                    let variants = [];
                    let stopAdding = false;

                    form.find('input[type="hidden"][name="variants_kit[]"]').each(function (index, value){

                        let variantValue = $(value).val();

                        if(variantValue !== ''){
                            variants.push(variantValue);
                        } else {
                            cart.showProductVariantAlert();
                            stopAdding = true;
                            return false;
                        }

                    });

                    if(stopAdding){
                        return false;
                    }

                    if($(this).hasClass(cart.selectors.validateVariantSelectedClass) && variants.length === 0){
                        cart.showProductVariantAlert();
                        return;
                    }

                    cart.showCartLoading();
                    cart.addProductWithSubmit('kit', productId, form, cart.processCartAction);

                }

                else {

                    if(form.find('.productAdditionalInformation #menuVars').length){

                        let requiredFields = form.find('.productAdditionalInformation #menuVars :required');
                        
                        if(requiredFields.length > 0 && requiredFields.map(function(){ return ($(this).val() === "") ? $(this).attr('name') : null; }).get().length > 0){
                            cart.showAdditionalInfoRequiredAlert();
                            return;
                        }

                        cart.showCartLoading();
                        cart.addProductWithSubmit('additional-information', productId, form, cart.processCartAction);

                        event.preventDefault();
                        return false;
                        
                    }

                    if(form.find('#menuVars .listaVarMultipla').length){

                        if($("#menuVars .listaVarMultipla").find("[type='checkbox']:checked").length == 0) {
                            cart.showProductVariantAlert();
                            return;
                        }

                        cart.showCartLoading();
                        cart.addProductWithSubmit('multiple-variants', productId, form, cart.processCartAction);

                        event.preventDefault();
                        return false;
                    }
              
                    let variantId = form.find('input[type="hidden"][name="variacao"]').val() || 0;

                    if($(this).hasClass(cart.selectors.validateVariantSelectedClass) && variantId == 0){
                        cart.showProductVariantAlert();
                        return;
                    }

                    cart.showCartLoading();

                    if(form.hasClass('has-gift')){
                        cart.addProductWithSubmit('gift', productId, form, cart.processCartAction);
                    } else {
                        cart.addProductApi(quantity, productId, variantId, cart.processCartAction, validaApi);
                    }

                }

                event.preventDefault();
                return false;

            });
        },

        removeProduct: function(){
            $('body').on('click', cart.selectors.removeProduct, function(event){

                let productId        = $(this).data('id');
                let variantId        = $(this).data('variant') || '0';
                let boughtTogetherId = $(this).data('together') || '0';
                let additional       = $(this).data('additional');
                let cart_id          = $(this).data('cart-id');

                cart.showSidecartLoading(true);
                cart.removeProductApi(productId, variantId, boughtTogetherId, additional, cart_id, cart.processCartAction);

                event.preventDefault();
                return false;

            });
        },

        getCartSession: function(){

            let storeId = $('html').data('store');

            $.ajax({
                url: `/nocache/app.php?loja=${storeId}`, 
                method: 'get',
                dataType: 'json',
                success: function(response) {
                    
                    if(response.hash){

                        cart.sessionId = response.hash;
                        cart.storeId   = storeId;

                        console.log('[Theme cart] Session and store id recovered');

                        cart.setShowAfterAdding();
                        cart.getProductsApi(cart.updateCartUi);
                        
                    }
                }, 
                error: function() {
                    console.error('[Theme cart] Could not recovery session id.');
                    cart.showMessage('Não foi possível recuperar a sessão do carrinho. Por favor, recarregue a página.');
                },
                complete: function() {
                    $('.actions .product-button').removeClass('loading');
                    $('.actions .product-button .loader-button').removeClass('show');
                }
            });

        },

        /* Auxiliar functions */

        setProductPage: function(isProductPage){
            cart.isProductPage = isProductPage;
        },

        setShowAfterAdding: function(){
            cart.showAfterAdding = $(cart.selectors.cart).data('show-after-loading');
        },

        processCartAction: function(status, message = null, extra = null){
            if(status === 'success'){

                cart.getProductsApi(cart.updateCartUi);
                cart.animateCart();

            } else {

                if(extra && extra.quantityError){
                    if($(`${cart.selectors.cartProductItem} [data-id="${extra.productId}"]`).length){
                        cart.showMessage(`${message} ${cart.texts.productAlreadyOnCart}`);
                        return
                    }
                }

                cart.showMessage(message);

            }
        },


        /* UI functions */

        showProductVariantAlert: function(){

            $(cart.selectors.variantAlertWrapper).slideDown();

            setTimeout(function (){
                $(cart.selectors.variantAlertWrapper).slideUp();
            }, 10000);

        },

        showAdditionalInfoRequiredAlert: function(){

            $(cart.selectors.additionalFieldAlertWrapper).slideDown();

            setTimeout(function (){
                $(cart.selectors.additionalFieldAlertWrapper).slideUp();
            }, 10000);

        },

        showMessage: function(message){

            let time = theme.overlayIsVisible() ? 300 : 1;

            $('.overlay-shadow').trigger('click');

            setTimeout(function () {

                cart.showSidecartLoading(false);
                cart.showCartLoading(false);

                $(cart.selectors.modalMessageContainer).html(message);
                $(`${cart.selectors.modalMessage}, ${cart.selectors.modalMessage} .overlay-shadow`).addClass('show');

            }, time);


        },

        showSidecartLoading: function(show = true){
            if(show){
                $(cart.selectors.sidecartLoader).addClass('show');
            } else {
                $(cart.selectors.sidecartLoader).removeClass('show');
            }
        },

        showCartLoading: function(show = true){
            if(show){
                $(cart.selectors.cartLoader).addClass('show');
            } else {
                $(cart.selectors.cartLoader).removeClass('show');
            }
        },

        animateCart: function(){

            $(cart.selectors.cartToggle).addClass('adding');

            setTimeout(function () {

                $(cart.selectors.cartToggle).removeClass('adding');
                if(cart.showAfterAdding){
                    $(cart.selectors.cartToggle).trigger('click');
                } 

            }, 200);

        },

        updateCartUi: function(trayCart = null){

            let totalQuantity = 0;
            let totalPrice    = 0.0;

            if(trayCart){

                let items = '';

                $.each(trayCart.products, function(index, product){

                    let message          = encodeURI(product.additional_information);
                    let variantId        = product.variant_id;
                    let boughtTogetherId = product.bought_together_id;
                    let quantity         = parseInt(product.quantity);
                    let price            = parseFloat(product.price);
                    let cart_id          = product.cart_id;
                    let variants         = '';

                    totalQuantity += quantity;
                    totalPrice    += (price * quantity);

                    if(product.has_variation && product.variant && typeof product.variant == 'string'){
                        if(product.variant.includes('|')) {
                            $.each(product.variant.split('|'), function (index, variant){
                                let variantInfo = variant.split(':');
                                variants += `
                                    <span class="variant">
                                        <span class="variant-title">${variantInfo[0]}:</span>
                                        <span class="variant-value">${variantInfo[1]}</span>
                                    </span>
                                `;
                            });
                        } else {
                            let variantInfo = product.variant.split(':');
                            variants += `
                                <span class="variant">
                                    <span class="variant-title">${variantInfo[0]}:</span>
                                    <span class="variant-value">${variantInfo[1]}</span>
                                </span>
                            `;
                        }
                    }

                    items += `
                        <div class="item flex f-wrap align-center ${ boughtTogetherId !== '0' ? `together together-${boughtTogetherId}` : ''}">
                            ${ (boughtTogetherId !== '0') ? `<div class="bought-together">Item do compre junto</div>` : ''}
                            <div class="item-image">
                                <a href="${product.url.https}">
                                    <img src="${product.images.medium}" alt="${product.name}" />
                                </a>
                            </div>
                            <div class="item-details">
                                <div class="description">
                                    <a class="name" href="${product.url.https}">
                                        ${product.name}
                                    </a>
                                    ${variants}                         
                                </div>                  
                                <div class="quantity">
                                    Quantidade: ${quantity}
                                </div>
                                <div class="price">
                                    ${price.formatMoney(2, ',', '.', true)}
                                </div>                            
                                <div class="remove" data-id="${product.id}" data-variant="${variantId}" data-together="${boughtTogetherId}" data-cart-id="${cart_id}" data-additional="${message}" aria-label="Remover item" title="Remover item">
                                    <i class="icon icon-trash"></i>
                                </div>
                            </div>                        
                        </div>
                    `;

                });

                $(cart.selectors.cart).removeClass('empty');
                $(cart.selectors.cartProducts).html(items);
                $(cart.selectors.cartQuantity).html(totalQuantity);
                $(cart.selectors.cartTotal).html(totalPrice.formatMoney(2, ',', '.', true));

            } else {
                $(cart.selectors.cart).addClass('empty');
                $(cart.selectors.cartQuantity).html(0);
            }

            cart.showSidecartLoading(false);
            cart.showCartLoading(false);

        },

        loadProductTerms: function(url, button){

            cart.showCartLoading();

            $.ajax({
                url    : url,
                method : 'get',
                success: function(response){

                    let terms = $(response);
                    let termsMessage = terms.find('#msg-aceita-termo');

                    terms.find('#texto-termo').addClass('rte');
                    terms.find('#aceita_termo').wrap('<div class="checkbox-accept-terms"></div>');
                    terms.find('#msg-aceita-termo').replaceWith(`<label for="aceita_termo" id="msg-aceita-termo">${termsMessage.text()}</label>`);
                    terms.find('#msg-aceita-termo').insertAfter(terms.find('#aceita_termo'));

                    $('.modal-terms .modal-wrapper .modal-info').html(terms);
                    $('.modal-terms .modal-wrapper').addClass('addContent');
                    $('.modal-terms').addClass("show");

                    cart.showCartLoading(false);

                    $('.modal-terms').on('click', '#acceptTerm', function(){
                        if($(this).closest('#concorda-termo').find('#aceita_termo').is(':checked')){

                            $(button).addClass('is-terms-accepted').trigger('click').removeClass('is-terms-accepted');
                            $('.modal-terms').removeClass('show');

                        } else {

                            $('.modal-terms #msg-aceita-termo').after('<div class="blocoAlerta">Para continuar marque o campo acima</div>');

                        }
                    })


                }
            });

        },


        /* Cart api interaction functions */

        apiReturnHandler: function(response){

            let causesFromObject = [];

            if(Array.isArray(response.causes)){
                return response.causes.join('<br>');
            }

            $.each(response.causes.Cart, function(index, value){
                causesFromObject.push(value.join('<br>'));
            });

            return causesFromObject.join('<br>');

        },

        getProductsApi: function(callback){
            $.ajax({
                url      : `/checkout/cart/api?session_id=${cart.sessionId}&store_id=${cart.storeId}&nocache=0.${new Date().getTime()}`,
                method   : 'get',
                dataType : 'json',
                success : function (response){
                    if(callback && (callback instanceof Function)){
                        callback(response.data.cart);
                    }
                },
                error: function (response, status, error){

                    if(response.status === 400 && callback && callback instanceof Function){
                        callback();
                        return;
                    }

                    console.log(`[Theme cart] an error occurred while retrieving the cart. Details: ${error}`);

                }
            });
        },

        addProductApi: function(quantity, productId, variantId = null, callback = null, valApi){

            if (valApi == 1){

                cart.loadCustomerId();

                const data = {
                    Cart: {
                        session_id : this.sessionId,
                        product_id : productId,
                        variant_id : variantId ? variantId : 0,
                        quantity   : quantity
                    }
                };

                if(cart.customerId){
                    data.Cart.customer_id = cart.customerId;
                }

                $.ajax({
                    method: 'post',
                    url: '/web_api/cart/',
                    dataType: 'json',
                    data: data,    
                    success: function (){
                        if(callback && (callback instanceof Function)){
                            callback('success');
                        }
                    },
                    error: function (response, status, error){

                        if(callback && (callback instanceof Function)){

                            if(response.status === 400){

                                let extra   = null;
                                let message = cart.apiReturnHandler(response.responseJSON);

                                if(message.includes('insuficiente ')){
                                    extra = {
                                        quantityError : true,
                                        productId : productId
                                    }
                                }

                                callback('error', message, extra);
                                return;

                            } else {
                                callback('error', cart.texts.errorOnAdd);
                            }

                        }

                        console.log(`[Theme cart] An error occurred while adding product to cart. Details: ${error}`);

                    }

                });

            } else {
        
                const storeId = jQuery('html').data('store');
                const callback = encodeURIComponent(`/loja/cartService.php?loja=${storeId}&acao=incluir&IdProd=${productId}&variacao=${  variantId ? variantId : 0 }`);

                jQuery.ajax({
                    method: 'post',
                    url: `/mvc/store/element/snippets/cart_preview/?loja=${storeId}&callback=${callback}`,    
                    data: {
                        quant: quantity
                    },
                    success: function() {
                        cart.getCartSession();                        
                        cart.animateCart();
                        cart.showSidecartLoading();
                    },
                    error: function( ){
                        window.location.href = href;
                    }    
                });

            }
                  
        },

        addProductWithSubmit: function(type, productId, form, callback = null){
            $.ajax({
                url    : `/mvc/store/element/snippets/cart_preview/?loja=${cart.storeId}&callback=${encodeURIComponent(form.attr('action'))}`,
                method : form.attr('method'),
                data   : form.serialize(),
                success: function () {
                    if(callback && (callback instanceof Function)){
                        callback('success');
                    }
                },
                error: function (response, status, error) {
        
                    callback('error', cart.texts.errorOnAdd);
                    console.log(`[Theme cart] An error occurred while adding product with submit from type ${type}. Details: ${error}`);
        
                }
            });
        },

        removeProductApi: function(productId, variantId = '0', boughtTogetherId = '0',  additionalInformation = null, cart_id = null, callback = null){

            let url = `/checkout/cart/api/item/${cart_id}?session_id=${cart.sessionId}&store_id=${cart.storeId}&zip_code=null&product_id=${productId}&variant_id=${variantId}`;

            if(boughtTogetherId !== ''){
                url = `${url}&bought_together_id=${boughtTogetherId}`;
            }

            if(additionalInformation && additionalInformation !== ''){
                url = `${url}&additional_information=${additionalInformation}`;
            }

            $.ajax({
                url      : url,
                method   : 'delete',
                dataType : 'json',
                success: function (){
                    if(callback && (callback instanceof Function)){
                        callback('success');
                    }
                },
                error: function (response, status, error){

                    if(callback && (callback instanceof Function)){

                        if(response.status === 400){

                            callback('error', response.responseJSON.causes.join('<br>'));
                            return;

                        } else {
                            callback('error', cart.texts.errorOnRemove);
                        }

                    }

                    console.log(`[Theme cart] An error occurred while removing product from cart. Details: ${error}`);

                }
            });
        },

        removeCart: function(callback = null){
            $.ajax({
                url    : `/web_api/carts/${cart.sessionId}`,
                method : 'delete',
                success: function (){
                    if(callback && (callback instanceof Function)){
                        callback('success');
                    }
                },
                error: function (response, status, error){

                    if(callback && (callback instanceof Function)) {

                        if(response.status === 400){

                            callback('error', response.responseJSON.causes.join('<br>'));
                            return;

                        } else {
                            callback('error', cart.texts.errorOnClean);
                        }

                    }

                    console.log(`[Theme cart] An error occurred while removing cart. Details: ${error}`);

                }
            });
        },

        customScrollbar: function(){
            let target = $(this.selectors.cartProductWrapper).get(0);
            new SimpleBar(target, { autoHide : false });
        },

        /* Initialization */

        init: function (){
            this.customScrollbar();
            this.plusProductQuantity();
            this.minusProductQuantity();
            this.changeProductQuantity();
            this.addProduct();
            this.removeProduct();
            this.getCartSession();
        },

    };

    $(function(){

        theme.resets();  
        theme.loadThemeVersion();        
        theme.newsletter();

        theme.processRteElements();
        theme.recoveryStoreId();
        theme.initMasks();
        theme.initLazyload();
        theme.overlay();
        theme.toggleModalTheme();

        theme.shippingTracking();
        theme.scrollHeader();
        theme.mainMenu();
        theme.mainMenuMobile();
        theme.footerShowMoreLinks();
        theme.showFooterLinks();              

        cart.init();

        if($('html').hasClass('page-home')){
            theme.bannerHome();
            theme.lineInfo();
            theme.slideBrands();
            theme.categoriesLine();
            theme.showcase();
            theme.storeReviewsIndex();
            theme.loadNews();
        }

        else if($('html').hasClass('page-newsletter')){
            theme.organizeNewsletterPage();
        }

        else if($('html').hasClass('page-catalog') || $('html').hasClass('page-search')){
            theme.slideCatalog();
            theme.sidebar();
            theme.initScrollFilterList();
            theme.sortMobile();
        }

        else if($('html').hasClass('page-product')){
            cart.setProductPage(true);
            theme.initProductGallery();
            theme.toggleProductVideo();
            theme.loadProductVariantsQuantities();
            theme.detectProductVariantChanges();
            theme.goToProductReviews();
            theme.goToPaymentDetails();
            theme.observerProductPriceChange();
            theme.getShippingRates();
            theme.productBuyTogether();
            theme.productTabsAction();
            theme.productReviews();
            theme.productRelatedCarousel();
            theme.organizeProductHistory();
        }

        else if ($('html').hasClass('page-busca_noticias')){
            theme.organizeNewsPage();
            theme.generateBreadcrumb('news-page-listing');
        }

        else if ($('html').hasClass('page-noticia')){
            theme.generateBreadcrumb('news-page');
        }


        else if ($('html').hasClass('page-depoimentos')){
            theme.organizeStoreReviewsPage();
            theme.validateStoreReviewForm();
        }

        else if($('html').hasClass('page-contact')){
            theme.organizeContactPage();
        }

        else if($('html').hasClass('page-finalizar_presentes')){
            theme.gifts();
        }

    });

}(jQuery));