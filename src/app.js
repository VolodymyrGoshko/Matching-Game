import './style.css'
import {items} from "./data"

const wrapper = document.querySelector('.wrapper')
const mainBox = document.querySelector('.main-box')
const nav = document.querySelector('.nav')
const time = document.querySelector('.time')
const playerLivesCount = document.querySelector('.lives')
let interval = null
let playerLives = 6
playerLivesCount.textContent = playerLives

//Start Game
const startGameHandler = (event) => {
    const $btn = event.target
    if ($btn.dataset.btn) {
        $btn.style.animation = 'none'
        $btn.classList.add('active')
        setTimeout(() => {
            $btn.classList.remove('active')
            $btn.style.display = 'none'
            startGame()
        }, 500)
    }
}

// Create Modal and working
const createModal = (timer) => {
    const modal = document.createElement('div')
    modal.classList.add('modal-overlay')
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-title">Congratulations you're a winner 🎉</div>
            <div class="modal-lives">You spent <span class="modal-count">${6 - playerLives}</span> lives ❤️</div>
            <div class="modal-time">You time: ${timer}</div>
            <div class="modal-btn">Play Again</div>
        </div>
    `

    // modal btn
    const modalBtn = modal.querySelector('.modal-btn')
    modalBtn.addEventListener('click', () => {
        const $el = modal.querySelector('.modal')
        $el.classList.add('active')
        setTimeout(() => {
            modal.classList.remove('active')
            document.body.removeChild(modal)
            restart()
        }, 1200)
    })

    setTimeout(() => {
        document.body.appendChild(modal)
    }, 2000)
}

const startGameBtn = document.querySelector('.start-game')
startGameBtn.addEventListener('click', startGameHandler)

// Generate the data and randomize
const randomize = () => {
    const cardData = items()
    return cardData.sort(() => Math.random() - 0.5)
}

//Card Generate Function
const startGame = () => {
    mainBox.style.display = 'flex'
    nav.style.display = 'flex'

    const cardData = randomize()
    cardData.forEach(item => {
        const card = document.createElement('div')
        const face = document.createElement('ion-icon')
        const back = document.createElement('div')
        card.classList.add('wrapper-item')
        card.style.backgroundColor = item.color
        face.className = 'face'
        back.className = 'back'
        //Attach the info to the cards
        face.setAttribute('name', item.name)
        card.setAttribute('name', item.name)
        //Attach the cards to the section
        wrapper.appendChild(card)
        card.appendChild(face)
        card.appendChild(back)

        card.addEventListener('click', event => {
            card.classList.toggle('toggleCard')
            checkCards(event)
        })
    })

    // Start timer
    startTimer()
}

function startTimer() {
    let second = 0
    let minute = 0
    interval = setInterval(() => {
        time.innerHTML = `0${minute}:0${second}`
        second++
        if (second >= 10) {
            time.innerHTML = `0${minute}:${second}`
        }
        if (second >= 59) {
            minute++
            second = 0
        }
    }, 1000)
}

//Check Cards
const checkCards = (event) => {
    const clickedCards = event.target
    clickedCards.classList.add('flipped')
    const flippedCards = document.querySelectorAll('.flipped')
    const toggleCards = document.querySelectorAll('.toggleCard')
    const cards = document.querySelectorAll('.wrapper-item')
    // Logic
    if (flippedCards.length === 2) {
        if (flippedCards[0].getAttribute('name') === flippedCards[1].getAttribute('name')) {
            flippedCards.forEach(card => {
                card.classList.remove('flipped')
                setTimeout(() => {
                    card.style.backgroundColor = '#01C6B2'
                }, 1000)
                card.style.pointerEvents = 'none'
            })
        } else {
            flippedCards.forEach(card => {
                card.classList.remove('flipped')
                cards.forEach(item => {
                    item.style.pointerEvents = 'none'
                setTimeout(() => {
                    card.classList.add('red')
                }, 1000)
                setTimeout(() => {
                    card.classList.remove('toggleCard')
                    card.classList.remove('red')
                    item.style.pointerEvents = 'all'
                }, 2000)
                })
            })
            playerLives--
            playerLivesCount.textContent = playerLives
            if (playerLives === 0) {
                restart()
            }
        }
    }

    // Run a check to see if we won game
    if (toggleCards.length === 16) {
        clearInterval(interval)
        const timerResult = time.textContent
        createModal(timerResult)
    }
}

// Restart
const restart = () => {
    const cardData = randomize()
    const face = document.querySelectorAll('.face')
    const cards = document.querySelectorAll('.wrapper-item')
    cardData.forEach((card, index) => {
        setTimeout(() => {
            cards[index].classList.remove('toggleCard')
            face[index].setAttribute('name', card.name)
            cards[index].setAttribute('name', card.name)
            cards[index].style.backgroundColor = card.color
            cards[index].style.pointerEvents = 'all'
        }, 300)
    })
    playerLives = 6
    playerLivesCount.textContent = playerLives
    clearInterval(interval)
    startTimer()
}

const btnRestart = document.querySelector('.btn-reload')
btnRestart.addEventListener('click', restart)
