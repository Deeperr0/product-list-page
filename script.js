const productListContainer = document.querySelector(".product-list");
const cartList = document.getElementById("products-in-cart");
const cartContainer = document.querySelector(".cart");
const orderList = document.querySelector(".order-list");
let productList;

fetch("./data.json")
	.then((response) => {
		if (!response.ok || response.headers.get("content-length") === "0") {
			throw new Error("Empty or missing JSON file.");
		}
		return response.json();
	})
	.then((json) => {
		if (!json || Object.keys(json).length === 0) {
			throw new Error("JSON is empty or not valid.");
		}
		productList = displayProducts(json);
	})
	.catch((error) => {
		console.error("There was a problem with the fetch operation:", error);
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
					<picture class="product-image">
						<source srcset=${
							product.image.desktop
						} media="(min-width: 1024px)" class="product-image" />
						<source srcset=${
							product.image.tablet
						} media="(min-width: 768px)" class="product-image" />
						<img src=${product.image.desktop} alt='${product.name}' class="product-image" />
					</picture>
					<button class="preset-4-bold add-to-cart-button" onclick="addToCart('${
						product.name
					}')">
						<img src="./assets/images/icon-add-to-cart.svg" /> Add to cart
					</button>
				</div>
				<div class="product-info">
					<p class="product-category preset-4">${product.category}</p>
					<p class="product-name preset-3">${product.name}</p>
					<p class="product-price preset-3">$${product.price.toFixed(2)}</p>
				</div>
			</div>`;
		} else {
			productListContainer.innerHTML += `
			<!-- Card component -->
			<div class="product-card flex-col">
				<div class="flex-col">
					<picture class="product-image border-red">
						<source srcset=${product.image.desktop} media="(min-width: 1024px)" />
						<source srcset=${product.image.tablet} media="(min-width: 768px)" />
						<img src=${product.image.desktop} alt='${product.name}' />
					</picture>
					<button class="preset-4-bold add-subtract-item">
						<svg onclick="decrementItemQuantity('${
							product.name
						}')" xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="none" viewBox="0 0 10 2"><path fill="#fff" d="M0 .375h10v1.25H0V.375Z"/></svg>
						<p class="preset-4-bold">${retrievedCartList[product.name].quantity}</p>
						<svg onclick="incrementItemQuantity('${
							product.name
						}')" xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="#fff" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/></svg>
					</button>
				</div>
				<div class="product-info">
					<p class="product-category preset-4">${product.category}</p>
					<p class="product-name preset-3">${product.name}</p>
					<p class="product-price preset-3">$${product.price.toFixed(2)}</p>
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
								@ $${retrievedCartList[itemInCart].price.toFixed(2)}
							</p>
							<p class="cart-item-price preset-4-bold">
								$${(
									retrievedCartList[itemInCart].price *
									retrievedCartList[itemInCart].quantity
								).toFixed(2)}
							</p>
						</div>
					</div>
					<div>
						<button class="remove-cart-item" onclick="handleDeleteItem('${itemInCart}')")">
							<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="#CAAFA7" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/></svg>
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
					<p class="preset-2">$${totalPrice.toFixed(2)}</p>
				</div>
				<div class="carbon-neutral-container">
					<div class="flex">
						<img src="./assets/images/icon-carbon-neutral.svg" class="carbon-neutral-icon" alt="carbon neutral icon" />
						<p class="preset-4">This is a <span class="preset-4-bold"> carbon-neutral </span> delivery</p>
					</div>
				</div>
				<button class="preset-3 confirm-order-button" onclick="handleConfirm()">Confirm order</button>
			</div>`;
		} else {
			document.querySelector(".cart-title").innerHTML = `Your Cart`;
			document.querySelector(".cart-total").innerHTML = "";
			cartList.innerHTML = `<div>
				<img src="./assets/images/illustration-empty-cart.svg" alt="empty cart image" />
				<p>Your added items will appear here.</p>
			</div>`;
		}
	} else {
		document.querySelector(".cart-total").innerHTML = "";
		cartList.innerHTML = `<div>
				<img src="./assets/images/illustration-empty-cart.svg" alt="empty cart image" />
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
						thumbnail: product.image.thumbnail,
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
					thumbnail: product.image.thumbnail,
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
	if (!document.cookie.includes("cartItems")) {
		document.cookie = "cartItems=" + JSON.stringify({});
		return {};
	}
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

function toggleOverlayDisplay() {
	const overlayContainer = document.querySelector(".overlay-container");
	if (overlayContainer.classList.contains("hidden")) {
		overlayContainer.classList.remove("hidden");
		document.querySelector("body").classList.add("noscroll");
	} else {
		overlayContainer.classList.add("hidden");
		document.querySelector("body").classList.remove("noscroll");
	}
}

function handleConfirm() {
	toggleOverlayDisplay();
	orderList.innerHTML = "";
	const retrievedCartList = retrieveCartList();
	Object.keys(retrievedCartList).map((item) => {
		orderList.innerHTML += `
	<div class="order-item flex">
		<div class="flex">
			<img src="${
				retrievedCartList[item].thumbnail
			}" class="order-thumb" alt="${item}"/>
			<div>
				<p class="order-item-name preset-4-bold">${item}</p>
				<div class="flex order-item-stock">
					<p class="preset-4-bold order-item-quantity">${
						retrievedCartList[item].quantity
					}x</p>
					<p class="preset-4 order-item-unit-price">@ ${parseFloat(
						retrievedCartList[item].price
					).toFixed(2)}</p>
				</div>
			</div>
		</div>
		<div>
			<p class="order-item-price preset-3">$${parseFloat(
				retrievedCartList[item].price * retrievedCartList[item].quantity
			).toFixed(2)}</p>
		</div>
	</div>`;
	});
	orderList.innerHTML += `
	<div class="order-total flex">
		<p class="preset-4 order-total-title">Order Total</p>
		<p class="preset-2 order-total-price">$${parseFloat(
			Object.keys(retrievedCartList).reduce(
				(total, item) =>
					total +
					retrievedCartList[item].price * retrievedCartList[item].quantity,
				0
			)
		).toFixed(2)}</p>
	</div>
	`;
}

function handleStartNew() {
	toggleOverlayDisplay();
	document.cookie = "cartItems=" + JSON.stringify({});
	displayCart();
	displayProducts(productList);
}
