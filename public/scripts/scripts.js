document.addEventListener('DOMContentLoaded', () => {
    const itemsContainer = document.getElementById('items-container');
    const loadingSpinner = document.getElementById('loading-spinner');

    async function fetchItems() {
        try {
            loadingSpinner.style.display = 'block'; // Show spinner
            const response = await fetch('/api/meli/items');
            const items = await response.json();

            itemsContainer.innerHTML = items.map(item => `
                <div class="item">
                    <h2>${item.marca}</h2>
                    <p>Price: $${item.rangoPrecios}</p>
                    <p>Condition: ${item.condicionArticulo}</p>
                    <p>Seller: ${item.sellerName}</p>
                    <p>Shipping: ${item.envioGratis ? 'Free' : 'Not Free'}</p>
                    <p>Logistic Type: ${item.tipoLogistica}</p>
                    <p>Location: ${item.lugarOperacion}</p>
                    <a href="${item.linkPublicacion}" target="_blank">View Listing</a>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            loadingSpinner.style.display = 'none'; // Hide spinner
        }
    }

    fetchItems();
});