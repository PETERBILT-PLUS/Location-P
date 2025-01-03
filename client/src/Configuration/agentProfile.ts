import * as yup from "yup";

export interface IAgentProfile {
    nom: string;
    prenom: string;
    email: string;
    password: string;
    confirmPassword: string;
    telephone: string;
    adress: string;
    ville: string;
    website?: string;
    numeroDinscription: string;
    numeroDeLisenceCommercial: string;
    NumeroDePoliceDassurance: string;
    localisation: string;
    paypalAccountId: string;
}

export const agentProfileSchema = yup.object<IAgentProfile>().shape({
    nom: yup.string().required("Le nom est obligatoire"),
    prenom: yup.string().required("Le prénom est obligatoire"),
    email: yup.string().email("E-mail invalide").required("L'e-mail est obligatoire"),
    password: yup.string().required("Le mot de passe est obligatoire"),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password'), undefined], "Les mots de passe doivent correspondre")
        .required("La confirmation du mot de passe est obligatoire"),
    telephone: yup.string().matches(/^[0-9]+$/, "Le numéro de téléphone est invalide").required("Le numéro de téléphone est obligatoire"),
    adress: yup.string().required("L'adresse est obligatoire"),
    ville: yup.string().required("La ville est obligatoire"),
    website: yup.string().url("L'URL du site Web est invalide").notRequired(),
    numeroDinscription: yup.string().required("Le numéro d'inscription est obligatoire"),
    numeroDeLisenceCommercial: yup.string().required("Le numéro de licence commerciale est obligatoire"),
    NumeroDePoliceDassurance: yup.string().required("Le numéro de police d'assurance est obligatoire"),
    localisation: yup.string().required("Entrer votre localisation"),
    paypalAccountId: yup.string().required("L'ID de compte PayPal est obligatoire")
});
