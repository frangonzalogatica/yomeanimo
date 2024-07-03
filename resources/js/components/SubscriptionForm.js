import React, { useState, useRef } from 'react';
import axios from '../axios';
import DOMPurify from 'dompurify';

const SubscriptionForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const successMessageRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const sanitizedData = {
            name: sanitizeInput(name),
            email: sanitizeInput(email)
        };

        if (!sanitizedData.name.trim()) {
            setErrors({ name: ['El nombre es requerido.'] });
            return;
        }

        if (!sanitizedData.email.trim()) {
            setErrors({ email: ['El correo electrónico es requerido.'] });
            return;
        }

        if (!validateEmail(sanitizedData.email)) {
            setErrors({ email: ['El formato de correo electrónico no es válido.'] });
            return;
        }

        try {
            const response = await axios.post('/subscribe', sanitizedData);

            setMessage(response.data.message);
            setErrors({});
            setName('');
            setEmail('');
            
            showSuccessMessage();

            setTimeout(() => {
                hideSuccessMessage();
            }, 3000);
        } catch (error) {
            if (error.response && error.response.data) {
                setErrors(error.response.data);
            }
        }
    };

    const sanitizeInput = (input) => {
        return DOMPurify.sanitize(input);
    };

    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    const showSuccessMessage = () => {
        successMessageRef.current.classList.remove('hidden');
    };

    const hideSuccessMessage = () => {
        successMessageRef.current.classList.add('hidden');
    };

    return (
        <section>
            <div id="subscription-form">
                <div className='form-container'>
                    <div className='element-container'>
                        <h2>Recibí las últimas novedades!</h2>
                        <form onSubmit={handleSubmit}>
                            <div className='input-container'>
                                <div>
                                    <input
                                        type="text"
                                        value={name}
                                        placeholder="Nombre Completo *"
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                    {errors.name && <p className="error-message">{errors.name[0]}</p>}
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        value={email}
                                        placeholder="Email *"
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    {errors.email && <p className="error-message">{errors.email[0]}</p>}
                                </div>
                            </div>
                            <button type="submit">Suscribirse!</button>
                        </form>
                    </div>
                </div>
                <img src='https://www.yomeanimo.com/wp-content/themes/creativedog-timber-theme-v2/assets/images/trama-nl-desktop.svg'/>
            </div>
            <div ref={successMessageRef} className='success-message hidden'>
                {message}
            </div>
        </section>
    );
};

export default SubscriptionForm;
