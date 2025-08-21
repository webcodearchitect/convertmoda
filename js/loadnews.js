setTimeout(function(){
    jQuery(document).ready(function(){

        let dataFiles = jQuery('html').data('files');
        let storeId   = jQuery('html').data('store');

        jQuery.ajax({
            url     : `/loja/busca_noticias.php?loja=${storeId}&${dataFiles}`,
            method  : 'get',
            success : function(response){

                let target;
                let news;

                if (!jQuery(response).find('.noticias').length) {
                    jQuery('.section-notices').remove();
                    return;
                }

                jQuery('.section-notices .noticias-content').append('<ul class="noticias"></ul>')

                target = jQuery('.section-notices .noticias-content .noticias');
                news = jQuery(jQuery(response).find('.noticias'));

                news.find('li:nth-child(n+5)').remove();
                news.find('li').wrapInner('<div class="box-noticia"></div>');
                news = news.contents();

                news.each(function (index, news) {

                    let link = jQuery(this).find('#noticia_imagem a').attr('href');
                    let title = jQuery(this).find('#noticia_dados h3 a').text();

                    jQuery(this).find('p').after(`<a href="${link}" class="button-show">Leia mais</a>`);
                    jQuery(this).find('#noticia_imagem img').attr('alt', title).removeAttr('title');

                    let image = jQuery(news).find('img');
                    let source = image.prop('src');
                    image.attr('data-src', source).removeAttr('src').addClass('lazy-notices');

                });

                target.append(news);

                new LazyLoad({
                    elements_selector: '.lazy-notices'
                });

            }
        });

    });
});