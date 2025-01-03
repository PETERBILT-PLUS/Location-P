import * as yup from "yup";

export interface ICreateListing {
    carName: string;
    carFuel: string;
    carMarque: string;
    places: number;
    carType: string;
    carKm: number;
    pricePerDay: number;
    carEtat: string;
    registration: RegistrationDocument;
    insurance: InsuranceDocument;
}

interface RegistrationDocument {
    registrationNumber: string;
    registrationDate: Date;
    registrationExpiration: Date;
    vehicleIdentificationNumber: string;
}

interface InsuranceDocument {
    insuranceCompany: string;
    policyNumber: string;
    expirationDate: Date;
}

export const createListingSchema = yup.object<ICreateListing>().shape({
    carName: yup.string().required("Saisir le nom de voiture"),
    carFuel: yup.string().required("Saisir le type du carburant"),
    carMarque: yup.string().required("Saisir la marque du véhicule"),
    places: yup.number().required("Saisir le nombre de places"),
    carType: yup.string().required("Saisir le type de voiture"),
    carKm: yup.number().required("Saisir le kilométrage"),
    pricePerDay: yup.number().required("Saisir le prix par jour"),
    carEtat: yup.string().required("Saisir l'etat de votre voiture"),
    registration: yup.object().shape({
        registrationNumber: yup.string().required("Saisir le numéro d'immatriculation"),
        registrationDate: yup.date().required("Sélectionner la date d'immatriculation"),
        registrationExpiration: yup.date().required("Sélectionner la date d'expiration d'immatriculation"),
        vehicleIdentificationNumber: yup.string().required("Saisir le numéro d'identification du véhicule"),
    }),
    insurance: yup.object().shape({
        insuranceCompany: yup.string().required("Saisir la compagnie d'assurance"),
        policyNumber: yup.string().required("Saisir le numéro de police"),
        expirationDate: yup.date().required("Sélectionner la date d'expiration de l'assurance"),
    })
});