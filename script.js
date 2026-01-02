// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Form submission handler
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Simple validation
        if (!data.name || !data.email || !data.message) {
            alert('Please fill in all fields');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // In a real application, you would send this data to a server
        // For now, we'll just show a success message
        alert('Thank you for your question! The appropriate team will get back to you soon. Check your email for a confirmation.');
        this.reset();
    });
}

// Add scroll effect to navbar
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Animate elements on scroll (simple intersection observer)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.step, .program-card, .benefit-item, .testimonial-card, .quick-link-card, .contact-card, .action-card-content');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('#nav-menu');

if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
        const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
        mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
        }
    });
}

// Back to Top Button
const backToTopButton = document.getElementById('backToTop');

if (backToTopButton) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// NEW FEATURES FUNCTIONALITY
// ============================================

// Content Data (loaded from content.json)
let contentData = {};

// Load content data
fetch('content.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        contentData = data;
        console.log('Content data loaded:', contentData);
        console.log('Role day one tasks:', contentData.roleDayOneTasks);
        initializeFeatures();
    })
    .catch(err => {
        console.error('Error loading content:', err);
        // Fallback data
        contentData = {
            announcements: [],
            resources: [],
            faq: [],
            glossary: [],
            integrations: [],
            timeline: [],
            firstDayChecklist: [],
            roleDayOneTasks: {}
        };
        initializeFeatures();
    });

function initializeFeatures() {
    initAnnouncements();
    initSearch();
    initThemeControls();
    initFAQ();
    initTimeline();
    initResourceFilters();
    initResourceRatings();
    initRelatedResources();
    initKeyboardShortcuts();
    initLanguageSupport();
    initLazyLoading();
    initFirstDayChecklist();
    initRecentlyViewed();
    initNewResources();
    initResourceCategories();
    initPrintButtons();
    initShareButtons();
    initFeedbackForm();
    initResourceTracking();
    initLoadingStates();
    initEmptyStates();
}

// Announcements
function initAnnouncements() {
    const banner = document.getElementById('announcementBanner');
    const text = document.getElementById('announcementText');
    const closeBtn = document.getElementById('announcementClose');
    
    if (!banner || !contentData.announcements || contentData.announcements.length === 0) return;
    
    const announcement = contentData.announcements[0];
    const dismissed = localStorage.getItem(`announcement-${announcement.id}`);
    
    if (!dismissed && announcement.dismissible) {
        text.textContent = announcement.message;
        banner.classList.add('active');
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            banner.classList.remove('active');
            localStorage.setItem(`announcement-${announcement.id}`, 'true');
        });
    }
}

// Search Functionality
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const searchToggle = document.getElementById('searchToggle');
    
    if (!searchInput || !searchResults) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim().toLowerCase();
        
        if (query.length < 2) {
            searchResults.classList.remove('active');
            return;
        }
        
        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 300);
    });
    
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim().length >= 2) {
            searchResults.classList.add('active');
        }
    });
    
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove('active');
        }
    });
    
    function performSearch(query) {
        const results = [];
        const queryLower = query.toLowerCase();
        
        // Search resources
        if (contentData.resources) {
            contentData.resources.forEach(resource => {
                if (resource.title.toLowerCase().includes(queryLower) ||
                    resource.category.toLowerCase().includes(queryLower) ||
                    (resource.tags && resource.tags.some(tag => tag.toLowerCase().includes(queryLower)))) {
                    results.push({
                        type: 'Resource',
                        title: resource.title,
                        url: resource.url,
                        category: resource.category,
                        query: queryLower
                    });
                }
            });
        }
        
        // Search FAQ
        if (contentData.faq) {
            contentData.faq.forEach((item, index) => {
                if (item.question.toLowerCase().includes(queryLower) ||
                    item.answer.toLowerCase().includes(queryLower)) {
                    results.push({
                        type: 'FAQ',
                        title: item.question,
                        url: `#faq-${index}`,
                        category: 'FAQ',
                        query: queryLower
                    });
                }
            });
        }
        
        // Search glossary
        if (contentData.glossary) {
            contentData.glossary.forEach(term => {
                if (term.term.toLowerCase().includes(queryLower) ||
                    term.definition.toLowerCase().includes(queryLower)) {
                    results.push({
                        type: 'Glossary',
                        title: term.term,
                        url: `#glossary-${term.term}`,
                        category: 'Glossary',
                        query: queryLower
                    });
                }
            });
        }
        
        displaySearchResults(results, query);
    }
    
    function highlightText(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
    
    function displaySearchResults(results, query) {
        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="search-result-item">
                    <p>No results found for "${query}"</p>
                    <p style="font-size: 0.875rem; color: var(--text-light); margin-top: 0.5rem;">
                        Try different keywords or check the FAQ section.
                    </p>
                </div>
            `;
        } else {
            searchResults.innerHTML = results.slice(0, 10).map(result => {
                const highlightedTitle = highlightText(result.title, query);
                return `
                    <div class="search-result-item" onclick="window.location.href='${result.url}'">
                        <strong>${result.type}:</strong> <span>${highlightedTitle}</span>
                        <span style="color: var(--text-light); font-size: 0.875rem; display: block; margin-top: 0.25rem;">${result.category}</span>
                    </div>
                `;
            }).join('');
        }
        searchResults.classList.add('active');
    }
}

// Theme Controls
function initThemeControls() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const highContrastToggle = document.getElementById('highContrastToggle');
    
    // Dark Mode
    if (darkModeToggle) {
        const darkMode = localStorage.getItem('darkMode') === 'true';
        if (darkMode) document.body.classList.add('dark-mode');
        
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDark);
            darkModeToggle.classList.toggle('active', isDark);
        });
        
        if (darkMode) darkModeToggle.classList.add('active');
    }
    
    // High Contrast
    if (highContrastToggle) {
        const highContrast = localStorage.getItem('highContrast') === 'true';
        if (highContrast) document.body.classList.add('high-contrast');
        
        highContrastToggle.addEventListener('click', () => {
            document.body.classList.toggle('high-contrast');
            const isHighContrast = document.body.classList.contains('high-contrast');
            localStorage.setItem('highContrast', isHighContrast);
            highContrastToggle.classList.toggle('active', isHighContrast);
        });
        
        if (highContrast) highContrastToggle.classList.add('active');
    }
}


// Glossary
function initGlossary() {
    const glossaryContainer = document.getElementById('glossaryContainer');
    if (!glossaryContainer || !contentData.glossary) return;
    
    const sortedGlossary = [...contentData.glossary].sort((a, b) => 
        a.term.localeCompare(b.term)
    );
    
    glossaryContainer.innerHTML = sortedGlossary.map(term => `
        <div class="glossary-item" id="glossary-${term.term}">
            <div class="glossary-term">${term.term}</div>
            <div class="glossary-definition">${term.definition}</div>
        </div>
    `).join('');
}

// Timeline
function initTimeline() {
    const timelineContainer = document.getElementById('timelineContainer');
    if (!timelineContainer || !contentData.timeline) return;
    
    timelineContainer.innerHTML = contentData.timeline.map((item, index) => `
        <div class="timeline-item">
            <div class="timeline-marker">${index + 1}</div>
            <div class="timeline-content">
                <h3>${item.week}: ${item.title}</h3>
                <ul>
                    ${item.items.map(task => `<li>${task}</li>`).join('')}
                </ul>
            </div>
        </div>
    `).join('');
}

// Integrations
function initIntegrations() {
    const integrationsGrid = document.getElementById('integrationsGrid');
    if (!integrationsGrid || !contentData.integrations) return;
    
    integrationsGrid.innerHTML = contentData.integrations.map(integration => `
        <a href="${integration.url}" class="integration-card" target="_blank" rel="noopener noreferrer">
            <div class="integration-icon">${integration.icon}</div>
            <h3>${integration.name}</h3>
            <p>${integration.description}</p>
        </a>
    `).join('');
}

// Resource Filters
function initResourceFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const resourceCards = document.querySelectorAll('.program-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            
            resourceCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = '';
                } else {
                    const tags = card.dataset.tags || '';
                    if (tags.includes(filter)) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });
}

// Resource Ratings
function initResourceRatings() {
    const ratingBtns = document.querySelectorAll('.rating-btn');
    
    ratingBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const rating = btn.dataset.rating;
            const resourceId = btn.closest('.resource-rating').dataset.resourceId;
            const ratingContainer = btn.closest('.resource-rating');
            
            // Save rating
            const ratings = JSON.parse(localStorage.getItem('resourceRatings') || '{}');
            if (!ratings[resourceId]) {
                ratings[resourceId] = { helpful: 0, notHelpful: 0 };
            }
            ratings[resourceId][rating === 'helpful' ? 'helpful' : 'notHelpful']++;
            localStorage.setItem('resourceRatings', JSON.stringify(ratings));
            
            // Update UI
            btn.classList.add('active');
            const count = ratingContainer.querySelector('.rating-count');
            const total = ratings[resourceId].helpful + ratings[resourceId].notHelpful;
            count.textContent = `${ratings[resourceId].helpful} helpful`;
        });
    });
    
    // Load existing ratings
    const ratings = JSON.parse(localStorage.getItem('resourceRatings') || '{}');
    document.querySelectorAll('.resource-rating').forEach(container => {
        const resourceId = container.dataset.resourceId;
        if (ratings[resourceId]) {
            const count = container.querySelector('.rating-count');
            count.textContent = `${ratings[resourceId].helpful} helpful`;
        }
    });
}

// Related Resources
function initRelatedResources() {
    const resourceLinks = document.querySelectorAll('[data-resource-id]');
    
    resourceLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            const resourceId = parseInt(link.dataset.resourceId);
            const resource = contentData.resources?.find(r => r.id === resourceId);
            
            if (resource && resource.related && resource.related.length > 0) {
                showRelatedResources(resource.related);
            }
        });
    });
    
    function showRelatedResources(relatedIds) {
        const relatedSection = document.getElementById('relatedResources');
        const relatedList = document.getElementById('relatedResourcesList');
        
        if (!relatedSection || !relatedList) return;
        
        const related = contentData.resources?.filter(r => relatedIds.includes(r.id));
        
        if (related && related.length > 0) {
            relatedList.innerHTML = related.map(r => `
                <div class="related-resource-item">
                    <a href="${r.url}" target="_blank" rel="noopener noreferrer">
                        <strong>${r.title}</strong>
                        <span style="display: block; color: var(--text-light); font-size: 0.875rem; margin-top: 0.25rem;">${r.category}</span>
                    </a>
                </div>
            `).join('');
            relatedSection.style.display = 'block';
        }
    }
}

// Keyboard Shortcuts
function initKeyboardShortcuts() {
    const shortcuts = {
        '/': () => document.getElementById('searchInput')?.focus(),
        'Escape': () => {
            document.getElementById('searchResults')?.classList.remove('active');
            document.querySelector('.keyboard-shortcuts')?.classList.remove('active');
        },
        '?': () => {
            const shortcutsEl = document.querySelector('.keyboard-shortcuts');
            if (shortcutsEl) shortcutsEl.classList.toggle('active');
        }
    };
    
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            if (e.key === 'Escape') {
                e.target.blur();
            }
            return;
        }
        
        const key = e.key;
        if (shortcuts[key]) {
            e.preventDefault();
            shortcuts[key]();
        }
    });
    
    // Create shortcuts display
    const shortcutsHTML = `
        <div class="keyboard-shortcuts">
            <h4>Keyboard Shortcuts</h4>
            <div class="keyboard-shortcut-item">
                <span>Search</span>
                <span class="keyboard-key">/</span>
            </div>
            <div class="keyboard-shortcut-item">
                <span>Show shortcuts</span>
                <span class="keyboard-key">?</span>
            </div>
            <div class="keyboard-shortcut-item">
                <span>Close</span>
                <span class="keyboard-key">Esc</span>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', shortcutsHTML);
}

// Language Support
function initLanguageSupport() {
    const languageToggle = document.getElementById('languageToggle');
    if (!languageToggle) return;
    
    const languages = {
        'en': 'English',
        'es': 'Español',
        'fr': 'Français'
    };
    
    let currentLang = localStorage.getItem('language') || 'en';
    
    languageToggle.addEventListener('click', () => {
        // Create language selector
        const selector = document.createElement('div');
        selector.className = 'language-selector active';
        selector.innerHTML = Object.entries(languages).map(([code, name]) => `
            <div class="language-option ${code === currentLang ? 'active' : ''}" data-lang="${code}">
                ${name}
            </div>
        `).join('');
        
        document.body.appendChild(selector);
        
        selector.querySelectorAll('.language-option').forEach(option => {
            option.addEventListener('click', () => {
                currentLang = option.dataset.lang;
                localStorage.setItem('language', currentLang);
                selector.remove();
                // In a real implementation, you would load translations here
            });
        });
        
        document.addEventListener('click', (e) => {
            if (!selector.contains(e.target) && e.target !== languageToggle) {
                selector.remove();
            }
        }, { once: true });
    });
}

// Lazy Loading
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// Analytics (placeholder - replace with your tracking ID)
function initAnalytics() {
    // Google Analytics placeholder
    // Replace GA_MEASUREMENT_ID with your actual ID
    /*
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
    */
}

// Initialize analytics on load
// initAnalytics();

// First Day Checklist
function renderOriginalChecklist() {
    const checklistContainer = document.getElementById('checklistContainer');
    if (!checklistContainer || !contentData.firstDayChecklist) return;
    
    const savedProgress = JSON.parse(localStorage.getItem('checklistProgress') || '{}');
    
    checklistContainer.innerHTML = contentData.firstDayChecklist.map((item, index) => {
        const isChecked = savedProgress[index] || false;
        return `
            <div class="checklist-item ${isChecked ? 'completed' : ''}" data-index="${index}">
                <input type="checkbox" class="checklist-checkbox" ${isChecked ? 'checked' : ''} id="checklist-${index}">
                <div class="checklist-content">
                    <h4>${item.task}</h4>
                    <div class="checklist-meta">
                        <span class="checklist-category">${item.category}</span>
                        ${item.required ? '<span class="checklist-required">Required</span>' : '<span>Optional</span>'}
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    checklistContainer.querySelectorAll('.checklist-checkbox').forEach((checkbox, index) => {
        checkbox.addEventListener('change', () => {
            const item = checkbox.closest('.checklist-item');
            const progress = JSON.parse(localStorage.getItem('checklistProgress') || '{}');
            progress[index] = checkbox.checked;
            localStorage.setItem('checklistProgress', JSON.stringify(progress));
            
            if (checkbox.checked) {
                item.classList.add('completed');
            } else {
                item.classList.remove('completed');
            }
        });
    });
}

function initFirstDayChecklist() {
    renderOriginalChecklist();
    // Handle role-specific buttons
    initRoleSpecificChecklist();
}

// Role-Specific Checklist
function initRoleSpecificChecklist() {
    const roleButtons = document.querySelectorAll('.checklist-role-btn');
    const checklistContainer = document.getElementById('checklistContainer');
    if (!roleButtons.length || !checklistContainer) return;
    
    // Store original content (checklist should already be rendered by renderOriginalChecklist)
    const sectionHeader = document.querySelector('#first-day-checklist .section-header');
    const originalTitle = sectionHeader ? sectionHeader.querySelector('h2').textContent : 'First Day Checklist';
    const originalSubtitle = sectionHeader ? sectionHeader.querySelector('p').textContent : 'Complete these tasks to get started';
    
    roleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const role = button.getAttribute('data-role');
            
            // Update button states
            roleButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Check if role-specific tasks exist
            if (contentData.roleDayOneTasks && contentData.roleDayOneTasks[role]) {
                const roleTasks = contentData.roleDayOneTasks[role];
                const savedProgress = JSON.parse(localStorage.getItem(`checklistProgress-${role}`) || '{}');
                
                // Update section header
                const sectionHeader = document.querySelector('#first-day-checklist .section-header');
                sectionHeader.querySelector('h2').textContent = `First Day Checklist - ${role}`;
                sectionHeader.querySelector('p').textContent = `Complete these ${role}-specific tasks to get started`;
                
                // Render role-specific tasks
                checklistContainer.innerHTML = roleTasks.map((item, index) => {
                    const isChecked = savedProgress[index] || false;
                    const taskId = `role-checklist-${role}-${index}`;
                    
                    let taskContent = `<h4>${item.task}</h4>`;
                    let embedContent = '';
                    
                    // Add links if available
                    if (item.url && !item.embed) {
                        taskContent = `<h4><a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.task} <span class="external-link-icon" aria-label="Opens in new tab">↗</span></a></h4>`;
                    } else if (item.urls && item.urls.length > 0) {
                        const links = item.urls.map((url, i) => 
                            `<a href="${url}" target="_blank" rel="noopener noreferrer" class="task-link">Link ${i + 1} <span class="external-link-icon" aria-label="Opens in new tab">↗</span></a>`
                        ).join(' ');
                        taskContent = `<h4>${item.task}</h4><div class="task-links">${links}</div>`;
                    }
                    
                    // Add embed if specified
                    if (item.embed && item.embedUrl) {
                        embedContent = `
                            <div class="spreadsheet-embed-container">
                                <iframe 
                                    src="${item.embedUrl}" 
                                    frameborder="0" 
                                    allowfullscreen
                                    class="spreadsheet-embed"
                                    title="${item.task}">
                                </iframe>
                                <div class="spreadsheet-actions">
                                    <a href="${item.url || item.embedUrl.replace('/preview', '/edit')}" target="_blank" rel="noopener noreferrer" class="spreadsheet-link-btn">
                                        Open in Google Sheets <span class="external-link-icon" aria-label="Opens in new tab">↗</span>
                                    </a>
                                </div>
                            </div>
                        `;
                        if (item.url) {
                            taskContent = `<h4><a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.task} <span class="external-link-icon" aria-label="Opens in new tab">↗</span></a></h4>`;
                        }
                    }
                    
                    return `
                        <div class="checklist-item ${isChecked ? 'completed' : ''} ${item.embed ? 'has-embed' : ''}" data-index="${index}">
                            <input type="checkbox" class="checklist-checkbox" ${isChecked ? 'checked' : ''} id="${taskId}">
                            <div class="checklist-content">
                                ${taskContent}
                                ${embedContent}
                                <div class="checklist-meta">
                                    <span class="checklist-category">${item.category}</span>
                                    ${item.required ? '<span class="checklist-required">Required</span>' : '<span>Optional</span>'}
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
                
                // Add event listeners for checkboxes
                checklistContainer.querySelectorAll('.checklist-checkbox').forEach((checkbox, index) => {
                    checkbox.addEventListener('change', () => {
                        const item = checkbox.closest('.checklist-item');
                        const progress = JSON.parse(localStorage.getItem(`checklistProgress-${role}`) || '{}');
                        progress[index] = checkbox.checked;
                        localStorage.setItem(`checklistProgress-${role}`, JSON.stringify(progress));
                        
                        if (checkbox.checked) {
                            item.classList.add('completed');
                        } else {
                            item.classList.remove('completed');
                        }
                    });
                });
            } else {
                // Restore original checklist if no role-specific tasks
                renderOriginalChecklist();
                const sectionHeader = document.querySelector('#first-day-checklist .section-header');
                if (sectionHeader) {
                    sectionHeader.querySelector('h2').textContent = originalTitle;
                    sectionHeader.querySelector('p').textContent = originalSubtitle;
                }
            }
        });
    });
    
    // Add "Show All" button functionality
    const showAllBtn = document.createElement('button');
    showAllBtn.className = 'checklist-role-btn show-all-btn';
    showAllBtn.textContent = 'Show All';
    showAllBtn.style.display = 'none';
    showAllBtn.addEventListener('click', () => {
        roleButtons.forEach(btn => btn.classList.remove('active'));
        showAllBtn.style.display = 'none';
        const sectionHeader = document.querySelector('#first-day-checklist .section-header');
        if (sectionHeader) {
            sectionHeader.querySelector('h2').textContent = originalTitle;
            sectionHeader.querySelector('p').textContent = originalSubtitle;
        }
        renderOriginalChecklist();
    });
    
    // Insert show all button after role buttons
    const buttonsContainer = document.querySelector('.checklist-buttons');
    if (buttonsContainer) {
        buttonsContainer.appendChild(showAllBtn);
    }
    
    // Show "Show All" button when a role is selected
    roleButtons.forEach(button => {
        const originalClickHandler = button.onclick;
        button.addEventListener('click', () => {
            if (button.classList.contains('active')) {
                showAllBtn.style.display = 'inline-block';
            }
        });
    });
}

// Recently Viewed
function initRecentlyViewed() {
    const recentlyViewedSection = document.getElementById('recently-viewed');
    const recentlyViewedGrid = document.getElementById('recentlyViewedGrid');
    if (!recentlyViewedSection || !recentlyViewedGrid) return;
    
    const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    
    if (viewed.length === 0) {
        recentlyViewedSection.style.display = 'none';
        return;
    }
    
    recentlyViewedSection.style.display = 'block';
    recentlyViewedGrid.innerHTML = viewed.slice(0, 6).map(item => `
        <div class="recently-viewed-item">
            <a href="${item.url}" target="_blank" rel="noopener noreferrer">
                <h4>${item.title}</h4>
                <span style="color: var(--text-light); font-size: 0.875rem;">${item.category}</span>
            </a>
        </div>
    `).join('');
}

// Track resource views
function trackResourceView(resourceId, title, url, category) {
    const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    const newItem = { id: resourceId, title, url, category, timestamp: Date.now() };
    
    // Remove if already exists
    const filtered = viewed.filter(item => item.id !== resourceId);
    // Add to beginning
    filtered.unshift(newItem);
    // Keep only last 10
    const limited = filtered.slice(0, 10);
    
    localStorage.setItem('recentlyViewed', JSON.stringify(limited));
    
    // Update recently viewed section
    initRecentlyViewed();
    
    // Track popularity
    const popular = JSON.parse(localStorage.getItem('popularResources') || '{}');
    popular[resourceId] = (popular[resourceId] || 0) + 1;
    localStorage.setItem('popularResources', JSON.stringify(popular));
}

// Popular Resources
function initPopularResources() {
    const popularGrid = document.getElementById('popularResourcesGrid');
    if (!popularGrid || !contentData.resources) return;
    
    const popular = JSON.parse(localStorage.getItem('popularResources') || '{}');
    const sorted = contentData.resources
        .map(r => ({ ...r, views: popular[r.id] || 0 }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 3);
    
    if (sorted.length === 0 || sorted[0].views === 0) {
        popularGrid.innerHTML = '<div class="empty-state"><p>No popular resources yet. Start exploring!</p></div>';
        return;
    }
    
    popularGrid.innerHTML = sorted.map(resource => `
        <div class="popular-resource-card">
            <a href="${resource.url}" target="_blank" rel="noopener noreferrer">
                <h4>${resource.title}</h4>
                <span class="popularity-badge">${resource.views} views</span>
            </a>
        </div>
    `).join('');
}

// New Resources
function initNewResources() {
    const newGrid = document.getElementById('newResourcesGrid');
    if (!newGrid || !contentData.resources) return;
    
    const sorted = [...contentData.resources]
        .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
        .slice(0, 3);
    
    newGrid.innerHTML = sorted.map(resource => `
        <div class="new-resource-card">
            <span class="new-badge">New</span>
            <a href="${resource.url}" target="_blank" rel="noopener noreferrer">
                <h4>${resource.title}</h4>
                <p style="color: var(--text-light); font-size: 0.875rem; margin-top: 0.5rem;">Updated: ${new Date(resource.lastUpdated).toLocaleDateString()}</p>
            </a>
        </div>
    `).join('');
}

// Resource Categories Sidebar
function initResourceCategories() {
    const categoryLinks = document.querySelectorAll('.category-link');
    const resourceCards = document.querySelectorAll('.program-card');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            categoryLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            const category = link.dataset.category;
            
            resourceCards.forEach(card => {
                if (category === 'all') {
                    card.style.display = '';
                } else {
                    const cardCategory = card.dataset.category;
                    if (cardCategory === category) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });
}

// Print Buttons
function initPrintButtons() {
    document.querySelectorAll('.print-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const url = btn.dataset.url;
            window.open(url, '_blank');
            // Note: For Google Docs, users can use File > Print in the opened window
        });
    });
}

// Share Buttons
function initShareButtons() {
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const url = btn.dataset.url;
            const title = btn.dataset.title;
            showShareModal(url, title);
        });
    });
}

function showShareModal(url, title) {
    let modal = document.getElementById('shareModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'shareModal';
        modal.className = 'share-modal';
        modal.innerHTML = `
            <div class="share-modal-content">
                <button class="share-close">×</button>
                <h3>Share Resource</h3>
                <div class="share-input-group">
                    <input type="text" class="share-input" id="shareUrlInput" readonly>
                    <button class="share-copy-btn" id="shareCopyBtn">Copy</button>
                </div>
                <p style="font-size: 0.875rem; color: var(--text-light); margin-top: 1rem;">
                    Or share via: <a href="mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}" style="color: var(--primary-color);">Email</a>
                </p>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.querySelector('.share-close').addEventListener('click', () => {
            modal.classList.remove('active');
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
        
        modal.querySelector('#shareCopyBtn').addEventListener('click', () => {
            const input = modal.querySelector('#shareUrlInput');
            input.select();
            document.execCommand('copy');
            const btn = modal.querySelector('#shareCopyBtn');
            btn.textContent = 'Copied!';
            setTimeout(() => {
                btn.textContent = 'Copy';
            }, 2000);
        });
    }
    
    modal.querySelector('#shareUrlInput').value = url;
    modal.classList.add('active');
}

// Feedback Form
function initFeedbackForm() {
    const feedbackForm = document.getElementById('feedbackForm');
    if (!feedbackForm) return;
    
    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(feedbackForm);
        const data = Object.fromEntries(formData);
        
        // In a real application, send to server
        // For now, save to localStorage and show success message
        const feedback = JSON.parse(localStorage.getItem('feedback') || '[]');
        feedback.push({
            ...data,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('feedback', JSON.stringify(feedback));
        
        alert('Thank you for your feedback! We appreciate your input.');
        feedbackForm.reset();
    });
}

// Resource Tracking
function initResourceTracking() {
    document.querySelectorAll('.resource-link, .quick-link-card[data-resource-id]').forEach(link => {
        link.addEventListener('click', () => {
            const resourceId = link.dataset.resourceId;
            const title = link.textContent.trim();
            const url = link.href;
            const category = link.dataset.category || link.closest('.program-card')?.querySelector('.program-badge')?.textContent || 'General';
            
            if (resourceId) {
                trackResourceView(resourceId, title, url, category);
            }
        });
    });
}

// Loading States
function initLoadingStates() {
    // Show loading on search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            // Loading state handled in search function
        });
    }
    
    // Show loading on form submissions
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', () => {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="loading"></span> Submitting...';
            }
        });
    });
}

// Empty States
function initEmptyStates() {
    // Check for empty sections and show empty states
    const sections = [
        { id: 'recentlyViewedGrid', message: 'No recently viewed resources yet.' },
        { id: 'newResourcesGrid', message: 'No new resources at this time.' }
    ];
    
    sections.forEach(section => {
        const element = document.getElementById(section.id);
        if (element && element.children.length === 0) {
            element.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <p>${section.message}</p>
                </div>
            `;
        }
    });
}

// Enhanced FAQ with "Was this helpful?"
function initFAQ() {
    const faqContainer = document.getElementById('faqContainer');
    if (!faqContainer || !contentData.faq) return;
    
    faqContainer.innerHTML = contentData.faq.map((item, index) => {
        const helpful = JSON.parse(localStorage.getItem(`faqHelpful-${index}`) || 'null');
        return `
        <div class="faq-item" id="faq-${index}">
            <div class="faq-question">${item.question}</div>
            <div class="faq-answer">
                ${item.answer}
                <div class="faq-helpful">
                    <span class="faq-helpful-label">Was this helpful?</span>
                    <div class="faq-helpful-buttons">
                        <button class="faq-helpful-btn ${helpful === true ? 'active' : ''}" data-helpful="true" data-index="${index}">👍 Yes</button>
                        <button class="faq-helpful-btn ${helpful === false ? 'active' : ''}" data-helpful="false" data-index="${index}">👎 No</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    }).join('');
    
    faqContainer.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqContainer.querySelectorAll('.faq-item').forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
    
    // Handle helpful buttons
    faqContainer.querySelectorAll('.faq-helpful-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = btn.dataset.index;
            const helpful = btn.dataset.helpful === 'true';
            
            localStorage.setItem(`faqHelpful-${index}`, helpful);
            
            // Update button states
            const buttons = btn.parentElement.querySelectorAll('.faq-helpful-btn');
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

