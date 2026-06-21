const products = [
    {
        title: 'Auriculares Pro Max Black Edition',
        description: 'Experiencia de audio premium con cancelación inteligente de ruido y sonido envolvente.',
        price: '$799.99',
        bg: 'linear-gradient(135deg, #0f0f0f, #2f2f2f)',
        imageSrc: 'ChatGPT Image 21 jun 2026, 10_42_28.png'
    },
    {
        title: 'Auriculares Pro Max Red Edition',
        description: 'Potencia, elegancia y tecnología avanzada para los amantes de la música.',
        price: '$849.99',
        bg: 'linear-gradient(135deg, #8B0000, #FF4D4D)',
        imageSrc: 'ChatGPT Image 21 jun 2026, 10_49_50.png'
    },
    {
        title: 'Auriculares Pro Max Green Edition',
        description: 'Diseño moderno con audio inmersivo y batería de larga duración.',
        price: '$819.99',
        bg: 'linear-gradient(135deg, #0d5f2f, #42d47d)',
        imageSrc: 'ChatGPT Image 21 jun 2026, 10_54_07.png'
    },
    {
        title: 'Auriculares Pro Max Pink Edition',
        description: 'Estilo sofisticado, comodidad superior y calidad de sonido profesional.',
        price: '$779.99',
        bg: 'linear-gradient(135deg, #ff5db1, #ffd0eb)',
        imageSrc: 'ChatGPT Image 21 jun 2026, 10_56_33.png'
    }
];

const productTitle = document.getElementById('productTitle');
const productDescription = document.getElementById('productDescription');
const productPrice = document.getElementById('productPrice');
const buyButton = document.getElementById('buyNow');
const removeButton = document.getElementById('removeProduct');
const heroImage = document.getElementById('heroImage');
const carouselItems = Array.from(heroImage.querySelectorAll('.carousel-item'));
const cartCount = document.getElementById('cartCount');
const cartButton = document.getElementById('cartButton');
const notification = document.getElementById('notification');

let currentIndex = 0;
let cartTotal = 0;
let notificationTimeout;
let sliderInterval;

function refreshCarouselItems() {
    const previousIndex = (currentIndex - 1 + products.length) % products.length;
    const nextIndex = (currentIndex + 1) % products.length;

    carouselItems.forEach((item, itemIndex) => {
        const product = products[itemIndex];
        if (!product) {
            item.style.display = 'none';
            item.classList.remove('active', 'inactive', 'previous', 'next');
            return;
        }

        item.style.display = '';
        item.src = product.imageSrc;
        item.alt = product.title;
        item.classList.remove('active', 'inactive', 'previous', 'next');

        if (itemIndex === currentIndex) {
            item.classList.add('active');
        } else if (itemIndex === previousIndex) {
            item.classList.add('previous');
        } else if (itemIndex === nextIndex) {
            item.classList.add('next');
        } else {
            item.classList.add('inactive');
        }
    });
}

function updateProduct(index) {
    if (products.length === 0) return;
    currentIndex = index;
    const product = products[index];

    productTitle.textContent = product.title;
    productDescription.textContent = product.description;
    productPrice.textContent = product.price;
    document.body.style.background = product.bg;

    refreshCarouselItems();

    heroImage.classList.add('is-changing');
    window.setTimeout(() => heroImage.classList.remove('is-changing'), 650);
}

function nextProduct() {
    if (products.length === 0) return;
    const nextIndex = (currentIndex + 1) % products.length;
    updateProduct(nextIndex);
}

function startSlider() {
    clearInterval(sliderInterval);
    sliderInterval = setInterval(nextProduct, 3000);
}

function showNotification(message) {
    notification.textContent = message;
    notification.classList.add('visible');
    clearTimeout(notificationTimeout);
    notificationTimeout = setTimeout(() => {
        notification.classList.remove('visible');
    }, 2400);
}

function animateToCart() {
    const activeItem = document.querySelector('.carousel-item.active');
    if (!activeItem) return;

    const clone = activeItem.cloneNode(true);
    const rect = activeItem.getBoundingClientRect();
    const targetRect = cartButton.getBoundingClientRect();

    clone.style.position = 'fixed';
    clone.style.left = `${rect.left}px`;
    clone.style.top = `${rect.top}px`;
    clone.style.width = `${rect.width}px`;
    clone.style.height = `${rect.height}px`;
    clone.style.margin = '0';
    clone.style.zIndex = '9999';
    clone.style.transition = 'transform 0.8s ease, opacity 0.8s ease';
    clone.style.pointerEvents = 'none';
    document.body.appendChild(clone);

    requestAnimationFrame(() => {
        const dx = targetRect.left + targetRect.width / 2 - (rect.left + rect.width / 2);
        const dy = targetRect.top + targetRect.height / 2 - (rect.top + rect.height / 2);
        clone.style.transform = `translate(${dx}px, ${dy}px) scale(0.14)`;
        clone.style.opacity = '0.15';
    });

    clone.addEventListener('transitionend', () => clone.remove(), { once: true });
}

function addToCart() {
    cartTotal += 1;
    cartCount.textContent = cartTotal;
    animateToCart();
    showNotification('Compra realizada con éxito.');
}

function removeCurrentProduct() {
    if (products.length === 0) {
        showNotification('No hay productos para eliminar.');
        return;
    }

    products.splice(currentIndex, 1);

    if (products.length === 0) {
        productTitle.textContent = 'Sin productos disponibles';
        productDescription.textContent = '';
        productPrice.textContent = '';
        carouselItems.forEach(item => item.style.display = 'none');
        buyButton.disabled = true;
        removeButton.disabled = true;
        clearInterval(sliderInterval);
        showNotification('Producto eliminado. No quedan productos.');
        return;
    }

    if (currentIndex >= products.length) {
        currentIndex = 0;
    }

    updateProduct(currentIndex);
    startSlider();
    showNotification('Producto eliminado.');
}

buyButton.addEventListener('click', addToCart);
removeButton.addEventListener('click', removeCurrentProduct);
cartButton.addEventListener('click', () => {
    showNotification(`Tienes ${cartTotal} producto${cartTotal === 1 ? '' : 's'} en el carrito.`);
});

updateProduct(0);
startSlider();
