// Supabase connection
const SUPABASE_URL = 'https://ryrtxyozyrfxjcmliroa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5cnR4eW96eXJmeGpjbWxpcm9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3Mzk0MzksImV4cCI6MjA3NjMxNTQzOX0.FKK7x8NrlOF5aaHXJhKnwgvIrG8rfoaYYt5CmbeG854';

// Initialize Supabase with error handling
let supabase;
try {
    if (window.supabase) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase initialized');
    } else {
        console.error('❌ Supabase library not loaded');
    }
} catch (error) {
    console.error('❌ Supabase initialization failed:', error);
}

// Test the connection
async function testSupabase() {
    if (!supabase) {
        console.error('❌ Supabase client not available');
        return;
    }
    
    try {
        const { data, error } = await supabase.from('contacts').select('*').limit(1);
        if (error) {
            console.error('❌ Supabase connection error:', error.message);
        } else {
            console.log('✅ Supabase connected successfully. Data:', data);
        }
    } catch (error) {
        console.error('❌ Supabase test failed:', error);
    }
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM loaded - initializing components');
    
    // Test Supabase after DOM loads
    setTimeout(testSupabase, 1000);
    
    initializeMobileNavigation();
    initializeScrollEffects();
    initializeGSAPReveals();
    initializeParticles();
    initializePortfolioFilter();
    initializeChatbot();
    initializeContactForm(); // 👈 Added contact form initialization
});

// Mobile Navigation
function initializeMobileNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const menuClose = document.getElementById('menuClose');
    const hamburgerIcon = document.querySelector('.hamburger-icon');
    const closeIcon = document.querySelector('.close-icon');
    
    if (!navToggle || !navMenu) {
        console.warn('⚠️ Mobile navigation elements not found');
        return;
    }
    
    function openMenu() {
        navMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (hamburgerIcon) hamburgerIcon.style.display = 'none';
        if (closeIcon) closeIcon.style.display = 'block';
        console.log('📱 Mobile menu opened');
    }
    
    function closeMenu() {
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
        if (hamburgerIcon) hamburgerIcon.style.display = 'block';
        if (closeIcon) closeIcon.style.display = 'none';
        console.log('📱 Mobile menu closed');
    }
    
    // Nav toggle click
    navToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        if (navMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });
    
    // Close button
    if (menuClose) {
        menuClose.addEventListener('click', function(e) {
            e.stopPropagation();
            closeMenu();
        });
    }
    
    // Close menu when clicking links
    const navLinks = document.querySelectorAll('.nav-menu a');
    if (navLinks.length > 0) {
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeMenu();
            });
        });
    } else {
        console.warn('⚠️ Navigation links not found');
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !navToggle.contains(e.target)) {
            closeMenu();
        }
    });
    
    // Prevent menu close when clicking inside menu
    navMenu.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    console.log('✅ Mobile navigation initialized');
}

// Header scroll effect
function initializeScrollEffects() {
    const header = document.querySelector('header');
    if (!header) {
        console.warn('⚠️ Header element not found');
        return;
    }
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    console.log('✅ Scroll effects initialized');
}

// GSAP reveals
function initializeGSAPReveals() {
    if (typeof gsap === 'undefined') {
        console.warn('⚠️ GSAP not loaded');
        return;
    }
    
    if (typeof ScrollTrigger === 'undefined') {
        console.warn('⚠️ ScrollTrigger not loaded');
        return;
    }
    
    try {
        gsap.registerPlugin(ScrollTrigger);
        
        const revealElements = gsap.utils.toArray('.reveal');
        if (revealElements.length === 0) {
            console.warn('⚠️ No .reveal elements found');
            return;
        }
        
        revealElements.forEach((el, i) => {
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
        
        console.log(`✅ GSAP reveals initialized for ${revealElements.length} elements`);
    } catch (error) {
        console.error('❌ GSAP initialization failed:', error);
    }
}

// 3D Hero Particles
function initializeParticles() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) {
        console.warn('⚠️ Hero canvas not found');
        return;
    }
    
    if (typeof THREE === 'undefined') {
        console.warn('⚠️ THREE.js not loaded');
        return;
    }
    
    try {
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
            const rect = canvas.getBoundingClientRect();
            mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            targetX = mouseY * 0.12;
            targetY = mouseX * 0.12;
        });

        function onResize(){
            const width = canvas.clientWidth || window.innerWidth;
            const height = canvas.clientHeight || window.innerHeight;
            renderer.setSize(width, height, false);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }
        
        window.addEventListener('resize', onResize);
        onResize();
        
        let lastTime = 0;
        function animate(currentTime){
            const deltaTime = (currentTime - lastTime) * 0.001;
            lastTime = currentTime;
            
            layers.forEach((layer, index) => {
                layer.material.uniforms.time.value = currentTime * 0.001;
                layer.points.rotation.y += 0.0006 * (index + 1);
                layer.points.rotation.x += 0.00025 * (index + 1);
            });
            
            camera.rotation.x += (targetX - camera.rotation.x) * 0.06;
            camera.rotation.y += (targetY - camera.rotation.y) * 0.06;
            
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        }
        
        requestAnimationFrame(animate);
        console.log('✅ 3D Particles initialized');
        
    } catch (error) {
        console.error('❌ 3D Particles initialization failed:', error);
    }
}

// Portfolio Filter
function initializePortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (filterButtons.length === 0) {
        console.warn('⚠️ Filter buttons not found');
        return;
    }
    
    if (portfolioItems.length === 0) {
        console.warn('⚠️ Portfolio items not found');
        return;
    }
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter items
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
            
            console.log(`🎨 Portfolio filter applied: ${filter}`);
        });
    });
    
    console.log(`✅ Portfolio filter initialized with ${filterButtons.length} buttons and ${portfolioItems.length} items`);
}

// Chatbot
function initializeChatbot() {
    // SECURITY WARNING: This API key is exposed to clients
    // In production, use a server-side proxy
    const API_KEY = "AIzaSyCoE4psjYwGvQ4Vgl6Yk93J3iBGvvQdILk";
    
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const sendButton = document.getElementById('sendButton');
    const userInput = document.getElementById('userInput');
    const messages = document.getElementById('chatbotMessages');
    
    if (!chatbotToggle || !chatbotWindow) {
        console.warn('⚠️ Chatbot elements not found');
        return;
    }
    
    // Toggle chatbot window
    chatbotToggle.addEventListener('click', () => {
        chatbotWindow.classList.toggle('active');
        console.log('🤖 Chatbot toggled:', chatbotWindow.classList.contains('active'));
    });
    
    // Close chatbot
    if (chatbotClose) {
        chatbotClose.addEventListener('click', () => {
            chatbotWindow.classList.remove('active');
            console.log('🤖 Chatbot closed');
        });
    }
    
    // Close chatbot when clicking outside
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

        // Add user message
        let userMsg = document.createElement("div");
        userMsg.classList.add("message", "user");
        userMsg.innerText = input;
        messages.appendChild(userMsg);

        userInput.value = "";

        // Add typing indicator
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

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            let data = await response.json();
            messages.removeChild(botMsg);

            if (data.candidates && data.candidates.length > 0) {
                let responseMsg = document.createElement("div");
                responseMsg.classList.add("message", "bot");
                responseMsg.innerText = data.candidates[0].content.parts[0].text;
                messages.appendChild(responseMsg);
            } else {
                throw new Error('No candidates in response');
            }
        } catch (error) {
            console.error('🤖 Chatbot error:', error);
            messages.removeChild(botMsg);
            
            let errorMsg = document.createElement("div");
            errorMsg.classList.add("message", "bot");
            errorMsg.innerText = "Sorry, I'm having trouble connecting right now. Please try again later.";
            messages.appendChild(errorMsg);
        }

        messages.scrollTop = messages.scrollHeight;
    }

    // Send message on button click
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }

    // Send message on Enter key
    if (userInput) {
        userInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    console.log('✅ Chatbot initialized');
}

// Contact Form to Supabase
function initializeContactForm() {
    // Find the form inside the ContactForm div
    const contactFormDiv = document.querySelector('.ContactForm');
    const form = contactFormDiv ? contactFormDiv.querySelector('form') : null;

    if (!form) {
        console.warn("⚠️ Contact form not found in DOM");
        return;
    }

    console.log('✅ Contact form found:', form);

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Get all form fields that exist in your HTML
        const name = document.getElementById("name")?.value.trim();
        const email = document.getElementById("email")?.value.trim();
        const phone = document.getElementById("phone")?.value.trim(); // Optional
        const subject = document.getElementById("subject")?.value.trim();
        const message = document.getElementById("message")?.value.trim();

        // Validate required fields
        if (!name || !email || !subject || !message) {
            alert("Please fill all required fields");
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Sending...";
        submitBtn.disabled = true;

        try {
            const { data, error } = await supabase
                .from("contacts")
                .insert([{ 
                    name, 
                    email, 
                    phone: phone || null, // Include phone if provided
                    subject,
                    message,
                    created_at: new Date().toISOString()
                }]);

            if (error) {
                console.error("❌ Supabase insert error:", error);
                alert("Failed to send message. Please try again later.");
            } else {
                console.log("✅ Data inserted successfully:", data);
                alert("Message sent successfully! I'll get back to you soon.");
                form.reset();
            }
        } catch (err) {
            console.error("❌ Unexpected error:", err);
            alert("Something went wrong. Please try again.");
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    console.log('✅ Contact form initialized');
}
// Utility function to check component status
function checkComponentStatus() {
    console.group('🔍 Component Status Check');
    console.log('Supabase:', supabase ? '✅' : '❌');
    console.log('GSAP:', typeof gsap !== 'undefined' ? '✅' : '❌');
    console.log('ScrollTrigger:', typeof ScrollTrigger !== 'undefined' ? '✅' : '❌');
    console.log('Three.js:', typeof THREE !== 'undefined' ? '✅' : '❌');
    console.groupEnd();
}

// Run status check after initialization
setTimeout(checkComponentStatus, 2000);
