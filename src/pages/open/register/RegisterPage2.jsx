import { useNavigate } from "react-router-dom";
import { useState } from "react";

function RegisterDetailsPage() {
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    const handleSelect = (selectedRole) => {
        setRole(selectedRole);
        // eventueel opslaan in localStorage of context hier
        navigate('/onboarding');
    };

    return (
        <div className="auth-page container">
            <h1>Kies je rol</h1>
            <p>Selecteer de rol die het beste bij jou past:</p>

            <div className="flex flex-col gap-1">
                <button type="button" onClick={() => handleSelect('patient')} className="btn btn-primary">
                    Patiënt met diabetes
                </button>
                <button type="button" onClick={() => handleSelect('zorgverlener')} className="btn btn-primary">
                    Zorgverlener
                </button>
                <button type="button" onClick={() => handleSelect('ouder')} className="btn btn-primary">
                    Ouder/verzorger
                </button>
                <button type="button" onClick={() => handleSelect('geen')} className="btn btn-outline">
                    Gebruiker zonder diabetes
                </button>
            </div>
        </div>
    );
}

export default RegisterDetailsPage;
