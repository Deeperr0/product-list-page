const productListContainer = document.querySelector(".product-list");

let productList = [];

fetch("data.json")
	.then((response) => response.json())
	.then((json) => {
		console.log(json);
		json.map((product) => {
			productList = json;
			productListContainer.innerHTML += `
        <!-- Card component -->
        <div class="product-card flex-col">
            <div class="flex-col">
                <img
                    src="${product.image.desktop}"
                    alt="${product.name}"
                    class="product-image"
                />
                <button class="preset-4-bold add-to-cart-button" id="${product.name}">
                    <img src="./assets/images/icon-add-to-cart.svg" /> Add to cart
                </button>
            </div>
            <div class="product-info">
                <p class="product-category preset-4">${product.category}</p>
                <p class="product-name preset-3">${product.name}</p>
                <p class="product-price preset-3">$${product.price}</p>
            </div>
        </div>`;
		});
	})
	.then((response) => {
		const addToCartButtons = document.querySelectorAll(".add-to-cart-button");
		addToCartButtons.forEach((button) => {
			button.addEventListener("click", addToCart);
		});
	});

const cartList = document.getElementById("products-in-cart");
const cartContainer = document.querySelector(".cart");
if (document.cookie.includes("cartItems")) {
	const retrievedCartList = JSON.parse(
		document.cookie
			.split(";")
			.find((row) => row.startsWith("cartItems"))
			?.split("=")
	);
	if (retrievedCartList) {
		retrievedCartList.forEach((itemInCart) => {
			cartList.innerHTML += `<div>${itemInCart.name}</div>`;
		});
		cartContainer.innerHTML += `<button class="preset-3 confirm-order-button">Confirm order</button>`;
	}
} else {
	cartList.innerHTML = `<div>
			<img src="./assets/images/illustration-empty-cart.svg" />
			<p>Your added items will appear here.</p>
		</div>`;
}

function addToCart(event) {
	let itemsToAdd = [];
	if (document.cookie.includes("cartItems")) {
		const retrievedCartList = JSON.parse(
			document.cookie
				.split(";")
				.find((row) => row.startsWith("cartItems"))
				?.split("=")[1]
		);
		console.log(retrievedCartList);
		if (retrievedCartList[event.target.id]?.quantity != null) {
			retrievedCartList[event.target.id].quantity++;
			itemsToAdd = retrievedCartList;
		} else {
			productList.map((product) => {
				if (event.target.id === product.name) {
					itemsToAdd = [
						retrievedCartList,
						{
							[product.name]: {
								price: product.price,
								quantity: retrievedCartList[product.name].quantity + 1,
							},
						},
					];
				}
			});
		}
		document.cookie = "cartItems=" + JSON.stringify(itemsToAdd);
	} else {
		const product = productList.find(
			(product) => event.target.id === product.name
		);
		document.cookie =
			"cartItems=" +
			JSON.stringify({
				[product.name]: {
					price: product.price,
					quantity: 1,
				},
			});
	}
	location.reload();
}
