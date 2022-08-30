const cartBtn = document.querySelector(".cart-btn");
const cartModal = document.querySelector(".cart");
const backDrop = document.querySelector(".backdrop");
const confirm = document.querySelector(".cart-item-confirm");
const productsDOM = document.querySelector(".product-center");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const clearCart = document.querySelector(".clear-cart");

import { productsData } from "./products.js";
let cart = [];
let buttonsDOM = [];

class Products {
    getProduct() {
        return productsData;
    }
}

class UI {
    displayProducts(products) {
        let result = "";
        products.forEach((item) => {
            result += `<div class="product">
            <img src=${item.imageUrl} alt="" />
            <div class="caption-product" dir ="rtl">
                <div class="price-product">${item.price} ميليون تومان</div>
                <div class="name-product">${item.title}</div>
            </div>
            <button class="btn add-to-cart" data-id ="${item.id}">
            <i class="fas fa-shopping-cart"></i>
            خريد محصول
            </button>
        </div>`;
        });
        productsDOM.innerHTML = result;
    }

    getAddToCartBtns() {
        const addtocartBtns = [...document.querySelectorAll(".add-to-cart")];
        buttonsDOM = addtocartBtns;
        addtocartBtns.forEach((btn) => {
            const id = btn.dataset.id;
            const isInCart = cart.find((p) => p.id === id);
            if (isInCart) {
                btn.innerText = "In Cart";
                btn.disabled = true;
            }
            btn.addEventListener("click", (e) => {
                e.target.innerText = "در سبد موجود شد";
                e.target.disabled = true;
                // get product from products
                const addedProduct = { ...Storage.getProduct(id), quantity: 1 };
                // add to cart
                cart = [...cart, addedProduct];
                // save cart t o localStorage
                Storage.saveCart(cart);
                this.setCartValue(cart);
                this.addCartItem(addedProduct);
            });
        });
    }

    setCartValue(cart) {
        let tempCartItem = 0;
        const totalPrice = cart.reduce((acc, curr) => {
            tempCartItem += curr.quantity;
            return acc + curr.quantity * curr.price;
        }, 0);

        cartTotal.innerText = ` جمع کل : ${totalPrice} ميليون تومان`;
        cartItems.innerText = tempCartItem;
    }

    addCartItem(cartItem) {
        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.innerHTML = `<img src= ${cartItem.imageUrl} class="cart-item-img"/>
        <div class="cart-img-desc">
            <h4> ${cartItem.title}</h4>
            <h5 dir="rtl">${cartItem.price} ميليون تومان</h5>
        </div>
        <div class="cart-item-controller">
            <i class="fas fa-chevron-up" data-id=${cartItem.id}></i>
            <p>${cartItem.quantity}</p>
            <i class="fas fa-chevron-down" data-id=${cartItem.id}></i>
        </div>
        <i class="fas fa-trash" data-id=${cartItem.id}></i>`;
        cartContent.appendChild(div);
    }
    setupApp() {
        // get cart from storage
        cart = Storage.getCart() || [];
        // addCart item
        cart.forEach((cartItem) => this.addCartItem(cartItem));
        // setvalue
        this.setCartValue(cart);
    }

    cartLogic() {
        clearCart.addEventListener("click", () => {
            this.clearCart();
        });
        cartContent.addEventListener("click", (event) => {
            if (event.target.classList.contains("fa-chevron-up")) {
                const addQuantity = event.target;
                const addItem = cart.find((cItem) => cItem.id == addQuantity.dataset.id);
                // console.log(addItem)
                addItem.quantity++;
                this.setCartValue(cart);
                Storage.saveCart(cart);
                addQuantity.nextElementSibling.innerHTML = addItem.quantity;
            } else if (event.target.classList.contains("fa-chevron-down")) {
                const subQuantity = event.target;
                const subItem = cart.find((cItem) => cItem.id == subQuantity.dataset.id);
                subItem.quantity--;
                if (subItem.quantity === 0) {
                    this.removeItem(subItem.id);
                    cartContent.removeChild(subQuantity.parentElement.parentElement);
                }
                this.setCartValue(cart);
                Storage.saveCart(cart);
                subQuantity.previousElementSibling.innerHTML = subItem.quantity;
            } else if (event.target.classList.contains("fa-trash")) {
                const removeChild = event.target;
                const removedChild = cart.find((cItem) => cItem.id == removeChild.dataset.id);
                this.removeItem(removedChild.id);
                this.setCartValue(cart);
                Storage.saveCart(cart);
                cartContent.removeChild(removeChild.parentElement);
            }
        });
    }

    clearCart() {
        cart.forEach((item) => this.removeItem(item.id));
        while (cartContent.children.length) {
            cartContent.removeChild(cartContent.children[0]);
        }
        closeModal();
    }

    removeItem(id) {
        cart = cart.filter((cItem) => cItem.id !== id);
        this.setCartValue(cart);
        Storage.saveCart(cart);

        this.getSingleBtn(id);
    }

    getSingleBtn(id) {
        const button = buttonsDOM.find((btn) => parseInt(btn.dataset.id) === parseInt(id));
        button.innerHTML = `
        <i class="fas fa-shopping-cart"></i>
        خريد محصول
        `;
        button.disabled = false;
    }
}

class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }

    static getProduct(id) {
        const _product = JSON.parse(localStorage.getItem("products"));
        return _product.find((p) => p.id === parseInt(id));
    }

    static saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    static getCart() {
        return JSON.parse(localStorage.getItem("cart"));
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const products = new Products();
    const productsData = products.getProduct();
    const ui = new UI();
    ui.cartLogic();
    ui.setupApp();
    ui.displayProducts(productsData);
    ui.getAddToCartBtns();
    Storage.saveProducts(productsData);
});
//  Modal
cartBtn.addEventListener("click", showModal);
confirm.addEventListener("click", closeModal);
backDrop.addEventListener("click", closeModal);

function showModal() {
    backDrop.style.display = "block";
    cartModal.style.opacity = "1";
    cartModal.style.top = "20%";
}

function closeModal() {
    backDrop.style.display = "none";
    cartModal.style.opacity = "0";
    cartModal.style.top = "-100%";
}
