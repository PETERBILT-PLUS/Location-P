import * as yup from "yup";

export interface IRegister {
    nom: string;
    prenom: string;
    email: string;
    sexe: "male" | "female";
    password: string;
    confirmPassword: string;
}

export const registerSchema = yup.object<IRegister>().shape({
    nom: yup.string().required("Nom est requis"), // يجب أن يكون الاسم موجوداً
    prenom: yup.string().required("Prénom est requis"), // يجب أن يكون الاسم الأول موجوداً
    email: yup.string().email("Email invalide").required("Email est requis"), // يجب أن يكون البريد الإلكتروني صحيحاً وموجوداً
    sexe: yup.mixed<"male" | "female">().oneOf(["male", "female"], "Sexe invalide").required("Sexe est requis"), // يجب أن يكون الجنس إما "male" أو "female" وموجوداً
    password: yup.string().min(6, "Le mot de passe doit contenir au moins 6 caractères").required("Mot de passe est requis"), // يجب أن يكون كلمة المرور بطول 6 أحرف على الأقل وموجودة
    confirmPassword: yup.string().oneOf([yup.ref('password')], "Les mots de passe ne correspondent pas").required("Confirmation du mot de passe est requise") // تأكيد كلمة المرور يجب أن يكون مطابقاً لكلمة المرور وموجوداً
});
