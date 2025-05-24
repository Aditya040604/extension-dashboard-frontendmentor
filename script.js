const allBtns = document.querySelectorAll('.btns > *')
const container = document.querySelector('.layout__grid')
const toggleLightMode = document.querySelector('.header__btn')
const headerLogo = document.querySelector('.header__logo')
const toggleDark = document.querySelector('.toggle--dark')

let lightMode = true

toggleLightMode.addEventListener('click', () => {
    document.body.classList.toggle('light')
    if (lightMode){
        headerLogo.src = './assets/images/logo-lightmode.svg'
        toggleDark.src = './assets/images/icon-moon.svg'

    }else {
        headerLogo.src = './assets/images/logo.svg'
        toggleDark.src = './assets/images/icon-sun.svg'

    }
    lightMode = !lightMode

})


allBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
        allBtns.forEach(b => b.classList.remove('active'))
        btn.classList.add('active')
        const data = await fetchData()
        container.innerHTML = ""

        if (btn.classList.contains('btn--inactive')){
            const inactiveExt = data.filter(ext => !ext.isActive)
            inactiveExt.forEach(ext => {
                cardCreator(ext)
            })
        }
        else if(btn.classList.contains('btn--active')){
            const activeExt = data.filter(ext => ext.isActive)
            activeExt.forEach(ext => {
                cardCreator(ext)
            })
        }
        else if (btn.classList.contains('btn--all')){
            data.forEach(ext => {
                cardCreator(ext)
                  })
    
        }

    })
  
})


let cachedData = null
const fetchData = async () => {
    if (cachedData) return cachedData
    try{
        const response = await fetch('./data.json')
        const data = await response.json()
        cachedData = data
        return data
    }
    catch(err) {
        console.log("Error loading the data: ",err)
        return []
    }
}

const cardCreator = (ext) => {
    const card = document.createElement('div')
    const safeId = ext.name.replace(/\s+/g, '_').toLowerCase()
    card.classList.add('card')
    card.innerHTML = `
                    <div class="card__content">
            <img src="${ext.logo}" alt="${ext.name}" class="card__img">
            <div class="">
            <h2 class="heading__secondary">
                ${ext.name}
            </h2>
            <p>
                ${ext.description}
            </p>
            </div>
        </div>
        
        <div  class="extension__btns">
            <button class="btn--remove">Remove</button>
            <label for="${safeId}" class="switch">
          <input type="checkbox" id="${safeId}" class="toggle-switch">
          <span class="slider"></span>
        </label>
        </div> `
    container.appendChild(card)


    const checkbox = card.querySelector(`#${safeId}`)
    if (ext.isActive) checkbox.checked = true
    checkbox.addEventListener('change', () => {
        const target = cachedData.find(item => item.name === ext.name)
        if (target) target.isActive = checkbox.checked
    })

    const removeBtn = card.querySelector('.btn--remove')
    removeBtn.addEventListener('click', () => {
        const shouldDelete = confirm("Are you sure you want to remove this extension?")
        if (!shouldDelete) return
        card.remove()
        cachedData = cachedData.filter(item => item.name !== ext.name)
    } )
}

document.addEventListener('DOMContentLoaded', () => {
    allBtns[0]?.click()
})