// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Loader Animation
const loader = {
    init() {
        const tl = gsap.timeline();
        
        tl.to('.loader-progress', {
            width: '100%',
            duration: 1.5,
            ease: 'power2.inOut'
        })
        .to('.loader', {
            yPercent: -100,
            duration: 0.8,
            ease: 'power2.inOut'
        });

        return tl;
    }
};

// Three.js Background Animation
class Background {
    constructor() {
        this.canvas = document.getElementById('heroCanvas');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true });
        
        this.init();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.position.z = 5;

        // Create particles
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const size = 2000;

        for (let i = 0; i < size; i++) {
            vertices.push(
                Math.random() * 2000 - 1000,
                Math.random() * 2000 - 1000,
                Math.random() * 2000 - 1000
            );
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

        const material = new THREE.PointsMaterial({
            size: 2,
            color: 0x00ffa3,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });

        this.points = new THREE.Points(geometry, material);
        this.scene.add(this.points);

        this.animate();
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.points.rotation.x += 0.0005;
        this.points.rotation.y += 0.0005;

        this.renderer.render(this.scene, this.camera);
    }

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Magnetic Elements
class MagneticElement {
    constructor(element) {
        this.element = element;
        this.strength = element.dataset.strength || 20;
        this.init();
    }

    init() {
        this.element.addEventListener('mousemove', (e) => {
            const rect = this.element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(this.element, {
                duration: 0.3,
                x: x * this.strength / 100,
                y: y * this.strength / 100,
                ease: 'power2.out'
            });
        });

        this.element.addEventListener('mouseleave', () => {
            gsap.to(this.element, {
                duration: 0.3,
                x: 0,
                y: 0,
                ease: 'power2.out'
            });
        });
    }
}

// Smooth Scroll
class SmoothScroll {
    constructor() {
        this.bindMethods();
        this.data = {
            current: 0,
            target: 0,
            ease: 0.075
        };
        this.dom = {
            el: document.querySelector('.smooth-scroll'),
            content: document.querySelector('.smooth-scroll')
        };
        this.rAF = null;
        this.init();
    }

    bindMethods() {
        ['scroll', 'run', 'resize'].forEach((fn) => this[fn] = this[fn].bind(this));
    }

    setHeight() {
        document.body.style.height = `${this.dom.content.offsetHeight}px`;
    }

    resize() {
        this.setHeight();
    }

    scroll() {
        this.data.target = window.scrollY;
    }

    run() {
        this.data.current = gsap.utils.interpolate(
            this.data.current,
            this.data.target,
            this.data.ease
        );
        
        this.dom.content.style.transform = `translate3d(0, ${-this.data.current}px, 0)`;
        this.rAF = requestAnimationFrame(this.run);
    }

    init() {
        this.setHeight();
        this.scroll();
        this.run();

        window.addEventListener('resize', this.resize, false);
        window.addEventListener('scroll', this.scroll, false);
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    // Initialize loader
    const loaderAnimation = loader.init();

    // Initialize background
    const background = new Background();

    // Initialize magnetic elements
    document.querySelectorAll('.magnetic').forEach(el => {
        new MagneticElement(el);
    });

    // Initialize smooth scroll
    new SmoothScroll();

    // GSAP Animations
    gsap.from('.project-card', {
        scrollTrigger: {
            trigger: '.projects',
            start: 'top center',
            toggleActions: 'play none none reverse'
        },
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power2.out'
    });

    // Reveal text animation
    gsap.utils.toArray('.reveal-text').forEach(text => {
        gsap.from(text, {
            scrollTrigger: {
                trigger: text,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power2.out'
        });
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        background.resize();
    });
});

// Custom cursor
const cursor = {
    init() {
        this.cursor = document.querySelector('.cursor');
        this.cursorFollower = document.querySelector('.cursor-follower');
        this.links = document.querySelectorAll('a, button, .magnetic');
        
        document.addEventListener('mousemove', (e) => {
            gsap.to(this.cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1
            });
            gsap.to(this.cursorFollower, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.3
            });
        });

        this.links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                this.cursor.classList.add('active');
                this.cursorFollower.classList.add('active');
            });
            
            link.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('active');
                this.cursorFollower.classList.remove('active');
            });
        });
    }
};

cursor.init();