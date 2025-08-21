(function($) {
    let product = {

        galleries: {
            thumbs: null,
            main: null,
            fixed: null,
        },

        createSlide: function() {

            this.galleries.thumbs = new Swiper('.nav-swiper', {
                direction: 'vertical',
                slidesPerView: 4,
                updateOnWindowResize: true,
                watchSlidesProgress: true,
                watchSlidesVisibility: true,
                lazy: {
                    loadPrevNext: true,
                },
                navigation: {
                    nextEl: '.product-next',
                    prevEl: '.product-prev',
                },
            });

            this.galleries.main = new Swiper('.featured-swiper', {
                slidesPerView: 1,
                keyboard: true,
                lazy: {
                    loadPrevNext: true,
                },
                pagination: {
                    clickable: true,
                    el: document.querySelector('.featured-swiper .swiper-pagination')
                },
                navigation: {
                    nextEl: '.product-mob-next',
                    prevEl: '.product-mob-prev',
                },
                thumbs: {
                    autoScrollOffset: 3,
                    multipleActiveThumbs: false,
                    swiper: this.galleries.thumbs
                }
            });

            this.galleries.fixed = new Swiper('.slide-fixed', {
                speed: 0,
                loopedSlides: 1,
                lazy: {
                    loadPrevNext: true,
                },
                navigation: {
                    nextEl: '.fixed-next',
                    prevEl: '.fixed-prev',
                },
            });

            jQuery('.featured-swiper .click-to-zoom').on('click', function() {

                let index = jQuery('.featured-swiper .swiper-slide.swiper-slide-active').data('index');

                jQuery('.fixed-modal').addClass('active');
                product.galleries.fixed.slideTo(index, 0, false);

            });

            jQuery('.nav-swiper .swiper-slide').on('focusin', function() {
                product.galleries.thumbs.slideTo($(this).data('index'));
                product.galleries.main.slideTo($(this).data('index'));
            });

        },

        variantImage: function(url) {
            jQuery.ajax({
                method: 'get',
                url: url,
                success: function(response) {
                    if (response.Variant.VariantImage && response.Variant.VariantImage.length) {
                        if (response.Variant.VariantImage[0].https.indexOf('variacao_') === -1) return;
                        product.resetSlider(response.Variant.VariantImage);
                    }
                }
            });
        },

        resetSlider: function(images) {
            if (this.galleries.thumbs !== undefined) {

                this.galleries.thumbs.destroy();
                this.galleries.main.destroy();
                this.galleries.fixed.destroy();

                jQuery('.gallery .swiper-slide, .fixed-modal .swiper-slide').each(function() {
                    jQuery(this).remove();
                });

                let slides = '';
                let thumbs = '';

                $.each(images, function() {

                    slides += `
                        <div class="swiper-slide">
                            <img class="swiper-lazy" data-src="${this.https}" alt="image">
                        </div>
                    `;

                    thumbs += `
                        <div class="swiper-slide">
                            <img class="swiper-lazy" data-src="${this.thumbs[180].https}" alt="image">
                        </div>
                    `;

                });

                jQuery('.gallery .featured-swiper .swiper-wrapper,.fixed-modal .swiper-wrapper').html(slides);
                jQuery('.gallery .nav-swiper .swiper-wrapper').html(thumbs);

                this.createSlide();

            }
        },

        fixedModal: function() {

            jQuery('.fixed-modal .exit, .fixed-modal .shad').on('click', function() {
                jQuery('.fixed-modal').removeClass('active');
            });

        },

        forVisited: function(list) {
            var newList = [];
            var loop = 0;

            list.forEach(function(val) {
                jQuery.ajax({
                    method: "GET",
                    url: "/web_api/products/" + val.id,
                    success: function(response) {
                        if (response.Product) {
                            newList.push(response);
                        }
                        loop++;
                        if (list.length == loop) return product.appendVisited(newList);
                    },
                    error: function(jqXHR) {
                        var response = JSON.parse(jqXHR.responseText);
                        if (response.name == 'Nenhum registro encontrado') {
                            var id = response.url.replace(/\D/g, '');
                            var newSet = list.filter(function(val) {
                                if (val.id != Number(id)) return val;
                            });
                            localStorage.setItem('visited', JSON.stringify(newSet));
                        }
                        loop++;

                        if (list.length == loop) return product.appendVisited(newList);
                    }
                });
            });

        },

        appendVisited: function(list) {

            var template = '<div class="product">\
            <div class="image">\
                <a href="{link}" class="space-image large">\
                    <img class="swiper-lazy transform" src="{image}">\
                </a>\
            </div>\
            <a href="{link}" class="info-product">\
                <div class="product-name">{name}</div>\
                <div class="down-line">{boxPrice}</div>\
            </a>\
        </div>';

            var priceBefore = '<div class="price-before"><span class="line-price">{price}</span></div>';

            var boxPrice = '<div class="box-price">\
            <div class="price">\
                <div class="product-price">\
                    {before}\
                    <span class="price-off">{price}</span>\
                </div>\
            </div>\
            <div class="product-payment">{payment}</div>\
        </div>';


            var listNode = jQuery('.visited-section .list-append');

            var itemsList = '';

            list.forEach(function(v) {
                var product = v.Product;

                var item = template.replace(/{link}/g, product.url.https)
                    .replace(/{image}/g, product.ProductImage[0].https)
                    .replace(/{name}/g, product.name)

                var priceProtion = Number(product.promotional_price);

                if (product.available && Number(product.price)) {
                    var moeda = jQuery('.visited-section .list-append').data('moeda');
                    item = item.replace('{boxPrice}', boxPrice
                            .replace('{before}', priceProtion ? priceBefore.replace('{price}', toReal(Number(product.price), moeda)) : '')
                            .replace('{price}', priceProtion ? toReal(priceProtion, moeda) : toReal(Number(product.price), moeda)))
                        .replace('{payment}', product.payment_option_html);
                } else {
                    item = item.replace('{boxPrice}', product.available ? '<div class="box-price"><div class="price"><div class="product-price"><p>Sob Consulta</p></div></div></div>' : '<div class="box-price"><div class="price"><div class="product-price"><p>Indispon&iacute;vel</p></div></div></div>');
                }

                itemsList += '<div class="item swiper-slide">' + item + '</div>';

            });

            var result = '<div class="swiper-container"><div class="swiper-wrapper list-product">' + itemsList + '</div></div>';

            // end

            listNode.append(result);
            var listSlide = new LazyLoad({
                elements_selector: '.list-append',
                threshold: 300,
                callback_enter: function(e) {
                    var items = e.querySelectorAll('.item').length;

                    var swiperList = new Swiper(e.querySelector('.swiper-container'), {
                        slidesPerView: 4,
                        lazy: {
                            loadPrevNext: false,
                        },
                        navigation: {
                            nextEl: e.querySelector('.next'),
                            prevEl: e.querySelector('.prev'),
                        },
                        loop: items > 4,
                        breakpoints: {
                            0: {
                                slidesPerView: 1,
                                loop: items > 1,
                            },
                            320: {
                                slidesPerView: 2,
                                loop: items > 2,
                            },
                            640: {
                                slidesPerView: 3,
                                loop: items > 3,
                            },
                            1024: {
                                slidesPerView: 4,
                                loop: items > 4,
                            }
                        }
                    });
                }
            });
        },

        productVisitedNew: function() {
            var id = jQuery('#form_comprar').data('id');
            var visited = localStorage.getItem('visited');
            var list = [];

            if (visited) {
                list = JSON.parse(visited).reverse();
            }

            setTimeout(function() {
                list.length ? product.forVisited(list) : jQuery('.visited-section').remove();
            }, 500);

            if (list.length == 10) {
                list.pop();
                list.reverse();
            }

            var valid = true;

            list.forEach(function(val) {

                if (val.id == id) {
                    valid = false;
                }
            });

            if (valid && !jQuery('#form_comprar').hasClass('unavailable')) {
                list.push({ id: id });
                var result = JSON.stringify(list);
                localStorage.setItem('visited', result);
            }

        },

        shipping: function() {
            jQuery('.crazy_cep').mask('00000-000');

            var quantidade = 1;

            jQuery('.new-frete').on('submit', function(e) {
                e.preventDefault();

                if (jQuery('#quant:visible').is(':visible')) {
                    quantidade = jQuery('#quant:visible').val();
                }

                var url2 = jQuery('#shippingSimulatorButton').attr('data-url');

                var cep = jQuery(this).find('input').val().split('-');
                var variant = jQuery('#product-container').find('#selectedVariant').val() ? jQuery('#product-container').find('#selectedVariant').val() : 0;

                url2 = url2.replace('cep1=%s', 'cep1=' + cep[0])
                    .replace('cep2=%s', 'cep2=' + cep[1])
                    .replace('acao=%s', 'acao=' + variant)
                    .replace('dade=%s', 'dade=' + quantidade);

                if (jQuery('#selectedVariant').val() !== '') {
                    jQuery('.box-frete .result').html('<div class="load-css"><div class="icon"></div></div>');

                    jQuery.ajax({
                        method: 'GET',
                        url: url2,
                        success: function(response) {
                            jQuery('.box-frete .result').html(response);

                            jQuery('.box-frete .result').find('table:first, p').remove();
                            jQuery('.box-frete .result').find('img').parent().remove();

                            jQuery('.box-frete .result').find('th:last').text('Prazo:');

                            jQuery('.box-frete .result').find('th[colspan="2"]').removeAttr('colspan');
                            jQuery('.box-frete .result').find('[width]').removeAttr('width');

                            if (jQuery('.box-frete .result').find('tr').length == 1) {
                                jQuery('.box-frete .result').find('tr').after('<tr><td colspan="3">N&atilde;o foi encontrado formas de envio para o CEP</td></tr>');
                                jQuery('.box-frete .result').find('tr:first').remove();
                            }
                        }
                    });
                } else {
                    jQuery('.box-frete .result').html('Escolha uma varia&ccedil;&atilde;o');
                }

            });
        },
        productVariant: function() {

            this.tabs();

            jQuery('.compreJunto form .fotosCompreJunto').append('<div class="plus color to">=</div>');

            jQuery('.box-variants').on('click', '.lista_cor_variacao li[data-id]', function() {
                var url = "/web_api/variants/" + jQuery(this).data('id');
                product.variantImage(url);
            });

            jQuery('.box-variants').on('click', '.lista-radios-input', function() {
                var url = "/web_api/variants/" + jQuery(this).find('input').val();
                product.variantImage(url);
            });

            jQuery('.box-variants').on('change', 'select', function() {
                var url = "/web_api/variants/" + jQuery(this).val();
                product.variantImage(url);
            });

            jQuery('.produto img').each(function() {
                jQuery(this).attr('src', jQuery(this).attr('src').replace('/90_', '/'));

                var href = '';
                if (jQuery(this).parent().attr('href') !== '') {
                    href = 'href="' + jQuery(this).parent().attr('href') + '"';
                }

                jQuery(this).parents('span').after('<a ' + href + ' class="product-name">' + jQuery(this).attr('alt') + '</a>');
            });

            jQuery('.page-product').on('click', '#detalhes_formas', function() {
                var productId = jQuery('#form_comprar').data('id');
                var price = jQuery('#preco_atual').val();

                var link = '/mvc/store/product/payment_options_details?loja=' + theme.storeId() + '&IdProd=' + productId + '&preco=' + price;
                jQuery('.payment-modal').addClass('active');

                jQuery('.payment-modal .append').html('<div class="load-css"><div class="icon"></div></div>');

                jQuery.ajax({
                    method: 'GET',
                    url: link,
                    success: function(response) {
                        jQuery('.payment-modal .append').html(response).find('.tablePage').wrap('<div class="overflow-payment"></div>');
                    }
                });
            });

            jQuery('#form_comprar').on('submit', function() {

                if (!jQuery('.labelMultiVariacao').length) {

                    if (jQuery('#selectedVariant').length && !jQuery('#selectedVariant').val()) {
                        jQuery("#span_erro_carrinho").css("display", "block");
                        return false;
                    }
                }

                if (jQuery(this).hasClass('is-kit')) {

                    let stopAdding = false;

                    jQuery(this).find('input[type="hidden"][name="variants_kit[]"]').each(function(index, value) {
                        if (jQuery(value).val() === '') {
                            jQuery("#span_erro_carrinho").css("display", "block");
                            stopAdding = true;
                            return false;
                        }
                    });

                    if (stopAdding) {
                        return false;
                    }

                }

                jQuery('#loading-product-container').show();
                jQuery('body').removeClass('modal-open').removeAttr('style');
                jQuery('body').find('.modal-backdrop').remove();

                var interval = setInterval(function() {
                    jQuery('body').find('.modal-backdrop').remove();
                    if (jQuery('.cart-preview-loading-modal').hasClass('tray-hide')) {
                        if(jQuery('.cart-preview-item-error').length){
                            var id = jQuery('.cart-preview-item-error').parents('.cart-preview-item').attr('data-item');
                            cart.showCart({msg: '<b>Aten&ccedil;&atilde;o&excl; </b>O estoque do produto n&atilde;o &eacute; suficiente para a quantidade selecionada&excl;', id: id});
                        }
                        else{
                            cart.showCart();
                        }
                        jQuery('#loading-product-container').hide();
                        jQuery('body').find('.botao-continuar-comprando .botao-commerce-img').trigger('click');
                        clearInterval(interval);
                    }
                }, 50);

            });

            jQuery('.compreJunto').on('submit', function() {

                var form = jQuery(this);

                if (!form.find('.blocoAlerta').is(':visible')) {
                    jQuery('#loading-product-comprejunto').show();
                    jQuery('body').removeClass('modal-open').removeAttr('style');
                    jQuery('body').find('.modal-backdrop').remove();

                    var interval = setInterval(function() {
                        if (jQuery('.cart-preview-loading-modal').hasClass('tray-hide')) {
                            //cart.showCart();
                            jQuery('#loading-product-comprejunto').hide();
                            jQuery('body').find('.botao-continuar-comprando .botao-commerce-img').trigger('click');
                            clearInterval(interval);
                        }
                    }, 50);
                }
            });

            var secondSelect = jQuery('#variation_second_select').prev();
            var firstSelct = jQuery('[data-tray-tst="variation_first_select"]');

            if (secondSelect.is(':visible') && !firstSelct.val()) {
                secondSelect.hide();
            }

            firstSelct.on('change', function() {
                secondSelect.show();
            });
        },
        tabs: function() {

            jQuery('[data-id*="AbaPersonalizada"]').each(function() {
                var el = jQuery(this).data('id');
                jQuery(el).removeAttr('style').appendTo(jQuery(this));
            });

            /* Fix comments modal */

            if (jQuery('.section-box.comments').length) {

                jQuery('.section-box.comments').appendTo('.comments-modal .append');

                jQuery('.section-box.comments #comentario_cliente').wrap('<div class="comments-form"></div>');
                let customerComments = jQuery('.section-box.comments .comments-form').detach();

                jQuery('.section-box.comments').wrapInner('<div class="customer-comments"></div>');
                jQuery('.section-box.comments').append(customerComments);

                jQuery('.section-box.comments .customer-comments .tray-hide').remove();
                jQuery('.section-box.comments .customer-comments br').remove();
                jQuery('.section-box.comments .customer-comments .line').remove();

                jQuery('.section-box.comments .customer-comments .title-section').removeClass('title-section').addClass('title-section-comments');
                jQuery('.section-box.comments .customer-comments .title-section-comments + h2.color').detach().prependTo('.section-box.comments .comments-form');

                jQuery('.section-box.comments .customer-comments h2.color').remove();
                jQuery('.section-box.comments .customer-comments .blocoSucesso').detach().appendTo('.section-box.comments .comments-form');

                jQuery('.section-box.comments .customer-comments .title-section-comments').detach().prependTo('.section-box.comments');
                jQuery('.section-box.comments .comments-form br').remove();

                let maxDescription = jQuery('.section-box.comments .comments-form #form-comments h5').html().replace('- M\u00E1ximo', 'M\u00E1ximo');
                jQuery('.section-box.comments .comments-form #form-comments h5').html(maxDescription);

                jQuery('.section-box.comments .comments-form h2').html('Deixe sua avalia\u00E7\u00E3o sobre esse produto');

                if (jQuery('.section-box.comments .customer-comments').children().length === 0) {
                    jQuery('.section-box.comments .customer-comments').html('<span class="no-comments">Nenhuma avalia\u00E7\u00E3o dispon\u00EDvel. Seja o primeiro a avaliar.</span>')
                }

            }

            jQuery('.list-star.cursor').on('click', function() {
                jQuery('.comments-modal').addClass('active');
            });

            jQuery('.ranking .rating').each(function() {
                var av = Number(jQuery(this).attr('class').replace(/[^0-9]/g, ''));

                for (i = 1; i <= 5; i++) {
                    if (i <= av) {
                        jQuery(this).append('<div class="icon active"></div>');
                    } else {
                        jQuery(this).append('<div class="icon"></div>');
                    }
                }
            });

            if (jQuery('#downloads').length) {
                jQuery.get(jQuery('#downloads').data('url'), function(response) {
                    jQuery('#downloads').html(response);
                });
            }

        },
        incrementPage: function incrementPage() {
            this.templateIncrement();

            jQuery('.increment-page').on('click', '.low', function() {
                var input = jQuery('.page-product').find('#quantidade #quant');
                input.val(parseInt(input.val()) == 1 ? 1 : parseInt(input.val()) - 1);
            });

            var verificaVariacao = jQuery('.value-max-stock').attr('data-variant');

            if (verificaVariacao == 0) {

                var input = jQuery('.page-product').find('#quantidade #quant');
                var maxValue = parseInt(jQuery('.value-max-stock').text());

                jQuery('.increment-page').on('click', '.add', function() {
                    var valueCurrent = parseInt(input.val());
                    if (valueCurrent < maxValue) {
                        input.val(valueCurrent + 1);
                    }
                });

            } else {

                jQuery('.increment-page').on('click', '.add', function() {
                    var input = jQuery('.page-product').find('#quantidade #quant');
                    input.val(parseInt(input.val()) + 1);
                });

            }

        },
        templateIncrement: function() {
            if (!jQuery('#product-form-box [name="quant"]').length) {
                jQuery('#product-form-box').prepend('<div data-app="product.quantity" id="quantidade">\
					<label class="color">\
					Quantidade: \
					<input id="quant" name="quant" class="text" size="1" type="text" value="1" maxlength="5" onkeyup="mascara(this,numeros,event);">\
					</label>\
					<span id="estoque_variacao">&nbsp;</span>\
				</div>');
            }

        },
        validEvaluation: function() {
            jQuery(".comments-form .botao-commerce").on('click', function() {
                if(!jQuery(".stars .starn.star-on").length) {
                    var textError = 'Avalia\u00E7\u00E3o do produto obrigat\u00F3ria, d\u00EA sua avalia\u00E7\u00E3o por favor';
                    jQuery(".comments-form .blocoAlerta").text(textError).addClass("show-message");
                    setTimeout(() => {
                        jQuery(".blocoAlerta.show-message").removeClass("show-message");
                    }, 5000);
                }
            })
        }
    }



    product.productVisitedNew();
    product.shipping();
    product.createSlide();
    product.productVariant();
    product.fixedModal();
    product.incrementPage();
    product.validEvaluation();

})(jQuery);