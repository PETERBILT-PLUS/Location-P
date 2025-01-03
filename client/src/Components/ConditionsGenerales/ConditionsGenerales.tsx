import React, { useLayoutEffect } from 'react';

const ConditionsGenerales: React.FC = () => {
    useLayoutEffect(() => {
        document.title = "Conditions Generales";
    }, []);
    return (
        <div className="container my-5 bg-white min-vh-100">
            <h1 className="mb-4">Conditions Générales</h1>

            <h3>1. Conditions de Réservation</h3>
            <p>
                Pour réserver un véhicule sur notre plateforme, vous devez être âgé d'au moins 18 ans et être en possession d'un permis de conduire valide.
                Toutes les réservations sont sujettes à la disponibilité du véhicule sélectionné.
            </p>

            <h3>2. Annulations et Modifications</h3>
            <p>
                Les clients peuvent annuler ou modifier une réservation en fonction des politiques de l'agence de location partenaire.
                Des frais peuvent s'appliquer en fonction du moment de l'annulation ou de la modification.
            </p>

            <h3>3. Utilisation du Véhicule</h3>
            <p>
                Le locataire s'engage à utiliser le véhicule de manière responsable et conformément aux lois locales.
                Toute infraction aux règles de conduite peut entraîner des pénalités, y compris la suspension des services.
            </p>

            <h3>4. Responsabilité</h3>
            <p>
                "V RENT AUTO" agit en tant qu'intermédiaire entre les locataires et les agences de location. Nous ne sommes pas responsables
                des dommages, accidents ou frais liés à l'utilisation des véhicules loués. Les agences de location sont seules responsables de
                l'entretien et de la sécurité des véhicules.
            </p>

            <h3>5. Modifications des Conditions</h3>
            <p>
                Nous nous réservons le droit de modifier ces conditions générales à tout moment. Les modifications seront publiées sur cette page
                et entreront en vigueur immédiatement après leur publication.
            </p>
        </div>
    );
};

export default ConditionsGenerales;
