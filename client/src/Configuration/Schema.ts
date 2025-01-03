import * as yup from "yup";

interface IRegisterAgent {
    nom: string;
    prenom: string;
    email: string;
    password: string;
    confirmPassword: string;
    tel: string;
    adresse: string;
    ville: string;
    website?: string;
    numeroDInscription: string;
    numeroDeLicenceCommerciale: string;
    numeroDePoliceDAssurance: string;
    paypalAccountId: string;
}

export const registerAgentSchema = yup.object<IRegisterAgent>().shape({
    nom: yup.string().required("Veuillez saisir votre nom"),
    prenom: yup.string().required("Veuillez saisir votre prénom"),
    email: yup.string().email("Veuillez saisir une adresse e-mail valide").required("Veuillez saisir votre adresse e-mail"),
    password: yup.string().required("Veuillez saisir votre mot de passe"),
    confirmPassword: yup.string().oneOf([yup.ref("password"), undefined], "Les mots de passe ne correspondent pas").required("Veuillez confirmer votre mot de passe"),
    tel: yup.string().required("Veuillez saisir votre numéro de téléphone"),
    adress: yup.string().required("Veuillez saisir votre adresse"),
    city: yup.string().required("Veuillez choisir une ville"),
    website: yup.string().notRequired().url("Veuillez saisir une URL valide pour votre site Web"),
    numeroDinscription: yup.string().required("Veuillez saisir votre numéro d'inscription"),
    numeroDeLicenceCommerciale: yup.string().required("Veuillez saisir votre numéro de licence commerciale"),
    numeroDePoliceDassurance: yup.string().required("Veuillez saisir votre numéro de police d'assurance"),
    paypalAccountId: yup.string().required("Le numero du compte Paypal est important"),
});

interface ILoginAgent {
    email: string,
    password: string,
}

export const LoginAgentSchema = yup.object<ILoginAgent>().shape({
    email: yup.string().email("Veuillez saisir une adresse e-mail valide").required("Veuillez saisir votre adresse e-mail"),
    password: yup.string().required("Veuillez saisir votre mot de passe"),
});