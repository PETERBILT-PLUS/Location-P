import * as yup from "yup";

export interface IUserProfile {
    nom: string;
    prenom: string;
    sexe: string;
    email: string;
    password: string;
}

export const userProfileSchema = yup.object<IUserProfile>().shape({
    nom: yup.string()
        .required("Le nom est requis"),
    prenom: yup.string()
        .required("Le prénom est requis"),
    sexe: yup.string()
        .required("Le sexe est requis"),
    email: yup.string()
        .required("L'email est requis")
        .email("L'email doit être une adresse email valide"),
    password: yup.string()
        .required("Le mot de passe est requis"),
});
