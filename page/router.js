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
document.addEventListener('DOMContentLoaded', function() {
            const statusMessage = document.getElementById('status-message');
            
            // Update status message
            statusMessage.textContent = "Document loaded. Ready for interaction!";
            
            // Get all necessary elements
            const shopButtons = document.querySelectorAll('.shop-now');
            const filterPage = document.getElementById('filterPage');
            const overlay = document.getElementById('overlay');
            const closeFilter = document.getElementById('closeFilter');
            const filterTitle = document.getElementById('filterTitle');
            const filterOptions = document.getElementById('filterOptions');
            
            // Define filter options for each banner
            const filterData = {
                'low-fat-meat': [
                    { icon: 'fa-drumstick-bite', text: 'Chicken' },
                    { icon: 'fa-cow', text: 'Beef' },
                    { icon: 'fa-piggy-bank', text: 'Pork' },
                    { icon: 'fa-turkey', text: 'Turkey' }
                ],
                'sale-of-the-month': [
                    { icon: 'fa-fire', text: 'Hot Deals' },
                    { icon: 'fa-percent', text: 'Discounted' },
                    { icon: 'fa-star', text: 'Top Rated' },
                    { icon: 'fa-bolt', text: 'Limited Stock' }
                ],
                'fresh-fruit': [
                    { icon: 'fa-apple-alt', text: 'Apples' },
                    { icon: 'fa-lemon', text: 'Citrus' },
                    { icon: 'fa-seedling', text: 'Berries' },
                    { icon: 'fa-pagelines', text: 'Tropical' }
                ]
            };
            
            // Add click event to each shop button
            shopButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const filterType = this.getAttribute('data-filter');
                    statusMessage.textContent = `Opening filter for: ${filterType.replace(/-/g, ' ')}`;
                    showFilterPage(filterType);
                });
            });
            
            // Close filter events
            closeFilter.addEventListener('click', function() {
                hideFilterPage();
                statusMessage.textContent = "Filter closed successfully";
            });
            
            overlay.addEventListener('click', function() {
                hideFilterPage();
                statusMessage.textContent = "Filter closed by clicking overlay";
            });
            
            // Apply and reset buttons
            document.querySelector('.apply-btn').addEventListener('click', function() {
                hideFilterPage();
                statusMessage.textContent = "Filters applied successfully!";
            });
            
            document.querySelector('.reset-btn').addEventListener('click', function() {
                document.querySelectorAll('.filter-option').forEach(opt => {
                    opt.style.background = '#f8f9fa';
                    opt.style.borderColor = 'transparent';
                });
                statusMessage.textContent = "Filters reset successfully";
            });
            
            // Add interaction to filter options
            document.addEventListener('click', function(e) {
                if (e.target.closest('.filter-option')) {
                    const option = e.target.closest('.filter-option');
                    option.style.background = '#d1ecf1';
                    option.style.borderColor = '#3498db';
                    statusMessage.textContent = `Selected: ${option.textContent.trim()}`;
                }
            });
            
            // Function to show filter page
            function showFilterPage(filterType) {
                // Update title based on filter
                const titles = {
                    'low-fat-meat': 'Low-Fat Meat Filters',
                    'sale-of-the-month': 'Monthly Sale Filters',
                    'fresh-fruit': 'Fresh Fruit Filters'
                };
                
                filterTitle.textContent = titles[filterType] || 'Filter Products';
                
                // Populate filter options
                filterOptions.innerHTML = '';
                const options = filterData[filterType] || [];
                
                options.forEach(option => {
                    const optionElement = document.createElement('div');
                    optionElement.className = 'filter-option';
                    optionElement.innerHTML = `
                        <i class="fas ${option.icon}"></i>
                        <div>${option.text}</div>
                    `;
                    filterOptions.appendChild(optionElement);
                });
                
                // Show filter page and overlay
                filterPage.classList.add('active');
                overlay.classList.add('active');
                
                // Prevent scrolling on body
                document.body.style.overflow = 'hidden';
            }
            
            // Function to hide filter page
            function hideFilterPage() {
                filterPage.classList.remove('active');
                overlay.classList.remove('active');
                
                // Restore scrolling on body
                document.body.style.overflow = '';
            }
            
            // Timer for the second banner
            function updateTimer() {
                const minuteElement = document.getElementById('minute');
                const secondElement = document.getElementById('second');
                
                if (minuteElement && secondElement) {
                    let minutes = parseInt(minuteElement.textContent);
                    let seconds = parseInt(secondElement.textContent);
                    
                    if (seconds === 0) {
                        if (minutes === 0) {
                            // Timer completed
                            return;
                        }
                        minutes--;
                        seconds = 59;
                    } else {
                        seconds--;
                    }
                    
                    minuteElement.textContent = minutes.toString().padStart(2, '0');
                    secondElement.textContent = seconds.toString().padStart(2, '0');
                }
            }
            
            // Initialize timer only if elements exist
            if (document.getElementById('minute') && document.getElementById('second')) {
                setInterval(updateTimer, 1000);
                statusMessage.textContent += " | Timer activated";
            }
        });