const container = document.querySelector('.container')
const colours = ['#e74c3c', '#8e44ad', '#3498db', '#e67e22', '#2ecc71']
const squares = 5000
for(let i = 0; i<squares;i++){
    const square = document.createElement("div")
    square.classList.add('square')
    container.append(square)
    square.addEventListener('mouseover', function(){
        const colour = colours[Math.floor(Math.random()*colours.length)]
        square.style.backgroundColor = colour
        square.style.boxShadow = `0 0 2px ${colour} , 0 0 10px ${colour}`
    })
    square.addEventListener('mouseout', function(){
        square.style.backgroundColor = '#141414'
        square.style.boxShadow = '0 0 2px #000000'
    })
}