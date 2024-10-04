function filterAndSortProducts(products, criteria) {
    let sortedProducts = [...products]

    if (criteria.categories && criteria.categories.length > 0) {
        const sortedData = sortByCategories(criteria.categories, sortedProducts)
        if (sortedData) sortedProducts = [...sortedData];
    }

    if (criteria.priceRange && Object.keys(criteria.priceRange).length > 0) {
        const sortedData = sortByPriceRange(criteria.priceRange, sortedProducts)
        if (sortedData) sortedProducts = [...sortedData];
    }

    if (criteria.nameLength && Object.keys(criteria.nameLength).length > 0) {
        const sortedData = sortByNameLength(criteria.nameLength, sortedProducts)
        if (sortedData) sortedProducts = [...sortedData];
    }

    if (criteria.keywords && criteria.keywords.length > 0) {
        const sortedData = sortByKeywords(criteria.keywords, sortedProducts)
        if (sortedData) sortedProducts = [...sortedData];
    }

    if (criteria.sortBy && criteria.sortBy.length > 0) {
        const sortedData = sort(criteria.sortBy, sortedProducts)
        if (sortedData) sortedProducts = [...sortedData];
    }

    return sortedProducts
}


function sortByCategories(categories, products) {
    return products.filter(product => {
        const found = categories.find(cat => cat === product.category);
        if (found) return product
    })
}

function sortByPriceRange(priceRange, products) {
    return products.filter(product => {
        if (product.price >= priceRange.min && product.price <= priceRange.max) {
            return product
        }
    })
}

function sortByNameLength(nameLength, products) {
    return products.filter(product => {
        if (product.name.length >= nameLength.min && product.name.length <= nameLength.max) {
            return product
        }
    })
}

function sortByKeywords(keywords, products) {
    return products.filter(product => {
        const found = keywords.find(key => product.name.toLowerCase().includes(key.toLowerCase()));
        if (found) return product
    })
}

function sort(sortBy, products) {
    let sortedProducts = [...products]
    for (let sortType of sortBy) {
        if (sortType.field === "price") {
            const sortedData = sortByPrice(sortedProducts, sortType.order)
            if (sortedData) sortedProducts = [...sortedData];
        }
        if (sortType.field === "name") {
            const sortedData = sortByName(sortedProducts, sortType.order)
            if (sortedData) sortedProducts = [...sortedData];
        }
    }

    return sortedProducts;
}


function sortByPrice(products, order) {
    return products.sort((a, b) => {
        if (order === 'ascending') {
            if (a.price < b.price) {
                return -1;
            }
            if (a.price > b.price) {
                return 1;
            }
            return 0;
        } else {
            if (a.price < b.price) {
                return 1;
            }
            if (a.price > b.price) {
                return -1;
            }
            return 0;
        }

    });
}

function sortByName(products, order) {
    return products.sort((a, b) => {
        if (order === 'ascending') {
            if (a.name.length < b.name.length) {
                return -1;
            }
            if (a.name.length > b.name.length) {
                return 1;
            }
            return 0;
        } else {
            if (a.name.length < b.name.length) {
                return 1;
            }
            if (a.name.length > b.name.length) {
                return -1;
            }
            return 0;
        }

    });
}

const products = [
    {id: 1, name: "Apple iPhone 12", category: "Electronics", price: 999},
    {id: 2, name: "Adidas running shoes", category: "Sportswear", price: 280},
    {id: 3, name: "Samsung Galaxy S21", category: "Electronics", price: 850},
    {id: 4, name: "Nike Air Max", category: "Sportswear", price: 300},
    {id: 5, name: "Samsung Galaxy S24", category: "Electronics", price: 1500},
    {id: 6, name: "Samsung S24", category: "Electronics", price: 1200},
];

const criteria = {
    categories: ["Electronics"],
    priceRange: {min: 0, max: 2000},
    nameLength: {min: 10, max: 25},
    keywords: [],
    sortBy: [
        {field: "price", order: "ascending"}, //ascending || descending
        {field: "name", order: "descending"}
    ]
};

const data = filterAndSortProducts(products, criteria)
console.log(data);

module.exports = {filterAndSortProducts};