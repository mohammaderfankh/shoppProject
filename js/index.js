const cartBtn = document.querySelector(".cart-btn");
const cart = document.querySelector(".cart");
const backDrop = document.querySelector(".backdrop");
const confirm = document.querySelector(".cart-item-confirm");
const productsDOM = document.querySelector(".product-center");

import { productsData } from "./products.js";

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
}

class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const products = new Products();
    const productsData = products.getProduct();
    const ui = new UI();
    ui.displayProducts(productsData);
    Storage.saveProducts(productsData);
});
//  Modal
cartBtn.addEventListener("click", showModal);
confirm.addEventListener("click", closeModal);
backDrop.addEventListener("click", closeModal);

function showModal() {
    backDrop.style.display = "block";
    cart.style.opacity = "1";
    cart.style.top = "20%";
}

function closeModal() {
    backDrop.style.display = "none";
    cart.style.opacity = "0";
    cart.style.top = "-100%";
}
