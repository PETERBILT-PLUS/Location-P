import React from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';

interface CustomNavLinkProps extends NavLinkProps {
    className?: string | (({ isActive }: { isActive: boolean }) => string);
}

const CustomNavLink: React.FC<CustomNavLinkProps> = ({ className, ...rest }) => {
    return (
        <NavLink
            {...rest}
            className={(navProps) => {
                if (typeof className === 'function') {
                    return className({ isActive: navProps.isActive });
                } else {
                    return className || '';
                }
            }}
        />
    );
};

export default CustomNavLink;