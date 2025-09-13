function toggleSkillCard() {
    const skillCard = document.getElementById('skillCard');
    skillCard.classList.toggle('show');
}

document.addEventListener('click', function(event) {
    const skillCard = document.getElementById('skillCard');
    const boxContainer = document.querySelector('.box-container');
    
    if (!skillCard.contains(event.target) && !boxContainer.contains(event.target)) {
        skillCard.classList.remove('show');
    }
});

document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        createParticles(e.target);
    });
});

function createParticles(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = getComputedStyle(element).borderColor;
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1000';
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        
        document.body.appendChild(particle);
        
        const angle = (i / 6) * Math.PI * 2;
        const velocity = 50 + Math.random() * 30;
        const deltaX = Math.cos(angle) * velocity;
        const deltaY = Math.sin(angle) * velocity;
        
        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${deltaX}px, ${deltaY}px) scale(0)`, opacity: 0 }
        ], {
            duration: 600,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => {
            particle.remove();
        };
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const year = new Date().getFullYear();
    const element = document.getElementById("year");
    if (element) {
        element.textContent = year;
        if (element.tagName.toLowerCase() === "time") {
            element.setAttribute("datetime", String(year));
        }
    }
})