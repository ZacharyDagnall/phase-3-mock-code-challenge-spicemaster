// write your code here

const detail = document.querySelector('#spice-blend-detail')
const [image, title, ingredientsDiv] = detail.children
const ingredientsList = ingredientsDiv.querySelector('ul.ingredients-list')

function spotlightSpice(id) {
    fetch(`http://localhost:3000/spiceblends/${id}`)
        .then(r => r.json())
        .then(spice => {
            detail.dataset.id = id
            image.src = spice.image
            image.alt = spice.title
            title.textContent = spice.title
            ingredientsList.replaceChildren()
            fetch(`http://localhost:3000/ingredients`)
                .then(r => r.json())
                .then(ingredients => {
                    ingredients.forEach(function (ing) {
                        if (ing.spiceblendId == id) {       // == instead of === for now because id for newIng goes in as string. have to fix
                            let li = document.createElement('li')
                            ingredientsList.append(li)
                            li.textContent = ing.name
                        }
                    })
                })
        })
}

spotlightSpice(3)

function updateTitle(id, title) {
    fetch(`http://localhost:3000/spiceblends/${id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json', 'accept': 'aaplication/json' },
        body: JSON.stringify({ title })
    })
        .then(r => r.json())
        .then(updatedSpice => spotlightSpice(updatedSpice.id))
}

function addIngredient(id, name) {
    fetch(`http://localhost:3000/ingredients`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ spiceblendId: id, name })
    })
        .then(r => r.json())
        .then(newIngredient => {
            let li = document.createElement('li')
            ingredientsList.append(li)
            li.textContent = newIngredient.name
        })
}

document.addEventListener('submit', event => {
    event.preventDefault()
    if (event.target.matches('#update-form')) {
        updateTitle(detail.dataset.id, event.target[0].value)
    } else if (event.target.matches('#ingredient-form')) {
        addIngredient(detail.dataset.id, event.target[0].value)
    }
    event.target.reset()
})