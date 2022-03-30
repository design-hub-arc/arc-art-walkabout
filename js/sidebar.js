const sidebar = document.getElementById('sidebar')
const closeBtn = document.getElementById('closeBtn')
const openBtn = document.getElementById('openBtn')
const details = document.getElementById('details')
const arrow = document.querySelector('.arrow')
const detailsBtn = document.querySelector('input[type="button"]')


function openMobileNav() {
  sidebar.style.width = "250px";

}

function closeMobileNav() {
  sidebar.style.width = '0'
}

const toggleDetails = () => {
  if(details.className.includes('no-display')) {
    details.classList.remove('no-display')
    details.classList.add('display')
    arrow.style.width = '2em'
    arrow.style.top = '0'
    arrow.style.left = '-30%'

  } else if(details.className.includes('display')) {
    details.classList.remove('display')
    details.classList.add('no-display')
    arrow.style.width = '5em'
    arrow.style.top = '-100%'
    arrow.style.left = '-60%'
    detailsBtn.style.backgroundColor = '#fff'
    detailsBtn.style.color = '#111'

  }
}

openBtn.addEventListener('click', openMobileNav)
closeBtn.addEventListener('click', closeMobileNav)
detailsBtn.addEventListener('click', toggleDetails)