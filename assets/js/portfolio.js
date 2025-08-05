// ===== PORTFOLIO SPECIFIC JAVASCRIPT =====

// Project data
const projectData = {
    1: {
        title: "TechStore E-commerce Platform",
        category: "Web Design & E-commerce",
        client: "TechStore Inc.",
        duration: "3 months",
        technologies: ["React", "Node.js", "MongoDB", "Stripe API", "AWS"],
        description: "A comprehensive e-commerce platform for electronics with advanced product filtering, user reviews, wishlist functionality, and secure payment processing.",
        challenge: "The client needed a modern, fast-loading e-commerce platform that could handle high traffic and provide excellent user experience across all devices.",
        solution: "We built a React-based single-page application with server-side rendering for SEO, implemented advanced caching strategies, and integrated multiple payment gateways.",
        results: [
            "300% increase in online sales",
            "45% improvement in page load speed",
            "92% customer satisfaction rating",
            "50% reduction in cart abandonment"
        ],
        images: [
            "assets/images/portfolio/project-1-1.jpg",
            "assets/images/portfolio/project-1-2.jpg",
            "assets/images/portfolio/project-1-3.jpg"
        ],
        testimonial: "Creative Digital transformed our online presence completely. The new platform is not only beautiful but also incredibly functional.",
        testimonialAuthor: "John Smith, CEO TechStore Inc."
    },
    2: {
        title: "GreenLeaf Brand Identity",
        category: "Branding & Visual Identity",
        client: "GreenLeaf Sustainability",
        duration: "2 months",
        technologies: ["Adobe Creative Suite", "Figma", "Brand Guidelines"],
        description: "Complete brand identity redesign for an eco-friendly startup, including logo design, color palette, typography, and brand guidelines.",
        challenge: "Create a modern, trustworthy brand identity that communicates sustainability and innovation while appealing to environmentally conscious consumers.",
        solution: "We developed a clean, organic visual identity using earth tones and modern typography, with a leaf-inspired logo that works across all applications.",
        results: [
            "85% brand recognition increase",
            "60% improvement in customer trust metrics",
            "40% increase in social media engagement",
            "New brand applied across 50+ touchpoints"
        ],
        images: [
            "assets/images/portfolio/project-2-1.jpg",
            "assets/images/portfolio/project-2-2.jpg",
            "assets/images/portfolio/project-2-3.jpg"
        ],
        testimonial: "The new brand identity perfectly captures our mission and values. We've seen incredible response from our target audience.",
        testimonialAuthor: "Sarah Johnson, Founder GreenLeaf"
    },
    3: {
        title: "FitLife Social Campaign",
        category: "Social Media & Digital Marketing",
        client: "FitLife Gym Chain",
        duration: "6 months",
        technologies: ["Facebook Ads", "Instagram", "TikTok", "Analytics Tools"],
        description: "Viral fitness campaign across multiple social platforms featuring user-generated content and influencer partnerships.",
        challenge: "Increase brand awareness and gym memberships for a regional fitness chain in a highly competitive market.",
        solution: "Created an engaging #FitLifeChallenge campaign encouraging users to share their fitness journeys, partnered with local influencers, and used targeted advertising.",
        results: [
            "2M+ campaign reach",
            "150% increase in gym memberships",
            "500K+ user-generated posts",
            "300% growth in social following"
        ],
        images: [
            "assets/images/portfolio/project-3-1.jpg",
            "assets/images/portfolio/project-3-2.jpg",
            "assets/images/portfolio/project-3-3.jpg"
        ],
        testimonial: "The campaign exceeded all our expectations. We've never seen engagement like this before!",
        testimonialAuthor: "Mike Wilson, Marketing Director FitLife"
    },
    4: {
        title: "Artisan Cafe Website",
        category: "Web Design & Development",
        client: "Artisan Cafe",
        duration: "1.5 months",
        technologies: ["WordPress", "WooCommerce", "Custom PHP", "Responsive Design"],
        description: "Elegant restaurant website with online ordering system, menu management, and reservation booking functionality.",
        challenge: "Create an appetizing online presence that showcases the restaurant's artisanal approach while enabling online orders and reservations.",
        solution: "Designed a visually stunning website with high-quality food photography, integrated online ordering system, and streamlined reservation process.",
        results: [
            "200% increase in online orders",
            "75% of reservations now made online",
            "45% improvement in customer retention",
            "Award-winning design recognition"
        ],
        images: [
            "assets/images/portfolio/project-4-1.jpg",
            "assets/images/portfolio/project-4-2.jpg",
            "assets/images/portfolio/project-4-3.jpg"
        ],
        testimonial: "Our new website is absolutely beautiful and has dramatically increased our online presence and orders.",
        testimonialAuthor: "Maria Rodriguez, Owner Artisan Cafe"
    },
    5: {
        title: "FinTech Startup Branding",
        category: "Branding & Web Development",
        client: "PayFlow Technologies",
        duration: "4 months",
        technologies: ["React", "Node.js", "Brand Design", "Security Implementation"],
        description: "Complete brand identity and secure web platform for a financial technology startup focusing on digital payments.",
        challenge: "Establish trust and credibility for a new fintech company while creating a secure, user-friendly platform for digital transactions.",
        solution: "Developed a professional brand identity emphasizing security and innovation, built a robust web platform with bank-level security measures.",
        results: [
            "$2M+ in funding raised",
            "10,000+ active users in first 6 months",
            "99.9% platform uptime",
            "SOC 2 compliance achieved"
        ],
        images: [
            "assets/images/portfolio/project-5-1.jpg",
            "assets/images/portfolio/project-5-2.jpg",
            "assets/images/portfolio/project-5-3.jpg"
        ],
        testimonial: "Creative Digital helped us build not just a brand, but trust in the fintech space. Their attention to security and user experience is unmatched.",
        testimonialAuthor: "David Chen, CTO PayFlow Technologies"
    },
    6: {
        title: "Fashion Brand Campaign",
        category: "Advertising & Social Media",
        client: "Luxe Fashion House",
        duration: "3 months",
        technologies: ["Google Ads", "Facebook Ads", "Instagram", "Influencer Platform"],
        description: "Luxury fashion advertising campaign across multiple channels featuring high-end photography and influencer partnerships.",
        challenge: "Launch a new luxury fashion line in a saturated market while maintaining brand exclusivity and driving sales.",
        solution: "Created an aspirational campaign with stunning visuals, partnered with high-profile influencers, and used precision targeting for luxury consumers.",
        results: [
            "500% ROI on ad spend",
            "1M+ campaign impressions",
            "25% increase in brand value",
            "Sold out collection in 2 weeks"
        ],
        images: [
            "assets/images/portfolio/project-6-1.jpg",
            "assets/images/portfolio/project-6-2.jpg",
            "assets/images/portfolio/project-6-3.jpg"
        ],
        testimonial: "The campaign was absolutely stunning and delivered results beyond our wildest dreams. Every piece sold out!",
        testimonialAuthor: "Isabella Laurent, Creative Director Luxe Fashion"
    }
};

// Initialize portfolio functionality
document.addEventListener('DOMContentLoaded', function() {
    initPortfolioFilter();
    initProjectModal();
    initLoadMore();
    initLightbox();
});

// Portfolio filtering functionality
function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter items with animation
            portfolioItems.forEach((item, index) => {
                const shouldShow = filter === 'all' || item.classList.contains(filter);
                
                if (shouldShow) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
            
            // Update URL without page reload
            const url = new URL(window.location);
            if (filter === 'all') {
                url.searchParams.delete('filter');
            } else {
                url.searchParams.set('filter', filter);
            }
            window.history.pushState({}, '', url);
        });
    });
    
    // Apply filter from URL on page load
    const urlParams = new URLSearchParams(window.location.search);
    const filterFromUrl = urlParams.get('filter');
    if (filterFromUrl) {
        const filterBtn = document.querySelector(`[data-filter="${filterFromUrl}"]`);
        if (filterBtn) {
            filterBtn.click();
        }
    }
}

// Project modal functionality
function initProjectModal() {
    const modal = document.getElementById('projectModal');
    const modalContent = document.getElementById('modalContent');
    
    // Handle modal trigger buttons
    document.addEventListener('click', function(e) {
        if (e.target.matches('[data-bs-toggle="modal"][data-project]')) {
            const projectId = e.target.getAttribute('data-project');
            loadProjectModal(projectId);
        }
    });
    
    // Preload modal content
    function loadProjectModal(projectId) {
        const project = projectData[projectId];
        if (!project) return;
        
        const modalHTML = `
            <div class="project-modal-content">
                <!-- Hero Image -->
                <div class="project-hero position-relative">
                    <img src="${project.images[0]}" alt="${project.title}" class="img-fluid w-100" style="height: 400px; object-fit: cover;">
                    <div class="project-hero-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-end" style="background: linear-gradient(transparent, rgba(0,0,0,0.7));">
                        <div class="container">
                            <div class="text-white p-4">
                                <h2 class="h3 fw-bold mb-2">${project.title}</h2>
                                <p class="mb-0">${project.category}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Project Details -->
                <div class="container py-5">
                    <div class="row">
                        <!-- Project Info -->
                        <div class="col-lg-8">
                            <div class="project-description mb-5">
                                <h3 class="h4 fw-bold mb-3">Project Overview</h3>
                                <p class="lead mb-4">${project.description}</p>
                                
                                <h4 class="h5 fw-bold mb-3">The Challenge</h4>
                                <p class="mb-4">${project.challenge}</p>
                                
                                <h4 class="h5 fw-bold mb-3">Our Solution</h4>
                                <p class="mb-4">${project.solution}</p>
                                
                                <h4 class="h5 fw-bold mb-3">Key Results</h4>
                                <div class="row g-3 mb-4">
                                    ${project.results.map(result => `
                                        <div class="col-md-6">
                                            <div class="result-item p-3 bg-light rounded">
                                                <i class="bi bi-check-circle text-success me-2"></i>
                                                ${result}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <!-- Project Gallery -->
                            <div class="project-gallery mb-5">
                                <h4 class="h5 fw-bold mb-3">Project Gallery</h4>
                                <div class="row g-3">
                                    ${project.images.map((image, index) => `
                                        <div class="col-md-4">
                                            <img src="${image}" alt="${project.title} - Image ${index + 1}" 
                                                 class="img-fluid rounded cursor-pointer gallery-image"
                                                 data-bs-toggle="modal" data-bs-target="#lightboxModal" data-image="${image}">
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <!-- Testimonial -->
                            ${project.testimonial ? `
                                <div class="project-testimonial bg-primary text-white p-4 rounded mb-4">
                                    <blockquote class="mb-3">
                                        <i class="bi bi-quote fs-3 opacity-50"></i>
                                        <p class="mb-0 fs-5">${project.testimonial}</p>
                                    </blockquote>
                                    <cite class="d-block text-end opacity-75">— ${project.testimonialAuthor}</cite>
                                </div>
                            ` : ''}
                        </div>
                        
                        <!-- Sidebar -->
                        <div class="col-lg-4">
                            <div class="project-sidebar">
                                <div class="card border-0 shadow-sm mb-4">
                                    <div class="card-body">
                                        <h5 class="card-title fw-bold mb-3">Project Details</h5>
                                        <ul class="list-unstyled">
                                            <li class="mb-2">
                                                <strong>Client:</strong> ${project.client}
                                            </li>
                                            <li class="mb-2">
                                                <strong>Duration:</strong> ${project.duration}
                                            </li>
                                            <li class="mb-2">
                                                <strong>Category:</strong> ${project.category}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                
                                <div class="card border-0 shadow-sm mb-4">
                                    <div class="card-body">
                                        <h5 class="card-title fw-bold mb-3">Technologies Used</h5>
                                        <div class="d-flex flex-wrap gap-2">
                                            ${project.technologies.map(tech => `
                                                <span class="badge bg-primary">${tech}</span>
                                            `).join('')}
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="card border-0 shadow-sm">
                                    <div class="card-body text-center">
                                        <h5 class="card-title fw-bold mb-3">Start Your Project</h5>
                                        <p class="text-muted mb-3">Ready to achieve similar results?</p>
                                        <a href="contact.html" class="btn btn-primary rounded-pill px-4">
                                            <i class="bi bi-envelope me-2"></i>Get In Touch
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        modalContent.innerHTML = modalHTML;
    }
}

// Load more functionality
function initLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    let additionalProjects = [
        {
            title: "Healthcare App UI/UX",
            category: "web-design",
            image: "assets/images/portfolio/project-7.jpg",
            badges: ["Mobile App", "Healthcare", "UI/UX"],
            description: "Intuitive healthcare app design for patient management"
        },
        {
            title: "Real Estate Branding",
            category: "branding",
            image: "assets/images/portfolio/project-8.jpg",
            badges: ["Branding", "Real Estate", "Print Design"],
            description: "Premium real estate brand identity and marketing materials"
        },
        {
            title: "SaaS Platform Design",
            category: "web-design",
            image: "assets/images/portfolio/project-9.jpg",
            badges: ["SaaS", "Web App", "Dashboard"],
            description: "Modern SaaS platform with comprehensive dashboard"
        }
    ];
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            const portfolioGrid = document.getElementById('portfolioGrid');
            
            additionalProjects.forEach((project, index) => {
                const projectHTML = `
                    <div class="col-lg-4 col-md-6 portfolio-item ${project.category} animate-on-scroll" style="opacity: 0; transform: translateY(30px);">
                        <div class="portfolio-card">
                            <div class="portfolio-image">
                                <img src="${project.image}" alt="${project.title}" class="img-fluid">
                                <div class="portfolio-overlay">
                                    <div class="portfolio-content">
                                        <h5 class="text-white mb-2">${project.title}</h5>
                                        <p class="text-white-50 mb-3">${project.description}</p>
                                        <div class="portfolio-buttons">
                                            <a href="#" class="btn btn-light btn-sm rounded-pill me-2">View Details</a>
                                            <a href="#" class="btn btn-outline-light btn-sm rounded-pill">Live Demo</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="portfolio-info p-3">
                                <h6 class="mb-2">${project.title}</h6>
                                <div class="d-flex flex-wrap gap-2 mb-2">
                                    ${project.badges.map(badge => `<span class="badge bg-primary">${badge}</span>`).join('')}
                                </div>
                                <p class="text-muted small mb-0">${project.description}</p>
                            </div>
                        </div>
                    </div>
                `;
                
                portfolioGrid.insertAdjacentHTML('beforeend', projectHTML);
            });
            
            // Animate new items
            const newItems = portfolioGrid.querySelectorAll('.portfolio-item[style*="opacity: 0"]');
            newItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                    item.style.transition = 'all 0.6s ease-out';
                }, index * 100);
            });
            
            // Hide load more button
            this.style.display = 'none';
        });
    }
}

// Lightbox functionality
function initLightbox() {
    // Create lightbox modal if it doesn't exist
    if (!document.getElementById('lightboxModal')) {
        const lightboxHTML = `
            <div class="modal fade" id="lightboxModal" tabindex="-1">
                <div class="modal-dialog modal-xl modal-dialog-centered">
                    <div class="modal-content bg-transparent border-0">
                        <div class="modal-body p-0 text-center">
                            <button type="button" class="btn-close btn-close-white position-absolute top-0 end-0 m-3" data-bs-dismiss="modal" style="z-index: 1050;"></button>
                            <img id="lightboxImage" src="" alt="" class="img-fluid rounded">
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    }
    
    // Handle lightbox triggers
    document.addEventListener('click', function(e) {
        if (e.target.matches('.gallery-image')) {
            const imageSrc = e.target.getAttribute('data-image') || e.target.src;
            const lightboxImage = document.getElementById('lightboxImage');
            if (lightboxImage) {
                lightboxImage.src = imageSrc;
            }
        }
    });
}

// Smooth scrolling for portfolio filter
function scrollToPortfolio() {
    const portfolioSection = document.querySelector('.portfolio-section');
    if (portfolioSection) {
        portfolioSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Search functionality (if needed)
function initPortfolioSearch() {
    const searchInput = document.getElementById('portfolioSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const portfolioItems = document.querySelectorAll('.portfolio-item');
            
            portfolioItems.forEach(item => {
                const title = item.querySelector('h6').textContent.toLowerCase();
                const description = item.querySelector('.text-muted').textContent.toLowerCase();
                const badges = Array.from(item.querySelectorAll('.badge')).map(badge => badge.textContent.toLowerCase()).join(' ');
                
                const matches = title.includes(searchTerm) || description.includes(searchTerm) || badges.includes(searchTerm);
                
                if (matches || searchTerm === '') {
                    item.style.display = 'block';
                    item.style.opacity = '1';
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => {
                        if (item.style.opacity === '0') {
                            item.style.display = 'none';
                        }
                    }, 300);
                }
            });
        });
    }
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        projectData,
        initPortfolioFilter,
        initProjectModal,
        scrollToPortfolio
    };
}