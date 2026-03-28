const params = new URL(location.href).searchParams;
const productId = params.get('productId');
let quantity = document.getElementById("productCount");
getData()
async function getData(){
    try {
        let response = await fetch('json/products.json');
        let json = await response.json();
        let product = json.find(item => item.id == productId); 

        if (product) {
            displayDetails(product);
        } else {
            console.error('Product not found');
        }
    } catch (error) {
        console.error('Error fetching the data', error);
    }
}
function displayDetails(product){
    let productDetails = document.getElementsByClassName('productDetails')[0];
    productDetails.setAttribute("data-id",product.id)
    const images = product.images;
    document.getElementById("product_image").src = images[0];
    document.querySelector(".category_name").innerHTML = product.category;
    document.querySelector(".product_name").innerHTML = product.name;
    document.querySelector(".product_price").innerHTML = product.price;
    document.querySelector(".product_des").innerHTML = product.description;

    const colorSwatches = document.getElementById("colorSwatches");
    const colorSection = document.querySelector(".color-section");
    const defaultColors = ['Trắng', 'Hồng nhạt', 'Xanh nhạt', 'Vàng nhạt', 'Be'];
    const colors = (product.colors && product.colors.length > 0 ? product.colors : (product.category === 'Woman' || product.category === 'Man' ? defaultColors : [])).filter(color => [
        'Trắng', 'Hồng nhạt', 'Xanh nhạt', 'Vàng nhạt', 'Be', 'Xanh dương', 'Xanh lá', 'Xám', 'Kem'
    ].includes(color));

    const colorMap = {
        "Đen": "#B0B0B0", // chuyển sang tông xám nhạt để hợp bảng nhạt
        "Trắng": "#FFFFFF",
        "Đỏ": "#FFB6C1", // hồng nhạt
        "Xanh dương": "#ADD8E6",
        "Xanh lá": "#BFFCC6",
        "Hồng nhạt": "#FFC1CC",
        "Vàng nhạt": "#FFF5BA",
        "Be": "#F5E8C7",
        "Xám": "#DCDCDC",
        "Kem": "#FFF9E6"
    };

    const selectedColorText = document.getElementById('selectedColorText');
    if (colors.length > 0) {
        colorSection.style.display = 'block';
        colorSwatches.innerHTML = colors.map(color => `<span class="swatch" data-color="${color}" style="background-color: ${colorMap[color] || color};" title="${color}"></span>`).join('');
        // Set default selected
        const firstSwatch = colorSwatches.querySelector('.swatch');
        if (firstSwatch) {
            firstSwatch.classList.add('selected');
            selectedColorText.textContent = `Đang chọn: ${firstSwatch.dataset.color}`;
        }
    } else {
        colorSection.style.display = 'none';
    }

    const linkAdd = document.getElementById("btn_add");
    let selectedColor = null;
    if (colorSwatches) {
        const selectedSwatch = colorSwatches.querySelector('.swatch.selected');
        selectedColor = selectedSwatch ? selectedSwatch.dataset.color : null;
    }
    linkAdd.addEventListener('click', function(event) {
        event.preventDefault();
        addToCart(product.id, parseInt(quantity.value) || 1, selectedColor);
        showToast();
    });

    // Add event listeners for swatches
    if (colorSwatches) {
        colorSwatches.addEventListener('click', function(e) {
            if (e.target.classList.contains('swatch')) {
                colorSwatches.querySelectorAll('.swatch').forEach(s => s.classList.remove('selected'));
                e.target.classList.add('selected');
                selectedColor = e.target.dataset.color;
                selectedColorText.textContent = `Đang chọn: ${selectedColor}`;
                let index = Array.from(colorSwatches.children).indexOf(e.target);
                if (images[index]) {
                    document.getElementById("product_image").src = images[index];
                }
            }
        });
    }
}

function showToast() {
    const toastOverlay = document.getElementById("toast-overlay");
    toastOverlay.classList.add("show");
    showCheckAnimation();
    setTimeout(() => {
        toastOverlay.classList.remove("show");
        showCart();
    }, 1000);
   
}

function showCart(){
    let body = document.querySelector('body');
    body.classList.add('showCart');
}

function showCheckAnimation(){
    const checkIconContainer = document.getElementById('checkIcon');
     checkIconContainer.innerHTML = '';
     const newCheckIcon = document.createElement('div');
     newCheckIcon.style.width = '100px';
     newCheckIcon.style.height = '100px';
     checkIconContainer.appendChild(newCheckIcon);
 
     lottie.loadAnimation({
         container: newCheckIcon,
         renderer: 'svg',
         loop: false,
         autoplay: true,
         path: 'json/Animation check.json' 
     });
}
document.getElementById("minus").addEventListener("click", function() {
    let value = parseInt(quantity.value) || 1; 
    if (value > 1) {
      quantity.value = value - 1;
    }
  });

document.getElementById("plus").addEventListener("click", function() {
    let value = parseInt(quantity.value) || 1; 
    if (value < 999) {
      quantity.value = value + 1;
    }
  });

