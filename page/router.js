// Routing System Fixes
const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    handleLocation();
};

const routes = {
    404: "/page/404.html",
    "/": "/page/index.html",
    "/shop": "/page/shop.html",
    "/pages": "/page/pages.html",
    "/blog": "/page/blog.html",
    "/aboutus": "/page/aboutus.html",
    "/contactus": "/page/contactus.html",
};

const handleLocation = async () => {
    const path = window.location.pathname;
    const route = routes[path] || routes[404];
    const container = document.getElementById("main-content");

    if (!container) {
        console.error('Main container element not found');
        return;
    }   
    try {
        const html = await fetch(route).then((data) => data.text());
        container.innerHTML = html;   
        // Reinitialize star ratings after content load
        initializeStarRatings();
        // Reinitialize banner filters after content load
        // initializeBannerFilters(); // REMOVED
    }catch (error) {
        console.error("Error loading page:", error);
        if (routes[404]) {
        try {
            const fallback = await fetch(routes[404]);
            container.innerHTML = await fallback.text();
        } catch (fallbackError) {
            console.error("Error loading 404 page:", fallbackError);
}
        }
    }
};
    
// Remove Express server-side code (client-side only)
window.onpopstate = handleLocation;
window.route = route;
handleLocation();

// Star Rating System Fixes
function initializeStarRatings() { 
    const ratingContainers = document.querySelectorAll('.star-rating');
    
    ratingContainers.forEach(container => {
        // Clone stars to remove old listeners
        const stars = container.querySelectorAll('.star');
        
        // Replace each star individually
        stars.forEach(star => {
            star.replaceWith(star.cloneNode(true));
        });

        // Get FRESH references to cloned stars
        const updatedStars = container.querySelectorAll('.star');
        const productCard = container.closest('.product-card');

        if (!productCard) {
            console.warn('Product card not found');
            return;
        }

        // Add click listeners to UPDATED stars
        updatedStars.forEach(star => {
            star.addEventListener('click', function() {
                const rating = parseInt(this.dataset.rating, 10);
                
                // Verify product name
                const nameElement = productCard.querySelector('.product-info');
                if (!nameElement) return;
                
                // Clear and set active classes
                updatedStars.forEach(s => s.classList.remove('active'));
                updatedStars.forEach(s => {
                    if (parseInt(s.dataset.rating, 10) <= rating) {
                        s.classList.add('active');
                    }
                });
                
                console.log(`User rated ${nameElement.textContent}: ${rating}`);
            });
        });
    });
}

//initializing cart container

let cartItems = JSON.parse(localStorage.getItem('cart')) || [];


function updateCartDisplay(productCard) {
    const cartCount = productCard ? productCard.querySelector('.cart-container .cart-count') : null;
    if (cartCount) {
        cartCount.textContent = cartItems.length;
    } else {
        console.log('Could not find .cart-count element in the product card.');
    }
}

function addToCart(product, productCard) {
    cartItems.push(product);
    console.log("Cart Items After Add:", cartItems); //debugging
    localStorage.setItem('cart', JSON.stringify(cartItems));
    console.log("Local Storage Cart:",  localStorage.getItem('cart'));
    updateCartDisplay(productCard);
    showAddedToCartFeedback(product.name);
    console.log('Item added:', product);
}
function showAddedToCartFeedback(productName) {
    const feedback = document.createElement("div");
    feedback.className = 'cart-feedback';
    feedback.textContent = `${productName} added to cart!`;
    document.body.appendChild(feedback);

    setTimeout(() => {   feedback.remove(); }, 2000);
}


console.log(cartItems.length);
document.addEventListener('click', function(e){
    if(e.target.closest('.product-card .cart-container svg')) {
        const productCard = e.target.closest('.product-card');
        if (productCard) {
        const product = {
            id: productCard.dataset.id || Date.now().toString(),
            name: productCard.querySelector('.product-info .product-name').textContent,
            price: parseFloat(productCard.querySelector('.product-info .product-price').textContent.replace(/[^0-9.]/g,'')),
            quantity: 1,
        };
        console.log("Product added", product);
        addToCart(product, productCard);
    } else {
        console.error('Could not find .product-card ancestor of the clicked cart SVG');
    }
}
});
// Handle dynamic content from your router
function handleDynamicContent() {
    // Re-initialize cart functionality after content changes
    initializeStarRatings();
    updateCartDisplay();
    // Re-initialize banner filters
    // initializeBannerFilters(); // REMOVED
}

//setting the countdown timer for the first banner 
let threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
const endTime = new Date().getTime() + threeDaysInMs;


let timeInterval;

function countdownTimer() {
    const now = new Date().getTime();
    const distance = endTime - now;
    
    
    
    if (distance < 0) {
        clearInterval(timeInterval);
    
        document.getElementById('day').textContent = "00";
        document.getElementById('hour').textContent = "00";
        document.getElementById('minute').textContent = "00";
        document.getElementById('second').textContent = "00";
   
        const countdownContainer = document.getElementById("countdown-timer");
        if (countdownContainer) {
            countdownContainer.innerHTML = "<h2>TIMER EXPIRED!</h2>";
            return;
    }
   
}


const days = Math.floor(distance / (1000 * 60 * 60 * 24));
const hours = Math.floor((distance % (1000* 60 * 60 * 24)) / (1000 * 60 * 60));
const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
const seconds = Math.floor((distance % (1000 * 60)) / 1000);

document.getElementById('day').textContent = days < 10 ? "0" + days : days;
document.getElementById('hour').textContent = hours < 10 ? "0" + hours : hours;
document.getElementById('minute').textContent = minutes < 10 ? "0" + minutes : minutes;
document.getElementById('second').textContent = seconds < 10 ? "0" + seconds : seconds;

}

countdownTimer();
const timerInterval = setInterval(countdownTimer, 1000);

// banner's button functionality //
document.addEventListener('DOMContentLoaded', function(){ 
const products = {
    "sale-of-the-month": [
        {id: 1, name: "Red Chili", price: "$14,99", category: "sale-of-the-month", imageUrl: "assets/potato.png",},
        {id: 2, name: "Corn", price: "$14,99", category: "sale-of-the-month", imageUrl: "assets/corn.png",},
        {id: 3, name: "Chinese Cabage", price: "$14,99", category: "sale-of-the-month", imageUrl: "assets/chinese cabage.png",},
        {id: 4, name: "Eggplant", price: "$14,99", category: "sale-of-the-month", imageUrl: "assets/Eggplant.png",},
        {id: 5, name: "Fresh Cauliflower", price: "$14,99", category: "sale-of-the-month", imageUrl: "assets/Fresh Cauliflower.png",},
        {id: 6, name: "Tomato", price: "$14,99", category: "sale-of-the-month", imageUrl: "assets/tomato.png",},
    ],
    "low-fat-meat": [ 
        {id: 1, name: "Chicken Fingers", price: "$14,99", category: "low-fat-meat", imageUrl: "assets/Chicken finger.jpeg",},
        {id: 2, name: "Chicken Wings", price: "$14,99", category: "low-fat-meat", imageUrl: "assets/Chicken Wings.jpeg",},
        {id: 3, name: "Chicken Thighs", price: "$14,99", category: "low-fat-meat", imageUrl: "assets/chicken thighs.jpeg",},
        {id: 4, name: "Shrimps", price: "$14,99", category: "low-fat-meat", imageUrl: "assets/shrimps.jpeg",},
        {id: 5, name: "Red Porgy", price: "$14,99", category: "low-fat-meat", imageUrl: "assets/Red porgy.jpeg",},
        {id: 6, name: "Fish", price: "$14,99", category: "low-fat-meat", imageUrl: "assets/fish.jpeg",},
        {id: 7, name: "Salmon", price: "$14,99", category: "low-fat-meat", imageUrl: "assets/salmon.jpeg",},
        {id: 8, name: "Eggs", price: "$14,99", category: "low-fat-meat", imageUrl: "assets/eggs.jpeg",},
        {id: 9, name: "A Whole Chicken", price: "$14,99", category: "low-fat-meat", imageUrl: "assets/a whole chicken.jpeg",},
    ],
    "fresh-fruit": [
        {id: 1, name: "Lemon", price: "$14.99", category: "fresh-fruit", imageUrl: "assets/lemon.jpeg",},
        {id: 2, name: "Apple", price: "$14.99", category: "fresh-fruit", imageUrl: "assets/apple.jpeg"},
        {id: 3, name: "Banana", price: "$14.99", category: "fresh-fruit", imageUrl: "assets/banana.jpeg"},
        {id: 4, name: "Ananas", price: "$14.99", category: "fresh-fruit", imageUrl: "assets/ananas.jpeg"},
        {id: 5, name: "Grapes", price: "$14.99", category: "fresh-fruit", imageUrl: "assets/grapes.jpeg"},
        {id: 6, name: "kiwis", price: "$14.99", category: "fresh-fruit", imageUrl: "assets/kiwis.jpeg"},
        {id: 7, name: "Cherries", price: "$14.99", category: "fresh-fruit", imageUrl: "assets/cherries.jpeg"},
        {id: 8, name: "Watermelon", price: "$14.99", category: "fresh-fruit", imageUrl: "assets/watermelon.jpeg"},
        {id: 9, name: "Orange", price: "$14.99", category: "fresh-fruit", imageUrl: "assets/orange.jpeg"},
        {id: 10, name: "Peach", price: "$14.99", category: "fresh-fruit", imageUrl:  "assets/peach.jpeg"},
    ]
};

  function checkImageExists(imageUrl, callback) {
            const img = new Image();
            img.onload = function() { callback(true); };
            img.onerror = function() { callback(false); };
            img.src = imageUrl;
        }

        // Test your image paths
        console.log("Testing image paths...");
        for (const category in products) {
            products[category].forEach(product => {
                checkImageExists(product.imageUrl, function(exists) {
                    if (!exists) {
                        console.error(`Image not found: ${product.imageUrl}`);
                    } else {
                        console.log(`Image found: ${product.imageUrl}`);
                    }
                });
            });
        }
    const bannersContainer = document.querySelector('.all-banners');
    const filterPage = document.querySelector('#filter-page');
    const backButton = document.querySelector('.back-button');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const shopNowButtons = document.querySelectorAll('.shop-now');
    const productGrid = document.querySelector('#product-grid');
    const filterTitle = document.querySelector('#filter-title');
    
    // Initialize state
        
       if (!bannersContainer || !filterPage || !backButton || !productGrid || !filterTitle) {
                console.error("One or more required elements are missing from the DOM");
                return;
            }
            
            // Initialize state
            let cartCount = 0;
            let currentFilter = "all";
            
            // Function to render products
            function renderProducts(filter = "all") {
                productGrid.innerHTML = '';
                
                let filteredProducts = [];
                
                if (filter === "all") {
                    // Combine all products
                    for (const category in products) {
                        filteredProducts = filteredProducts.concat(products[category]);
                    }
                } else {
                    filteredProducts = products[filter] || [];
                }
                
                if (filteredProducts.length === 0) {
                    productGrid.innerHTML = `
                        <div class="empty-state" style="grid-column:1/-1;text-align:center;padding:40px;">
                            <i class="fas fa-search" style="font-size:60px;color:#e0e0e0;margin-bottom:20px;"></i>
                            <h3 style="font-size:24px;margin-bottom:10px;color:#616161;">No products found</h3>
                            <p style="color:#9e9e9e;max-width:500px;margin:0 auto;">
                                Try selecting a different category to find what you're looking for.
                            </p>
                        </div>
                    `;
                    return;
                }
                
               filteredProducts.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.classList.add("product-card");
      productCard.innerHTML = `
                        <img class="img-url" src="${product.imageUrl}" alt="${product.name}"/>
                        <div class="product-info">
                            <span class="product-category">${product.category}</span>
                            <h3 class="product-name">${product.name}</h3>
                            <div class="product-price">${product.price}</div>
                            <div class="cart-container">
                                <button class="add-to-cart" data-id="${product.id}">
                                    <i class="fas fa-shopping-cart"></i> Add to Cart
                                </button>
                            </div>
                        </div>
                        
                    `;
      productGrid.appendChild(productCard);
    });

    
                // Add event listeners to add-to-cart buttons
                document.querySelectorAll('.add-to-cart').forEach(button => {
                    button.addEventListener('click', () => {
                        cartItems++;
                        if (cartCount) cartCount.textContent = cartItems;
                        button.innerHTML = '<i class="fas fa-check"></i> Added!';
                        button.style.backgroundColor = '#388e3c';
                        
                        setTimeout(() => {
                            button.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
                            button.style.backgroundColor = '#4caf50';
                        }, 2000);
                    });
                });
            }
            
            // Function to set active filter button
            function setActiveFilter(button) {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            }
            
            // Event listeners for shop now buttons
            if (shopNowButtons.length > 0) {
                shopNowButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        const filter = button.dataset.filter;
                        
                        // Hide banners, show filter page
                        bannersContainer.style.display = 'none';
                        filterPage.style.display = 'block';
                        
                        // Set the corresponding filter as active
                        const targetFilterBtn = document.querySelector(`.filter-btn[data-filter="${filter}"]`);
                        if (targetFilterBtn) {
                            setActiveFilter(targetFilterBtn);
                        }
                        
                        // Set the filter title
                        const bannerTitle = button.parentElement.querySelector('h4').textContent;
                        filterTitle.textContent = "Filter Products - " + bannerTitle;
                        
                        // Render products for this filter
                        currentFilter = filter;
                        renderProducts(filter);
                    });
                });
            } else {
                console.warn("No shop now buttons found");
            }
            
            // Event listeners for filter buttons
            if (filterButtons.length > 0) {
                filterButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        const filter = button.dataset.filter;
                        setActiveFilter(button);
                        currentFilter = filter;
                        renderProducts(filter);
                        
                        // Update filter title
                        if (filter === "all") {
                            filterTitle.textContent = "Filter Products - All Products";
                        } else {
                            filterTitle.textContent = "Filter Products - " + button.textContent;
                        }
                    });
                });
            } else {
                console.warn("No filter buttons found");
            }
            
            // Back button event listener
            backButton.addEventListener('click', () => {
                filterPage.style.display = 'none';
                bannersContainer.style.display = 'flex';
            });
            
            // Initialize the page
             if (filterPage.style.display !== 'block') {
        renderProducts('all');
    }
        });



// Handle image loading errors
function fpHandleImageError(img) {
    const loadingElement = img.previousElementSibling;
    if (loadingElement && loadingElement.classList.contains('fp-image-loading')) {
        loadingElement.innerHTML = '<span>Image not available</span>';
        loadingElement.classList.add('fp-image-error');
    }
    img.style.display = 'none';
    console.error(`Image failed to load: ${img.src}`);
}
