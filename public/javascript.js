// ========================================
// VÉRIFICATION DE L'AUTHENTIFICATION
// ========================================
function checkAuth() {
    const token = localStorage.getItem('token');
    const currentPath = window.location.pathname;

    // Si pas de token et on est sur une page protégée
    if (!token && currentPath !== '/' && currentPath !== '/api-docs') {
        window.location.href = '/';
        return false;
    }

    // Si token existe et on est sur la page de connexion
    if (token && currentPath === '/') {
        window.location.href = '/dashboard';
        return false;
    }

    return true;
}

// ========================================
// FONCTION DE DÉCONNEXION
// ========================================
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
}

// ========================================
// ATTENDRE QUE LE DOM SOIT CHARGÉ
// ========================================
document.addEventListener('DOMContentLoaded', () => {

    // ========================================
    // GESTION DE LA CONNEXION (PAGE INDEX)
    // ========================================
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('errorMessage');
            const submitBtn = e.target.querySelector('button[type="submit"]');

            // Désactiver le bouton pendant la requête
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Connexion...';

            try {
                console.log('🔄 Tentative de connexion...');

                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();
                console.log('📥 Réponse serveur:', data);

                if (response.ok && data.success) {
                    // Stocker le token et les infos user
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));

                    // Message de succès
                    errorMessage.className = 'alert alert-success';
                    errorMessage.textContent = '✅ Connexion réussie ! Redirection...';
                    errorMessage.style.display = 'block';

                    console.log('✅ Connexion réussie, redirection...');

                    // Rediriger vers le dashboard
                    setTimeout(() => {
                        window.location.href = '/dashboard';
                    }, 1000);

                } else {
                    // Afficher l'erreur
                    errorMessage.className = 'alert alert-danger';
                    errorMessage.textContent = data.message || 'Email ou mot de passe incorrect';
                    errorMessage.style.display = 'block';

                    // Réactiver le bouton
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Se connecter';

                    console.error('❌ Erreur:', data.message);
                }

            } catch (error) {
                console.error('❌ Erreur de connexion:', error);
                errorMessage.className = 'alert alert-danger';
                errorMessage.textContent = 'Erreur de connexion au serveur';
                errorMessage.style.display = 'block';

                // Réactiver le bouton
                submitBtn.disabled = false;
                submitBtn.textContent = 'Se connecter';
            }
        });
    }

    // ========================================
    // GESTION DU DASHBOARD
    // ========================================
    if (window.location.pathname === '/dashboard') {  // ✅ CORRIGÉ ICI

        // Vérifier l'authentification
        if (!checkAuth()) return;

        console.log('📊 Chargement du dashboard...');

        // Charger les infos utilisateur
        const user = JSON.parse(localStorage.getItem('user'));

        if (user) {
            const userNameElement = document.getElementById('userName');
            const userEmailElement = document.getElementById('userEmail');

            if (userNameElement) userNameElement.textContent = user.username || user.email;
            if (userEmailElement) userEmailElement.textContent = user.email;

            console.log('👤 Utilisateur:', user);
        }

        // Afficher la date du jour
        const currentDateElement = document.getElementById('currentDate');
        if (currentDateElement) {
            const today = new Date().toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            currentDateElement.textContent = today.charAt(0).toUpperCase() + today.slice(1);
        }

        // Charger les réservations en cours
        loadReservations();
    }
});

// ========================================
// CHARGER LES RÉSERVATIONS EN COURS
// ========================================
async function loadReservations() {
    const token = localStorage.getItem('token');
    const loadingDiv = document.getElementById('loadingReservations');
    const tableDiv = document.getElementById('reservationsTable');
    const noReservationsDiv = document.getElementById('noReservations');
    const tbody = document.getElementById('reservationsTableBody');

    if (!tbody) return;

    console.log('📋 Chargement des réservations...');

    try {
        // 1. Récupérer tous les catways
        const catwaysResponse = await fetch('/api/catways', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!catwaysResponse.ok) {
            throw new Error('Erreur de chargement des catways');
        }

        const catwaysResult = await catwaysResponse.json();
        console.log('🛥️ Catways récupérés:', catwaysResult.data.length);

        let allReservations = [];

        // 2. Pour chaque catway, récupérer ses réservations
        for (let catway of catwaysResult.data) {
            try {
                const resResponse = await fetch(`/api/catways/${catway.catwayNumber}/reservations`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (resResponse.ok) {
                    const resData = await resResponse.json();
                    if (resData.data && resData.data.length > 0) {
                        const reservationsWithCatway = resData.data.map(r => ({
                            ...r,
                            catwayNumber: catway.catwayNumber
                        }));
                        allReservations = allReservations.concat(reservationsWithCatway);
                    }
                }
            } catch (error) {
                console.log(`Pas de réservations pour le catway ${catway.catwayNumber}`);
            }
        }

        console.log('📋 Total réservations:', allReservations.length);

        // 3. Filtrer les réservations en cours
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const activeReservations = allReservations.filter(r => {
            const endDate = new Date(r.endDate);
            endDate.setHours(0, 0, 0, 0);
            return endDate >= today;
        });

        console.log('✅ Réservations en cours:', activeReservations.length);

        // 4. Masquer le loading
        if (loadingDiv) loadingDiv.style.display = 'none';

        // 5. Afficher les résultats
        if (activeReservations.length === 0) {
            if (noReservationsDiv) noReservationsDiv.style.display = 'block';
            if (tableDiv) tableDiv.style.display = 'none';
        } else {
            // Trier par date de début
            activeReservations.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

            // Générer le HTML du tableau
            tbody.innerHTML = activeReservations.map(r => `
                <tr>
                    <td><span class="badge bg-primary">${r.catwayNumber}</span></td>
                    <td><strong>${r.clientName}</strong></td>
                    <td>${r.boatName}</td>
                    <td>${new Date(r.startDate).toLocaleDateString('fr-FR')}</td>
                    <td>${new Date(r.endDate).toLocaleDateString('fr-FR')}</td>
                </tr>
            `).join('');

            if (tableDiv) tableDiv.style.display = 'block';
            if (noReservationsDiv) noReservationsDiv.style.display = 'none';
        }

    } catch (error) {
        console.error('❌ Erreur chargement réservations:', error);
        if (loadingDiv) loadingDiv.style.display = 'none';
        if (noReservationsDiv) {
            noReservationsDiv.innerHTML = `
                <div class="alert alert-danger">
                    <strong>Erreur :</strong> Impossible de charger les réservations.
                </div>
            `;
            noReservationsDiv.style.display = 'block';
        }
    }
}

// ========================================
// VÉRIFICATION AU CHARGEMENT DE CHAQUE PAGE
// ========================================
checkAuth();