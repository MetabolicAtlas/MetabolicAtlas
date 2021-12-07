export default function mobileScrollToTop() {
    // This is the same as the $tablet (scss variable) width
    if (window.innerWidth < 660) {
        window.scrollTo(0, 0)
    }
}
