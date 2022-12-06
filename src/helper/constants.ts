import {ISourceOptions} from 'tsparticles';

export const links = {
    gitlab: 'https://gitlab.com/MrAdjunctPanda',
    github: 'https://github.com/GitToby',
    linkedin: 'https://www.linkedin.com/in/toby-devlin'
}

export const customEventTypes = {
    blogSearch: "blogSearch",
    contactFormLoad: "contactFormLoad"
}

export const titleAnimation = 'fade-right';
export const titleAnimationDuration = 1000;

export const paraAnimation = 'fade-up';
export const paraAnimationDuration = 600;

export const blockAnimation = 'fade-up';
export const blockAnimationDuration = 1000;

const edgeColour = '#737373';
export const particlesOptions: ISourceOptions = {
    background: {
        size: "cover"
    },
    particles: {
        number: {
            value: 25,
            density: {
                enable: true,
                value_area: 150
            }
        },
        shape: {
            type: 'circle'
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: edgeColour,
            opacity: 0.4,
            width: 1
        },
        size: {
            value: 0
        },
        move: {
            enable: true,
            speed: 3,
            direction: 'none',
            random: true,
            out_mode: 'bounce',
            bounce: true
        }
    },
    interactivity: {
        detectsOn: 'window',
        events: {
            onhover: {
                enable: true,
                mode: 'bubble'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        },
        modes: {
            bubble: {
                distance: 455,
                color: edgeColour,
                size: 2,
                duration: 2,
                opacity: 0.5
            },
            push: {
                particles_nb: 6
            }
        }
    },
    retina_detect: true
};