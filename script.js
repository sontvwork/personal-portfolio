document.addEventListener('DOMContentLoaded', () => {
    // Biến và selector
    const nav = document.querySelector('nav');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const contactForm = document.getElementById('contactForm');
    const skillProgressBars = document.querySelectorAll('.skill-progress');
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    let skillsAnimated = false; // Flag để theo dõi đã animate chưa
    
    // Hiệu ứng parallax cho header khi cuộn
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const header = document.querySelector('header');
        header.style.backgroundPositionY = `${scrollY * 0.5}px`;
    });
    
    // Xử lý hiệu ứng cho hero section ngay khi trang load
    setTimeout(() => {
        heroContent.classList.add('visible');
        heroImage.classList.add('visible');
    }, 300);
    
    // Xử lý menu khi scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('nav-scrolled');
        } else {
            nav.classList.remove('nav-scrolled');
        }
        animateSkillBarsOnScroll();
    });
    
    // Xử lý menu toggle trên mobile
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });
    
    // Đóng menu khi click vào link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            document.body.classList.remove('no-scroll');
            
            // Nếu click vào Skills, đảm bảo animation được kích hoạt
            if (link.getAttribute('href') === '#skills') {
                setTimeout(() => {
                    animateSkillBarsOnScroll();
                }, 500); // Đợi 500ms cho scroll hoàn tất
            }
        });
    });
    
    // Thiết lập giá trị width ban đầu cho các thanh progress
    skillProgressBars.forEach(progressBar => {
        // Lưu giá trị width ban đầu vào data attribute
        const targetWidth = progressBar.style.width;
        progressBar.setAttribute('data-width', targetWidth);
        // Bắt đầu với width 0
        progressBar.style.width = "0";
    });
    
    // Animate các thanh kỹ năng khi scroll đến
    function animateSkillBarsOnScroll() {
        if (skillsAnimated) return; // Nếu đã animate rồi thì không làm gì cả
        
        const skillsSection = document.getElementById('skills');
        if (skillsSection && isElementInViewport(skillsSection)) {
            skillProgressBars.forEach(progressBar => {
                // Lấy giá trị width từ data attribute
                const targetWidth = progressBar.getAttribute('data-width');
                progressBar.style.transition = "width 1.5s ease-in-out";
                
                // Thiết lập lại width để tạo animation
                setTimeout(() => {
                    progressBar.style.width = targetWidth;
                }, 200);
            });
            
            // Đánh dấu đã animate để không chạy lại
            skillsAnimated = true;
        }
    }
    
    // Xử lý form liên hệ
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Lấy dữ liệu form
            const formData = {
                name: contactForm.name.value,
                email: contactForm.email.value,
                message: contactForm.message.value
            };
            
            // Mô phỏng việc gửi form (có thể thay bằng gọi API thực tế sau này)
            console.log('Form data:', formData);
            
            // Hiển thị thông báo thành công
            showFormMessage('Cảm ơn! Tin nhắn của bạn đã được gửi thành công.', 'success');
            
            // Reset form
            contactForm.reset();
        });
    }
    
    // Hiển thị thông báo form
    function showFormMessage(message, type = 'success') {
        // Kiểm tra nếu đã có message thì xóa cái cũ
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Tạo thông báo mới
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;
        
        // Chèn thông báo vào form
        contactForm.appendChild(messageElement);
        
        // Tự động xóa sau 5 giây
        setTimeout(() => {
            messageElement.classList.add('fade-out');
            setTimeout(() => messageElement.remove(), 500);
        }, 5000);
    }
    
    // Kiểm tra element có trong viewport không
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }
    
    // Smooth scroll cho internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animation khi tải trang
    function initAnimations() {
        // Thêm animation cho các phần tử khi scroll đến
        const elementsToAnimate = document.querySelectorAll('.section-title, .about-content, .project-card, .timeline-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        elementsToAnimate.forEach(element => {
            observer.observe(element);
        });
    }
    
    // Khởi tạo animations
    initAnimations();
    
    // Thêm CSS cho animations
    const style = document.createElement('style');
    style.innerHTML = `
        .hero-content, .hero-image {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 1s ease, transform 1s ease;
        }
        
        .hero-content.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .hero-image.visible {
            opacity: 1;
            transform: translateY(0);
            transition-delay: 0.3s;
        }
        
        .section-title, .about-content, .project-card, .timeline-item {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .section-title.animate, .about-content.animate, .project-card.animate, .timeline-item.animate {
            opacity: 1;
            transform: translateY(0);
        }
        
        .form-message {
            padding: 10px;
            margin-top: 15px;
            border-radius: 4px;
            transition: opacity 0.5s ease;
        }
        
        .form-message.success {
            background-color: rgba(76, 175, 80, 0.1);
            color: #4caf50;
            border: 1px solid #4caf50;
        }
        
        .form-message.error {
            background-color: rgba(244, 67, 54, 0.1);
            color: #f44336;
            border: 1px solid #f44336;
        }
        
        .form-message.fade-out {
            opacity: 0;
        }
        
        body.no-scroll {
            overflow: hidden;
        }
        
        /* Hiệu ứng khi hover vào nút */
        .btn:hover {
            transform: translateY(-3px);
            box-shadow: var(--shadow-3);
        }
        
        .btn:active {
            transform: translateY(1px);
            box-shadow: var(--shadow-1);
        }
    `;
    document.head.appendChild(style);
    
    // Thêm delay cho các project card animation
    document.querySelectorAll('.project-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Thêm delay cho các timeline items
    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.15}s`;
    });
    
    // Thêm sự kiện click cho tiêu đề Skills để reset và chạy lại animation
    const skillsTitle = document.querySelector('#skills .section-title');
    if (skillsTitle) {
        skillsTitle.style.cursor = 'pointer';
        skillsTitle.addEventListener('click', () => {
            // Reset lại trạng thái animation
            skillsAnimated = false;
            
            // Reset lại width của tất cả progress bars về 0
            skillProgressBars.forEach(progressBar => {
                progressBar.style.transition = "none";
                progressBar.style.width = "0";
            });
            
            // Vì transition đã bị tắt, đợi một frame trước khi bật lại và animate
            requestAnimationFrame(() => {
                setTimeout(() => {
                    animateSkillBarsOnScroll();
                }, 50);
            });
        });
    }
}); 