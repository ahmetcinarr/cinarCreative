// Örnek öne çıkan ürünler
const featuredProducts = [
    {
        id: 1,
        name: "iPhone 14 Pro",
        price: "39.999 TL",
        img: "assets/img/iphone14pro.jpg",
        desc: "Apple'ın en yeni modeli."
    },
    {
        id: 2,
        name: "Samsung Galaxy S23",
        price: "29.999 TL",
        img: "assets/img/galaxys23.jpg",
        desc: "Güçlü performans, şık tasarım."
    },
    {
        id: 3,
        name: "Xiaomi Redmi Note 12",
        price: "12.499 TL",
        img: "assets/img/redminote12.jpg",
        desc: "Fiyat/performans şampiyonu."
    }
];

window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('featured-products');
    if (container) {
        featuredProducts.forEach(product => {
            const col = document.createElement('div');
            col.className = 'col-md-4 mb-4';
            col.innerHTML = `
                <div class="card h-100">
                    <img src="${product.img}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.desc}</p>
                        <p class="fw-bold">${product.price}</p>
                        <a href="urunler.html?id=${product.id}" class="btn btn-primary">Detay</a>
                    </div>
                </div>
            `;
            container.appendChild(col);
        });
    }
});