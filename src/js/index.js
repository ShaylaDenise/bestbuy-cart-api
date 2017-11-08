import request from "./bestbuy";
// Display 2 slides and slide width at 50% of screen width
window.slider = $('.slider').bxSlider({
		maxSlides: 2,
		slideWidth: $('.slider').width(),
		slideMargin: 10,
		pager: false,
	});

export default class App{
	constructor(){
		this.initBBCall('(categoryPath.id=abcat0502000)');
	}
	// Best Buy request
	initBBCall (path) { // declare path as argument
		request({url: "https://api.bestbuy.com/v1/products"+path ,api : "8ccddf4rtjz5k5btqam84qak"})
		.then(data => {
			let array = data.products;
			console.log(array);

			// add items to carousel
			$.each( array, function (index, value) {
					var brandText = value.manufacturer;
					var descriptionText = value.albumTitle;
					var photoImg = value.image;
					var priceText = `${value.salePrice}`;

					// creating html elements to hold product info
					var productInfo = $(`<li class="product-info"></li>`);
					var brand = $(`<p class="brand"></p>`);
					var description = $(`<p class="description"></p>`);
					var photo = $(`<img class="photo" src="${photoImg}"></img>`);
					var price = $(`<p class="price"></p>`);
					var button = $(`<button class="add-cart" data-sku="${value.sku}" data-salePrice="${value.salePrice}">Add to cart</button>`);

					brand.text(brandText);
					description.text(descriptionText);
					price.text(priceText);
					// append items to slider
					productInfo.append(brand, description, photo, price, button);
					$('.slider').append(productInfo);
				})
				// display modal when add to cart is clicked
				$('.add-cart').on('click' , function() {
				  $('.modal').css({
						'display':'block'
					});
					// display shade when add to cart is clicked
					$('.shade').css({
						'display':'block'
					});
				});
				// display modal when shopping cart is clicked
				$('.shopping-cart').on('click' , function() {
				  $('.modal').css({
						'display':'block'
					});
					// display shade when shopping cart is clicked
					$('.shade').css({
						'display':'block'
					});
				});
				// Hide modal when closed with x button
				$('.cls-btn').on('click' , function() {
					$('.modal').css({
						'display':'none'
					});
					// Hide shade when closed with x button
					$('.shade').css({
						'display':'none'
					});
				});
				// reload slider
					window.slider.reloadSlider();


		})
		.catch(error => {
			console.log("warning Christopher Robins... Error");
			console.log(error);
		});
	};

}

let x = new App;
// clear bxSlider when new category is clicked, then repopulate new request
$(document).ready(function () {
	$('.categories').on('click','li' ,function (){
		$('.slider').empty();
		var catId = $(this).attr('id');
		x.initBBCall(catId);
	});
	// add 1 to quantity when add-cart button is clicked
	$('.slider').on('click','.product-info .add-cart' , function (){
		var skuu = $(`<div class="product"> sku  : <span id="sku"></span></div>`);
		var quantity = $(`<div class="quan"> quantity : <input class="input"></input></div>`);
		var total = $(`<div class=:"total"> |  total  : <span id="individual-total"></span></div>`);
		var updateBtn = $(`<button class="update">UPDATE</button>`);
		var removeBtn = $(`<button class="remove">REMOVE</button>`);

		// append items to modal
		$('.modal-content').append(sku , quantity , total , updateBtn , removeBtn);

		console.log('i am working');
		let sku = $(this).data('sku');
		let product = {
			price : $(this).data('saleprice'),
			qty : parseInt(1),
		}
			if (sessionStorage.getItem(sku) === null){
				sessionStorage.setItem(sku, JSON.stringify(product));
			}
			else {
				let oldVal = JSON.parse(sessionStorage.getItem(sku));
				let newVal = oldVal;
				newVal.qty += parseInt(1);
				sessionStorage.setItem(sku, JSON.stringify(newVal));
		}
		$('#qty').append(product.qty);
		$('#individual-total').append(product.price);
		$('#total').append(product.price);
		$('#sku').append(sku);

		console.log(product);

		$('.modal-content').on('click' , '.product .update' , function () {
			sessionStorage.getItem(sku,product);
			for (let i=0; i < sessionStorage.length; i++){

			}
		});
		$('.modal-content').on('click' , '.product .remove' , function () {
			sessionStorage.removeItem(sku);
			sessionStorage.removeItem(product.qty);
			sessionStorage.removeItem(product.price);
			$('#qty').empty();
			$('#individual-total').empty();
			$('#total').empty();
			$('#sku').empty();
		});
	});
})
/*
// creating html elements to hold cart info
var modalContent = $(`<div id="modal-content"></div>`);
var totalItems = $(`<div id="items"> total items  : <span id="qty"></span>  |  cart  total  : <span id="total"></span></div>`);
var cartTotal = $(`<div id="cartTtl"> cart  total  : <span id="total"></span></div>`);
var sku = $(`<div class="product"> sku  : <span id="sku"></span></div>`);
var quantity = $(`<div class="quan"> quantity : <input class="input"></input></div>`);
var total = $(`<div class=:"total"> |  total  : <span id="individual-total"></span></div>`);
var updateBtn = $(`<button class="update">UPDATE</button>`);
var removeBtn = $(`<button class="remove">REMOVE</button>`);

// append items to modal
modalContent.append(totalItems , cartTotal , sku , quantity , total , updateBtn , removeBtn);
*/

/*updateCart(){
	$(document).on('click', '.add-cart', function(){
		sessionStorage.getItem(sku,product)
		let allKeys = "";
		let item = "";
		let cartObject = "";
		let items = "";
		let cartPrice = "";
		$('.modal-content').empty();

		for (let i=0; i<sessionStorage.length; i++){
			allKeys = sessionStorage.key(i);
			item = sessionStorage.getItem(allKeys);
			cartObject = JSON.parse(item);
			items =  cartObject.qty;
			cartPrice = (cartObject.cartPrice * items).toFixed(2);
			var createDiv = $("<div></div>");
			createDiv.addClass('singleCartItem');
			$('.modal-content').append(createDiv);
			createDiv.append('SKU:'+allkeys+'   QUANTITY:'+items+'   TOTAL:' + '<button class="remove"> REMOVE </button>');
		}
	});
}*/
// This code is a workaround for IE6's lack of support for the
// position: fixed style.
if (!('maxHeight' in document.body.style)) {
  function modalsize() {
    var top = document.documentElement.scrollTop;
    var winsize = document.documentElement.offsetHeight;
    var docsize = document.documentElement.scrollHeight;
    shade.style.height = Math.max(winsize, docsize)+'px';
  	modal.style.top = top+Math.floor(winsize/3)+'px';
	};
	modal.style.position = shade.style.position = 'absolute';
  window.onscroll = window.onresize = modalsize;
  modalsize();
}


//Applying smooth scroll effect
$('a[href*="#"]')
// Remove links that don't actually link to anything
.not('[href="#"]')
.not('[href="#0"]')
.click(function(event) {
// On-page links
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
      &&
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000, function() {
          // Callback after animation
          // Must change focus!
          var $target = $(target);
          $target.focus();
          if ($target.is(":focus")) { // Checking if the target was focused
            return false;
          } else {
            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
          };
        });
      }
    }
  });

// validate email
function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function validate() {
  $("#result").text("");
  var email = $("#email").val();
  if (validateEmail(email)) {
    $("#result").text(email + " is valid");
    $("#result").css("color", "green" , "font-family" , "Roboto");
  } else {
    $("#result").text("Sorry, " + email + " is not valid");
    $("#result").css("color", "red");
  }
  return false;
}

// Calls function validate
$("#validate").bind("click", validate);
