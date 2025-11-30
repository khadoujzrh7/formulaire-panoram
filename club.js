// **URL de votre script Apps Script FINAL**
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwBILP-IJA5nNbLL4JY5cg8BWbpJ-ctrc7LfCP0hRekqzE31XeVeFvUJTnOSDHn9DZp/exec";

// Fonction pour gérer l'affichage du champ "Autre"
function toggleOtherStatus() {
    const statusSelect = document.getElementById('participationStatus');
    const otherStatusGroup = document.getElementById('otherStatusGroup');
    const otherStatusInput = document.getElementById('otherStatus');

    if (statusSelect.value === 'أخرى') {
        otherStatusGroup.style.display = 'block';
        otherStatusInput.setAttribute('required', 'required');
    } else {
        otherStatusGroup.style.display = 'none';
        otherStatusInput.removeAttribute('required');
        otherStatusInput.value = ''; 
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const submitButton = document.getElementById('submitButton');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    const container = document.querySelector('.container');

    // 1. Configuration de l'IFRAME invisible pour la soumission
    const iframeName = 'hidden_iframe';
    let iframe = document.getElementById(iframeName);
    if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = iframeName;
        iframe.name = iframeName;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
    }

    // 2. Configure le formulaire pour soumettre à l'URL Apps Script via l'iframe
    form.setAttribute('target', iframeName);
    form.setAttribute('action', SCRIPT_URL);
    form.setAttribute('method', 'POST'); 

    // 3. Ajout de l'écouteur d'événement pour la soumission
    form.addEventListener('submit', function(e) {
        
        // Validation HTML native des champs
        if (!form.checkValidity()) {
            return; 
        }
        
        // Préparation de l'état de soumission
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
        submitButton.disabled = true;
        submitButton.textContent = '... جاري الإرسال';
        
        // Gestion de la réponse de l'iframe après soumission
        iframe.onload = function() {
            const iframeContent = iframe.contentWindow.document.body.innerHTML;
            
            if (iframeContent.includes('Success')) {
                // SUCCÈS : Masquer le formulaire et afficher le message vert
                form.style.display = 'none';
                successMessage.style.display = 'block';
                container.scrollIntoView({ behavior: 'smooth' });
            } else {
                // ÉCHEC : Afficher le message rouge
                errorMessage.style.display = 'block';
                console.error('Submission failed. Check Google Apps Script logs and ensure the deployment has "Anyone" access.');
            }
            
            // Rétablit l'état initial du bouton
            submitButton.disabled = false;
            submitButton.textContent = '✅ إرسال طلب التسجيل';
            iframe.onload = null;
        };
    });
});