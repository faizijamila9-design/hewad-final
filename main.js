document.documentElement.classList.add('js');

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

function closeMenu() {
    if (!menuToggle || !navLinks) return;

    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    menuToggle.textContent = '☰';
}

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        const opened = navLinks.classList.toggle('open');

        menuToggle.setAttribute('aria-expanded', String(opened));
        menuToggle.setAttribute('aria-label', opened ? 'Close menu' : 'Open menu');
        menuToggle.textContent = opened ? '✕' : '☰';
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') closeMenu();
    });
}

const sectionLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const pageSections = sectionLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

if ('IntersectionObserver' in window && pageSections.length) {
    const sectionObserver = new IntersectionObserver(entries => {
        const currentSection = entries
            .filter(entry => entry.isIntersecting)
            .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

        if (!currentSection) return;

        sectionLinks.forEach(link => {
            const current = link.hash === `#${currentSection.target.id}`;
            link.classList.toggle('active', current);

            if (current) {
                link.setAttribute('aria-current', 'location');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }, {
        rootMargin: '-20% 0px -65% 0px',
        threshold: [0, 0.1, 0.25, 0.5]
    });

    pageSections.forEach(section => sectionObserver.observe(section));
}

const typingTarget = document.querySelector('[data-typing]');

if (typingTarget) {
    const phrases = (
        typingTarget.dataset.phrases ||
        'Digital experiences|Smarter solutions|Real possibilities'
    ).split('|');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
        typingTarget.textContent = phrases[0];
    } else {
        let phraseIndex = 0;
        let charIndex = 0;
        let deleting = false;

        function typeWords() {
            const current = phrases[phraseIndex];

            typingTarget.textContent = current.substring(0, charIndex);

            if (!deleting && charIndex < current.length) {
                charIndex++;
                window.setTimeout(typeWords, 75);
            } else if (!deleting) {
                deleting = true;
                window.setTimeout(typeWords, 1400);
            } else if (charIndex > 0) {
                charIndex--;
                window.setTimeout(typeWords, 38);
            } else {
                deleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                window.setTimeout(typeWords, 350);
            }
        }

        typeWords();
    }
}

document.querySelectorAll('main > section:not(.hero)').forEach(section => {
    section.classList.add('reveal');
});

const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        });
    }, { threshold: 0.12 });

    revealElements.forEach(element => revealObserver.observe(element));
} else {
    revealElements.forEach(element => element.classList.add('visible'));
}

document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const item = button.closest('.faq-item');
        const answer = item.querySelector('.faq-answer');
        const expanded = button.getAttribute('aria-expanded') !== 'true';

        item.classList.toggle('open', expanded);
        button.setAttribute('aria-expanded', String(expanded));
        answer.style.maxHeight = expanded ? `${answer.scrollHeight}px` : '0';
        button.querySelector('span:last-child').textContent = expanded ? '−' : '+';
    });
});

const filterButtons = document.querySelectorAll('.filter-btn');
const projectItems = document.querySelectorAll('[data-category]');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.dataset.filter;

        filterButtons.forEach(filterButton => {
            const selected = filterButton === button;
            filterButton.classList.toggle('active', selected);
            filterButton.setAttribute('aria-pressed', String(selected));
        });

        projectItems.forEach(item => {
            item.hidden = filter !== 'all' && item.dataset.category !== filter;
        });
    });
});

const contactForm = document.querySelector('#contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', event => {
        event.preventDefault();

        const formData = new FormData(contactForm);
        const subject = encodeURIComponent(`Website enquiry: ${formData.get('subject')}`);
        const body = encodeURIComponent(
            `Name: ${formData.get('name')}\nEmail: ${formData.get('email')}\n\n${formData.get('message')}`
        );
        const status = contactForm.querySelector('.form-status');

        status.textContent = 'Opening your email app with the message details…';
        window.location.href = `mailto:info@hewadit.com?subject=${subject}&body=${body}`;
    });
}

document.querySelectorAll('[data-year]').forEach(element => {
    element.textContent = new Date().getFullYear();
});
