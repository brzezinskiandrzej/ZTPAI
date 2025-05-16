// src/utils/errorMessages.js
export const errorTranslations = {
  // Logowanie
  'auth/user-not-found': {
    message: "Nie znaleziono konta z tym adresem email",
    field: "email"
  },
  'auth/invalid-password': {
    message: "Nieprawidłowe hasło",
    field: "password"
  },
  
  // Rejestracja
  'validation/missing-fields': {
    message: "Wszystkie pola są wymagane",
    field: "global"
  },
  'auth/email-already-exists': {
    message: "Adres email jest już zajęty",
    field: "email"
  },
  'auth/username-already-exists': {
    message: "Nazwa użytkownika jest już zajęta",
    field: "username"
  },
  'auth/invalid-password-format': {
    message: "Hasło musi zawierać min. 8 znaków, wielką literę i cyfrę",
    field: "password"
  },
  
  // Ogólne
  'network-error': {
    message: "Błąd połączenia z serwerem",
    field: "global"
  }
};