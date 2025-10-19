// Mobile Navigation
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const menuClose = document.getElementById('menuClose');
    const hamburgerIcon = document.querySelector('.hamburger-icon');
    const closeIcon = document.querySelector('.close-icon');
    
    function openMenu() {
        if (navMenu) {
            navMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (hamburgerIcon) hamburgerIcon.style.display = 'none';
            if (closeIcon) closeIcon.style.display = 'block';
        }
    }
    
    function closeMenu() {
        if (navMenu) {
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            if (hamburgerIcon) hamburgerIcon.style.display = 'block';
            if (closeIcon) closeIcon.style.display = 'none';
        }
    }
    
    if (navToggle) {
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            if (navMenu.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }
    
    if (menuClose) {
        menuClose.addEventListener('click', function(e) {
            e.stopPropagation();
            closeMenu();
        });
    }
    
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', function() {
            closeMenu();
        });
    });
    
    document.addEventListener('click', function(e) {
        if (navMenu && navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !navToggle.contains(e.target)) {
            closeMenu();
        }
    });
    
    if (navMenu) {
        navMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// GSAP reveals
if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('.reveal').forEach((el, i) => {
        gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: i * 0.05,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
    });
}

// 3D Hero Particles
(function(){
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        canvas, 
        antialias: true, 
        alpha: true, 
        powerPreference: 'high-performance' 
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    const createLayer = (count, spread, size, color, speedFactor) => {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const scales = new Float32Array(count);
        const speeds = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            positions[i*3] = (Math.random() - 0.5) * spread;
            positions[i*3 + 1] = (Math.random() - 0.5) * (spread * 0.6);
            positions[i*3 + 2] = (Math.random() - 0.5) * spread;
            scales[i] = Math.random() * 0.8 + 0.2;
            speeds[i] = Math.random() * speedFactor + 0.1;
        }
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
        geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
        const material = new THREE.ShaderMaterial({
            uniforms: { 
                time: { value: 0 }, 
                color: { value: new THREE.Color(color) }, 
                pointSize: { value: size } 
            },
            vertexShader: `
                attribute float aScale; 
                attribute float aSpeed; 
                uniform float time; 
                uniform float pointSize; 
                varying float vAlpha;
                void main(){
                    vec3 p = position;
                    float t = time * aSpeed;
                    p.y += sin(t + p.x * 0.05) * 2.0 * aScale;
                    vec4 mvPos = modelViewMatrix * vec4(p, 1.0);
                    gl_Position = projectionMatrix * mvPos;
                    float sizeAtten = pointSize * aScale * (200.0 / -mvPos.z);
                    gl_PointSize = clamp(sizeAtten, 1.0, 80.0);
                    vAlpha = aScale;
                }
            `,
            fragmentShader: `
                uniform vec3 color; 
                varying float vAlpha; 
                void main(){
                    vec2 uv = gl_PointCoord - 0.5; 
                    float d = length(uv);
                    if (d > 0.5) discard;
                    float a = (1.0 - smoothstep(0.0, 0.5, d));
                    float glow = exp(-d * 6.0);
                    gl_FragColor = vec4(color * (0.6 + glow), a * vAlpha);
                }
            `,
            transparent: true, 
            blending: THREE.AdditiveBlending, 
            depthWrite: false
        });
        const points = new THREE.Points(geometry, material);
        return { points, material, geometry };
    };
    
    const layers = [
        createLayer(900, 60, 3.2, 0x6ea8ff, 0.6),
        createLayer(400, 80, 2.4, 0x8c52ff, 0.35),
        createLayer(180, 120, 4.5, 0xaed7ff, 0.15)
    ];
    
    layers.forEach(l => scene.add(l.points));
    camera.position.z = 28;
    
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;
    
    window.addEventListener('pointermove', e => {
        const r = canvas.getBoundingClientRect();
        mouseX = ((e.clientX - r.left) / r.width) * 2 - 1;
        mouseY = -((e.clientY - r.top) / r.height) * 2 + 1;
        targetX = mouseY * 0.12;
        targetY = mouseX * 0.12;
    });

    function onResize(){
        const w = canvas.clientWidth || window.innerWidth;
        const h = canvas.clientHeight || window.innerHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }
    
    window.addEventListener('resize', onResize);
    onResize();
    
    let last = 0;
    function raf(t){
        const dt = (t - last) * 0.001;
        last = t;
        
        layers.forEach((layer, i) => {
            layer.material.uniforms.time.value = t * 0.001;
            layer.points.rotation.y += 0.0006 * (i+1);
            layer.points.rotation.x += 0.00025 * (i+1);
        });
        
        camera.rotation.x += (targetX - camera.rotation.x) * 0.06;
        camera.rotation.y += (targetY - camera.rotation.y) * 0.06;
        
        renderer.render(scene, camera);
        requestAnimationFrame(raf);
    }
    
    requestAnimationFrame(raf);
})();

// Portfolio Filter
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        portfolioItems.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Chatbot
const API_KEY = "AIzaSyCoE4psjYwGvQ4Vgl6Yk93J3iBGvvQdILk";
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotWindow = document.getElementById('chatbotWindow');
const chatbotClose = document.getElementById('chatbotClose');
const sendButton = document.getElementById('sendButton');
const userInput = document.getElementById('userInput');
const messages = document.getElementById('chatbotMessages');

if (chatbotToggle) {
    chatbotToggle.addEventListener('click', () => {
        chatbotWindow.classList.toggle('active');
    });
}

if (chatbotClose) {
    chatbotClose.addEventListener('click', () => {
        chatbotWindow.classList.remove('active');
    });
}

document.addEventListener('click', (e) => {
    if (chatbotWindow && chatbotToggle && 
        !chatbotWindow.contains(e.target) && 
        !chatbotToggle.contains(e.target)) {
        chatbotWindow.classList.remove('active');
    }
});

async function sendMessage() {
    if (!userInput || !messages) return;
    
    let input = userInput.value.trim();
    if (input === "") return;

    let userMsg = document.createElement("div");
    userMsg.classList.add("message", "user");
    userMsg.innerText = input;
    messages.appendChild(userMsg);

    userInput.value = "";

    let botMsg = document.createElement("div");
    botMsg.classList.add("message", "bot", "chatbot-typing");
    botMsg.innerHTML = '<span></span><span></span><span></span>';
    messages.appendChild(botMsg);
    
    messages.scrollTop = messages.scrollHeight;

    try {
        let response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: input }]
                        }
                    ]
                })
            }
        );

        let data = await response.json();

        messages.removeChild(botMsg);

        if (data.candidates && data.candidates.length > 0) {
            let responseMsg = document.createElement("div");
            responseMsg.classList.add("message", "bot");
            responseMsg.innerText = data.candidates[0].content.parts[0].text;
            messages.appendChild(responseMsg);
        } else {
            let errorMsg = document.createElement("div");
            errorMsg.classList.add("message", "bot");
            errorMsg.innerText = "Sorry, I couldn't understand your request. Please try again.";
            messages.appendChild(errorMsg);
        }
    } catch (error) {
        console.error(error);
        messages.removeChild(botMsg);
        
        let errorMsg = document.createElement("div");
        errorMsg.classList.add("message", "bot");
        errorMsg.innerText = "Sorry, I'm having trouble connecting right now. Please try again later.";
        messages.appendChild(errorMsg);
    }

    messages.scrollTop = messages.scrollHeight;
}

if (sendButton) {
    sendButton.addEventListener('click', sendMessage);
}

if (userInput) {
    userInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}
