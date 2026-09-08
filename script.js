// --- NUMÉRO WHATSAPP DE LA BOUTIQUE ---
const WHATSAPP_NUMBER = "213774887530"; 

// --- GESTION DU PANIER ---
let cart = [];

// Sélection des éléments HTML
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartCountElement = document.getElementById('cart-count');
const cartTotalElement = document.getElementById('cart-total');
const orderWhatsappBtn = document.getElementById('order-whatsapp-btn');

// --- OUVERTURE ET FERMETURE DU PANIER ---
if (cartBtn) {
  cartBtn.addEventListener('click', () => {
    cartModal.style.display = 'block';
  });
}

if (closeCartBtn) {
  closeCartBtn.addEventListener('click', () => {
    cartModal.style.display = 'none';
  });
}

// Fermer le panier si on clique en dehors de la fenêtre
window.addEventListener('click', (e) => {
  if (e.target === cartModal) {
    cartModal.style.display = 'none';
  }
});

// --- AJOUTER UN PRODUIT AU PANIER ---
function addToCart(name, price) {
  const existingProduct = cart.find(item => item.name === name);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      name: name,
      price: price,
      quantity: 1
    });
  }

  updateCartUI();
  
  // Animation visuelle ou ouverture du panier lors de l'ajout
  cartModal.style.display = 'block';
}

// --- SUPPRIMER UN PRODUIT DU PANIER ---
function removeFromCart(name) {
  cart = cart.filter(item => item.name !== name);
  updateCartUI();
}

// --- MISE À JOUR DE L'AFFICHAGE DU PANIER ---
function updateCartUI() {
  // Calcul du nombre total d'articles
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountElement.textContent = totalItems;

  // Calcul du prix total
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cartTotalElement.textContent = totalPrice.toLocaleString('fr-FR');

  // Vider le conteneur HTML des articles
  cartItemsContainer.innerHTML = '';

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-msg">Votre panier est vide.</p>';
    return;
  }

  // Afficher chaque article dans le panier
  cart.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.classList.add('cart-item');
    itemElement.innerHTML = `
      <div>
        <strong>${item.name}</strong><br>
        <small>${item.quantity} x ${item.price.toLocaleString('fr-FR')} DA</small>
      </div>
      <div>
        <span style="font-weight:bold; color:#c0392b; margin-right: 10px;">${(item.price * item.quantity).toLocaleString('fr-FR')} DA</span>
        <button onclick="removeFromCart('${item.name}')" style="background:none; border:none; color:#e74c3c; cursor:pointer; font-size:1.1rem;">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `;
    cartItemsContainer.appendChild(itemElement);
  });
}

// --- ENVOI DE LA COMMANDE SUR WHATSAPP ---
if (orderWhatsappBtn) {
  orderWhatsappBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      alert("Votre panier est vide ! Veuillez ajouter des produits avant de commander.");
      return;
    }

    // Calcul du total
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Construction du message WhatsApp
    let message = "Bonjour LK Collection 👋,\n\nJe souhaite passer la commande suivante :\n\n";

    cart.forEach((item, index) => {
      message += `🔹 *${item.name}*\n   Quantité : ${item.quantity}\n   Prix : ${(item.price * item.quantity).toLocaleString('fr-FR')} DA\n\n`;
    });

    message += `💰 *TOTAL DE LA COMMANDE : ${totalPrice.toLocaleString('fr-FR')} DA*\n\n`;
    message += "Merci de me confirmer la disponibilité et les modalités de livraison !";

    // Encodage du texte pour URL
    const encodedMessage = encodeURIComponent(message);

    // Redirection directe vers WhatsApp
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  });
}