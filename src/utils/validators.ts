import { isValidEmail, isValidPhone, isValidCedula } from './index';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export const createValidator = (rules: Record<string, ValidationRule>) => {
  return (data: Record<string, any>): ValidationResult => {
    const errors: string[] = [];

    Object.entries(rules).forEach(([field, rule]) => {
      const value = data[field];
      const fieldName = field.replace(/([A-Z])/g, ' $1').toLowerCase();

      // Required validation
      if (rule.required && (!value || value.toString().trim() === '')) {
        errors.push(`${fieldName} es requerido`);
        return;
      }

      if (!value && !rule.required) return;

      // Min length validation
      if (rule.minLength && value.toString().length < rule.minLength) {
        errors.push(`${fieldName} debe tener al menos ${rule.minLength} caracteres`);
      }

      // Max length validation
      if (rule.maxLength && value.toString().length > rule.maxLength) {
        errors.push(`${fieldName} no debe exceder ${rule.maxLength} caracteres`);
      }

      // Pattern validation
      if (rule.pattern && !rule.pattern.test(value.toString())) {
        errors.push(`${fieldName} tiene un formato inválido`);
      }

      // Custom validation
      if (rule.custom) {
        const customResult = rule.custom(value);
        if (typeof customResult === 'string') {
          errors.push(customResult);
        } else if (customResult === false) {
          errors.push(`${fieldName} no es válido`);
        }
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  };
};

// Validators predefinidos
export const loginValidator = createValidator({
  email: {
    required: true,
    custom: (value: string) => {
      if (!isValidEmail(value)) {
        return 'El correo electrónico no es válido';
      }
      return true;
    }
  },
  password: {
    required: true,
    minLength: 6
  }
});

export const volunteerValidator = createValidator({
  cedula: {
    required: true,
    custom: (value: string) => {
      if (!isValidCedula(value)) {
        return 'La cédula debe tener 11 dígitos';
      }
      return true;
    }
  },
  nombre: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  email: {
    required: true,
    custom: (value: string) => {
      if (!isValidEmail(value)) {
        return 'El correo electrónico no es válido';
      }
      return true;
    }
  },
  password: {
    required: true,
    minLength: 8,
    custom: (value: string) => {
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
        return 'La contraseña debe contener mayúsculas, minúsculas y números';
      }
      return true;
    }
  },
  telefono: {
    required: true,
    custom: (value: string) => {
      if (!isValidPhone(value)) {
        return 'El número de teléfono no es válido';
      }
      return true;
    }
  }
});

export const reportValidator = createValidator({
  titulo: {
    required: true,
    minLength: 5,
    maxLength: 100
  },
  descripcion: {
    required: true,
    minLength: 10,
    maxLength: 1000
  },
  categoria: {
    required: true
  },
  urgencia: {
    required: true
  }
});