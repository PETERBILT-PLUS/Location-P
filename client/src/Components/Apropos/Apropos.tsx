import React, { useLayoutEffect } from 'react';

const Apropos: React.FC = () => {
    useLayoutEffect(() => {
        document.title = "A-Propos";
    }, []);
    return (
        <div className="container my-5 bg-white min-vh-100">
            <h1 className="mb-4">À propos de nous</h1>
            <p>
                Bienvenue sur V_RENT_AUTO, votre plateforme de location de voitures en ligne.
                Nous facilitons la location de voitures pour les particuliers et les entreprises à travers une interface simple et rapide.
            </p>
            <p>
                Nous travaillons avec un réseau de partenaires de confiance pour offrir une large gamme de véhicules adaptés à vos besoins,
                que vous recherchiez une petite citadine, un SUV pour les voyages en famille, ou une voiture de luxe pour des occasions spéciales.
            </p>
            <p>
                Depuis notre lancement en 2024, nous avons pour mission de rendre la location de voitures plus accessible,
                transparente et pratique pour tous, avec un service client de qualité et des tarifs compétitifs.
            </p>
            <p>
                Si vous avez des questions ou souhaitez en savoir plus sur nos services, n'hésitez pas à nous contacter. (06 24 73 65 90) Nous sommes là pour vous aider!
            </p>
        </div>
    );
};

export default Apropos;