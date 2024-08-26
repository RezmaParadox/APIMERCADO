const axios = require('axios');
const dotenv = require('dotenv').config();

const MELI_API_URL = process.env.MELI_API_URL;
const MELI_API_USER_URL = process.env.MELI_API_USER_URL;
const API_KEY = process.env.API_KEY;

async function fetchItems() {
    try {
        let allItems = [];
        let offset = 0;
        const pageSize = 50;

        while (allItems.length < 1000) {
            const response = await axios.get(MELI_API_URL, {
                params: {
                    q: 'celular',
                    sort: 'price_asc',
                    limit: pageSize,
                    offset: offset
                },
                headers: {
                    'Authorization': `Bearer ${API_KEY}`
                }
            });

            const items = response.data.results;
            if (items.length === 0) break;

            allItems = [...allItems, ...items];
            offset += pageSize;
        }

        const detailedItems = await Promise.all(allItems.slice(0, 1000).map(async item => {
            const sellerResponse = await axios.get(`${MELI_API_USER_URL}${item.seller.id}`, {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`
                }
            });
            const seller = sellerResponse.data;
            return {
                sellerID: item.seller.id,
                sellerName: seller.nickname,
                marca: item.attributes.find(attr => attr.name === 'Marca')?.value_name || 'Sin marca',
                envioGratis: item.shipping.free_shipping,
                tipoLogistica: item.shipping.logistic_type,
                lugarOperacion: seller.address.city.name || 'Sin lugar de operacion',
                condicionArticulo: item.condition,
                rangoPrecios: item.price,
                linkPublicacion: item.permalink
            };
        }));

        console.log('Items fetched:', JSON.stringify(detailedItems, null, 2));
        return detailedItems;

    } catch (error) {
        console.log('Error fetching items', error);
        throw error;
    }
}

module.exports = { fetchItems };