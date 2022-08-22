const cartBtn = document.querySelector(".cart-btn");
const cartModal = document.querySelector(".cart");
const backDrop = document.querySelector(".backdrop");
const confirm = document.querySelector(".cart-item-confirm");
const productsDOM = document.querySelector(".product-center");

import { productsData } from "./products.js";
let cart = [];

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
                <div class="price-product">${item.price}</div>
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
        const addToCartBtns = document.querySelectorAll(".add-to-cart");
        const buttons = [...addToCartBtns];
        buttons.forEach((btn) => {
            const id = btn.dataset.id;
            const isInCart = cart.find((p) => p.id === id);
            if (isInCart) {
                btn.innerText = "In Cart";
                btn.disabled = true;
            }
            btn.addEventListener("click", (e) => {
                e.target.innerText = "In Cart";
                e.target.disabled = true;
                // get product from products
                const addedProduct = Storage.getProduct(id);
                // add to cart
                cart = [...cart, { ...addedProduct, quantity: 1 }];
                // save cart t o localStorage
                Storage.saveCart(cart);
            });
        });
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
}

document.addEventListener("DOMContentLoaded", () => {
    const products = new Products();
    const productsData = products.getProduct();
    const ui = new UI();
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
