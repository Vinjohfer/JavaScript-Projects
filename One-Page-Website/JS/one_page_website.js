// Open the Modal
function openModal() {
document.getElementById("myModal").style.display = "block";
}

// Close the Modal
function closeModal() {
document.getElementById("myModal").style.display = "none";
}

let slideIndex = 1;

// Next/Previous Controls
function plusSlides(n) {
showSlides(slideIndex += n);
}

// Thumbnail Image Controls
function currentSlide(n) {
showSlides(slideIndex = n);
}

// Show Slides
function showSlides(n) {

let i;

let slides = document.getElementsByClassName("mySlides");
let dots = document.getElementsByClassName("demo");
let captionText = document.getElementById("caption");

if (!slides.length) {
    return;
}

if (n > slides.length) {
    slideIndex = 1;
}

if (n < 1) {
    slideIndex = slides.length;
}

// Hide all slides
for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
}

// Remove active class from thumbnails
for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
}

// Show current slide
slides[slideIndex - 1].style.display = "block";

// Activate current thumbnail
if (dots[slideIndex - 1]) {

    dots[slideIndex - 1].className += " active";

    if (captionText) {
        captionText.innerHTML = dots[slideIndex - 1].alt;
    }
}

}

// Display first slide when page loads
showSlides(slideIndex);