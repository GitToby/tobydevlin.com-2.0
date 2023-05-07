import React from 'react';
import {Script} from 'gatsby';

const Scripts = () => {
    return (
        <>
            {/*https://swetrix.com/projects/PIxyLLNTSr2a*/}
            <Script src="https://swetrix.org/swetrix.js" defer></Script>
            <Script>
                {`
                document.addEventListener('DOMContentLoaded', function() {
                swetrix.init('PIxyLLNTSr2a')
                swetrix.trackViews()
                })
                `}
            </Script>
            <noscript>
                <img
                    src="https://api.swetrix.com/log/noscript?pid=PIxyLLNTSr2a"
                    alt=""
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </noscript>
        </>
    );
};

export default Scripts;
