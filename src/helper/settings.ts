import {ISourceOptions} from 'tsparticles';

export const titleAnimation = 'fade-right';
export const titleAnimationDuration = 1000;

export const paraAnimation = 'fade-up';
export const paraAnimationDuration = 600;

export const blockAnimation = 'fade-up';
export const blockAnimationDuration = 1000;

const edgeColour = '#737373';
const a = screen.width * screen.height;
const value = 0.00004 * a + 40;
export const particlesOptions: ISourceOptions = {
    backgroundMode: {enable: true},
    particles: {
        number: {
            value: value
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
                parallax: {
                    enable: true
                },
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
