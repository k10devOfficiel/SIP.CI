// Charger dynamiquement header et footer sur toutes les pages
document.addEventListener('DOMContentLoaded', function() {
    // Déterminer le chemin relatif selon la profondeur du fichier
    const path = window.location.pathname;
    let basePath = '';
    
    if (path.includes('/pages/')) {
        basePath = '../';
    }
    
    // Charger le header
    fetch(basePath + 'components/header.html')
        .then(response => response.text())
        .then(html => {
            const headerContainer = document.getElementById('header-container');
            if (headerContainer) {
                headerContainer.innerHTML = html;
                
                // Réinitialiser les scripts de navigation après chargement
                initializeNavigation();
            }
        })
        .catch(error => console.error('Erreur chargement header:', error));
    
    // Charger le footer
    fetch(basePath + 'components/footer.html')
        .then(response => response.text())
        .then(html => {
            const footerContainer = document.getElementById('footer-container');
            if (footerContainer) {
                footerContainer.innerHTML = html;
            }
        })
        .catch(error => console.error('Erreur chargement footer:', error));
});

// Initialiser la navigation après chargement dynamique
function initializeNavigation() {
    // Smooth scroll pour les liens de navigation
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Header scroll effect - Maintenir le style jaune or avec bordure rouge
    let lastScroll = 0;
    const header = document.querySelector('header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                header.style.background = '#FFD700';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background = '#FFD700';
                header.style.backdropFilter = 'none';
            }
            
            lastScroll = currentScroll;
        });
    }
}
