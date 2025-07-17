import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';

/**
 * Initializes the Swiper carousel for the `.swiper` element
 * with navigation arrows and clickable pagination.
 */
export function initCarousel() {
    new Swiper('.swiper', {
        modules: [Navigation, Pagination],
        loop: true,
        slidesPerView: 1,
        spaceBetween: 24,
        navigation: {
            nextEl: '.testimonials__arrow--next',
            prevEl: '.testimonials__arrow--prev',
        },
        pagination: {
            el: '.testimonials__pagination',
            bulletClass: 'testimonials__bullet',
            bulletActiveClass: 'testimonials__bullet--active',
            clickable: true,
        },
    });
}
