let productsContainer = [];
let linkName = document.getElementsByClassName("categories_link");

getData()
async function getData(category = null) {
    let response = await fetch('./json/products.json');
    let json = await response.json();
    productsContainer = json;
    if (category) {
        productsContainer = productsContainer.filter(product => product.category === category);
    }
    displayProducts();
}
function displayProducts() {
    let container = ``;
    for (let i = 0; i < productsContainer.length; i++) {
        const product = productsContainer[i];
        const colors = product.colors || ((product.category === 'Woman' || product.category === 'Man') ? ['Trắng', 'Hồng nhạt', 'Xanh nhạt', 'Vàng nhạt', 'Be'] : []);
        const colorMap = {
            "Trắng": "#FFFFFF",
            "Hồng nhạt": "#FFC1CC",
            "Xanh nhạt": "#ADD8E6",
            "Vàng nhạt": "#FFF5BA",
            "Be": "#F5E8C7"
        };
        const colorSwatches = colors.length > 0 ? `
            <div class="color-swatches" data-id="${product.id}">
                ${colors.map((color, index) => `<span class="swatch ${index === 0 ? 'selected' : ''}" data-color="${color}" style="background-color: ${colorMap[color] || color};" title="${color}"></span>`).join('')}
            </div>` : '';

        container += `
        <div class="product-card" data-id="${product.id}">
        <div class="card-img">
            <img  onclick=displayDetails(${product.id});
             src=${product.images[0]}
             alt=${product.name}>
            <a href=""  class="addToCart">
                <ion-icon name="cart-outline" class="Cart"></ion-icon>
            </a>
        </div>
        <div class="card-info">
             <h4 class="product-name" onclick=displayDetails(${product.id});>${product.name}</h4>
             <h5 class="product-price">${product.price}</h5>
             ${colorSwatches}
        </div>
    </div>`
    }
    document.getElementById("productCount").innerHTML = `${productsContainer.length} Products`;
    document.querySelector('.products .content').innerHTML = container;
    // Adding event listener to each "addToCart" link
    let addToCartLinks = document.querySelectorAll('.addToCart');
    addToCartLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            let productCard = event.target.closest('.product-card');
            if (productCard && productCard.dataset.id) {
                let id_product = productCard.dataset.id;
                let colorSwatches = productCard.querySelector('.color-swatches');
                let selectedColor = null;
                if (colorSwatches) {
                    let selectedSwatch = colorSwatches.querySelector('.swatch.selected');
                    selectedColor = selectedSwatch ? selectedSwatch.dataset.color : null;
                }
                addToCart(id_product, 1, selectedColor);
            }
        });
    });

    // Add event listeners for swatches
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('swatch')) {
            let swatchesContainer = e.target.closest('.color-swatches');
            if (swatchesContainer) {
                swatchesContainer.querySelectorAll('.swatch').forEach(s => s.classList.remove('selected'));
                e.target.classList.add('selected');
                // Change image
                let productCard = swatchesContainer.closest('.product-card');
                if (productCard) {
                    let img = productCard.querySelector('img');
                    let id = productCard.dataset.id;
                    let product = productsContainer.find(p => p.id == id);
                    if (product) {
                        let index = Array.from(swatchesContainer.children).indexOf(e.target);
                        if (product.images[index]) {
                            img.src = product.images[index];
                        }
                    }
                }
            }
        }
    });
}
function getCategory(e) {
    let category = e.target.getAttribute('productCategory');
    setActiveLink(e.target)
    try {
        getData(category);
    } catch (e) {
        console.log("not found")
    }
    if (window.innerWidth <= 768) {
        // to close when use select category
        toggleSidebar();
    }
}
function setActiveLink(activeLink) {
    Array.from(linkName).forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

Array.from(linkName).forEach(function (element) {
    element.addEventListener('click', getCategory);
})

function toggleSidebar() {
    var sidebar = document.querySelector(".aside");
    sidebar.classList.toggle("open");
}

function displayDetails(productId) {
    window.location.href = `ProductDetails.html?productId=${productId}`;
}
