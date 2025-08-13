'use client';

import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
    children: React.ReactNode; // the button text
    type?: 'button' | 'submit' | 'reset';
    onClick?: () => void;
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    type = 'button',
    onClick,
    disabled = false,
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={styles.button}
        >
            {children}
        </button>
    );
};

export default Button;
