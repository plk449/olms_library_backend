window.addEventListener('scroll', () => {
    if (window.scrollY >= 70) {
      nav.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
    }
    else{
      nav.style.backgroundColor = "transparent";
    }
  });