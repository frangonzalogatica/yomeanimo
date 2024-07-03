import React from 'react';

const Header = ({ pageName }) => {
    return (
        <section className='main-header'>
            <div>
                <h1>{pageName}</h1> 
            </div>
        </section>
    );
};

export default Header;