const $logo = document.querySelectorAll('.logo')[0]
const $navBar = document.querySelectorAll('.nav-bar')[0]
window.addEventListener('scroll', toggleNavBar, false)
function toggleNavBar() {
    if (window.pageYOffset >= $logo.offsetHeight && $navBar.classList.contains('abs-pos')) {
        $navBar.classList.remove('abs-pos')
        $navBar.classList.add('fix-pos')
    }
    else if (window.pageYOffset < $logo.offsetHeight && $navBar.classList.contains('fix-pos')) {
        $navBar.classList.add('abs-pos')
        $navBar.classList.remove('fix-pos')
    }
}


const $extLink = document.querySelectorAll('.ext-link#insta')[0]
$extLink.addEventListener('click', openLink, false)
function openLink() {
    window.open('https://www.instagram.com/flangsan/', '_blank')
}

/*
const $intLink = document.querySelectorAll('.int-link')[2]
const $transparenciaSect = document.querySelector('#transparencia')
$intLink.addEventListener('click', scrollToSect, false)
function scrollToSect() {
    //window.scrollTo(0, $transparenciaSect.offsetTop - $navBar.offsetHeight)
    window.scrollTo({
        top: $transparenciaSect.offsetTop - $navBar.offsetHeight,
        left: 0,
        behavior: 'smooth'
    })
}
*/
const $intLink = document.querySelectorAll('.int-link')
const $sectArr = document.querySelectorAll('main section')
$intLink.forEach(function (cur, idx) {
    cur.addEventListener('click', function () {
        window.scrollTo({
            top: $sectArr[idx].offsetTop - $navBar.offsetHeight,
            left: 0,
            behavior: 'smooth'
        })
    }, false)
})