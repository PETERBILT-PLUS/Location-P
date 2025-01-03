import React, { useLayoutEffect } from 'react';

const PolitiqueConfidentialite: React.FC = () => {

  useLayoutEffect(() => {
        document.title = "Politique Confidentialite";
    }, []);
  return (
    <div className="container my-5 bg-white min-vh-100">
      <h1 className="mb-4">Politique de Confidentialité</h1>
      <p>
        Chez "V RENT AUTO", nous accordons une grande importance à la protection de vos données personnelles. 
        Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations.
      </p>

      <h3>1. Informations que nous recueillons</h3>
      <p>
        Nous collectons des informations lorsque vous utilisez notre plateforme pour réserver un véhicule, créer un compte ou nous contacter. 
        Cela peut inclure des informations telles que votre nom, adresse e-mail, numéro de téléphone, permis de conduire, et détails de paiement.
      </p>

      <h3>2. Utilisation des informations</h3>
      <p>
        Les informations collectées sont utilisées pour traiter vos réservations, vous fournir des services, et améliorer l'expérience utilisateur. 
        Elles peuvent également être utilisées pour des communications marketing avec votre consentement.
      </p>

      <h3>3. Partage des informations</h3>
      <p>
        Nous partageons vos informations avec des partenaires tels que les agences de location de voitures, les processeurs de paiement et les assureurs, 
        uniquement lorsque cela est nécessaire pour le traitement de votre réservation.
      </p>

      <h3>4. Protection des données</h3>
      <p>
        Nous mettons en œuvre des mesures de sécurité avancées pour protéger vos données personnelles contre l'accès non autorisé, 
        la divulgation ou la modification.
      </p>
    </div>
  );
};

export default PolitiqueConfidentialite;