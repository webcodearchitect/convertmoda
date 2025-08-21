(function (jQuery, window) {

    let theme = {

        init: function init() {

            this.closeAlertStore();
            this.header();
            this.nameUser();
            this.footer();
            this.banners();
            this.sidebar();
            this.lazyload();
            this.bannerInfo();
            this.slideProduct();
            this.depoimento();
            this.newsletter();
            this.brands();
            this.resets();
            this.loadThemeVersion();

            if(jQuery('html').hasClass('page-newsletter')) {
                this.organizeNewsletterPage();
            }

            else if(jQuery('html').hasClass('page-depoimentos')){
                this.organizeStoreReviewsPage();
                this.validateStoreReviewForm();
            }

            else if(jQuery('html').hasClass('page-contact')){
                this.organizeContactPage();
            }

            this.breadcrumbs();

        },

        lazyload: function lazyload() {
            var lazy = new LazyLoad({
                elements_selector: ".lazyload"
            });
        },

        loadThemeVersion: function(){

            const themeVersion = Cookies.get('theme-version');
        
            if(themeVersion){
                jQuery('html').attr('data-theme-version', themeVersion);
                return;
            }
    
            jQuery.getJSON(`${window.theme.themePath}js/version.json?t=${Date.now()}`, function(data){
                Cookies.set('theme-version', data.version, { expires: 7 });
                jQuery('html').attr('data-theme-version', data.version);
            });
        
        },

        nameUser: function nameUser(){
            jQuery('[data-customer="name"]').each(function(){

                let target = jQuery(this).get(0);

                let observer = new MutationObserver(function(mutationsList, observer){

                    let mutation = mutationsList[0];
                    let firstName = jQuery(mutation.target).text().split(' ')[0];

                    observer.disconnect();
                    jQuery(mutation.target).html(`Ol&aacute;, ${firstName}`);

                });

                observer.observe(target, { childList : true });

            });
        },

        storeId: function () {
            return jQuery('html').data('store');
        },

        closeAlertStore: function(){
            jQuery('.box-alerts .close-info').on('click', function(){
                jQuery('.box-alerts').addClass('hide');
                jQuery('footer.footer').removeClass('alert-messages-padding');
                jQuery('[data-tray-tst="loja_implantacao_aviso"]').remove();
            });
        },

        header: function header() {

            jQuery('.bar-top').on('click', '.rastreio span', function(){
                jQuery(this).next().toggleClass('active');
            });

            jQuery('.rastreie').on('keyup', 'input', function(){
                var text = jQuery(this).parent().attr('data-action').replace('{query}', jQuery(this).val());
                jQuery(this).parent().attr('action', text);
            });

            jQuery(document).on('click', function(event) {
                if (!jQuery(event.target).closest(".rastreio").length) {
                    jQuery(".rastreio .modal-white").removeClass('active');
                }
            });

            jQuery('.list-nav > li').on('click', '.sub', function(e){
                e.preventDefault();
                jQuery(this).toggleClass('active');
                jQuery(this).next().toggleClass('active');
            });

            jQuery('.header').on('click', '.menu', function(){
                jQuery('.nav-mobile').addClass('active');
            });

            jQuery('.close-nav, .shadow-cart').on('click', function () {
                jQuery('.nav-mobile').removeClass('active');
            });

            jQuery('.sidebar-category').on('click', '.sub-filter', function(e){
                jQuery(this).toggleClass('active');
            });

            jQuery('.sidebar-category').on('click', 'li.sub .sub-filter', function(e){
                e.preventDefault();
            });

            jQuery('.video-button').on('click', function(){
                jQuery('.video-modal').addClass('active').find('[data-src]').attr('data-src', jQuery(this).data('url'));
                var video = new LazyLoad({
                    elements_selector: ".iframe-lazy",
                });
            });

            jQuery('.video-modal').on('click', '.shadow, .close-icon', function() {
                setTimeout(function () {
                    jQuery('.video-modal .video iframe').removeAttr('src').removeClass('loaded').removeAttr('data-was-processed').removeAttr('data-ll-status');
                }, 300)

            });

            jQuery('.nav-mobile').on('click', 'a.contato', function(e){
                e.preventDefault();

                jQuery('.sac-modal').addClass('active');
                jQuery('.nav-mobile ').removeClass('active');
            })

            this.scrollHeader();

            // if(!jQuery('.header .menu').is(':visible')){
            this.scrollHeader();
            // fixed = false;
            // }

        },
        breadcrumbs: function () {
            if(!jQuery('.breadcrumb').length){

                let items;
                let breadcrumb = '';
                let pageName   = document.title.split(' - ')[0];

                if(jQuery('html').hasClass('page-noticia')){
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

                jQuery.each(items, function (index, item){
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

                jQuery('.page-content > .container').prepend(`
                    <ol class="breadcrumb flex f-wrap" itemscope itemtype="https://schema.org/BreadcrumbList">
                        ${breadcrumb}
                    </ol>
                `);

            }
        },
        resets: function () {
            // busca avancada
            jQuery('.page-search #Vitrine input[type="image"]').after('<button type="submit" class="botao-commerce">BUSCAR</button>')
            jQuery('.page-search #Vitrine input[type="image"]').remove();
            jQuery('.advancedSearchFormBTimg').addClass('botao-commerce');

            // trocar senha
            jQuery('.page-central_senha input[type="image"]').after('<button type="submit" class="botao-commerce">CONTINUAR</button>').remove();

            // panel
            jQuery('.col-panel .tablePage, .page-extra .page-content table,.page-extras .page-content table, .board_htm table').wrap('<div class="table-overflow"></div>');
            jQuery('.caixa-cadastro #email_cadastro').attr('placeholder', 'Seu e-mail');

            // contact
            jQuery('.page-contact form input[type="image"]').after('<div class="flex justify-end"><button type="submit" class="botao-commerce">ENVIAR</button></div>').remove();

            jQuery('.txt-forma-pagamento').each(function () {
                jQuery(this).text(jQuery(this).text().replace(' - Yapay', ''));
            });

            jQuery('#imagem[src*="filtrar.gif"]').after('<button type="submit" class="botao-commerce">Filtrar</button>');
            jQuery('#imagem[src*="filtrar.gif"]').remove();

            jQuery('input[src*="gerarordem.png"]').after('<button type="submit" class="botao-commerce">Gerar ordem de devolu&ccedil;&atilde;o</button>');
            jQuery('input[src*="gerarordem.png"]').remove();

            jQuery('.page-busca_noticias .noticias li').wrapInner('<div class="box-noticia"></div>');

            jQuery('.page-busca_noticias .noticias li').each(function(){
                let link = jQuery(this).find('#noticia_imagem a').attr('href');
                jQuery(this).find('p').after(`<a href="${link}" class="button-show">Leia mais</a>`);
            });

            jQuery('.page-busca_noticias .site-main .page-content').addClass('show');

            jQuery('#form-comments #bt-submit-comments').before('<button class="botao-commerce">Enviar</button>').remove();
            
        },
        scrollHeader: function () {
            var scrollTop = 0;
            var didScroll;
            var lastScrollTop = scrollTop;
            var delta = 5;
            var navbarHeight = jQuery('.header').outerHeight();
            var wrapper = jQuery(".wrapper");

            (jQuery(window).scrollTop() > scrollTop) ? wrapper.addClass("fixed") : wrapper.removeClass("fixed");

            jQuery(window).on('scroll', function () {
                (jQuery(window).scrollTop() > scrollTop) ? wrapper.addClass("fixed") : wrapper.removeClass("fixed");
                didScroll = true;

            });

            setInterval(function () {
                if (didScroll) {
                    hasScrolled();
                    didScroll = false;
                }
            }, 250);

            function hasScrolled() {
                var st = jQuery(this).scrollTop();

                if (Math.abs(lastScrollTop - st) <= delta) return;

                if (st > lastScrollTop && st > navbarHeight) {
                    wrapper.removeClass('show-nav')
                    jQuery(".header > .bg > .line").removeClass('show-header')
                    jQuery(".header > .bg > .line").addClass('show--fixed')
                } else {
                    if (st + jQuery(window).height() < jQuery(document).height()) {
                        wrapper.addClass('show-nav')
                        jQuery(".header > .bg > .line").addClass('show-header')
                        jQuery(".header > .bg > .line").removeClass('show--fixed')
                    }
                }

                lastScrollTop = st;
            }
        },
        footer: function footer() {
            jQuery('.footer').on('click', '.title', function () {
                jQuery(this).toggleClass('active');
            });
        },
        addScriptPage: function addScriptPage() {

        },
        banners: function bannerFull() {
            if (jQuery('.banner-full .swiper-container').length) {
                var config = jQuery('.banner-full').data('config');
                var total = jQuery('.banner-full .swiper-slide').length;
                var paginate = total > 1 ? {
                    clickable: true,
                    el: '.banner-full .swiper-pagination'
                } : false;

                var swiper = new Swiper('.banner-full .swiper-container', {
                    preloadImages: false,
                    effect: config.fade ? 'fade' : 'slide',
                    autoplay: {
                        delay: config.time,
                        disableOnInteraction: false
                    },
                    lazy: {
                        loadPrevNext: true,
                    },
                    pagination: paginate,
                    loop: (total > 1)
                });

                if (config.stop) {
                    jQuery(".banner-full").on({'mouseenter': function(){
                        (this).swiper.autoplay.stop();
                    }, 'mouseleave': function(){
                        (this).swiper.autoplay.start();
                    }}, '.swiper-container');
                }
            }

            var swiperBanner = new Swiper('.banner .swiper-container', {
                preloadImages: false,
                effect: 'fade',
                autoplay: {
                    delay: 4000,
                    disableOnInteraction: false
                },
                loop: true,
                lazy: {
                    loadPrevNext: true,
                }
            });
        },
        sidebar: function () {
            if (!jQuery('.hide-menu').is(':visible')) {
                jQuery('.shadow-cart').before(jQuery('.box-fixed').parent().contents());
            }

            jQuery('.button-filter').on('click', function(){
                jQuery('.box-fixed').addClass('active');
            });

            jQuery('.filter__title').on('click', function(){
                jQuery(this).toggleClass('active');
            });

            jQuery('.filter__item').on('click', function(){
                setTimeout(function () {
                    jQuery('.smart-filter').trigger('submit');
                }, 50)
            });
        },
        bannerInfo: function () {
            if (jQuery('.banner-info').length) {

                var swiperinfo = new Swiper('.banner-info .swiper-container', {
                    preloadImages: false,
                    lazy: {
                        loadPrevNext: true,
                    },
                    navigation: {
                        nextEl: '.next',
                        prevEl: '.prev',
                    },
                    loop: true
                });

            }
        },
        slideProduct: function () {
            if (jQuery('.showcase').length) {
                jQuery('.showcase').on('hover', '.product', function () {
                    jQuery('.showcase').removeClass('zindex');
                    jQuery(this).parents('.showcase').addClass('zindex');
                });
            }
            if (jQuery('.product .second').length) {

                if (jQuery('.showcase').length) {
                    jQuery('body').on('hover', '.product', function () {
                        var img = jQuery(this).find('.second-image');
                        if (!img.hasClass('load')) {
                            img.attr('src', img.data('src')).addClass('load');
                        }
                    });
                } else {
                    jQuery('body').on('hover', '.product', function () {
                        var img = jQuery(this).find('.second-image');

                        if (!img.hasClass('load')) {
                            img.attr('src', img.data('src')).addClass('load');
                        }
                    });
                }
            }

            var listSlide = new LazyLoad({
                elements_selector: '.list-slide',
                callback_enter: function (element) {

                    let items        = jQuery(element).find('.item').length;
                    let columnsCount = jQuery(element).data('product-columns') || 2;

                    var swiperList = new Swiper(jQuery(element).find('.swiper-container').get(0), {
                        slidesPerView: 4,
                        lazy: {
                            loadPrevNext: true,
                        },
                        navigation: {
                            nextEl: element.querySelector('.next'),
                            prevEl: element.querySelector('.prev'),
                        },
                        loop: items > 4,
                        breakpoints: {
                            0: {
                                slidesPerView: columnsCount,
                                loop: items > columnsCount,
                            },
                            768: {
                                slidesPerView: 3,
                                loop: items > 3,
                            },
                            1024: {
                                slidesPerView: 4,
                                loop: items > 4
                            },
                        }
                    });
                }
            });

            
        },
        brands: function brands() {

            var brand = new LazyLoad({
                elements_selector: '.section-brands',
                threshold: 300,
                callback_enter: function (element) {

                    var swiper = new Swiper('.slide-brand', {
                        preloadImages: false,
                        slidesPerView: 6,
                        spaceBetween: 0,
                        lazy: true,
                        navigation: {
                            nextEl: '.slide-brand .next',
                            prevEl: '.slide-brand .prev',
                        },
                        breakpoints: {
                            0: {
                                slidesPerView: 1
                            },
                            460 :{
                                slidesPerView: 2
                            },
                            575 :{
                                slidesPerView: 3
                            },
                            768 :{
                                slidesPerView: 4
                            },
                            1024 :{
                                slidesPerView: 5
                            },
                            1200 :{
                                slidesPerView: 6
                            }
                        }
                    });
                }
            });

        },
        depoimento: function () {
            jQuery('.section-avaliacoes .dep_dados').wrap('<a href="/depoimentos-de-clientes"></a>');
            jQuery('.dep_lista li:hidden').remove();

            if (!jQuery('.section-avaliacoes .dep_lista').length) {
                jQuery('.section-avaliacoes').remove();
            } else {
                var quant = jQuery('.dep_item').length;
                jQuery('.dep_item').addClass('swiper-slide');

                jQuery('.section-avaliacoes .dep_lista').addClass('swiper-wrapper').wrap('<div class="swiper-container"></div>');

                jQuery('.section-avaliacoes .swiper-container').append('<div class="prev arrow-icon"></div><div class="next arrow-icon"></div>');

                var swiper = new Swiper('.section-avaliacoes .swiper-container', {
                    slidesPerView: 3,
                    // init: false,
                    lazy: {
                        loadPrevNext: true,
                    },
                    navigation: {
                        nextEl: '.section-avaliacoes .next',
                        prevEl: '.section-avaliacoes .prev'
                    },
                    loop: false,
                    breakpoints: {
                        0: {
                            loop: false,
                            slidesPerView: 1
                        },
                        575: {
                            slidesPerView: 2
                        },
                        1000: {
                            slidesPerView: 3
                        }
                    }
                });
            }

        },

        newsletter: function () {
            var checkCookie = Cookies.get('modal-news'); 

            var modal = jQuery('.email-modal');

            if (modal.hasClass('exit-window') && !checkCookie) {
                jQuery('html').on('mouseleave',function () {
                    if (!modal.hasClass('loaded')) {
                        jQuery('.modal-box .image img').attr('src', jQuery('.modal-box .image img').attr('data-src'));
                        setInterval(function () {
                            modal.addClass('active');
                        }, 200);
                    }
                });
            }

            if (modal.hasClass('last-time') && !checkCookie) {
                setInterval(function () {
                    modal.addClass('active');
                    jQuery('.modal-box .image img').attr('src', jQuery('.modal-box .image img').attr('data-src'));
                }, 20000);
            }
            if (modal.hasClass('init-start') && !checkCookie) {
                modal.addClass('active');
                jQuery('.modal-box .image img').attr('src', jQuery('.modal-box .image img').attr('data-src'));
            }

            jQuery('.email-modal .close-icon,.email-modal .shadow').on('click', function() {
                Cookies.set('modal-news', 'true', { expires: 5 });
                modal.addClass('loaded');
            });

        },
        getAjax: function (url, result) {
            jQuery.ajax({
                method: "GET",
                url: url,
                success: function(response) {
                    result(response);
                },
                error : function (jqXHR, status, errorThrown) {
                    result({ error: true });
                    var response = JSON.parse(jqXHR.responseText);
                }  
            });
        },
        ajaxGet: function (url, result) {
            jQuery.ajax({
                method: "GET",
                url: url,
                success: function( response) {
                    result(response);
                },
                error: function( jqXHR, status, errorThrown ){
                    result({error: true});
                    var response = JSON.parse( jqXHR.responseText );
                }    
            });
        },
        organizeNewsletterPage: function() {

            if (jQuery('.page-newsletter .formulario-newsletter').length) {

                let placeholder = $('<div/>').html('Digite o c&oacute;digo ao lado').text();
                jQuery('.page-newsletter .formulario-newsletter .box-captcha-newsletter input').attr('placeholder', placeholder);
                jQuery('.formulario-newsletter .newsletterBTimg').html('Confirmar').removeClass().addClass('botao-commerce');

            } else {

                jQuery('.page-newsletter .page-content').addClass('success-message-newsletter');
                jQuery('.page-newsletter .page-content.success-message-newsletter .board p:first-child a').addClass('botao-commerce').html('Voltar para p&aacute;gina inicial');

            }

            setTimeout(function() {
                jQuery('.page-newsletter .page-content').addClass('show');
            }, 200);

        },

        organizeStoreReviewsPage: function(){

            jQuery('.page-content .container').append('<div class="botao-commerce depoimento-event">Deixe seu depoimento</div>');
            jQuery('#depoimento #aviso_depoimento').after('<button type="button" class="botao-commerce send-store-review">Enviar</button>');

            jQuery('.page-content h2:first').appendTo('.depoimentos-modal .append');
            jQuery('#depoimento').appendTo('.depoimentos-modal .append');

            jQuery('#comentario_cliente').remove();
            jQuery('.depoimentos-modal .append #depoimento a').remove();

            jQuery('.botao-commerce.depoimento-event').on('click', function(){
                jQuery('.depoimentos-modal').addClass('active');
            });

        },

        validateStoreReviewForm: function(){

            jQuery('.depoimentos-modal #depoimento').validate({
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
            });

            jQuery('.depoimentos-modal #depoimento .send-store-review').on('click', function() {

                let form = jQuery('.depoimentos-modal #depoimento');
                let button = jQuery(this);

                if (form.valid()) {

                    button.html('Enviando...').attr('disabled', true);
                    enviaDepoimentoLoja();

                }

            });

            /* Create observer to detect Tray return */

            let target = jQuery('#aviso_depoimento').get(0);
            let config = { attributes: true };

            let observerReviewMessage = new MutationObserver(function(mutationsList, observer){
                jQuery('.depoimentos-modal #depoimento .send-store-review').html('Enviar').removeAttr('disabled');
            });

            observerReviewMessage.observe(target, config);


        },

        organizeContactPage: function(){

            /* Basic organization */

            jQuery('.page-contact .site-main .page-content > .container').wrapInner('<div class="contact-page-content"></div>');

            let contactFrom = jQuery('.page-contact .contact-page-content .formulario-contato').closest('.container2 .board').detach();
            let contactInfo = jQuery('.page-contact .contact-page-content .contato-telefones').closest('.container3').detach();

            jQuery('.page-contact .contact-page-content').wrapInner('<div class="contact-header"></div>');

            jQuery('.page-contact .contact-page-content').append('<div class="contact-form"></div>');
            jQuery('.page-contact .contact-page-content .contact-form').append(contactFrom);


            jQuery('.page-contact .contact-page-content').append('<div class="contact-info"></div>');
            jQuery('.page-contact .contact-page-content .contact-info').append(contactInfo);
            jQuery('.page-contact .contact-page-content .contact-info').prepend('<h2 class="contact-subtitle">Informa&ccedil;&otilde;es para contato</h2>');

            if(jQuery('.page-contact .map-iframe').length){
                jQuery('.page-contact .map-iframe').detach().appendTo('.page-contact .contact-page-content .contact-info');
            }

            /* Contact header */

            let title = jQuery('.page-contact .contact-page-content .contact-header h1').detach().removeAttr('class');
            let description = jQuery('.page-contact .contact-page-content .contact-header > .board p').html().replace('<br>', ' ');

            jQuery('.page-contact .contact-page-content .contact-header').html('');
            jQuery('.page-contact .contact-page-content .contact-header').append(title);
            jQuery('.page-contact .contact-page-content .contact-header').append(`<span class="contact-description">${description}</span>`);

            /* Contact form */

            let formTitle = jQuery('.page-contact .contact-page-content .contact-form .tit-contato').text();
            jQuery('.page-contact .contact-page-content .contact-form .tit-contato').replaceWith(`<h2 class="contact-subtitle">${formTitle}</h2>`);
            jQuery('.page-contact .contact-page-content .contact-form .msg-obriga').detach().insertAfter('.page-contact .contact-page-content .contact-form .contact-subtitle');

            let placeholder = $('<div/>').html('Digite o c&oacute;digo da imagem ao lado').text();
            jQuery('.page-contact .contact-page-content .contact-form #texto_captcha').attr('placeholder', placeholder);

            jQuery('.page-contact .contact-page-content .contact-form .obriga').each(function(){
                let element = jQuery(this).closest('label').find('span.block');
                element.html(element.html().replace('*', '')).addClass('required');
            });

            jQuery('.page-contact .contact-page-content .contact-form label span.block').each(function(){
                jQuery(this).html(jQuery(this).html().replace(':', ''));
            });

            /* Contact info */

            jQuery('.page-contact .contact-page-content .contact-info .topBorder').remove();
            jQuery('.page-contact .contact-page-content .contact-info .bottom').remove();

            jQuery('.page-contact .contact-page-content .contact-info .contato-telefones').children().each(function(){
                let formattedNumber = jQuery(this).text();
                let number = formattedNumber.replace(/\D/g, '');
                jQuery(this).replaceWith(`<a href="tel:${number}">${formattedNumber}</a>`);
            });

            jQuery('.page-contact .page-content').addClass('show');

            jQuery('.page-contact form img.image').after('<div class="flex justify-end"><button type="submit" class="botao-commerce">ENVIAR</button></div>').remove();

        }

    }

    theme.init();
    window.theme = theme;

})(jQuery, window)

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function toReal(value, str_cifrao) {
    return str_cifrao + ' ' + value.formatMoney(2, ',', '.');
}

Number.prototype.formatMoney = function(precision = 2, decimal = '.', thousands = ',', withCurrency = false) {

    const placeholderRegex = /{{\s*(\w+)\s*}}/;
    const format           = 'R$ {{amount}}';

    let number = this.toFixed(precision);

    let parts         = number.split('.');
    let dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, `$1${thousands}`);
    let centsAmount   = parts[1] ? decimal + parts[1] : '';
    let value         = dollarsAmount + centsAmount;

    return (withCurrency) ? format.replace(placeholderRegex, value) : value;

}