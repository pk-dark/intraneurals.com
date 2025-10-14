// script.js - Premium Professional Features
// - Enhanced animations and interactions
// - Advanced filtering system with dropdowns
// - Working modals with Formspree integration
// - AI Chatbot with improved responses
// - Electric stack card animation
// - Footer forms with Formspree integration
// - Smooth scroll and performance optimizations

/* Global Helpers */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// Global state
const AppState = {
    currentCarouselIndex: 0,
    isChatbotOpen: false,
    isQuizOpen: false,
    isEnrollOpen: false,
    autoRotateInterval: null,
    stackAnimationId: null,
    currentCourseFilter: 'all',
    currentInstitutionFilter: 'all'
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Intraneurals Premium Website Initialized');
    initMobileNav();
    initSmoothAnchors();
    init3DCarousel();
    initCardInteractions();
    initElectricStackAnimation();
    initQuizModal();
    initEnrollModal();
    initChatbot();
    initCursorMagnifier();
    initScrollAnimations();
    initFilterDropdowns();
    initServiceButtons();
    initProjectButtons();
    initFooterForms();
});

/* Mobile Navigation */
function initMobileNav() {
    const btn = $('#navToggle');
    const nav = $('#primaryNav');
    
    if (!btn || !nav) return;
    
    btn.addEventListener('click', () => {
        const isVisible = nav.getAttribute('data-visible') === 'true';
        nav.setAttribute('data-visible', String(!isVisible));
        btn.setAttribute('aria-expanded', String(!isVisible));
        
        if (!isVisible) {
            nav.style.display = 'flex';
            setTimeout(() => nav.classList.add('nav-open'), 10);
        } else {
            nav.classList.remove('nav-open');
            setTimeout(() => nav.style.display = 'none', 300);
        }
    });

    // Close nav when link is clicked (mobile)
    $$('.nav-list a').forEach(a => {
        a.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                nav.setAttribute('data-visible', 'false');
                btn.setAttribute('aria-expanded', 'false');
                nav.classList.remove('nav-open');
                setTimeout(() => nav.style.display = 'none', 300);
            }
        });
    });
}

/* Smooth Anchor Scrolling */
function initSmoothAnchors() {
    $$('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const href = a.getAttribute('href');
            if (href === '#' || href === '#!') return;
            
            const target = $(href);
            if (target) {
                e.preventDefault();
                const headerHeight = $('.site-header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* 3D Carousel */
function init3DCarousel() {
    const carousel = $('#carousel3d');
    const prevBtn = $('#carouselPrev');
    const nextBtn = $('#carouselNext');
    
    if (!carousel) return;
    
    const items = $$('.carousel-item');
    const totalItems = items.length;
    const angle = 360 / totalItems;
    
    function positionItems() {
        items.forEach((item, index) => {
            const rotateY = index * angle;
            const translateZ = 350;
            item.style.transform = `rotateY(${rotateY}deg) translateZ(${translateZ}px)`;
            item.classList.remove('active');
        });
        items[AppState.currentCarouselIndex]?.classList.add('active');
    }
    
    function rotateCarousel() {
        carousel.style.transform = `rotateY(${-AppState.currentCarouselIndex * angle}deg)`;
    }
    
    function nextSlide() {
        AppState.currentCarouselIndex = (AppState.currentCarouselIndex + 1) % totalItems;
        updateCarousel();
    }
    
    function prevSlide() {
        AppState.currentCarouselIndex = (AppState.currentCarouselIndex - 1 + totalItems) % totalItems;
        updateCarousel();
    }
    
    function updateCarousel() {
        rotateCarousel();
        positionItems();
    }
    
    // Initialize
    positionItems();
    rotateCarousel();
    
    // Event listeners
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    // Auto-rotate
    function startAutoRotate() {
        AppState.autoRotateInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoRotate() {
        if (AppState.autoRotateInterval) {
            clearInterval(AppState.autoRotateInterval);
            AppState.autoRotateInterval = null;
        }
    }
    
    startAutoRotate();
    
    // Pause on hover
    carousel.addEventListener('mouseenter', stopAutoRotate);
    carousel.addEventListener('mouseleave', startAutoRotate);
    
    // Touch support
    let touchStartX = 0;
    carousel.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    carousel.addEventListener('touchend', e => {
        const touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? nextSlide() : prevSlide();
        }
    });
}

/* Interactive Card Effects */
function initCardInteractions() {
    // Enhanced hover effects for course cards
    if (!window.matchMedia('(pointer:coarse)').matches) {
        $$('.course-card, .institution-card, .project-card').forEach(card => {
            card.addEventListener('pointermove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px) translateY(-8px)`;
            });
            
            card.addEventListener('pointerleave', () => {
                card.style.transform = 'translateY(-8px)';
            });
        });
    }
}

/* Electric Stack Animation */
function initElectricStackAnimation() {
    const stack = $('#cardStack');
    if (!stack) return;
    
    // Add electric glow class
    stack.classList.add('electric-glow');
    
    let time = 0;
    let electricInterval = null;
    
    function animateElectricStack() {
        time += 0.005;
        const rotateY = Math.sin(time) * 5;
        const rotateX = Math.cos(time * 0.7) * 3;
        
        // Add random electric effect
        const randomElectric = Math.random() > 0.95;
        if (randomElectric) {
            stack.style.boxShadow = 'var(--shadow-2xl), var(--shadow-electric)';
            setTimeout(() => {
                stack.style.boxShadow = 'var(--shadow-2xl)';
            }, 300);
        }
        
        stack.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
        AppState.stackAnimationId = requestAnimationFrame(animateElectricStack);
    }
    
    // Start animation
    animateElectricStack();
    
    // Pause on hover for manual control
    stack.addEventListener('mouseenter', () => {
        cancelAnimationFrame(AppState.stackAnimationId);
        clearInterval(electricInterval);
        
        // Create electric pulse effect on hover
        electricInterval = setInterval(() => {
            stack.style.boxShadow = 'var(--shadow-2xl), var(--shadow-electric)';
            setTimeout(() => {
                stack.style.boxShadow = 'var(--shadow-2xl)';
            }, 300);
        }, 800);
    });
    
    stack.addEventListener('mouseleave', () => {
        clearInterval(electricInterval);
        stack.style.boxShadow = 'var(--shadow-2xl)';
        animateElectricStack();
    });
}

/* Quiz Modal */
function initQuizModal() {
    const openBtns = [$('#openQuiz'), $('#openQuiz2')].filter(Boolean);
    const modal = $('#quizModal');
    const closeBtn = $('#closeQuiz');
    const cancelBtn = $('#cancelQuiz');
    const form = $('#quizForm');
    const result = $('#quizResult');

    function openModal() {
        if (!modal) return;
        AppState.isQuizOpen = true;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        modal.querySelector('select')?.focus();
    }
    
    function closeModal() {
        if (!modal) return;
        AppState.isQuizOpen = false;
        modal.classList.remove('open');
        document.body.style.overflow = '';
        if (result) result.innerHTML = '';
        if (form) form.reset();
    }

    openBtns.forEach(btn => btn.addEventListener('click', openModal));
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    if (form) {
        form.addEventListener('submit', (ev) => {
            ev.preventDefault();
            const data = new FormData(form);
            const q1 = data.get('q1');
            const q2 = data.get('q2');
            const q3 = data.get('q3');
            
            const recommendations = {
                'data': {
                    title: 'Data Science & Analytics',
                    description: 'Perfect for analytical minds who love working with data, statistics, and machine learning.',
                    duration: '6 months',
                    skills: 'Python, Pandas, Scikit-learn, SQL, Tableau'
                },
                'web': {
                    title: 'Full-Stack Web Development',
                    description: 'Ideal for creative problem-solvers who enjoy building interactive web applications.',
                    duration: '5 months',
                    skills: 'JavaScript, React, Node.js, MongoDB, CSS'
                },
                'ai': {
                    title: 'AI & Machine Learning',
                    description: 'For those fascinated by creating intelligent systems and neural networks.',
                    duration: '8 months',
                    skills: 'Python, TensorFlow, PyTorch, NLP, Computer Vision'
                },
                'security': {
                    title: 'Cybersecurity & Ethical Hacking',
                    description: 'Perfect for detail-oriented individuals passionate about protecting digital assets.',
                    duration: '4 months',
                    skills: 'Network Security, Cryptography, Penetration Testing, SIEM'
                },
                'infra': {
                    title: 'Cloud Computing & DevOps',
                    description: 'Great for those who enjoy managing scalable infrastructure and automation.',
                    duration: '4 months',
                    skills: 'AWS, Docker, Kubernetes, CI/CD, Terraform'
                }
            };
            
            const recommendation = recommendations[q1] || recommendations['web'];
            
            if (result) {
                result.innerHTML = `
                    <div class="quiz-result">
                        <div class="result-header">
                            <h3 style="color: var(--accent-primary); margin-bottom: 1rem;">🎯 Your Recommended Path</h3>
                            <h4 style="margin-bottom: 1rem; font-size: 1.5rem;">${recommendation.title}</h4>
                        </div>
                        <div class="result-details">
                            <p style="margin-bottom: 1.5rem; line-height: 1.6; color: var(--text-secondary);">${recommendation.description}</p>
                            <div class="result-meta" style="display: grid; gap: 0.5rem; margin-bottom: 1.5rem;">
                                <div><strong>Duration:</strong> ${recommendation.duration}</div>
                                <div><strong>Key Skills:</strong> ${recommendation.skills}</div>
                            </div>
                        </div>
                        <div class="result-actions" style="display: flex; gap: 1rem; flex-wrap: wrap;">
                            <a href="#courses" class="btn primary small" onclick="closeQuizModal()">Explore Courses</a>
                            <button class="btn ghost small" onclick="resetQuiz()">Take Again</button>
                        </div>
                    </div>
                `;
            }
        });
    }

    // ESC key to close
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && AppState.isQuizOpen) {
            closeModal();
        }
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    window.closeQuizModal = closeModal;
    window.resetQuiz = () => {
        if (result) result.innerHTML = '';
        if (form) form.reset();
    };
}

/* Enrollment Modal */
function initEnrollModal() {
    const modal = $('#enrollModal');
    const closeBtn = $('#closeEnroll');
    const cancelBtn = $('#cancelEnroll');
    const form = $('#enrollForm');
    const result = $('#enrollResult');
    const courseNameInput = $('#courseName');
    
    $$('.enroll-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const courseName = btn.getAttribute('data-course');
            if (courseNameInput && courseName) {
                courseNameInput.value = courseName;
            }
            openEnrollModal();
        });
    });

    function openEnrollModal() {
        if (!modal) return;
        AppState.isEnrollOpen = true;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        modal.querySelector('input')?.focus();
    }
    
    function closeEnrollModal() {
        if (!modal) return;
        AppState.isEnrollOpen = false;
        modal.classList.remove('open');
        document.body.style.overflow = '';
        if (result) result.innerHTML = '';
        if (form) form.reset();
    }

    if (closeBtn) closeBtn.addEventListener('click', closeEnrollModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeEnrollModal);

    if (form) {
        form.addEventListener('submit', async (ev) => {
            ev.preventDefault();
            
            if (result) {
                result.innerHTML = '<p style="text-align:center; padding:1rem;">Submitting your application...</p>';
            }
            
            const formData = new FormData(form);
            
            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    if (result) {
                        result.innerHTML = `
                            <div style="text-align:center; padding:1rem; color: var(--success);">
                                <h3>✅ Application Submitted Successfully!</h3>
                                <p>Thank you for your interest. Our team will contact you within 24 hours.</p>
                            </div>
                        `;
                    }
                    
                    setTimeout(() => {
                        if (form) form.reset();
                        setTimeout(closeEnrollModal, 2000);
                    }, 3000);
                } else {
                    throw new Error('Submission failed');
                }
            } catch (error) {
                if (result) {
                    result.innerHTML = `
                        <div style="text-align:center; padding:1rem; color: var(--error);">
                            <h3>❌ Submission Failed</h3>
                            <p>Please try again or contact us directly.</p>
                        </div>
                    `;
                }
            }
        });
    }

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && AppState.isEnrollOpen) {
            closeEnrollModal();
        }
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeEnrollModal();
        }
    });
}

/* AI Chatbot */
function initChatbot() {
    const toggle = $('#chatbot-toggle');
    const modal = $('#chatbot-modal');
    const closeBtn = $('#chatbot-close');
    const input = $('#chatbot-input');
    const sendBtn = $('#chatbot-send');
    const messages = $('#chatbot-messages');
    const suggestionBtns = $$('.suggestion-btn');

    if (!toggle || !modal) return;

    const responses = {
        'greeting': '👋 Hello! I\'m your career assistant at Intraneurals. I can help you with course recommendations, career guidance, enrollment information, and more. How can I assist you today?',
        'programming language': '🐍 For beginners, I highly recommend starting with **Python**. It\'s versatile, beginner-friendly, and widely used in data science, AI, and web development. JavaScript is another excellent choice for web development.',
        'web developer': '⏱️ Becoming a web developer typically takes **3-6 months** for basic skills and **1-2 years** for advanced proficiency. Our Full-Stack Web Development course can make you job-ready in **5 months**!',
        'data science vs ai': '📊 **Data Science** focuses on extracting insights from data using statistics and visualization. **AI** involves creating intelligent systems that can learn and make decisions. Data Science is often the foundation for AI work.',
        'career switch': '🔄 Switching to tech is absolutely possible! Many of our students come from non-technical backgrounds. Start with our career quiz to identify your path, then join a structured program with hands-on projects.',
        'salary': '💰 Entry-level tech salaries: Web Developers ($60k-85k), Data Scientists ($75k-100k), AI Engineers ($90k-120k), Cloud Architects ($85k-110k). Salaries grow significantly with experience!',
        'portfolio': '🚀 Great portfolio projects: E-commerce platform, Data visualization dashboard, Mobile app, Machine learning model, REST API, Real-time chat application. We provide guidance for all these!',
        'job ready': '✅ You\'re job-ready when you can: Build complete applications, Solve real problems, Use Git for version control, Communicate technical concepts, Work in a team environment.',
        'mentorship': '👥 Our 1:1 mentorship includes: Weekly sessions with industry experts, Code reviews and feedback, Career guidance, Interview preparation, Networking opportunities.',
        'courses': '📚 We offer: Data Science (6 months), AI & ML (8 months), Full-Stack Web (5 months), Cloud Computing (4 months), Mobile Development (5 months), UI/UX Design (4 months), Digital Marketing (3 months).',
        'placement': '🎯 Our placement support: Resume building, Mock interviews, Portfolio reviews, LinkedIn optimization, Direct referrals to 500+ hiring partners, 95% placement rate!',
        'cost': '💳 Course fees: $1,500-$2,500 depending on the program. We offer EMI options, scholarships for deserving candidates, and a 7-day money-back guarantee.',
        'enroll': '📝 To enroll: Click "Enroll Now" on any course, Fill out the application form, Our team will contact you within 24 hours, Complete the payment, Start your learning journey!',
        'default': '🤔 I\'m not sure I understand. Could you please rephrase your question? I can help with course information, career guidance, enrollment details, or skill development advice.'
    };

    function openChatbot() {
        AppState.isChatbotOpen = true;
        modal.classList.add('open');
        toggle.style.display = 'none';
        input.focus();
    }

    function closeChatbot() {
        AppState.isChatbotOpen = false;
        modal.classList.remove('open');
        toggle.style.display = 'flex';
    }

    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        messageDiv.innerHTML = `<p>${text}</p>`;
        messages.appendChild(messageDiv);
        messages.scrollTop = messages.scrollHeight;
    }

    function findResponse(question) {
        const q = question.toLowerCase();
        
        if (q.includes('hello') || q.includes('hi') || q.includes('hey')) 
            return responses.greeting;
        if (q.includes('language') || q.includes('python') || q.includes('javascript') || q.includes('first')) 
            return responses['programming language'];
        if (q.includes('web developer') || q.includes('web dev') || q.includes('timeline') || q.includes('how long')) 
            return responses['web developer'];
        if (q.includes('data science') && q.includes('ai')) 
            return responses['data science vs ai'];
        if (q.includes('career switch') || q.includes('change') || q.includes('transition')) 
            return responses['career switch'];
        if (q.includes('salary') || q.includes('earn') || q.includes('pay')) 
            return responses.salary;
        if (q.includes('portfolio') || q.includes('project')) 
            return responses.portfolio;
        if (q.includes('job ready') || q.includes('hire') || q.includes('employ')) 
            return responses['job ready'];
        if (q.includes('mentor') || q.includes('guidance') || q.includes('support')) 
            return responses.mentorship;
        if (q.includes('course') || q.includes('program')) 
            return responses.courses;
        if (q.includes('placement') || q.includes('job support')) 
            return responses.placement;
        if (q.includes('cost') || q.includes('price') || q.includes('fee')) 
            return responses.cost;
        if (q.includes('enroll') || q.includes('enrollment') || q.includes('register')) 
            return responses.enroll;
        
        return responses.default;
    }

    function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        addMessage(text, true);
        input.value = '';

        setTimeout(() => {
            const response = findResponse(text);
            addMessage(response);
        }, 800);
    }

    toggle.addEventListener('click', openChatbot);
    closeBtn.addEventListener('click', closeChatbot);
    sendBtn.addEventListener('click', sendMessage);
    
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const question = btn.getAttribute('data-question');
            addMessage(question, true);
            
            setTimeout(() => {
                const response = findResponse(question);
                addMessage(response);
            }, 800);
        });
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && AppState.isChatbotOpen) {
            closeChatbot();
        }
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeChatbot();
        }
    });
}

/* Filter Dropdowns */
function initFilterDropdowns() {
    // Course filter dropdown
    const courseFilterBtn = $('#courseFilterBtn');
    const courseFilterContent = $('#courseFilterContent');
    const courseFilterText = $('#courseFilterText');
    const courseFilterOptions = $$('#courseFilterContent .filter-option');
    const courseCards = $$('.course-card');
    
    if (courseFilterBtn && courseFilterContent) {
        courseFilterBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            courseFilterBtn.parentElement.classList.toggle('active');
        });
        
        courseFilterOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const filter = option.getAttribute('data-filter');
                AppState.currentCourseFilter = filter;
                
                // Update button text
                courseFilterText.textContent = option.textContent;
                
                // Update active state
                courseFilterOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                
                // Close dropdown
                courseFilterBtn.parentElement.classList.remove('active');
                
                // Filter cards
                filterCourseCards(filter);
            });
        });
    }
    
    // Institution filter dropdown
    const institutionFilterBtn = $('#institutionFilterBtn');
    const institutionFilterContent = $('#institutionFilterContent');
    const institutionFilterText = $('#institutionFilterText');
    const institutionFilterOptions = $$('#institutionFilterContent .filter-option');
    const institutionCards = $$('.institution-card');
    
    if (institutionFilterBtn && institutionFilterContent) {
        institutionFilterBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            institutionFilterBtn.parentElement.classList.toggle('active');
        });
        
        institutionFilterOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const filter = option.getAttribute('data-filter');
                AppState.currentInstitutionFilter = filter;
                
                // Update button text
                institutionFilterText.textContent = option.textContent;
                
                // Update active state
                institutionFilterOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                
                // Close dropdown
                institutionFilterBtn.parentElement.classList.remove('active');
                
                // Filter cards
                filterInstitutionCards(filter);
            });
        });
    }
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
        if (courseFilterBtn) courseFilterBtn.parentElement.classList.remove('active');
        if (institutionFilterBtn) institutionFilterBtn.parentElement.classList.remove('active');
    });
    
    function filterCourseCards(filter) {
        courseCards.forEach(card => {
            const categories = card.getAttribute('data-category').split(' ');
            const shouldShow = filter === 'all' || categories.includes(filter);
            
            if (shouldShow) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }
    
    function filterInstitutionCards(filter) {
        institutionCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const shouldShow = filter === 'all' || category === filter;
            
            if (shouldShow) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }
}

/* Service Buttons */
function initServiceButtons() {
    $$('.service button').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.textContent.trim();
            
            switch(action) {
                case 'Learn More':
                    showNotification('Redirecting to detailed service information...', 'success');
                    window.open('https://pk-dark.github.io/intra/', '_blank');
                    break;
                case 'Take Quiz':
                    showNotification('Quiz Opening...', 'success');
                    $('#openQuiz').click();
                    break;
                case 'View Schedule':
                    showNotification('Opening workshop schedule...', 'success');
                    window.open('https://pk-dark.github.io/intra/', '_blank');
                    break;
                case 'Get Started':
                    showNotification('Starting your placement journey...', 'success');
                    window.open('https://pk-dark.github.io/intra/', '_blank');
                    break;
                case 'Browse Library':
                    window.open('https://pk-dark.github.io/intra/', '_blank');
                    break;
            }
        });
    });
}

/* Project Buttons */
function initProjectButtons() {
    $$('.project-actions1 button').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.textContent.trim();
            
            if (action === 'View Project') {
                showNotification('Opening project details...', 'success');
                window.open('https://pk-dark.github.io/intra/', '_blank');
            } else if (action === 'Source Code') {
                showNotification('Redirecting to GitHub repository...', 'success');
                window.open('https://pk-dark.github.io/intra/', '_blank');
            }
        });
    });
     $$('.project-actions2 button').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.textContent.trim();
            
            if (action === 'View Project') {
                showNotification('Opening project details...', 'success');
                window.open('https://pk-dark.github.io/intra/', '_blank');
            } else if (action === 'Source Code') {
                showNotification('Redirecting to GitHub repository...', 'success');
                window.open('https://pk-dark.github.io/intra/', '_blank');
            }
        });
    });
     $$('.project-actions3 button').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.textContent.trim();
            
            if (action === 'View Project') {
                showNotification('Opening project details...', 'success');
                window.open('https://pk-dark.github.io/intra/', '_blank');
            } else if (action === 'Source Code') {
                showNotification('Redirecting to GitHub repository...', 'success');
                window.open('https://pk-dark.github.io/intra/', '_blank');
            }
        });
    });
     $$('.project-actions4 button').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.textContent.trim();
            
            if (action === 'View Project') {
                showNotification('Opening project details...', 'success');
                window.open('https://pk-dark.github.io/intra/', '_blank');
            } else if (action === 'Source Code') {
                showNotification('Redirecting to GitHub repository...', 'success');
                window.open('https://pk-dark.github.io/intra/', '_blank');
            }
        });
    });
     $$('.project-actions5 button').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.textContent.trim();
            
            if (action === 'View Project') {
                showNotification('Opening project details...', 'success');
                window.open('https://pk-dark.github.io/intra/', '_blank');
            } else if (action === 'Source Code') {
                showNotification('Redirecting to GitHub repository...', 'success');
                window.open('https://pk-dark.github.io/intra/', '_blank');
            }
        });
    });
     $$('.project-actions6 button').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.textContent.trim();
            
            if (action === 'View Project') {
                showNotification('Opening project details...', 'success');
                window.open('https://pk-dark.github.io/intra/', '_blank');
            } else if (action === 'Source Code') {
                showNotification('Redirecting to GitHub repository...', 'success');
                window.open('https://pk-dark.github.io/intra/', '_blank');
            }
        });
    });
}

/* Footer Forms */
function initFooterForms() {
    // Personal Information Form
    const personalInfoForm = $('#personalInfoForm');
    if (personalInfoForm) {
        personalInfoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = personalInfoForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch(personalInfoForm.action, {
                    method: 'POST',
                    body: new FormData(personalInfoForm),
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    showNotification('✅ Your information has been submitted successfully! We\'ll contact you soon.', 'success');
                    personalInfoForm.reset();
                } else {
                    throw new Error('Submission failed');
                }
            } catch (error) {
                showNotification('❌ Submission failed. Please try again.', 'error');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Contact Form
    const contactForm = $('#contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    showNotification('✅ Your message has been sent successfully! We\'ll get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    throw new Error('Submission failed');
                }
            } catch (error) {
                showNotification('❌ Failed to send message. Please try again.', 'error');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

/* Cursor Magnifier */
function initCursorMagnifier() {
    const magnifier = $('#cursor-magnifier');
    if (!magnifier) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    
    function animateMagnifier() {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;
        
        magnifier.style.left = `${currentX}px`;
        magnifier.style.top = `${currentY}px`;
        
        requestAnimationFrame(animateMagnifier);
    }
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const interactiveElements = $$('a, button, .course-card, .institution-card, .project-card, .service, .person');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            magnifier.style.opacity = '1';
        });
        
        el.addEventListener('mouseleave', () => {
            magnifier.style.opacity = '0';
        });
    });

    animateMagnifier();
}

/* Scroll Animations */
function initScrollAnimations() {
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

    // Set initial state and observe
    $$('.service, .course-card, .institution-card, .project-card, .person, .partner-logo').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

/* Notification System */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">×</button>
        </div>
    `;
    
    // Add styles if not already added
    if (!$('.notification-styles')) {
        const styles = document.createElement('style');
        styles.className = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--glass-bg);
                border: 1px solid var(--glass-border);
                border-radius: var(--radius-lg);
                padding: var(--space-lg);
                box-shadow: var(--shadow-xl);
                z-index: 9999;
                transform: translateX(400px);
                transition: transform 0.3s ease;
                backdrop-filter: blur(var(--glass-blur));
                max-width: 350px;
            }
            .notification.show {
                transform: translateX(0);
            }
            .notification-success {
                border-left: 4px solid var(--success);
            }
            .notification-error {
                border-left: 4px solid var(--error);
            }
            .notification-warning {
                border-left: 4px solid var(--warning);
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: var(--space-md);
            }
            .notification-message {
                flex: 1;
                color: var(--text-primary);
            }
            .notification-close {
                background: transparent;
                border: none;
                color: var(--text-muted);
                font-size: var(--font-size-xl);
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: var(--radius-sm);
                transition: all 0.3s ease;
            }
            .notification-close:hover {
                background: var(--glass-bg);
                color: var(--text-primary);
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
}

/* Performance Optimizations */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

window.addEventListener('resize', debounce(() => {
    if (window.innerWidth >= 768) {
        const nav = $('#primaryNav');
        const btn = $('#navToggle');
        if (nav && btn) {
            nav.setAttribute('data-visible', 'true');
            btn.setAttribute('aria-expanded', 'true');
            nav.style.display = 'flex';
        }
    }
}, 250));

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (AppState.autoRotateInterval) {
        clearInterval(AppState.autoRotateInterval);
    }
    if (AppState.stackAnimationId) {
        cancelAnimationFrame(AppState.stackAnimationId);
    }
});

console.log('✅ All premium features initialized successfully');
