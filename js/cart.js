(function(jQuery, window) {
    var cart = {
        customerId: null,
        loadCustomerId: function(){
            if(!cart.customerId){
                const customerInfo = dataLayer.find(element => ('customerId' in element));
                cart.customerId = customerInfo ? customerInfo.customerId : null;   
                console.log('cart.customerId',cart.customerId); 
            }        
        },
        session: function () {
            return jQuery("html").attr("data-session");
        },
        idStore: function(){
            return jQuery("html").attr("data-store");
        },
        removeProduct: function (element){
            var id = parseInt(jQuery(element).attr('data-id'));
            var variant = '/'+jQuery(element).attr('data-variant');
            var addText = jQuery(element).attr('data-add') == "" ? '' : "/?additional_information=" + jQuery(element).attr('data-add');
            var together = jQuery(element).attr('data-together') !== '' ? '/'+jQuery(element).attr('data-together') : ''; 
    
            jQuery.ajax({
                method: "DELETE",
                url: "/web_api/carts/" + cart.session() + "/" + id + variant + together + addText,
                success: function (response) {
                    cart.listProduct();
                },
                error : function (error) {
                    cart.listProduct();
                }
            });

        },
        listProduct: function(msg){
            jQuery.ajax({
                method: 'GET',
                url: '/checkout/cart/api?session_id='+cart.session()+'&store_id='+cart.idStore()+'&nocache=0.'+new Date().getTime(),
                success: function(r) {
    
                    var forList = r.data.cart.products;    
                    var addList = [];
    
                    forList.forEach(function(list){
                        addList.push({
                            "Cart": {
                                "email": "",
                                "variants_kit": list.variants_kit || "",
                                "additional_info_kit": list.additional_info_kit || "",
                                "price_itens_kit": list.price_itens_kit || "",
                                "product_id": list.id,
                                "product_name": list.name,
                                "quantity": list.quantity,
                                "price": list.price,                                
                                "variant_id": list.variant_id || "0",
                                "additional_information": list.additional_information,
                                "product_url": list.url,
                                "bought_together_id": list.bought_together_id || "",
                                "product_image": list.images, // alter images template
                                "error_add": msg && msg.id == list.id_item ? msg.msg : ""
                            }
                        })
                    });
    
                    cart.forProduct(addList);
                },
                error: function(){
                    cart.forProduct([]);
                }
            });
        },
        number: function(number){
            jQuery('.cart-header .number').text(number);
        },
        total: function(price){
            jQuery('.cart-sidebar .total .value').text(toReal(parseFloat(price), ''));
        },
        forProduct: function (listProducts) {
            var listDom = jQuery('.cart-sidebar .content-cart .list');
            listDom.find('*').remove();
            listDom.parent().removeClass('empty');
      
            jQuery('.modal-theme').removeClass('active');
      
            jQuery('.cart-header').addClass('active');
      
            var qnt = 0;
            var total = 0.0;
      
            var listId = [];
            if (listProducts.length){
      
                listProducts.forEach(function (product) {

                    product = product.Cart;
                    
                    var addMsg = product.additional_information;
                    prices = product;
                    // product.productImage.thumbs[90].https;
                    listDom.append(cart.templateProduct(product.product_id, product.variant_id, product.product_name, product.product_image.medium, product.quantity, product.price, product.price, product.product_url.https,addMsg,product.additional_info_kit, product.bought_together_id, product.error_add));
                    qnt += parseInt(product.quantity);
      
                    total += (parseFloat(product.price) * parseInt(product.quantity));
                
                    listId.push(parseInt(product.product_id));
                    
                });
                cart.number(qnt);
                cart.total(total);
                
            }else{
                listDom.append('<div class="error"><div clas="text">Carrinho Vazio</div></div>');
                listDom.parent().addClass('empty');
                cart.number(0);
      
                jQuery('body').find('.add-cart .buy-product').each(function(){
                    if(jQuery(this).hasClass('active')) jQuery(this).removeClass('active').find('.text').text('Comprar');
                });
                
            }
        },
        startCart: function () {
            jQuery('.cart-header').on('click', '.area', function(){
                if(jQuery(this).parent().hasClass('active')){
                    jQuery('.cart-header').removeClass('active');
                } else {
                    cart.showCart();
                }
                
            });
            
            jQuery('body').on('click', '.shadow-cart, .shadow-cart-header, .box-prev, .close-nav,.box-fixed .close-box,.close-modal,.close-icon,.modal-theme .shadow', function(e){
                jQuery('.cart-sidebar, .nav-mobile,.box-fixed,.modal-theme,.cart-header').removeClass('active');
            });
      
            this.initAdd();
      
            // add product variant
            jQuery('.product-submit').on('submit', function(e){
                e.preventDefault();
                var variant = jQuery(this).find('.select').val();
                var quantity = jQuery(this).find('.quantity').val();
                var product_id = jQuery(this).find('.quantity').attr('data-id');
                if(variant) cart.addVariantComplete(variant, quantity, product_id);
            });
      
            jQuery('.remove-items').on('click', function() {
                cart.removeCart();
            });
            
        },
        removeCart: function() {
            jQuery.ajax({
                method: "DELETE",
                url: "/web_api/carts/" + cart.session(),
                success: function(response) {
                    cart.listProduct();
                },
                error : function (error) {
                    cart.listProduct();
                }   
            });
        },
        showCart: function(msg){
            cart.listProduct(msg);
            
            if(jQuery('.header .menu').is(':visible')){
                jQuery('html, body').animate({
                    scrollTop: 0
                });
            }
        },
        templateProduct: function (id,variant,name,image,qnt,dataPrice,price,url,addMsg,infoKit,together,addError) {
            var template = '\
                <div class="item">\
                    <div class="box-cart flex align-center">\
                        <div class="box-image">\
                            <a href="{url}" class="image">\
                                <img src="{image}" alt="{name}">\
                            </a>\
                        </div>\
                        <div class="info-product">\
                            <div class="line-top flex justify-between">\
                                <a href="{url}" class="name t-color">{name}</a>\
                                <div class="remove" data-id="{id}" data-variant="{variant}" data-together="{together}" data-add="{addMsg}" onclick="cart.removeProduct(this)">\
                                    <span class="ic-trash"></span>\
                                </div>\
                            </div>\
                            <div class="line-down flex align-center">\
                                <div class="qnt">Qnt: {length}</div>\
                                <div class="price" data-price="{dataPrice}">{price}</div>\
                                <div class="errorStock">{addError}</div>\
                            </div>\
                        </div>\
                    </div>\
                </div>\
            ';
    
            template = template.replace(/{url}/g,url);
            template = template.replace(/{image}/g,image);
            template = template.replace(/{name}/g,name);
            template = template.replace(/{id}/g,id);
            template = template.replace(/{variant}/g,variant);
            template = template.replace(/{length}/g,qnt);
            template = template.replace(/{addMsg}/g,addMsg);
            template = template.replace(/{together}/g,together);
            template = template.replace(/{dataPrice}/g,dataPrice);
            template = template.replace(/{addError}/g,addError);
            price = toReal(parseFloat(price), jQuery('.cart-header .number').data('moeda'));
            template = template.replace(/{price}/g,price);
            return template;
        },
        addVariantComplete: function(variant, quantity, productId){
            
            cart.loadCustomerId();

            const data = {
                Cart: {
                    session_id : cart.session(),
                    product_id : productId,
                    variant_id : variant ? variant : 0,
                    quantity   : quantity
                }
            };

            if(cart.customerId){
                data.Cart.customer_id = cart.customerId;
            }

            jQuery.ajax({
                method: 'post',
                url: '/web_api/cart/',
                dataType: 'json',
                data: data,        
                success: function( response, textStatus, jqXHR ) {
                    cart.showCart();
                },  
                error: function( jqXHR, status, errorThrown ){
                    window.location.href = jQuery('.modal-product').find('.name a').attr('href');
                }   
            });

        },
        filterVariant: function(variants, selects){
            var i = 0;      
            var select = selects.eq(0).val();
      
            if(!!select){
                var select2 = selects.eq(1).val();
                while(i < variants.length){
                    if(variants[i].option == select && variants[i].option2 == select2){                    
                        return variants[i];
                    }
                    i++;
                }
            }
            return 500;
        },
        stockAlert: function(e){
            var variant = cart.filterVariant(jQuery(e).data('variants'), jQuery(e).find('select'));
            var quant = Number(e.find('input[type="number"]').val());
      
            e.find('input[type="number"]').attr('max', variant.stock).attr('data-variant', variant.id);
      
            var numberFormat = new Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' });
            var price = numberFormat.format(variant.price.price);
            var payment = variant.price.payment;
      
            e.closest('.product').find('.info-product .down-line .box-price').html('<div class="price-off new-price">'+ price +'</div><div class="product-payment">'+ payment +'</div>');
      
            if(Number(variant.stock) >= quant) {
                jQuery(e).removeClass('dont-stock');
            } else{
                jQuery(e).addClass('dont-stock');
            }
            
        },
        initAdd: function () {
      
            jQuery('body').on('change', '.add-cart input', function(){
                var total = Number(jQuery(this).val());
                jQuery(this).val(total > 0 ? total : 1);
            });
      
            jQuery('body').on('change', '.list-variants select', function() {
                
                if(jQuery(this).hasClass('first')){
                    if(jQuery(this).parents('.list-variants').find('.second').val() || !jQuery(this).parents('.list-variants').find('.second').length){
                        cart.stockAlert(jQuery(this).parents('.list-variants'));
                    }
                } else{
                    if(jQuery(this).parents('.list-variants').find('.first').val()){            
                        cart.stockAlert(jQuery(this).parents('.list-variants'));
                    }
                }
                
            });
      
            jQuery('body').on('submit', '.list-variants', function(e){
                e.preventDefault();
      
                if(jQuery(this).hasClass('dont-stock')) return false;            
                var id = jQuery(this).data('id');
                var quant = jQuery(this).find('input').val();
                var href = jQuery(this).parents('.product').find('> a').attr('href');
                var variant = jQuery(this).data('variants').length ? jQuery(this).find('input').attr('data-variant') : 0;
                var validaApi = jQuery(this).data('api-cart');
      
                cart.addToCart(id, quant, variant, href, validaApi);
            });
        },
        submitAdd: function submitAdd(){
            jQuery('.add-cart-modal').on('submit', 'form', function(e){
                e.preventDefault();
                var productId = jQuery(this).find('#product_modal').val();
                var quant =jQuery(this).find('#quant_modal').val();
                var variant =jQuery(this).find('#variant_modal');
      
                if(variant.hasClass('required')){
                    jQuery('#alert-modal-add').removeClass('tray-hide')
                    return;
                }
      
                jQuery('.action-add .add-cart').attr('disabled');
      
                cart.addVariantComplete(variant.val(), quant, productId, valApi);
                
            });
        },
        addToCart: function(productId, quantity, variant, href, valApi){
            
            if (valApi == 1){
                cart.loadCustomerId();

                const data = {
                    Cart: {
                        session_id : cart.session(),
                        product_id : productId,
                        variant_id : variant ? variant : 0,
                        quantity   : quantity
                    }
                };

                if(cart.customerId){
                    data.Cart.customer_id = cart.customerId;
                }

                jQuery.ajax({
                    method: 'post',
                    url: '/web_api/cart/',
                    dataType: 'json',
                    data: data,
                    success: function() {
                        cart.showCart();
                    },
                    error: function( ){
                        window.location.href = href;
                    }    
                });

            } else {
                const storeId = jQuery('html').data('store');
                const callback = encodeURIComponent(`/loja/cartService.php?loja=${storeId}&acao=incluir&IdProd=${productId}&variacao=${  variant ? variant : 0 }`);


                jQuery.ajax({
                    method: 'post',
                    url: `/mvc/store/element/snippets/cart_preview/?loja=${storeId}&callback=${callback}`,    
                    data: {
                        quant: quantity
                    },
                    success: function() {
                        cart.showCart();
                    },
                    error: function( ){
                        window.location.href = href;
                    }    
                });
            }

        },
        ajaxGet: function(url, result){
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
    }


    cart.startCart();
    window.cart = cart;
    
    jQuery(".cart-sidebar").on('click','.remove', function () {
        cart.removeProduct(this);
    });

    jQuery('.compreJunto').on('submit', function() {
        var form = jQuery(this);
        if (!form.find('.blocoAlerta').is(':visible')) {
            var interval = setInterval(function () {
                if (jQuery('.cart-preview-loading-modal').hasClass('tray-hide')) {
                    cart.showCart();
                    clearInterval(interval);
                }
            }, 50);
        }
    });        
    
})(jQuery, window);
