const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particlesArray = [];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

        if (this.size > 0.2) this.size -= 0.02;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particlesArray = [];
    const numberOfParticles = (canvas.width * canvas.height) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();

        for (let j = i; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
                ctx.strokeStyle = `rgba(0, 212, 255, ${1 - distance / 100})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }

        if (particlesArray[i].size <= 0.2) {
            particlesArray.splice(i, 1);
            i--;
            particlesArray.push(new Particle());
        }
    }
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

const menuToggle = document.querySelector('.menu-toggle');
const menuItems = document.querySelector('.menu-items');
const logo = document.querySelector('.logo');
let isMenuOpen = false;

menuToggle.addEventListener('click', () => {
    isMenuOpen = !isMenuOpen;
    if (isMenuOpen) {
        menuToggle.textContent = 'X';
        menuItems.classList.add('open');
        gsap.fromTo(menuItems, 
            { x: 100, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
        );
        
        // שינוי הלוגו ל-EC עם אנימציה
        gsap.to(logo, {
            scale: 0.8,
            opacity: 0,
            duration: 0.2,
            ease: "power2.out",
            onComplete: () => {
                logo.innerHTML = "<span class='logo-letter'>E</span><span class='logo-connector'>⚡</span><span class='logo-letter'>C</span>";
                gsap.to(logo, {
                    fontSize: window.innerWidth <= 600 ? "32px" : "36px",
                    scale: 1,
                    opacity: 1,
                    duration: 0.2,
                    rotation: 360,
                    ease: "back.out(1.7)"
                });
                
                // אנימציית חיבור בין האותיות
                gsap.fromTo('.logo-connector', 
                    { scale: 0, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.3, delay: 0.1, ease: "elastic.out(1.2)" }
                );
                
                // אנימציית נצנוץ לאותיות
                gsap.to('.logo-letter', {
                    textShadow: "0 0 15px rgba(0, 243, 255, 0.8), 0 0 20px rgba(255, 0, 255, 0.5)",
                    duration: 0.5,
                    repeat: 1,
                    yoyo: true
                });
            }
        });
    } else {
        menuToggle.textContent = 'תפריט';
        gsap.to(menuItems, {
            x: 100,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
                menuItems.classList.remove('open');
            }
        });
        
        // החזרת הלוגו ל-Effect-Cube עם אנימציה
        gsap.to(logo, {
            scale: 0.8,
            opacity: 0,
            duration: 0.2,
            ease: "power2.out",
            onComplete: () => {
                logo.innerHTML = "Effect-Cube";
                gsap.to(logo, {
                    fontSize: window.innerWidth <= 600 ? "32px" : "36px",
                    scale: 1,
                    opacity: 1,
                    duration: 0.2,
                    rotation: 0,
                    ease: "back.out(1.7)"
                });
            }
        });
    }
});

document.querySelectorAll('.menu-items a').forEach(link => {
    link.addEventListener('click', () => {
        if (isMenuOpen) {
            isMenuOpen = false;
            menuToggle.textContent = 'תפריט';
            gsap.to(menuItems, {
                x: 100,
                opacity: 0,
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => {
                    menuItems.classList.remove('open');
                }
            });
            
            // החזרת הלוגו ל-Effect-Cube עם אנימציה
            gsap.to(logo, {
                scale: 0.8,
                opacity: 0,
                duration: 0.2,
                ease: "power2.out",
                onComplete: () => {
                    logo.innerHTML = "Effect-Cube";
                    gsap.to(logo, {
                        fontSize: window.innerWidth <= 600 ? "32px" : "36px",
                        scale: 1,
                        opacity: 1,
                        duration: 0.2,
                        rotation: 0,
                        ease: "back.out(1.7)"
                    });
                }
            });
        }
    });
});

let currentState = 0;
let selectedEffects = 0;
let currentItems = [];
let currentIndex = 0;
const effectsPanel = document.getElementById('effects-panel');
const dynamicBtn = document.getElementById('dynamic-btn');
const currentEffect = document.getElementById('current-effect');
const fixedMessage = document.getElementById('fixed-message');

const animateButtons = (show) => {
    const buttons = document.querySelectorAll('.floating-btn');
    buttons.forEach((btn, i) => {
        const position = show ? 0 : 100;
        gsap.to(btn, {
            opacity: show ? 1 : 0,
            y: show ? 0 : position,
            duration: 0.8,
            delay: i * 0.2,
            ease: "power3.out",
            boxShadow: show ? "0 0 20px #00d4ff, 0 0 40px #ff00ff" : "0 4px 20px rgba(0, 0, 0, 0.2)"
        });
    });
    gsap.to(effectsPanel, {
        opacity: show ? 1 : 0,
        y: show ? 0 : 100,
        duration: 0.8,
        delay: 0.4,
        ease: "power3.out"
    });
};

const toggleDynamicElement = (showPanel, items) => {
    if (showPanel) {
        dynamicBtn.style.display = 'none';
        effectsPanel.style.display = 'flex';
        currentItems = items;
        currentIndex = 0;
        currentEffect.textContent = currentItems[currentIndex];
    } else {
        dynamicBtn.style.display = 'block';
        effectsPanel.style.display = 'none';
    }
};

const updateEffectItem = (direction) => {
    if (direction === 'next') {
        currentIndex = (currentIndex + 1) % currentItems.length;
    } else {
        currentIndex = (currentIndex - 1 + currentItems.length) % currentItems.length;
    }
    gsap.to(currentEffect, {
        opacity: 0,
        x: direction === 'next' ? -20 : 20,
        duration: 0.3,
        onComplete: () => {
            currentEffect.textContent = currentItems[currentIndex];
            gsap.to(currentEffect, {
                opacity: 1,
                x: 0,
                duration: 0.3
            });
        }
    });
};

const showFixedMessage = (title, content) => {
    fixedMessage.querySelector('#fixed-message-title').textContent = title;
    fixedMessage.querySelector('#fixed-message-content').textContent = content;
    fixedMessage.style.display = 'block';
    gsap.fromTo(fixedMessage, 
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" }
    );
};

const hideFixedMessage = () => {
    gsap.to(fixedMessage, {
        scale: 0.8,
        opacity: 0,
        duration: 0.3,
        onComplete: () => fixedMessage.style.display = 'none'
    });
};

const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
        document.querySelector('.upload-container').style.backgroundImage = `url(${e.target.result})`;
        document.querySelector('.upload-text').style.opacity = '0';
        document.querySelector('.upload-container').classList.add('image-selected'); 
        animateButtons(true);
        currentState = 1;
        updateState();
    };
    reader.readAsDataURL(file);
};

const updateState = () => {
    const states = [
        () => {
            hideFixedMessage();
            effectsPanel.style.display = 'none';
            dynamicBtn.style.display = 'none';
            document.querySelector('.upload-container').classList.remove('image-selected');
            document.querySelector('.upload-container').onclick = function() {
                document.getElementById('file-input').click();
            };
        },
        () => {
            document.getElementById('continue-btn').textContent = 'המשך';
            showFixedMessage('בחר קטגוריה', 'בחר קטגוריה מהרשימה ולחץ על המשך\nאנימציה: מוסיף תנועה\nצבעים: משנה גוונים\nטקסטורות: מוסיף מרקם');
            toggleDynamicElement(true, ['אנימציה', 'צבעים', 'טקסטורות']);
            document.querySelector('.upload-container').onclick = null;
        },
        () => {
            document.getElementById('continue-btn').textContent = 'הוסף';
            showFixedMessage('בחר אפקט', 'בחר אפקט מהרשימה ולחץ על הוסף\nזוהר: מוסיף אור\nספירלה: יוצר תנועה ספירלית\nגלים: מוסיף אפקט גלים');
            toggleDynamicElement(true, ['זוהר', 'ספירלה', 'גלים']);
        },
        () => {
            selectedEffects++;
            document.getElementById('continue-btn').textContent = 'הוסף אפקט נוסף';
            dynamicBtn.textContent = 'צור MP4';
            showFixedMessage('אפקט נוסף', 'נוסף אפקט! לחץ על "הוסף אפקט נוסף" להמשיך או "צור MP4" לסיים');
            toggleDynamicElement(false);
        },
        () => {
            document.getElementById('continue-btn').textContent = 'המשך';
            showFixedMessage('בחר קטגוריה', 'בחר קטגוריה מהרשימה ולחץ על המשך\nאנימציה: מוסיף תנועה\nצבעים: משנה גוונים\nטקסטורות: מוסיף מרקם');
            toggleDynamicElement(true, ['אנימציה', 'צבעים', 'טקסטורות']);
        },
        () => {
            document.getElementById('continue-btn').textContent = 'הוסף';
            showFixedMessage('בחר אפקט נוסף', 'בחר אפקט שני מהרשימה ולחץ על הוסף\nעומק: מוסיף תחושת עומק\nמערבולת: יוצר מערבולת\nאורות: מוסיף אורות נוצצים');
            toggleDynamicElement(true, ['עומק', 'מערבולת', 'אורות']);
        },
        () => {
            document.getElementById('continue-btn').textContent = 'צור MP4';
            showFixedMessage('בחר זמן', 'בחר זמן מהרשימה ולחץ על צור MP4\n5 שניות = 5 שניות\n15 שניות = 10 שניות\n30 שניות = 15 שניות');
            toggleDynamicElement(true, ['5 שניות', '15 שניות', '30 שניות']);
        },
        () => {
            showFixedMessage('הסרטון מוכן!', 'הורדת הווידאו תתחיל בקרוב');
            toggleDynamicElement(false);
            setTimeout(() => {
                currentState = 0;
                selectedEffects = 0;
                animateButtons(false);
                document.querySelector('.upload-container').style.backgroundImage = '';
                document.querySelector('.upload-text').style.opacity = '1';
                document.querySelector('.upload-container').classList.remove('image-selected');
                updateState();
            }, 2000);
        }
    ];

    if (states[currentState]) states[currentState]();
};

document.getElementById('file-input').addEventListener('change', (e) => {
    if (e.target.files[0]) handleImageUpload(e.target.files[0]);
});

document.getElementById('continue-btn').addEventListener('click', () => {
    if (currentState === 3) {
        currentState = 4;
        updateState();
    } else if (currentState > 0) {
        currentState++;
        updateState();
    }
});

document.getElementById('dynamic-btn').addEventListener('click', () => {
    if (currentState === 3) {
        currentState = 6;
        updateState();
    }
});

document.getElementById('back-btn').addEventListener('click', () => {
    if (currentState > 1) {
        currentState--;
        if (currentState === 3 && selectedEffects > 1) selectedEffects--;
        updateState();
    } else if (currentState === 1) {
        currentState = 0;
        document.querySelector('.upload-container').style.backgroundImage = '';
        document.querySelector('.upload-text').style.opacity = '1';
        document.querySelector('.upload-container').classList.remove('image-selected');
        animateButtons(false);
        updateState();
    }
});

document.querySelector('.arrow-left').addEventListener('click', () => {
    updateEffectItem('prev');
});

document.querySelector('.arrow-right').addEventListener('click', () => {
    updateEffectItem('next');
});

const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
};

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => {
    document.body.addEventListener(event, preventDefaults);
});

document.body.addEventListener('drop', (e) => {
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handleImageUpload(file);
});

document.querySelector('.upload-container').onclick = function() {
    document.getElementById('file-input').click();
};