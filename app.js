document.addEventListener("DOMContentLoaded", ()=>{
    fetchData();//se podria omitir pero es para asegurar que se cargue
})
const fetchData = async() => {
    try{
        const res = await fetch('api.json')
        const data = await res.json()
        
        pintarProductos(data)
        detectarBotones(data)
    }catch(error){
        console.log(error)
    }
}
const containerProductos = document.querySelector('#container-prods');
const pintarProductos = (data) =>{
    //creaar el contenido
    const template = document.querySelector('#template-prods').content;
    //creamos el fragment
    const fragment = document.createDocumentFragment();
   
    data.forEach(producto =>{
        template.querySelector('img').setAttribute('src', producto.img)
        template.querySelector('h5').textContent = producto.nombre;
        template.querySelector('p span').textContent = producto.precio;
        template.querySelector('button').dataset.id = producto.id;
        const clone = template.cloneNode(true)//lo clonamos
        fragment.appendChild(clone);//lo pegamos al fragment
    });
    containerProductos.appendChild(fragment)
}

let carrito = {} //en vez de un array, creamos un objeto

const detectarBotones = (data) =>{
    const botones = document.querySelectorAll('.card button');
    botones.forEach(btn =>{
        btn.addEventListener('click', ()=> {
            const producto = data.find(item =>
            item.id === parseInt(btn.dataset.id))   //doble igual xq uno es un string y otro entero 
            producto.cantidad = 1;//agrego el atributo al objeto
            if(carrito.hasOwnProperty(producto.id)){
            producto.cantidad = carrito[producto.id].cantidad + 1
        }
        carrito[producto.id] = {...producto}
        pintarCarrito()
        })
    })
}
const items = document.querySelector('#items')
const pintarCarrito = ()=>{
    
    items.innerHTML = ''
    const template = document.querySelector('#template-carrito').content
    const fragment = document.createDocumentFragment()
    Object.values(carrito).forEach(producto =>{//es para convrtirlo en string para poder usar el foreach
        template.querySelector('th').textContent = producto.id
        template.querySelectorAll('td')[0].textContent = producto.nombre
        template.querySelectorAll('td')[1].textContent = producto.cantidad
        template.querySelector('span').textContent = producto.precio * producto.cantidad

        //botones
        template.querySelector('.btn-info').dataset.id = producto.id
        template.querySelector('.btn-danger').dataset.id = producto.id

        const clone = template.cloneNode(true)
        fragment.appendChild(clone)

    })
    items.appendChild(fragment)
    pintarFooter()
    accionBotones()
}
const footer = document.querySelector('#footer-carrito')

const pintarFooter = () =>{
    footer.innerHTML = ''
    const template = document.querySelector('#template-footer').content
    const fragment = document.createDocumentFragment()

    const nCantidad = Object.values(carrito)
    .reduce((acc,{cantidad}) => acc + cantidad,0)
    
    const nPrecio = Object.values(carrito)
    .reduce((acc,{cantidad,precio}) => acc + cantidad * precio,0)
    

    template.querySelectorAll('td')[0].textContent = nCantidad
    template.querySelector('span').textContent  = nPrecio

    const clone = template.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const button = document.querySelector('#vaciar-carrito')
    button.addEventListener('click', ()=>{
        carrito = {}
        pintarCarrito()
        footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - empiece su compra</th>`;
    })
}

const accionBotones = () =>{
    const btnAgregar = document.querySelectorAll('#items .btn-info')
    const btnBorrar = document.querySelectorAll('#items .btn-danger')
    
    btnAgregar.forEach(btn =>{
        btn.addEventListener('click',()=>{
            producto = carrito[btn.dataset.id]
            producto.cantidad = producto.cantidad +1
            carrito[btn.dataset.id] = {...producto}
            console.log(producto.cantidad)
            pintarCarrito()
        })
    })
    btnBorrar.forEach(btn =>{
        btn.addEventListener('click',()=>{
            producto = carrito[btn.dataset.id]
            producto.cantidad = producto.cantidad -1
            if(producto.cantidad === 0)
            {
                delete carrito[btn.dataset.id]
            }else
            {
                carrito[btn.dataset.id] = {...producto}
                
            }
            
            pintarCarrito()
            
        })
    })



}
