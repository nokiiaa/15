'use strict';

var permutation = []
var squares = []

window.addEventListener('load', () => {
    var grid = document.createElement('div')
    grid.className = 'grid'
    
    for (;;) {
        permutation = []
        
        for (var i = 0; i <= 15; i++) permutation.push(i)
        for (var i = 0; i < 16; i++) {
            var s = i + Math.floor((15 - i) * Math.random())
            var tmp = permutation[s]
            permutation[s] = permutation[i]
            permutation[i] = tmp
        }
        
        var empty_index = permutation.indexOf(0)
        var manhattan_parity = (6 - empty_index % 4 - Math.floor(empty_index / 4)) % 2
        var permutation_parity = 0
        
        for (var i = 0; i < 16; i++)
        for (var j = i + 1; j < 16; j++)
            if (permutation[i] > permutation[j])
                permutation_parity ^= 1
        
        if (permutation_parity != manhattan_parity)
            break;
    }

    let mouseDown = event => {
        event.stopPropagation()
        
        let boardRect = grid.getBoundingClientRect()
        let X = (event.clientX || event.touches[0].pageX) - boardRect.left
        let Y = (event.clientY || event.touches[0].pageY) - boardRect.top
        let x = Math.floor(4 / boardRect.width * X)
        let y = Math.floor(4 / boardRect.height * Y)
            
        let i = x + y * 4
        
        // Проверяем, есть ли сосед - пустая клетка (то есть, с цифрой 0)
        if (i % 4 > 0 && permutation[i - 1] == 0 ||
            i % 4 < 3 && permutation[i + 1] == 0 ||
            i >= 4    && permutation[i - 4] == 0 ||
            i < 12    && permutation[i + 4] == 0) {
            let clickedSquare = squares[i]
            clickedSquare.classList.add('highlight')
            setTimeout(x => clickedSquare.classList.remove('highlight'), 200)
            
            let empty = permutation.indexOf(0)
            let tmp = squares[empty]

            squares[empty].style.gridColumn = '' + (x + 1)
            squares[empty].style.gridRow = '' + (y + 1)
            squares[i].style.gridColumn = '' + (empty % 4 + 1)
            squares[i].style.gridRow = '' + (Math.floor(empty / 4) + 1)
            permutation[empty] = permutation[i]
            permutation[i] = 0
            squares[empty] = squares[i]
            squares[i] = tmp
        }
    }
    
    for (var y = 0; y < 4; y++) {
        for (var x = 0; x < 4; x++) {
            var square = document.createElement('div')
            var n = permutation[x + y * 4]
            square.className = n ? 'square' : 'empty-square'
            square.style.gridRow = '' + (y + 1)
            square.style.gridColumn = '' + (x + 1)
            square.innerHTML = '<span>' + n.toString() + '</span>'
            squares.push(square)
            grid.appendChild(square)
        }
    }
        
    grid.addEventListener('mousedown', mouseDown)
    grid.addEventListener('touchstart', mouseDown)
        
    document.body.appendChild(grid)
});