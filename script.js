const screenWidth = window.innerWidth;
const productListContainer = document.querySelector(".product-list");
const cartList = document.getElementById("products-in-cart");
const cartContainer = document.querySelector(".cart");

let productList;

fetch("data.json")
	.then((response) => response.json())
	.then((json) => {
		productList = displayProducts(json);
	});

displayCart();

function displayProducts(products) {
	const retrievedCartList = retrieveCartList();
	productListContainer.innerHTML = "";
	products.map((product) => {
		if (!JSON.stringify(retrievedCartList).includes(product.name)) {
			productListContainer.innerHTML += `
			<!-- Card component -->
			<div class="product-card flex-col">
				<div class="flex-col">
					<img
						src="${
							screenWidth > 768
								? product.image.desktop
								: screenWidth > 375
								? product.image.tablet
								: product.image.mobile
						}"
						alt="${product.name}"
						class="product-image"
					/>
					<button class="preset-4-bold add-to-cart-button" onclick="addToCart('${
						product.name
					}')"">
						<img src="./assets/images/icon-add-to-cart.svg" /> Add to cart
					</button>
				</div>
				<div class="product-info">
					<p class="product-category preset-4">${product.category}</p>
					<p class="product-name preset-3">${product.name}</p>
					<p class="product-price preset-3">$${product.price}</p>
				</div>
			</div>`;
		} else {
			productListContainer.innerHTML += `
			<!-- Card component -->
			<div class="product-card flex-col">
				<div class="flex-col">
					<img
						src="${product.image.desktop}"
						alt="${product.name}"
						class="product-image border-red"
					/>
					<button class="preset-4-bold add-subtract-item">
						<img src="./assets/images/icon-decrement-quantity.svg" onclick="decrementItemQuantity('${
							product.name
						}')" />
						<p class="preset-4-bold">${retrievedCartList[product.name].quantity}</p>
						<img src="./assets/images/icon-increment-quantity.svg" onclick="incrementItemQuantity('${
							product.name
						}')"/>
					</button>
				</div>
				<div class="product-info">
					<p class="product-category preset-4">${product.category}</p>
					<p class="product-name preset-3">${product.name}</p>
					<p class="product-price preset-3">$${product.price}</p>
				</div>
			</div>`;
		}
	});
	return products;
}

function displayCart() {
	if (document.cookie.includes("cartItems")) {
		const retrievedCartList = retrieveCartList();
		const itemNames = Object.keys(retrievedCartList);
		if (itemNames.length > 0) {
			const totalQuantity = itemNames.reduce(
				(accumulator, currentValue) =>
					accumulator + retrievedCartList[currentValue].quantity,
				0
			);
			document.querySelector(
				".cart-title"
			).innerHTML = `Your Cart (${totalQuantity})`;
			cartList.innerHTML = "";
			itemNames.map((itemInCart) => {
				cartList.innerHTML += `
				<div class="flex cart-item-container">
					<div class="cart-item flex-col">
						<p class="cart-item-name preset-4-bold">${itemInCart}</p>
						<div class="flex cart-item-info">
							<p class="cart-item-quantity preset-4-bold">
								${retrievedCartList[itemInCart].quantity}x
							</p>
							<p class="cart-item-unit-price preset-4">
								@ $${retrievedCartList[itemInCart].price}
							</p>
							<p class="cart-item-price preset-4-bold">
								$${retrievedCartList[itemInCart].price * retrievedCartList[itemInCart].quantity}
							</p>
						</div>
					</div>
					<div>
						<button class="remove-cart-item" onclick="handleDeleteItem('${itemInCart}')")">
							<img src="./assets/images/icon-remove-item.svg" />
						</button>
					</div>
				</div>`;
			});
			const totalPrice = itemNames.reduce(
				(accumulator, currentValue) =>
					accumulator +
					retrievedCartList[currentValue].price *
						retrievedCartList[currentValue].quantity,
				0
			);
			document.querySelector(".cart-total").innerHTML = `
			<div>
				<div class="flex order-total-container">
					<p>Order Total</p>
					<p class="preset-2">$${totalPrice}</p>
				</div>
				<div class="carbon-neutral-container">
					<div class="flex">
						<img src="./assets/images/icon-carbon-neutral.svg" class="carbon-neutral-icon" />
						<p class="preset-4">This is a <span class="preset-4-bold"> carbon-neutral </span> delivery</p>
					</div>
				</div>
				<button class="preset-3 confirm-order-button">Confirm order</button>
			</div>`;
		} else {
			document.querySelector(".cart-title").innerHTML = `Your Cart`;
			document.querySelector(".cart-total").innerHTML = "";
			cartList.innerHTML = `<div>
				<img src="./assets/images/illustration-empty-cart.svg" />
				<p>Your added items will appear here.</p>
			</div>`;
		}
	} else {
		document.querySelector(".cart-total").innerHTML = "";
		cartList.innerHTML = `<div>
				<img src="./assets/images/illustration-empty-cart.svg" />
				<p>Your added items will appear here.</p>
			</div>`;
	}
}

function addToCart(productName) {
	const retrievedCartList = retrieveCartList();
	let itemsToAdd = [];
	if (document.cookie.includes("cartItems")) {
		productList.map((product) => {
			if (productName === product.name) {
				itemsToAdd = {
					...retrievedCartList,
					[product.name]: {
						price: product.price,
						quantity: 1,
					},
				};
			}
		});
		document.cookie = "cartItems=" + JSON.stringify(itemsToAdd);
	} else {
		const product = productList.find((product) => productName === product.name);
		document.cookie =
			"cartItems=" +
			JSON.stringify({
				[product.name]: {
					price: product.price,
					quantity: 1,
				},
			});
	}
	displayCart();
	displayProducts(productList);
}

function handleDeleteItem(item) {
	const retrievedCartList = retrieveCartList();
	if (retrievedCartList != null) {
		delete retrievedCartList[item];
		document.cookie = "cartItems=" + JSON.stringify(retrievedCartList);
	}
	displayCart();
	displayProducts(productList);
}
function retrieveCartList() {
	const retrievedCartList = JSON.parse(
		document.cookie
			.split("; ")
			.find((row) => row.startsWith("cartItems"))
			?.split("=")[1] ?? ""
	);
	return retrievedCartList;
}
function incrementItemQuantity(item) {
	const retrievedCartList = retrieveCartList();
	retrievedCartList[item].quantity++;
	itemsToAdd = retrievedCartList;
	document.cookie = "cartItems=" + JSON.stringify(itemsToAdd);
	displayCart();
	displayProducts(productList);
}
function decrementItemQuantity(item) {
	const retrievedCartList = retrieveCartList();
	if (retrievedCartList[item].quantity == 1) {
		delete retrievedCartList[item];
	} else {
		retrievedCartList[item].quantity--;
	}
	document.cookie = "cartItems=" + JSON.stringify(retrievedCartList);
	displayCart();
	displayProducts(productList);
}
